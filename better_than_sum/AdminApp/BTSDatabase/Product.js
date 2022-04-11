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
    }

    // TODO: Save product to database. Optimistic concurrency?
    // Should save the product and all variation stuff
    saveProduct() {

    }

    // TODO: Reload product from database
    refresh() {

    }

    getID() {
        return this._id;
    }

    getBaseCost() {
        return this._baseCost;
    }

    setBaseCost(newCost) {
        this._baseCost = newCost;
    }

    getName() {
        return this._name;
    }

    setName(newName) {
        this._name = newName;
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

    async addVariationGroup() {
        let newGroup = await this._dbConn.createNewVariationGroup(this);
        this._variationGroups.push(newGroup);
        return newGroup;
    }

    loadVariationGroup(group) {
        this._variationGroups.push(group);
    }

}