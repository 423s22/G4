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
		let navItems = document.createElement("ul");

		let navItemDB = document.createElement("li");
		let navItemP = document.createElement("li");
		let navItemH = document.createElement("li");

		let linkDashboard = document.createElement("a");
		let linkProduct = document.createElement("a");
		let linkHelp = document.createElement("a");

		// Set all the anchors and labels
		linkDashboard.innerHTML = "Dashboard";
		linkDashboard.addEventListener("click", (event) => {
			this._app.setState(AppStateType.DashboardState);
		});

		linkProduct.innerHTML = "Product";
		linkProduct.addEventListener("click", (event) => {
			this._app.setState(AppStateType.ProductState);
		});

		linkHelp.addEventListener("click", (event) => {
			this._app.setState(AppStateType.HelpState);
		});
		linkHelp.innerHTML = "Help";

		// Add all the links to a list item
		navItemDB.appendChild(linkDashboard);
		navItemP.appendChild(linkProduct);
		navItemH.appendChild(linkHelp);

		// add to unorder list
		navItems.appendChild(navItemDB);
		navItems.appendChild(navItemP);
		navItems.appendChild(navItemH);

		// add to navBar
		navDiv.appendChild(navItems);
	}
}
