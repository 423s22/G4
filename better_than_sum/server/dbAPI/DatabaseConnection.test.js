import DatabaseConnection from "./DatabaseConnection";

test("Tests database connection", () => {
    let dbConn = new DatabaseConnection("127.0.0.1", "root", "rootPassword", "G4db");
    let id = JSON.parse(dbConn._getUserIDJSON("Test User"))["userID"];
    expect(id).toBe(1);
});