import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import Header from "../components/layout/Header/Header";
import "./OperatorLayout.css";

export default function OperatorLayout() {
  return (
    <div className="operator-layout">
      <div className="operator-layout-header">
        <Header />
      </div>

      <aside className="operator-layout-sidebar">
        <Sidebar />
      </aside>

      <main className="operator-layout-main">
        <Outlet />
      </main>
    </div>
  );
}
