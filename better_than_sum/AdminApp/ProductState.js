import AppState from "./AppState";
export default class ProductState extends AppState {
	constructor(app) {
		super(app);
	}

	onEnable() { }

	onDisable() { }

	onRender(divID) {
		// Temporary for testing db conn

		let div = document.getElementById(divID);
		div.innerHTML = "";
		div.innerHTML = "<h1>Products!</h1>";

		this.testDB();

	}

	// TODO: Test method, remove later
	async testDB() {
		let dbConn = this._app.getDatabaseConnection();
		let products = await dbConn.getUserProducts();
		console.log(products.getProducts());

		let newProduct = await products.addProduct();
		newProduct.setName("Created Product");
		let id = newProduct.getID();

		let group1 = await newProduct.addVariationGroup();
		group1.setName("Group1");

		let var1 = await newGroup.addVariation();
		var1.setName("Var1");

		let var2 = await newGroup.addVariation();
		var2.setName("Var2");

		let group2 = await newProduct.addVariationGroup();
		group2.setName("Group2");

		let var3 = await group2.addVariation();
		var3.setName("Var3");

		await var3.addBlocker(var2);

		await newProduct.save();

		products = await dbConn.getUserProducts();
		console.log(products.getProducts());

		await products.deleteProduct(products.getProductByID(id));

		products = await dbConn.getUserProducts();
		console.log(products.getProducts());

	}
}
