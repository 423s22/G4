import { Heading, Page } from "@shopify/polaris";
import {AdminApp} from "./AdminApp.js";

export default function Index() {

	let app = new AdminApp();
	app.start();

	return (
		<Page>
		</Page>
	);
}
