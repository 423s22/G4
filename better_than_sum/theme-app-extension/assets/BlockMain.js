function start() {

    let dbURL = document.getElementById("dbURL").value;
    let shopifyProductID = document.getElementById("shopifyProductID").value;

    let url = new URL("https://" + dbURL);
    url.pathname += "database/";
    url.searchParams.append("request", "shopifyProduct");
    url.searchParams.append("shopifyID", shopifyProductID);

    let req = new XMLHttpRequest();
    req.open("GET", url.toString());
    req.onload = () => {
        let responseJSON = JSON.parse(req.responseText);
        let btsID = responseJSON["productID"];
        console.log(btsID);
    }
    req.send();
}

start();