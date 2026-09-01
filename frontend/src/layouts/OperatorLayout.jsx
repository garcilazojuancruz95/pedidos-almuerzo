import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import Header from "../components/layout/Header/Header";

export default function OperatorLayout() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "250px 1fr",
        gridTemplateRows: "70px 1fr",
        height: "100vh",
      }}
    >
      <div
        style={{
          gridColumn: "1 / 3",
        }}
      >
        <Header />
      </div>

      <aside
        style={{
          background: "var(--color-primary)",
          color: "white",
        }}
      >
        <Sidebar />
      </aside>

      <main
        style={{
          padding: "24px",
          background: "var(--color-background)",
          overflow: "auto",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}