import React, { useEffect, useState } from "react";
import { Card, Button } from "../components/common/ui";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { listOwnerStatements } from "../services/workflowService";
import { listPayoutRecords } from "../services/payoutService";
import { useLanguage } from "../context/LanguageContext";

export default function OwnerDashboardPage() {
  const { language } = useLanguage();
  const [statements, setStatements] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const s = await listOwnerStatements();
      if (s.success) setStatements(s.data); else setMessage(s.error.message);
      const p = await listPayoutRecords();
      if (p.success) setPayouts(p.data);
    }
    load();
  }, []);

  return (
    <ProtectedRoute>
      <section className="section">
        <div className="container">
          <div className="admin-shell">
            <aside className="admin-sidebar">
              <div className="admin-brand-card">
                <div className="admin-kicker">{language === "es" ? "PROPIETARIO" : "OWNER"}</div>
                <h2 style={{ margin: ".35rem 0 0" }}>{language === "es" ? "PANEL DE PAGOS" : "PAYOUT DASHBOARD"}</h2>
              </div>
            </aside>
            <div className="admin-content">
              {message ? <div className="notice">{message}</div> : null}
              <div className="admin-stat-grid">
                <Card style={{ padding: "1rem" }}><div className="admin-stat-card"><div className="muted admin-kicker">STATEMENTS</div><div className="admin-stat-value">{statements.length}</div></div></Card>
                <Card style={{ padding: "1rem" }}><div className="admin-stat-card"><div className="muted admin-kicker">PAYOUTS</div><div className="admin-stat-value">{payouts.length}</div></div></Card>
              </div>

              <Card style={{ padding: "1rem" }}>
                <div className="admin-section-header">
                  <div><div className="admin-kicker">{language === "es" ? "ESTADOS DE CUENTA" : "OWNER STATEMENTS"}</div></div>
                  <Button variant="light">{language === "es" ? "DESCARGAR" : "DOWNLOAD"}</Button>
                </div>
                <div className="admin-table-wrap">
                  <table className="table">
                    <thead><tr><th>MONTH</th><th>GROSS</th><th>FEES</th><th>PAYOUT</th></tr></thead>
                    <tbody>{statements.map((row) => <tr key={row.id}><td>{row.statement_month}</td><td>{row.gross_revenue}</td><td>{row.fees}</td><td>{row.payout_amount}</td></tr>)}</tbody>
                  </table>
                </div>
              </Card>

              <Card style={{ padding: "1rem" }}>
                <div className="admin-kicker">{language === "es" ? "HISTORIAL DE PAGOS" : "PAYOUT HISTORY"}</div>
                <div className="admin-table-wrap" style={{ marginTop: "1rem" }}>
                  <table className="table">
                    <thead><tr><th>AMOUNT</th><th>METHOD</th><th>STATUS</th><th>PAID AT</th></tr></thead>
                    <tbody>{payouts.map((row) => <tr key={row.id}><td>{row.amount}</td><td>{row.payout_method}</td><td>{row.payout_status}</td><td>{row.paid_at}</td></tr>)}</tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
