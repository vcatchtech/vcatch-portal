import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://hndzvwkqveqjzaqegwmp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZHp2d2txdmVxanphcWVnd21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDc2MTksImV4cCI6MjA5Nzc4MzYxOX0.fajgDAY9JjM9jtG1BYkPqzB04hI8D96bJ0Hv5MZrIQ0";
const RENDER_URL = "https://vcatch-ivr-server.onrender.com";

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
  const res = await fetch(`${RENDER_URL}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
  return res.json();
}

async function signIn(email, password) {
  const data = await supaFetch("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) });
  localStorage.setItem("sb_session", JSON.stringify(data));
  return data;
}
async function signOut() {
  const s = JSON.parse(localStorage.getItem("sb_session") || "null");
  if (s?.access_token) await supaFetch("/auth/v1/logout", { method: "POST", headers: { Authorization: `Bearer ${s.access_token}` } });
  localStorage.removeItem("sb_session");
}
function getEmail() { try { return JSON.parse(localStorage.getItem("sb_session"))?.user?.email || ""; } catch { return ""; } }
async function dbSelect(table, params = "") { return supaFetch(`/rest/v1/${table}${params}`, { headers: { Prefer: "return=representation" } }); }
async function dbInsert(table, body) { return supaFetch(`/rest/v1/${table}`, { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(body) }); }
async function dbUpdate(table, match, body) { return supaFetch(`/rest/v1/${table}?${match}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(body) }); }
async function dbDelete(table, match) { return supaFetch(`/rest/v1/${table}?${match}`, { method: "DELETE" }); }

const T = {
  bg:"#0D0F14",surface:"#151820",card:"#1C2030",border:"#252A3A",
  accent:"#4F8EF7",accentDim:"#1E2E4A",green:"#34D399",greenDim:"#0D2E22",
  red:"#F87171",redDim:"#2E1515",amber:"#FBBF24",amberDim:"#2E2210",
  purple:"#A78BFA",purpleDim:"#1E1535",
  text:"#E8ECF4",muted:"#6B7594",font:"'Inter',system-ui,sans-serif",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${T.bg};color:${T.text};font-family:${T.font};}
  ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:${T.surface};}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px;}
  .login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;}
  .login-box{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:40px;width:380px;}
  .login-logo{font-size:22px;font-weight:700;color:${T.accent};letter-spacing:-0.5px;margin-bottom:6px;}
  .login-sub{color:${T.muted};font-size:13px;margin-bottom:32px;}
  .field{margin-bottom:16px;}
  .field label{display:block;font-size:12px;font-weight:500;color:${T.muted};margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;}
  .field input,.field select,.field textarea{width:100%;background:${T.surface};border:1px solid ${T.border};border-radius:8px;padding:10px 14px;color:${T.text};font-size:14px;outline:none;transition:border 0.15s;font-family:${T.font};}
  .field input:focus,.field select:focus,.field textarea:focus{border-color:${T.accent};}
  .btn{padding:11px 20px;background:${T.accent};color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:opacity 0.15s;font-family:${T.font};}
  .btn:hover{opacity:0.88;}.btn:disabled{opacity:0.5;cursor:not-allowed;}
  .btn-sm{padding:7px 14px;font-size:13px;border-radius:6px;}
  .btn-ghost{background:transparent;border:1px solid ${T.border};color:${T.text};}
  .btn-ghost:hover{background:${T.border};opacity:1;}
  .btn-danger{background:${T.red};color:#fff;}
  .btn-green{background:${T.green};color:#0D1A14;}
  .btn-amber{background:${T.amber};color:#1A1200;}
  .btn-purple{background:${T.purple};color:#fff;}
  .btn-full{width:100%;}
  .err{color:${T.red};font-size:13px;margin-top:12px;text-align:center;}
  .warn{color:${T.amber};font-size:12px;margin-top:6px;display:flex;align-items:center;gap:6px;}
  .app{display:flex;height:100vh;overflow:hidden;}
  .sidebar{width:220px;background:${T.surface};border-right:1px solid ${T.border};display:flex;flex-direction:column;padding:24px 0;flex-shrink:0;}
  .sidebar-brand{padding:0 20px 24px;font-size:18px;font-weight:700;color:${T.accent};letter-spacing:-0.5px;border-bottom:1px solid ${T.border};}
  .sidebar-brand span{font-size:11px;display:block;color:${T.muted};font-weight:400;margin-top:2px;letter-spacing:0;}
  .nav{flex:1;padding-top:16px;}
  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 20px;font-size:14px;color:${T.muted};cursor:pointer;transition:all 0.12s;border-left:3px solid transparent;}
  .nav-item:hover{color:${T.text};background:${T.card};}
  .nav-item.active{color:${T.accent};background:${T.accentDim};border-left-color:${T.accent};}
  .nav-icon{font-size:16px;width:20px;text-align:center;}
  .sidebar-footer{padding:16px 20px;border-top:1px solid ${T.border};}
  .user-info{font-size:12px;color:${T.muted};margin-bottom:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .main{flex:1;overflow-y:auto;background:${T.bg};}
  .page-header{padding:28px 32px 20px;border-bottom:1px solid ${T.border};margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
  .page-title{font-size:20px;font-weight:700;}
  .page-sub{font-size:13px;color:${T.muted};margin-top:2px;}
  .page-content{padding:0 32px 32px;}
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;}
  .stats-grid-5{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-bottom:28px;}
  .stat-card{background:${T.card};border:1px solid ${T.border};border-radius:12px;padding:20px;}
  .stat-label{font-size:11px;color:${T.muted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;}
  .stat-value{font-size:28px;font-weight:700;line-height:1;}
  .stat-sub{font-size:12px;color:${T.muted};margin-top:4px;}
  .green{color:${T.green};}.red{color:${T.red};}.amber{color:${T.amber};}.blue{color:${T.accent};}.purple{color:${T.purple};}
  .card{background:${T.card};border:1px solid ${T.border};border-radius:12px;overflow:hidden;margin-bottom:20px;}
  .card-header{padding:16px 20px;border-bottom:1px solid ${T.border};display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
  .card-title{font-size:14px;font-weight:600;}
  .card-body{padding:20px;}
  .table-wrap{overflow-x:auto;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  th{text-align:left;padding:10px 16px;color:${T.muted};font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid ${T.border};}
  td{padding:12px 16px;border-bottom:1px solid ${T.border};color:${T.text};}
  tr:last-child td{border-bottom:none;}tr:hover td{background:${T.surface};}
  .badge{display:inline-block;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;}
  .badge-green{background:${T.greenDim};color:${T.green};}
  .badge-red{background:${T.redDim};color:${T.red};}
  .badge-amber{background:${T.amberDim};color:${T.amber};}
  .badge-blue{background:${T.accentDim};color:${T.accent};}
  .badge-gray{background:${T.surface};color:${T.muted};}
  .badge-purple{background:${T.purpleDim};color:${T.purple};}
  .drop-zone{border:2px dashed ${T.border};border-radius:12px;padding:48px 32px;text-align:center;cursor:pointer;transition:all 0.2s;}
  .drop-zone:hover,.drop-zone.drag-over{border-color:${T.accent};background:${T.accentDim};}
  .drop-zone-icon{font-size:36px;margin-bottom:12px;}
  .drop-zone-text{font-size:15px;font-weight:500;margin-bottom:6px;}
  .drop-zone-sub{font-size:13px;color:${T.muted};}
  .audio-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid ${T.border};}
  .audio-row:last-child{border-bottom:none;}
  .audio-label{font-size:14px;font-weight:500;}.audio-key{font-size:11px;color:${T.muted};font-family:monospace;margin-top:2px;}
  .audio-actions{display:flex;gap:8px;align-items:center;}
  .filter-row{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center;}
  .filter-select{background:${T.surface};border:1px solid ${T.border};border-radius:7px;padding:7px 12px;color:${T.text};font-size:13px;outline:none;cursor:pointer;font-family:${T.font};}
  .filter-select:focus{border-color:${T.accent};}
  .filter-input{background:${T.surface};border:1px solid ${T.border};border-radius:7px;padding:7px 12px;color:${T.text};font-size:13px;outline:none;font-family:${T.font};}
  .filter-input:focus{border-color:${T.accent};}
  .empty-state{text-align:center;padding:48px;color:${T.muted};}
  .empty-state-icon{font-size:36px;margin-bottom:12px;}
  .empty-state-text{font-size:15px;font-weight:500;margin-bottom:6px;color:${T.text};}
  .toast{position:fixed;bottom:24px;right:24px;background:${T.card};border:1px solid ${T.border};border-radius:10px;padding:14px 18px;font-size:13px;z-index:999;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:slideUp 0.2s ease;}
  @keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
  .progress-bar{height:4px;background:${T.border};border-radius:2px;overflow:hidden;margin-top:8px;}
  .progress-fill{height:100%;background:${T.accent};border-radius:2px;transition:width 0.3s;}
  .tag{display:inline-block;background:${T.accentDim};color:${T.accent};border-radius:4px;padding:2px 7px;font-size:11px;font-weight:500;margin-right:4px;}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:100;}
  .modal{background:${T.card};border:1px solid ${T.border};border-radius:14px;padding:28px;width:480px;max-width:95vw;max-height:90vh;overflow-y:auto;}
  .modal-title{font-size:16px;font-weight:700;margin-bottom:6px;}
  .modal-sub{font-size:13px;color:${T.muted};margin-bottom:20px;}
  .modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;}
  .live-dot{width:8px;height:8px;border-radius:50%;background:${T.green};display:inline-block;margin-right:6px;animation:pulse 1.5s infinite;}
  .live-dot.inactive{background:${T.muted};animation:none;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
  .input-row{display:flex;gap:8px;align-items:flex-end;}
  .input-row .field{flex:1;margin-bottom:0;}
  .reject-row{background:${T.redDim};border-radius:6px;padding:8px 12px;margin-bottom:6px;font-size:12px;display:flex;align-items:center;justify-content:space-between;}
  .reject-reason{color:${T.red};font-size:11px;}
  .valid-count{color:${T.green};font-size:13px;font-weight:600;}
  .section-divider{border:none;border-top:1px solid ${T.border};margin:20px 0;}
  .update-row{padding:12px 0;border-bottom:1px solid ${T.border};}
  .update-row:last-child{border-bottom:none;}
  .update-meta{font-size:11px;color:${T.muted};margin-top:4px;}
  .update-comment{font-size:13px;color:${T.text};margin-top:4px;font-style:italic;}
`;

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
  return <div className="toast">{icon} {msg}</div>;
}

function DisposBadge({ sub }) {
  const map = {
    INTERESTED:["badge-green","Interested"],NOT_INTERESTED:["badge-red","Not Interested"],
    NO_RESPONSE:["badge-amber","No Response"],INVALID_INPUT:["badge-amber","Invalid Input"],
    BUSY:["badge-gray","Busy"],FAILED:["badge-gray","Failed"],
    CALL_DISCONNECTED:["badge-blue","Disconnected"],PENDING:["badge-gray","Pending"],
    CALLED:["badge-blue","Called"],RETRY:["badge-amber","Retry"],
    PICKED_UP:["badge-green","Picked Up"],REJECTED:["badge-red","Rejected"],
    HIRED:["badge-purple","Hired"],
  };
  const [cls,label] = map[sub]||["badge-gray",sub||"—"];
  return <span className={`badge ${cls}`}>{label}</span>;
}

function downloadCSV(filename, headers, rows) {
  const bom = "\uFEFF";
  const csv = bom + [headers.join(","), ...rows.map(r => r.map(v => `"${v??""}""`).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = filename;
  a.click();
}

// ================================================
// LOGIN
// ================================================
function LoginPage({ onLogin }) {
  const [email,setEmail]=useState("");const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);const [error,setError]=useState("");
  async function handleLogin(){
    setLoading(true);setError("");
    try{const s=await signIn(email,password);onLogin(s);}
    catch(e){setError(e.message||"Login failed");}
    finally{setLoading(false);}
  }
  return(
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-logo">VCatch</div>
        <div className="login-sub">HR Portal — Sign in to continue</div>
        <div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="hr@company.com" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
        <div className="field"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
        <button className="btn btn-full" onClick={handleLogin} disabled={loading}>{loading?"Signing in...":"Sign in"}</button>
        {error&&<div className="err">{error}</div>}
      </div>
    </div>
  );
}

// ================================================
// DASHBOARD
// ================================================
function Dashboard({ showToast }) {
  const [stats,setStats]=useState(null);
  const [dialerStatus,setDialerStatus]=useState(null);
  const [recentLogs,setRecentLogs]=useState([]);
  const [testPhone,setTestPhone]=useState("");
  const [testLoading,setTestLoading]=useState(false);

  useEffect(()=>{loadAll();const i=setInterval(loadDialerStatus,5000);return()=>clearInterval(i);},[]);

  async function loadAll(){await Promise.all([loadStats(),loadDialerStatus()]);}

  async function loadStats(){
    try{
      const [logs,leads]=await Promise.all([
        dbSelect("call_logs","?select=sub_disposition"),
        dbSelect("leads","?select=status"),
      ]);
      setStats({
        total:logs.length,
        interested:logs.filter(l=>l.sub_disposition==="INTERESTED").length,
        notConnected:logs.filter(l=>["BUSY","FAILED"].includes(l.sub_disposition)).length,
        pending:leads.filter(l=>l.status==="PENDING").length,
        retry:leads.filter(l=>l.status==="RETRY").length,
      });
      const recent=await dbSelect("call_logs","?select=phone,campaign,main_disposition,sub_disposition,logged_at&order=logged_at.desc&limit=10");
      setRecentLogs(recent);
    }catch(e){console.error(e);}
  }

  async function loadDialerStatus(){
    try{const s=await renderFetch("/campaign-status");setDialerStatus(s);}
    catch(e){}
  }

  async function sendTestCall(){
    if(!testPhone.trim()){showToast("Enter a phone number","error");return;}
    setTestLoading(true);
    try{
      const res=await renderFetch("/test-call",{method:"POST",body:JSON.stringify({phone:testPhone.trim(),campaign:"TEST"})});
      if(res.error)throw new Error(res.error);
      showToast(`Test call sent to ${testPhone}`,"success");setTestPhone("");
    }catch(e){showToast(e.message||"Test call failed","error");}
    finally{setTestLoading(false);}
  }

  const connRate=stats?.total?Math.round(((stats.total-stats.notConnected)/stats.total)*100):0;
  const isActive=dialerStatus?.is_active;

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Dashboard</div><div className="page-sub">Live overview of your IVR campaigns</div></div>
        <button className="btn btn-sm btn-ghost" onClick={loadAll}>↻ Refresh</button>
      </div>
      <div className="page-content">
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Total Calls</div><div className="stat-value blue">{stats?.total??"—"}</div><div className="stat-sub">All time</div></div>
          <div className="stat-card"><div className="stat-label">Interested</div><div className="stat-value green">{stats?.interested??"—"}</div><div className="stat-sub">{stats?.total?`${Math.round((stats.interested/stats.total)*100)}% rate`:""}</div></div>
          <div className="stat-card"><div className="stat-label">Not Connected</div><div className="stat-value red">{stats?.notConnected??"—"}</div><div className="stat-sub">Busy + Failed</div></div>
          <div className="stat-card"><div className="stat-label">Pending + Retry</div><div className="stat-value amber">{(stats?.pending??0)+(stats?.retry??0)}</div><div className="stat-sub">Awaiting call</div></div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
          <div className="card">
            <div className="card-header"><div className="card-title"><span className={`live-dot ${isActive?"":"inactive"}`}></span>{isActive?"Dialer Active":"Dialer Idle"}</div></div>
            <div className="card-body">
              {isActive?<div><div style={{fontSize:13,color:T.muted,marginBottom:8}}>Running campaign:</div><span className="tag">{dialerStatus?.campaign||"Unknown"}</span></div>
              :<div style={{fontSize:13,color:T.muted}}>No campaign running. Start one from the Campaigns page.</div>}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">🧪 Test Call</div></div>
            <div className="card-body">
              <div style={{fontSize:13,color:T.muted,marginBottom:12}}>Send a test call to any number to verify audio.</div>
              <div className="input-row">
                <div className="field"><label>Phone Number</label><input value={testPhone} onChange={e=>setTestPhone(e.target.value)} placeholder="9876543210" onKeyDown={e=>e.key==="Enter"&&sendTestCall()}/></div>
                <button className="btn btn-sm btn-amber" onClick={sendTestCall} disabled={testLoading}>{testLoading?"Calling...":"📞 Call"}</button>
              </div>
            </div>
          </div>
        </div>

        {stats&&<div className="card" style={{marginBottom:20}}><div className="card-header"><div className="card-title">Connection Rate</div><span style={{fontSize:13,color:T.accent,fontWeight:600}}>{connRate}%</span></div><div className="card-body"><div className="progress-bar"><div className="progress-fill" style={{width:`${connRate}%`}}/></div></div></div>}

        <div className="card">
          <div className="card-header"><div className="card-title">Recent Calls</div></div>
          <div className="table-wrap">
            {recentLogs.length===0?<div className="empty-state"><div className="empty-state-icon">📞</div><div className="empty-state-text">No calls yet</div></div>:(
              <table>
                <thead><tr><th>Phone</th><th>Campaign</th><th>Result</th><th>Time</th></tr></thead>
                <tbody>{recentLogs.map((log,i)=>(
                  <tr key={i}>
                    <td style={{fontFamily:"monospace"}}>{log.phone}</td>
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
  const [showCreate,setShowCreate]=useState(false);
  const [callerIds,setCallerIds]=useState([]);
  const [form,setForm]=useState({name:"",description:"",caller_id:"",max_retries:1,retry_after_minutes:30});
  const [starting,setStarting]=useState(null);

  useEffect(()=>{loadCampaigns();loadCallerIds();},[]);

  async function loadCampaigns(){
    try{const d=await dbSelect("campaigns","?select=*&order=created_at.desc");setCampaigns(d);}
    catch(e){showToast("Failed to load campaigns","error");}
  }
  async function loadCallerIds(){
    try{const d=await dbSelect("caller_ids","?select=*&is_active=eq.true");setCallerIds(d);}catch(e){}
  }
  async function createCampaign(){
    if(!form.name.trim()){showToast("Campaign name required","error");return;}
    try{
      await dbInsert("campaigns",{...form,status:"PENDING"});
      showToast("Campaign created!","success");
      setShowCreate(false);setForm({name:"",description:"",caller_id:"",max_retries:1,retry_after_minutes:30});
      loadCampaigns();
    }catch(e){showToast("Failed to create campaign","error");}
  }
  async function startCampaign(name){
    setStarting(name);
    try{
      const res=await renderFetch("/start-campaign",{method:"POST",body:JSON.stringify({campaign:name})});
      if(res.error)throw new Error(res.error);
      showToast(`Campaign "${name}" started!`,"success");loadCampaigns();
    }catch(e){showToast(e.message||"Failed to start","error");}
    finally{setStarting(null);}
  }

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Campaigns</div><div className="page-sub">Create and manage calling campaigns</div></div>
        <button className="btn btn-sm" onClick={()=>setShowCreate(true)}>+ New Campaign</button>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="table-wrap">
            {campaigns.length===0?<div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-text">No campaigns yet</div></div>:(
              <table>
                <thead><tr><th>Name</th><th>Status</th><th>Caller ID</th><th>Max Retries</th><th>Retry After</th><th>Action</th></tr></thead>
                <tbody>{campaigns.map(c=>(
                  <tr key={c.id}>
                    <td><div style={{fontWeight:500}}>{c.name}</div><div style={{fontSize:12,color:T.muted}}>{c.description}</div></td>
                    <td><DisposBadge sub={c.status}/></td>
                    <td style={{fontFamily:"monospace",fontSize:12}}>{c.caller_id||"—"}</td>
                    <td>{c.max_retries}</td>
                    <td>{c.retry_after_minutes} min</td>
                    <td>{c.status!=="RUNNING"?<button className="btn btn-sm btn-green" onClick={()=>startCampaign(c.name)} disabled={starting===c.name}>{starting===c.name?"Starting...":"▶ Start"}</button>:<span style={{fontSize:12,color:T.green}}><span className="live-dot"></span>Running</span>}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showCreate&&(
        <div className="modal-overlay" onClick={()=>setShowCreate(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">New Campaign</div>
            <div className="modal-sub">Configure your outbound calling campaign</div>
            <div className="field"><label>Campaign Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Malayalam Hiring June"/></div>
            <div className="field"><label>Description</label><input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Optional"/></div>
            <div className="field"><label>Caller ID</label>
              <select value={form.caller_id} onChange={e=>setForm({...form,caller_id:e.target.value})}>
                <option value="">Use default</option>
                {callerIds.map(c=><option key={c.id} value={c.number}>{c.label} ({c.number})</option>)}
              </select>
            </div>
            <div className="two-col">
              <div className="field"><label>Max Retries</label><input type="number" min="1" max="10" value={form.max_retries} onChange={e=>setForm({...form,max_retries:parseInt(e.target.value)})}/></div>
              <div className="field">
                <label>Retry After (minutes)</label>
                <input type="number" min="1" value={form.retry_after_minutes} onChange={e=>setForm({...form,retry_after_minutes:parseInt(e.target.value)})}/>
                {form.retry_after_minutes<30&&<div className="warn">⚠️ Recommended: at least 30 minutes</div>}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-sm btn-ghost" onClick={()=>setShowCreate(false)}>Cancel</button>
              <button className="btn btn-sm" onClick={createCampaign}>Create Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================================
// LEADS — with validation
// ================================================
function Leads({ showToast }) {
  const [leads,setLeads]=useState([]);
  const [loading,setLoading]=useState(false);
  const [dragOver,setDragOver]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [validRows,setValidRows]=useState([]);
  const [rejectedRows,setRejectedRows]=useState([]);
  const [dndConflicts,setDndConflicts]=useState([]);
  const [campaign,setCampaign]=useState("");
  const [maxRetries,setMaxRetries]=useState(1);
  const [retryAfter,setRetryAfter]=useState(30);
  const [filterCampaign,setFilterCampaign]=useState("ALL");
  const [filterStatus,setFilterStatus]=useState("ALL");
  const [campaigns,setCampaigns]=useState([]);
  const fileRef=useRef();
  const selectedFile=useRef(null);

  useEffect(()=>{loadLeads();},[]);

  async function loadLeads(){
    setLoading(true);
    try{
      const data=await dbSelect("leads","?select=*&order=uploaded_at.desc&limit=500");
      setLeads(data);
      setCampaigns([...new Set(data.map(l=>l.campaign).filter(Boolean))]);
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
      if(phone.length!==10){rejected.push({...row,phone,_reason:`Invalid length: ${phone.length} digits (need 10)`,_line:idx+2});return;}
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

    // Check DND conflicts
    let dndList=[];
    try{const d=await dbSelect("dnd_list","?select=phone");dndList=d.map(r=>r.phone);}catch(e){}
    const dndHits=valid.filter(r=>dndList.includes(r.phone));
    const cleanValid=valid.filter(r=>!dndList.includes(r.phone));

    setValidRows(cleanValid);
    setRejectedRows(rejected);
    setDndConflicts(dndHits);
  }

  function downloadTemplate(){
    downloadCSV("vcatch_leads_template.csv",["name","phone"],[["John Doe","9876543210"],["Jane Smith","9123456789"]]);
    showToast("Template downloaded","success");
  }

  function downloadRejected(){
    if(!rejectedRows.length)return;
    downloadCSV(`rejected_leads_${Date.now()}.csv`,["name","phone","reason"],rejectedRows.map(r=>[r.name||"",r.phone||"",r._reason]));
    showToast("Rejected rows downloaded","success");
  }

  async function uploadLeads(){
    if(!campaign.trim()){showToast("Enter a campaign name first","error");return;}
    if(!validRows.length){showToast("No valid leads to upload","error");return;}
    setUploading(true);
    try{
      const payload=validRows.map(r=>({name:r.name,phone:r.phone,campaign:campaign.trim(),status:"PENDING",max_retries:maxRetries,retry_after_minutes:retryAfter}));
      await dbInsert("leads",payload);
      showToast(`${payload.length} leads uploaded to "${campaign}"`,"success");
      setValidRows([]);setRejectedRows([]);setDndConflicts([]);setCampaign("");
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
        <div><div className="page-title">Leads</div><div className="page-sub">Upload and manage candidate leads</div></div>
        <button className="btn btn-sm btn-ghost" onClick={downloadTemplate}>↓ Download Template</button>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">Upload Leads CSV</div></div>
          <div className="card-body">
            <div className="two-col" style={{marginBottom:16}}>
              <div className="field"><label>Campaign Name *</label><input placeholder="e.g. Malayalam Hiring June" value={campaign} onChange={e=>setCampaign(e.target.value)}/></div>
              <div></div>
            </div>
            <div className="two-col" style={{marginBottom:16}}>
              <div className="field"><label>Max Retries</label><input type="number" min="1" max="10" value={maxRetries} onChange={e=>setMaxRetries(parseInt(e.target.value))}/></div>
              <div className="field">
                <label>Retry After (minutes)</label>
                <input type="number" min="1" value={retryAfter} onChange={e=>setRetryAfter(parseInt(e.target.value))}/>
                {retryAfter<30&&<div className="warn">⚠️ Recommended: at least 30 minutes</div>}
              </div>
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
                <hr className="section-divider"/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
                  <div style={{background:T.greenDim,border:`1px solid ${T.green}`,borderRadius:8,padding:12,textAlign:"center"}}>
                    <div style={{fontSize:24,fontWeight:700,color:T.green}}>{validRows.length}</div>
                    <div style={{fontSize:12,color:T.green}}>Valid — Ready to upload</div>
                  </div>
                  <div style={{background:T.redDim,border:`1px solid ${T.red}`,borderRadius:8,padding:12,textAlign:"center"}}>
                    <div style={{fontSize:24,fontWeight:700,color:T.red}}>{rejectedRows.length}</div>
                    <div style={{fontSize:12,color:T.red}}>Rejected — Invalid numbers</div>
                  </div>
                  <div style={{background:T.amberDim,border:`1px solid ${T.amber}`,borderRadius:8,padding:12,textAlign:"center"}}>
                    <div style={{fontSize:24,fontWeight:700,color:T.amber}}>{dndConflicts.length}</div>
                    <div style={{fontSize:12,color:T.amber}}>DND Conflicts — Skipped</div>
                  </div>
                </div>

                {rejectedRows.length>0&&(
                  <div style={{marginBottom:16}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontSize:13,fontWeight:600,color:T.red}}>❌ Rejected Numbers</div>
                      <button className="btn btn-sm btn-danger" onClick={downloadRejected}>↓ Download to Fix</button>
                    </div>
                    {rejectedRows.slice(0,5).map((r,i)=>(
                      <div key={i} className="reject-row">
                        <div><span style={{fontFamily:"monospace"}}>{r.phone||"—"}</span> {r.name&&`| ${r.name}`}</div>
                        <div className="reject-reason">{r._reason}</div>
                      </div>
                    ))}
                    {rejectedRows.length>5&&<div style={{fontSize:12,color:T.muted,marginTop:6}}>...and {rejectedRows.length-5} more. Download to see all.</div>}
                  </div>
                )}

                {dndConflicts.length>0&&(
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.amber,marginBottom:8}}>🚫 DND Conflicts (will be skipped)</div>
                    {dndConflicts.slice(0,3).map((r,i)=>(
                      <div key={i} className="reject-row" style={{background:T.amberDim,borderColor:T.amber}}>
                        <span style={{fontFamily:"monospace"}}>{r.phone}</span> {r.name&&`| ${r.name}`}
                        <span className="reject-reason">On DND list</span>
                      </div>
                    ))}
                    {dndConflicts.length>3&&<div style={{fontSize:12,color:T.muted,marginTop:6}}>...and {dndConflicts.length-3} more</div>}
                  </div>
                )}

                {validRows.length>0&&(
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn btn-sm btn-green" disabled={uploading} onClick={uploadLeads}>{uploading ? "Uploading..." : `✓ Upload ${validRows.length} Valid Leads`}</button>
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
            <div className="filter-row" style={{margin:0}}>
              <select className="filter-select" value={filterCampaign} onChange={e=>setFilterCampaign(e.target.value)}>
                <option value="ALL">All Campaigns</option>
                {campaigns.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CALLED">Called</option>
                <option value="RETRY">Retry</option>
              </select>
              <button className="btn btn-sm btn-ghost" onClick={loadLeads}>↻</button>
            </div>
          </div>
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:filtered.length===0?(
              <div className="empty-state"><div className="empty-state-icon">👥</div><div className="empty-state-text">No leads yet</div></div>
            ):(
              <table>
                <thead><tr><th>Name</th><th>Phone</th><th>Campaign</th><th>Status</th><th>Attempts</th><th>Last Called</th></tr></thead>
                <tbody>{filtered.map(lead=>(
                  <tr key={lead.id}>
                    <td style={{fontWeight:500}}>{lead.name}</td>
                    <td style={{fontFamily:"monospace"}}>{lead.phone}</td>
                    <td><span className="tag">{lead.campaign}</span></td>
                    <td><DisposBadge sub={lead.status}/></td>
                    <td>{lead.attempt_count||0} / {lead.max_retries||1}</td>
                    <td style={{color:T.muted,fontSize:12}}>{lead.last_attempt_at?new Date(lead.last_attempt_at).toLocaleString("en-IN"):"—"}</td>
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
// INTERESTED CANDIDATES MODULE
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

  useEffect(()=>{loadCandidates();},[]);

  async function loadCandidates(){
    setLoading(true);
    try{
      const [logs,updatesData]=await Promise.all([
        dbSelect("call_logs","?select=phone,campaign,logged_at&sub_disposition=eq.INTERESTED&order=logged_at.desc"),
        dbSelect("candidate_updates","?select=*&order=updated_at.desc"),
      ]);
      // Get lead names
      const phones=[...new Set(logs.map(l=>l.phone))];
      let leadsMap={};
      if(phones.length){
        const leads=await dbSelect("leads",`?select=phone,name&phone=in.(${phones.join(",")})`);
        leads.forEach(l=>leadsMap[l.phone]=l.name);
      }
      const enriched=logs.map(l=>({...l,name:leadsMap[l.phone]||"Unknown"}));
      setCandidates(enriched);
      setCampaigns([...new Set(enriched.map(c=>c.campaign).filter(Boolean))]);

      // Map updates by phone (latest per phone)
      const updMap={};
      updatesData.forEach(u=>{if(!updMap[u.phone])updMap[u.phone]=[];updMap[u.phone].push(u);});
      setUpdates(updMap);
    }catch(e){showToast("Failed to load candidates","error");}
    finally{setLoading(false);}
  }

  async function saveUpdate(){
    if(!selected){return;}
    setSaving(true);
    try{
      await dbInsert("candidate_updates",{
        phone:selected.phone,
        candidate_name:selected.name,
        campaign:selected.campaign,
        status:updateForm.status,
        comment:updateForm.comment,
        updated_by:getEmail(),
      });
      showToast("Update saved","success");
      setSelected(null);setUpdateForm({status:"PENDING",comment:""});
      loadCandidates();
    }catch(e){showToast("Failed to save update","error");}
    finally{setSaving(false);}
  }

  function exportReport(){
    const rows=filtered.map(c=>{
      const latestUpdate=updates[c.phone]?.[0];
      return[c.name,c.phone,c.campaign,latestUpdate?.status||"PENDING",latestUpdate?.comment||"",latestUpdate?.updated_by||"",latestUpdate?.updated_at?new Date(latestUpdate.updated_at).toLocaleString("en-IN"):"",new Date(c.logged_at).toLocaleString("en-IN")];
    });
    downloadCSV(`interested_candidates_${Date.now()}.csv`,["Name","Phone","Campaign","Status","Comment","Updated By","Updated At","Called At"],rows);
    showToast("Report downloaded","success");
  }

  const filtered=candidates.filter(c=>{
    const cMatch=filterCampaign==="ALL"||c.campaign===filterCampaign;
    const latestStatus=updates[c.phone]?.[0]?.status||"PENDING";
    const sMatch=filterStatus==="ALL"||latestStatus===filterStatus;
    return cMatch&&sMatch;
  });

  // KPIs
  const total=candidates.length;
  const statusCounts={PICKED_UP:0,REJECTED:0,HIRED:0,PENDING:0};
  candidates.forEach(c=>{const s=updates[c.phone]?.[0]?.status||"PENDING";statusCounts[s]=(statusCounts[s]||0)+1;});
  const convRate=total?Math.round((statusCounts.HIRED/total)*100):0;

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Interested Candidates</div><div className="page-sub">Track follow-ups and interview pipeline</div></div>
        <button className="btn btn-sm btn-ghost" onClick={exportReport}>↓ Download Report</button>
      </div>
      <div className="page-content">
        <div className="stats-grid-5">
          <div className="stat-card"><div className="stat-label">Total Interested</div><div className="stat-value blue">{total}</div></div>
          <div className="stat-card"><div className="stat-label">Picked Up</div><div className="stat-value green">{statusCounts.PICKED_UP}</div></div>
          <div className="stat-card"><div className="stat-label">Rejected</div><div className="stat-value red">{statusCounts.REJECTED}</div></div>
          <div className="stat-card"><div className="stat-label">Hired</div><div className="stat-value purple">{statusCounts.HIRED}</div></div>
          <div className="stat-card"><div className="stat-label">Conversion Rate</div><div className="stat-value amber">{convRate}%</div><div className="stat-sub">Interested → Hired</div></div>
        </div>

        <div className="filter-row">
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
          <button className="btn btn-sm btn-ghost" onClick={loadCandidates}>↻</button>
        </div>

        <div className="card">
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:filtered.length===0?(
              <div className="empty-state"><div className="empty-state-icon">⭐</div><div className="empty-state-text">No interested candidates yet</div><div className="empty-state-sub">Candidates who press 1 appear here</div></div>
            ):(
              <table>
                <thead><tr><th>Name</th><th>Phone</th><th>Campaign</th><th>Status</th><th>Last Update</th><th>Updated By</th><th>Action</th></tr></thead>
                <tbody>{filtered.map((c,i)=>{
                  const latest=updates[c.phone]?.[0];
                  return(
                    <tr key={i}>
                      <td style={{fontWeight:500}}>{c.name}</td>
                      <td style={{fontFamily:"monospace"}}>{c.phone}</td>
                      <td><span className="tag">{c.campaign}</span></td>
                      <td><DisposBadge sub={latest?.status||"PENDING"}/></td>
                      <td style={{fontSize:12,color:T.muted,maxWidth:200}}>{latest?.comment||"—"}</td>
                      <td style={{fontSize:12,color:T.muted}}>{latest?.updated_by||"—"}</td>
                      <td><button className="btn btn-sm btn-purple" onClick={()=>{setSelected(c);setUpdateForm({status:latest?.status||"PENDING",comment:""});}}>+ Update</button></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selected&&(
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Update: {selected.name}</div>
            <div className="modal-sub" style={{fontFamily:"monospace"}}>{selected.phone} · {selected.campaign}</div>

            {/* Update history */}
            {updates[selected.phone]?.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:600,color:T.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>History</div>
                {updates[selected.phone].map((u,i)=>(
                  <div key={i} className="update-row">
                    <div style={{display:"flex",alignItems:"center",gap:8}}><DisposBadge sub={u.status}/><span style={{fontSize:12,color:T.muted}}>by {u.updated_by}</span></div>
                    {u.comment&&<div className="update-comment">"{u.comment}"</div>}
                    <div className="update-meta">{new Date(u.updated_at).toLocaleString("en-IN")}</div>
                  </div>
                ))}
              </div>
            )}

            <hr className="section-divider"/>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Add New Update</div>
            <div className="field">
              <label>Status</label>
              <select value={updateForm.status} onChange={e=>setUpdateForm({...updateForm,status:e.target.value})}>
                <option value="PENDING">Pending</option>
                <option value="PICKED_UP">Picked Up for Interview</option>
                <option value="REJECTED">Rejected</option>
                <option value="HIRED">Hired</option>
              </select>
            </div>
            <div className="field">
              <label>Comment (optional)</label>
              <textarea rows="3" style={{resize:"vertical"}} placeholder="Add notes about this candidate..." value={updateForm.comment} onChange={e=>setUpdateForm({...updateForm,comment:e.target.value})}/>
            </div>
            <div style={{fontSize:12,color:T.muted,marginBottom:16}}>Will be saved as: <strong>{getEmail()}</strong></div>
            <div className="modal-actions">
              <button className="btn btn-sm btn-ghost" onClick={()=>setSelected(null)}>Cancel</button>
              <button className="btn btn-sm btn-purple" onClick={saveUpdate} disabled={saving}>{saving?"Saving...":"Save Update"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================================
// DND
// ================================================
function DndList({ showToast }) {
  const [dnd,setDnd]=useState([]);
  const [phone,setPhone]=useState("");
  const [adding,setAdding]=useState(false);

  useEffect(()=>{load();},[]);
  async function load(){try{const d=await dbSelect("dnd_list","?select=*&order=added_at.desc");setDnd(d);}catch(e){showToast("Failed to load DND","error");}}
  async function addDnd(){
    const clean=phone.replace(/\D/g,"");
    if(!clean||clean.length!==10){showToast("Enter a valid 10-digit number","error");return;}
    setAdding(true);
    try{await dbInsert("dnd_list",{phone:clean,reason:"MANUAL"});showToast(`${clean} added to DND`,"success");setPhone("");load();}
    catch(e){showToast("Already in DND or failed","error");}
    finally{setAdding(false);}
  }
  async function removeDnd(p){
    try{await dbDelete("dnd_list",`phone=eq.${p}`);showToast(`${p} removed from DND`,"success");load();}
    catch(e){showToast("Failed to remove","error");}
  }

  return(
    <div>
      <div className="page-header"><div><div className="page-title">DND List</div><div className="page-sub">Numbers blocked from all campaigns. Not Interested responses auto-added.</div></div></div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">Add to DND</div></div>
          <div className="card-body">
            <div className="input-row">
              <div className="field"><label>Phone Number (10 digits)</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="9876543210" onKeyDown={e=>e.key==="Enter"&&addDnd()}/></div>
              <button className="btn btn-sm btn-danger" onClick={addDnd} disabled={adding}>{adding?"Adding...":"Block Number"}</button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Blocked Numbers ({dnd.length})</div><button className="btn btn-sm btn-ghost" onClick={load}>↻</button></div>
          <div className="table-wrap">
            {dnd.length===0?<div className="empty-state"><div className="empty-state-icon">🚫</div><div className="empty-state-text">No numbers blocked</div></div>:(
              <table>
                <thead><tr><th>Phone</th><th>Reason</th><th>Added</th><th>Action</th></tr></thead>
                <tbody>{dnd.map(d=>(
                  <tr key={d.id}>
                    <td style={{fontFamily:"monospace"}}>{d.phone}</td>
                    <td><DisposBadge sub={d.reason==="NOT_INTERESTED"?"NOT_INTERESTED":"MANUAL"}/></td>
                    <td style={{color:T.muted,fontSize:12}}>{new Date(d.added_at).toLocaleDateString("en-IN")}</td>
                    <td><button className="btn btn-sm btn-ghost" onClick={()=>removeDnd(d.phone)}>Remove</button></td>
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
  const [callerIds,setCallerIds]=useState([]);
  const [number,setNumber]=useState("");const [label,setLabel]=useState("");const [adding,setAdding]=useState(false);

  useEffect(()=>{load();},[]);
  async function load(){try{const d=await dbSelect("caller_ids","?select=*&order=added_at.desc");setCallerIds(d);}catch(e){showToast("Failed to load","error");}}
  async function add(){
    const clean=number.replace(/\s/g,"");
    if(!clean){showToast("Enter a phone number","error");return;}
    setAdding(true);
    try{await dbInsert("caller_ids",{number:clean,label:label||clean,is_active:true});showToast("Caller ID added","success");setNumber("");setLabel("");load();}
    catch(e){showToast("Already exists or failed","error");}
    finally{setAdding(false);}
  }
  async function toggleActive(id,current){try{await dbUpdate("caller_ids",`id=eq.${id}`,{is_active:!current});load();}catch(e){showToast("Failed","error");}}
  async function remove(id){try{await dbDelete("caller_ids",`id=eq.${id}`);showToast("Removed","success");load();}catch(e){showToast("Failed","error");}}

  return(
    <div>
      <div className="page-header"><div><div className="page-title">Caller IDs</div><div className="page-sub">Manage outbound phone numbers</div></div></div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">Add Caller ID</div></div>
          <div className="card-body">
            <div className="two-col">
              <div className="field"><label>Number (with country code)</label><input value={number} onChange={e=>setNumber(e.target.value)} placeholder="+918071579999"/></div>
              <div className="field"><label>Label</label><input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Primary Number"/></div>
            </div>
            <button className="btn btn-sm" onClick={add} disabled={adding}>{adding?"Adding...":"Add Number"}</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Your Numbers ({callerIds.length})</div><button className="btn btn-sm btn-ghost" onClick={load}>↻</button></div>
          <div className="table-wrap">
            {callerIds.length===0?<div className="empty-state"><div className="empty-state-icon">📱</div><div className="empty-state-text">No caller IDs yet</div></div>:(
              <table>
                <thead><tr><th>Number</th><th>Label</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{callerIds.map(c=>(
                  <tr key={c.id}>
                    <td style={{fontFamily:"monospace"}}>{c.number}</td>
                    <td>{c.label}</td>
                    <td><span className={`badge ${c.is_active?"badge-green":"badge-gray"}`}>{c.is_active?"Active":"Inactive"}</span></td>
                    <td style={{display:"flex",gap:8}}>
                      <button className="btn btn-sm btn-ghost" onClick={()=>toggleActive(c.id,c.is_active)}>{c.is_active?"Deactivate":"Activate"}</button>
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
  const [audioFiles,setAudioFiles]=useState([]);
  const [editing,setEditing]=useState(null);
  const [newUrl,setNewUrl]=useState("");
  const [saving,setSaving]=useState(false);

  useEffect(()=>{load();},[]);
  async function load(){try{const d=await dbSelect("audio_files","?select=*&order=key");setAudioFiles(d);}catch(e){showToast("Failed to load audio","error");}}
  async function saveUrl(){
    if(!newUrl.trim())return;
    setSaving(true);
    try{await dbUpdate("audio_files",`key=eq.${editing.key}`,{url:newUrl.trim(),updated_at:new Date().toISOString()});showToast(`${editing.label} updated`,"success");setEditing(null);setNewUrl("");load();}
    catch(e){showToast("Failed to save","error");}
    finally{setSaving(false);}
  }

  return(
    <div>
      <div className="page-header"><div><div className="page-title">Audio Manager</div><div className="page-sub">Update IVR audio files — changes go live instantly</div></div></div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><div className="card-title">IVR Audio Files</div></div>
          <div className="card-body">
            {audioFiles.map(af=>(
              <div key={af.key} className="audio-row">
                <div><div className="audio-label">{af.label}</div><div className="audio-key">{af.key}</div></div>
                <div className="audio-actions">
                  {af.url&&!af.url.includes("YOUR_")&&<audio controls style={{height:32}} src={af.url}/>}
                  <button className="btn btn-sm btn-ghost" onClick={()=>{setEditing(af);setNewUrl(af.url);}}>✏️ Replace</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {editing&&(
        <div className="modal-overlay" onClick={()=>setEditing(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Replace: {editing.label}</div>
            <div className="modal-sub">Paste the new Cloudinary URL. Goes live immediately.</div>
            <div className="field"><label>New Audio URL</label><input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="https://res.cloudinary.com/..."/></div>
            {newUrl&&<audio controls src={newUrl} style={{width:"100%",marginTop:10}}/>}
            <div className="modal-actions">
              <button className="btn btn-sm btn-ghost" onClick={()=>setEditing(null)}>Cancel</button>
              <button className="btn btn-sm" disabled={saving||!newUrl.trim()} onClick={saveUrl}>{saving?"Saving...":"Save & Go Live"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================================
// CALL LOGS + REPORTS
// ================================================
function CallLogs({ showToast }) {
  const [logs,setLogs]=useState([]);
  const [loading,setLoading]=useState(false);
  const [filterDisposition,setFilterDisposition]=useState("ALL");
  const [filterCampaign,setFilterCampaign]=useState("ALL");
  const [startDate,setStartDate]=useState("");
  const [endDate,setEndDate]=useState("");
  const [rowLimit,setRowLimit]=useState("ALL");
  const [campaigns,setCampaigns]=useState([]);

  useEffect(()=>{loadLogs();},[]);

  async function loadLogs(){
    setLoading(true);
    try{
      const data=await dbSelect("call_logs","?select=*&order=logged_at.desc&limit=2000");
      setLogs(data);
      setCampaigns([...new Set(data.map(l=>l.campaign).filter(Boolean))]);
    }catch(e){showToast("Failed to load logs","error");}
    finally{setLoading(false);}
  }

  const filtered=logs.filter(l=>{
    const dMatch=filterDisposition==="ALL"||l.sub_disposition===filterDisposition;
    const cMatch=filterCampaign==="ALL"||l.campaign===filterCampaign;
    const date=new Date(l.logged_at);
    const sMatch=!startDate||date>=new Date(startDate);
    const eMatch=!endDate||date<=new Date(endDate+"T23:59:59");
    return dMatch&&cMatch&&sMatch&&eMatch;
  });

  const displayRows=rowLimit==="ALL"?filtered:filtered.slice(0,parseInt(rowLimit));

  const summary=filtered.reduce((acc,l)=>{if(!acc[l.sub_disposition])acc[l.sub_disposition]=0;acc[l.sub_disposition]++;return acc;},{});

  function doExport(limit){
    const rows=(limit==="ALL"?filtered:filtered.slice(0,parseInt(limit))).map(l=>[
      l.phone,l.campaign,l.main_disposition,l.sub_disposition,new Date(l.logged_at).toLocaleString("en-IN")
    ]);
    const fname=`vcatch_report_${filterCampaign}_${startDate||"all"}_to_${endDate||"all"}_${Date.now()}.csv`;
    downloadCSV(fname,["Phone","Campaign","Main Disposition","Sub Disposition","Date & Time"],rows);
    showToast(`Exported ${rows.length} rows`,"success");
  }

  const dispositions=["INTERESTED","NOT_INTERESTED","NO_RESPONSE","INVALID_INPUT","BUSY","FAILED","CALL_DISCONNECTED"];

  return(
    <div>
      <div className="page-header">
        <div><div className="page-title">Call Logs & Reports</div><div className="page-sub">{filtered.length} records match filters</div></div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <select className="filter-select" value={rowLimit} onChange={e=>setRowLimit(e.target.value)}>
            <option value="50">Download 50</option>
            <option value="100">Download 100</option>
            <option value="500">Download 500</option>
            <option value="ALL">Download All</option>
          </select>
          <button className="btn btn-sm btn-ghost" onClick={()=>doExport(rowLimit)}>↓ Export</button>
        </div>
      </div>
      <div className="page-content">
        {filterCampaign!=="ALL"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
            {[["INTERESTED",T.green],["NOT_INTERESTED",T.red],["BUSY",T.amber],["FAILED",T.muted]].map(([key,color])=>(
              <div key={key} className="stat-card">
                <div className="stat-label">{key.replace(/_/g," ")}</div>
                <div className="stat-value" style={{color,fontSize:22}}>{summary[key]||0}</div>
                <div className="stat-sub">{filtered.length?`${Math.round(((summary[key]||0)/filtered.length)*100)}%`:"0%"}</div>
              </div>
            ))}
          </div>
        )}

        <div className="filter-row">
          <select className="filter-select" value={filterCampaign} onChange={e=>setFilterCampaign(e.target.value)}>
            <option value="ALL">All Campaigns</option>
            {campaigns.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={filterDisposition} onChange={e=>setFilterDisposition(e.target.value)}>
            <option value="ALL">All Dispositions</option>
            {dispositions.map(d=><option key={d} value={d}>{d.replace(/_/g," ")}</option>)}
          </select>
          <input type="date" className="filter-input" value={startDate} onChange={e=>setStartDate(e.target.value)} title="Start date"/>
          <input type="date" className="filter-input" value={endDate} onChange={e=>setEndDate(e.target.value)} title="End date"/>
          {(startDate||endDate)&&<button className="btn btn-sm btn-ghost" onClick={()=>{setStartDate("");setEndDate("");}}>✕ Clear dates</button>}
          <button className="btn btn-sm btn-ghost" onClick={loadLogs}>↻</button>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Showing {displayRows.length} of {filtered.length} records</div>
          </div>
          <div className="table-wrap">
            {loading?<div className="empty-state">Loading...</div>:displayRows.length===0?(
              <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-text">No logs match filters</div></div>
            ):(
              <table>
                <thead><tr><th>Phone</th><th>Campaign</th><th>Status</th><th>Disposition</th><th>Time</th></tr></thead>
                <tbody>{displayRows.map(log=>(
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
// MAIN APP
// ================================================
export default function App() {
  const [session,setSession]=useState(()=>{try{return JSON.parse(localStorage.getItem("sb_session"));}catch{return null;}});
  const [page,setPage]=useState("dashboard");
  const [toast,setToast]=useState(null);

  function showToast(msg,type="info"){setToast({msg,type});}
  async function handleLogout(){await signOut();setSession(null);}

  if(!session)return<><style>{css}</style><LoginPage onLogin={setSession}/></>;

  const nav=[
    {id:"dashboard",label:"Dashboard",icon:"📊"},
    {id:"campaigns",label:"Campaigns",icon:"🎯"},
    {id:"leads",label:"Leads",icon:"👥"},
    {id:"interested",label:"Candidates",icon:"⭐"},
    {id:"dnd",label:"DND List",icon:"🚫"},
    {id:"callerids",label:"Caller IDs",icon:"📱"},
    {id:"audio",label:"Audio Manager",icon:"🔊"},
    {id:"logs",label:"Call Logs",icon:"📋"},
  ];

  return(
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-brand">VCatch<span>HR Portal</span></div>
          <nav className="nav">
            {nav.map(n=>(
              <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </nav>
         </div>
        <div className="main">
          {page==="dashboard"&&<Dashboard showToast={showToast}/>}
          {page==="campaigns"&&<Campaigns showToast={showToast}/>}
          {page==="leads"&&<Leads showToast={showToast}/>}
          {page==="interested"&&<InterestedCandidates showToast={showToast}/>}
          {page==="dnd"&&<DndList showToast={showToast}/>}
          {page==="callerids"&&<CallerIds showToast={showToast}/>}
          {page==="audio"&&<AudioManager showToast={showToast}/>}
          {page==="logs"&&<CallLogs showToast={showToast}/>}
        </div>
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}