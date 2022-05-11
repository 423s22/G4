import App from "../AdminApp/App";
import React, { useState, useEffect } from "react";

export default function Index() {
  let app;
  if (typeof window === "object") {
    // If running in the browser, create and run the app
    app = new App();
  }

  useEffect(() => {
    if (typeof window === "object" && !app.isRunning()) app.start();
  }, []);

  return <div id="appDiv"></div>;
}
