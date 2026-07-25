import { useState, useEffect, useRef, useCallback } from "react";

const SUPABASE_URL = "https://hndzvwkqveqjzaqegwmp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZHp2d2txdmVxanphcWVnd21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDc2MTksImV4cCI6MjA5Nzc4MzYxOX0.fajgDAY9JjM9jtG1BYkPqzB04hI8D96bJ0Hv5MZrIQ0";
const RENDER_URL = "https://vcatch-ivr-server.onrender.com";

// Helper: today's date in YYYY-MM-DD format
function today() {
  return new Date().toISOString().split("T")[0];
}

// Helper: persist and retrieve filters
function saveFilter(key, value) {
  try { localStorage.setItem("filter_"+key, JSON.stringify(value)); } catch {}
}
function loadFilter(key, defaultVal) {
  try {
    const v = localStorage.getItem("filter_"+key);
    return v !== null ? JSON.parse(v) : defaultVal;
  } catch { return defaultVal; }
}
const LOGO_BASE64 = "data:image/png;base64,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";

// ================================================
// THEME TOKENS
// ================================================
const DARK = {
  bg:"#0A0C11", surface:"#12151D", card:"#171B26", border:"#242938",
  accent:"#6366F1", accentDim:"#1E2036", green:"#34D399", greenDim:"#0D2320",
  red:"#F87171", redDim:"#2A1518", amber:"#FBBF24", amberDim:"#2A2010",
  purple:"#A78BFA", purpleDim:"#211A3A", text:"#EDEFF5", muted:"#7C88A6",
  inputBg:"#12151D", shadow:"rgba(0,0,0,0.35)", shadowLg:"rgba(0,0,0,0.55)", mode:"dark",
};
const LIGHT = {
  bg:"#F6F4EF", surface:"#FFFDF9", card:"#FFFDF9", border:"#E4E1D8",
  accent:"#4F52D9", accentDim:"#ECEDFB", green:"#0E8F63", greenDim:"#E6F7F0",
  red:"#D23C3F", redDim:"#FBEDED", amber:"#B8790A", amberDim:"#FBF1DE",
  purple:"#7238C9", purpleDim:"#F3EEFC", text:"#1C1B18", muted:"#6E6C64",
  inputBg:"#FBFAF6", shadow:"rgba(28,27,24,0.06)", shadowLg:"rgba(28,27,24,0.16)", mode:"light",
};

let T = DARK;

function getThemeCSS(t) {
const ease="cubic-bezier(0.4,0,0.2,1)";
return `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
  body{background:${t.bg};color:${t.text};font-family:'Inter',system-ui,sans-serif;transition:background 0.2s,color 0.2s;font-feature-settings:'tnum' 1,'cv11' 1;letter-spacing:-0.1px;}
  ::-webkit-scrollbar{width:8px;height:8px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;border:2px solid transparent;background-clip:content-box;}::-webkit-scrollbar-thumb:hover{background:${t.muted};background-clip:content-box;}
  .login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:${t.mode==="light"?`radial-gradient(ellipse 80% 60% at 50% -10%, ${t.accentDim}, ${t.bg})`:`radial-gradient(ellipse 80% 60% at 50% -10%, ${t.accentDim}, ${t.bg})`};}
  .login-box{background:${t.card};border:1px solid ${t.border};border-radius:20px;padding:44px;width:400px;box-shadow:0 1px 2px ${t.shadow},0 24px 48px -12px ${t.shadowLg};}
  .login-logo{font-size:24px;font-weight:800;color:${t.accent};margin-bottom:4px;letter-spacing:-0.5px;}
  .login-sub{color:${t.muted};font-size:13px;margin-bottom:32px;}
  .field{margin-bottom:16px;}
  .field label{display:block;font-size:11px;font-weight:600;color:${t.muted};margin-bottom:7px;text-transform:uppercase;letter-spacing:0.6px;}
  .field input,.field select,.field textarea{width:100%;background:${t.inputBg};border:1.5px solid ${t.border};border-radius:9px;padding:10px 14px;color:${t.text};font-size:14px;outline:none;transition:border-color 0.15s ${ease},box-shadow 0.15s ${ease};font-family:'Inter',sans-serif;}
  .field input:hover,.field select:hover,.field textarea:hover{border-color:${t.mode==="light"?"#D5D9E5":"#323952"};}
  .field input:focus,.field select:focus,.field textarea:focus{border-color:${t.accent};box-shadow:0 0 0 3.5px ${t.accentDim};}
  .btn{padding:10px 18px;background:${t.accent};color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;transition:transform 0.15s ${ease},box-shadow 0.15s ${ease},opacity 0.15s ${ease};font-family:'Inter',sans-serif;display:inline-flex;align-items:center;gap:6px;box-shadow:0 1px 2px rgba(0,0,0,0.06),0 0 0 0 ${t.accent};letter-spacing:-0.1px;}
  .btn:hover{transform:translateY(-1px);box-shadow:0 4px 14px -2px ${t.mode==="light"?"rgba(84,87,229,0.35)":"rgba(99,102,241,0.4)"};}
  .btn:active{transform:translateY(0);box-shadow:0 1px 2px rgba(0,0,0,0.06);}
  .btn:disabled{opacity:0.45;cursor:not-allowed;transform:none;box-shadow:none;}
  .btn-sm{padding:7px 14px;font-size:13px;border-radius:7px;}
  .btn-ghost{background:${t.mode==="light"?"#fff":"transparent"};border:1.5px solid ${t.border};color:${t.text};box-shadow:none;}
  .btn-ghost:hover{background:${t.surface};border-color:${t.mode==="light"?"#D5D9E5":"#323952"};box-shadow:0 2px 6px ${t.shadow};}
  .btn-danger{background:${t.red};color:#fff;}
  .btn-danger:hover{box-shadow:0 4px 14px -2px ${t.mode==="light"?"rgba(226,55,59,0.35)":"rgba(248,113,113,0.35)"};}
  .btn-green{background:${t.green};color:#fff;}
  .btn-amber{background:${t.amber};color:#fff;}
  .btn-purple{background:${t.purple};color:#fff;}
  .btn-full{width:100%;justify-content:center;}
  .err{color:${t.red};font-size:13px;margin-top:10px;text-align:center;}
  .warn{color:${t.amber};font-size:12px;margin-top:6px;display:flex;align-items:center;gap:6px;}
  .app{display:flex;height:100vh;overflow:hidden;}
  .sidebar{width:200px;background:${t.surface};border-right:1px solid ${t.border};display:flex;flex-direction:column;flex-shrink:0;overflow:hidden;}
  .sidebar.collapsed{width:0;border-right-color:transparent;}
  .sidebar-toggle{position:fixed;top:14px;left:14px;z-index:30;width:30px;height:30px;border-radius:8px;background:${t.card};border:1px solid ${t.border};color:${t.muted};display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;box-shadow:0 1px 2px ${t.shadow};transition:background 0.15s ${ease},color 0.15s ${ease},left 0.2s ${ease};}
  .sidebar-toggle:hover{background:${t.bg};color:${t.text};}
  .sidebar-header{padding:22px 20px 18px;border-bottom:1px solid ${t.border};}
  .sidebar-brand{font-size:20px;font-weight:800;color:${t.accent};letter-spacing:-0.5px;}
  .sidebar-tagline{font-size:11px;color:${t.muted};margin-top:2px;font-weight:500;}
  .nav{flex:1;padding:14px 0;overflow-y:auto;}
  .nav-section{font-size:10px;font-weight:700;color:${t.muted};text-transform:uppercase;letter-spacing:1.1px;padding:10px 20px 6px;opacity:0.7;}
  .nav-item{position:relative;display:flex;align-items:center;gap:10px;padding:9px 20px 9px 18px;font-size:13px;font-weight:500;color:${t.muted};cursor:pointer;transition:color 0.12s ${ease},background 0.12s ${ease};margin:1px 10px;border-radius:8px;}
  .nav-item:hover{color:${t.text};background:${t.mode==="light"?t.bg:"#181D2A"};}
  .nav-item.active{color:${t.accent};background:${t.accentDim};font-weight:600;box-shadow:inset 2.5px 0 0 ${t.accent};}
  .nav-icon{font-size:15px;width:18px;text-align:center;flex-shrink:0;}
  .sidebar-footer{padding:16px;border-top:1px solid ${t.border};}
  .user-card{background:${t.mode==="light"?t.bg:"#181D2A"};border-radius:11px;padding:12px 13px;margin-bottom:10px;}
  .user-name{font-size:13px;font-weight:600;color:${t.text};margin-bottom:2px;}
  .user-email{font-size:11px;color:${t.muted};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .main{flex:1;overflow-y:auto;background:${t.bg};}
  .page-header{padding:22px 28px 19px;border-bottom:1px solid ${t.border};background:${t.mode==="light"?"rgba(255,255,255,0.85)":"rgba(18,21,29,0.85)"};backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;position:sticky;top:0;z-index:10;}
  .page-title{font-size:19px;font-weight:700;color:${t.text};letter-spacing:-0.3px;}
  .page-sub{font-size:13px;color:${t.muted};margin-top:2px;}
  .page-content{padding:24px 28px;}
  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;}
  .kpi-card{background:${t.card};border:1px solid ${t.border};border-radius:14px;padding:20px;box-shadow:0 1px 2px ${t.shadow};transition:box-shadow 0.2s ${ease},transform 0.2s ${ease};}
  .kpi-card:hover{box-shadow:0 8px 24px -8px ${t.shadowLg};transform:translateY(-2px);}
  .kpi-label{font-size:11px;font-weight:600;color:${t.muted};text-transform:uppercase;letter-spacing:0.6px;margin-bottom:9px;}
  .kpi-value{font-size:30px;font-weight:800;line-height:1;margin-bottom:5px;letter-spacing:-0.5px;}
  .kpi-sub{font-size:12px;color:${t.muted};}
  .card{background:${t.card};border:1px solid ${t.border};border-radius:14px;overflow:hidden;margin-bottom:20px;box-shadow:0 1px 2px ${t.shadow};}
  .card-header{padding:15px 20px;border-bottom:1px solid ${t.border};display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;background:${t.card};}
  .card-title{font-size:14px;font-weight:600;color:${t.text};letter-spacing:-0.1px;}
  .card-body{padding:20px;}
  .table-wrap{overflow-x:auto;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  th{text-align:left;padding:11px 16px;color:${t.muted};font-weight:600;font-size:10.5px;text-transform:uppercase;letter-spacing:0.6px;border-bottom:1px solid ${t.border};background:${t.mode==="light"?"#FBFBFE":"#12151D"};}
  td{padding:13px 16px;border-bottom:1px solid ${t.border};color:${t.text};vertical-align:middle;}
  tr:last-child td{border-bottom:none;}
  tbody tr{transition:background 0.1s ${ease};}
  tbody tr:hover td{background:${t.mode==="light"?"#FAFAFF":"#181D2A"};}
  .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;}
  .badge-green{background:${t.greenDim};color:${t.green};}
  .badge-red{background:${t.redDim};color:${t.red};}
  .badge-amber{background:${t.amberDim};color:${t.amber};}
  .badge-blue{background:${t.accentDim};color:${t.accent};}
  .badge-gray{background:${t.mode==="light"?"#EEF0F5":"#1D222F"};color:${t.muted};}
  .badge-purple{background:${t.purpleDim};color:${t.purple};}
  .drop-zone{border:2px dashed ${t.border};border-radius:14px;padding:40px 32px;text-align:center;cursor:pointer;transition:all 0.2s ${ease};background:${t.mode==="light"?"#FBFBFE":"#12151D"};}
  .drop-zone:hover,.drop-zone.drag-over{border-color:${t.accent};background:${t.accentDim};}
  .drop-zone-icon{font-size:32px;margin-bottom:10px;}
  .drop-zone-text{font-size:15px;font-weight:600;color:${t.text};margin-bottom:4px;}
  .drop-zone-sub{font-size:13px;color:${t.muted};}
  .audio-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid ${t.border};}
  .audio-row:last-child{border-bottom:none;}
  .filter-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
  .filter-select,.filter-input{background:${t.inputBg};border:1.5px solid ${t.border};border-radius:8px;padding:7px 12px;color:${t.text};font-size:13px;outline:none;font-family:'Inter',sans-serif;transition:border-color 0.15s ${ease};}
  .filter-select:hover,.filter-input:hover{border-color:${t.mode==="light"?"#D5D9E5":"#323952"};}
  .filter-select:focus,.filter-input:focus{border-color:${t.accent};}
  .empty-state{text-align:center;padding:52px;color:${t.muted};}
  .empty-icon{font-size:40px;margin-bottom:12px;opacity:0.6;}
  .empty-title{font-size:15px;font-weight:600;color:${t.text};margin-bottom:6px;}
  .empty-sub{font-size:13px;}
  .toast{position:fixed;bottom:24px;right:24px;background:${t.card};border:1px solid ${t.border};border-radius:13px;padding:14px 18px;font-size:13px;z-index:999;display:flex;align-items:center;gap:10px;box-shadow:0 12px 32px -8px ${t.shadowLg};animation:slideUp 0.25s ${ease};max-width:360px;}
  @keyframes slideUp{from{transform:translateY(12px) scale(0.98);opacity:0;}to{transform:translateY(0) scale(1);opacity:1;}}
  .progress-bar{height:6px;background:${t.border};border-radius:3px;overflow:hidden;}
  .progress-fill{height:100%;background:${t.accent};border-radius:3px;transition:width 0.4s ${ease};}
  .tag{display:inline-block;background:${t.accentDim};color:${t.accent};border-radius:6px;padding:2px 8px;font-size:11px;font-weight:600;}
  .modal-overlay{position:fixed;inset:0;background:${t.mode==="light"?"rgba(15,17,23,0.35)":"rgba(0,0,0,0.6)"};display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);animation:fadeIn 0.15s ${ease};}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  .modal{background:${t.card};border:1px solid ${t.border};border-radius:18px;padding:28px;width:500px;max-width:95vw;max-height:90vh;overflow-y:auto;box-shadow:0 1px 2px ${t.shadow},0 32px 64px -16px ${t.shadowLg};animation:modalIn 0.2s ${ease};}
  @keyframes modalIn{from{transform:translateY(8px) scale(0.98);opacity:0;}to{transform:translateY(0) scale(1);opacity:1;}}
  .modal-title{font-size:18px;font-weight:700;margin-bottom:4px;color:${t.text};letter-spacing:-0.3px;}
  .modal-sub{font-size:13px;color:${t.muted};margin-bottom:20px;}
  .modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:24px;}
  .live-dot{width:8px;height:8px;border-radius:50%;background:${t.green};display:inline-block;animation:pulse 1.5s infinite;flex-shrink:0;box-shadow:0 0 0 3px ${t.greenDim};}
  .live-dot.off{background:${t.muted};animation:none;box-shadow:none;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
  .input-row{display:flex;gap:8px;align-items:flex-end;}
  .input-row .field{flex:1;margin-bottom:0;}
  .section-label{font-size:11px;font-weight:600;color:${t.muted};text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;margin-top:16px;}
  .info-box{border-radius:9px;padding:10px 14px;font-size:13px;margin-bottom:12px;}
  .info-box.amber{background:${t.amberDim};border:1px solid ${t.amber}55;color:${t.amber};}
  .info-box.green{background:${t.greenDim};border:1px solid ${t.green}55;color:${t.green};}
  .info-box.red{background:${t.redDim};border:1px solid ${t.red}55;color:${t.red};}
  .info-box.blue{background:${t.accentDim};border:1px solid ${t.accent}55;color:${t.accent};}
  .theme-toggle{background:${t.mode==="light"?"#fff":"transparent"};border:1.5px solid ${t.border};border-radius:9px;padding:7px 12px;cursor:pointer;font-size:13px;color:${t.muted};display:flex;align-items:center;gap:6px;transition:all 0.15s ${ease};}
  .theme-toggle:hover{border-color:${t.accent};color:${t.accent};}
  .stat-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid ${t.border};}
  .stat-row:last-child{border-bottom:none;}
  .reject-row{background:${t.redDim};border-radius:8px;padding:8px 12px;margin-bottom:6px;font-size:12px;display:flex;align-items:center;justify-content:space-between;}
  .dialer-bar{background:${t.card};border:1px solid ${t.border};border-radius:14px;padding:14px 20px;display:flex;align-items:center;gap:16px;margin-bottom:20px;box-shadow:0 1px 2px ${t.shadow};}
  .green{color:${t.green};} .red{color:${t.red};} .amber{color:${t.amber};} .blue{color:${t.accent};} .purple{color:${t.purple};}
`;
}

// ================================================
// API UTILITIES
// ================================================
const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12h absolute session cap — re-login required after this regardless of activity

async function refreshSession() {
  try {
    const session = JSON.parse(localStorage.getItem("sb_session") || "null");
    if (!session?.refresh_token) return null;
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    if (!res.ok) { localStorage.removeItem("sb_session"); return null; }
    const data = await res.json();
    const merged = { ...data, login_at: session.login_at || Date.now() };
    localStorage.setItem("sb_session", JSON.stringify(merged));
    return merged;
  } catch { return null; }
}

async function getValidSession() {
  const session = JSON.parse(localStorage.getItem("sb_session") || "null");
  if (!session) return null;
  if (session.login_at && Date.now() - session.login_at > SESSION_MAX_AGE_MS) {
    localStorage.removeItem("sb_session");
    localStorage.removeItem("sb_role");
    window.location.reload();
    return null;
  }
  if (!session.expires_at || Date.now() / 1000 >= session.expires_at - 60) {
    return await refreshSession();
  }
  return session;
}

async function supaFetch(path, options = {}) {
  let session = await getValidSession();
  if (!session && !path.includes("/auth/v1/token")) {
    localStorage.removeItem("sb_session");
    localStorage.removeItem("sb_role");
    window.location.reload();
    return;
  }
  const headers = {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${SUPABASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || data?.error_description || "Request failed");
  return data;
}

async function renderFetch(path, options = {}) {
  const session = await getValidSession();
  const res = await fetch(`${RENDER_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

async function signIn(email, password) {
  const data = await supaFetch("/auth/v1/token?grant_type=password", {
    method: "POST", body: JSON.stringify({ email, password }),
  });
  const dataWithLoginAt = { ...data, login_at: Date.now() };
  localStorage.setItem("sb_session", JSON.stringify(dataWithLoginAt));
  try {
    const roleData = await supaFetch(`/rest/v1/user_roles?email=eq.${encodeURIComponent(email)}&select=role,name&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${data.access_token}` }
    });
    localStorage.setItem("sb_role", JSON.stringify(roleData?.[0] || { role: "HR", name: email }));
  } catch {
    localStorage.setItem("sb_role", JSON.stringify({ role: "HR", name: email }));
  }
  return dataWithLoginAt;
}

async function signOut() {
  const s = JSON.parse(localStorage.getItem("sb_session") || "null");
  if (s?.access_token) {
    try { await supaFetch("/auth/v1/logout", { method: "POST", headers: { Authorization: `Bearer ${s.access_token}` } }); } catch {}
  }
  localStorage.removeItem("sb_session");
  localStorage.removeItem("sb_role");
}

function getEmail() { try { return JSON.parse(localStorage.getItem("sb_session"))?.user?.email || ""; } catch { return ""; } }
function getRole() { try { return JSON.parse(localStorage.getItem("sb_role"))?.role || "HR"; } catch { return "HR"; } }
function getRoleName() { try { return JSON.parse(localStorage.getItem("sb_role"))?.name || getEmail(); } catch { return getEmail(); } }
function isAdmin() { return getRole() === "ADMIN"; }
function isManager() { return ["ADMIN","MANAGER"].includes(getRole()); }

async function dbSelect(table, params = "") { return supaFetch(`/rest/v1/${table}${params}`, { headers: { Prefer: "return=representation" } }); }
async function dbInsert(table, body) { return supaFetch(`/rest/v1/${table}`, { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(body) }); }
async function dbUpdate(table, match, body) { return supaFetch(`/rest/v1/${table}?${match}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(body) }); }
async function dbDelete(table, match) { return supaFetch(`/rest/v1/${table}?${match}`, { method: "DELETE" }); }

function downloadCSV(filename, headers, rows) {
  const bom = "\uFEFF";
  const csv = bom + [headers.join(","), ...rows.map(r => r.map(v => `"${(v??"")}"`).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = filename; a.click();
}

function splitCSVLine(line){
  // Quote-aware split \u2014 a raw line.split(",") breaks on quoted fields
  // containing commas (e.g. a name like "Doe, John"), silently misaligning
  // every column after it.
  const result=[];let cur="";let inQuotes=false;
  for(let i=0;i<line.length;i++){
    const c=line[i];
    if(c==='"'){
      if(inQuotes && line[i+1]==='"'){cur+='"';i++;}
      else{inQuotes=!inQuotes;}
    }else if(c===","&&!inQuotes){
      result.push(cur);cur="";
    }else{
      cur+=c;
    }
  }
  result.push(cur);
  return result;
}

function parseCSV(text){
  const lines=text.trim().split("\n");
  const headers=splitCSVLine(lines[0]).map(h=>h.trim().toLowerCase());
  return lines.slice(1).filter(l=>l.trim()).map(line=>{
    const vals=splitCSVLine(line);const row={};
    headers.forEach((h,i)=>row[h]=(vals[i]||"").trim());
    return row;
  });
}

// ================================================
// SHARED COMPONENTS
// ================================================
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const icons = { success:"✅", error:"❌", info:"ℹ️", warn:"⚠️" };
  return <div className="toast">{icons[type]||"ℹ️"} {msg}</div>;
}

function DisposBadge({ sub }) {
  const map = {
    INTERESTED:["badge-green","Interested"], NOT_INTERESTED:["badge-red","Not Interested"],
    NO_RESPONSE:["badge-amber","No Response"], INVALID_INPUT:["badge-amber","Invalid Input"],
    BUSY:["badge-gray","Busy"], FAILED:["badge-gray","Failed"],
    CALL_DISCONNECTED:["badge-blue","Disconnected"], PENDING:["badge-gray","Pending"],
    CALLED:["badge-blue","Called"], CALLED_FINAL:["badge-blue","Completed"],
    RETRY:["badge-amber","Retry"], SKIPPED:["badge-gray","Skipped"],
    PICKED_UP:["badge-green","Picked Up"], REJECTED:["badge-red","Rejected"],
    HIRED:["badge-purple","Hired"], RUNNING:["badge-green","Running"],
    PAUSED:["badge-amber","Paused"], COMPLETED:["badge-blue","Completed"],
  };
  const [cls,label] = map[sub]||["badge-gray", sub||"—"];
  return <span className={`badge ${cls}`}>{label}</span>;
}

function Modal({ title, sub, onClose, children, actions }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        {title && <div className="modal-title">{title}</div>}
        {sub && <div className="modal-sub">{sub}</div>}
        {children}
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}

// ================================================
// LOGIN PAGE
// ================================================
function LoginPage({ onLogin }) {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [showForgot,setShowForgot]=useState(false);
  const [resetEmail,setResetEmail]=useState("");
  const [resetSent,setResetSent]=useState(false);
  const [resetLoading,setResetLoading]=useState(false);

  async function handleLogin(){
    setLoading(true);setError("");
    try{const s=await signIn(email,password);onLogin(s);}
    catch(e){setError(e.message||"Invalid email or password");}
    finally{setLoading(false);}
  }

  async function handleForgot(){
    if(!resetEmail.trim()){setError("Enter your email");return;}
    setResetLoading(true);setError("");
    try{
      await fetch(`${RENDER_URL}/auth/reset-password`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:resetEmail.trim().toLowerCase()})
      });
      setResetSent(true);
    }catch(e){setError("Failed to send reset email. Try again.");}
    finally{setResetLoading(false);}
  }

  if(showForgot) return(
    <div className="login-wrap">
      <div className="login-box">
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{background:"#fff",borderRadius:12,padding:"12px 24px",display:"inline-block",marginBottom:8}}>
            <img src={LOGO_BASE64} alt="VCatch" style={{height:36,display:"block"}}/>
          </div>
        </div>
        {resetSent?(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:12}}>✓</div>
            <div style={{fontWeight:600,fontSize:16,color:T.green,marginBottom:8}}>Reset email sent</div>
            <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Check your inbox for a password reset link.</div>
            <button className="btn btn-ghost btn-full" onClick={()=>{setShowForgot(false);setResetSent(false);setResetEmail("");}}>Back to login</button>
          </div>
        ):(
          <>
            <div style={{fontWeight:600,fontSize:16,marginBottom:4}}>Reset your password</div>
            <div style={{fontSize:13,color:T.muted,marginBottom:20}}>Enter your email and we'll send you a reset link.</div>
            <div className="field"><label>Email</label><input type="email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} placeholder="manuraj@vcatch.in" onKeyDown={e=>e.key==="Enter"&&handleForgot()}/></div>
            {error&&<div className="err" style={{marginBottom:8}}>{error}</div>}
            <button className="btn btn-full" onClick={handleForgot} disabled={resetLoading}>{resetLoading?"Sending...":"Send Reset Link"}</button>
            <button className="btn btn-ghost btn-full" style={{marginTop:8}} onClick={()=>{setShowForgot(false);setError("");}}>Back to login</button>
          </>
        )}
      </div>
    </div>
  );

  return(
    <div className="login-wrap">
      <div className="login-box">
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{background:"#fff",borderRadius:12,padding:"12px 24px",display:"inline-block",marginBottom:8}}>
            <img src={LOGO_BASE64} alt="VCatch" style={{height:36,display:"block"}}/>
          </div>
          <div className="login-sub">Hire Flow VCatch</div>
          <div className="login-sub">Sign in to continue</div>
        </div>
        <div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="manuraj@vcatch.in" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
        <div className="field"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
        <button className="btn btn-full" onClick={handleLogin} disabled={loading} style={{marginTop:8}}>{loading?"Signing in...":"Sign in"}</button>
        {error&&<div className="err">{error}</div>}
        <div style={{textAlign:"center",marginTop:16}}>
          <button style={{background:"none",border:"none",color:T.accent,fontSize:13,cursor:"pointer"}} onClick={()=>{setShowForgot(true);setError("");}}>Forgot password?</button>
        </div>
      </div>
    </div>
  );
}

// ================================================
// DASHBOARD
// ================================================
function Dashboard({ showToast, role }) {
  const [stats,setStats]=useState(null);
  const [dialerStatus,setDialerStatus]=useState(null);
  const [testPhone,setTestPhone]=useState("");
  const [testLoading,setTestLoading]=useState(false);
  const [dateFrom,setDateFrom]=useState("");
  const [dateTo,setDateTo]=useState("");
  const [campaignFilter,setCampaignFilter]=useState("");
  const [campaignList,setCampaignList]=useState([]);
  const [callLogsRaw,setCallLogsRaw]=useState([]);
  const [ivrView,setIvrView]=useState("day");
  const [hfSummary,setHfSummary]=useState(null);
  const [hfUsers,setHfUsers]=useState([]);
  const [hfDateFrom,setHfDateFrom]=useState("");
  const [hfDateTo,setHfDateTo]=useState("");
  const [hfAssignedTo,setHfAssignedTo]=useState("");
  const [hfAssignedInit,setHfAssignedInit]=useState(false);
  const [hfView,setHfView]=useState("day");
  const [hfAttemptEvents,setHfAttemptEvents]=useState([]);
  const [hfHireEvents,setHfHireEvents]=useState([]);
  const [hfRecruiterStats,setHfRecruiterStats]=useState([]);
  const [hfStageBreakdown,setHfStageBreakdown]=useState([]);

  const hfMyUserId=hfUsers.find(u=>u.email===getEmail())?.id;
  const hfReporteeIds=hfUsers.filter(u=>u.manager_id===hfMyUserId).map(u=>u.id);
  const hfAssigneeOptions=role==="ADMIN"?hfUsers:role==="MANAGER"?hfUsers.filter(u=>hfReporteeIds.includes(u.id)||u.id===hfMyUserId):[];

  useEffect(()=>{
    loadAll();
    dbSelect("campaigns","?select=name&order=created_at.desc").then(setCampaignList).catch(()=>{});
    dbSelect("user_roles","?select=id,name,email,role,manager_id").then(setHfUsers).catch(()=>{});
    // Dialer status every 5s
    const dialerInterval=setInterval(loadDialerStatus,5000);
    // Full dashboard auto-refresh every 30s
    const refreshInterval=setInterval(loadStats,30000);
    return()=>{clearInterval(dialerInterval);clearInterval(refreshInterval);};
  },[]);
  useEffect(()=>{loadStats();},[dateFrom,dateTo,campaignFilter]);
  useEffect(()=>{loadHireFlowSummary();},[hfDateFrom,hfDateTo,hfAssignedTo,hfMyUserId]);
  useEffect(()=>{
    // Only plain HR defaults to "just my own cases" — Manager and Admin are
    // there to oversee everyone, so they land on the company-wide aggregate
    // (CEO always does too, and has no filter UI to undo a self-default).
    if(!hfAssignedInit&&hfMyUserId&&role==="HR"){setHfAssignedTo(hfMyUserId);setHfAssignedInit(true);}
  },[hfMyUserId,hfAssignedInit,role]);

  async function loadAll(){await Promise.all([loadStats(),loadDialerStatus(),loadHireFlowSummary()]);}

  async function loadHireFlowSummary(){
    try{
      const [cands,stages,activity]=await Promise.all([
        dbSelect("candidates","?select=id,current_stage_id,assigned_to,assigned_at"),
        dbSelect("funnel_stages","?select=id,name,sort_order,is_exit_stage&order=sort_order"),
        dbSelect("candidate_activity","?select=candidate_id,type,to_stage_id,changed_at&type=in.(CALL_ATTEMPT,STAGE_CHANGE)"),
      ]);
      const stageName=Object.fromEntries(stages.map(s=>[s.id,s.name]));
      const hiredId=stages.find(s=>s.name==="Hired")?.id;
      const interviewId=stages.find(s=>s.name==="Interview Scheduled")?.id;

      const ownerScoped=cands.filter(c=>{
        if(role==="HR")return c.assigned_to===hfMyUserId;
        if(role==="MANAGER"&&!(hfReporteeIds.includes(c.assigned_to)||c.assigned_to===hfMyUserId))return false;
        if(hfAssignedTo&&c.assigned_to!==hfAssignedTo)return false;
        return true;
      });
      const ownerScopedIds=new Set(ownerScoped.map(c=>c.id));

      const scoped=ownerScoped.filter(c=>{
        if(!hfDateFrom&&!hfDateTo)return true;
        if(!c.assigned_at)return false;
        const d=new Date(c.assigned_at).toISOString().split("T")[0];
        if(hfDateFrom&&d<hfDateFrom)return false;
        if(hfDateTo&&d>hfDateTo)return false;
        return true;
      });
      const total=scoped.length;
      const hiredCurrent=scoped.filter(c=>stageName[c.current_stage_id]==="Hired").length;
      const rejected=scoped.filter(c=>stageName[c.current_stage_id]==="Rejected").length;
      const notInterested=scoped.filter(c=>stageName[c.current_stage_id]==="Not Interested").length;
      const inPipeline=total-hiredCurrent-rejected-notInterested;

      setHfStageBreakdown(stages.map(s=>({
        key:s.name,count:scoped.filter(c=>c.current_stage_id===s.id).length,color:s.is_exit_stage?T.purple:T.accent,
      })));

      const inRange=iso=>{
        if(!hfDateFrom&&!hfDateTo)return true;
        const d=new Date(iso).toISOString().split("T")[0];
        if(hfDateFrom&&d<hfDateFrom)return false;
        if(hfDateTo&&d>hfDateTo)return false;
        return true;
      };
      const scopedActivity=activity.filter(a=>ownerScopedIds.has(a.candidate_id)&&inRange(a.changed_at));
      const attemptEvents=scopedActivity.filter(a=>a.type==="CALL_ATTEMPT");
      const interviewEvents=interviewId?scopedActivity.filter(a=>a.type==="STAGE_CHANGE"&&a.to_stage_id===interviewId):[];
      // Bucketed by assigned_at (not the hire's own changed_at) so the trend
      // chart's bars always sum to exactly the Hired KPI below — both use the
      // same assigned-in-range cohort. A candidate hired long after being
      // assigned would otherwise show up in the KPI total but fall outside
      // the visible date buckets, making the chart look like it doesn't add up.
      const hireEventsInRange=scoped.filter(c=>stageName[c.current_stage_id]==="Hired").map(c=>({candidate_id:c.id,changed_at:c.assigned_at}));
      setHfAttemptEvents(attemptEvents);
      setHfHireEvents(hireEventsInRange);

      const hired=hiredCurrent;
      setHfSummary({total,hired,rejected,notInterested,inPipeline,conversion:total?Math.round((hired/total)*100):0,attempted:attemptEvents.length,interviews:interviewEvents.length});

      if(["ADMIN","MANAGER","CEO"].includes(role)){
        const hireCountByCandidate={};
        hireEventsInRange.forEach(h=>{hireCountByCandidate[h.candidate_id]=(hireCountByCandidate[h.candidate_id]||0)+1;});
        const stats=hfUsers.filter(u=>["HR","MANAGER"].includes(u.role)).map(u=>{
          const totalAssigned=cands.filter(c=>c.assigned_to===u.id).length;
          const hiredCount=cands.filter(c=>c.assigned_to===u.id&&hireCountByCandidate[c.id]).length;
          return {id:u.id,name:u.name||u.email,totalAssigned,hired:hiredCount};
        }).filter(r=>r.totalAssigned>0||r.hired>0).sort((a,b)=>b.hired-a.hired||b.totalAssigned-a.totalAssigned);
        setHfRecruiterStats(stats);
      }else{
        setHfRecruiterStats([]);
      }
    }catch(e){}
  }

  async function loadStats(){
    try{
      let p="?select=sub_disposition,logged_at&limit=5000";
      if(dateFrom) p+=`&logged_at=gte.${dateFrom}T00:00:00`;
      if(dateTo) p+=`&logged_at=lte.${dateTo}T23:59:59`;
      if(campaignFilter) p+=`&campaign=eq.${encodeURIComponent(campaignFilter)}`;
      let lp="?select=status";
      if(campaignFilter) lp+=`&campaign=eq.${encodeURIComponent(campaignFilter)}`;
      const [logs,leads]=await Promise.all([dbSelect("call_logs",p),dbSelect("leads",lp)]);
      const byDisp={};
      logs.forEach(l=>{const d=l.sub_disposition;if(d)byDisp[d]=(byDisp[d]||0)+1;});
      setStats({
        total:logs.length,
        interested:byDisp.INTERESTED||0,
        notConnected:(byDisp.BUSY||0)+(byDisp.FAILED||0),
        pending:leads.filter(l=>["PENDING","CALLED"].includes(l.status)).length,
        byDisp,
      });
      setCallLogsRaw(logs);
    }catch(e){}
  }
  async function loadDialerStatus(){try{setDialerStatus(await renderFetch("/campaign/status"));}catch{}}

  async function sendTestCall(){
    if(!testPhone.trim()){showToast("Enter a phone number","error");return;}
    setTestLoading(true);
    try{
      await renderFetch("/test-call",{method:"POST",body:JSON.stringify({phone:testPhone.trim(),campaign:"TEST",bypass_dnd:true})});
      showToast(`Test call sent to ${testPhone}`,"success");setTestPhone("");
    }catch(e){showToast(e.message||"Test call failed","error");}
    finally{setTestLoading(false);}
  }

  const connRate=stats?.total?Math.round(((stats.total-stats.notConnected)/stats.total)*100):0;
  const isActive=dialerStatus?.dialer?.is_active;

  function hfDayKey(iso){return new Date(iso).toISOString().split("T")[0];}
  function hfWeekKey(iso){
    const d=new Date(iso);
    const dow=(d.getUTCDay()+6)%7;
    const monday=new Date(d);monday.setUTCDate(d.getUTCDate()-dow);
    return monday.toISOString().split("T")[0];
  }
  const hfKeyFn=hfView==="day"?hfDayKey:hfWeekKey;
  const hfBuckets=(()=>{
    let from=hfDateFrom,to=hfDateTo;
    if(!from||!to){
      const t=new Date();to=t.toISOString().split("T")[0];
      const f=new Date();f.setDate(t.getDate()-(hfView==="day"?6:55));from=f.toISOString().split("T")[0];
    }
    const keys=[];
    if(hfView==="day"){
      let cur=new Date(from+"T00:00:00Z");const end=new Date(to+"T00:00:00Z");
      while(cur<=end&&keys.length<90){keys.push(cur.toISOString().split("T")[0]);cur.setUTCDate(cur.getUTCDate()+1);}
    }else{
      let cur=new Date(hfWeekKey(from+"T00:00:00Z")+"T00:00:00Z");const end=new Date(hfWeekKey(to+"T00:00:00Z")+"T00:00:00Z");
      while(cur<=end&&keys.length<60){keys.push(cur.toISOString().split("T")[0]);cur.setUTCDate(cur.getUTCDate()+7);}
    }
    const attemptMap={},hireMap={};
    hfAttemptEvents.forEach(a=>{const k=hfKeyFn(a.changed_at);attemptMap[k]=(attemptMap[k]||0)+1;});
    hfHireEvents.forEach(h=>{const k=hfKeyFn(h.changed_at);hireMap[k]=(hireMap[k]||0)+1;});
    const capped=hfView==="day"?keys.slice(-7):keys;
    return capped.map(k=>({key:k,attempted:attemptMap[k]||0,hires:hireMap[k]||0}));
  })();
  function hfFormatLabel(k){
    return hfView==="day"
      ?new Date(k+"T00:00:00Z").toLocaleDateString("en-IN",{day:"2-digit",month:"short"})
      :"Wk "+new Date(k+"T00:00:00Z").toLocaleDateString("en-IN",{day:"2-digit",month:"short"});
  }

  const ivrKeyFn=ivrView==="day"?hfDayKey:hfWeekKey;
  const ivrBuckets=(()=>{
    let from=dateFrom,to=dateTo;
    if(!from||!to){
      const t=new Date();to=t.toISOString().split("T")[0];
      const f=new Date();f.setDate(t.getDate()-(ivrView==="day"?6:55));from=f.toISOString().split("T")[0];
    }
    const keys=[];
    if(ivrView==="day"){
      let cur=new Date(from+"T00:00:00Z");const end=new Date(to+"T00:00:00Z");
      while(cur<=end&&keys.length<90){keys.push(cur.toISOString().split("T")[0]);cur.setUTCDate(cur.getUTCDate()+1);}
    }else{
      let cur=new Date(hfWeekKey(from+"T00:00:00Z")+"T00:00:00Z");const end=new Date(hfWeekKey(to+"T00:00:00Z")+"T00:00:00Z");
      while(cur<=end&&keys.length<60){keys.push(cur.toISOString().split("T")[0]);cur.setUTCDate(cur.getUTCDate()+7);}
    }
    const callMap={},interestedMap={};
    callLogsRaw.forEach(l=>{const k=ivrKeyFn(l.logged_at);callMap[k]=(callMap[k]||0)+1;if(l.sub_disposition==="INTERESTED")interestedMap[k]=(interestedMap[k]||0)+1;});
    const capped=ivrView==="day"?keys.slice(-7):keys;
    return capped.map(k=>({key:k,calls:callMap[k]||0,interested:interestedMap[k]||0}));
  })();
  function ivrFormatLabel(k){
    return ivrView==="day"
      ?new Date(k+"T00:00:00Z").toLocaleDateString("en-IN",{day:"2-digit",month:"short"})
      :"Wk "+new Date(k+"T00:00:00Z").toLocaleDateString("en-IN",{day:"2-digit",month:"short"});
  }

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Dashboard</div><div className="page-sub">Live overview</div></div>
        <button className="btn btn-sm btn-ghost" onClick={loadAll}>↻</button>
      </div>
      <div className="page-content">
        {/* HireFlow Overview */}
        {hfSummary&&(
          <div style={{marginBottom:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:12,paddingBottom:10,borderBottom:`2px solid ${T.accent}`}}>
              <div>
                <div style={{fontSize:16,fontWeight:700,color:T.text}}>Hire Flow Dashboard</div>
                <div style={{fontSize:12,color:T.muted}}>Hiring pipeline snapshot</div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <input type="date" className="filter-input" value={hfDateFrom} onChange={e=>setHfDateFrom(e.target.value)} title="From date"/>
                <input type="date" className="filter-input" value={hfDateTo} onChange={e=>setHfDateTo(e.target.value)} title="To date"/>
                {hfAssigneeOptions.length>0&&(
                  <select className="filter-select" value={hfAssignedTo} onChange={e=>setHfAssignedTo(e.target.value)}>
                    <option value="">{role==="ADMIN"?"Everyone":"My Team"}</option>
                    {hfAssigneeOptions.map(u=><option key={u.id} value={u.id}>{u.id===hfMyUserId?"Me":(u.name||u.email)}</option>)}
                  </select>
                )}
                {(hfDateFrom||hfDateTo)&&<button className="btn btn-sm btn-ghost" onClick={()=>{setHfDateFrom("");setHfDateTo("");}}>All Time</button>}
                <button className="btn btn-sm btn-ghost" onClick={()=>{setHfDateFrom(today());setHfDateTo(today());}}>Today</button>
                <span style={{width:1,height:20,background:T.border,margin:"0 2px"}}/>
                <button className={`btn btn-sm ${hfView==="day"?"":"btn-ghost"}`} onClick={()=>setHfView("day")}>Day-wise</button>
                <button className={`btn btn-sm ${hfView==="week"?"":"btn-ghost"}`} onClick={()=>setHfView("week")}>Week-wise</button>
              </div>
            </div>
            <div className="card" style={{marginBottom:16}}>
              <div className="card-body" style={{padding:"12px 20px"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
                  <div style={{background:T.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:4}}>Total Candidates</div>
                    <div style={{fontSize:20,fontWeight:700,color:T.accent}}>{hfSummary.total}</div>
                  </div>
                  <div style={{background:T.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:4}}>In Pipeline</div>
                    <div style={{fontSize:20,fontWeight:700}}>{hfSummary.inPipeline}</div>
                  </div>
                  <div style={{background:T.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:4}}>Hired</div>
                    <div style={{fontSize:20,fontWeight:700,color:T.green}}>{hfSummary.hired}</div>
                  </div>
                  <div style={{background:T.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:4}}>Rejected</div>
                    <div style={{fontSize:20,fontWeight:700,color:T.red}}>{hfSummary.rejected}</div>
                  </div>
                  <div style={{background:T.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:4}}>Not Interested</div>
                    <div style={{fontSize:20,fontWeight:700,color:T.amber}}>{hfSummary.notInterested}</div>
                  </div>
                  <div style={{background:T.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:4}}>Conversion</div>
                    <div style={{fontSize:20,fontWeight:700,color:T.accent}}>{hfSummary.conversion}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16,marginBottom:16}}>
              <div className="card">
                <div className="card-header"><div className="card-title">Attempted Trend</div></div>
                <div className="card-body"><MiniBarChart data={hfBuckets} valueKey="attempted" color={T.accent} formatLabel={hfFormatLabel}/></div>
              </div>
              <div className="card">
                <div className="card-header"><div className="card-title">Hiring Trend</div></div>
                <div className="card-body"><MiniBarChart data={hfBuckets} valueKey="hires" color={T.green} formatLabel={hfFormatLabel}/></div>
              </div>
            </div>

            {["ADMIN","MANAGER","CEO"].includes(role)&&hfRecruiterStats.length>0&&(
              <div className="card">
                <div className="card-header"><div className="card-title">HR Performance</div><span style={{fontSize:12,color:T.muted}}>Hired is for the selected range; Assigned is current total</span></div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Recruiter</th><th>Assigned</th><th>Hired</th><th>Conversion</th></tr></thead>
                    <tbody>{hfRecruiterStats.map(r=>(
                      <tr key={r.id}>
                        <td style={{fontWeight:500}}>{r.name}</td>
                        <td>{r.totalAssigned}</td>
                        <td style={{color:r.hired?T.green:undefined,fontWeight:r.hired?600:undefined}}>{r.hired}</td>
                        <td>{r.totalAssigned?Math.round((r.hired/r.totalAssigned)*1000)/10:0}%</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* IVR Dashboard */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:12,paddingBottom:10,borderBottom:`2px solid ${T.purple}`}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:T.text}}>IVR Dashboard</div>
            <div style={{fontSize:12,color:T.muted}}>{dateFrom||dateTo?"Filtered period":"All time"} calling activity</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <input type="date" className="filter-input" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} title="From date"/>
            <input type="date" className="filter-input" value={dateTo} onChange={e=>setDateTo(e.target.value)} title="To date"/>
            <select className="filter-select" value={campaignFilter} onChange={e=>setCampaignFilter(e.target.value)}>
              <option value="">All Campaigns</option>
              {campaignList.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            {(dateFrom||dateTo||campaignFilter)&&<button className="btn btn-sm btn-ghost" onClick={()=>{setDateFrom("");setDateTo("");setCampaignFilter("");}}>✕ Clear</button>}
            <span style={{width:1,height:20,background:T.border,margin:"0 2px"}}/>
            <button className={`btn btn-sm ${ivrView==="day"?"":"btn-ghost"}`} onClick={()=>setIvrView("day")}>Day-wise</button>
            <button className={`btn btn-sm ${ivrView==="week"?"":"btn-ghost"}`} onClick={()=>setIvrView("week")}>Week-wise</button>
          </div>
        </div>

        {/* Dialer Status Bar */}
        <div className="dialer-bar">
          <span className={`live-dot ${isActive?"":"off"}`}></span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:isActive?T.green:T.muted}}>{isActive?"Dialer Active":"Dialer Idle"}</div>
            {isActive&&<div style={{fontSize:12,color:T.muted,marginTop:2,display:"flex",alignItems:"center",gap:8}}>
              <span className="tag">{dialerStatus?.dialer?.current_campaign||"—"}</span>
              <span>→</span>
              <span style={{fontFamily:"monospace",color:T.accent,fontWeight:600}}>{dialerStatus?.dialer?.current_phone||"—"}</span>
            </div>}
            {!isActive&&<div style={{fontSize:12,color:T.muted,marginTop:2}}>No campaign running. Go to Campaigns → Start.</div>}
          </div>
          <div className="input-row" style={{gap:8}}>
            <div className="field" style={{marginBottom:0,minWidth:160}}><input value={testPhone} onChange={e=>setTestPhone(e.target.value)} placeholder="Test call number" onKeyDown={e=>e.key==="Enter"&&sendTestCall()} style={{fontSize:13}}/></div>
            <button className="btn btn-sm btn-amber" onClick={sendTestCall} disabled={testLoading} title="Send test call">{testLoading?"...":"Test"}</button>
          </div>
        </div>

        {/* KPIs */}
        <div className="kpi-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))"}}>
          <div className="kpi-card"><div className="kpi-label">Total Calls</div><div className="kpi-value blue">{stats?.total??0}</div><div className="kpi-sub">{dateFrom||dateTo?"Filtered period":"All time"}</div></div>
          <div className="kpi-card"><div className="kpi-label">Interested Cases</div><div className="kpi-value green">{stats?.interested??0}</div><div className="kpi-sub">Out of {stats?.total??0} calls</div></div>
          <div className="kpi-card"><div className="kpi-label">Conversion</div><div className="kpi-value amber">{stats?.total?Math.round(((stats.interested||0)/stats.total)*1000)/10:0}%</div><div className="kpi-sub">Interested / total calls</div></div>
          <div className="kpi-card"><div className="kpi-label">Pending Leads</div><div className="kpi-value amber">{stats?.pending??0}</div><div className="kpi-sub">Awaiting next dial</div></div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16,marginBottom:16}}>
          <div className="card">
            <div className="card-header"><div className="card-title">Calling Trend</div></div>
            <div className="card-body"><MiniBarChart data={ivrBuckets} valueKey="calls" color={T.accent} formatLabel={ivrFormatLabel}/></div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Interested Trend</div></div>
            <div className="card-body"><MiniBarChart data={ivrBuckets} valueKey="interested" color={T.green} formatLabel={ivrFormatLabel}/></div>
          </div>
        </div>

        {/* Disposition Breakdown */}
        {stats&&(()=>{
          const rows=[
            ["Interested",stats.byDisp?.INTERESTED||0,T.green],
            ["Not Interested",stats.byDisp?.NOT_INTERESTED||0,T.red],
            ["No Response",stats.byDisp?.NO_RESPONSE||0,T.amber],
            ["Invalid Input",stats.byDisp?.INVALID_INPUT||0,T.amber],
            ["Disconnected",stats.byDisp?.CALL_DISCONNECTED||0,T.muted],
            ["Busy",stats.byDisp?.BUSY||0,T.muted],
            ["Failed",stats.byDisp?.FAILED||0,T.muted],
            ["Other",Math.max(0,stats.total-["INTERESTED","NOT_INTERESTED","NO_RESPONSE","INVALID_INPUT","CALL_DISCONNECTED","BUSY","FAILED"].reduce((s,k)=>s+(stats.byDisp?.[k]||0),0)),T.muted],
          ].filter(([label,count])=>label!=="Other"||count>0);
          return(
            <div className="card" style={{marginBottom:20}}>
              <div className="card-header">
                <div className="card-title">Disposition Breakdown</div>
                <span style={{fontSize:12,color:T.muted}}>{stats.total} total calls</span>
              </div>
              <div className="card-body" style={{padding:"12px 20px"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                  {rows.map(([label,count,color])=>(
                    <div key={label} style={{background:T.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${T.border}`}}>
                      <div style={{fontSize:11,color:T.muted,marginBottom:4}}>{label}</div>
                      <div style={{fontSize:20,fontWeight:700,color}}>{count}</div>
                      <div style={{fontSize:11,color:T.muted}}>{stats.total?Math.round((count/stats.total)*100):0}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}

// ================================================
// CAMPAIGNS
// ================================================
function Campaigns({ showToast }) {
  const [campaigns,setCampaigns]=useState([]);
  const [callerIds,setCallerIds]=useState([]);
  const [showCreate,setShowCreate]=useState(false);
  const [deleteTarget,setDeleteTarget]=useState(null);
  const [actionLoading,setActionLoading]=useState(null);
  const [form,setForm]=useState({name:"",description:"",caller_id:"",max_retries:1,retry_after_minutes:30});

  useEffect(()=>{load();loadCallerIds();const i=setInterval(load,5000);return()=>clearInterval(i);},[]);

  async function load(){try{setCampaigns(await dbSelect("campaigns","?select=*&order=created_at.desc"));}catch{}}
  async function loadCallerIds(){try{setCallerIds(await dbSelect("caller_ids","?select=*&is_active=eq.true"));}catch{}}

  async function createCampaign(){
    if(!form.name.trim()){showToast("Campaign name required","error");return;}
    try{
      await dbInsert("campaigns",{...form,status:"PENDING",total_leads:0,called_count:0,pending_count:0});
      showToast("Campaign created!","success");
      setShowCreate(false);setForm({name:"",description:"",caller_id:"",max_retries:1,retry_after_minutes:30});
      load();
    }catch(e){showToast("Failed — name may already exist","error");}
  }

  async function startCampaign(name){
    setActionLoading(name+"_start");
    try{await renderFetch("/campaign/start",{method:"POST",body:JSON.stringify({campaign:name})});showToast(`▶ "${name}" started`,"success");load();}
    catch(e){showToast(e.message||"Failed to start","error");}
    finally{setActionLoading(null);}
  }

  async function pauseCampaign(name){
    setActionLoading(name+"_pause");
    try{await renderFetch("/campaign/pause",{method:"POST",body:JSON.stringify({campaign:name})});showToast(`⏸ "${name}" pausing...`,"info");load();}
    catch(e){showToast(e.message||"Failed","error");}
    finally{setActionLoading(null);}
  }

  async function confirmDelete(){
    if(!deleteTarget)return;
    setActionLoading(deleteTarget+"_delete");
    try{await renderFetch("/campaign/delete",{method:"DELETE",body:JSON.stringify({campaign:deleteTarget})});showToast(`Deleted "${deleteTarget}"`,"success");setDeleteTarget(null);load();}
    catch(e){showToast(e.message||"Failed","error");}
    finally{setActionLoading(null);}
  }

  const SYSTEM_CAMPAIGNS=["Recruiter Follow-ups"];
  const systemCampaigns=campaigns.filter(c=>SYSTEM_CAMPAIGNS.includes(c.name));
  const manualCampaigns=campaigns.filter(c=>!SYSTEM_CAMPAIGNS.includes(c.name));
  const hasRunning=manualCampaigns.some(c=>c.status==="RUNNING");

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Campaigns</div><div className="page-sub">Only one can run at a time — use pause/resume to switch</div></div>
        <button className="btn btn-sm" onClick={()=>setShowCreate(true)}>+ New Campaign</button>
      </div>
      <div className="page-content">
        {systemCampaigns.length>0&&(
          <div className="card" style={{marginBottom:16,borderStyle:"dashed"}}>
            <div className="card-header">
              <div className="card-title">Automated — HireFlow</div>
              <span style={{fontSize:12,color:T.muted}}>Runs on its own, nothing to start or pause here</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Campaign</th><th>Status</th><th>Progress</th><th>Settings</th></tr></thead>
                <tbody>{systemCampaigns.map(c=>{
                  const total=c.total_leads||0;const called=c.called_count||0;
                  const pct=total?Math.round((called/total)*100):0;
                  return(
                    <tr key={c.id}>
                      <td>
                        <div style={{fontWeight:600,color:T.text}}>{c.name}</div>
                        {c.description&&<div style={{fontSize:12,color:T.muted,marginTop:2}}>{c.description}</div>}
                      </td>
                      <td><DisposBadge sub={c.status}/></td>
                      <td style={{minWidth:160}}>
                        <div style={{fontSize:12,color:T.muted,marginBottom:6}}>{called} / {total} called ({pct}%)</div>
                        <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`}}/></div>
                        <div style={{fontSize:11,color:T.muted,marginTop:4}}>Pending: {c.pending_count||0}</div>
                      </td>
                      <td style={{fontSize:12}}>
                        <div>Retries: <strong>{c.max_retries}x</strong></div>
                        <div style={{color:T.muted}}>Gap: {c.retry_after_minutes} min</div>
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </div>
        )}
        {hasRunning&&<div className="info-box green" style={{marginBottom:16,display:"flex",alignItems:"center",gap:8}}><span className="live-dot"></span>A campaign is running. Pause it before starting another.</div>}
        <div className="card">
          <div className="table-wrap">
            {manualCampaigns.length===0?(
              <div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No campaigns yet</div><div className="empty-sub">Create a campaign, upload leads, then start dialing</div></div>
            ):(
              <table>
                <thead><tr><th>Campaign</th><th>Status</th><th>Progress</th><th>Settings</th><th>Actions</th></tr></thead>
                <tbody>{manualCampaigns.map(c=>{
                  const total=c.total_leads||0;const called=c.called_count||0;
                  const pct=total?Math.round((called/total)*100):0;
                  const isRunning=c.status==="RUNNING";
                  const canStart=["PENDING","PAUSED"].includes(c.status)&&!hasRunning;
                  return(
                    <tr key={c.id}>
                      <td>
                        <div style={{fontWeight:600,color:T.text}}>{c.name}</div>
                        {c.description&&<div style={{fontSize:12,color:T.muted,marginTop:2}}>{c.description}</div>}
                        {c.caller_id&&<div style={{fontSize:11,color:T.muted,fontFamily:"monospace",marginTop:2}}>{c.caller_id}</div>}
                      </td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          {isRunning&&<span className="live-dot"></span>}
                          <DisposBadge sub={c.status}/>
                        </div>
                      </td>
                      <td style={{minWidth:160}}>
                        <div style={{fontSize:12,color:T.muted,marginBottom:6}}>{called} / {total} called ({pct}%)</div>
                        <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`}}/></div>
                        <div style={{fontSize:11,color:T.muted,marginTop:4}}>Pending: {c.pending_count||0}</div>
                      </td>
                      <td style={{fontSize:12}}>
                        <div>Retries: <strong>{c.max_retries}x</strong></div>
                        <div style={{color:T.muted}}>Gap: {c.retry_after_minutes} min</div>
                      </td>
                      <td>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {canStart&&<button className="btn btn-sm btn-green" onClick={()=>startCampaign(c.name)} disabled={!!actionLoading}>{actionLoading===c.name+"_start"?"...":"Start"}</button>}
                          {isRunning&&<button className="btn btn-sm btn-amber" onClick={()=>pauseCampaign(c.name)} disabled={!!actionLoading}>{actionLoading===c.name+"_pause"?"...":"Pause"}</button>}
                          {!isRunning&&<button className="btn btn-sm btn-ghost" style={{color:T.red,borderColor:T.red}} onClick={()=>setDeleteTarget(c.name)} disabled={!!actionLoading}>Delete</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showCreate&&(
        <Modal title="New Campaign" sub="Settings apply to all leads in this campaign" onClose={()=>setShowCreate(false)}
          actions={<><button className="btn btn-sm btn-ghost" onClick={()=>setShowCreate(false)}>Cancel</button><button className="btn btn-sm" onClick={createCampaign}>Create Campaign</button></>}>
          <div className="field"><label>Campaign Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Malayalam Hiring June"/></div>
          <div className="field"><label>Description</label><input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Brief description (optional)"/></div>
          <div className="field"><label>Caller ID</label>
            <select value={form.caller_id} onChange={e=>setForm({...form,caller_id:e.target.value})}>
              <option value="">Use default active number</option>
              {callerIds.map(c=><option key={c.id} value={c.number}>{c.label} ({c.number})</option>)}
            </select>
          </div>
          <div className="two-col">
            <div className="field"><label>Max Retries per Lead</label><input type="number" min="1" max="10" value={form.max_retries} onChange={e=>setForm({...form,max_retries:parseInt(e.target.value)||1})}/></div>
            <div className="field">
              <label>Retry Gap (minutes)</label>
              <input type="number" min="1" value={form.retry_after_minutes} onChange={e=>setForm({...form,retry_after_minutes:parseInt(e.target.value)||30})}/>
              {form.retry_after_minutes<30&&<div className="warn">Recommended: at least 30 min</div>}
            </div>
          </div>
          <div className="info-box blue" style={{marginTop:8}}>
            With these settings: each lead is dialed up to {form.max_retries} time(s). If a lead doesn't pick up, it will only be redialed after at least {form.retry_after_minutes} minutes have passed since its last call. Other leads in the queue are dialed back-to-back without waiting.
          </div>
        </Modal>
      )}

      {deleteTarget&&(
        <Modal title="Delete Campaign" onClose={()=>setDeleteTarget(null)}
          actions={<><button className="btn btn-sm btn-ghost" onClick={()=>setDeleteTarget(null)}>Cancel</button><button className="btn btn-sm btn-danger" onClick={confirmDelete}>{actionLoading?"Deleting...":"Yes, Delete"}</button></>}>
          <div className="info-box red">This will permanently delete "<strong>{deleteTarget}</strong>" and all its PENDING leads. Called leads and logs are kept.</div>
        </Modal>
      )}
    </div>
  );
}

// ================================================
// LEADS
// ================================================
function Leads({ showToast }) {
  const [leads,setLeads]=useState([]);
  const [campaigns,setCampaigns]=useState([]);
  const [lastCallMap,setLastCallMap]=useState({});
  const [loading,setLoading]=useState(false);
  const [dragOver,setDragOver]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [validRows,setValidRows]=useState([]);
  const [rejectedRows,setRejectedRows]=useState([]);
  const [dndConflicts,setDndConflicts]=useState([]);
  const [duplicates,setDuplicates]=useState([]);
  const [campaign,setCampaign]=useState("");
  const [selectedCampaignData,setSelectedCampaignData]=useState(null);
  const [filterCampaign,setFilterCampaign]=useState("ALL");
  const [filterStatus,setFilterStatus]=useState("ALL");
  const fileRef=useRef();
  const selectedFile=useRef(null);

  useEffect(()=>{loadCampaigns();loadLeads();},[]);

  async function loadCampaigns(){try{setCampaigns(await dbSelect("campaigns","?select=name,max_retries,retry_after_minutes,status&order=created_at.desc"));}catch{}}

  async function loadLeads(camp=filterCampaign){
    setLoading(true);
    try{
      let params="?select=*&order=uploaded_at.desc&limit=500";
      if(camp&&camp!=="ALL") params+=`&campaign=eq.${encodeURIComponent(camp)}`;
      const data=await dbSelect("leads",params);
      setLeads(data);

      // Fetch last call result for each phone number
      const phones=[...new Set(data.map(l=>l.phone).filter(Boolean))];
      if(phones.length){
        const logsParams=`?select=phone,sub_disposition,logged_at&phone=in.(${phones.slice(0,200).join(",")})&order=logged_at.desc`;
        const logs=await dbSelect("call_logs",logsParams);
        // Keep only the latest log per phone
        const map={};
        logs.forEach(l=>{if(!map[l.phone])map[l.phone]=l;});
        setLastCallMap(map);
      }
    }catch(e){showToast("Failed to load leads","error");}
    finally{setLoading(false);}
  }

  function validateRows(rows){
    const valid=[];const rejected=[];
    rows.forEach((row,idx)=>{
      const phone=(row.phone||row.number||"").replace(/\D/g,"");
      const name=row.name||row.candidate||"";
      if(!phone){rejected.push({...row,_reason:"Missing phone number",_line:idx+2});return;}
      if(phone.length!==10){rejected.push({...row,phone,_reason:`Invalid: ${phone.length} digits (need 10)`,_line:idx+2});return;}
      if(!/^\d{10}$/.test(phone)){rejected.push({...row,phone,_reason:"Non-numeric characters",_line:idx+2});return;}
      valid.push({...row,phone,name:name||"Unknown"});
    });
    return{valid,rejected};
  }

  async function handleFile(file){
    if(!file||!file.name.endsWith(".csv")){showToast("Please upload a CSV file","error");return;}
    selectedFile.current=file;
    const text=await file.text();
    const rows=parseCSV(text);
    const{valid,rejected}=validateRows(rows);
    let dndList=[];
    try{const d=await dbSelect("dnd_list","?select=phone");dndList=d.map(r=>r.phone);}catch{}
    setValidRows(valid.filter(r=>!dndList.includes(r.phone)));
    setRejectedRows(rejected);
    setDndConflicts(valid.filter(r=>dndList.includes(r.phone)));
  }

  function downloadTemplate(){
    downloadCSV("vcatch_leads_template.csv",["name","phone"],[["John Doe","9876543210"],["Jane Smith","9123456789"]]);
    showToast("Template downloaded","success");
  }

  async function uploadLeads(){
    if(!campaign){showToast("Select a campaign first","error");return;}
    if(!validRows.length){showToast("No valid leads to upload","error");return;}
    const camp=campaigns.find(c=>c.name===campaign);
    if(camp?.status==="RUNNING"){showToast("Pause the campaign first before adding leads","error");return;}
    setUploading(true);

    try{
      // Check for existing leads in this campaign (duplicate detection)
      const existingRes=await dbSelect("leads",`?select=phone&campaign=eq.${encodeURIComponent(campaign)}`);
      const existingPhones=new Set(existingRes.map(r=>r.phone));
      const duplicates=validRows.filter(r=>existingPhones.has(r.phone));
      const fresh=validRows.filter(r=>!existingPhones.has(r.phone));

      if(duplicates.length>0){
        setDuplicates(duplicates);
        if(!fresh.length){
          showToast(`All ${duplicates.length} numbers already exist in this campaign`,"error");
          setUploading(false);
          return;
        }
        showToast(`${duplicates.length} duplicates skipped, uploading ${fresh.length} new leads`,"warn");
      }

      if(!fresh.length){setUploading(false);return;}

      const now=new Date().toISOString();
      const payload=fresh.map(r=>({
        name:r.name, phone:r.phone, campaign,
        status:"PENDING", attempt_count:0, eligible_at:now,
        max_retries:selectedCampaignData?.max_retries||1,
        retry_after_minutes:selectedCampaignData?.retry_after_minutes||30,
      }));

      await dbInsert("leads",payload);

      // Recalculate campaign counts from DB
      const allLeads=await dbSelect("leads",`?select=status&campaign=eq.${encodeURIComponent(campaign)}`);
      const total=allLeads.length;
      const called=allLeads.filter(l=>l.status==="CALLED_FINAL").length;
      const pending=allLeads.filter(l=>["PENDING","CALLED"].includes(l.status)).length;
      await dbUpdate("campaigns",`name=eq.${encodeURIComponent(campaign)}`,{total_leads:total,called_count:called,pending_count:pending});

      showToast(`${payload.length} leads uploaded to "${campaign}"`,"success");
      setValidRows([]);setRejectedRows([]);setDndConflicts([]);setDuplicates([]);
      setCampaign("");setSelectedCampaignData(null);
      fileRef.current.value="";selectedFile.current=null;
      loadLeads();
    }catch(e){
      console.error(e);
      showToast("Upload failed: "+e.message,"error");
    }
    finally{setUploading(false);}
  }

  const filtered=leads.filter(l=>{
    const cMatch=filterCampaign==="ALL"||l.campaign===filterCampaign;
    const sMatch=filterStatus==="ALL"||l.status===filterStatus;
    return cMatch&&sMatch;
  });

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Leads</div><div className="page-sub">Upload and manage candidate leads per campaign</div></div>
        <button className="btn btn-sm btn-ghost" onClick={downloadTemplate}>Download Template</button>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">Upload Leads CSV</div></div>
          <div className="card-body">
            <div className="two-col" style={{marginBottom:16}}>
              <div className="field">
                <label>Assign to Campaign *</label>
                <select value={campaign} onChange={e=>{setCampaign(e.target.value);setSelectedCampaignData(campaigns.find(c=>c.name===e.target.value)||null);}}>
                  <option value="">— Select campaign —</option>
                  {campaigns.map(c=><option key={c.name} value={c.name} disabled={c.status==="RUNNING"}>{c.name}{c.status==="RUNNING"?" (running — pause first)":""}</option>)}
                </select>
                {campaigns.length===0&&<div className="warn">Create a campaign first</div>}
              </div>
              {selectedCampaignData&&(
                <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,padding:12,fontSize:13}}>
                  <div style={{fontWeight:600,marginBottom:6}}>{selectedCampaignData.name}</div>
                  <div style={{color:T.muted}}>Max retries: <strong style={{color:T.text}}>{selectedCampaignData.max_retries}x</strong></div>
                  <div style={{color:T.muted,marginTop:4}}>Retry gap: <strong style={{color:T.text}}>{selectedCampaignData.retry_after_minutes} min</strong></div>
                </div>
              )}
            </div>
            <div className={`drop-zone ${dragOver?"drag-over":""}`}
              onClick={()=>fileRef.current.click()}
              onDragOver={e=>{e.preventDefault();setDragOver(true);}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}>
              <div className="drop-zone-icon"></div>
              <div className="drop-zone-text">Drop CSV here or click to browse</div>
              <div className="drop-zone-sub">Required columns: name, phone — <span style={{color:T.accent,cursor:"pointer"}} onClick={e=>{e.stopPropagation();downloadTemplate();}}>download template</span></div>
            </div>
            <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>

            {(validRows.length>0||rejectedRows.length>0||dndConflicts.length>0)&&(
              <div style={{marginTop:20}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
                  <div style={{background:T.greenDim,border:`1px solid ${T.green}`,borderRadius:8,padding:12,textAlign:"center"}}>
                    <div style={{fontSize:22,fontWeight:700,color:T.green}}>{validRows.length}</div>
                    <div style={{fontSize:12,color:T.green}}>Valid — Ready to upload</div>
                  </div>
                  <div style={{background:T.redDim,border:`1px solid ${T.red}`,borderRadius:8,padding:12,textAlign:"center"}}>
                    <div style={{fontSize:22,fontWeight:700,color:T.red}}>{rejectedRows.length}</div>
                    <div style={{fontSize:12,color:T.red}}>Rejected — Invalid numbers</div>
                  </div>
                  <div style={{background:T.amberDim,border:`1px solid ${T.amber}`,borderRadius:8,padding:12,textAlign:"center"}}>
                    <div style={{fontSize:22,fontWeight:700,color:T.amber}}>{dndConflicts.length}</div>
                    <div style={{fontSize:12,color:T.amber}}>DND — Will be skipped</div>
                  </div>
                  <div style={{background:T.purpleDim,border:`1px solid ${T.purple}`,borderRadius:8,padding:12,textAlign:"center"}}>
                    <div style={{fontSize:22,fontWeight:700,color:T.purple}}>{duplicates.length}</div>
                    <div style={{fontSize:12,color:T.purple}}>Already in campaign</div>
                  </div>
                </div>
                {rejectedRows.length>0&&(
                  <div style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontSize:13,fontWeight:600,color:T.red}}>Rejected Numbers</span>
                      <button className="btn btn-sm btn-danger" onClick={()=>downloadCSV(`rejected_${Date.now()}.csv`,["name","phone","reason"],rejectedRows.map(r=>[r.name||"",r.phone||"",r._reason]))}>Download to Fix</button>
                    </div>
                    {rejectedRows.slice(0,3).map((r,i)=>(
                      <div key={i} className="reject-row">
                        <span style={{fontFamily:"monospace"}}>{r.phone||"—"}</span>
                        <span style={{color:T.red,fontSize:11}}>{r._reason}</span>
                      </div>
                    ))}
                    {rejectedRows.length>3&&<div style={{fontSize:12,color:T.muted,marginTop:4}}>+{rejectedRows.length-3} more. Download to see all.</div>}
                  </div>
                )}
                {validRows.length>0&&(
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn btn-sm btn-green" disabled={uploading||!campaign} onClick={uploadLeads}>{uploading?"Uploading...":`Upload ${validRows.length} leads`}</button>
                    <button className="btn btn-sm btn-ghost" onClick={()=>{setValidRows([]);setRejectedRows([]);setDndConflicts([]);fileRef.current.value="";selectedFile.current=null;}}>Cancel</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">All Leads ({filtered.length})</div>
            <div className="filter-row">
              <select className="filter-select" value={filterCampaign} onChange={e=>{setFilterCampaign(e.target.value);loadLeads(e.target.value);}}>
                <option value="ALL">All Campaigns</option>
                {campaigns.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CALLED">Called (retry pending)</option>
                <option value="CALLED_FINAL">Completed</option>
                <option value="SKIPPED">Skipped (DND or Interested elsewhere)</option>
              </select>
              <button className="btn btn-sm btn-ghost" onClick={()=>loadLeads(filterCampaign)}>↻</button>
            </div>
          </div>
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:filtered.length===0?(
              <div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No leads found</div><div className="empty-sub">Upload a CSV to get started</div></div>
            ):(
              <table>
                <thead><tr><th>Name</th><th>Phone</th><th>Campaign</th><th>Status</th><th>Last IVR Result</th><th>Attempts</th><th>Next Eligible</th></tr></thead>
                <tbody>{filtered.map(lead=>(
                  <tr key={lead.id}>
                    <td style={{fontWeight:500}}>{lead.name}</td>
                    <td style={{fontFamily:"monospace"}}>{lead.phone}</td>
                    <td><span className="tag">{lead.campaign}</span></td>
                    <td><DisposBadge sub={lead.status}/></td>
                    <td>{lastCallMap[lead.phone]?<DisposBadge sub={lastCallMap[lead.phone].sub_disposition}/>:<span style={{color:T.muted,fontSize:12}}>—</span>}</td>
                    <td style={{fontSize:12}}>{lead.attempt_count||0} / {lead.max_retries||1}</td>
                    <td style={{color:T.muted,fontSize:12}}>
                      {lead.eligible_at&&lead.status==="CALLED"?new Date(lead.eligible_at).toLocaleString("en-IN"):"—"}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================
// INTERESTED CANDIDATES
// ================================================
function InterestedCandidates({ showToast }) {
  const [candidates,setCandidates]=useState([]);
  const [updates,setUpdates]=useState({});
  const [loading,setLoading]=useState(false);
  const [selected,setSelected]=useState(null);
  const [updateForm,setUpdateForm]=useState({status:"PENDING",comment:""});
  const [saving,setSaving]=useState(false);
  const [filterCampaign,setFilterCampaign]=useState(()=>loadFilter("cand_campaign","ALL"));
  const [filterStatus,setFilterStatus]=useState(()=>loadFilter("cand_status","PENDING"));
  const [filterFrom,setFilterFrom]=useState(today());
  const [filterTo,setFilterTo]=useState(today());
  const [campaigns,setCampaigns]=useState([]);

  useEffect(()=>{load();},[]);

  async function load(){
    setLoading(true);
    try{
      const [logs,updatesData]=await Promise.all([
        dbSelect("call_logs","?select=phone,campaign,logged_at&sub_disposition=eq.INTERESTED&order=logged_at.desc"),
        dbSelect("candidate_updates","?select=*&order=updated_at.desc"),
      ]);

      // Dedupe by phone — keep most recent occurrence, track all campaigns
      const byPhone={};
      logs.forEach(l=>{
        if(!byPhone[l.phone]){
          byPhone[l.phone]={phone:l.phone,campaign:l.campaign,logged_at:l.logged_at,allCampaigns:[l.campaign]};
        }else{
          if(!byPhone[l.phone].allCampaigns.includes(l.campaign)){
            byPhone[l.phone].allCampaigns.push(l.campaign);
          }
        }
      });
      const dedupedLogs=Object.values(byPhone);

      const phones=[...new Set(dedupedLogs.map(l=>l.phone))];
      let leadsMap={};
      if(phones.length){
        const leads=await dbSelect("leads",`?select=phone,name&phone=in.(${phones.slice(0,50).join(",")})`);
        leads.forEach(l=>leadsMap[l.phone]=l.name);
      }
      const enriched=dedupedLogs.map(l=>({...l,name:leadsMap[l.phone]||"Unknown"}));
      setCandidates(enriched);
      setCampaigns([...new Set(logs.map(c=>c.campaign).filter(Boolean))]);
      const updMap={};
      updatesData.forEach(u=>{if(!updMap[u.phone])updMap[u.phone]=[];updMap[u.phone].push(u);});
      setUpdates(updMap);
    }catch(e){showToast("Failed to load","error");}
    finally{setLoading(false);}
  }

  async function saveUpdate(){
    if(!selected)return;
    setSaving(true);
    try{
      await dbInsert("candidate_updates",{phone:selected.phone,candidate_name:selected.name,campaign:selected.campaign,status:updateForm.status,comment:updateForm.comment,updated_by:getEmail()});
      showToast("Update saved","success");setSelected(null);setUpdateForm({status:"PENDING",comment:""});load();
    }catch(e){showToast("Failed","error");}
    finally{setSaving(false);}
  }

  const [forceDialing,setForceDialing]=useState(null);
  async function forceDial(phone){
    if(!window.confirm(`Force dial ${phone}? This bypasses the "already interested" protection.`)) return;
    setForceDialing(phone);
    try{
      await renderFetch("/test-call",{method:"POST",body:JSON.stringify({phone,campaign:"FORCE_REDIAL",bypass_dnd:true})});
      showToast(`Calling ${phone} now`,"success");
    }catch(e){showToast(e.message||"Failed to dial","error");}
    finally{setForceDialing(null);}
  }

  const filtered=candidates.filter(c=>{
    const cMatch=filterCampaign==="ALL"||(c.allCampaigns||[c.campaign]).includes(filterCampaign);
    const s=updates[c.phone]?.[0]?.status||"PENDING";
    const sMatch=filterStatus==="ALL"||s===filterStatus;
    const date=new Date(c.logged_at);
    const fMatch=!filterFrom||date>=new Date(filterFrom);
    const tMatch=!filterTo||date<=new Date(filterTo+"T23:59:59");
    return cMatch&&sMatch&&fMatch&&tMatch;
  });

  const total=candidates.length;
  const sc={PICKED_UP:0,REJECTED:0,HIRED:0,PENDING:0};
  candidates.forEach(c=>{const s=updates[c.phone]?.[0]?.status||"PENDING";sc[s]=(sc[s]||0)+1;});

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Interested Candidates</div><div className="page-sub">Track follow-ups and interview pipeline</div></div>
        <button className="btn btn-sm btn-ghost" onClick={()=>downloadCSV(`candidates_${Date.now()}.csv`,["Name","Phone","Campaign","Status","Comment","Updated By","Time"],filtered.map(c=>{const u=updates[c.phone]?.[0];return[c.name,c.phone,c.campaign,u?.status||"PENDING",u?.comment||"",u?.updated_by||"",u?.updated_at?new Date(u.updated_at).toLocaleString("en-IN"):""];}))}>Download Report</button>
      </div>
      <div className="page-content">
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
          {[["Total","blue",total],["Picked Up","green",sc.PICKED_UP],["Rejected","red",sc.REJECTED],["Hired","purple",sc.HIRED],["Pending","amber",sc.PENDING]].map(([l,c,v])=>(
            <div key={l} className="kpi-card"><div className="kpi-label">{l}</div><div className={`kpi-value ${c}`}>{v}</div></div>
          ))}
        </div>
        <div className="filter-row" style={{marginBottom:16}}>
          <select className="filter-select" value={filterCampaign} onChange={e=>{setFilterCampaign(e.target.value);saveFilter("cand_campaign",e.target.value);}}>
            <option value="ALL">All Campaigns</option>
            {campaigns.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={filterStatus} onChange={e=>{setFilterStatus(e.target.value);saveFilter("cand_status",e.target.value);}}>
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="REJECTED">Rejected</option>
            <option value="HIRED">Hired</option>
          </select>
          <input type="date" className="filter-input" value={filterFrom} onChange={e=>setFilterFrom(e.target.value)} title="From date"/>
          <span style={{color:T.muted,fontSize:12}}>to</span>
          <input type="date" className="filter-input" value={filterTo} onChange={e=>setFilterTo(e.target.value)} title="To date"/>
          {(filterFrom||filterTo)&&<button className="btn btn-sm btn-ghost" onClick={()=>{setFilterFrom("");setFilterTo("");}}>Clear</button>}
          <button className="btn btn-sm btn-ghost" onClick={load}>↻</button>
        </div>
        <div className="card">
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:filtered.length===0?(
              <div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No interested candidates yet</div><div className="empty-sub">Candidates who press 1 appear here</div></div>
            ):(
              <table>
                <thead><tr><th>Name</th><th>Phone</th><th>Campaign</th><th>Status</th><th>Last Update</th><th>By</th><th></th></tr></thead>
                <tbody>{filtered.map((c,i)=>{const u=updates[c.phone]?.[0];return(
                  <tr key={i}>
                    <td style={{fontWeight:500}}>{c.name}</td>
                    <td style={{fontFamily:"monospace"}}>{c.phone}</td>
                    <td>{(c.allCampaigns||[c.campaign]).map(camp=><span key={camp} className="tag" style={{marginRight:4,marginBottom:2,display:"inline-block"}}>{camp}</span>)}</td>
                    <td><DisposBadge sub={u?.status||"PENDING"}/></td>
                    <td style={{fontSize:12,color:T.muted,maxWidth:180}}>{u?.comment||"—"}</td>
                    <td style={{fontSize:11,color:T.muted}}>{u?.updated_by?.split("@")[0]||"—"}</td>
                    <td style={{display:"flex",gap:6}}>
                      <button className="btn btn-sm btn-purple" onClick={()=>{setSelected(c);setUpdateForm({status:u?.status||"PENDING",comment:""});}}>Update</button>
                      <button className="btn btn-sm btn-ghost" onClick={()=>forceDial(c.phone)} disabled={forceDialing===c.phone} title="Bypass interested protection and call again">{forceDialing===c.phone?"Dialing...":"Force Dial"}</button>
                    </td>
                  </tr>
                );})}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {selected&&(
        <Modal title={`Update: ${selected.name}`} sub={`${selected.phone} · ${selected.campaign}`} onClose={()=>setSelected(null)}
          actions={<><button className="btn btn-sm btn-ghost" onClick={()=>setSelected(null)}>Cancel</button><button className="btn btn-sm btn-purple" onClick={saveUpdate} disabled={saving}>{saving?"Saving...":"Save Update"}</button></>}>
          {updates[selected.phone]?.length>0&&(
            <div style={{marginBottom:16}}>
              <div className="section-label">History</div>
              {updates[selected.phone].map((u,i)=>(
                <div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}><DisposBadge sub={u.status}/><span style={{fontSize:12,color:T.muted}}>by {u.updated_by}</span></div>
                  {u.comment&&<div style={{fontSize:13,color:T.text,marginTop:4,fontStyle:"italic"}}>"{u.comment}"</div>}
                  <div style={{fontSize:11,color:T.muted,marginTop:4}}>{new Date(u.updated_at).toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
          )}
          <div className="section-label">New Update</div>
          <div className="field"><label>Status</label>
            <select value={updateForm.status} onChange={e=>setUpdateForm({...updateForm,status:e.target.value})}>
              <option value="PENDING">Pending</option>
              <option value="PICKED_UP">Picked Up for Interview</option>
              <option value="REJECTED">Rejected</option>
              <option value="HIRED">Hired</option>
            </select>
          </div>
          <div className="field"><label>Comment</label><textarea rows="3" style={{resize:"vertical"}} placeholder="Notes about this candidate..." value={updateForm.comment} onChange={e=>setUpdateForm({...updateForm,comment:e.target.value})}/></div>
          <div style={{fontSize:12,color:T.muted}}>Saving as: <strong>{getEmail()}</strong></div>
        </Modal>
      )}
    </div>
  );
}

// ================================================
// DND LIST
// ================================================
function DndList({ showToast }) {
  const [dnd,setDnd]=useState([]);const [phone,setPhone]=useState("");const [adding,setAdding]=useState(false);
  const [nameMap,setNameMap]=useState({});
  useEffect(()=>{load();},[]);
  async function load(){
    try{
      const data=await dbSelect("dnd_list","?select=*&order=added_at.desc");
      setDnd(data);
      // Fetch names from leads table
      const phones=data.map(d=>d.phone).filter(Boolean);
      if(phones.length){
        const leads=await dbSelect("leads",`?select=phone,name&phone=in.(${phones.slice(0,200).join(",")})`);
        const map={};
        leads.forEach(l=>{if(!map[l.phone])map[l.phone]=l.name;});
        setNameMap(map);
      }
    }catch{showToast("Failed","error");}
  }
  async function addDnd(){
    const clean=phone.replace(/\D/g,"");
    if(!clean||clean.length!==10){showToast("Enter a valid 10-digit number","error");return;}
    setAdding(true);
    try{await dbInsert("dnd_list",{phone:clean,reason:"MANUAL"});showToast(`${clean} blocked`,"success");setPhone("");load();}
    catch{showToast("Already in DND or failed","error");}
    finally{setAdding(false);}
  }
  async function remove(p){try{await dbDelete("dnd_list",`phone=eq.${p}`);showToast("Removed","success");load();}catch{showToast("Failed","error");}}
  return(
    <div>
      <div className="page-header"><div><div className="page-title">DND List</div><div className="page-sub">Blocked numbers — Not Interested responses auto-added</div></div></div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">Block a Number</div></div>
          <div className="card-body">
            <div className="input-row">
              <div className="field"><label>Phone Number</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="9876543210" onKeyDown={e=>e.key==="Enter"&&addDnd()}/></div>
              <button className="btn btn-sm btn-danger" onClick={addDnd} disabled={adding}>{adding?"Adding...":"Block"}</button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Blocked Numbers ({dnd.length})</div><button className="btn btn-sm btn-ghost" onClick={load}>↻</button></div>
          <div className="table-wrap">
            {dnd.length===0?<div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No numbers blocked</div></div>:(
              <table>
                <thead><tr><th>Name</th><th>Phone</th><th>Reason</th><th>Added</th><th></th></tr></thead>
                <tbody>{dnd.map(d=>(
                  <tr key={d.id}>
                    <td style={{fontWeight:500}}>{nameMap[d.phone]||"—"}</td>
                    <td style={{fontFamily:"monospace"}}>{d.phone}</td>
                    <td><DisposBadge sub={d.reason==="NOT_INTERESTED"?"NOT_INTERESTED":"MANUAL"}/></td>
                    <td style={{color:T.muted,fontSize:12}}>{new Date(d.added_at).toLocaleDateString("en-IN")}</td>
                    <td><button className="btn btn-sm btn-ghost" onClick={()=>remove(d.phone)}>Remove</button></td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================
// CALLER IDS
// ================================================
function CallerIds({ showToast }) {
  const [list,setList]=useState([]);const [number,setNumber]=useState("");const [label,setLabel]=useState("");const [adding,setAdding]=useState(false);
  useEffect(()=>{load();},[]);
  async function load(){try{setList(await dbSelect("caller_ids","?select=*&order=added_at.desc"));}catch{}}
  async function add(){
    const clean=number.replace(/\s/g,"");if(!clean){showToast("Enter a number","error");return;}
    setAdding(true);
    try{await dbInsert("caller_ids",{number:clean,label:label||clean,is_active:true});showToast("Added","success");setNumber("");setLabel("");load();}
    catch{showToast("Already exists or failed","error");}
    finally{setAdding(false);}
  }
  async function toggle(id,cur){try{await dbUpdate("caller_ids",`id=eq.${id}`,{is_active:!cur});load();}catch{showToast("Failed","error");}}
  async function remove(id){try{await dbDelete("caller_ids",`id=eq.${id}`);showToast("Removed","success");load();}catch{showToast("Failed","error");}}
  return(
    <div>
      <div className="page-header"><div><div className="page-title">Caller IDs</div><div className="page-sub">Manage outbound phone numbers</div></div></div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">Add Number</div></div>
          <div className="card-body">
            <div className="two-col" style={{marginBottom:12}}>
              <div className="field"><label>Number (with country code)</label><input value={number} onChange={e=>setNumber(e.target.value)} placeholder="+918071579999"/></div>
              <div className="field"><label>Label</label><input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Primary Number"/></div>
            </div>
            <button className="btn btn-sm" onClick={add} disabled={adding}>{adding?"Adding...":"Add Number"}</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Your Numbers</div><button className="btn btn-sm btn-ghost" onClick={load}>↻</button></div>
          <div className="table-wrap">
            {list.length===0?<div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No numbers yet</div></div>:(
              <table>
                <thead><tr><th>Number</th><th>Label</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{list.map(c=>(
                  <tr key={c.id}>
                    <td style={{fontFamily:"monospace"}}>{c.number}</td>
                    <td>{c.label}</td>
                    <td><span className={`badge ${c.is_active?"badge-green":"badge-gray"}`}>{c.is_active?"Active":"Inactive"}</span></td>
                    <td style={{display:"flex",gap:6}}>
                      <button className="btn btn-sm btn-ghost" onClick={()=>toggle(c.id,c.is_active)}>{c.is_active?"Deactivate":"Activate"}</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>remove(c.id)}>Remove</button>
                    </td>
                  </tr>
                ))}</tbody>
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
  const [files,setFiles]=useState([]);const [editing,setEditing]=useState(null);const [newUrl,setNewUrl]=useState("");const [saving,setSaving]=useState(false);
  useEffect(()=>{load();},[]);
  async function load(){try{setFiles(await dbSelect("audio_files","?select=*&order=key"));}catch{showToast("Failed","error");}}
  async function save(){
    setSaving(true);
    try{await dbUpdate("audio_files",`key=eq.${editing.key}`,{url:newUrl.trim(),updated_at:new Date().toISOString()});showToast(`${editing.label} updated`,"success");setEditing(null);setNewUrl("");load();}
    catch{showToast("Failed","error");}
    finally{setSaving(false);}
  }
  return(
    <div>
      <div className="page-header"><div><div className="page-title">Audio Manager</div><div className="page-sub">Update IVR audio — changes go live instantly, no restart needed</div></div></div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">IVR Audio Files</div></div>
          <div className="card-body">
            {files.map(f=>(
              <div key={f.key} className="audio-row">
                <div><div style={{fontWeight:500,fontSize:14}}>{f.label}</div><div style={{fontSize:11,color:T.muted,fontFamily:"monospace"}}>{f.key}</div></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {f.url&&!f.url.includes("YOUR_")&&<audio controls style={{height:30}} src={f.url}/>}
                  <button className="btn btn-sm btn-ghost" onClick={()=>{setEditing(f);setNewUrl(f.url);}}>Replace</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {editing&&(
        <Modal title={`Replace: ${editing.label}`} sub="Paste Cloudinary URL. Goes live immediately after save." onClose={()=>setEditing(null)}
          actions={<><button className="btn btn-sm btn-ghost" onClick={()=>setEditing(null)}>Cancel</button><button className="btn btn-sm" disabled={saving||!newUrl.trim()} onClick={save}>{saving?"Saving...":"Save & Go Live"}</button></>}>
          <div className="field"><label>New Audio URL</label><input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="https://res.cloudinary.com/..."/></div>
          {newUrl&&<audio controls src={newUrl} style={{width:"100%",marginTop:10}}/>}
        </Modal>
      )}
    </div>
  );
}

// ================================================
// CALL LOGS
// ================================================
function CallLogs({ showToast }) {
  const [logs,setLogs]=useState([]);const [loading,setLoading]=useState(false);
  const [fd,setFd]=useState("");
  const [td,setTd]=useState("");
  const [fc,setFc]=useState(()=>loadFilter("logs_campaign","ALL"));
  const [fds,setFds]=useState(()=>loadFilter("logs_disp","ALL"));
  const [limit,setLimit]=useState(()=>loadFilter("logs_limit","ALL"));
  const [campaigns,setCampaigns]=useState([]);

  useEffect(()=>{load();},[]);

  async function load(){
    setLoading(true);
    try{
      const data=await dbSelect("call_logs","?select=*&order=logged_at.desc&limit=2000");
      setLogs(data);setCampaigns([...new Set(data.map(l=>l.campaign).filter(Boolean))]);
      if(data.length>=2000)showToast("Showing the most recent 2000 records — narrow the date range for a complete export","warn");
    }catch{showToast("Failed","error");}
    finally{setLoading(false);}
  }

  function quickRange(days){
    const to=new Date();
    const from=new Date();from.setDate(to.getDate()-(days-1));
    setFd(from.toISOString().split("T")[0]);
    setTd(to.toISOString().split("T")[0]);
  }

  const filtered=logs.filter(l=>{
    const cM=fc==="ALL"||l.campaign===fc;
    const dM=fds==="ALL"||l.sub_disposition===fds;
    const date=new Date(l.logged_at);
    const sM=!fd||date>=new Date(fd);
    const eM=!td||date<=new Date(td+"T23:59:59");
    return cM&&dM&&sM&&eM;
  });
  const display=limit==="ALL"?filtered:filtered.slice(0,parseInt(limit));

  function doExport(){
    downloadCSV(`vcatch_logs_${fc}_${Date.now()}.csv`,["Phone","Campaign","Main","Disposition","Date"],display.map(l=>[l.phone,l.campaign,l.main_disposition,l.sub_disposition,new Date(l.logged_at).toLocaleString("en-IN")]));
    showToast(`Exported ${display.length} rows`,"success");
  }

  const summary=filtered.reduce((a,l)=>{a[l.sub_disposition]=(a[l.sub_disposition]||0)+1;return a;},{});
  const dispositions=["INTERESTED","NOT_INTERESTED","NO_RESPONSE","INVALID_INPUT","BUSY","FAILED","CALL_DISCONNECTED"];

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Call Logs & Reports</div><div className="page-sub">{filtered.length} records match filters</div></div>
        <div style={{display:"flex",gap:8}}>
          <select className="filter-select" value={limit} onChange={e=>setLimit(e.target.value)}>
            <option value="50">50 rows</option><option value="100">100 rows</option>
            <option value="500">500 rows</option><option value="ALL">All rows</option>
          </select>
          <button className="btn btn-sm btn-ghost" onClick={doExport}>Download CSV</button>
        </div>
      </div>
      <div className="page-content">
        {fc!=="ALL"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
            {[["INTERESTED",T.green],["NOT_INTERESTED",T.red],["BUSY",T.amber],["FAILED",T.muted]].map(([k,c])=>(
              <div key={k} className="kpi-card">
                <div className="kpi-label">{k.replace(/_/g," ")}</div>
                <div className="kpi-value" style={{color:c,fontSize:22}}>{summary[k]||0}</div>
                <div className="kpi-sub">{filtered.length?`${Math.round(((summary[k]||0)/filtered.length)*100)}%`:""}</div>
              </div>
            ))}
          </div>
        )}
        <div className="filter-row" style={{marginBottom:16}}>
          <select className="filter-select" value={fc} onChange={e=>setFc(e.target.value)}>
            <option value="ALL">All Campaigns</option>
            {campaigns.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={fds} onChange={e=>setFds(e.target.value)}>
            <option value="ALL">All Dispositions</option>
            {dispositions.map(d=><option key={d} value={d}>{d.replace(/_/g," ")}</option>)}
          </select>
          <input type="date" className="filter-input" value={fd} onChange={e=>setFd(e.target.value)} title="From date"/>
          <input type="date" className="filter-input" value={td} onChange={e=>setTd(e.target.value)} title="To date"/>
          <button className="btn btn-sm btn-ghost" onClick={()=>quickRange(7)}>7 Days</button>
          <button className="btn btn-sm btn-ghost" onClick={()=>quickRange(30)}>30 Days</button>
          {(fd||td)&&<button className="btn btn-sm btn-ghost" onClick={()=>{setFd("");setTd("");}}>✕ Clear</button>}
          <button className="btn btn-sm btn-ghost" onClick={load}>↻</button>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Showing {display.length} of {filtered.length}</div></div>
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:display.length===0?(
              <div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No logs match</div></div>
            ):(
              <table>
                <thead><tr><th>Phone</th><th>Campaign</th><th>Status</th><th>Disposition</th><th>Time</th></tr></thead>
                <tbody>{display.map(log=>(
                  <tr key={log.id}>
                    <td style={{fontFamily:"monospace"}}>{log.phone}</td>
                    <td><span className="tag">{log.campaign}</span></td>
                    <td><span className={`badge ${log.main_disposition==="CONNECTED"?"badge-green":"badge-red"}`}>{log.main_disposition}</span></td>
                    <td><DisposBadge sub={log.sub_disposition}/></td>
                    <td style={{color:T.muted,fontSize:12}}>{new Date(log.logged_at).toLocaleString("en-IN")}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================
// USER MANAGEMENT
// ================================================
function UserManagement({ showToast }) {
  const [users,setUsers]=useState([]);const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({email:"",name:"",role:"HR",password:"",manager_id:""});
  const [adding,setAdding]=useState(false);const [resetting,setResetting]=useState(null);

  useEffect(()=>{load();},[]);
  async function load(){setLoading(true);try{setUsers(await dbSelect("user_roles","?select=*&order=created_at.desc"));}catch{showToast("Failed","error");}finally{setLoading(false);}}

  async function createUser(){
    if(!form.email||!form.password){showToast("Email and password required","error");return;}
    if(form.password.length<8){showToast("Password must be at least 8 characters","error");return;}
    setAdding(true);
    try{
      const {manager_id,...createBody}=form;
      const res=await renderFetch("/auth/create-user",{method:"POST",body:JSON.stringify(createBody)});
      // Store user_id (and reporting line, if set) in user_roles so delete works properly
      const patch={};
      if(res.user_id) patch.user_id=res.user_id;
      if(manager_id) patch.manager_id=manager_id;
      if(Object.keys(patch).length){
        await dbUpdate("user_roles",`email=eq.${encodeURIComponent(form.email)}`,patch);
      }
      showToast(`${form.email} created. Password setup email sent.`,"success");
      setForm({email:"",name:"",role:"HR",password:"",manager_id:""});load();
    }catch(e){showToast(e.message||"Failed to create user","error");}
    finally{setAdding(false);}
  }

  async function resetPassword(email){
    setResetting(email);
    try{
      await renderFetch("/auth/reset-password",{method:"POST",body:JSON.stringify({email})});
      showToast(`Reset email sent to ${email}`,"success");
    }catch(e){showToast(e.message||"Failed","error");}
    finally{setResetting(null);}
  }

  async function updateRole(id,role){try{await dbUpdate("user_roles",`id=eq.${id}`,{role});showToast("Role updated","success");load();}catch{showToast("Failed","error");}}
  async function toggleActive(id,cur){try{await dbUpdate("user_roles",`id=eq.${id}`,{is_active:!cur});load();}catch{showToast("Failed","error");}}
  async function updateManager(id,managerId){try{await dbUpdate("user_roles",`id=eq.${id}`,{manager_id:managerId||null});showToast("Reporting line updated","success");load();}catch{showToast("Failed","error");}}

  async function deleteUser(email, userId){
    if(!window.confirm(`Permanently delete ${email}? This cannot be undone.`)) return;
    try{
      await renderFetch("/auth/delete-user",{method:"DELETE",body:JSON.stringify({email, user_id: userId||""})});
      showToast(`${email} deleted`,"success");
      load();
    }catch(e){showToast(e.message||"Failed to delete user","error");}
  }

  const roleColors={ADMIN:T.red,MANAGER:T.accent,HR:T.green,CEO:T.purple};

  return(
    <div>
      <div className="page-header"><div><div className="page-title">User Management</div><div className="page-sub">Create accounts, assign roles, reset passwords</div></div></div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">Create New User</div></div>
          <div className="card-body">
            <div className="two-col" style={{marginBottom:12}}>
              <div className="field"><label>Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name"/></div>
              <div className="field"><label>Email *</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="hr@company.com"/></div>
            </div>
            <div className="two-col" style={{marginBottom:12}}>
              <div className="field"><label>Temporary Password *</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 8 characters"/></div>
              <div className="field"><label>Role</label>
                <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                  <option value="HR">HR</option>
                  <option value="MANAGER">HR Manager</option>
                  <option value="ADMIN">Admin</option>
                  <option value="CEO">CEO (reports only)</option>
                </select>
              </div>
            </div>
            <div className="two-col" style={{marginBottom:12}}>
              <div className="field"><label>Reports To</label>
                <select value={form.manager_id} onChange={e=>setForm({...form,manager_id:e.target.value})}>
                  <option value="">— None —</option>
                  {users.map(u=><option key={u.id} value={u.id}>{u.name||u.email}</option>)}
                </select>
              </div>
            </div>
            <div className="info-box amber" style={{marginBottom:12}}>A password reset email will be sent automatically so the user can set their own password.</div>
            <button className="btn btn-sm" onClick={createUser} disabled={adding}>{adding?"Creating...":"Create User & Send Email"}</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">All Users ({users.length})</div><button className="btn btn-sm btn-ghost" onClick={load}>↻</button></div>
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:users.length===0?<div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No users</div></div>:(
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Change Role</th><th>Reports To</th><th>Actions</th></tr></thead>
                <tbody>{users.map(u=>(
                  <tr key={u.id}>
                    <td style={{fontWeight:500}}>{u.name||"—"}</td>
                    <td style={{fontFamily:"monospace",fontSize:12}}>{u.email}</td>
                    <td><span className="badge" style={{background:`${roleColors[u.role]||T.muted}22`,color:roleColors[u.role]||T.muted}}>{u.role}</span></td>
                    <td><span className={`badge ${u.is_active?"badge-green":"badge-gray"}`}>{u.is_active?"Active":"Inactive"}</span></td>
                    <td>
                      {u.email!==getEmail()?(
                        <select className="filter-select" value={u.role} onChange={e=>updateRole(u.id,e.target.value)} style={{padding:"4px 8px",fontSize:12}}>
                          <option value="HR">HR</option><option value="MANAGER">Manager</option><option value="ADMIN">Admin</option><option value="CEO">CEO</option>
                        </select>
                      ):<span style={{fontSize:12,color:T.muted}}>You</span>}
                    </td>
                    <td>
                      <select className="filter-select" value={u.manager_id||""} onChange={e=>updateManager(u.id,e.target.value)} style={{padding:"4px 8px",fontSize:12}}>
                        <option value="">— None —</option>
                        {users.filter(m=>m.id!==u.id).map(m=><option key={m.id} value={m.id}>{m.name||m.email}</option>)}
                      </select>
                    </td>
                    <td>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <button className="btn btn-sm btn-ghost" onClick={()=>resetPassword(u.email)} disabled={resetting===u.email}>{resetting===u.email?"Sending...":"Reset Password"}</button>
                        {u.email!==getEmail()&&<button className="btn btn-sm btn-ghost" onClick={()=>toggleActive(u.id,u.is_active)}>{u.is_active?"Deactivate":"Activate"}</button>}
                        {u.email!==getEmail()&&<button className="btn btn-sm btn-danger" onClick={()=>deleteUser(u.email, u.user_id)}>Delete</button>}
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Role Permissions</div></div>
          <div className="card-body">
            <table>
              <thead><tr><th>Feature</th><th style={{color:T.red,textAlign:"center"}}>Admin</th><th style={{color:T.accent,textAlign:"center"}}>Manager</th><th style={{color:T.green,textAlign:"center"}}>HR</th></tr></thead>
              <tbody>{[
                ["Dashboard & Call Logs","Done","Done","Done"],
                ["Upload Leads","Done","Done","Done"],
                ["Candidate Updates","Done","Done","Done"],
                ["Start / Pause Campaigns","Done","Done","✗"],
                ["Create / Delete Campaigns","Done","Done","✗"],
                ["Audio Manager","Done","Done","✗"],
                ["Caller IDs & DND","Done","Done","✗"],
                ["User Management","Done","✗","✗"],
              ].map(([f,a,m,h])=>(
                <tr key={f}>
                  <td>{f}</td>
                  <td style={{color:a==="Done"?T.green:T.red,fontWeight:700,textAlign:"center"}}>{a}</td>
                  <td style={{color:m==="Done"?T.green:T.red,fontWeight:700,textAlign:"center"}}>{m}</td>
                  <td style={{color:h==="Done"?T.green:T.red,fontWeight:700,textAlign:"center"}}>{h}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================
// HIREFLOW — REFERENCE LIST ADMIN
// Processes / Position Types / Lead Sources share the same simple
// name + active-toggle shape, same pattern as Caller IDs / Audio Manager.
// ================================================
function SimpleRefList({ table, title, placeholder, showToast }) {
  const [list,setList]=useState([]);const [name,setName]=useState("");const [adding,setAdding]=useState(false);
  useEffect(()=>{load();},[]);
  async function load(){try{setList(await dbSelect(table,"?select=*&order=created_at"));}catch{}}
  async function add(){
    const clean=name.trim();if(!clean){showToast("Enter a name","error");return;}
    setAdding(true);
    try{await dbInsert(table,{name:clean,is_active:true});showToast("Added","success");setName("");load();}
    catch{showToast("Already exists or failed","error");}
    finally{setAdding(false);}
  }
  async function toggle(id,cur){try{await dbUpdate(table,`id=eq.${id}`,{is_active:!cur});load();}catch{showToast("Failed","error");}}
  async function remove(id){
    if(!window.confirm("Remove this entry? Candidates already tagged with it keep the tag — it just won't be selectable for new ones."))return;
    try{await dbDelete(table,`id=eq.${id}`);showToast("Removed","success");load();}catch{showToast("Failed — may be in use","error");}
  }
  return(
    <div className="card">
      <div className="card-header"><div className="card-title">{title}</div></div>
      <div className="card-body">
        <div className="two-col" style={{marginBottom:12,alignItems:"flex-end"}}>
          <div className="field" style={{marginBottom:0}}><label>Add New</label><input value={name} onChange={e=>setName(e.target.value)} placeholder={placeholder} onKeyDown={e=>e.key==="Enter"&&add()}/></div>
          <button className="btn btn-sm" onClick={add} disabled={adding}>{adding?"Adding...":"Add"}</button>
        </div>
        {list.length===0?<div className="empty-state"><div className="empty-title">None yet</div></div>:(
          <table>
            <thead><tr><th>Name</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{list.map(r=>(
              <tr key={r.id}>
                <td style={{fontWeight:500}}>{r.name}</td>
                <td><span className={`badge ${r.is_active?"badge-green":"badge-gray"}`}>{r.is_active?"Active":"Inactive"}</span></td>
                <td style={{display:"flex",gap:6}}>
                  <button className="btn btn-sm btn-ghost" onClick={()=>toggle(r.id,r.is_active)}>{r.is_active?"Deactivate":"Activate"}</button>
                  <button className="btn btn-sm btn-danger" onClick={()=>remove(r.id)}>Remove</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ================================================
// HIREFLOW — FUNNEL STAGES ADMIN
// Ordered list (sort_order), reorderable, is_exit_stage marks terminal
// stages (Hired/Rejected/etc.) reachable from anywhere in the funnel.
// ================================================
function FunnelStagesAdmin({ showToast }) {
  const [stages,setStages]=useState([]);const [name,setName]=useState("");const [isExit,setIsExit]=useState(false);const [adding,setAdding]=useState(false);
  useEffect(()=>{load();},[]);
  async function load(){try{setStages(await dbSelect("funnel_stages","?select=*&order=sort_order"));}catch{}}
  async function add(){
    const clean=name.trim();if(!clean){showToast("Enter a name","error");return;}
    setAdding(true);
    try{
      const nextOrder=stages.length?Math.max(...stages.map(s=>s.sort_order))+1:1;
      await dbInsert("funnel_stages",{name:clean,sort_order:nextOrder,is_exit_stage:isExit,is_active:true});
      showToast("Added","success");setName("");setIsExit(false);load();
    }catch{showToast("Already exists or failed","error");}
    finally{setAdding(false);}
  }
  async function move(idx,dir){
    const target=idx+dir;
    if(target<0||target>=stages.length)return;
    const a=stages[idx],b=stages[target];
    await dbUpdate("funnel_stages",`id=eq.${a.id}`,{sort_order:b.sort_order});
    await dbUpdate("funnel_stages",`id=eq.${b.id}`,{sort_order:a.sort_order});
    load();
  }
  async function toggleExit(id,cur){try{await dbUpdate("funnel_stages",`id=eq.${id}`,{is_exit_stage:!cur});load();}catch{showToast("Failed","error");}}
  async function toggleActive(id,cur){try{await dbUpdate("funnel_stages",`id=eq.${id}`,{is_active:!cur});load();}catch{showToast("Failed","error");}}
  async function remove(id){
    if(!window.confirm("Remove this stage? Candidates currently on it keep the reference — it just won't be selectable for new stage changes."))return;
    try{await dbDelete("funnel_stages",`id=eq.${id}`);showToast("Removed","success");load();}catch{showToast("Failed — may be in use","error");}
  }
  return(
    <div className="card">
      <div className="card-header"><div className="card-title">Funnel Stages</div></div>
      <div className="card-body">
        <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"flex-end",flexWrap:"wrap"}}>
          <div className="field" style={{marginBottom:0,flex:1,minWidth:160}}><label>New Stage Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Background Check" onKeyDown={e=>e.key==="Enter"&&add()}/></div>
          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:T.muted,marginBottom:10}}>
            <input type="checkbox" checked={isExit} onChange={e=>setIsExit(e.target.checked)} style={{width:"auto"}}/> Exit stage (won/lost, reachable from anywhere)
          </label>
          <button className="btn btn-sm" onClick={add} disabled={adding} style={{marginBottom:10}}>{adding?"Adding...":"Add Stage"}</button>
        </div>
        {stages.length===0?<div className="empty-state"><div className="empty-title">No stages yet</div></div>:(
          <table>
            <thead><tr><th>Order</th><th>Name</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{stages.map((s,idx)=>(
              <tr key={s.id}>
                <td style={{display:"flex",gap:4}}>
                  <button className="btn btn-sm btn-ghost" onClick={()=>move(idx,-1)} disabled={idx===0} style={{padding:"2px 8px"}}>↑</button>
                  <button className="btn btn-sm btn-ghost" onClick={()=>move(idx,1)} disabled={idx===stages.length-1} style={{padding:"2px 8px"}}>↓</button>
                </td>
                <td style={{fontWeight:500}}>{s.name}</td>
                <td>
                  <span className="badge" style={{cursor:"pointer",background:s.is_exit_stage?`${T.purple}22`:`${T.accent}22`,color:s.is_exit_stage?T.purple:T.accent}} onClick={()=>toggleExit(s.id,s.is_exit_stage)}>
                    {s.is_exit_stage?"Exit stage":"In-funnel"}
                  </span>
                </td>
                <td><span className={`badge ${s.is_active?"badge-green":"badge-gray"}`} style={{cursor:"pointer"}} onClick={()=>toggleActive(s.id,s.is_active)}>{s.is_active?"Active":"Inactive"}</span></td>
                <td><button className="btn btn-sm btn-danger" onClick={()=>remove(s.id)}>Remove</button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function DialingSettings({ showToast }) {
  const [retryMinutes,setRetryMinutes]=useState("");
  const [maxRetries,setMaxRetries]=useState("");
  const [saving,setSaving]=useState(false);
  useEffect(()=>{load();},[]);
  async function load(){
    try{
      const rows=await dbSelect("settings","?select=*&key=in.(hireflow_retry_minutes,hireflow_max_retries)");
      setRetryMinutes(rows.find(r=>r.key==="hireflow_retry_minutes")?.value||"30");
      setMaxRetries(rows.find(r=>r.key==="hireflow_max_retries")?.value||"3");
    }catch{}
  }
  async function save(){
    setSaving(true);
    try{
      await dbUpdate("settings","key=eq.hireflow_retry_minutes",{value:String(retryMinutes),updated_at:new Date().toISOString()});
      await dbUpdate("settings","key=eq.hireflow_max_retries",{value:String(maxRetries),updated_at:new Date().toISOString()});
      showToast("Saved","success");
    }catch{showToast("Failed to save","error");}
    finally{setSaving(false);}
  }
  return(
    <div className="card">
      <div className="card-header"><div className="card-title">On-the-Spot Dialing</div></div>
      <div className="card-body">
        <div className="two-col" style={{marginBottom:12}}>
          <div className="field"><label>Retry Interval (minutes)</label><input type="number" min="1" value={retryMinutes} onChange={e=>setRetryMinutes(e.target.value)}/></div>
          <div className="field"><label>Max Auto-Retries</label><input type="number" min="0" value={maxRetries} onChange={e=>setMaxRetries(e.target.value)}/></div>
        </div>
        <div className="info-box amber" style={{marginBottom:12}}>When "Send to IVR" doesn't get answered, it's automatically retried this often, up to this many times, before it stops on its own.</div>
        <button className="btn btn-sm" onClick={save} disabled={saving}>{saving?"Saving...":"Save"}</button>
      </div>
    </div>
  );
}

function IVRQueue({ showToast }) {
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(false);
  useEffect(()=>{load();},[]);
  async function load(){
    setLoading(true);
    try{setRows(await dbSelect("candidates","?select=id,name,phone,ivr_retry_count,ivr_next_attempt_at&ivr_next_attempt_at=not.is.null&order=ivr_next_attempt_at"));}
    catch{showToast("Failed to load","error");}
    finally{setLoading(false);}
  }
  async function cancel(id){
    try{await dbUpdate("candidates",`id=eq.${id}`,{ivr_next_attempt_at:null});showToast("Retry cancelled","success");load();}
    catch{showToast("Failed","error");}
  }
  return(
    <div className="card">
      <div className="card-header"><div className="card-title">Pending On-the-Spot Retries ({rows.length})</div><button className="btn btn-sm btn-ghost" onClick={load}>↻</button></div>
      <div className="table-wrap">
        {loading?<div className="empty-state">Loading...</div>:rows.length===0?<div className="empty-state"><div className="empty-title">No pending retries</div><div className="empty-sub">Candidates waiting on an automatic IVR retry show up here — not on the Campaigns page.</div></div>:(
          <table>
            <thead><tr><th>Name</th><th>Phone</th><th>Attempt</th><th>Next Try</th><th>Actions</th></tr></thead>
            <tbody>{rows.map(r=>(
              <tr key={r.id}>
                <td style={{fontWeight:500}}>{r.name}</td>
                <td style={{fontFamily:"monospace"}}>{r.phone}</td>
                <td>{r.ivr_retry_count||0}</td>
                <td style={{fontSize:12,color:T.muted}}>{new Date(r.ivr_next_attempt_at).toLocaleString("en-IN")}</td>
                <td><button className="btn btn-sm btn-danger" onClick={()=>cancel(r.id)}>Cancel Retry</button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ================================================
// POSITION OPENINGS (separate module — Admin/Manager/CEO only)
// ================================================
function PositionOpenings({ showToast }) {
  const [openings,setOpenings]=useState([]);
  const [companies,setCompanies]=useState([]);
  const [processes,setProcesses]=useState([]);
  const [positionTypes,setPositionTypes]=useState([]);
  const [candidates,setCandidates]=useState([]);
  const [hiredCandidates,setHiredCandidates]=useState([]);
  const [linkChoice,setLinkChoice]=useState({});
  const [loading,setLoading]=useState(false);
  const [statusFilter,setStatusFilter]=useState("OPEN");
  const [form,setForm]=useState({company_id:"",process_id:"",position_type_id:"",target_count:1,note:""});
  const [creating,setCreating]=useState(false);
  const myUserId=useRef(null);

  useEffect(()=>{load();},[]);

  async function load(){
    setLoading(true);
    try{
      const [ops,comps,procs,posTypes,users,cands,stages]=await Promise.all([
        dbSelect("position_openings","?select=*&order=created_at.desc"),
        dbSelect("companies","?select=*&order=name"),
        dbSelect("processes","?select=*&order=name"),
        dbSelect("position_types","?select=*&order=name"),
        dbSelect("user_roles","?select=id,name,email"),
        dbSelect("candidates","?select=id,filled_opening_id&filled_opening_id=not.is.null"),
        dbSelect("funnel_stages","?select=id,name"),
      ]);
      setOpenings(ops);setCompanies(comps);setProcesses(procs);setPositionTypes(posTypes);setCandidates(cands);
      const me=users.find(u=>u.email===getEmail());
      myUserId.current=me?.id||null;
      const hiredStageId=stages.find(s=>s.name==="Hired")?.id;
      if(hiredStageId){
        setHiredCandidates(await dbSelect("candidates",`?select=id,name,phone&current_stage_id=eq.${hiredStageId}&filled_opening_id=is.null`));
      }
    }catch(e){showToast("Failed to load position openings","error");}
    finally{setLoading(false);}
  }

  const companyMap=Object.fromEntries(companies.map(c=>[c.id,c.name]));
  const processMap=Object.fromEntries(processes.map(p=>[p.id,p.name]));
  const positionMap=Object.fromEntries(positionTypes.map(p=>[p.id,p.name]));
  const filledCountByOpening={};
  candidates.forEach(c=>{if(c.filled_opening_id)filledCountByOpening[c.filled_opening_id]=(filledCountByOpening[c.filled_opening_id]||0)+1;});
  const openOptions=openings.filter(o=>o.status==="OPEN");
  function openingLabelFor(o){
    return `${companyMap[o.company_id]||"—"} / ${processMap[o.process_id]||"—"} / ${positionMap[o.position_type_id]||"—"}`;
  }

  async function linkHire(candidateId){
    const openingId=linkChoice[candidateId];
    if(!openingId){showToast("Pick an opening first","error");return;}
    try{
      await dbUpdate("candidates",`id=eq.${candidateId}`,{filled_opening_id:openingId});
      const opening=openings.find(o=>o.id===openingId);
      await dbInsert("candidate_activity",{
        candidate_id:candidateId,type:"NOTE",is_contact_attempt:false,
        remark:`Linked to opening: ${companyMap[opening.company_id]} / ${processMap[opening.process_id]} / ${positionMap[opening.position_type_id]}`,
        changed_by:myUserId.current,
      });
      showToast("Linked","success");load();
    }catch{showToast("Failed to link","error");}
  }

  async function createOpening(){
    if(!form.company_id||!form.process_id||!form.position_type_id){showToast("Pick company, process, and position","error");return;}
    if(!form.target_count||form.target_count<1){showToast("Target headcount must be at least 1","error");return;}
    setCreating(true);
    try{
      await dbInsert("position_openings",{
        company_id:form.company_id,process_id:form.process_id,position_type_id:form.position_type_id,
        target_count:Number(form.target_count),note:form.note.trim()||null,status:"OPEN",created_by:myUserId.current,
      });
      showToast("Position opened","success");
      setForm({company_id:"",process_id:"",position_type_id:"",target_count:1,note:""});
      load();
    }catch{showToast("Failed to open position — may already exist","error");}
    finally{setCreating(false);}
  }

  async function closeOpening(id){
    try{await dbUpdate("position_openings",`id=eq.${id}`,{status:"CLOSED",closed_at:new Date().toISOString()});showToast("Closed","success");load();}
    catch{showToast("Failed to close","error");}
  }
  async function reopenOpening(id){
    try{await dbUpdate("position_openings",`id=eq.${id}`,{status:"OPEN",closed_at:null});showToast("Reopened","success");load();}
    catch{showToast("Failed to reopen","error");}
  }

  const filtered=openings.filter(o=>statusFilter==="ALL"||o.status===statusFilter);
  const openCount=openings.filter(o=>o.status==="OPEN").length;
  const openTarget=openings.filter(o=>o.status==="OPEN").reduce((s,o)=>s+o.target_count,0);
  const openFilled=openings.filter(o=>o.status==="OPEN").reduce((s,o)=>s+(filledCountByOpening[o.id]||0),0);

  return(
    <div>
      <div className="page-header"><div><div className="page-title">Position Openings</div><div className="page-sub">Requisitions across all companies — separate from the hiring pipeline</div></div></div>
      <div className="page-content">
            <div className="kpi-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))"}}>
              <div className="kpi-card"><div className="kpi-label">Open Positions</div><div className="kpi-value blue">{openCount}</div><div className="kpi-sub">Requisitions</div></div>
              <div className="kpi-card"><div className="kpi-label">Target Headcount</div><div className="kpi-value amber">{openTarget}</div><div className="kpi-sub">Across open positions</div></div>
              <div className="kpi-card"><div className="kpi-label">Filled So Far</div><div className="kpi-value green">{openFilled}</div><div className="kpi-sub">{openTarget?Math.round((openFilled/openTarget)*100):0}% of target</div></div>
            </div>

            <div className="card" style={{marginBottom:16}}>
              <div className="card-header"><div className="card-title">Open a New Position</div></div>
              <div className="card-body">
                <div className="two-col" style={{marginBottom:12}}>
                  <div className="field"><label>Company *</label>
                    <select value={form.company_id} onChange={e=>setForm({...form,company_id:e.target.value})}>
                      <option value="">—</option>{companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="field"><label>Process *</label>
                    <select value={form.process_id} onChange={e=>setForm({...form,process_id:e.target.value})}>
                      <option value="">—</option>{processes.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="two-col" style={{marginBottom:12}}>
                  <div className="field"><label>Position Type *</label>
                    <select value={form.position_type_id} onChange={e=>setForm({...form,position_type_id:e.target.value})}>
                      <option value="">—</option>{positionTypes.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="field"><label>Target Headcount *</label>
                    <input type="number" min="1" value={form.target_count} onChange={e=>setForm({...form,target_count:e.target.value})}/>
                  </div>
                </div>
                <div className="field" style={{marginBottom:12}}><label>Note (optional)</label><input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="e.g. Urgent — July batch"/></div>
                <button className="btn btn-sm" onClick={createOpening} disabled={creating}>{creating?"Opening...":"Open Position"}</button>
              </div>
            </div>

            {hiredCandidates.length>0&&(
              <div className="card" style={{marginBottom:16}}>
                <div className="card-header">
                  <div className="card-title">Unlinked Hires ({hiredCandidates.length})</div>
                  <span style={{fontSize:12,color:T.muted}}>Hired candidates not yet counted against any opening</span>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Name</th><th>Phone</th><th>Fills Which Opening?</th><th>Actions</th></tr></thead>
                    <tbody>{hiredCandidates.map(c=>(
                      <tr key={c.id}>
                        <td style={{fontWeight:500}}>{c.name}</td>
                        <td style={{fontFamily:"monospace"}}>{c.phone}</td>
                        <td>
                          <select className="filter-select" value={linkChoice[c.id]||""} onChange={e=>setLinkChoice({...linkChoice,[c.id]:e.target.value})}>
                            <option value="">—</option>
                            {openOptions.map(o=><option key={o.id} value={o.id}>{openingLabelFor(o)}</option>)}
                          </select>
                        </td>
                        <td><button className="btn btn-sm btn-ghost" onClick={()=>linkHire(c.id)}>Link</button></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-header">
                <div className="card-title">Positions ({filtered.length})</div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <select className="filter-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                    <option value="ALL">All</option>
                  </select>
                  <button className="btn btn-sm btn-ghost" onClick={load}>↻</button>
                </div>
              </div>
              <div className="table-wrap">
                {loading?<div className="empty-state">Loading...</div>:filtered.length===0?<div className="empty-state"><div className="empty-title">No positions here</div></div>:(
                  <table>
                    <thead><tr><th>Company</th><th>Process</th><th>Position</th><th>Target</th><th>Filled</th><th>Status</th><th>Note</th><th>Actions</th></tr></thead>
                    <tbody>{filtered.map(o=>{
                      const filled=filledCountByOpening[o.id]||0;
                      return(
                        <tr key={o.id}>
                          <td style={{fontWeight:500}}>{companyMap[o.company_id]||"—"}</td>
                          <td>{processMap[o.process_id]||"—"}</td>
                          <td>{positionMap[o.position_type_id]||"—"}</td>
                          <td>{o.target_count}</td>
                          <td style={{color:filled>=o.target_count?T.green:undefined,fontWeight:filled>=o.target_count?600:undefined}}>{filled}</td>
                          <td><span className={`badge ${o.status==="OPEN"?"badge-green":"badge-gray"}`}>{o.status}</span></td>
                          <td style={{fontSize:12,color:T.muted,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={o.note||""}>{o.note||"—"}</td>
                          <td>
                            {o.status==="OPEN"?
                              <button className="btn btn-sm btn-ghost" onClick={()=>closeOpening(o.id)}>Close</button>:
                              <button className="btn btn-sm btn-ghost" onClick={()=>reopenOpening(o.id)}>Reopen</button>
                            }
                          </td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                )}
              </div>
            </div>
      </div>
    </div>
  );
}

function HireFlowSettings({ showToast }) {
  const [tab,setTab]=useState("processes");
  const tabs=[["processes","Processes"],["positions","Position Types"],["companies","Companies"],["sources","Lead Sources"],["reasons","Reasons"],["stages","Funnel Stages"],["dialing","Dialing Settings"],["queue","IVR Queue"]];
  return(
    <div>
      <div className="page-header"><div><div className="page-title">Settings</div><div className="page-sub">Manage the lookup lists used across the hiring funnel</div></div></div>
      <div className="page-content">
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {tabs.map(([id,label])=>(
            <button key={id} className={`btn btn-sm ${tab===id?"":"btn-ghost"}`} onClick={()=>setTab(id)}>{label}</button>
          ))}
        </div>
        {tab==="processes"&&<SimpleRefList table="processes" title="Processes" placeholder="e.g. Cred, Smartcoin, ITI Finance" showToast={showToast}/>}
        {tab==="positions"&&<SimpleRefList table="position_types" title="Position Types" placeholder="e.g. Calling Executive, Field AM" showToast={showToast}/>}
        {tab==="companies"&&<SimpleRefList table="companies" title="Companies" placeholder="e.g. VCatch, Catch, Epoch Pride" showToast={showToast}/>}
        {tab==="sources"&&<SimpleRefList table="lead_sources" title="Lead Sources" placeholder="e.g. Work India, LinkedIn" showToast={showToast}/>}
        {tab==="reasons"&&<SimpleRefList table="rejection_reasons" title="Rejection / Not Interested Reasons" placeholder="e.g. Salary mismatch, Location" showToast={showToast}/>}
        {tab==="stages"&&<FunnelStagesAdmin showToast={showToast}/>}
        {tab==="dialing"&&<DialingSettings showToast={showToast}/>}
        {tab==="queue"&&<IVRQueue showToast={showToast}/>}
      </div>
    </div>
  );
}

// ================================================
// HIREFLOW — CANDIDATE DETAIL MODAL
// ================================================
function CandidateModal({ candidate, processes, positionTypes, leadSources, rejectionReasons, funnelStages, users, onClose, onChanged, showToast }) {
  const [form,setForm]=useState({
    current_salary:candidate.current_salary||"", expected_salary:candidate.expected_salary||"",
    location:candidate.location||"", process_id:candidate.process_id||"", position_type_id:candidate.position_type_id||"",
    source_id:candidate.source_id||"", intent:candidate.intent||"", languages_spoken:candidate.languages_spoken||"",
    english:candidate.language_ratings?.english||"", hindi:candidate.language_ratings?.hindi||"", malayalam:candidate.language_ratings?.malayalam||"",
  });
  const [saving,setSaving]=useState(false);
  const [showDetails,setShowDetails]=useState(false);
  const [activity,setActivity]=useState([]);
  const [newStage,setNewStage]=useState(candidate.current_stage_id||"");
  const [stageRemark,setStageRemark]=useState("");
  const [rejectionReasonId,setRejectionReasonId]=useState("");
  const [interviewAt,setInterviewAt]=useState("");
  const [attemptRemark,setAttemptRemark]=useState("");
  const [reassignTo,setReassignTo]=useState("");
  const [handoffNote,setHandoffNote]=useState("");
  const [sendingToIvr,setSendingToIvr]=useState(false);
  const [busy,setBusy]=useState(false);

  const stageMap=Object.fromEntries(funnelStages.map(s=>[s.id,s]));
  const userMap=Object.fromEntries(users.map(u=>[u.id,u]));
  const myUserId=users.find(u=>u.email===getEmail())?.id;
  const role=getRole();
  const canDirectReassign=["ADMIN","MANAGER"].includes(role);
  const assignableUsers=users.filter(u=>["HR","MANAGER"].includes(u.role));
  const hasPendingRequest=!!candidate.pending_reassign_to;
  const isPendingForMe=candidate.pending_reassign_to===myUserId;
  const isMyOwnPendingRequest=hasPendingRequest&&candidate.assigned_to===myUserId;
  const newStageIsRejected=stageMap[newStage]?.name==="Rejected";
  const newStageIsNotInterested=stageMap[newStage]?.name==="Not Interested";
  const newStageIsInterview=stageMap[newStage]?.name==="Interview Scheduled";
  const newStageIsHired=stageMap[newStage]?.name==="Hired";
  const newStageNeedsReason=newStageIsRejected||newStageIsNotInterested;

  const [openOpenings,setOpenOpenings]=useState([]);
  const [openingCompanies,setOpeningCompanies]=useState([]);
  const [selectedOpeningId,setSelectedOpeningId]=useState("");

  useEffect(()=>{
    loadActivity();
    dbSelect("position_openings","?select=*&status=eq.OPEN").then(setOpenOpenings).catch(()=>{});
    dbSelect("companies","?select=id,name").then(setOpeningCompanies).catch(()=>{});
  },[]);
  async function loadActivity(){
    try{setActivity(await dbSelect("candidate_activity",`?select=*&candidate_id=eq.${candidate.id}&order=changed_at.desc`));}catch{}
  }
  const openingCompanyMap=Object.fromEntries(openingCompanies.map(c=>[c.id,c.name]));
  const openingProcessMap=Object.fromEntries(processes.map(p=>[p.id,p.name]));
  const openingPositionMap=Object.fromEntries(positionTypes.map(p=>[p.id,p.name]));
  function openingLabel(o){
    return `${openingCompanyMap[o.company_id]||"—"} / ${openingProcessMap[o.process_id]||"—"} / ${openingPositionMap[o.position_type_id]||"—"}`;
  }

  async function saveDetails(){
    setSaving(true);
    try{
      await dbUpdate("candidates",`id=eq.${candidate.id}`,{
        current_salary:form.current_salary||null, expected_salary:form.expected_salary||null,
        location:form.location||null, process_id:form.process_id||null, position_type_id:form.position_type_id||null,
        source_id:form.source_id||null, intent:form.intent||null, languages_spoken:form.languages_spoken||null,
        language_ratings:{english:form.english||null,hindi:form.hindi||null,malayalam:form.malayalam||null},
        updated_at:new Date().toISOString(),
      });
      showToast("Details saved","success");
      onChanged();
    }catch{showToast("Failed to save","error");}
    finally{setSaving(false);}
  }

  async function changeStage(){
    if(!newStage||newStage===candidate.current_stage_id){showToast("Pick a different stage first","error");return;}
    if(newStageNeedsReason&&!rejectionReasonId){showToast(newStageIsRejected?"Pick a rejection reason":"Pick a reason","error");return;}
    if(newStageIsInterview&&!interviewAt){showToast("Pick when the interview is scheduled","error");return;}
    setBusy(true);
    try{
      const update={current_stage_id:newStage,updated_at:new Date().toISOString()};
      if(newStageNeedsReason)update.rejection_reason_id=rejectionReasonId;
      if(newStageIsInterview)update.interview_scheduled_at=new Date(interviewAt).toISOString();
      if(newStageIsHired&&selectedOpeningId)update.filled_opening_id=selectedOpeningId;
      await dbUpdate("candidates",`id=eq.${candidate.id}`,update);
      const reasonLabel=newStageNeedsReason?rejectionReasons.find(r=>r.id===rejectionReasonId)?.name:null;
      const interviewLabel=newStageIsInterview?`Interview scheduled for ${new Date(interviewAt).toLocaleString("en-IN")}`:null;
      const openingLabelText=newStageIsHired&&selectedOpeningId?`Fills opening: ${openingLabel(openOpenings.find(o=>o.id===selectedOpeningId))}`:null;
      const remarkParts=[reasonLabel||interviewLabel||openingLabelText,stageRemark.trim()].filter(Boolean);
      await dbInsert("candidate_activity",{
        candidate_id:candidate.id,type:"STAGE_CHANGE",is_contact_attempt:false,
        from_stage_id:candidate.current_stage_id,to_stage_id:newStage,
        remark:remarkParts.length?remarkParts.join(" — "):null,
        changed_by:myUserId,
      });
      showToast("Stage updated","success");setStageRemark("");setRejectionReasonId("");setInterviewAt("");setSelectedOpeningId("");
      onChanged();loadActivity();
    }catch{showToast("Failed to update stage","error");}
    finally{setBusy(false);}
  }

  async function logAttempt(){
    if(!attemptRemark.trim()){showToast("Add a quick note about the call","error");return;}
    setBusy(true);
    try{
      await dbInsert("candidate_activity",{
        candidate_id:candidate.id,type:"CALL_ATTEMPT",is_contact_attempt:true,
        remark:attemptRemark.trim(),changed_by:myUserId,
      });
      showToast("Logged","success");setAttemptRemark("");
      loadActivity();
    }catch{showToast("Failed to log","error");}
    finally{setBusy(false);}
  }

  async function reassign(){
    if(!canDirectReassign){showToast("Only Admin/Manager can reassign directly","error");return;}
    if(!reassignTo||reassignTo===candidate.assigned_to){showToast("Pick a different recruiter first","error");return;}
    setBusy(true);
    try{
      await dbUpdate("candidates",`id=eq.${candidate.id}`,{assigned_to:reassignTo,assigned_at:new Date().toISOString(),pending_reassign_to:null,pending_reassign_note:null,updated_at:new Date().toISOString()});
      await dbInsert("candidate_activity",{
        candidate_id:candidate.id,type:"REASSIGNMENT",is_contact_attempt:false,
        remark:`Reassigned to ${userMap[reassignTo]?.name||userMap[reassignTo]?.email||"—"}`,changed_by:myUserId,
      });
      showToast("Reassigned","success");setReassignTo("");
      onChanged();loadActivity();
    }catch{showToast("Failed to reassign","error");}
    finally{setBusy(false);}
  }

  async function requestHandoff(){
    if(!reassignTo){showToast("Pick a recruiter to hand off to","error");return;}
    setBusy(true);
    try{
      await dbUpdate("candidates",`id=eq.${candidate.id}`,{pending_reassign_to:reassignTo,pending_reassign_note:handoffNote.trim()||null,updated_at:new Date().toISOString()});
      await dbInsert("candidate_activity",{
        candidate_id:candidate.id,type:"REASSIGN_REQUESTED",is_contact_attempt:false,
        remark:`Handoff requested to ${userMap[reassignTo]?.name||userMap[reassignTo]?.email||"—"}${handoffNote.trim()?`: ${handoffNote.trim()}`:""}`,changed_by:myUserId,
      });
      showToast("Handoff requested — waiting for them to accept","success");setReassignTo("");setHandoffNote("");
      onChanged();loadActivity();
    }catch{showToast("Failed to request handoff","error");}
    finally{setBusy(false);}
  }

  async function acceptHandoff(){
    setBusy(true);
    try{
      await dbUpdate("candidates",`id=eq.${candidate.id}`,{assigned_to:myUserId,assigned_at:new Date().toISOString(),pending_reassign_to:null,pending_reassign_note:null,updated_at:new Date().toISOString()});
      await dbInsert("candidate_activity",{
        candidate_id:candidate.id,type:"REASSIGNMENT",is_contact_attempt:false,
        remark:`Handoff accepted by ${userMap[myUserId]?.name||userMap[myUserId]?.email||"—"}`,changed_by:myUserId,
      });
      showToast("Case accepted","success");
      onChanged();loadActivity();
    }catch{showToast("Failed to accept","error");}
    finally{setBusy(false);}
  }

  async function rejectHandoff(){
    setBusy(true);
    try{
      await dbUpdate("candidates",`id=eq.${candidate.id}`,{pending_reassign_to:null,pending_reassign_note:null,updated_at:new Date().toISOString()});
      await dbInsert("candidate_activity",{
        candidate_id:candidate.id,type:"REASSIGN_REJECTED",is_contact_attempt:false,
        remark:`Handoff declined by ${userMap[myUserId]?.name||userMap[myUserId]?.email||"—"}`,changed_by:myUserId,
      });
      showToast("Handoff declined","info");
      onChanged();loadActivity();
    }catch{showToast("Failed to decline","error");}
    finally{setBusy(false);}
  }

  async function cancelHandoff(){
    setBusy(true);
    try{
      await dbUpdate("candidates",`id=eq.${candidate.id}`,{pending_reassign_to:null,pending_reassign_note:null,updated_at:new Date().toISOString()});
      await dbInsert("candidate_activity",{
        candidate_id:candidate.id,type:"NOTE",is_contact_attempt:false,
        remark:"Handoff request cancelled",changed_by:myUserId,
      });
      showToast("Request cancelled","info");
      onChanged();loadActivity();
    }catch{showToast("Failed to cancel","error");}
    finally{setBusy(false);}
  }

  async function sendToIvr(){
    setSendingToIvr(true);
    try{
      const res=await renderFetch("/hireflow/send-to-ivr",{method:"POST",body:JSON.stringify({candidate_id:candidate.id})});
      showToast(res.message||"Scheduled","success");
      onChanged();loadActivity();
    }catch(e){showToast(e.message||"Failed to send to IVR","error");}
    finally{setSendingToIvr(false);}
  }

  const contactCount=activity.filter(a=>a.is_contact_attempt).length;
  const currentStage=stageMap[candidate.current_stage_id];

  return(
    <Modal title={candidate.name} sub={candidate.phone} onClose={onClose} actions={<button className="btn btn-sm btn-ghost" onClick={onClose}>Close</button>}>
      <div className="card" style={{marginBottom:16,borderColor:currentStage?.is_exit_stage?T.purple:T.accent}}>
        <div className="card-body">
          <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",marginBottom:14}}>
            <span className="badge" style={{fontSize:14,padding:"6px 14px",background:currentStage?.is_exit_stage?`${T.purple}22`:`${T.accent}22`,color:currentStage?.is_exit_stage?T.purple:T.accent}}>{currentStage?.name||"No stage"}</span>
            <span className="badge badge-gray">Contacted {contactCount}x</span>
            {candidate.linked_lead_campaign&&<span className="badge badge-green">IVR called before</span>}
          </div>
          <div className="two-col" style={{marginBottom:8}}>
            <div className="field" style={{marginBottom:0}}><label>Move To</label>
              <select value={newStage} onChange={e=>setNewStage(e.target.value)}>
                {funnelStages.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            {newStageNeedsReason?(
              <div className="field" style={{marginBottom:0}}><label>{newStageIsRejected?"Rejection Reason *":"Reason *"}</label>
                <select value={rejectionReasonId} onChange={e=>setRejectionReasonId(e.target.value)}>
                  <option value="">—</option>{rejectionReasons.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            ):newStageIsInterview?(
              <div className="field" style={{marginBottom:0}}><label>Interview Date & Time *</label>
                <input type="datetime-local" value={interviewAt} onChange={e=>setInterviewAt(e.target.value)}/>
              </div>
            ):newStageIsHired?(
              <div className="field" style={{marginBottom:0}}><label>Fills Which Opening? (optional)</label>
                <select value={selectedOpeningId} onChange={e=>setSelectedOpeningId(e.target.value)}>
                  <option value="">— Not linked to an opening —</option>
                  {openOpenings.map(o=><option key={o.id} value={o.id}>{openingLabel(o)}</option>)}
                </select>
              </div>
            ):(
              <div className="field" style={{marginBottom:0}}><label>Remark / Sub-disposition</label><input value={stageRemark} onChange={e=>setStageRemark(e.target.value)} placeholder="Why the stage is changing"/></div>
            )}
          </div>
          {(newStageNeedsReason||newStageIsInterview||newStageIsHired)&&(
            <div className="field" style={{marginBottom:8}}><label>Additional Note (optional)</label><input value={stageRemark} onChange={e=>setStageRemark(e.target.value)} placeholder="Any extra detail"/></div>
          )}
          <button className="btn btn-sm" onClick={changeStage} disabled={busy}>Update Stage</button>
        </div>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="card-header"><div className="card-title">Log a Contact Attempt</div></div>
        <div className="card-body">
          <div className="field"><label>What happened</label><input value={attemptRemark} onChange={e=>setAttemptRemark(e.target.value)} placeholder="e.g. No answer, tried again"/></div>
          <button className="btn btn-sm" onClick={logAttempt} disabled={busy}>Log Attempt</button>
        </div>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="card-header"><div className="card-title">Assignment</div></div>
        <div className="card-body">
          <div style={{marginBottom:12,fontSize:13}}>Currently: <strong>{userMap[candidate.assigned_to]?.name||userMap[candidate.assigned_to]?.email||"Unassigned"}</strong></div>

          {hasPendingRequest&&(
            <div className="info-box amber" style={{marginBottom:12}}>
              {isPendingForMe?(
                <>
                  <div style={{marginBottom:8}}>{userMap[candidate.assigned_to]?.name||userMap[candidate.assigned_to]?.email||"—"} wants to hand this case to you{candidate.pending_reassign_note?`: "${candidate.pending_reassign_note}"`:""}.</div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn btn-sm btn-green" onClick={acceptHandoff} disabled={busy}>Accept</button>
                    <button className="btn btn-sm btn-ghost" onClick={rejectHandoff} disabled={busy}>Decline</button>
                  </div>
                </>
              ):isMyOwnPendingRequest?(
                <>
                  <div style={{marginBottom:8}}>Handoff requested to {userMap[candidate.pending_reassign_to]?.name||userMap[candidate.pending_reassign_to]?.email||"—"} — waiting for them to accept.</div>
                  <button className="btn btn-sm btn-ghost" onClick={cancelHandoff} disabled={busy}>Cancel Request</button>
                </>
              ):(
                <div>Handoff pending: {userMap[candidate.assigned_to]?.name||"—"} → {userMap[candidate.pending_reassign_to]?.name||"—"}</div>
              )}
            </div>
          )}

          {canDirectReassign?(
            <div className="two-col" style={{marginBottom:8}}>
              <div className="field" style={{marginBottom:0}}><label>Reassign To</label>
                <select value={reassignTo} onChange={e=>setReassignTo(e.target.value)}>
                  <option value="">— Unassigned —</option>{assignableUsers.map(u=><option key={u.id} value={u.id}>{u.name||u.email}</option>)}
                </select>
              </div>
              <button className="btn btn-sm" onClick={reassign} disabled={busy} style={{alignSelf:"flex-end"}}>Reassign</button>
            </div>
          ):(!hasPendingRequest&&candidate.assigned_to===myUserId&&(
            <div style={{marginBottom:8}}>
              <div className="two-col" style={{marginBottom:8}}>
                <div className="field" style={{marginBottom:0}}><label>Hand Off To</label>
                  <select value={reassignTo} onChange={e=>setReassignTo(e.target.value)}>
                    <option value="">— Pick a recruiter —</option>{assignableUsers.filter(u=>u.id!==myUserId).map(u=><option key={u.id} value={u.id}>{u.name||u.email}</option>)}
                  </select>
                </div>
                <button className="btn btn-sm" onClick={requestHandoff} disabled={busy||!reassignTo} style={{alignSelf:"flex-end"}}>Request Handoff</button>
              </div>
              <input value={handoffNote} onChange={e=>setHandoffNote(e.target.value)} placeholder="Optional note for them"/>
            </div>
          ))}

          <button className="btn btn-sm btn-amber" onClick={sendToIvr} disabled={sendingToIvr}>{sendingToIvr?"Scheduling...":"Send to IVR (didn't pick up)"}</button>
        </div>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="card-header" style={{cursor:"pointer"}} onClick={()=>setShowDetails(d=>!d)}>
          <div className="card-title">Candidate Details {showDetails?"▾":"▸"}</div>
        </div>
        {showDetails&&(
          <div className="card-body">
            <div className="two-col" style={{marginBottom:8}}>
              <div className="field"><label>Current Salary</label><input value={form.current_salary} onChange={e=>setForm({...form,current_salary:e.target.value})} placeholder="e.g. 18k"/></div>
              <div className="field"><label>Expected Salary</label><input value={form.expected_salary} onChange={e=>setForm({...form,expected_salary:e.target.value})} placeholder="e.g. 22k"/></div>
            </div>
            <div className="two-col" style={{marginBottom:8}}>
              <div className="field"><label>Location</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="City / area"/></div>
              <div className="field"><label>Intent</label>
                <select value={form.intent} onChange={e=>setForm({...form,intent:e.target.value})}>
                  <option value="">—</option><option value="YES">Yes</option><option value="MAYBE">Maybe</option><option value="NO">No</option>
                </select>
              </div>
            </div>
            <div className="two-col" style={{marginBottom:8}}>
              <div className="field"><label>Process</label>
                <select value={form.process_id} onChange={e=>setForm({...form,process_id:e.target.value})}>
                  <option value="">—</option>{processes.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="field"><label>Position</label>
                <select value={form.position_type_id} onChange={e=>setForm({...form,position_type_id:e.target.value})}>
                  <option value="">—</option>{positionTypes.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="two-col" style={{marginBottom:8}}>
              <div className="field" style={{marginBottom:0}}><label>Source</label>
                <select value={form.source_id} onChange={e=>setForm({...form,source_id:e.target.value})}>
                  <option value="">—</option>{leadSources.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="field" style={{marginBottom:0}}><label>Languages Spoken</label><input value={form.languages_spoken} onChange={e=>setForm({...form,languages_spoken:e.target.value})} placeholder="e.g. Hindi, English"/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:8}}>
              {["english","hindi","malayalam"].map(lang=>(
                <div className="field" key={lang}><label style={{textTransform:"capitalize"}}>{lang}</label>
                  <select value={form[lang]} onChange={e=>setForm({...form,[lang]:e.target.value})}>
                    <option value="">—</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button className="btn btn-sm" onClick={saveDetails} disabled={saving}>{saving?"Saving...":"Save Details"}</button>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Activity Timeline</div></div>
        <div className="card-body" style={{maxHeight:260,overflowY:"auto"}}>
          {activity.length===0?<div style={{fontSize:13,color:T.muted}}>No activity yet</div>:activity.map(a=>(
            <div key={a.id} style={{padding:"8px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                <span style={{fontWeight:600}}>{a.type.replace("_"," ")}</span>
                <span style={{color:T.muted,fontSize:11}}>{new Date(a.changed_at).toLocaleString("en-IN")}</span>
              </div>
              {a.remark&&<div style={{color:T.muted}}>{a.remark}</div>}
              {a.changed_by&&<div style={{color:T.muted,fontSize:11}}>by {userMap[a.changed_by]?.name||userMap[a.changed_by]?.email||"—"}</div>}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ================================================
// HIREFLOW — CANDIDATES
// ================================================
function HireFlowCandidates({ showToast }) {
  const [candidates,setCandidates]=useState([]);
  const [processes,setProcesses]=useState([]);
  const [positionTypes,setPositionTypes]=useState([]);
  const [leadSources,setLeadSources]=useState([]);
  const [rejectionReasons,setRejectionReasons]=useState([]);
  const [funnelStages,setFunnelStages]=useState([]);
  const [users,setUsers]=useState([]);
  const [activitySummary,setActivitySummary]=useState({});
  const [loading,setLoading]=useState(false);
  const [search,setSearch]=useState("");
  const [stageFilter,setStageFilter]=useState("ALL");
  const [processFilter,setProcessFilter]=useState("ALL");
  const [assigneeFilter,setAssigneeFilter]=useState(getRole()==="HR"?"MINE":"");
  const [colWidths,setColWidths]=useState({});
  const [filterFrom,setFilterFrom]=useState("");
  const [filterTo,setFilterTo]=useState("");
  const [page,setPage]=useState(1);
  const pageSize=25;
  const [selected,setSelected]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [addForm,setAddForm]=useState({name:"",phone:"",process_id:"",position_type_id:"",source_id:"",assigned_to:"",languages_spoken:""});
  const [adding,setAdding]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [uploadAssignees,setUploadAssignees]=useState([]);
  const [showAssigneePicker,setShowAssigneePicker]=useState(false);
  const [selectedIds,setSelectedIds]=useState([]);
  const [bulkAssignTo,setBulkAssignTo]=useState("");
  const [bulkAssigning,setBulkAssigning]=useState(false);
  const fileRef=useRef();

  const [pageTab,setPageTab]=useState("pipeline");
  const [dashFrom,setDashFrom]=useState("");
  const [dashTo,setDashTo]=useState("");
  const [dashRecruiter,setDashRecruiter]=useState("");
  const role=getRole();
  const myUserId=users.find(u=>u.email===getEmail())?.id;
  const reporteeIds=users.filter(u=>u.manager_id===myUserId).map(u=>u.id);

  useEffect(()=>{loadAll();},[]);
  // Manager/Admin land on the overall view here (not a self-scoped default)
  // — they're meant to oversee everyone, matching the main Dashboard.
  useEffect(()=>{setPage(1);},[search,stageFilter,processFilter,assigneeFilter,filterFrom,filterTo]);

  async function loadAll(){
    setLoading(true);
    try{
      const [cands,procs,posTypes,sources,reasons,stages,userList,activity]=await Promise.all([
        dbSelect("candidates","?select=*&order=updated_at.desc"),
        dbSelect("processes","?select=*&order=name"),
        dbSelect("position_types","?select=*&order=name"),
        dbSelect("lead_sources","?select=*&order=name"),
        dbSelect("rejection_reasons","?select=*&order=name"),
        dbSelect("funnel_stages","?select=*&order=sort_order"),
        dbSelect("user_roles","?select=id,name,email,role,manager_id"),
        dbSelect("candidate_activity","?select=candidate_id,is_contact_attempt,changed_at,remark&order=changed_at.desc"),
      ]);
      setCandidates(cands);setProcesses(procs);setPositionTypes(posTypes);setLeadSources(sources);setRejectionReasons(reasons);setFunnelStages(stages);setUsers(userList);

      const summary={};
      activity.forEach(a=>{
        if(!summary[a.candidate_id])summary[a.candidate_id]={count:0,last:a.changed_at,lastRemark:a.remark||null};
        if(a.is_contact_attempt)summary[a.candidate_id].count+=1;
      });
      setActivitySummary(summary);
    }catch(e){showToast("Failed to load candidates","error");}
    finally{setLoading(false);}
  }

  const processMap=Object.fromEntries(processes.map(p=>[p.id,p.name]));
  const positionMap=Object.fromEntries(positionTypes.map(p=>[p.id,p.name]));
  const stageMap=Object.fromEntries(funnelStages.map(s=>[s.id,s]));
  const userMap=Object.fromEntries(users.map(u=>[u.id,u]));
  const sourceMap=Object.fromEntries(leadSources.map(s=>[s.id,s.name]));
  // Candidates can only ever be owned by HR/Manager — Admin and CEO don't work cases.
  const assignableUsers=users.filter(u=>["HR","MANAGER"].includes(u.role));

  function exportCandidatesCSV(){
    const headers=["Name","Phone","Process","Position","Stage","Assigned To","Remarks","Contacted","Last Activity","Current Salary","Expected Salary","Location","Source","Languages Spoken","Created At"];
    const rows=filtered.map(c=>{
      const owner=userMap[c.assigned_to];
      const summary=activitySummary[c.id];
      return [
        c.name,c.phone,processMap[c.process_id]||"",positionMap[c.position_type_id]||"",
        stageMap[c.current_stage_id]?.name||"",owner?(owner.name||owner.email):"Unassigned",
        summary?.lastRemark||"",summary?.count||0,
        summary?.last?new Date(summary.last).toLocaleDateString("en-IN"):"Never",
        c.current_salary||"",c.expected_salary||"",c.location||"",sourceMap[c.source_id]||"",
        c.languages_spoken||"",c.created_at?new Date(c.created_at).toLocaleDateString("en-IN"):"",
      ];
    });
    downloadCSV(`hireflow_candidates_${today()}.csv`,headers,rows);
  }

  function isStale(c){
    const last=activitySummary[c.id]?.last||c.updated_at||c.created_at;
    if(!last)return false;
    return (Date.now()-new Date(last).getTime())>24*60*60*1000;
  }

  const filtered=candidates.filter(c=>{
    if(search){
      const q=search.toLowerCase();
      if(!c.name?.toLowerCase().includes(q)&&!c.phone?.includes(q))return false;
    }
    if(stageFilter!=="ALL"&&c.current_stage_id!==stageFilter)return false;
    if(processFilter!=="ALL"&&c.process_id!==processFilter)return false;
    if(assigneeFilter==="MINE"&&c.assigned_to!==myUserId)return false;
    if(assigneeFilter==="TEAM"&&!reporteeIds.includes(c.assigned_to)&&c.assigned_to!==myUserId)return false;
    if(assigneeFilter&&!["MINE","TEAM"].includes(assigneeFilter)&&c.assigned_to!==assigneeFilter)return false;
    if((filterFrom||filterTo)&&c.assigned_at){
      const d=new Date(c.assigned_at).toISOString().split("T")[0];
      if(filterFrom&&d<filterFrom)return false;
      if(filterTo&&d>filterTo)return false;
    } else if(filterFrom||filterTo){
      return false;
    }
    return true;
  });
  const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
  const pageSafe=Math.min(page,totalPages);
  const paged=filtered.slice((pageSafe-1)*pageSize,pageSafe*pageSize);

  // ---- Dashboard ----
  const dashScoped=candidates.filter(c=>{
    if(role==="HR")return c.assigned_to===myUserId;
    if(role==="MANAGER"){
      if(!(reporteeIds.includes(c.assigned_to)||c.assigned_to===myUserId))return false;
    }
    if(dashRecruiter&&c.assigned_to!==dashRecruiter)return false;
    return true;
  });
  const dashAssignedInRange=dashScoped.filter(c=>{
    if(!dashFrom&&!dashTo)return true;
    if(!c.assigned_at)return false;
    const d=new Date(c.assigned_at).toISOString().split("T")[0];
    if(dashFrom&&d<dashFrom)return false;
    if(dashTo&&d>dashTo)return false;
    return true;
  });
  const dashStageBreakdown=funnelStages.map(s=>({
    stage:s,count:dashAssignedInRange.filter(c=>c.current_stage_id===s.id).length,
  }));
  const dashScheduledInterviews=dashScoped.filter(c=>c.interview_scheduled_at&&stageMap[c.current_stage_id]?.name==="Interview Scheduled");
  const dashInterviewsUpcoming=dashScheduledInterviews.filter(c=>new Date(c.interview_scheduled_at).toISOString().split("T")[0]>today());
  const dashInterviewsToday=dashScheduledInterviews.filter(c=>new Date(c.interview_scheduled_at).toISOString().split("T")[0]===today());
  const dashInterviewsPast=dashScheduledInterviews.filter(c=>new Date(c.interview_scheduled_at).toISOString().split("T")[0]<today());

  function daysUntouched(c){
    const last=activitySummary[c.id]?.last||c.updated_at||c.created_at;
    if(!last)return 0;
    const lastDate=new Date(last).toISOString().split("T")[0];
    const msPerDay=24*60*60*1000;
    return Math.floor((new Date(today()).getTime()-new Date(lastDate).getTime())/msPerDay);
  }
  const dashUntouchedToday=dashScoped.filter(c=>daysUntouched(c)===1);
  const dashUntouchedPast=dashScoped.filter(c=>daysUntouched(c)>=2);

  const dashRecruiterOptions=role==="ADMIN"?users:role==="MANAGER"?users.filter(u=>reporteeIds.includes(u.id)||u.id===myUserId):[];

  async function addCandidate(){
    const phone=addForm.phone.replace(/\D/g,"");
    if(!addForm.name.trim()||!phone){showToast("Name and phone required","error");return;}
    if(phone.length!==10){showToast("Phone must be 10 digits","error");return;}
    setAdding(true);
    try{
      const dupe=await dbSelect("candidates",`?select=id,name,assigned_to,current_stage_id&phone=eq.${phone}`);
      if(dupe.length){
        const owner=userMap[dupe[0].assigned_to];
        const stage=stageMap[dupe[0].current_stage_id];
        showToast(`Already exists: ${dupe[0].name} (${stage?.name||"no stage"}${owner?`, assigned to ${owner.name||owner.email}`:""})`,"error");
        setAdding(false);return;
      }
      const newStage=funnelStages.find(s=>s.name==="New");
      const inserted=await dbInsert("candidates",{
        name:addForm.name.trim(),phone,
        process_id:addForm.process_id||null,position_type_id:addForm.position_type_id||null,
        source_id:addForm.source_id||null,assigned_to:addForm.assigned_to||null,
        assigned_at:addForm.assigned_to?new Date().toISOString():null,
        languages_spoken:addForm.languages_spoken||null,
        current_stage_id:newStage?.id||null,uploaded_by:myUserId,
      });
      if(addForm.assigned_to&&inserted?.[0]?.id){
        await dbInsert("candidate_activity",{
          candidate_id:inserted[0].id,type:"ASSIGNMENT",is_contact_attempt:false,
          remark:`Assigned to ${userMap[addForm.assigned_to]?.name||userMap[addForm.assigned_to]?.email||"—"} on add`,changed_by:myUserId,
        });
      }
      showToast("Candidate added","success");
      setShowAdd(false);setAddForm({name:"",phone:"",process_id:"",position_type_id:"",source_id:"",assigned_to:"",languages_spoken:""});
      loadAll();
    }catch{showToast("Failed to add candidate","error");}
    finally{setAdding(false);}
  }

  async function handleUpload(file){
    if(!file||!file.name.endsWith(".csv")){showToast("Please upload a CSV file","error");return;}
    setUploading(true);
    try{
      const text=await file.text();
      const rows=parseCSV(text);
      const existingPhones=new Set(candidates.map(c=>c.phone));
      const newStage=funnelStages.find(s=>s.name==="New");
      let added=0,skippedDup=0,skippedInvalid=0,skippedUnmatched=0;
      const payload=[];
      rows.forEach(row=>{
        const phone=(row.phone||row.number||"").replace(/\D/g,"");
        const name=row.name||row.candidate||"";
        if(!phone||phone.length!==10||!name){skippedInvalid++;return;}
        if(existingPhones.has(phone)){skippedDup++;return;}

        const processText=(row.process||"").trim();
        const matchedProcess=processText?processes.find(p=>p.name.toLowerCase()===processText.toLowerCase()):null;
        if(processText&&!matchedProcess){skippedUnmatched++;return;}

        const positionText=(row.position||"").trim();
        const matchedPosition=positionText?positionTypes.find(p=>p.name.toLowerCase()===positionText.toLowerCase()):null;
        if(positionText&&!matchedPosition){skippedUnmatched++;return;}

        existingPhones.add(phone);
        const matchedSource=leadSources.find(s=>s.name.toLowerCase()===(row.source||"").trim().toLowerCase());
        const assignedTo=uploadAssignees.length?uploadAssignees[added%uploadAssignees.length]:null;
        payload.push({
          name,phone,
          current_salary:row["current salary"]||null,expected_salary:row["expected salary"]||null,
          location:row.location||null,source_id:matchedSource?.id||null,
          process_id:matchedProcess?.id||null,position_type_id:matchedPosition?.id||null,
          languages_spoken:row.language||row["language spoken"]||null,
          current_stage_id:newStage?.id||null,uploaded_by:myUserId,
          assigned_to:assignedTo,assigned_at:assignedTo?new Date().toISOString():null,
        });
        added++;
      });
      let inserted=[];
      if(payload.length)inserted=await dbInsert("candidates",payload);
      const assignedRows=(inserted||[]).filter(c=>c.assigned_to);
      if(assignedRows.length){
        await dbInsert("candidate_activity",assignedRows.map(c=>({
          candidate_id:c.id,type:"ASSIGNMENT",is_contact_attempt:false,
          remark:`Assigned to ${userMap[c.assigned_to]?.name||userMap[c.assigned_to]?.email||"—"} on upload (round-robin)`,changed_by:myUserId,
        })));
      }
      showToast(`${added} added, ${skippedDup} duplicates, ${skippedUnmatched} unmatched process/position, ${skippedInvalid} invalid rows skipped`,added?"success":"error");
      setUploadAssignees([]);
      loadAll();
    }catch{showToast("Upload failed","error");}
    finally{setUploading(false);if(fileRef.current)fileRef.current.value="";}
  }

  async function takeCandidate(c){
    try{
      await dbUpdate("candidates",`id=eq.${c.id}`,{assigned_to:myUserId,assigned_at:new Date().toISOString(),updated_at:new Date().toISOString()});
      await dbInsert("candidate_activity",{
        candidate_id:c.id,type:"ASSIGNMENT",is_contact_attempt:false,
        remark:`Taken by ${userMap[myUserId]?.name||userMap[myUserId]?.email||"—"}`,changed_by:myUserId,
      });
      showToast("Candidate taken","success");
      loadAll();
    }catch{showToast("Failed to take candidate","error");}
  }

  async function bulkAssign(){
    if(!bulkAssignTo||!selectedIds.length){showToast("Pick a recruiter and at least one candidate","error");return;}
    setBulkAssigning(true);
    try{
      const idList=selectedIds.join(",");
      await dbUpdate("candidates",`id=in.(${idList})`,{assigned_to:bulkAssignTo,assigned_at:new Date().toISOString(),updated_at:new Date().toISOString()});
      await dbInsert("candidate_activity",selectedIds.map(id=>({
        candidate_id:id,type:"ASSIGNMENT",is_contact_attempt:false,
        remark:`Bulk assigned to ${userMap[bulkAssignTo]?.name||userMap[bulkAssignTo]?.email||"—"}`,changed_by:myUserId,
      })));
      showToast(`${selectedIds.length} candidates assigned`,"success");
      setSelectedIds([]);setBulkAssignTo("");
      loadAll();
    }catch{showToast("Failed to bulk assign","error");}
    finally{setBulkAssigning(false);}
  }

  function toggleSelect(id){
    setSelectedIds(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  }

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Hire Flow</div><div className="page-sub">Hiring funnel — from first contact to hired</div></div>
        {pageTab==="pipeline"&&(
          <div style={{display:"flex",gap:8}}>
            <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>handleUpload(e.target.files[0])}/>
            <div style={{position:"relative"}}>
              <button className="btn btn-sm btn-ghost" onClick={()=>setShowAssigneePicker(v=>!v)} title="Optional: pick recruiters to round-robin assign uploaded rows to">
                {uploadAssignees.length?`Round-robin (${uploadAssignees.length})`:"Round-robin: Off"}
              </button>
              {showAssigneePicker&&(
                <>
                  <div style={{position:"fixed",inset:0,zIndex:19}} onClick={()=>setShowAssigneePicker(false)}/>
                  <div className="card" style={{position:"absolute",top:"calc(100% + 6px)",left:0,zIndex:20,width:220,maxHeight:240,overflowY:"auto",padding:8,margin:0}}>
                    {assignableUsers.map(u=>(
                      <label key={u.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",fontSize:13,cursor:"pointer",borderRadius:6}}>
                        <input type="checkbox" checked={uploadAssignees.includes(u.id)} onChange={()=>setUploadAssignees(prev=>prev.includes(u.id)?prev.filter(x=>x!==u.id):[...prev,u.id])}/>
                        {u.name||u.email}
                      </label>
                    ))}
                    {uploadAssignees.length>0&&<button className="btn btn-sm btn-ghost" style={{width:"100%",marginTop:4}} onClick={()=>setUploadAssignees([])}>Clear</button>}
                  </div>
                </>
              )}
            </div>
            <button className="btn btn-sm btn-ghost" onClick={()=>downloadCSV("hireflow_upload_template.csv",["name","phone","current salary","expected salary","location","process","position","source","language"],[["Jane Doe","9876543210","18000","22000","Bangalore","Cred","Calling Executive","Work India","Hindi, English"]])}>Download Template</button>
            <button className="btn btn-sm btn-ghost" onClick={()=>fileRef.current?.click()} disabled={uploading}>{uploading?"Uploading...":"Upload CSV"}</button>
            <button className="btn btn-sm" onClick={()=>setShowAdd(true)}>Add Candidate</button>
          </div>
        )}
      </div>
      <div className="page-content">
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          <button className={`btn btn-sm ${pageTab==="dashboard"?"":"btn-ghost"}`} onClick={()=>setPageTab("dashboard")}>Dashboard</button>
          <button className={`btn btn-sm ${pageTab==="pipeline"?"":"btn-ghost"}`} onClick={()=>setPageTab("pipeline")}>Pipeline</button>
          <button className={`btn btn-sm ${pageTab==="ivr"?"":"btn-ghost"}`} onClick={()=>setPageTab("ivr")}>IVR Interested</button>
        </div>
        {pageTab==="dashboard"?(
          <>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              <input type="date" className="filter-input" value={dashFrom} onChange={e=>setDashFrom(e.target.value)} title="From date"/>
              <input type="date" className="filter-input" value={dashTo} onChange={e=>setDashTo(e.target.value)} title="To date"/>
              {["ADMIN","MANAGER"].includes(role)&&(
                <select className="filter-select" value={dashRecruiter} onChange={e=>setDashRecruiter(e.target.value)}>
                  <option value="">{role==="ADMIN"?"Everyone":"My Team"}</option>
                  {dashRecruiterOptions.map(u=><option key={u.id} value={u.id}>{u.name||u.email}</option>)}
                </select>
              )}
              {(dashFrom||dashTo)&&<button className="btn btn-sm btn-ghost" onClick={()=>{setDashFrom("");setDashTo("");}}>All Time</button>}
              <button className="btn btn-sm btn-ghost" onClick={()=>{setDashFrom(today());setDashTo(today());}}>Today</button>
            </div>

            <div className="kpi-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))"}}>
              <div className="kpi-card">
                <div className="kpi-label">Total Assigned</div>
                <div className="kpi-value blue">{dashAssignedInRange.length}</div>
                <div className="kpi-sub">{!dashFrom&&!dashTo?"All time":dashFrom===dashTo?dashFrom:`${dashFrom} → ${dashTo}`}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Pending Interviews</div>
                <div className={`kpi-value ${dashInterviewsPast.length?"red":""}`}>{dashInterviewsToday.length+dashInterviewsPast.length}</div>
                <div className="kpi-sub" style={dashInterviewsPast.length?{color:T.red,fontWeight:600}:undefined}>
                  {dashInterviewsPast.length?`${dashInterviewsPast.length} overdue`:dashInterviewsToday.length?"All on schedule":"None today"}
                  {dashInterviewsUpcoming.length>0&&` · ${dashInterviewsUpcoming.length} upcoming`}
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Untouched Cases</div>
                <div className={`kpi-value ${dashUntouchedPast.length?"red":""}`}>{dashUntouchedToday.length+dashUntouchedPast.length}</div>
                <div className="kpi-sub" style={dashUntouchedPast.length?{color:T.red,fontWeight:600}:undefined}>
                  {dashUntouchedPast.length?`${dashUntouchedPast.length} critical (2+ days)`:dashUntouchedToday.length?"Since yesterday":"None"}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><div className="card-title">Stage Breakdown — Assigned in Range</div></div>
              <div style={{padding:"8px 20px 20px"}}>
                {(()=>{const max=Math.max(1,...dashStageBreakdown.map(s=>s.count));return dashStageBreakdown.map(({stage,count})=>(
                  <div key={stage.id} style={{display:"flex",alignItems:"center",gap:12,padding:"7px 0"}} title={`${stage.name}: ${count}`}>
                    <div style={{width:130,fontSize:12,color:T.muted,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{stage.name}</div>
                    <div style={{flex:1,background:T.border,borderRadius:4,height:10,position:"relative"}}>
                      <div style={{width:`${(count/max)*100}%`,minWidth:count?4:0,height:10,borderRadius:4,background:stage.is_exit_stage?T.purple:T.accent,transition:"width 0.3s ease"}}/>
                    </div>
                    <div style={{width:28,fontSize:12,fontWeight:600,color:T.text,textAlign:"right",flexShrink:0}}>{count}</div>
                  </div>
                ));})()}
              </div>
            </div>
          </>
        ):pageTab==="ivr"?<InterestedCandidates showToast={showToast}/>:(<>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          <input className="filter-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or phone" style={{maxWidth:220}}/>
          <select className="filter-select" value={stageFilter} onChange={e=>setStageFilter(e.target.value)}>
            <option value="ALL">All Stages</option>
            {funnelStages.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className="filter-select" value={processFilter} onChange={e=>setProcessFilter(e.target.value)}>
            <option value="ALL">All Processes</option>
            {processes.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {["ADMIN","MANAGER"].includes(role)&&(
            <select className="filter-select" value={assigneeFilter} onChange={e=>setAssigneeFilter(e.target.value)}>
              <option value="">Everyone</option>
              <option value="MINE">Assigned to Me</option>
              {role==="MANAGER"&&<option value="TEAM">My Team</option>}
              {assignableUsers.map(u=><option key={u.id} value={u.id}>{u.name||u.email}</option>)}
            </select>
          )}
          <input type="date" className="filter-input" value={filterFrom} onChange={e=>setFilterFrom(e.target.value)} title="Assigned from date"/>
          <input type="date" className="filter-input" value={filterTo} onChange={e=>setFilterTo(e.target.value)} title="Assigned to date"/>
          {(filterFrom||filterTo)&&<button className="btn btn-sm btn-ghost" onClick={()=>{setFilterFrom("");setFilterTo("");}}>✕ Clear Dates</button>}
        </div>

        {["ADMIN","MANAGER"].includes(role)&&selectedIds.length>0&&(
          <div className="card" style={{display:"flex",gap:8,alignItems:"center",padding:12,marginBottom:16,border:`1.5px solid ${T.accent}`}}>
            <div style={{fontSize:13,fontWeight:600,color:T.accent}}>{selectedIds.length} selected — Bulk Reassign</div>
            <select className="filter-select" value={bulkAssignTo} onChange={e=>setBulkAssignTo(e.target.value)}>
              <option value="">Reassign to…</option>{assignableUsers.map(u=><option key={u.id} value={u.id}>{u.name||u.email}</option>)}
            </select>
            <button className="btn btn-sm" onClick={bulkAssign} disabled={bulkAssigning||!bulkAssignTo}>{bulkAssigning?"Reassigning...":"Reassign"}</button>
            <button className="btn btn-sm btn-ghost" onClick={()=>setSelectedIds([])}>Clear</button>
          </div>
        )}

        <div className="card">
          <div className="card-header"><div className="card-title">Candidates ({filtered.length})</div><div style={{display:"flex",gap:8}}><button className="btn btn-sm btn-ghost" onClick={exportCandidatesCSV}>Download CSV</button><button className="btn btn-sm btn-ghost" onClick={loadAll}>↻</button></div></div>
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:filtered.length===0?<div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No candidates found</div></div>:(
              <table style={{tableLayout:"fixed"}}>
                <thead><tr>
                  <th style={{width:22,padding:"8px 4px"}}>#</th>
                  {["ADMIN","MANAGER"].includes(role)&&<th style={{width:22,padding:"8px 4px"}}></th>}
                  <ResizableTh col="name" widths={colWidths} setWidths={setColWidths} defaultWidth={130}>Name</ResizableTh>
                  <ResizableTh col="phone" widths={colWidths} setWidths={setColWidths} defaultWidth={100}>Phone</ResizableTh>
                  <ResizableTh col="process" widths={colWidths} setWidths={setColWidths} defaultWidth={110}>Process</ResizableTh>
                  <ResizableTh col="position" widths={colWidths} setWidths={setColWidths} defaultWidth={100}>Position</ResizableTh>
                  <ResizableTh col="stage" widths={colWidths} setWidths={setColWidths} defaultWidth={110}>Stage</ResizableTh>
                  <ResizableTh col="assigned" widths={colWidths} setWidths={setColWidths} defaultWidth={100}>Assigned To</ResizableTh>
                  <ResizableTh col="remarks" widths={colWidths} setWidths={setColWidths} defaultWidth={180}>Remarks</ResizableTh>
                  <th style={{width:70}}>Contacted</th>
                  <ResizableTh col="lastActivity" widths={colWidths} setWidths={setColWidths} defaultWidth={110}>Last Activity</ResizableTh>
                </tr></thead>
                <tbody>{paged.map((c,i)=>{
                  const stage=stageMap[c.current_stage_id];
                  const owner=userMap[c.assigned_to];
                  const summary=activitySummary[c.id];
                  const stale=isStale(c);
                  const isOwn=["ADMIN","MANAGER"].includes(role)&&c.assigned_to===myUserId;
                  const rowBg=stale?T.amberDim:isOwn?`${T.accent}14`:"transparent";
                  return(
                    <tr key={c.id} onClick={()=>setSelected(c)} style={{cursor:"pointer",background:rowBg}}>
                      <td style={{color:T.muted,fontSize:12,padding:"6px 4px"}}>{(pageSafe-1)*pageSize+i+1}</td>
                      {["ADMIN","MANAGER"].includes(role)&&(
                        <td style={{padding:"6px 4px"}} onClick={e=>e.stopPropagation()}>
                          <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={()=>toggleSelect(c.id)}/>
                        </td>
                      )}
                      <td style={{fontWeight:500}}>{c.name}</td>
                      <td style={{fontFamily:"monospace"}}>{c.phone}</td>
                      <td>{processMap[c.process_id]||"—"}</td>
                      <td>{positionMap[c.position_type_id]||"—"}</td>
                      <td><span className="badge" style={{background:stage?.is_exit_stage?`${T.purple}22`:`${T.accent}22`,color:stage?.is_exit_stage?T.purple:T.accent}}>{stage?.name||"—"}</span></td>
                      <td>
                        {owner?(isOwn?"You":(<>{owner.name||owner.email}{c.pending_reassign_to&&<span style={{marginLeft:6,fontSize:10,color:T.amber,fontWeight:600}}>{c.pending_reassign_to===myUserId?"TRANSFER PENDING — YOU":"TRANSFER PENDING"}</span>}</>)):(
                          ["HR","MANAGER"].includes(role)?<button className="btn btn-sm btn-ghost" onClick={e=>{e.stopPropagation();takeCandidate(c);}}>Take</button>:"Unassigned"
                        )}
                      </td>
                      <td style={{fontSize:12,color:T.muted,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={summary?.lastRemark||""}>
                        {summary?.lastRemark||"—"}
                      </td>
                      <td>{summary?.count||0}x</td>
                      <td style={{fontSize:12,color:stale?T.amber:T.muted}}>
                        {summary?.last?new Date(summary.last).toLocaleDateString("en-IN"):"Never"}{stale&&" — STALE"}
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            )}
          </div>
          {filtered.length>0&&(
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderTop:`1px solid ${T.border}`,fontSize:12,color:T.muted}}>
              <div>Showing {(pageSafe-1)*pageSize+1}–{Math.min(pageSafe*pageSize,filtered.length)} of {filtered.length}</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button className="btn btn-sm btn-ghost" disabled={pageSafe<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
                <span>Page {pageSafe} of {totalPages}</span>
                <button className="btn btn-sm btn-ghost" disabled={pageSafe>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
              </div>
            </div>
          )}
        </div>
        </>)}
      </div>

      {selected&&(
        <CandidateModal
          candidate={selected} processes={processes} positionTypes={positionTypes}
          leadSources={leadSources} rejectionReasons={rejectionReasons} funnelStages={funnelStages} users={users}
          onClose={()=>setSelected(null)} onChanged={loadAll} showToast={showToast}
        />
      )}

      {showAdd&&(
        <Modal title="Add Candidate" onClose={()=>setShowAdd(false)} actions={<>
          <button className="btn btn-sm btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
          <button className="btn btn-sm" onClick={addCandidate} disabled={adding}>{adding?"Adding...":"Add"}</button>
        </>}>
          <div className="two-col" style={{marginBottom:12}}>
            <div className="field"><label>Name *</label><input value={addForm.name} onChange={e=>setAddForm({...addForm,name:e.target.value})}/></div>
            <div className="field"><label>Phone *</label><input value={addForm.phone} onChange={e=>setAddForm({...addForm,phone:e.target.value})} placeholder="10 digits"/></div>
          </div>
          <div className="two-col" style={{marginBottom:12}}>
            <div className="field"><label>Process</label>
              <select value={addForm.process_id} onChange={e=>setAddForm({...addForm,process_id:e.target.value})}>
                <option value="">—</option>{processes.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Position</label>
              <select value={addForm.position_type_id} onChange={e=>setAddForm({...addForm,position_type_id:e.target.value})}>
                <option value="">—</option>{positionTypes.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="two-col">
            <div className="field"><label>Source</label>
              <select value={addForm.source_id} onChange={e=>setAddForm({...addForm,source_id:e.target.value})}>
                <option value="">—</option>{leadSources.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Assign To</label>
              <select value={addForm.assigned_to} onChange={e=>setAddForm({...addForm,assigned_to:e.target.value})}>
                <option value="">— Unassigned —</option>{assignableUsers.map(u=><option key={u.id} value={u.id}>{u.name||u.email}</option>)}
              </select>
            </div>
          </div>
          <div className="field" style={{marginTop:12}}><label>Languages Spoken</label><input value={addForm.languages_spoken||""} onChange={e=>setAddForm({...addForm,languages_spoken:e.target.value})} placeholder="e.g. Hindi, English"/></div>
        </Modal>
      )}
    </div>
  );
}

// ================================================
// REPORTS (CEO)
// ================================================
function ResizableTh({ col, widths, setWidths, defaultWidth, children, style }) {
  const width=widths[col]||defaultWidth;
  const [hover,setHover]=useState(false);
  const [dragging,setDragging]=useState(false);
  function onMouseDown(e){
    e.preventDefault();
    const startX=e.clientX;
    setDragging(true);
    function onMove(e2){
      const delta=e2.clientX-startX;
      setWidths(w=>({...w,[col]:Math.max(50,width+delta)}));
    }
    function onUp(){
      setDragging(false);
      document.removeEventListener("mousemove",onMove);
      document.removeEventListener("mouseup",onUp);
    }
    document.addEventListener("mousemove",onMove);
    document.addEventListener("mouseup",onUp);
  }
  const active=hover||dragging;
  return (
    <th style={{...style,width,position:"relative",userSelect:"none"}}>
      {children}
      <span
        onMouseDown={onMouseDown}
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
        title="Drag to resize column"
        style={{position:"absolute",right:-4,top:0,bottom:0,width:9,cursor:"col-resize",zIndex:2,display:"flex",justifyContent:"center"}}
      >
        <span style={{width:active?3:1.5,height:"100%",background:active?T.accent:T.border,transition:dragging?"none":"width 0.12s, background 0.12s"}}/>
      </span>
    </th>
  );
}

function MiniBarChart({ data, valueKey, color, colorOf, formatLabel }) {
  const max = Math.max(1, ...data.map(d => d[valueKey]));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }} title={`${formatLabel(d.key)}: ${d[valueKey]}`}>
          <div style={{ fontSize: 10, color: T.muted }}>{d[valueKey] || ""}</div>
          <div style={{ width: "100%", maxWidth: 24, height: 96, display: "flex", alignItems: "flex-end" }}>
            <div style={{ width: "100%", height: `${Math.max(2, (d[valueKey] / max) * 96)}px`, background: colorOf?colorOf(d):color, borderRadius: "4px 4px 0 0" }} />
          </div>
          <div style={{ fontSize: 9, color: T.muted, whiteSpace: "nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"100%" }}>{formatLabel(d.key)}</div>
        </div>
      ))}
    </div>
  );
}


// ================================================
// MAIN APP
// ================================================
// ================================================
// PASSWORD RESET PAGE
// ================================================
function PasswordResetPage({ onDone }) {
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState(false);

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const strength = Object.values(checks).filter(Boolean).length;
  const strengthLabel = ["","Weak","Fair","Good","Strong"][strength];
  const strengthColor = ["",T.red,T.amber,T.amber,T.green][strength];
  const isValid = Object.values(checks).every(Boolean) && password === confirm;

  async function handleReset() {
    if(!isValid) return;
    setLoading(true); setError("");
    try {
      // Get token from URL hash
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      if(!accessToken) throw new Error("Invalid reset link. Please request a new one.");

      // Update password via Supabase
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || "Failed to update password");

      // Store password hash history via backend
      try {
        await fetch(`${RENDER_URL}/auth/save-password-history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken, password }),
        });
      } catch {}

      setSuccess(true);
      // Ensure session is fully cleared so user must log in fresh
      localStorage.removeItem("sb_session");
      localStorage.removeItem("sb_role");
      setTimeout(() => {
        window.location.hash = "";
        window.location.reload();
      }, 2000);
    } catch(e) {
      setError(e.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  if(success) return (
    <div className="login-wrap">
      <div className="login-box" style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>✓</div>
        <div style={{fontSize:18,fontWeight:700,color:T.green,marginBottom:8}}>Password Updated</div>
        <div style={{color:T.muted,fontSize:13}}>Redirecting to login...</div>
      </div>
    </div>
  );

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div style={{background:"#fff",borderRadius:12,padding:"12px 24px",display:"inline-block",margin:"0 auto 12px",textAlign:"center"}}>
          <img src={LOGO_BASE64} alt="VCatch" style={{height:36,display:"block",margin:"0 auto"}}/>
        </div>
        <div className="login-sub" style={{textAlign:"center"}}>Set your new password</div>

        <div className="field">
          <label>New Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 8 characters"/>
          {password && (
            <div style={{marginTop:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:11,color:T.muted}}>Password strength</span>
                <span style={{fontSize:11,fontWeight:600,color:strengthColor}}>{strengthLabel}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width:`${strength*25}%`,background:strengthColor,transition:"all 0.3s"}}/>
              </div>
              <div style={{marginTop:8,display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                {[["8+ characters",checks.length],["Uppercase letter",checks.upper],["Number",checks.number],["Special character",checks.special]].map(([l,ok])=>(
                  <div key={l} style={{fontSize:11,color:ok?T.green:T.muted,display:"flex",alignItems:"center",gap:4}}>
                    <span>{ok?"Done":"-"}</span>{l}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="field">
          <label>Confirm Password</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat new password"/>
          {confirm && password !== confirm && <div style={{fontSize:12,color:T.red,marginTop:4}}>Passwords do not match</div>}
          {confirm && password === confirm && <div style={{fontSize:12,color:T.green,marginTop:4}}>Passwords match</div>}
        </div>

        <button className="btn btn-full" onClick={handleReset} disabled={!isValid||loading} style={{marginTop:8}}>
          {loading ? "Updating..." : "Set New Password"}
        </button>
        {error && <div className="err">{error}</div>}
      </div>
    </div>
  );
}

export default function App() {
  const [session,setSession]=useState(()=>{try{return JSON.parse(localStorage.getItem("sb_session"));}catch{return null;}});
  const CEO_PAGES=["dashboard","openings"];
  const [page,setPage]=useState(()=>{
    const saved=localStorage.getItem("sb_page");
    return getRole()==="CEO"?(CEO_PAGES.includes(saved)?saved:"dashboard"):(saved||"dashboard");
  });
  const [toast,setToast]=useState(null);
  const [role,setRole]=useState(()=>getRole());

  useEffect(()=>{
    if(role==="CEO"&&!CEO_PAGES.includes(page)){setPage("dashboard");localStorage.setItem("sb_page","dashboard");}
  },[role]);
  const [isDark,setIsDark]=useState(()=>localStorage.getItem("theme")!=="light");
  const [sidebarCollapsed,setSidebarCollapsed]=useState(()=>localStorage.getItem("sb_sidebar_collapsed")==="1");
  function toggleSidebar(){
    setSidebarCollapsed(v=>{const nv=!v;localStorage.setItem("sb_sidebar_collapsed",nv?"1":"0");return nv;});
  }
  const [isRecovery,setIsRecovery]=useState(()=>{
    const hash = window.location.hash;
    const recovering = hash.includes("type=recovery");
    if(recovering){
      // Clear any existing session — force fresh login after reset
      localStorage.removeItem("sb_session");
      localStorage.removeItem("sb_role");
    }
    return recovering;
  });

  // Apply theme globally
  useEffect(()=>{
    T = isDark ? DARK : LIGHT;
    localStorage.setItem("theme", isDark?"dark":"light");
    // Force re-render by updating CSS
    const styleEl = document.getElementById("vcatch-theme");
    if(styleEl) styleEl.textContent = getThemeCSS(T);
  },[isDark]);

  function showToast(msg,type="info"){setToast({msg,type});}

  async function handleLogin(s){
    setSession(s);
    setTimeout(()=>setRole(getRole()),100);
  }

  async function handleLogout(){
    await signOut();
    setSession(null);
    setRole("HR");
    localStorage.removeItem("sb_page");
  }

  function toggleTheme(){setIsDark(d=>!d);}

  if(isRecovery) return (
    <>
      <style id="vcatch-theme">{getThemeCSS(isDark?DARK:LIGHT)}</style>
      <PasswordResetPage onDone={()=>setIsRecovery(false)}/>
    </>
  );

  if(!session) return (
    <>
      <style id="vcatch-theme">{getThemeCSS(isDark?DARK:LIGHT)}</style>
      <LoginPage onLogin={handleLogin}/>
    </>
  );

  const allNav=[
    {id:"dashboard",label:"Dashboard",icon:"",roles:["ADMIN","MANAGER","HR","CEO"]},
    {id:"hireflow",label:"Hire Flow",icon:"",roles:["ADMIN","MANAGER","HR"]},
    {id:"hireflow-settings",label:"Settings",icon:"",roles:["ADMIN","MANAGER"]},
    {id:"campaigns",label:"IVR Campaigns",icon:"",roles:["ADMIN","MANAGER"]},
    {id:"leads",label:"Leads",icon:"",roles:["ADMIN","MANAGER","HR"]},
    {id:"interested",label:"IVR Interested Candidates",icon:"",roles:["ADMIN","MANAGER","HR"]},
    {id:"dnd",label:"IVR DND List",icon:"",roles:["ADMIN","MANAGER"]},
    {id:"callerids",label:"IVR Caller IDs",icon:"",roles:["ADMIN","MANAGER"]},
    {id:"audio",label:"IVR Audio Manager",icon:"",roles:["ADMIN","MANAGER"]},
    {id:"logs",label:"IVR Call Logs",icon:"",roles:["ADMIN","MANAGER","HR"]},
    {id:"openings",label:"Position Openings",icon:"",roles:["ADMIN","MANAGER","CEO"]},
    {id:"users",label:"Users",icon:"",roles:["ADMIN"]},
  ];

  const nav=allNav.filter(n=>n.roles.includes(role));
  const roleColor={ADMIN:"#EF4444",MANAGER:"#3B7AF8",HR:"#10B981",CEO:"#7238C9"};
  const roleLabel={ADMIN:"Admin",MANAGER:"HR Manager",HR:"HR",CEO:"CEO"};
  const T_cur = isDark ? DARK : LIGHT;

  return(
    <>
      <style id="vcatch-theme">{getThemeCSS(T_cur)}</style>
      <div className="app">
        <button className="sidebar-toggle" style={{left:sidebarCollapsed?14:186}} onClick={toggleSidebar} title={sidebarCollapsed?"Show sidebar":"Hide sidebar"}>{sidebarCollapsed?"»":"«"}</button>
        {/* SIDEBAR */}
        <div className={`sidebar ${sidebarCollapsed?"collapsed":""}`}>
          <div className="sidebar-header">
            <div style={{background:"#fff",borderRadius:8,padding:"6px 12px",display:"inline-block",marginBottom:4}}>
              <img src={LOGO_BASE64} alt="VCatch" style={{height:24,display:"block"}}/>
            </div>
            <div className="sidebar-tagline">Hire Flow VCatch</div>
          </div>
          <nav className="nav">
            <div className="nav-section">Menu</div>
            {nav.map(n=>(
              <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>{setPage(n.id);localStorage.setItem("sb_page",n.id);}}>
                {n.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-name">{getRoleName()}</div>
              <div className="user-email">{session?.user?.email}</div>
              <div style={{marginTop:6}}>
                <span className="badge" style={{background:`${roleColor[role]||"#718096"}22`,color:roleColor[role]||"#718096",fontSize:10}}>
                  {roleLabel[role]||role}
                </span>
              </div>
            </div>
            <button className="theme-toggle btn-full" style={{marginBottom:8,width:"100%",justifyContent:"center"}} onClick={toggleTheme}>
              {isDark?"Light Mode":"Dark Mode"}
            </button>
            <button className="btn btn-sm btn-ghost btn-full" onClick={handleLogout}>Sign out</button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="main">
          {page==="dashboard"&&<Dashboard showToast={showToast} role={role}/>}
          {page==="campaigns"&&["ADMIN","MANAGER"].includes(role)&&<Campaigns showToast={showToast}/>}
          {page==="leads"&&role!=="CEO"&&<Leads showToast={showToast}/>}
          {page==="interested"&&role!=="CEO"&&<InterestedCandidates showToast={showToast}/>}
          {page==="hireflow"&&role!=="CEO"&&<HireFlowCandidates showToast={showToast}/>}
          {page==="hireflow-settings"&&["ADMIN","MANAGER"].includes(role)&&<HireFlowSettings showToast={showToast}/>}
          {page==="dnd"&&["ADMIN","MANAGER"].includes(role)&&<DndList showToast={showToast}/>}
          {page==="callerids"&&["ADMIN","MANAGER"].includes(role)&&<CallerIds showToast={showToast}/>}
          {page==="audio"&&["ADMIN","MANAGER"].includes(role)&&<AudioManager showToast={showToast}/>}
          {page==="logs"&&role!=="CEO"&&<CallLogs showToast={showToast}/>}
          {page==="users"&&role==="ADMIN"&&<UserManagement showToast={showToast}/>}
          {page==="openings"&&["ADMIN","MANAGER","CEO"].includes(role)&&<PositionOpenings showToast={showToast}/>}
        </div>
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}
