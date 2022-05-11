async function start() {

    // Load all the basic information
    let dbURL = document.getElementById("dbURL").value;
    let shopifyProductID = document.getElementById("shopifyProductID").value;

    let product = await executeGetRequest(dbURL, "shopifyProduct", {
        "shopifyID": shopifyProductID
    });

    let totalPriceIndicator = document.getElementById("totalPriceIndicator");
    totalPriceIndicator.textContent = "$" + (document.getElementById("shopifyProductPrice").value / 100).toFixed(2);

    if (product.length == 0) {
        return;
    }
    
    let btsID = product[0]["productID"];

    let variations = await executeGetRequest(dbURL, "productVariations", { "productID": btsID });
    let groups = await executeGetRequest(dbURL, "productVariationGroups", { "productID": btsID });

    /**
     * @var blockersMap
     * @type {Map<number, number[]>}
     */
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

    let selectDiv = document.getElementById("variantGroups");

    /**
     * @var groupDivs
     * @type {Map<number, HTMLDivElement>}
     */
    let groupDivs = new Map();

    // Create all of the divs for each group
    for (let i = 0; i < groups.length; i++) {
        let groupDiv = document.createElement("div");
        groupDiv.classList.add("groupDiv");
        selectDiv.appendChild(groupDiv);

        groupDivs.set(parseInt(groups[i]["groupID"]), groupDiv);

        let groupTitle = document.createElement("h2");
        groupTitle.textContent = groups[i]["name"];
        groupDiv.appendChild(groupTitle);
    }

    /**
     * @var variationButtons
     * @type {Map<number, HTMLButtonElement>}
     */
    let variationButtons = new Map();

    /**
     * @var selectedButtons
     * @type {HTMLButtonElement[]}
     */
    let selectedButtons = [];

    // Add variations to each group
    for (let i = 0; i < variations.length; i++) {

        let variationButton = document.createElement("button");
        variationButton.textContent = variations[i]["name"];
        variationButton.dataset.variation_id = variations[i]["variationID"];
        variationButtons.set(variations[i]["variationID"], variationButton);

        let groupDiv = groupDivs.get(parseInt(variations[i]["owningGroup"]));
        groupDiv.appendChild(variationButton);

        variationButton.addEventListener("click", (event) => {

            // Remove selected buttons in same group
            for (let j = 0; j < groupDiv.children.length; j++) {
                let index = selectedButtons.indexOf(groupDiv.children[j]);
                if (index != -1) {
                    selectedButtons.splice(index, 1);
                    groupDiv.children[j].classList.remove("selectedVariant");
                }
            }

            // Momentarilly enable all buttons
            for (let entry of variationButtons.entries()) {
                entry[1].disabled = false;
            }

            // Add the button as selected
            selectedButtons.push(variationButton);
            variationButton.classList.add("selectedVariant");

            // Disable buttons based on selections and update price
            let totalPrice = parseInt(document.getElementById("shopifyProductPrice").value);
            for (let button of selectedButtons) {
                // Disable buttons
                let blockedIDs = blockersMap.get(parseInt(button.dataset.variation_id));
                for (let j = 0; j < blockedIDs.length; j++) {
                    variationButtons.get(blockedIDs[j]).disabled = true;
                }
                // Add to price
                for (let variation of variations) {
                    if (variation["variationID"] == parseInt(button.dataset.variation_id)) {
                        totalPrice += variation["addedCost"];
                    }
                }
            }
            // Update price
            totalPriceIndicator.textContent = "$" + (totalPrice / 100).toFixed(2);
        });

    }

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