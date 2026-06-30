import { useState, useEffect, useRef, useCallback } from "react";

const SUPABASE_URL = "https://hndzvwkqveqjzaqegwmp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZHp2d2txdmVxanphcWVnd21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDc2MTksImV4cCI6MjA5Nzc4MzYxOX0.fajgDAY9JjM9jtG1BYkPqzB04hI8D96bJ0Hv5MZrIQ0";
const RENDER_URL = "https://vcatch-ivr-server.onrender.com";
const LOGO_BASE64 = "data:image/png;base64,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";

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
          <div style={{background:"#fff",borderRadius:12,padding:"12px 24px",display:"inline-block",marginBottom:8}}>
            <img src={LOGO_BASE64} alt="VCatch" style={{height:36,display:"block"}}/>
          </div>
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
      await renderFetch("/test-call",{method:"POST",body:JSON.stringify({phone:testPhone.trim(),campaign:"TEST",bypass_dnd:true})});
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
            {!isActive&&<div style={{fontSize:12,color:T.muted,marginTop:2}}>No campaign running. Go to Campaigns → Start.</div>}
          </div>
          {canControl&&<div className="input-row" style={{gap:8}}>
            <div className="field" style={{marginBottom:0,minWidth:160}}><input value={testPhone} onChange={e=>setTestPhone(e.target.value)} placeholder="Test call number" onKeyDown={e=>e.key==="Enter"&&sendTestCall()} style={{fontSize:13}}/></div>
            <button className="btn btn-sm btn-amber" onClick={sendTestCall} disabled={testLoading} title="Send test call">{testLoading?"...":"Test"}</button>
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
              <div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No campaigns yet</div><div className="empty-sub">Create a campaign, upload leads, then start dialing</div></div>
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
    return cMatch&&sMatch;
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
            {dnd.length===0?<div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No numbers blocked</div></div>:(
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
          <button className="btn btn-sm btn-ghost" onClick={doExport}>Export</button>
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
      showToast(`${form.email} created. Reset email sent.`,"success");
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

  async function deleteUser(email){
    if(!window.confirm(`Permanently delete ${email}? This cannot be undone.`)) return;
    try{
      await renderFetch("/auth/delete-user",{method:"DELETE",body:JSON.stringify({email})});
      showToast(`${email} deleted`,"success");
      load();
    }catch(e){showToast(e.message||"Failed to delete user","error");}
  }

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
            <div className="info-box amber" style={{marginBottom:12}}>A password reset email will be sent automatically so the user can set their own password.</div>
            <button className="btn btn-sm" onClick={createUser} disabled={adding}>{adding?"Creating...":"Create User & Send Email"}</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">All Users ({users.length})</div><button className="btn btn-sm btn-ghost" onClick={load}>↻</button></div>
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:users.length===0?<div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No users</div></div>:(
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
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <button className="btn btn-sm btn-ghost" onClick={()=>resetPassword(u.email)} disabled={resetting===u.email}>{resetting===u.email?"Sending...":"Reset Password"}</button>
                        {u.email!==getEmail()&&<button className="btn btn-sm btn-ghost" onClick={()=>toggleActive(u.id,u.is_active)}>{u.is_active?"Deactivate":"Activate"}</button>}
                        {u.email!==getEmail()&&<button className="btn btn-sm btn-danger" onClick={()=>deleteUser(u.email)}>Delete</button>}
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
  const [page,setPage]=useState(()=>localStorage.getItem("sb_page")||"dashboard");
  const [toast,setToast]=useState(null);
  const [role,setRole]=useState(()=>getRole());
  const [isDark,setIsDark]=useState(()=>localStorage.getItem("theme")!=="light");
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
    {id:"dashboard",label:"Dashboard",icon:"",roles:["ADMIN","MANAGER","HR"]},
    {id:"campaigns",label:"Campaigns",icon:"",roles:["ADMIN","MANAGER"]},
    {id:"leads",label:"Leads",icon:"",roles:["ADMIN","MANAGER","HR"]},
    {id:"interested",label:"Candidates",icon:"",roles:["ADMIN","MANAGER","HR"]},
    {id:"dnd",label:"DND List",icon:"",roles:["ADMIN","MANAGER"]},
    {id:"callerids",label:"Caller IDs",icon:"",roles:["ADMIN","MANAGER"]},
    {id:"audio",label:"Audio Manager",icon:"",roles:["ADMIN","MANAGER"]},
    {id:"logs",label:"Call Logs",icon:"",roles:["ADMIN","MANAGER","HR"]},
    {id:"users",label:"Users",icon:"",roles:["ADMIN"]},
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
            <div style={{background:"#fff",borderRadius:8,padding:"6px 12px",display:"inline-block",marginBottom:4}}>
              <img src={LOGO_BASE64} alt="VCatch" style={{height:24,display:"block"}}/>
            </div>
            <div className="sidebar-tagline">HR IVR Portal</div>
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
