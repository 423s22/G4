import { Heading, Page } from "@shopify/polaris";

export default function Index() {

	if (typeof window === "object") {
		console.log("Runs in browser: " + window.location.href);
	} else {
		console.log("Runs on server");

		const mysql = require("mysql");

		let conn = mysql.createConnection({
			host: "localhost",
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASS
		});

		conn.connect(function (err) {
			if (err)
				console.log(err);
			else
				console.log("Connected!");
		});
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
