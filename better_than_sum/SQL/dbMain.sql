CREATE TABLE Users (
    userID BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(128),
    PRIMARY KEY (userID)
);

CREATE TABLE Products (
    productID BIGINT NOT NULL AUTO_INCREMENT,
    baseCost INTEGER NOT NULL,
    name VARCHAR(64),
    owningUser BIGINT NOT NULL,
    PRIMARY KEY (productID),
    CONSTRAINT FK_ProductUser FOREIGN KEY (owningUser) REFERENCES Users(userID) ON DELETE CASCADE
);

CREATE TABLE VariationGroups (
    groupID BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(64),
    owningProduct BIGINT NOT NULL,
    PRIMARY KEY (groupID),
    CONSTRAINT FK_VariationProduct FOREIGN KEY (owningProduct) REFERENCES Products(productID) ON DELETE CASCADE
);

CREATE TABLE Variations (
    variationID BIGINT NOT NULL AUTO_INCREMENT,
    addedCost INTEGER NOT NULL,
    name VARCHAR(64),
    owningGroup BIGINT NOT NULL,
    PRIMARY KEY (variationID),
    CONSTRAINT FK_VariationGroup FOREIGN KEY (owningGroup) REFERENCES VariationGroups(groupID) ON DELETE CASCADE
);

CREATE TABLE Combos (
    comboID BIGINT NOT NULL AUTO_INCREMENT,
    stockAmount INTEGER NOT NULL,
    PRIMARY KEY (comboID)
);

CREATE TABLE ComboItems (
    owningCombo BIGINT NOT NULL,
    variationItem BIGINT NOT NULL,
    CONSTRAINT FK_ComboVariation FOREIGN KEY (variationItem) REFERENCES Variations(variationID) ON DELETE CASCADE,
    CONSTRAINT FK_Combo FOREIGN KEY (owningCombo) REFERENCES Combos(comboID) ON DELETE CASCADE
);

CREATE TABLE VariationBlockers (
    excludeVariationA BIGINT NOT NULL,
    excludeVariationB BIGINT NOT NULL,
    CONSTRAINT FK_VarA FOREIGN KEY (excludeVariationA) REFERENCES Variations(variationID) ON DELETE CASCADE,
    CONSTRAINT FK_VarB FOREIGN KEY (excludeVariationB) REFERENCES Variations(variationID) ON DELETE CASCADE
);

INSERT INTO Users (name) VALUES ("Test User");