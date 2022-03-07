import { Heading, Page } from "@shopify/polaris";

export default function Index() {

	// This outputs to the server console and also the browser console
	// Unsure what process this runs in
	console.log(window.location.href);

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
