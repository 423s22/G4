import DatabaseConnection from "./DatabaseConnection";
import Product from "./Product";

export default class VariationGroup {

    /**
     * 
     * @param {number} id 
     * @param {Product} product 
     * @param {string} name 
     * @param {DatabaseConnection} dbConn 
     */
    constructor(id, product, name, dbConn) {
        this._id = id;
        this._product = product;
        this._name = name;
        this._dbConn = dbConn;
        this._variations = [];
    }

    getID() {
        return this._id;
    }

    getProduct() {
        return this._product;
    }

    getName() {
        return this._name;
    }

    setName(newName) {
        this._name = newName;
    }

    getVariations() {
        return this._variations;
    }

    async addVariation() {
        let newVariation = await this._dbConn.createNewVariation(this);
        this._variations.push(newVariation);
        return newVariation;
    }

}