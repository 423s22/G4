import DatabaseConnection from "./DatabaseConnection";
import Product from "./Product";
import Variation from "./Variation";

export default class VariationGroup {

    /**
     * Creates a new in-memory variation group. This method is to be used by DatabaseConnection
     * @param {number} id the database id of the variation group
     * @param {Product} product the product the group belongs to
     * @param {string} name the name of the group
     * @param {DatabaseConnection} dbConn a connection to the BTS API
     */
    constructor(id, product, name, dbConn) {
        this._id = id;
        this._product = product;
        this._name = name;
        this._dbConn = dbConn;
        this._variations = [];
    }

    /**
     * 
     * @returns the id of the group
     */
    getID() {
        return this._id;
    }

    /**
     * 
     * @returns the product the group belongs to
     */
    getProduct() {
        return this._product;
    }

    /**
     * 
     * @returns the name of the group
     */
    getName() {
        return this._name;
    }

    /**
     * Updates the name of the group
     * @param {string} newName the new name
     */
    setName(newName) {
        this._name = newName;
        this._product.markUnsaved();
    }

    /**
     * Gets a list of all the variations that belong to the group
     * @returns {Variation[]} the list of variations
     */
    getVariations() {
        return this._variations;
    }

    /**
     * Creates a new empty variation belonging to this group
     * @returns {Variation} the newly created variation
     */
    async addVariation() {
        let newVariation = await this._dbConn.createNewVariation(this);
        this._variations.push(newVariation);
        return newVariation;
    }

    /**
     * Loads a new variation that belongs to this group
     * @param {Variation} variation the variation to load
     */
    loadVariation(variation) {
        this._variations.push(variation);
    }

    /** 
     * Removes a variation from the group and database
     * @param {number} variationID the id of the variation to remove
     */
    async deleteVariation(variationID) {
        // TODO: Implement
    }

}