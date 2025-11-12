import { CheckServer } from "./API";
import "./App.css";
import { MapWindow } from "./Components/mapWindow";
import { AccountSetupPage } from "./Components/AccountSetupPage";

export default function App() {
	CheckServer();	
	return <AccountSetupPage />;
}
