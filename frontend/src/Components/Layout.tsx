import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import ContentContainer from "./containers/ContentContainer";

export function Layout() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex flex-col flex-1">
				<ContentContainer>
					<Outlet />
				</ContentContainer>
			</main>
		</div>
	);
}
