import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion, DataType } from "@shopify/shopify-api";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import next from "next";
import Router from "koa-router";
import DatabaseConnection from "./dbAPI/DatabaseConnection";


dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
    dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    SCOPES: process.env.SCOPES.split(","),
    HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
    API_VERSION: ApiVersion.October20,
    IS_EMBEDDED_APP: true,
    // This should be replaced with your preferred storage strategy
    SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
    path: "/webhooks",
    webhookHandler: async(topic, shop, body) =>
        delete ACTIVE_SHOPIFY_SHOPS[shop],
});

app.prepare().then(async() => {
    const server = new Koa();
    server.use(bodyParser());
    const router = new Router();
    server.keys = [Shopify.Context.API_SECRET_KEY];
    server.use(
        createShopifyAuth({
            async afterAuth(ctx) {
                // Access token and shop available in ctx.state.shopify
                const { shop, accessToken, scope } = ctx.state.shopify;
                const host = ctx.query.host;
                ACTIVE_SHOPIFY_SHOPS[shop] = scope;

                const responses = await Shopify.Webhooks.Registry.register({
                    shop,
                    accessToken,
                    path: "/webhooks",
                    topic: "APP_UNINSTALLED",
                });

                if (!responses["APP_UNINSTALLED"].success) {
                    console.log(
                        `Failed to register APP_UNINSTALLED webhook: ${responses.result}`
                    );
                }

                // Set the shop api url metafield to allow storefront to access the api
                const restClient = new Shopify.Clients.Rest(shop, accessToken);
                restClient.post({
                    path: "metafields",
                    data: {
                        "metafield": {
                            "namespace": "better_than_sum",
                            "key": "apiUrl",
                            "value": ctx.URL.host,
                            "type": "single_line_text_field"
                        }
                    },
                    type: DataType.JSON
                });

                // Expose the metafield to the storefront
                const graphQLClient = new Shopify.Clients.Graphql(shop, accessToken);
                const exposeQuery = `
                mutation {
                    metafieldStorefrontVisibilityCreate(
                        input: {
                            namespace: "better_than_sum"
                            key: "apiUrl"
                            ownerType: SHOP
                        }
                    ) {
                        metafieldStorefrontVisibility {
                            id
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }`;

                // Redirect to app with shop parameter upon auth
                ctx.redirect(`/?shop=${shop}&host=${host}`);
            },
        })
    );

    const handleRequest = async(ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
    };

    router.post("/webhooks", async(ctx) => {
        try {
            await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
            console.log(`Webhook processed, returned status code 200`);
        } catch (error) {
            console.log(`Failed to process webhook: ${error}`);
        }
    });

    router.post(
        "/graphql",
        verifyRequest({ returnHeader: true }),
        async(ctx, next) => {
            await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
        }
    );

    router.get("(/_next/static/.*)", handleRequest); // Static content is clear
    router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear

    let dbConn = new DatabaseConnection(
        "localhost",
        process.env.MYSQL_USER,
        process.env.MYSQL_PASS,
        "G4db"
    );

    dbConn.connect();

    router.get("/database/", async(ctx) => {
        // Handle get request from database
        await dbConn.handleGetRequest(ctx);
    });

    router.post("/database/", async(ctx) => {
        await dbConn.handlePostRequest(ctx);
    });

    router.delete("/database/", async(ctx) => {
        await dbConn.handleDeleteRequest(ctx);
    });

    router.get("(.*)", async(ctx) => {
        const shop = ctx.query.shop;

        // This shop hasn't been seen yet, go through OAuth to create a session
        if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
            ctx.redirect(`/auth?shop=${shop}`);
        } else {
            await handleRequest(ctx);
        }
    });

    server.use(router.allowedMethods());
    server.use(router.routes());
    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});