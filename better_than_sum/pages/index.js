import { Heading, Page } from "@shopify/polaris";
import AdminApp from "./AdminApp";

export default function Index() {

	let app = new AdminApp();
	app.start();

	return (
		<Page>
		</Page>
	);
}
