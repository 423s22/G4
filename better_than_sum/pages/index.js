import { Heading, Page } from "@shopify/polaris";

export default function Index() {

	if (typeof window === "object") {
		console.log("Runs in browser: " + window.location.href);
	} else {
		console.log("Runs on server");
	}

	return (

		<Page>
			<Heading>
				Shopify app with Node and React{" "}
				<span role="img" aria-label="tada emoji">
					🎉
				</span>
			</Heading>
		</Page>
	);
}
