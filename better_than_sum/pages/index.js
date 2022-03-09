import { Heading, Page } from "@shopify/polaris";
import {App} from "./../server/AdminApp/App.js";

export default function Index() {

	let app = new App();
	app.start();

	return (
		<Page>
		</Page>
	);
}
