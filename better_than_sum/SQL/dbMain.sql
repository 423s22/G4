CREATE TABLE Users (
    userID BIGINT NOT NULL,
    name VARCHAR(128),
    PRIMARY KEY (userID)
);

CREATE TABLE Products (
    productID BIGINT NOT NULL,
    baseCost INTEGER NOT NULL,
    name VARCHAR(64),
    owningUser BIGINT NOT NULL,
    PRIMARY KEY (productID),
    CONSTRAINT FK_ProductUser FOREIGN KEY (owningUser) REFERENCES Users(userID)
);

CREATE TABLE VariationGroups (
    groupID BIGINT NOT NULL,
    name VARCHAR(64),
    owningProduct BIGINT NOT NULL,
    PRIMARY KEY (groupID),
    CONSTRAINT FK_VariationProduct FOREIGN KEY (owningProduct) REFERENCES Products(productID)
);

CREATE TABLE Variations (
    variationID BIGINT NOT NULL,
    addedCost INTEGER NOT NULL,
    name VARCHAR(64),
    owningGroup BIGINT NOT NULL,
    PRIMARY KEY (variationID),
    CONSTRAINT FK_VariationGroup FOREIGN KEY (owningGroup) REFERENCES VariationGroups(groupID)
);

CREATE TABLE Combos (
    comboID BIGINT NOT NULL,
    stockAmount INTEGER NOT NULL,
    PRIMARY KEY (comboID)
);

CREATE TABLE ComboItems (
    owningCombo BIGINT NOT NULL,
    variationItem BIGINT NOT NULL,
    CONSTRAINT FK_ComboVariation FOREIGN KEY (variationItem) REFERENCES Variations(variationID),
    CONSTRAINT FK_Combo FOREIGN KEY (owningCombo) REFERENCES Combos(comboID)
);

CREATE TABLE VariationBlockers (
    excludeVariationA BIGINT NOT NULL,
    excludeVariationB BIGINT NOT NULL,
    CONSTRAINT FK_VarA FOREIGN KEY (excludeVariationA) REFERENCES Variations(variationID),
    CONSTRAINT FK_VarB FOREIGN KEY (excludeVariationB) REFERENCES Variations(variationID)
);