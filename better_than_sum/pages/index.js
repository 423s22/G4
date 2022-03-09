import { Heading, Page } from "@shopify/polaris";
import {App} from "./../server/AdminApp/App.js";

export default function Index() {

	if (typeof window === "object") {
		console.log(App);
		let app = new App();
		app.start();
	}

	return (
		<Page>
		</Page>
	);
}
