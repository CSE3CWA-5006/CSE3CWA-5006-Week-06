import { LayoutDashboard, Search, ShieldCheck } from "lucide-react";

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Application navigation">
        <div className="brand">
          <div className="brand-mark">
            <LayoutDashboard size={22} aria-hidden="true" />
          </div>
          <div>
            <strong>ProjectBoard</strong>
            <span>React interface lab</span>
          </div>
        </div>
        <nav className="nav-list">
          <a className="active" href="#dashboard">Dashboard</a>
          <a href="#projects">Projects</a>
          <a href="#quality">Quality</a>
          <a href="#team">Team</a>
        </nav>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div>
            <p className="eyebrow">Week 6 React closing chapter</p>
            <h1>Student Project Dashboard</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Search">
              <Search size={18} aria-hidden="true" />
            </button>
            <button className="secure-button" type="button">
              <ShieldCheck size={18} aria-hidden="true" />
              Quality view
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
