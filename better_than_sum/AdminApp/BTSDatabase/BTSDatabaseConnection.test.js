import BTSDatabase from "./DatabaseConnection";

test("Tests BTS App Database Connection", () => {

    // TODO: Add secrets to GitHub to load .env
    /*require("../../server/index");

    let appDB = new BTSDatabase("127.0.0.1");
    let product = appDB.createNewProduct(1);
    product.then((product) => {
        appDB.createNewProduct(1).then(() => {
            product.addVariationGroup().then((newGroup) => {
                appDB.getUserProducts(1).then((products) => {
                    expect(products.length).toBe(2);
                    return;
                });
            });
        });
    });*/


    expect(1).toBe(1);

});