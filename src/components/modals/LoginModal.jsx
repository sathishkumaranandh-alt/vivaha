// src/components/modals/LoginModal.jsx
import { useState } from "react";
import { useAuth } from "../../App";

export default function LoginModal({ onClose, onSwitch, showToast, navigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      showToast("🎉 Welcome back to VivahMatch!", "success");
      onClose();
      navigate("profiles");
    } else {
      setError(res.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ fontSize:38,marginBottom:8 }}>💍</div>
          <h2 className="fh" style={{ fontSize:26,color:"var(--m)" }}>Welcome Back</h2>
          <p style={{ fontSize:14,color:"var(--mu)",marginTop:5 }}>Sign in to your VivahMatch account</p>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error" style={{ marginBottom:16 }}>{error}</div>}
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <div className="inp-group">
              <label className="inp-label">Email Address</label>
              <input className="inp" placeholder="you@example.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
            </div>
            <div className="inp-group">
              <label className="inp-label">Password</label>
              <input className="inp" placeholder="Your password" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
            </div>
            <div style={{ textAlign:"right" }}>
              <span style={{ fontSize:13,color:"var(--g)",cursor:"pointer",fontWeight:600 }}>Forgot Password?</span>
            </div>
            <button className="btn btn-maroon btn-full" style={{ padding:"14px",fontSize:16 }} onClick={handleLogin} disabled={loading}>
              {loading ? <span className="spinner spinner-sm" style={{ borderTopColor:"#fff",borderColor:"rgba(255,255,255,0.3)" }} /> : "Sign In →"}
            </button>
            <div style={{ position:"relative",textAlign:"center",margin:"4px 0" }}>
              <div className="divider" />
              <span style={{ position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"#FFFCF7",padding:"0 12px",fontSize:12,color:"var(--mu)" }}>OR</span>
            </div>
            <p style={{ textAlign:"center",fontSize:14,color:"var(--mu)" }}>
              No account? <span style={{ color:"var(--m)",fontWeight:700,cursor:"pointer" }} onClick={onSwitch}>Register Free</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
