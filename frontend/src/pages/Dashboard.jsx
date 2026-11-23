import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiBox, FiCreditCard, FiRefreshCw, FiShoppingCart, FiTruck, FiUsers } from "react-icons/fi";

const metrics = [
  ["Total products", "totalProducts", FiBox, "/products"],
  ["Low-stock alerts", "lowStockAlerts", FiAlertCircle, "/alerts"],
  ["Completed sales", "totalSales", FiCreditCard, "/sales"],
  ["Purchase orders", "totalOrders", FiShoppingCart, "/purchase-orders"],
  ["Active suppliers", "activeSuppliers", FiTruck, "/suppliers"],
  ["Team accounts", "totalUsers", FiUsers, "/users"],
];

const number = new Intl.NumberFormat();
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function Dashboard() {
  const [revision, setRevision] = useState(0);
  const [view, setView] = useState({ loading: true, stats: null, error: false });

  useEffect(() => {
    const request = new AbortController();
    async function load() {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard/stats", { signal: request.signal });
        if (!response.ok) throw new Error("Dashboard request failed");
        setView({ loading: false, stats: await response.json(), error: false });
      } catch (error) {
        if (error.name !== "AbortError") setView({ loading: false, stats: null, error: true });
      }
    }
    load();
    return () => request.abort();
  }, [revision]);

  const refresh = () => {
    setView({ loading: true, stats: null, error: false });
    setRevision((current) => current + 1);
  };

  return (
    <section className="overview">
      <header className="overview-heading">
        <div><h1>Inventory overview</h1><p>Track stock levels, orders, and completed sales across your inventory.</p></div>
        <button type="button" className="workspace-button button-outline" onClick={refresh} disabled={view.loading}><FiRefreshCw aria-hidden="true" /> Refresh</button>
      </header>
      {view.error && <div className="overview-error" role="alert"><FiAlertCircle aria-hidden="true" /><span>Inventory totals are unavailable. Check the connection and try again.</span><button type="button" onClick={refresh}>Retry</button></div>}
      <div className="metric-grid" aria-busy={view.loading}>
        {metrics.map(([label, key, Icon, path]) => {
          const value = view.stats?.[key];
          const count = value == null ? "—" : (key === "totalSales" ? currency : number).format(value);
          return (
            <Link to={path} key={key} className={key === "lowStockAlerts" && value > 0 ? "metric-card metric-alert" : "metric-card"}>
              <span className="metric-icon"><Icon aria-hidden="true" /></span>
              <span className="metric-label">{label}</span>
              {view.loading ? <span className="metric-placeholder" aria-label="Loading" /> : <strong>{count}</strong>}
            </Link>
          );
        })}
      </div>
      <div className="overview-actions">
        <section className="workspace-panel">
          <h2>Stock alerts</h2>
          <p>{view.stats ? (view.stats.lowStockAlerts > 0 ? "Review products below their stock thresholds." : "There are no low-stock alerts to review.") : "Check which products need replenishment."}</p>
          <Link to="/alerts" className="workspace-button">View stock alerts</Link>
        </section>
        <section className="workspace-panel">
          <h2>Order and billing activity</h2>
          <p>Follow incoming orders or review invoices for completed sales.</p>
          <div className="panel-links"><Link to="/purchase-orders" className="workspace-button button-outline">Purchase orders</Link><Link to="/billing" className="workspace-button button-outline">Invoices</Link></div>
        </section>
      </div>
    </section>
  );
}
