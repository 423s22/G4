import { Heading, Page } from "@shopify/polaris";

export default function Index() {

	console.log("Called from index");

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
