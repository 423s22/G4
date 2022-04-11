import Product from "./Product";
import Variation from "./Variation";
import VariationGroup from "./VariationGroup";

export default class DatabaseConnection {

    constructor(baseURL = null) {
        if (baseURL == null)
            this._baseURL = new URL(window.location.href);
        else
            this._baseURL = new URL(baseURL);

        this._baseURL.pathname += "database/";
    }

    /**
     * Retrieves all the products owned by a user
     * @param {number} userID the ID of the user
     * @returns an array of Products
     */
    async getUserProducts(userID) {

        let responseJSON = await this._executeGetRequest("userProducts", { "userID": userID });
        let products = [];
        for (let i = 0; i < responseJSON.length; i++) {
            let id = responseJSON[i]["productID"];
            let baseCost = responseJSON[i]["baseCost"];
            let name = responseJSON[i]["name"];
            products.push(new Product(id, baseCost, name, this));
        }

        // TODO: Add loading variation stuff for each product
        for (let i = 0; i < products.length; i++) {
            this._getProductVariationGroups(products[i]);
        }
        return products;
    }

    /**
     * 
     * @param {Product} product 
     */
    async _getProductVariationGroups(product) {

        this._executeGetRequest("productVariationGroups", { "productID": product.getID() }).then(
            (result) => {
                console.log(result);
            }
        );

    }

    /**
     * Creates a new empty product
     * @param {number} userID the ID of the user
     * @returns the created Product
     */
    async createNewProduct(userID) {

        let productID = (await this._executePostRequest({
            "operation": "product",
            "baseCost": 0,
            "name": "",
            "owningUser": userID
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