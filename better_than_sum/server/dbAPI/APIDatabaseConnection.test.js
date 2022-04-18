import DatabaseConnection from "./DatabaseConnection";

test("Tests Database API", () => {
  let dbConn = new DatabaseConnection(
    "127.0.0.1",
    "root",
    "rootPassword",
    "G4db"
  );
  return dbConn.connect().then(() => {
    return dbConn._getUserIDJSON("Test User").then((results) => {
      let id = JSON.parse(results)[0]["userID"];
      expect(id).toBe(1);
      return dbConn.disconnect();
    });
  });
});

test("Tests Database User Products", () => {
  let dbConn = new DatabaseConnection(
    "127.0.0.1",
    "root",
    "rootPassword",
    "G4db"
  );
  return dbConn.connect().then(() => {
    return dbConn._getUserProductsJSON(1).then((results) => {
      expect(JSON.parse(results).length).toBe(2);
      return dbConn.disconnect();
    });
  });
});

test("Tests Database Products Variations", () => {
  let dbConn = new DatabaseConnection(
    "127.0.0.1",
    "root",
    "rootPassword",
    "G4db"
  );
  return dbConn.connect().then(() => {
    return dbConn._getProductVariationsJSON(1).then((results) => {
      expect(JSON.parse(results).length).toBe(5);
      return dbConn.disconnect();
    });
  });
});

test("Tests Database Products Groups", () => {
  let dbConn = new DatabaseConnection(
    "127.0.0.1",
    "root",
    "rootPassword",
    "G4db"
  );
  return dbConn.connect().then(() => {
    return dbConn._getVariationGroupsJSON(1).then((results) => {
      expect(JSON.parse(results).length).toBe(2);
      return dbConn.disconnect();
    });
  });
});

test("Tests Database Blockers", () => {
  let dbConn = new DatabaseConnection(
    "127.0.0.1",
    "root",
    "rootPassword",
    "G4db"
  );
  return dbConn.connect().then(() => {
    return dbConn._getVariationBlockersJSON(2).then((results) => {
      expect(JSON.parse(results).length).toBe(1);
      return dbConn.disconnect();
    });
  });
});
