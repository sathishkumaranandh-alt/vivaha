// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../App";

export default function Navbar({ page, navigate, setModal, unreadCount }) {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isHero = ["home"].includes(page);
  const sc = scrolled || !isHero;
  const nc = sc ? "var(--tx)" : "rgba(253,248,242,0.85)";
  const na = sc ? "var(--m)"  : "var(--gl)";

  const navLinks = [
    { id:"home",    label:"Home" },
    { id:"profiles",label:"Find Match" },
    { id:"plans",   label:"Plans" },
    { id:"success", label:"Success Stories" },
  ];

  const userLinks = user ? [
    { id:"dashboard",    label:"My Profile", icon:"👤" },
    { id:"interests",    label:"Interests",  icon:"💌" },
    { id:"chat",         label:"Messages",   icon:"💬" },
    { id:"notifications",label:"Alerts",     icon:"🔔" },
    ...(user.role==="admin"?[{ id:"admin", label:"Admin", icon:"🛡️" }]:[]),
  ] : [];

  return (
    <>
      <nav className={`vm-nav${sc?" sc":""}`}>
        {/* LOGO */}
        <div onClick={() => navigate("home")} style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer" }}>
          <span style={{ fontSize:24 }}>💍</span>
          <span className="fh" style={{ fontSize:21,fontWeight:700,color:sc?"var(--m)":"#FDF8F2",letterSpacing:-.3 }}>VivahMatch</span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hide-mob" style={{ display:"flex",gap:26,alignItems:"center" }}>
          {navLinks.map(l => (
            <span key={l.id} className={`nav-link${page===l.id?" active":""}`} onClick={() => navigate(l.id)} style={{ color:page===l.id?na:nc }}>{l.label}</span>
          ))}
        </div>

        {/* DESKTOP RIGHT */}
        <div className="hide-mob" style={{ display:"flex",gap:8,alignItems:"center" }}>
          {user ? (
            <>
              {userLinks.map(l => (
                <button key={l.id} onClick={() => navigate(l.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,color:sc?"var(--m)":"rgba(253,248,242,0.85)",padding:"6px 10px",borderRadius:8,transition:"all .2s",position:"relative" }}>
                  {l.icon} {l.label}
                  {l.id==="notifications" && unreadCount>0 && (
                    <span style={{ position:"absolute",top:0,right:0,background:"var(--m)",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700 }}>{unreadCount>9?"9+":unreadCount}</span>
                  )}
                </button>
              ))}
              <button className="btn btn-maroon btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn btn-sm btn-outline-m" style={{ border:`1.5px solid ${sc?"var(--m)":"rgba(253,248,242,0.6)"}`,color:sc?"var(--m)":"#FDF8F2" }} onClick={() => setModal("login")}>Login</button>
              <button className="btn btn-gold btn-sm" onClick={() => setModal("register")}>Register Free</button>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button className="hide-desk" style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:sc?"var(--m)":"#FDF8F2",display:"none" }} onClick={() => setMenuOpen(v=>!v)}>☰</button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{ position:"fixed",inset:0,zIndex:190,background:"rgba(30,5,5,0.6)",backdropFilter:"blur(8px)" }} onClick={() => setMenuOpen(false)}>
          <div style={{ position:"absolute",top:66,right:0,bottom:0,width:"75%",maxWidth:320,background:"#FFFCF7",padding:"24px 20px",overflowY:"auto",animation:"slideIn .25s ease" }} onClick={e=>e.stopPropagation()}>
            {[...navLinks,...userLinks].map(l => (
              <div key={l.id} onClick={() => { navigate(l.id); setMenuOpen(false); }} style={{ padding:"14px 0",borderBottom:"1px solid var(--br)",fontSize:16,fontWeight:600,color:page===l.id?"var(--m)":"var(--tx)",cursor:"pointer" }}>
                {l.icon && <span style={{ marginRight:8 }}>{l.icon}</span>}{l.label}
              </div>
            ))}
            <div style={{ marginTop:24,display:"flex",flexDirection:"column",gap:10 }}>
              {user ? (
                <button className="btn btn-maroon btn-md btn-full" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
              ) : (
                <>
                  <button className="btn btn-maroon btn-md btn-full" onClick={() => { setModal("login"); setMenuOpen(false); }}>Login</button>
                  <button className="btn btn-gold btn-md btn-full" onClick={() => { setModal("register"); setMenuOpen(false); }}>Register Free</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px){
          .hide-mob{display:none!important}
          .hide-desk{display:block!important}
        }
        @keyframes slideIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
      `}</style>
    </>
  );
}
