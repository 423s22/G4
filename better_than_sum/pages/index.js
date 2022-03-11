import { Heading, Page } from "@shopify/polaris";
import App from "./AdminApp/App";

export default function Index() {


	if (typeof window === "object") {
		let app = new App();
		useEffect(() => {
			app.start();
		}, []);
	}

	return (
		<Page>
			<div id="appDiv"></div>
		</Page>
	);
}
