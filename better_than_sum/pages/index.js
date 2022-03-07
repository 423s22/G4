import { Heading, Page } from "@shopify/polaris";

export default function Index() {

	// Any code here runs on the server, so the followling line would throw an error
	//console.log(window.location.href);

	return (

		<Page>
			<script>
				// This runs in the browser
				console.log("Hello!");
			</script>
			<Heading>
				Shopify app with Node and React{" "}
				<span role="img" aria-label="tada emoji">
					🎉
				</span>
			</Heading>
		</Page>
	);
}
