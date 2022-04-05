function start(dbAPIURL) {

    fetch(dbAPIURL + "/database?request=userProducts&userID=1").then((response) => {
        console.log(response);
    });
}