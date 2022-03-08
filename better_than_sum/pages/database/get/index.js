import { Heading, Page } from "@shopify/polaris";

export default function Index() {

    if (typeof window !== "object") {

        console.log("in db get file")
    }

    return (
        <Page>
			<Heading>
				Get request
			</Heading>
		</Page>
    );
}