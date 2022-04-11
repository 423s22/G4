import DatabaseConnection from "./DatabaseConnection";
import VariationGroup from "./VariationGroup";

export default class Variation {

    /**
     * 
     * @param {number} id 
     * @param {VariationGroup} variationGroup 
     * @param {number} addedCost 
     * @param {string} name 
     * @param {DatabaseConnection} dbConn 
     */
    constructor(id, variationGroup, addedCost, name, dbConn) {
        this._id = id;
        this._variationGroup = variationGroup;
        this._addedCost = addedCost;
        this._name = name;
        this._dbConn = dbConn;
        this._blockers = [];
    }

    getID() {
        return this._id;
    }

    getGroup() {
        return this._variationGroup;
    }

    getAddedCost() {
        return this._addedCost;
    }

    setAddedCost(newCost) {
        this._addedCost = newCost;
    }

    getName() {
        return this._name;
    }

    setName(newName) {
        this._name = newName;
    }

    getBlockers() {
        return this._blockers;
    }

    async addBlocker(variation) {
        if (!this._blockers.includes(variation)) {
            await this._dbConn.createNewBlocker(this, variation);
            this._blockers.push(variation);
            variation._blockers.push(this);
        }
    }

    /**
     * 
     * @param {Variation} variation 
     */
    loadBlocker(variation) {
        if (!this._blockers.includes(variation)) {
            this._blockers.push(variation);
            variation._blockers.push(this);
        }
    }

}