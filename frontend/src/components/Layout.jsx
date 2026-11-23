import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiActivity, FiAlertCircle, FiBox, FiCreditCard, FiGrid, FiLogOut, FiMenu, FiShoppingBag, FiShoppingCart, FiTruck, FiUsers, FiCornerUpLeft } from "react-icons/fi";

const groups = [
  ["Workspace", [
    ["/", "Dashboard", FiGrid], ["/products", "Products", FiBox],
    ["/alerts", "Stock alerts", FiAlertCircle], ["/suppliers", "Suppliers", FiTruck],
  ]],
  ["Transactions", [
    ["/sales", "Sales", FiShoppingBag], ["/billing", "Billing", FiCreditCard],
    ["/purchase-orders", "Purchase orders", FiShoppingCart], ["/returns", "Returns", FiCornerUpLeft],
  ]],
  ["Administration", [["/users", "User management", FiUsers]]],
];

export function InventoryBrand() {
  return <span className="inventory-brand"><span className="brand-mark"><FiBox aria-hidden="true" /></span><span>Smart Inventory<small>Electronics operations</small></span></span>;
}

export default function Layout({ children, onSignOut }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeGroup = groups.find(([, items]) => items.some(([path]) => path === pathname));
  const activePage = activeGroup?.[1].find(([path]) => path === pathname)?.[1] ?? "Page not found";

  return (
    <div className="inventory-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className="inventory-sidebar">
        <div className="sidebar-top">
          <Link to="/" onClick={() => setMenuOpen(false)}><InventoryBrand /></Link>
          <button type="button" className="mobile-menu" aria-expanded={menuOpen} aria-controls="inventory-navigation" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu aria-hidden="true" />
          </button>
        </div>
        <div id="inventory-navigation" className={menuOpen ? "sidebar-content is-open" : "sidebar-content"}>
          <nav aria-label="Main navigation" className="sidebar-nav">
            {groups.map(([group, items]) => (
              <div className="nav-group" key={group}>
                <p>{group}</p>
                {items.map(([path, label, Icon]) => (
                  <NavLink key={path} to={path} end={path === "/"} onClick={() => setMenuOpen(false)}>
                    <Icon aria-hidden="true" />{label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
          {onSignOut && <button type="button" className="sign-out" onClick={onSignOut}><FiLogOut aria-hidden="true" /> Sign out</button>}
        </div>
      </aside>
      <div className="inventory-workspace">
        <header className="workspace-bar">
          <span className="workspace-path">{activeGroup?.[0] ?? "Workspace"} <span aria-hidden="true">/</span> <strong>{activePage}</strong></span>
          <span className="workspace-label"><FiActivity aria-hidden="true" /> Inventory workspace</span>
        </header>
        <main id="main-content" tabIndex={-1} className="workspace-main">{children}</main>
      </div>
    </div>
  );
}
