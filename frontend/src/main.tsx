import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import { installGlobalApiDownFetchAlert } from "./utils/apiDown";

installGlobalApiDownFetchAlert();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
