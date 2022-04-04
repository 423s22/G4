import AppStateType from "./AppStateType";

export default class NavBar {
    createNavigationBar(app) {
        // Created 2 divs, 1) navDiv = navBar &
        // 2) stateDiv - going to populate information
        // make sure to clear all childs of this in order to re-onRender()

        this._app = app;

        let appDiv = document.getElementById("appDiv");
        let navDiv = document.createElement("div");
        appDiv.appendChild(navDiv);
        navDiv.id = "navDiv";

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
        linkDashboard.innerHTML = "Dashboard";
        linkDashboard.onclick = (event) => {
            this._app.setState(AppStateType.DashboardState);
        };

        linkProduct.innerHTML = "Product";
        linkProduct.onclick = (event) => {
            this._app.setState(AppStateType.ProductState);
        };


        linkHelp.onclick = (event) => {
            this._app.setState(AppStateType.HelpState);
        };
        linkHelp.innerHTML = "Help";

        linkSettings.onclick = (event) => {
            this._app.setState(AppStateType.SettingState);
        };
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