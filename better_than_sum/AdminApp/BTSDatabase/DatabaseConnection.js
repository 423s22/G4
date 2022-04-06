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

        let url = new URL(this._baseURL);
        url.searchParams.append("request", "userProducts");
        url.searchParams.append("userID", userID);

        let req = new XMLHttpRequest();
        req.open("GET", url.toString(), false);
        req.send();

        let responseJSON = JSON.parse(req.responseText);
        let products = [];
        for (let i = 0; i < responseJSON.length; i++) {
            let id = responseJSON[i]["productID"];
            let baseCost = responseJSON[i]["baseCost"];
            let name = responseJSON[i]["name"];
            products.push(new Product(id, baseCost, name, this));
        }

        // TODO: Add loading variation stuff for each product
        return products;
    }

    /**
     * Creates a new empty product
     * @param {number} userID the ID of the user
     * @returns the created Product
     */
    async createNewProduct(userID) {

        let url = new URL(this._baseURL);

        let req = new XMLHttpRequest();
        req.open("POST", url.toString(), false);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({
            "operation": "product",
            "baseCost": 0,
            "name": "",
            "owningUser": userID
        }));

        let productID = JSON.parse(req.responseText)["insertedID"];
        return new Product(productID, 0, "", this);

    }

    /**
     * Creates a new empty variation group
     * @param {Product} product the product that owns the group
     * @returns the created VariationGroup
     */
    async createNewVariationGroup(product) {
        let url = new URL(this._baseURL);

        let req = new XMLHttpRequest();
        req.open("POST", url.toString(), false);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({
            "operation": "variationGroup",
            "name": "",
            "owningProduct": product.getID()
        }));

        let groupID = JSON.parse(req.responseText)["insertedID"];
        return new VariationGroup(groupID, product, "", this);
    }

    /**
     * Creates a new empty variation
     * @param {VariationGroup} variationGroup the group that owns the variation
     * @returns the new Variation
     */
    async createNewVariation(variationGroup) {
        let url = new URL(this._baseURL);

        let req = new XMLHttpRequest();
        req.open("POST", url.toString(), false);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({
            "operation": "variation",
            "name": "",
            "addedCost": 0,
            "owningGroup": variationGroup.getID()
        }));

        let variationID = JSON.parse(req.responseText)["insertedID"];
        return new Variation(variationID, variationGroup, 0, "", this);
    }

    /**
     * Adds a new variation blocker between A and B
     * @param {Variation} variationA 
     * @param {Variation} variationB 
     */
    async createNewBlocker(variationA, variationB) {
        let url = new URL(this._baseURL);

        let req = new XMLHttpRequest();
        req.open("POST", url.toString(), false);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({
            "operation": "variationBlocker",
            "blockerAID": variationA.getID(),
            "blockerBID": variationB.getID()
        }));
    }

}