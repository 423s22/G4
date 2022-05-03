async function start() {

    // Load all the basic information
    let dbURL = document.getElementById("dbURL").value;
    let shopifyProductID = document.getElementById("shopifyProductID").value;

    let product = await executeGetRequest(dbURL, "shopifyProduct", {
        "shopifyID": shopifyProductID
    });
    let btsID = product[0]["productID"];

    let variations = await executeGetRequest(dbURL, "productVariations", { "productID": btsID });
    let groups = await executeGetRequest(dbURL, "productVariationGroups", { "productID": btsID });

    let blockersMap = new Map();

    // Load the blockers
    let toAwait = [];
    for (let i = 0; i < variations.length; i++) {
        let variationID = variations[i]["variationID"];
        toAwait.push(
            executeGetRequest(dbURL, "variationBlockers", { "variationID": variationID }).then(
                (value) => {
                    let blockerIDs = [];
                    for (let j = 0; j < value.length; j++) {
                        blockerIDs.push(value[j]["exclude"]);
                    }
                    blockersMap.set(variationID, blockerIDs);
                }
            )
        );
    }
    await Promise.all(toAwait);
    console.log(blockersMap);

    let selectDiv = document.getElementById("variantGroups");

    let groupDivs = new Map();

    // Create all of the divs for each group
    for (let i = 0; i < groups.length; i++) {
        let groupDiv = document.createElement("div");
        groupDiv.classList.add("groupDiv");
        selectDiv.appendChild(groupDiv);

        groupDivs.set(parseInt(groups[i]["groupID"]), groupDiv);

        let groupTitle = document.createElement("h1");
        groupTitle.textContent = groups[i]["name"];
        groupDiv.appendChild(groupTitle);
    }

    let totalPrice = document.getElementById("totalPriceIndicator");
    totalPrice.textContent = document.getElementById("shopifyProductPrice").value;

    // Add variations to each group
    for (let i = 0; i < variations.length; i++) {

        let variationButton = document.createElement("button");
        variationButton.textContent = variations[i]["name"];
        // TODO: Implement selecting only one from each group, blockers that gray out, updating cost

        let groupDiv = groupDivs.get(parseInt(variations[i]["owningGroup"]));
        groupDiv.appendChild(variationButton);

    }

    console.log(variations);
    console.log(groups);

}

async function executeGetRequest(baseURL, request, data = {}) {
    let url = new URL("https://" + baseURL + "/database/");
    url.searchParams.append("request", request);
    for (const key in data) {
        url.searchParams.append(key, data[key]);
    }

    let promise = new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.readyState == 4) {
                resolve(JSON.parse(req.responseText));
            }
        };
        req.open("GET", url.toString());
        req.send();
    });

    return promise;
}

start();