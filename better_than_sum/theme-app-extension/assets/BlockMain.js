function start() {

    let dbURL = document.getElementById("dbURL").value;
    let productID = document.getElementById("shopifyProductID").value;
    console.log(productID);

    let url = new URL("https://" + dbURL);
    url.pathname += "database/";
    url.searchParams.append("request", "userProducts");
    url.searchParams.append("userID", "1");

    let req = new XMLHttpRequest();
    req.open("GET", url.toString());
    req.onload = () => {
        let responseJSON = JSON.parse(req.responseText);
        console.log(responseJSON);
    }
    req.send();

}

start();