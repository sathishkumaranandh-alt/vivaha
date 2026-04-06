// src/App.jsx
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import "./styles/global.css";
import { authAPI } from "./api";
import Home          from "./pages/Home";
import Profiles      from "./pages/Profiles";
import ProfileDetail from "./pages/ProfileDetail";
import Plans         from "./pages/Plans";
import SuccessPage   from "./pages/Success";
import Dashboard     from "./pages/Dashboard";
import Interests     from "./pages/Interests";
import ChatPage      from "./pages/Chat";
import Notifications from "./pages/Notifications";
import AdminPanel    from "./pages/Admin";
import Navbar        from "./components/Navbar";
import Footer        from "./components/Footer";
import LoginModal    from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";

export const AuthCtx  = createContext(null);
export const useAuth  = () => useContext(AuthCtx);
export const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

export default function App() {
  const [page, setPage]         = useState("home");
  const [pageData, setPageData] = useState(null);
  const [user, setUser]         = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [modal, setModal]       = useState(null);
  const [toast, setToast]       = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("vm_token");
    const saved = localStorage.getItem("vm_user");
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch (e) {}
      authAPI.me().then(res => {
        if (res.success) { setUser(res.user); localStorage.setItem("vm_user", JSON.stringify(res.user)); }
        else { localStorage.removeItem("vm_token"); localStorage.removeItem("vm_user"); setUser(null); }
      });
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const showToast = useCallback((msg, type = "default") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const navigate = useCallback((p, data = null) => { setPageData(data); setPage(p); }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success) { localStorage.setItem("vm_token", res.token); localStorage.setItem("vm_user", JSON.stringify(res.user)); setUser(res.user); }
    return res;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    if (res.success) { localStorage.setItem("vm_token", res.token); localStorage.setItem("vm_user", JSON.stringify(res.user)); setUser(res.user); }
    return res;
  };

  const logout = () => {
    localStorage.removeItem("vm_token"); localStorage.removeItem("vm_user");
    setUser(null); navigate("home"); showToast("Logged out successfully");
  };

  const updateUser = (u) => { setUser(u); localStorage.setItem("vm_user", JSON.stringify(u)); };

  useEffect(() => {
    const authPages = ["dashboard","interests","chat","notifications","admin"];
    if (authPages.includes(page) && !user && !authLoading) { setModal("login"); navigate("home"); }
    if (page === "admin" && user && user.role !== "admin") navigate("home");
  }, [page, user, authLoading]);

  if (authLoading) return (
    <div style={{ height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--cr)" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:52,marginBottom:16 }}>💍</div>
        <div className="fh" style={{ fontSize:24,color:"var(--m)" }}>VivahMatch</div>
        <div style={{ color:"var(--mu)",fontSize:14,marginTop:10 }}>Loading...</div>
      </div>
    </div>
  );

  const sharedProps = { navigate, showToast, setModal };

  const renderPage = () => {
    switch (page) {
      case "home":          return <Home {...sharedProps} />;
      case "profiles":      return <Profiles {...sharedProps} />;
      case "detail":        return <ProfileDetail {...sharedProps} profileUserId={pageData} />;
      case "plans":         return <Plans {...sharedProps} />;
      case "success":       return <SuccessPage {...sharedProps} />;
      case "dashboard":     return user ? <Dashboard {...sharedProps} /> : null;
      case "interests":     return user ? <Interests {...sharedProps} /> : null;
      case "chat":          return user ? <ChatPage {...sharedProps} chatWith={pageData} /> : null;
      case "notifications": return user ? <Notifications {...sharedProps} setUnreadCount={setUnreadCount} /> : null;
      case "admin":         return user?.role==="admin" ? <AdminPanel {...sharedProps} /> : null;
      default:              return <Home {...sharedProps} />;
    }
  };

  const tc = toast?.type==="error"?"#C62828":toast?.type==="success"?"#2E7D32":"#1E0D0D";

  return (
    <AuthCtx.Provider value={{ user, login, register, logout, updateUser, authLoading }}>
      <ToastCtx.Provider value={showToast}>
        <Navbar page={page} navigate={navigate} setModal={setModal} unreadCount={unreadCount} />
        <main>{renderPage()}</main>
        {!["chat","dashboard"].includes(page) && <Footer navigate={navigate} setModal={setModal} />}
        {modal==="login"    && <LoginModal    onClose={()=>setModal(null)} onSwitch={()=>setModal("register")} showToast={showToast} navigate={navigate} />}
        {modal==="register" && <RegisterModal onClose={()=>setModal(null)} onSwitch={()=>setModal("login")}    showToast={showToast} />}
        {toast && <div className="toast" style={{ background:tc }}>{toast.msg}</div>}
      </ToastCtx.Provider>
    </AuthCtx.Provider>
  );
}
