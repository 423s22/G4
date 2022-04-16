// function creates an XML http request to return a json object of the product variation groups
function getVariationGroups() {
  dbURL = document.getElementById("dbURL").value;

  let url = new URL("https://" + dbURL);
  url.pathname += "database/";
  url.searchParams.append("request", "productVariationGroups");
  url.searchParams.append("productID", "1");

  let req = new XMLHttpRequest();
  req.open("GET", url.toString());
  req.onload = () => {
    let responseJSON = JSON.parse(req.responseText);
    console.log(responseJSON);
  };
  req.send();
}

getVariationGroups();
