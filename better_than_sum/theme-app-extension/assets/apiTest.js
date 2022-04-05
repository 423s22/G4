function start() {

    dbURL = document.getElementById("dbURL").value;


    let url = new URL("https://" + dbURL);
    url.pathname += "/database/";
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