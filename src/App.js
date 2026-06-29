import { useState, useEffect, useRef, useCallback } from "react";

const SUPABASE_URL = "https://hndzvwkqveqjzaqegwmp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZHp2d2txdmVxanphcWVnd21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDc2MTksImV4cCI6MjA5Nzc4MzYxOX0.fajgDAY9JjM9jtG1BYkPqzB04hI8D96bJ0Hv5MZrIQ0";
const RENDER_URL = "https://vcatch-ivr-server.onrender.com";

// ================================================
// THEME TOKENS
// ================================================
const DARK = {
  bg:"#0D0F14", surface:"#151820", card:"#1C2030", border:"#252A3A",
  accent:"#4F8EF7", accentDim:"#1E2E4A", green:"#34D399", greenDim:"#0D2E22",
  red:"#F87171", redDim:"#2E1515", amber:"#FBBF24", amberDim:"#2E2210",
  purple:"#A78BFA", purpleDim:"#1E1535", text:"#E8ECF4", muted:"#6B7594",
  inputBg:"#151820", shadow:"rgba(0,0,0,0.4)", mode:"dark",
};
const LIGHT = {
  bg:"#F4F6FA", surface:"#FFFFFF", card:"#FFFFFF", border:"#E2E8F0",
  accent:"#3B7AF8", accentDim:"#EBF2FF", green:"#10B981", greenDim:"#ECFDF5",
  red:"#EF4444", redDim:"#FEF2F2", amber:"#F59E0B", amberDim:"#FFFBEB",
  purple:"#8B5CF6", purpleDim:"#F5F3FF", text:"#1A202C", muted:"#718096",
  inputBg:"#F7FAFC", shadow:"rgba(0,0,0,0.08)", mode:"light",
};

let T = DARK;

function getThemeCSS(t) {
return `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${t.bg};color:${t.text};font-family:'Inter',system-ui,sans-serif;transition:background 0.2s,color 0.2s;}
  ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:${t.surface};}::-webkit-scrollbar-thumb{background:${t.border};border-radius:3px;}
  .login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:${t.bg};}
  .login-box{background:${t.card};border:1px solid ${t.border};border-radius:16px;padding:40px;width:400px;box-shadow:0 4px 24px ${t.shadow};}
  .login-logo{font-size:24px;font-weight:700;color:${t.accent};margin-bottom:4px;}
  .login-sub{color:${t.muted};font-size:13px;margin-bottom:32px;}
  .field{margin-bottom:16px;}
  .field label{display:block;font-size:12px;font-weight:600;color:${t.muted};margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;}
  .field input,.field select,.field textarea{width:100%;background:${t.inputBg};border:1.5px solid ${t.border};border-radius:8px;padding:10px 14px;color:${t.text};font-size:14px;outline:none;transition:border 0.15s;font-family:'Inter',sans-serif;}
  .field input:focus,.field select:focus,.field textarea:focus{border-color:${t.accent};box-shadow:0 0 0 3px ${t.accentDim};}
  .btn{padding:10px 18px;background:${t.accent};color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;font-family:'Inter',sans-serif;display:inline-flex;align-items:center;gap:6px;}
  .btn:hover{opacity:0.88;transform:translateY(-1px);}
  .btn:active{transform:translateY(0);}
  .btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
  .btn-sm{padding:6px 14px;font-size:13px;border-radius:6px;}
  .btn-ghost{background:transparent;border:1.5px solid ${t.border};color:${t.text};}
  .btn-ghost:hover{background:${t.surface};opacity:1;}
  .btn-danger{background:${t.red};color:#fff;}
  .btn-green{background:${t.green};color:#fff;}
  .btn-amber{background:${t.amber};color:#fff;}
  .btn-purple{background:${t.purple};color:#fff;}
  .btn-full{width:100%;justify-content:center;}
  .err{color:${t.red};font-size:13px;margin-top:10px;text-align:center;}
  .warn{color:${t.amber};font-size:12px;margin-top:6px;display:flex;align-items:center;gap:6px;}
  .app{display:flex;height:100vh;overflow:hidden;}
  .sidebar{width:230px;background:${t.surface};border-right:1.5px solid ${t.border};display:flex;flex-direction:column;flex-shrink:0;box-shadow:${t.mode==="light"?"2px 0 8px rgba(0,0,0,0.04)":"none"};}
  .sidebar-header{padding:20px;border-bottom:1px solid ${t.border};}
  .sidebar-brand{font-size:20px;font-weight:700;color:${t.accent};letter-spacing:-0.5px;}
  .sidebar-tagline{font-size:11px;color:${t.muted};margin-top:2px;}
  .nav{flex:1;padding:12px 0;overflow-y:auto;}
  .nav-section{font-size:10px;font-weight:600;color:${t.muted};text-transform:uppercase;letter-spacing:1px;padding:8px 20px 4px;}
  .nav-item{display:flex;align-items:center;gap:10px;padding:9px 20px;font-size:13px;font-weight:500;color:${t.muted};cursor:pointer;transition:all 0.12s;border-radius:0;margin:1px 8px;border-radius:8px;}
  .nav-item:hover{color:${t.text};background:${t.bg};}
  .nav-item.active{color:${t.accent};background:${t.accentDim};font-weight:600;}
  .nav-icon{font-size:15px;width:18px;text-align:center;flex-shrink:0;}
  .sidebar-footer{padding:16px;border-top:1px solid ${t.border};}
  .user-card{background:${t.bg};border-radius:10px;padding:12px;margin-bottom:10px;}
  .user-name{font-size:13px;font-weight:600;color:${t.text};margin-bottom:2px;}
  .user-email{font-size:11px;color:${t.muted};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .main{flex:1;overflow-y:auto;background:${t.bg};}
  .page-header{padding:24px 28px 20px;border-bottom:1.5px solid ${t.border};background:${t.surface};display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;position:sticky;top:0;z-index:10;}
  .page-title{font-size:20px;font-weight:700;color:${t.text};}
  .page-sub{font-size:13px;color:${t.muted};margin-top:2px;}
  .page-content{padding:24px 28px;}
  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;}
  .kpi-card{background:${t.card};border:1.5px solid ${t.border};border-radius:12px;padding:20px;box-shadow:0 1px 4px ${t.shadow};}
  .kpi-label{font-size:11px;font-weight:600;color:${t.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;}
  .kpi-value{font-size:32px;font-weight:700;line-height:1;margin-bottom:4px;}
  .kpi-sub{font-size:12px;color:${t.muted};}
  .card{background:${t.card};border:1.5px solid ${t.border};border-radius:12px;overflow:hidden;margin-bottom:20px;box-shadow:0 1px 4px ${t.shadow};}
  .card-header{padding:14px 20px;border-bottom:1px solid ${t.border};display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;background:${t.card};}
  .card-title{font-size:14px;font-weight:600;color:${t.text};}
  .card-body{padding:20px;}
  .table-wrap{overflow-x:auto;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  th{text-align:left;padding:10px 16px;color:${t.muted};font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1.5px solid ${t.border};background:${t.bg};}
  td{padding:12px 16px;border-bottom:1px solid ${t.border};color:${t.text};vertical-align:middle;}
  tr:last-child td{border-bottom:none;}
  tbody tr:hover td{background:${t.bg};}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;}
  .badge-green{background:${t.greenDim};color:${t.green};}
  .badge-red{background:${t.redDim};color:${t.red};}
  .badge-amber{background:${t.amberDim};color:${t.amber};}
  .badge-blue{background:${t.accentDim};color:${t.accent};}
  .badge-gray{background:${t.border};color:${t.muted};}
  .badge-purple{background:${t.purpleDim};color:${t.purple};}
  .drop-zone{border:2px dashed ${t.border};border-radius:12px;padding:40px 32px;text-align:center;cursor:pointer;transition:all 0.2s;background:${t.bg};}
  .drop-zone:hover,.drop-zone.drag-over{border-color:${t.accent};background:${t.accentDim};}
  .drop-zone-icon{font-size:32px;margin-bottom:10px;}
  .drop-zone-text{font-size:15px;font-weight:600;color:${t.text};margin-bottom:4px;}
  .drop-zone-sub{font-size:13px;color:${t.muted};}
  .audio-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid ${t.border};}
  .audio-row:last-child{border-bottom:none;}
  .filter-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
  .filter-select,.filter-input{background:${t.inputBg};border:1.5px solid ${t.border};border-radius:7px;padding:7px 12px;color:${t.text};font-size:13px;outline:none;font-family:'Inter',sans-serif;}
  .filter-select:focus,.filter-input:focus{border-color:${t.accent};}
  .empty-state{text-align:center;padding:48px;color:${t.muted};}
  .empty-icon{font-size:40px;margin-bottom:12px;}
  .empty-title{font-size:15px;font-weight:600;color:${t.text};margin-bottom:6px;}
  .empty-sub{font-size:13px;}
  .toast{position:fixed;bottom:24px;right:24px;background:${t.card};border:1.5px solid ${t.border};border-radius:12px;padding:14px 18px;font-size:13px;z-index:999;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px ${t.shadow};animation:slideUp 0.2s ease;max-width:360px;}
  @keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
  .progress-bar{height:6px;background:${t.border};border-radius:3px;overflow:hidden;}
  .progress-fill{height:100%;background:${t.accent};border-radius:3px;transition:width 0.4s;}
  .tag{display:inline-block;background:${t.accentDim};color:${t.accent};border-radius:5px;padding:2px 8px;font-size:11px;font-weight:600;}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(2px);}
  .modal{background:${t.card};border:1.5px solid ${t.border};border-radius:16px;padding:28px;width:500px;max-width:95vw;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px ${t.shadow};}
  .modal-title{font-size:18px;font-weight:700;margin-bottom:4px;color:${t.text};}
  .modal-sub{font-size:13px;color:${t.muted};margin-bottom:20px;}
  .modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:24px;}
  .live-dot{width:8px;height:8px;border-radius:50%;background:${t.green};display:inline-block;animation:pulse 1.5s infinite;flex-shrink:0;}
  .live-dot.off{background:${t.muted};animation:none;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
  .input-row{display:flex;gap:8px;align-items:flex-end;}
  .input-row .field{flex:1;margin-bottom:0;}
  .section-label{font-size:11px;font-weight:600;color:${t.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;margin-top:16px;}
  .info-box{border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:12px;}
  .info-box.amber{background:${t.amberDim};border:1px solid ${t.amber};color:${t.amber};}
  .info-box.green{background:${t.greenDim};border:1px solid ${t.green};color:${t.green};}
  .info-box.red{background:${t.redDim};border:1px solid ${t.red};color:${t.red};}
  .info-box.blue{background:${t.accentDim};border:1px solid ${t.accent};color:${t.accent};}
  .theme-toggle{background:${t.bg};border:1.5px solid ${t.border};border-radius:8px;padding:6px 12px;cursor:pointer;font-size:13px;color:${t.muted};display:flex;align-items:center;gap:6px;}
  .theme-toggle:hover{border-color:${t.accent};color:${t.accent};}
  .stat-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid ${t.border};}
  .stat-row:last-child{border-bottom:none;}
  .reject-row{background:${t.redDim};border-radius:6px;padding:8px 12px;margin-bottom:6px;font-size:12px;display:flex;align-items:center;justify-content:space-between;}
  .dialer-bar{background:${t.card};border:1.5px solid ${t.border};border-radius:12px;padding:14px 20px;display:flex;align-items:center;gap:16px;margin-bottom:20px;box-shadow:0 1px 4px ${t.shadow};}
  .green{color:${t.green};} .red{color:${t.red};} .amber{color:${t.amber};} .blue{color:${t.accent};} .purple{color:${t.purple};}
`;
}

// ================================================
// API UTILITIES
// ================================================
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
    localStorage.setItem("sb_session", JSON.stringify(data));
    return data;
  } catch { return null; }
}

async function getValidSession() {
  const session = JSON.parse(localStorage.getItem("sb_session") || "null");
  if (!session) return null;
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
  const res = await fetch(`${RENDER_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

async function signIn(email, password) {
  const data = await supaFetch("/auth/v1/token?grant_type=password", {
    method: "POST", body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("sb_session", JSON.stringify(data));
  try {
    const roleData = await supaFetch(`/rest/v1/user_roles?email=eq.${encodeURIComponent(email)}&select=role,name&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${data.access_token}` }
    });
    localStorage.setItem("sb_role", JSON.stringify(roleData?.[0] || { role: "HR", name: email }));
  } catch {
    localStorage.setItem("sb_role", JSON.stringify({ role: "HR", name: email }));
  }
  return data;
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
function LoginPage({ onLogin, theme }) {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  async function handleLogin() {
    setLoading(true); setError("");
    try { const s = await signIn(email, password); onLogin(s); }
    catch(e) { setError(e.message||"Invalid email or password"); }
    finally { setLoading(false); }
  }
  return (
    <div className="login-wrap">
      <div className="login-box">
        <div style={{textAlign:"center",marginBottom:28}}>
          <div className="login-logo">🎯 VCatch</div>
          <div className="login-sub">HR IVR Portal — Sign in to continue</div>
        </div>
        <div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="hr@company.com" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
        <div className="field"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
        <button className="btn btn-full" onClick={handleLogin} disabled={loading} style={{marginTop:8}}>{loading?"Signing in...":"Sign in"}</button>
        {error&&<div className="err">{error}</div>}
        <div style={{textAlign:"center",marginTop:16,fontSize:12,color:T.muted}}>Forgot password? Contact your admin.</div>
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
  const [recentLogs,setRecentLogs]=useState([]);
  const [testPhone,setTestPhone]=useState("");
  const [testLoading,setTestLoading]=useState(false);
  const [dateFrom,setDateFrom]=useState("");
  const [dateTo,setDateTo]=useState("");

  useEffect(()=>{loadAll();const i=setInterval(loadDialerStatus,5000);return()=>clearInterval(i);},[]);
  useEffect(()=>{loadStats();},[dateFrom,dateTo]);

  async function loadAll(){await Promise.all([loadStats(),loadDialerStatus()]);}

  async function loadStats(){
    try{
      let p="?select=sub_disposition,logged_at&limit=5000";
      if(dateFrom) p+=`&logged_at=gte.${dateFrom}T00:00:00`;
      if(dateTo) p+=`&logged_at=lte.${dateTo}T23:59:59`;
      const [logs,leads]=await Promise.all([dbSelect("call_logs",p),dbSelect("leads","?select=status")]);
      setStats({
        total:logs.length,
        interested:logs.filter(l=>l.sub_disposition==="INTERESTED").length,
        notConnected:logs.filter(l=>["BUSY","FAILED"].includes(l.sub_disposition)).length,
        pending:leads.filter(l=>["PENDING","CALLED"].includes(l.status)).length,
      });
      let rp="?select=phone,campaign,sub_disposition,logged_at&order=logged_at.desc&limit=8";
      if(dateFrom) rp+=`&logged_at=gte.${dateFrom}T00:00:00`;
      if(dateTo) rp+=`&logged_at=lte.${dateTo}T23:59:59`;
      setRecentLogs(await dbSelect("call_logs",rp));
    }catch(e){}
  }
  async function loadDialerStatus(){try{setDialerStatus(await renderFetch("/campaign/status"));}catch{}}

  async function sendTestCall(){
    if(!testPhone.trim()){showToast("Enter a phone number","error");return;}
    setTestLoading(true);
    try{
      await renderFetch("/test-call",{method:"POST",body:JSON.stringify({phone:testPhone.trim(),campaign:"TEST"})});
      showToast(`Test call sent to ${testPhone}`,"success");setTestPhone("");
    }catch(e){showToast(e.message||"Test call failed","error");}
    finally{setTestLoading(false);}
  }

  const connRate=stats?.total?Math.round(((stats.total-stats.notConnected)/stats.total)*100):0;
  const isActive=dialerStatus?.dialer?.is_active;
  const canControl=isManager();

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Dashboard</div><div className="page-sub">Live overview — {dateFrom||dateTo?"filtered":"all time"}</div></div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <input type="date" className="filter-input" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}/>
          <span style={{color:T.muted,fontSize:12}}>to</span>
          <input type="date" className="filter-input" value={dateTo} onChange={e=>setDateTo(e.target.value)}/>
          {(dateFrom||dateTo)&&<button className="btn btn-sm btn-ghost" onClick={()=>{setDateFrom("");setDateTo("");}}>✕ Clear</button>}
          <button className="btn btn-sm btn-ghost" onClick={loadAll}>↻</button>
        </div>
      </div>
      <div className="page-content">
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
            {!isActive&&<div style={{fontSize:12,color:T.muted,marginTop:2}}>No campaign running. Go to Campaigns → ▶ Start.</div>}
          </div>
          {canControl&&<div className="input-row" style={{gap:8}}>
            <div className="field" style={{marginBottom:0,minWidth:160}}><input value={testPhone} onChange={e=>setTestPhone(e.target.value)} placeholder="Test call number" onKeyDown={e=>e.key==="Enter"&&sendTestCall()} style={{fontSize:13}}/></div>
            <button className="btn btn-sm btn-amber" onClick={sendTestCall} disabled={testLoading} title="Send test call">{testLoading?"...":"📞 Test"}</button>
          </div>}
        </div>

        {/* KPIs */}
        <div className="kpi-grid">
          <div className="kpi-card"><div className="kpi-label">Total Calls</div><div className="kpi-value blue">{stats?.total??0}</div><div className="kpi-sub">{dateFrom||dateTo?"Filtered period":"All time"}</div></div>
          <div className="kpi-card"><div className="kpi-label">Interested</div><div className="kpi-value green">{stats?.interested??0}</div><div className="kpi-sub">{stats?.total?`${Math.round(((stats.interested||0)/stats.total)*100)}% conversion`:""}</div></div>
          <div className="kpi-card"><div className="kpi-label">Not Connected</div><div className="kpi-value red">{stats?.notConnected??0}</div><div className="kpi-sub">Busy + Failed</div></div>
          <div className="kpi-card"><div className="kpi-label">Pending Leads</div><div className="kpi-value amber">{stats?.pending??0}</div><div className="kpi-sub">Awaiting next dial</div></div>
        </div>

        {/* Connection Rate */}
        <div className="card" style={{marginBottom:20}}>
          <div className="card-body" style={{paddingBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:13,fontWeight:600,color:T.text}}>Connection Rate</span>
              <span style={{fontSize:18,fontWeight:700,color:T.accent}}>{connRate}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{width:`${connRate}%`}}/></div>
          </div>
        </div>

        {/* Recent Calls */}
        <div className="card">
          <div className="card-header"><div className="card-title">Recent Calls</div><span style={{fontSize:12,color:T.muted}}>Last 8</span></div>
          <div className="table-wrap">
            {recentLogs.length===0?(
              <div className="empty-state"><div className="empty-icon">📞</div><div className="empty-title">No calls yet</div></div>
            ):(
              <table>
                <thead><tr><th>Phone</th><th>Campaign</th><th>Result</th><th>Time</th></tr></thead>
                <tbody>{recentLogs.map((log,i)=>(
                  <tr key={i}>
                    <td style={{fontFamily:"monospace",fontWeight:500}}>{log.phone}</td>
                    <td><span className="tag">{log.campaign}</span></td>
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

  const hasRunning=campaigns.some(c=>c.status==="RUNNING");

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Campaigns</div><div className="page-sub">Only one can run at a time — use pause/resume to switch</div></div>
        <button className="btn btn-sm" onClick={()=>setShowCreate(true)}>+ New Campaign</button>
      </div>
      <div className="page-content">
        {hasRunning&&<div className="info-box green" style={{marginBottom:16,display:"flex",alignItems:"center",gap:8}}><span className="live-dot"></span>A campaign is running. Pause it before starting another.</div>}
        <div className="card">
          <div className="table-wrap">
            {campaigns.length===0?(
              <div className="empty-state"><div className="empty-icon">🎯</div><div className="empty-title">No campaigns yet</div><div className="empty-sub">Create a campaign, upload leads, then start dialing</div></div>
            ):(
              <table>
                <thead><tr><th>Campaign</th><th>Status</th><th>Progress</th><th>Settings</th><th>Actions</th></tr></thead>
                <tbody>{campaigns.map(c=>{
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
                          {canStart&&<button className="btn btn-sm btn-green" onClick={()=>startCampaign(c.name)} disabled={!!actionLoading}>{actionLoading===c.name+"_start"?"...":"▶ Start"}</button>}
                          {isRunning&&<button className="btn btn-sm btn-amber" onClick={()=>pauseCampaign(c.name)} disabled={!!actionLoading}>{actionLoading===c.name+"_pause"?"...":"⏸ Pause"}</button>}
                          {!isRunning&&<button className="btn btn-sm btn-ghost" style={{color:T.red,borderColor:T.red}} onClick={()=>setDeleteTarget(c.name)} disabled={!!actionLoading}>🗑</button>}
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
              {form.retry_after_minutes<30&&<div className="warn">⚠️ Recommended: at least 30 min</div>}
            </div>
          </div>
          <div className="info-box blue" style={{marginTop:8}}>
            Example: 100 leads × {form.max_retries} retries = up to {100*form.max_retries} call attempts. Each lead gets a {form.retry_after_minutes}min gap between attempts.
          </div>
        </Modal>
      )}

      {deleteTarget&&(
        <Modal title="Delete Campaign" onClose={()=>setDeleteTarget(null)}
          actions={<><button className="btn btn-sm btn-ghost" onClick={()=>setDeleteTarget(null)}>Cancel</button><button className="btn btn-sm btn-danger" onClick={confirmDelete}>{actionLoading?"Deleting...":"Yes, Delete"}</button></>}>
          <div className="info-box red">⚠️ This will permanently delete "<strong>{deleteTarget}</strong>" and all its PENDING leads. Called leads and logs are kept.</div>
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
  const [loading,setLoading]=useState(false);
  const [dragOver,setDragOver]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [validRows,setValidRows]=useState([]);
  const [rejectedRows,setRejectedRows]=useState([]);
  const [dndConflicts,setDndConflicts]=useState([]);
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
      setLeads(await dbSelect("leads",params));
    }catch(e){showToast("Failed to load leads","error");}
    finally{setLoading(false);}
  }

  function parseCSV(text){
    const lines=text.trim().split("\n");
    const headers=lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/"/g,""));
    return lines.slice(1).filter(l=>l.trim()).map(line=>{
      const vals=line.split(",");const row={};
      headers.forEach((h,i)=>row[h]=(vals[i]||"").trim().replace(/"/g,""));
      return row;
    });
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
      const now=new Date().toISOString();
      const payload=validRows.map(r=>({
        name:r.name,phone:r.phone,campaign,status:"PENDING",
        attempt_count:0,eligible_at:now,
        max_retries:selectedCampaignData?.max_retries||1,
        retry_after_minutes:selectedCampaignData?.retry_after_minutes||30,
      }));
      await dbInsert("leads",payload);
      // Update campaign total_leads count
      await dbUpdate("campaigns",`name=eq.${encodeURIComponent(campaign)}`,{total_leads:(camp?.total_leads||0)+payload.length,pending_count:(camp?.pending_count||0)+payload.length});
      showToast(`${payload.length} leads uploaded to "${campaign}"`,"success");
      setValidRows([]);setRejectedRows([]);setDndConflicts([]);setCampaign("");setSelectedCampaignData(null);
      fileRef.current.value="";selectedFile.current=null;
      loadLeads();
    }catch(e){showToast("Upload failed — check for duplicates","error");}
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
        <button className="btn btn-sm btn-ghost" onClick={downloadTemplate}>↓ Template</button>
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
                {campaigns.length===0&&<div className="warn">⚠️ Create a campaign first</div>}
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
              <div className="drop-zone-icon">📂</div>
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
                </div>
                {rejectedRows.length>0&&(
                  <div style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontSize:13,fontWeight:600,color:T.red}}>❌ Rejected Numbers</span>
                      <button className="btn btn-sm btn-danger" onClick={()=>downloadCSV(`rejected_${Date.now()}.csv`,["name","phone","reason"],rejectedRows.map(r=>[r.name||"",r.phone||"",r._reason]))}>↓ Download to Fix</button>
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
                    <button className="btn btn-sm btn-green" disabled={uploading||!campaign} onClick={uploadLeads}>{uploading?"Uploading...":`✓ Upload ${validRows.length} leads`}</button>
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
                <option value="SKIPPED">Skipped (DND)</option>
              </select>
              <button className="btn btn-sm btn-ghost" onClick={()=>loadLeads(filterCampaign)}>↻</button>
            </div>
          </div>
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:filtered.length===0?(
              <div className="empty-state"><div className="empty-icon">👥</div><div className="empty-title">No leads found</div><div className="empty-sub">Upload a CSV to get started</div></div>
            ):(
              <table>
                <thead><tr><th>Name</th><th>Phone</th><th>Campaign</th><th>Status</th><th>Attempts</th><th>Next Eligible</th></tr></thead>
                <tbody>{filtered.map(lead=>(
                  <tr key={lead.id}>
                    <td style={{fontWeight:500}}>{lead.name}</td>
                    <td style={{fontFamily:"monospace"}}>{lead.phone}</td>
                    <td><span className="tag">{lead.campaign}</span></td>
                    <td><DisposBadge sub={lead.status}/></td>
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
  const [filterCampaign,setFilterCampaign]=useState("ALL");
  const [filterStatus,setFilterStatus]=useState("ALL");
  const [campaigns,setCampaigns]=useState([]);

  useEffect(()=>{load();},[]);

  async function load(){
    setLoading(true);
    try{
      const [logs,updatesData]=await Promise.all([
        dbSelect("call_logs","?select=phone,campaign,logged_at&sub_disposition=eq.INTERESTED&order=logged_at.desc"),
        dbSelect("candidate_updates","?select=*&order=updated_at.desc"),
      ]);
      const phones=[...new Set(logs.map(l=>l.phone))];
      let leadsMap={};
      if(phones.length){
        const leads=await dbSelect("leads",`?select=phone,name&phone=in.(${phones.slice(0,50).join(",")})`);
        leads.forEach(l=>leadsMap[l.phone]=l.name);
      }
      const enriched=logs.map(l=>({...l,name:leadsMap[l.phone]||"Unknown"}));
      setCandidates(enriched);
      setCampaigns([...new Set(enriched.map(c=>c.campaign).filter(Boolean))]);
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

  const filtered=candidates.filter(c=>{
    const cMatch=filterCampaign==="ALL"||c.campaign===filterCampaign;
    const s=updates[c.phone]?.[0]?.status||"PENDING";
    const sMatch=filterStatus==="ALL"||s===filterStatus;
    return cMatch&&sMatch;
  });

  const total=candidates.length;
  const sc={PICKED_UP:0,REJECTED:0,HIRED:0,PENDING:0};
  candidates.forEach(c=>{const s=updates[c.phone]?.[0]?.status||"PENDING";sc[s]=(sc[s]||0)+1;});

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Interested Candidates</div><div className="page-sub">Track follow-ups and interview pipeline</div></div>
        <button className="btn btn-sm btn-ghost" onClick={()=>downloadCSV(`candidates_${Date.now()}.csv`,["Name","Phone","Campaign","Status","Comment","Updated By","Time"],filtered.map(c=>{const u=updates[c.phone]?.[0];return[c.name,c.phone,c.campaign,u?.status||"PENDING",u?.comment||"",u?.updated_by||"",u?.updated_at?new Date(u.updated_at).toLocaleString("en-IN"):""];}))}>↓ Report</button>
      </div>
      <div className="page-content">
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
          {[["Total","blue",total],["Picked Up","green",sc.PICKED_UP],["Rejected","red",sc.REJECTED],["Hired","purple",sc.HIRED],["Pending","amber",sc.PENDING]].map(([l,c,v])=>(
            <div key={l} className="kpi-card"><div className="kpi-label">{l}</div><div className={`kpi-value ${c}`}>{v}</div></div>
          ))}
        </div>
        <div className="filter-row" style={{marginBottom:16}}>
          <select className="filter-select" value={filterCampaign} onChange={e=>setFilterCampaign(e.target.value)}>
            <option value="ALL">All Campaigns</option>
            {campaigns.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="REJECTED">Rejected</option>
            <option value="HIRED">Hired</option>
          </select>
          <button className="btn btn-sm btn-ghost" onClick={load}>↻</button>
        </div>
        <div className="card">
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:filtered.length===0?(
              <div className="empty-state"><div className="empty-icon">⭐</div><div className="empty-title">No interested candidates yet</div><div className="empty-sub">Candidates who press 1 appear here</div></div>
            ):(
              <table>
                <thead><tr><th>Name</th><th>Phone</th><th>Campaign</th><th>Status</th><th>Last Update</th><th>By</th><th></th></tr></thead>
                <tbody>{filtered.map((c,i)=>{const u=updates[c.phone]?.[0];return(
                  <tr key={i}>
                    <td style={{fontWeight:500}}>{c.name}</td>
                    <td style={{fontFamily:"monospace"}}>{c.phone}</td>
                    <td><span className="tag">{c.campaign}</span></td>
                    <td><DisposBadge sub={u?.status||"PENDING"}/></td>
                    <td style={{fontSize:12,color:T.muted,maxWidth:180}}>{u?.comment||"—"}</td>
                    <td style={{fontSize:11,color:T.muted}}>{u?.updated_by?.split("@")[0]||"—"}</td>
                    <td><button className="btn btn-sm btn-purple" onClick={()=>{setSelected(c);setUpdateForm({status:u?.status||"PENDING",comment:""});}}>Update</button></td>
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
  useEffect(()=>{load();},[]);
  async function load(){try{setDnd(await dbSelect("dnd_list","?select=*&order=added_at.desc"));}catch{showToast("Failed","error");}}
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
            {dnd.length===0?<div className="empty-state"><div className="empty-icon">🚫</div><div className="empty-title">No numbers blocked</div></div>:(
              <table>
                <thead><tr><th>Phone</th><th>Reason</th><th>Added</th><th></th></tr></thead>
                <tbody>{dnd.map(d=>(
                  <tr key={d.id}>
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
            {list.length===0?<div className="empty-state"><div className="empty-icon">📱</div><div className="empty-title">No numbers yet</div></div>:(
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
                  <button className="btn btn-sm btn-ghost" onClick={()=>{setEditing(f);setNewUrl(f.url);}}>✏️ Replace</button>
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
  const [fd,setFd]=useState("");const [td,setTd]=useState("");
  const [fc,setFc]=useState("ALL");const [fds,setFds]=useState("ALL");
  const [limit,setLimit]=useState("ALL");const [campaigns,setCampaigns]=useState([]);

  useEffect(()=>{load();},[]);

  async function load(){
    setLoading(true);
    try{
      const data=await dbSelect("call_logs","?select=*&order=logged_at.desc&limit=2000");
      setLogs(data);setCampaigns([...new Set(data.map(l=>l.campaign).filter(Boolean))]);
    }catch{showToast("Failed","error");}
    finally{setLoading(false);}
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
          <button className="btn btn-sm btn-ghost" onClick={doExport}>↓ Export</button>
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
          <input type="date" className="filter-input" value={fd} onChange={e=>setFd(e.target.value)}/>
          <span style={{color:T.muted,fontSize:12}}>to</span>
          <input type="date" className="filter-input" value={td} onChange={e=>setTd(e.target.value)}/>
          {(fd||td)&&<button className="btn btn-sm btn-ghost" onClick={()=>{setFd("");setTd("");}}>✕</button>}
          <button className="btn btn-sm btn-ghost" onClick={load}>↻</button>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Showing {display.length} of {filtered.length}</div></div>
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:display.length===0?(
              <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No logs match</div></div>
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
  const [form,setForm]=useState({email:"",name:"",role:"HR",password:""});
  const [adding,setAdding]=useState(false);const [resetting,setResetting]=useState(null);

  useEffect(()=>{load();},[]);
  async function load(){setLoading(true);try{setUsers(await dbSelect("user_roles","?select=*&order=created_at.desc"));}catch{showToast("Failed","error");}finally{setLoading(false);}}

  async function createUser(){
    if(!form.email||!form.password){showToast("Email and password required","error");return;}
    if(form.password.length<8){showToast("Password must be at least 8 characters","error");return;}
    setAdding(true);
    try{
      await renderFetch("/auth/create-user",{method:"POST",body:JSON.stringify(form)});
      showToast(`✅ ${form.email} created. Reset email sent.`,"success");
      setForm({email:"",name:"",role:"HR",password:""});load();
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

  const roleColors={ADMIN:T.red,MANAGER:T.accent,HR:T.green};

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
                </select>
              </div>
            </div>
            <div className="info-box amber" style={{marginBottom:12}}>⚠️ A password reset email will be sent automatically so the user can set their own password.</div>
            <button className="btn btn-sm" onClick={createUser} disabled={adding}>{adding?"Creating...":"Create User & Send Email"}</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">All Users ({users.length})</div><button className="btn btn-sm btn-ghost" onClick={load}>↻</button></div>
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:users.length===0?<div className="empty-state"><div className="empty-icon">👤</div><div className="empty-title">No users</div></div>:(
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Change Role</th><th>Actions</th></tr></thead>
                <tbody>{users.map(u=>(
                  <tr key={u.id}>
                    <td style={{fontWeight:500}}>{u.name||"—"}</td>
                    <td style={{fontFamily:"monospace",fontSize:12}}>{u.email}</td>
                    <td><span className="badge" style={{background:`${roleColors[u.role]||T.muted}22`,color:roleColors[u.role]||T.muted}}>{u.role}</span></td>
                    <td><span className={`badge ${u.is_active?"badge-green":"badge-gray"}`}>{u.is_active?"Active":"Inactive"}</span></td>
                    <td>
                      {u.email!==getEmail()?(
                        <select className="filter-select" value={u.role} onChange={e=>updateRole(u.id,e.target.value)} style={{padding:"4px 8px",fontSize:12}}>
                          <option value="HR">HR</option><option value="MANAGER">Manager</option><option value="ADMIN">Admin</option>
                        </select>
                      ):<span style={{fontSize:12,color:T.muted}}>You</span>}
                    </td>
                    <td>
                      <div style={{display:"flex",gap:6}}>
                        <button className="btn btn-sm btn-ghost" onClick={()=>resetPassword(u.email)} disabled={resetting===u.email}>{resetting===u.email?"Sending...":"📧 Reset Password"}</button>
                        {u.email!==getEmail()&&<button className="btn btn-sm btn-ghost" onClick={()=>toggleActive(u.id,u.is_active)}>{u.is_active?"Deactivate":"Activate"}</button>}
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
                ["Dashboard & Call Logs","✓","✓","✓"],
                ["Upload Leads","✓","✓","✓"],
                ["Candidate Updates","✓","✓","✓"],
                ["Start / Pause Campaigns","✓","✓","✗"],
                ["Create / Delete Campaigns","✓","✓","✗"],
                ["Audio Manager","✓","✓","✗"],
                ["Caller IDs & DND","✓","✓","✗"],
                ["User Management","✓","✗","✗"],
              ].map(([f,a,m,h])=>(
                <tr key={f}>
                  <td>{f}</td>
                  <td style={{color:a==="✓"?T.green:T.red,fontWeight:700,textAlign:"center"}}>{a}</td>
                  <td style={{color:m==="✓"?T.green:T.red,fontWeight:700,textAlign:"center"}}>{m}</td>
                  <td style={{color:h==="✓"?T.green:T.red,fontWeight:700,textAlign:"center"}}>{h}</td>
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
// MAIN APP
// ================================================
export default function App() {
  const [session,setSession]=useState(()=>{try{return JSON.parse(localStorage.getItem("sb_session"));}catch{return null;}});
  const [page,setPage]=useState("dashboard");
  const [toast,setToast]=useState(null);
  const [role,setRole]=useState(()=>getRole());
  const [isDark,setIsDark]=useState(()=>localStorage.getItem("theme")!=="light");

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
  }

  function toggleTheme(){setIsDark(d=>!d);}

  if(!session) return (
    <>
      <style id="vcatch-theme">{getThemeCSS(isDark?DARK:LIGHT)}</style>
      <LoginPage onLogin={handleLogin}/>
    </>
  );

  const allNav=[
    {id:"dashboard",label:"Dashboard",icon:"📊",roles:["ADMIN","MANAGER","HR"]},
    {id:"campaigns",label:"Campaigns",icon:"🎯",roles:["ADMIN","MANAGER"]},
    {id:"leads",label:"Leads",icon:"👥",roles:["ADMIN","MANAGER","HR"]},
    {id:"interested",label:"Candidates",icon:"⭐",roles:["ADMIN","MANAGER","HR"]},
    {id:"dnd",label:"DND List",icon:"🚫",roles:["ADMIN","MANAGER"]},
    {id:"callerids",label:"Caller IDs",icon:"📱",roles:["ADMIN","MANAGER"]},
    {id:"audio",label:"Audio Manager",icon:"🔊",roles:["ADMIN","MANAGER"]},
    {id:"logs",label:"Call Logs",icon:"📋",roles:["ADMIN","MANAGER","HR"]},
    {id:"users",label:"Users",icon:"👤",roles:["ADMIN"]},
  ];

  const nav=allNav.filter(n=>n.roles.includes(role));
  const roleColor={ADMIN:"#EF4444",MANAGER:"#3B7AF8",HR:"#10B981"};
  const roleLabel={ADMIN:"Admin",MANAGER:"HR Manager",HR:"HR"};
  const T_cur = isDark ? DARK : LIGHT;

  return(
    <>
      <style id="vcatch-theme">{getThemeCSS(T_cur)}</style>
      <div className="app">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-brand">🎯 VCatch</div>
            <div className="sidebar-tagline">HR IVR Portal</div>
          </div>
          <nav className="nav">
            <div className="nav-section">Menu</div>
            {nav.map(n=>(
              <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
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
              {isDark?"☀️ Light Mode":"🌙 Dark Mode"}
            </button>
            <button className="btn btn-sm btn-ghost btn-full" onClick={handleLogout}>Sign out</button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="main">
          {page==="dashboard"&&<Dashboard showToast={showToast} role={role}/>}
          {page==="campaigns"&&["ADMIN","MANAGER"].includes(role)&&<Campaigns showToast={showToast}/>}
          {page==="leads"&&<Leads showToast={showToast}/>}
          {page==="interested"&&<InterestedCandidates showToast={showToast}/>}
          {page==="dnd"&&["ADMIN","MANAGER"].includes(role)&&<DndList showToast={showToast}/>}
          {page==="callerids"&&["ADMIN","MANAGER"].includes(role)&&<CallerIds showToast={showToast}/>}
          {page==="audio"&&["ADMIN","MANAGER"].includes(role)&&<AudioManager showToast={showToast}/>}
          {page==="logs"&&<CallLogs showToast={showToast}/>}
          {page==="users"&&role==="ADMIN"&&<UserManagement showToast={showToast}/>}
        </div>
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}
