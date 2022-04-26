import App from "../AdminApp/App";
import React, { useState, useEffect } from "react";
import "./css/eps.css";

export default function Index() {
  let app;
  if (typeof window === "object") {
    app = new App();
  }

  useEffect(() => {
    if (typeof window === "object" && !app.isRunning()) app.start();
  }, []);

  return <div id="appDiv"></div>;
}
