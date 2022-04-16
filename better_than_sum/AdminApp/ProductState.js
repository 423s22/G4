import AppState from "./AppState";
export default class ProductState extends AppState {
  constructor(app) {
    super(app);
    this._dbConn = this._app.getDatabaseConnection();
  }

  onEnable() {}

  onDisable() {}

  onRender(divID) {
    let div = document.getElementById(divID);

    div.innerHTML = "";
    div.innerHTML = "<h1>Products!</h1>";

    // Temporary for testing db conn
    let currentProducts = ["Phone", "Ipad", "Photo"];
    var i;
    for (i = 0; i < currentProducts.length; i++) {
      // Create an button which will allow for the drop down
      let accordian = document.createElement("button");
      let text = document.createTextNode(currentProducts[i]);
      // Allow for calling in css
      accordian.classList = "accordian";
      accordian.id = currentProducts[i];
      // Set button text
      accordian.appendChild(text);
      div.appendChild(accordian);

      let panel = document.createElement("div");
      panel.classList = "panel";
      let paragraph = document.createElement("p");
      var paratext = document.createTextNode("Test Text here");
      paragraph.appendChild(paratext);
      panel.appendChild(paragraph);
      div.appendChild(panel);

      accordian.addEventListener("click", (event) => {
        /* Toggle between adding and removing the "active" class,
				to highlight the button that controls the panel */
        accordian.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    }

    //this.testDB();
  }

  //async getCurrentProducts(){
  //let products = await this._dbConn.getUserProducts();
  //}

  // TODO: Test method, remove later
  async testDB() {
    let dbConn = this._app.getDatabaseConnection();
    let products = await dbConn.getUserProducts();
    console.log(products.getProducts().length);

    let newProduct = await products.addProduct();
    newProduct.setName("Created Product");
    let id = newProduct.getID();

    let group1 = await newProduct.addVariationGroup();
    group1.setName("Group1");

    let var1 = await group1.addVariation();
    var1.setName("Var1");

    let var2 = await group1.addVariation();
    var2.setName("Var2");

    let group2 = await newProduct.addVariationGroup();
    group2.setName("Group2");

    let var3 = await group2.addVariation();
    var3.setName("Var3");

    await var3.addBlocker(var2);

    await newProduct.save();

    products = await dbConn.getUserProducts();
    console.log(products.getProducts());
    console.log(products.getProducts().length);

    await products.deleteProduct(products.getProductByID(id));

    products = await dbConn.getUserProducts();
    console.log(products.getProducts().length);
  }
}
