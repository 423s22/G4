import DatabaseConnection from "./DatabaseConnection";
import Variation from "./Variation";
import VariationGroup from "./VariationGroup";

export default class Product {
	/**
	 * Creates a new in-memory product. This method is to be used by DatabaseConnection
	 * @param {number} id the database id of the product
	 * @param {JSON} shopifyProduct the shopify product to base this on
	 * @param {DatabaseConnection} dbConn a connection to the BTS API
	 */
	constructor(id, shopifyProduct, dbConn) {
		this._id = id;
		this._shopifyProduct = shopifyProduct;
		this._dbConn = dbConn;
		this._variationGroups = [];
		this._saved = true;
	}

	/**
	 * Saves the product to the database
	 * @returns a promise that completes once saving is done
	 */
	async save() {
		await this._dbConn.saveProduct(this);
		this._saved = true;
	}

	/**
	 * Determines if the product has been saved to the database with no changes since last save
	 * @returns true if the product has been saved
	 */
	isSaved() {
		return this._saved;
	}

	/**
	 * Marks the product as unsaved
	 */
	markUnsaved() {
		this._saved = false;
	}

	/**
	 * Refreshes the product from the database
	 * @returns a promise that completes once refreshing is done
	 */
	async refresh() {
		this._variationGroups = [];
		await this._dbConn.reloadProduct(this);
	}

	/**
	 *
	 * @returns the id of the product
	 */
	getID() {
		return this._id;
	}

	/**
	 * 
	 * @returns {number} the shopify id of the product
	 */
	getShopifyID() {
		return this._shopifyProduct["id"];
	}

	/**
	 * TODO: Test this
	 * @returns the base cost, in cents, of the product
	 */
	getBaseCost() {
		return parseInt(this._shopifyProduct["variants"][0]["price"] * 100);
	}

	/**
	 * TODO: Test this
	 * @returns the name of the product
	 */
	getName() {
		return this._shopifyProduct["title"];
	}

	/**
	 * Gets all of the variation groups belonging to this product
	 * @returns {VariationGroup[]} an array containing the variation groups
	 */
	getVariationGroups() {
		return this._variationGroups;
	}

	/**
	 * Gets a specific variation group via an ID
	 * @param {number} groupID the ID of the requested group
	 * @returns {VariationGroup} the desired group, or null if it does not belong to this product
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
	 * Gets a specific variation via an ID
	 * @param {number} variationID the ID of the requested variation
	 * @returns {Variation} the desired variation, or null if it does not belong to this product
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

	/**
	 * Creates a new empty variation group belonging to this product
	 * @returns {VariationGroup} the newly created group
	 */
	async addVariationGroup() {
		let newGroup = await this._dbConn.createNewVariationGroup(this);
		this._variationGroups.push(newGroup);
		return newGroup;
	}

	/**
	 * Loads a new variation group that belongs to this product
	 * @param {VariationGroup} group the group to load
	 */
	loadVariationGroup(group) {
		this._variationGroups.push(group);
	}

	/**
	 * Removes a variation group from the product and database
	 * @param {VariationGroup} group the group to remove
	 */
	async deleteVariationGroup(group) {
		let index = this._variationGroups.indexOf(group);
		if (index != -1) {
			// Remove from array
			this._variationGroups.splice(index, 1);
			// Remove from db
			await this._dbConn.deleteVariationGroup(group);
		}
	}
}
