async function start() {

    let dbURL = document.getElementById("dbURL").value;
    let shopifyProductID = document.getElementById("shopifyProductID").value;

    let product = await executeGetRequest(dbURL, "shopifyProduct", {
        "shopifyID": shopifyProductID
    });
    let btsID = product[0]["productID"];
    console.log(product);

    let variations = await executeGetRequest(dbURL, "productVariations", { "productID": btsID });
    let groups = await executeGetRequest(dbURL, "productVariationGroups", { "productID": btsID });

    let selectDiv = document.getElementById("variantGroups");

    for (let i = 0; i < groups.length; i++) {
        let groupDiv = document.createElement("div");
        groupDiv.classList.add("groupDiv");
        selectDiv.appendChild(groupDiv);
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