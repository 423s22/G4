import DatabaseConnection from "./DatabaseConnection";
import Product from "./Product";

export default class ProductList {
  /**
   *
   * @param {Product[]} products
   * @param {DatabaseConnection} dbConn
   */
  constructor(products, dbConn) {
    this._products = products;
    this._dbConn = dbConn;
  }

  /**
   * Creates a new empty product and adds it to the database
   * @returns the new product
   */
  async addProduct() {
    let newProduct = await this._dbConn.createNewProduct();
    this._products.push(newProduct);
    return newProduct;
  }

  /**
   * Deletes a given product
   * @param {Product} product the product to delete
   */
  async deleteProduct(product) {
    let index = this._products.indexOf(product);
    if (index != -1) {
      this._products.splice(index, 1);
      await this._dbConn.deleteProduct(product);
    }
  }

  /**
   * Gets all of the products within the list
   * @returns {Product[]} the products
   */
  getProducts() {
    return this._products;
  }

  /**
   * Gets a product from the list via its ID
   * @param {number} productID the ID of the product
   * @returns {Product} the requested product, or null if it was not in the list
   */
  getProductByID(productID) {
    for (let i = 0; i < this._products.length; i++) {
      if (this._products[i].getID() == productID) {
        return this._products[i];
      }
    }
    return null;
  }
}
