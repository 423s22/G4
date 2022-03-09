import { Heading, Page } from "@shopify/polaris";

export default function Index() {

	if (typeof window === "object") {
		const App = require("./AdminApp");
		let app = new App();
		app.start();
	}

	return (
		<Page>
		</Page>
	);
}
