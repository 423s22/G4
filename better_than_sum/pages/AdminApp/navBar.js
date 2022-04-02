export default class navBar {
  createNavigationBar() {
    // Created 2 divs, 1) navDiv = navBar &
    // 2) stateDiv - going to populate information
    // make sure to clear all childs of this in order to re-onRender()
    let appDiv = document.getElementById("appDiv");
    let navDiv = document.createElement("div");
    appDiv.appendChild(navDiv);
    navDiv.id = "navDiv";

    let stateDiv = document.createElement("div");
    appDiv.appendChild(stateDiv);
    stateDiv.id = "stateDiv";

    // Creating links for the nav bar and adding padding to each element
    let navItems = document.createElement("li");
    navItems.style = "list-style: none";
    let linkDashboard = document.createElement("a");
    linkDashboard.style = "padding-right: 20px";
    let linkProduct = document.createElement("a");
    linkProduct.style = "padding-right: 20px";
    let linkHelp = document.createElement("a");
    linkHelp.style = "padding-right: 20px";
    let linkSettings = document.createElement("a");

    // Set all the anchors and labels
    linkDashboard.href = "DashboardState.js";
    linkDashboard.innerHTML = "Dashboard";

    linkProduct.href = "ProductState.js";
    linkProduct.innerHTML = "Product";

    linkHelp.href = "HelpState.js";
    linkHelp.innerHTML = "Help";

    linkSettings.href = "SettingState.js";
    linkSettings.innerHTML = "Settings";

    // Add all the links to the list
    navItems.appendChild(linkDashboard);
    navItems.appendChild(linkProduct);
    navItems.appendChild(linkHelp);
    navItems.appendChild(linkSettings);

    // add to navDiv
    navDiv.appendChild(navItems);
  }
}
