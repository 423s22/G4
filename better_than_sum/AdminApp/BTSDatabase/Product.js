import DatabaseConnection from "./DatabaseConnection";
import VariationGroup from "./VariationGroup";

export default class Product {

    /**
     * 
     * @param {number} id 
     * @param {number} baseCost 
     * @param {string} name 
     * @param {DatabaseConnection} dbConn 
     */
    constructor(id, baseCost, name, dbConn) {
        this._id = id;
        this._baseCost = baseCost;
        this._name = name;
        this._dbConn = dbConn;
        this._variationGroups = [];
        this._saved = true;
    }

    async save() {
        await this._dbConn.saveProduct(this);
        this._saved = true;
    }

    isSaved() {
        return this._saved;
    }

    markUnsaved() {
        this._saved = false;
    }

    async refresh() {
        this._variationGroups = [];
        await this._dbConn.reloadProduct(this);
    }

    getID() {
        return this._id;
    }

    getBaseCost() {
        return this._baseCost;
    }

    setBaseCost(newCost) {
        this._baseCost = newCost;
        this._saved = false;
    }

    getName() {
        return this._name;
    }

    setName(newName) {
        this._name = newName;
        this._saved = false;
    }

    /**
     * 
     * @returns {VariationGroup[]}
     */
    getVariationGroups() {
        return this._variationGroups;
    }

    /**
     * 
     * @param {number} groupID 
     * @returns {VariationGroup}
     */
    getVariationGroupByID(groupID) {
        for (let i = 0; i < this._variationGroups.length; i++) {
            if (this._variationGroups[i].getID() == groupID) {
                return this._variationGroups[i];
            }
        }
        return null;
    }

    /**
     * 
     * @param {number} variationID 
     */
    getVariationByID(variationID) {
        for (let i = 0; i < this._variationGroups.length; i++) {
            let curGroupVars = this._variationGroups[i].getVariations();
            for (let j = 0; j < curGroupVars.length; j++) {
                if (curGroupVars[j].getID() == variationID) {
                    return curGroupVars[j];
                }
            }
        }
        return null;
    }

    async addVariationGroup() {
        let newGroup = await this._dbConn.createNewVariationGroup(this);
        this._variationGroups.push(newGroup);
        return newGroup;
    }

    loadVariationGroup(group) {
        this._variationGroups.push(group);
    }

    async deleteVariationGroup(groupID) {

    }

}