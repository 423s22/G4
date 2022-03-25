import DatabaseConnection from "./DatabaseConnection";

test("Tests database connection", () => {
    let dbConn = new DatabaseConnection("127.0.0.1", "root", "rootPassword", "G4db");
    let results = dbConn._getUserIDJSON("Test User");
    console.log(results);
    let id = JSON.parse(results)["userID"];
    expect(id).toBe(1);
});