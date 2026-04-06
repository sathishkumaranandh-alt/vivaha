// src/components/modals/RegisterModal.jsx
import { useState } from "react";
import { useAuth } from "../../App";

export default function RegisterModal({ onClose, onSwitch, showToast }) {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name:"", email:"", phone:"", password:"",
    gender:"Bride", religion:"Hindu", caste:"", city:"", education:"", profession:""
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleFinish = async () => {
    setError("");
    if (!form.name||!form.email||!form.password) { setError("Fill all required fields."); return; }
    setLoading(true);
    const res = await register({ name:form.name, email:form.email, phone:form.phone, password:form.password, gender:form.gender });
    setLoading(false);
    if (res.success) {
      showToast("🎉 Welcome to VivahMatch! Complete your profile.", "success");
      onClose();
    } else {
      setError(res.message || "Registration failed.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ fontSize:34,marginBottom:6 }}>💍</div>
          <h2 className="fh" style={{ fontSize:24,color:"var(--m)" }}>Create Your Profile</h2>
          <p style={{ fontSize:13,color:"var(--mu)",marginTop:4 }}>Step {step} of 3 — {["Personal Info","Background","Confirm"][step-1]}</p>
        </div>
        <div className="modal-body">
          <div style={{ display:"flex",gap:5,marginBottom:22 }}>
            {[1,2,3].map(s=><div key={s} style={{ flex:1,height:4,borderRadius:2,background:step>=s?"var(--m)":"#E5D8C8",transition:"background .3s" }}/>)}
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom:14 }}>{error}</div>}

          {step===1 && (
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              <div>
                <label className="inp-label">Profile For *</label>
                <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  {["Bride","Groom","Son","Daughter"].map(g=>(
                    <button key={g} onClick={()=>set("gender",g)} style={{ padding:"9px 14px",borderRadius:10,border:`1.5px solid ${form.gender===g?"var(--m)":"#E5D8C8"}`,background:form.gender===g?"rgba(123,29,58,0.08)":"transparent",color:form.gender===g?"var(--m)":"var(--mu)",fontWeight:600,cursor:"pointer",fontSize:13 }}>{g}</button>
                  ))}
                </div>
              </div>
              <div className="inp-group"><label className="inp-label">Full Name *</label><input className="inp" placeholder="Enter full name" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
              <div className="inp-group"><label className="inp-label">Email Address *</label><input className="inp" placeholder="you@example.com" type="email" value={form.email} onChange={e=>set("email",e.target.value)}/></div>
              <div className="inp-group"><label className="inp-label">Mobile Number</label><input className="inp" placeholder="+91 XXXXX XXXXX" type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)}/></div>
              <div className="inp-group"><label className="inp-label">Password * (min 6 chars)</label><input className="inp" placeholder="Create password" type="password" value={form.password} onChange={e=>set("password",e.target.value)}/></div>
              <button className="btn btn-maroon btn-full" style={{ padding:"13px",fontSize:15,marginTop:4 }} onClick={()=>{
                if(!form.name||!form.email||!form.password){setError("Fill name, email and password.");return;}
                if(form.password.length<6){setError("Password must be at least 6 characters.");return;}
                setError(""); setStep(2);
              }}>Continue →</button>
            </div>
          )}

          {step===2 && (
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              <div className="form-grid-2">
                <div className="inp-group">
                  <label className="inp-label">Religion</label>
                  <select className="sel" value={form.religion} onChange={e=>set("religion",e.target.value)}>
                    {["Hindu","Muslim","Christian","Sikh","Jain","Buddhist"].map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="inp-group"><label className="inp-label">Caste</label><input className="inp" placeholder="Enter caste" value={form.caste} onChange={e=>set("caste",e.target.value)}/></div>
              </div>
              <div className="inp-group"><label className="inp-label">City</label><input className="inp" placeholder="Your city" value={form.city} onChange={e=>set("city",e.target.value)}/></div>
              <div className="inp-group">
                <label className="inp-label">Highest Education</label>
                <select className="sel" value={form.education} onChange={e=>set("education",e.target.value)}>
                  <option value="">Select Education</option>
                  {["B.Tech/B.E","MBBS/BDS","MBA","CA/CS","B.Sc","M.Tech","MCA","PhD","Diploma","Other"].map(e=><option key={e}>{e}</option>)}
                </select>
              </div>
              <div className="inp-group"><label className="inp-label">Profession</label><input className="inp" placeholder="Your profession" value={form.profession} onChange={e=>set("profession",e.target.value)}/></div>
              <div style={{ display:"flex",gap:9 }}>
                <button className="btn btn-outline-b btn-md" style={{ flex:1 }} onClick={()=>setStep(1)}>← Back</button>
                <button className="btn btn-maroon btn-md" style={{ flex:2 }} onClick={()=>{setError("");setStep(3);}}>Continue →</button>
              </div>
            </div>
          )}

          {step===3 && (
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              <div style={{ background:"linear-gradient(135deg,rgba(123,29,58,0.05),rgba(201,145,61,0.07))",border:"1px solid var(--br)",borderRadius:14,padding:"16px" }}>
                <div className="inp-label" style={{ marginBottom:12 }}>Profile Summary</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  {[["Name",form.name||"—"],["Gender",form.gender],["Email",form.email||"—"],["Religion",form.religion],["City",form.city||"—"],["Education",form.education||"—"]].map(([k,v])=>(
                    <div key={k} style={{ padding:"5px 0" }}>
                      <div style={{ fontSize:11,color:"var(--g)",fontWeight:700 }}>{k}</div>
                      <div style={{ fontSize:14,color:"var(--tx)",fontWeight:500,wordBreak:"break-all" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="alert alert-success">✓ Free membership: 10 profile views/day · 5 interests/day</div>
              <p style={{ fontSize:12,color:"var(--mu)",textAlign:"center",lineHeight:1.6 }}>
                By registering you agree to our <span style={{ color:"var(--m)",cursor:"pointer" }}>Terms of Use</span> and <span style={{ color:"var(--m)",cursor:"pointer" }}>Privacy Policy</span>
              </p>
              <button className="btn btn-gold btn-full" style={{ padding:"14px",fontSize:16 }} onClick={handleFinish} disabled={loading}>
                {loading ? "Creating..." : "🎉 Create My Profile"}
              </button>
              <button className="btn btn-outline-b btn-md" style={{ width:"100%" }} onClick={()=>setStep(2)}>← Back</button>
            </div>
          )}

          <p style={{ textAlign:"center",fontSize:13,color:"var(--mu)",marginTop:16 }}>
            Already registered? <span style={{ color:"var(--m)",fontWeight:700,cursor:"pointer" }} onClick={onSwitch}>Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}
