import { CheckServer } from "./API";
import "./App.css";
import { MapWindow } from "./Components/mapWindow";

export default function App() {
	CheckServer();	
	return <MapWindow />;
}
