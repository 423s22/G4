import ServerDatabase from "../../server/dbAPI/DatabaseConnection";
import BTSDatabase from "./DatabaseConnection";

test("Tests BTS App Database Connection", () => {

    let serverDB = new ServerDatabase("127.0.0.1", "root", "rootPassword", "G4db");
    return serverDB.connect().then(() => {

        let appDB = new BTSDatabase("127.0.0.1");
        let product = await appDB.createNewProduct(1);
        await appDB.createNewProduct(1);

        let newGroup = await product.addVariationGroup();
        await newGroup.addVariation();
        await newGroup.addVariation();
        await newGroup.addVariation();

        let products = await appDB.getUserProducts(1);
        expect(products.length).toBe(2);

    });

});