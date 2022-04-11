import Product from "./Product";
import Variation from "./Variation";
import VariationGroup from "./VariationGroup";

export default class DatabaseConnection {

    constructor(baseURL = null, userID) {
        if (baseURL == null)
            this._baseURL = new URL(window.location.href);
        else
            this._baseURL = new URL(baseURL);

        this._baseURL.pathname += "database/";
        this._userID = userID;
    }

    /**
     * Retrieves all the products owned by a user
     * @returns an array of Products
     */
    async getUserProducts() {

        let responseJSON = await this._executeGetRequest("userProducts", { "userID": this._userID });
        let products = [];
        for (let i = 0; i < responseJSON.length; i++) {
            let id = responseJSON[i]["productID"];
            let baseCost = responseJSON[i]["baseCost"];
            let name = responseJSON[i]["name"];
            products.push(new Product(id, baseCost, name, this));
        }

        for (let i = 0; i < products.length; i++) {
            this._generateVariationGroups(products[i]).then(() => {
                this._generateVariations(products[i]).then(() => {
                    this._generateBlockers(products[i]);
                });
            });
        }
        return products;
    }

    /**
     * Reloads a product. This should not be called directly, but is called via Product::refresh
     * @param {Product} product 
     */
    async reloadProduct(product) {

        let responseJSON = await this._executeGetRequest("product", { "productID": product.getID() });

        product.setBaseCost(responseJSON["baseCost"]);
        product.setName(responseJSON["name"]);

        await this._generateVariationGroups(product);
        await this._generateVariations(product);
        await this._generateBlockers(product);

    }

    /**
     * 
     * @param {Product} product 
     */
    async _generateVariationGroups(product) {

        let groups = await this._executeGetRequest("productVariationGroups", { "productID": product.getID() });

        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            product.loadVariationGroup(new VariationGroup(group.groupID, product, group.name, this));
        }
    }

    /**
     * 
     * @param {Product} product 
     */
    async _generateVariations(product) {
        let variations = await this._executeGetRequest("productVariations", { "productID": product.getID() });

        for (let i = 0; i < variations.length; i++) {
            let variation = variations[i];
            let varGroup = product.getVariationGroupByID(variation.owningGroup);
            varGroup.loadVariation(
                new Variation(
                    variation.variationID,
                    varGroup,
                    variation.addedCost,
                    variation.name,
                    this
                )
            );
        }
    }

    /**
     *      
     * @param {Product} product 
     */
    async _generateBlockers(product) {

        for (let i = 0; i < product.getVariationGroups().length; i++) {
            let curGroup = product.getVariationGroups()[i];
            for (let j = 0; j < curGroup.getVariations().length; j++) {
                let curVariation = curGroup.getVariations()[j];
                this._executeGetRequest("variationBlockers", { "variationID": curVariation.getID() }).then((result) => {
                    for (let k = 0; k < result.length; k++) {
                        let curBlocker = product.getVariationByID(result[k]["exclude"]);
                        if (curBlocker != null) {
                            curVariation.loadBlocker(curBlocker);
                        }
                    }
                });
            }
        }
    }

    /**
     * Creates a new empty product
     * @returns the created Product
     */
    async createNewProduct() {

        let productID = (await this._executePostRequest({
            "operation": "product",
            "baseCost": 0,
            "name": "",
            "owningUser": this._userID
        }))["insertedID"];

        return new Product(productID, 0, "", this);
    }

    /**
     * Creates a new empty variation group
     * @param {Product} product the product that owns the group
     * @returns the created VariationGroup
     */
    async createNewVariationGroup(product) {

        let groupID = (await this._executePostRequest({
            "operation": "variationGroup",
            "name": "",
            "owningProduct": product.getID()
        }))["insertedID"];

        return new VariationGroup(groupID, product, "", this);
    }

    /**
     * Creates a new empty variation
     * @param {VariationGroup} variationGroup the group that owns the variation
     * @returns the new Variation
     */
    async createNewVariation(variationGroup) {

        let variationID = (await this._executePostRequest({
            "operation": "variation",
            "name": "",
            "addedCost": 0,
            "owningGroup": variationGroup.getID()
        }))["insertedID"];

        return new Variation(variationID, variationGroup, 0, "", this);
    }

    /**
     * Adds a new variation blocker between A and B
     * @param {Variation} variationA 
     * @param {Variation} variationB 
     */
    async createNewBlocker(variationA, variationB) {

        await this._executePostRequest({
            "operation": "variationBlocker",
            "blockerAID": variationA.getID(),
            "blockerBID": variationB.getID()
        });

    }

    /**
     * Saves an existing product to the database.
     * Should not be called directly, but via Product::save
     * @param {Product} product 
     */
    async saveProduct(product) {

        let promises = [];

        if (!product.isSaved()) {
            promises.push(this._executePostRequest({
                "operation": "product",
                "productID": product.getID(),
                "baseCost": product.getBaseCost(),
                "name": product.getName(),
                "owningUser": this._userID
            }));

            let varGroups = product.getVariationGroups();
            for (let i = 0; i < varGroups.length; i++) {
                let curGroup = varGroups[i];

                promises.push(this._executePostRequest({
                    "operation": "variationGroup",
                    "groupID": curGroup.getID(),
                    "name": curGroup.getName(),
                    "owningProduct": product.getID()
                }));

                let variations = curGroup.getVariations();

                for (let j = 0; j < variations.length; j++) {
                    let curVariation = variations[j];

                    promises.push(this._executePostRequest({
                        "operation": "variation",
                        "variationID": curVariation.getID(),
                        "name": curVariation.getName(),
                        "addedCost": curVariation.getAddedCost(),
                        "owningGroup": curGroup.getID()
                    }));
                }

            }

        }
        await Promise.all(promises);
    }

    /**
     * Executes a GET request to the BTS API with the given request type and data
     * @param {string} request the request type
     * @param {JSON} data the data used to fill in the remaining query parameters
     * @returns the JSON data of the response
     */
    async _executeGetRequest(request, data = {}) {
        let url = new URL(this._baseURL);
        url.searchParams.append("request", request);
        for (const key in data) {
            url.searchParams.append(key, data[key]);
        }

        let promise = new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if (req.readyState == 4) {

                    resolve(JSON.parse(req.responseText));
                }
            };

            req.open("GET", url.toString());
            req.send();
        });

        return promise;
    }

    /**
     * Executes a POST request to the BTS API with the given data
     * @param {JSON} data the data sent to the API
     * @returns the JSON data of the response
     */
    async _executePostRequest(data) {
        let url = new URL(this._baseURL);
        let req = new XMLHttpRequest();
        req.open("POST", url.toString());
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify(data));

        let promise = new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.setRequestHeader("Content-Type", "application/json");
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    resolve(JSON.parse(req.responseText));
                }
            };
            req.open("POST", url.toString());
            req.send(JSON.stringify(data));
        });

        return promise;
    }

}