function start() {

    dbURL = document.getElementById("dbURL").value;

    fetch(dbURL + "/database?request=userProducts&userID=1").then((response) => {
        console.log(response);
    });
}

start();