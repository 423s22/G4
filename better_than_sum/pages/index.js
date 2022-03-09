import { Heading, Page } from "@shopify/polaris";
import { App } from "./AdminApp/App";

export default function Index() {

	if (typeof window === "object") {
		let app = new App();
		app.start();
	}

	return (
		<Page>
		</Page>
	);
}
