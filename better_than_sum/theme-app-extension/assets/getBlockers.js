// function creates an XML http request to return a json object of the product variation blockers. Blockers prevent a user from
//selecting a product that is not able to be purchased.
function getBlockers() {
  dbURL = document.getElementById("dbURL").value;

  let url = new URL("https://" + dbURL);
  url.pathname += "database/";
  url.searchParams.append("request", "variationBlockers");
  url.searchParams.append("variationID", "1");

  let req = new XMLHttpRequest();
  req.open("GET", url.toString());
  req.onload = () => {
    let responseJSON = JSON.parse(req.responseText);
    console.log(responseJSON);
  };
  req.send();
}

getBlockers();
