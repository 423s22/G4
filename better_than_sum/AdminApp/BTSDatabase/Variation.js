import DatabaseConnection from "./DatabaseConnection";
import VariationGroup from "./VariationGroup";

export default class Variation {

    /**
     * Creates a new in-memory variation. This method is to be used by DatabaseConnection
     * @param {number} id the database id of the variation
     * @param {VariationGroup} variationGroup the group the variation belongs to
     * @param {number} addedCost the added cost of the variation, in cents
     * @param {string} name the name of the variation
     * @param {DatabaseConnection} dbConn a connection to the BTS API
     */
    constructor(id, variationGroup, addedCost, name, dbConn) {
        this._id = id;
        this._variationGroup = variationGroup;
        this._addedCost = addedCost;
        this._name = name;
        this._dbConn = dbConn;
        this._blockers = [];
    }

    /**
     * 
     * @returns the id of the variation
     */
    getID() {
        return this._id;
    }

    /**
     * 
     * @returns the group the variation blongs to
     */
    getGroup() {
        return this._variationGroup;
    }

    /**
     * 
     * @returns the cost, in cents, the variation adds to the product
     */
    getAddedCost() {
        return this._addedCost;
    }

    /**
     * Updates the added cost the variation will add to the product whenever it is selected
     * @param {number} newCost the added cost, in cents
     */
    setAddedCost(newCost) {
        this._addedCost = newCost;
        this._variationGroup._product.markUnsaved();
    }

    /**
     * 
     * @returns the name of the variation
     */
    getName() {
        return this._name;
    }

    /**
     * Updates the name of the variation
     * @param {string} newName the new name
     */
    setName(newName) {
        this._name = newName;
        this._variationGroup._product.markUnsaved();
    }

    /**
     * Gets a list of blockers that prevent the selection of the variation
     * @returns {Variation[]} the list of blockers
     */
    getBlockers() {
        return this._blockers;
    }

    /**
     * Creates a new blocker between this variation, and the provided one
     * @param {Variation} variation the variation to create a blocker with
     */
    async addBlocker(variation) {
        if (!this._blockers.includes(variation)) {
            await this._dbConn.createNewBlocker(this, variation);
            this._blockers.push(variation);
            variation._blockers.push(this);
        }
    }

    /**
     * Loads a blocker associated with the variation
     * @param {Variation} variation the variation to load a blocker with
     */
    loadBlocker(variation) {
        if (!this._blockers.includes(variation)) {
            this._blockers.push(variation);
            variation._blockers.push(this);
        }
    }

    /**
     * Removes a blocker from the variation and database
     * @param {Variation} variation the other variation in the blocker
     */
    async deleteBlocker(variation) {
        let index = this._blockers.indexOf(variation);
        if (index != -1) {
            // Remove from both arrays
            this._blockers.splice(index, 1);

            let indexOther = variation._blockers.indexOf(this);
            if (indexOther != -1) {
                variation._blockers.splice(indexOther, 1);
            }

            // Remove from database
            await this._dbConn.deleteBlocker(this, variation);
        }
    }

}