import { Outlet } from "react-router-dom";
import Header from "./header/Header";


export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex items-center justify-center w-full flex-1">
        <Outlet />
      </main>
    </div>
  );
}
