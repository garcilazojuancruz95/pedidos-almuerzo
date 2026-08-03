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
      <aside
        style={{
          gridRow: "1 / 3",
          background: "var(--color-primary)",
          color: "white",
          padding: "20px",
        }}
      >
        <Sidebar />
      </aside>

      <Header />

      <main
        style={{
          padding: "24px",
          background: "var(--color-background)",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}