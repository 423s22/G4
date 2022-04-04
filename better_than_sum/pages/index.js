import { Heading, Page } from "@shopify/polaris";
import App from "./AdminApp/App";
import React, { useState, useEffect } from 'react';

export default function Index() {

	let app;
	if (typeof window === "object") {
		app = new App();
	}

	useEffect(() => {
		if (typeof window === "object" && !app.isRunning())
			app.start();
	}, []);

	return (
		<Page>
			<div id="appDiv">
			</div>
		</Page>
	);
}