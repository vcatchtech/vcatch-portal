import { useState, useEffect, useRef } from "react";

// ================================================
// SUPABASE CLIENT SETUP
// Replace these with your actual Supabase project values
// ================================================
const SUPABASE_URL = "https://hndzvwkqveqjzaqegwmp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZHp2d2txdmVxanphcWVnd21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDc2MTksImV4cCI6MjA5Nzc4MzYxOX0.fajgDAY9JjM9jtG1BYkPqzB04hI8D96bJ0Hv5MZrIQ0";

async function supaFetch(path, options = {}) {
  const session = JSON.parse(localStorage.getItem("sb_session") || "null");
  const headers = {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    ...(session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {}),
    ...options.headers,
  };
  const res = await fetch(`${SUPABASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || data?.error_description || "Request failed");
  return data;
}

async function signIn(email, password) {
  const data = await supaFetch("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("sb_session", JSON.stringify(data));
  return data;
}

async function signOut() {
  const session = JSON.parse(localStorage.getItem("sb_session") || "null");
  if (session?.access_token) {
    await supaFetch("/auth/v1/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
  }
  localStorage.removeItem("sb_session");
}

async function dbSelect(table, params = "") {
  return supaFetch(`/rest/v1/${table}${params}`, {
    headers: { Prefer: "return=representation" },
  });
}

async function dbInsert(table, body) {
  return supaFetch(`/rest/v1/${table}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
}

async function dbUpdate(table, match, body) {
  return supaFetch(`/rest/v1/${table}?${match}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
}

// ================================================
// DESIGN TOKENS
// ================================================
const T = {
  bg: "#0D0F14",
  surface: "#151820",
  card: "#1C2030",
  border: "#252A3A",
  accent: "#4F8EF7",
  accentDim: "#1E2E4A",
  green: "#34D399",
  greenDim: "#0D2E22",
  red: "#F87171",
  redDim: "#2E1515",
  amber: "#FBBF24",
  amberDim: "#2E2210",
  text: "#E8ECF4",
  muted: "#6B7594",
  font: "'Inter', system-ui, sans-serif",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.text}; font-family: ${T.font}; }
  ::-webkit-scrollbar { width: 6px; } 
  ::-webkit-scrollbar-track { background: ${T.surface}; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }

  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .login-box { background: ${T.card}; border: 1px solid ${T.border}; border-radius: 16px; padding: 40px; width: 380px; }
  .login-logo { font-size: 22px; font-weight: 700; color: ${T.accent}; letter-spacing: -0.5px; margin-bottom: 6px; }
  .login-sub { color: ${T.muted}; font-size: 13px; margin-bottom: 32px; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 12px; font-weight: 500; color: ${T.muted}; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .field input { width: 100%; background: ${T.surface}; border: 1px solid ${T.border}; border-radius: 8px; padding: 10px 14px; color: ${T.text}; font-size: 14px; outline: none; transition: border 0.15s; }
  .field input:focus { border-color: ${T.accent}; }
  .btn { width: 100%; padding: 11px; background: ${T.accent}; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
  .btn:hover { opacity: 0.88; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-sm { width: auto; padding: 7px 14px; font-size: 13px; border-radius: 6px; }
  .btn-ghost { background: transparent; border: 1px solid ${T.border}; color: ${T.text}; }
  .btn-ghost:hover { background: ${T.border}; opacity: 1; }
  .btn-danger { background: ${T.red}; }
  .btn-green { background: ${T.green}; color: #0D1A14; }
  .err { color: ${T.red}; font-size: 13px; margin-top: 12px; text-align: center; }

  .app { display: flex; height: 100vh; overflow: hidden; }
  .sidebar { width: 220px; background: ${T.surface}; border-right: 1px solid ${T.border}; display: flex; flex-direction: column; padding: 24px 0; flex-shrink: 0; }
  .sidebar-brand { padding: 0 20px 24px; font-size: 18px; font-weight: 700; color: ${T.accent}; letter-spacing: -0.5px; border-bottom: 1px solid ${T.border}; }
  .sidebar-brand span { font-size: 11px; display: block; color: ${T.muted}; font-weight: 400; margin-top: 2px; letter-spacing: 0; }
  .nav { flex: 1; padding-top: 16px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; font-size: 14px; color: ${T.muted}; cursor: pointer; transition: all 0.12s; border-left: 3px solid transparent; }
  .nav-item:hover { color: ${T.text}; background: ${T.card}; }
  .nav-item.active { color: ${T.accent}; background: ${T.accentDim}; border-left-color: ${T.accent}; }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-footer { padding: 16px 20px; border-top: 1px solid ${T.border}; }
  .user-info { font-size: 12px; color: ${T.muted}; margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .main { flex: 1; overflow-y: auto; background: ${T.bg}; }
  .page-header { padding: 28px 32px 0; border-bottom: 1px solid ${T.border}; padding-bottom: 20px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; }
  .page-title { font-size: 20px; font-weight: 700; }
  .page-sub { font-size: 13px; color: ${T.muted}; margin-top: 2px; }
  .page-content { padding: 0 32px 32px; }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: ${T.card}; border: 1px solid ${T.border}; border-radius: 12px; padding: 20px; }
  .stat-label { font-size: 11px; color: ${T.muted}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .stat-value { font-size: 28px; font-weight: 700; line-height: 1; }
  .stat-sub { font-size: 12px; color: ${T.muted}; margin-top: 4px; }
  .green { color: ${T.green}; }
  .red { color: ${T.red}; }
  .amber { color: ${T.amber}; }
  .blue { color: ${T.accent}; }

  .card { background: ${T.card}; border: 1px solid ${T.border}; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
  .card-header { padding: 16px 20px; border-bottom: 1px solid ${T.border}; display: flex; align-items: center; justify-content: space-between; }
  .card-title { font-size: 14px; font-weight: 600; }
  .card-body { padding: 20px; }

  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 10px 16px; color: ${T.muted}; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid ${T.border}; }
  td { padding: 12px 16px; border-bottom: 1px solid ${T.border}; color: ${T.text}; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: ${T.surface}; }

  .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
  .badge-green { background: ${T.greenDim}; color: ${T.green}; }
  .badge-red { background: ${T.redDim}; color: ${T.red}; }
  .badge-amber { background: ${T.amberDim}; color: ${T.amber}; }
  .badge-blue { background: ${T.accentDim}; color: ${T.accent}; }
  .badge-gray { background: ${T.surface}; color: ${T.muted}; }

  .drop-zone { border: 2px dashed ${T.border}; border-radius: 12px; padding: 48px 32px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .drop-zone:hover, .drop-zone.drag-over { border-color: ${T.accent}; background: ${T.accentDim}; }
  .drop-zone-icon { font-size: 36px; margin-bottom: 12px; }
  .drop-zone-text { font-size: 15px; font-weight: 500; margin-bottom: 6px; }
  .drop-zone-sub { font-size: 13px; color: ${T.muted}; }

  .audio-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid ${T.border}; }
  .audio-row:last-child { border-bottom: none; }
  .audio-label { font-size: 14px; font-weight: 500; }
  .audio-key { font-size: 11px; color: ${T.muted}; font-family: monospace; margin-top: 2px; }
  .audio-actions { display: flex; gap: 8px; align-items: center; }
  .audio-status { font-size: 11px; color: ${T.green}; }

  .filter-row { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
  .filter-select { background: ${T.surface}; border: 1px solid ${T.border}; border-radius: 7px; padding: 7px 12px; color: ${T.text}; font-size: 13px; outline: none; cursor: pointer; }
  .filter-select:focus { border-color: ${T.accent}; }

  .empty-state { text-align: center; padding: 48px; color: ${T.muted}; }
  .empty-state-icon { font-size: 36px; margin-bottom: 12px; }
  .empty-state-text { font-size: 15px; font-weight: 500; margin-bottom: 6px; color: ${T.text}; }
  .empty-state-sub { font-size: 13px; }

  .toast { position: fixed; bottom: 24px; right: 24px; background: ${T.card}; border: 1px solid ${T.border}; border-radius: 10px; padding: 14px 18px; font-size: 13px; z-index: 999; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); animation: slideUp 0.2s ease; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .progress-bar { height: 4px; background: ${T.border}; border-radius: 2px; overflow: hidden; margin-top: 8px; }
  .progress-fill { height: 100%; background: ${T.accent}; border-radius: 2px; transition: width 0.3s; }

  .tag { display: inline-block; background: ${T.accentDim}; color: ${T.accent}; border-radius: 4px; padding: 2px 7px; font-size: 11px; font-weight: 500; margin-right: 4px; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; }
  .modal { background: ${T.card}; border: 1px solid ${T.border}; border-radius: 14px; padding: 28px; width: 440px; max-width: 90vw; }
  .modal-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
  .modal-sub { font-size: 13px; color: ${T.muted}; margin-bottom: 20px; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
`;

// ================================================
// TOAST
// ================================================
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
  return (
    <div className="toast">
      {icon} {msg}
    </div>
  );
}

// ================================================
// DISPOSITION BADGE
// ================================================
function DisposBadge({ sub }) {
  const map = {
    INTERESTED: ["badge-green", "Interested"],
    NOT_INTERESTED: ["badge-red", "Not Interested"],
    NO_RESPONSE: ["badge-amber", "No Response"],
    INVALID_INPUT: ["badge-amber", "Invalid Input"],
    BUSY: ["badge-gray", "Busy"],
    FAILED: ["badge-gray", "Failed"],
    CALL_DISCONNECTED: ["badge-blue", "Disconnected"],
    PENDING: ["badge-gray", "Pending"],
    CALLED: ["badge-blue", "Called"],
  };
  const [cls, label] = map[sub] || ["badge-gray", sub];
  return <span className={`badge ${cls}`}>{label}</span>;
}

// ================================================
// LOGIN PAGE
// ================================================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      const session = await signIn(email, password);
      onLogin(session);
    } catch (e) {
      setError(e.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-logo">VCatch</div>
        <div className="login-sub">HR Portal — Sign in to continue</div>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hr@company.com"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
        <button className="btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        {error && <div className="err">{error}</div>}
      </div>
    </div>
  );
}

// ================================================
// DASHBOARD
// ================================================
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [logs, leads] = await Promise.all([
        dbSelect("call_logs", "?select=sub_disposition"),
        dbSelect("leads", "?select=status"),
      ]);

      const total = logs.length;
      const interested = logs.filter((l) => l.sub_disposition === "INTERESTED").length;
      const notInterested = logs.filter((l) => l.sub_disposition === "NOT_INTERESTED").length;
      const notConnected = logs.filter((l) =>
        ["BUSY", "FAILED"].includes(l.sub_disposition)
      ).length;
      const pending = leads.filter((l) => l.status === "PENDING").length;

      setStats({ total, interested, notInterested, notConnected, pending });

      const recent = await dbSelect(
        "call_logs",
        "?select=phone,campaign,main_disposition,sub_disposition,logged_at&order=logged_at.desc&limit=10"
      );
      setRecentLogs(recent);
    } catch (e) {
      console.error(e);
    }
  }

  const connRate = stats?.total
    ? Math.round(((stats.total - stats.notConnected) / stats.total) * 100)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Live overview of your IVR campaigns</div>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={loadStats}>
          ↻ Refresh
        </button>
      </div>
      <div className="page-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Calls</div>
            <div className="stat-value blue">{stats?.total ?? "—"}</div>
            <div className="stat-sub">All time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Interested</div>
            <div className="stat-value green">{stats?.interested ?? "—"}</div>
            <div className="stat-sub">
              {stats?.total
                ? `${Math.round((stats.interested / stats.total) * 100)}% of connected`
                : ""}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Not Connected</div>
            <div className="stat-value red">{stats?.notConnected ?? "—"}</div>
            <div className="stat-sub">Busy + Failed</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Leads</div>
            <div className="stat-value amber">{stats?.pending ?? "—"}</div>
            <div className="stat-sub">Awaiting call</div>
          </div>
        </div>

        {stats && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div className="card-title">Connection Rate</div>
              <span style={{ fontSize: 13, color: T.accent, fontWeight: 600 }}>
                {connRate}%
              </span>
            </div>
            <div className="card-body">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${connRate}%` }} />
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Calls</div>
          </div>
          <div className="table-wrap">
            {recentLogs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📞</div>
                <div className="empty-state-text">No calls yet</div>
                <div className="empty-state-sub">Call logs will appear here</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Phone</th>
                    <th>Campaign</th>
                    <th>Result</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: "monospace" }}>{log.phone}</td>
                      <td>
                        <span className="tag">{log.campaign}</span>
                      </td>
                      <td>
                        <DisposBadge sub={log.sub_disposition} />
                      </td>
                      <td style={{ color: T.muted, fontSize: 12 }}>
                        {new Date(log.logged_at).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================
// LEADS PAGE
// ================================================
function Leads({ showToast }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [campaign, setCampaign] = useState("");
  const [filterCampaign, setFilterCampaign] = useState("ALL");
  const [campaigns, setCampaigns] = useState([]);
  const fileRef = useRef();

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    try {
      const data = await dbSelect(
        "leads",
        "?select=*&order=uploaded_at.desc&limit=200"
      );
      setLeads(data);
      const unique = [...new Set(data.map((l) => l.campaign).filter(Boolean))];
      setCampaigns(unique);
    } catch (e) {
      showToast("Failed to load leads", "error");
    } finally {
      setLoading(false);
    }
  }

  function parseCSV(text) {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    return lines.slice(1).map((line) => {
      const vals = line.split(",");
      const row = {};
      headers.forEach((h, i) => (row[h] = (vals[i] || "").trim()));
      return row;
    });
  }

  function handleFile(file) {
    if (!file || !file.name.endsWith(".csv")) {
      showToast("Please upload a CSV file", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const rows = parseCSV(e.target.result);
      setPreview(rows.slice(0, 5));
    };
    reader.readAsText(file);
  }

  async function uploadLeads(file) {
    if (!campaign.trim()) {
      showToast("Enter a campaign name first", "error");
      return;
    }
    setUploading(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      const payload = rows
        .filter((r) => r.phone || r.number)
        .map((r) => ({
          name: r.name || r.candidate || "Unknown",
          phone: (r.phone || r.number || "").replace(/\D/g, ""),
          campaign: campaign.trim(),
          status: "PENDING",
        }));

      await dbInsert("leads", payload);
      showToast(`${payload.length} leads uploaded to "${campaign}"`, "success");
      setPreview([]);
      setCampaign("");
      fileRef.current.value = "";
      loadLeads();
    } catch (e) {
      showToast("Upload failed — check for duplicates", "error");
    } finally {
      setUploading(false);
    }
  }

  const filtered =
    filterCampaign === "ALL"
      ? leads
      : leads.filter((l) => l.campaign === filterCampaign);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Leads</div>
          <div className="page-sub">Upload CSV and manage candidate leads</div>
        </div>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Upload Leads CSV</div>
          </div>
          <div className="card-body">
            <div className="field" style={{ marginBottom: 16 }}>
              <label>Campaign Name</label>
              <input
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  color: T.text,
                  fontSize: 14,
                  outline: "none",
                  width: 300,
                }}
                placeholder="e.g. Malayalam Hiring June"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
              />
            </div>
            <div
              className={`drop-zone ${dragOver ? "drag-over" : ""}`}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files[0]);
              }}
            >
              <div className="drop-zone-icon">📂</div>
              <div className="drop-zone-text">Drop CSV here or click to browse</div>
              <div className="drop-zone-sub">
                CSV must have columns: name, phone (or number)
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {preview.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: T.muted,
                    marginBottom: 10,
                    fontWeight: 500,
                  }}
                >
                  Preview (first 5 rows)
                </div>
                <div className="table-wrap" style={{ borderRadius: 8, border: `1px solid ${T.border}` }}>
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(preview[0]).map((k) => (
                          <th key={k}>{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((v, j) => (
                            <td key={j}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                  <button
                    className="btn btn-sm btn-green"
                    disabled={uploading}
                    onClick={() => uploadLeads(fileRef.current.files[0])}
                  >
                    {uploading ? "Uploading..." : "✓ Upload Leads"}
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      setPreview([]);
                      fileRef.current.value = "";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">All Leads ({filtered.length})</div>
            <div className="filter-row" style={{ margin: 0 }}>
              <select
                className="filter-select"
                value={filterCampaign}
                onChange={(e) => setFilterCampaign(e.target.value)}
              >
                <option value="ALL">All Campaigns</option>
                {campaigns.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button className="btn btn-sm btn-ghost" onClick={loadLeads}>
                ↻
              </button>
            </div>
          </div>
          <div className="table-wrap">
            {loading ? (
              <div className="empty-state">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <div className="empty-state-text">No leads yet</div>
                <div className="empty-state-sub">Upload a CSV to get started</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Campaign</th>
                    <th>Status</th>
                    <th>Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr key={lead.id}>
                      <td>{lead.name}</td>
                      <td style={{ fontFamily: "monospace" }}>{lead.phone}</td>
                      <td>
                        <span className="tag">{lead.campaign}</span>
                      </td>
                      <td>
                        <DisposBadge sub={lead.status} />
                      </td>
                      <td style={{ color: T.muted, fontSize: 12 }}>
                        {new Date(lead.uploaded_at).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================
// AUDIO MANAGER
// ================================================
function AudioManager({ showToast }) {
  const [audioFiles, setAudioFiles] = useState([]);
  const [editing, setEditing] = useState(null); // { key, label, url }
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAudio();
  }, []);

  async function loadAudio() {
    try {
      const data = await dbSelect("audio_files", "?select=*&order=key");
      setAudioFiles(data);
    } catch (e) {
      showToast("Failed to load audio files", "error");
    }
  }

  async function saveUrl() {
    if (!newUrl.trim()) return;
    setSaving(true);
    try {
      await dbUpdate(
        "audio_files",
        `key=eq.${editing.key}`,
        { url: newUrl.trim(), updated_at: new Date().toISOString() }
      );
      showToast(`${editing.label} updated`, "success");
      setEditing(null);
      setNewUrl("");
      loadAudio();
    } catch (e) {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Audio Manager</div>
          <div className="page-sub">
            Update IVR audio files — changes go live instantly, no restart needed
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <div className="card-title">IVR Audio Files</div>
            <span style={{ fontSize: 12, color: T.muted }}>
              Paste a Cloudinary URL to replace any audio
            </span>
          </div>
          <div className="card-body">
            {audioFiles.map((af) => (
              <div key={af.key} className="audio-row">
                <div>
                  <div className="audio-label">{af.label}</div>
                  <div className="audio-key">{af.key}</div>
                </div>
                <div className="audio-actions">
                  {af.url && af.url !== "YOUR_CLOUDINARY_INTRO_URL" && (
                    <audio controls style={{ height: 32 }} src={af.url} />
                  )}
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      setEditing(af);
                      setNewUrl(af.url);
                    }}
                  >
                    ✏️ Replace
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">How to update audio</div>
          </div>
          <div className="card-body">
            <ol style={{ paddingLeft: 18, lineHeight: 2, fontSize: 13, color: T.muted }}>
              <li>Upload your new MP3 to <strong style={{ color: T.text }}>Cloudinary</strong> (cloudinary.com)</li>
              <li>Copy the public URL of the uploaded file</li>
              <li>Click <strong style={{ color: T.text }}>Replace</strong> on the audio you want to change</li>
              <li>Paste the URL and save — <strong style={{ color: T.green }}>live immediately</strong></li>
            </ol>
          </div>
        </div>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Replace: {editing.label}</div>
            <div className="modal-sub">
              Paste the new Cloudinary URL below. The change goes live as soon as you save.
            </div>
            <div className="field">
              <label>New Audio URL</label>
              <input
                style={{
                  width: "100%",
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  color: T.text,
                  fontSize: 13,
                  outline: "none",
                }}
                placeholder="https://res.cloudinary.com/..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
            {newUrl && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Preview</div>
                <audio controls src={newUrl} style={{ width: "100%" }} />
              </div>
            )}
            <div className="modal-actions">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm"
                disabled={saving || !newUrl.trim()}
                onClick={saveUrl}
              >
                {saving ? "Saving..." : "Save & Go Live"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================================
// CALL LOGS
// ================================================
function CallLogs({ showToast }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDisposition, setFilterDisposition] = useState("ALL");
  const [filterCampaign, setFilterCampaign] = useState("ALL");
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await dbSelect(
        "call_logs",
        "?select=*&order=logged_at.desc&limit=500"
      );
      setLogs(data);
      const unique = [...new Set(data.map((l) => l.campaign).filter(Boolean))];
      setCampaigns(unique);
    } catch (e) {
      showToast("Failed to load logs", "error");
    } finally {
      setLoading(false);
    }
  }

  const filtered = logs.filter((l) => {
    const dMatch =
      filterDisposition === "ALL" || l.sub_disposition === filterDisposition;
    const cMatch =
      filterCampaign === "ALL" || l.campaign === filterCampaign;
    return dMatch && cMatch;
  });

  function exportCSV() {
    const headers = ["phone", "campaign", "main_disposition", "sub_disposition", "logged_at"];
    const rows = filtered.map((l) =>
      headers.map((h) => `"${l[h] || ""}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv," + encodeURIComponent(csv);
    a.download = `call_logs_${Date.now()}.csv`;
    a.click();
    showToast("Exported!", "success");
  }

  const dispositions = [
    "INTERESTED", "NOT_INTERESTED", "NO_RESPONSE",
    "INVALID_INPUT", "BUSY", "FAILED", "CALL_DISCONNECTED",
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Call Logs</div>
          <div className="page-sub">{filtered.length} records</div>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={exportCSV}>
          ↓ Export CSV
        </button>
      </div>
      <div className="page-content">
        <div className="filter-row">
          <select
            className="filter-select"
            value={filterCampaign}
            onChange={(e) => setFilterCampaign(e.target.value)}
          >
            <option value="ALL">All Campaigns</option>
            {campaigns.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={filterDisposition}
            onChange={(e) => setFilterDisposition(e.target.value)}
          >
            <option value="ALL">All Dispositions</option>
            {dispositions.map((d) => (
              <option key={d} value={d}>{d.replace(/_/g, " ")}</option>
            ))}
          </select>
          <button className="btn btn-sm btn-ghost" onClick={loadLogs}>
            ↻ Refresh
          </button>
        </div>

        <div className="card">
          <div className="table-wrap">
            {loading ? (
              <div className="empty-state">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-text">No logs match filters</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Phone</th>
                    <th>Campaign</th>
                    <th>Status</th>
                    <th>Disposition</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontFamily: "monospace" }}>{log.phone}</td>
                      <td>
                        <span className="tag">{log.campaign}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${log.main_disposition === "CONNECTED" ? "badge-green" : "badge-red"}`}
                        >
                          {log.main_disposition}
                        </span>
                      </td>
                      <td>
                        <DisposBadge sub={log.sub_disposition} />
                      </td>
                      <td style={{ color: T.muted, fontSize: 12 }}>
                        {new Date(log.logged_at).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================
// MAIN APP
// ================================================
export default function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sb_session"));
    } catch {
      return null;
    }
  });
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "info") {
    setToast({ msg, type });
  }

  async function handleLogout() {
    await signOut();
    setSession(null);
  }

  if (!session) {
    return (
      <>
        <style>{css}</style>
        <LoginPage onLogin={setSession} />
      </>
    );
  }

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "leads", label: "Leads", icon: "👥" },
    { id: "audio", label: "Audio Manager", icon: "🔊" },
    { id: "logs", label: "Call Logs", icon: "📋" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-brand">
            VCatch
            <span>HR Portal</span>
          </div>
          <nav className="nav">
            {nav.map((n) => (
              <div
                key={n.id}
                className={`nav-item ${page === n.id ? "active" : ""}`}
                onClick={() => setPage(n.id)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-info">{session?.user?.email}</div>
            <button className="btn btn-sm btn-ghost" style={{ width: "100%" }} onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>

        <div className="main">
          {page === "dashboard" && <Dashboard />}
          {page === "leads" && <Leads showToast={showToast} />}
          {page === "audio" && <AudioManager showToast={showToast} />}
          {page === "logs" && <CallLogs showToast={showToast} />}
        </div>
      </div>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
