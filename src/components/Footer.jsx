// src/components/Footer.jsx
export default function Footer({ navigate, setModal }) {
  const cols = [
    { title:"Find Match", links:[["Find Bride",()=>navigate("profiles")],["Find Groom",()=>navigate("profiles")],["NRI Matrimony",()=>setModal("register")],["Premium Plans",()=>navigate("plans")]] },
    { title:"Community",  links:[["Hindu Matrimony",()=>navigate("profiles")],["Muslim Matrimony",()=>navigate("profiles")],["Christian Matrimony",()=>navigate("profiles")],["By Profession",()=>navigate("profiles")]] },
    { title:"Company",    links:[["About Us",()=>{}],["Success Stories",()=>navigate("success")],["Blog",()=>{}],["Careers",()=>{}]] },
    { title:"Support",    links:[["Help Center",()=>{}],["Privacy Policy",()=>{}],["Terms of Use",()=>{}],["Contact Us",()=>{}]] },
  ];
  return (
    <footer style={{ background:"#0D0408",color:"rgba(253,248,242,0.62)" }}>
      <div className="container" style={{ padding:"52px 20px 0" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:26,marginBottom:44 }}>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14,cursor:"pointer" }} onClick={() => navigate("home")}>
              <span style={{ fontSize:20 }}>💍</span>
              <span className="fh" style={{ fontSize:19,color:"#F0C878",fontWeight:700 }}>VivahMatch</span>
            </div>
            <p style={{ fontSize:14,lineHeight:1.75,marginBottom:18,maxWidth:210 }}>India's most trusted matrimony platform. Connecting hearts since 2006.</p>
            <div style={{ display:"flex",gap:9 }}>
              {["📘","📸","🐦","▶️"].map((ic,i) => (
                <div key={i} style={{ width:34,height:34,borderRadius:"50%",background:"rgba(201,145,61,0.14)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15 }}>{ic}</div>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontWeight:700,color:"var(--g)",marginBottom:14,fontSize:11,letterSpacing:1.2 }}>{col.title.toUpperCase()}</div>
              {col.links.map(([lbl,fn]) => (
                <div key={lbl} style={{ fontSize:14,marginBottom:9,cursor:"pointer",transition:"color .2s" }} onClick={fn}
                  onMouseEnter={e=>e.currentTarget.style.color="#F0C878"}
                  onMouseLeave={e=>e.currentTarget.style.color=""}>{lbl}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(201,145,61,0.14)",padding:"22px 0",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
          <div style={{ display:"flex",gap:9 }}>
            {["🍎 App Store","🤖 Play Store"].map(s => (
              <div key={s} style={{ padding:"7px 14px",border:"1px solid rgba(201,145,61,0.3)",borderRadius:9,fontSize:12,cursor:"pointer" }}>{s}</div>
            ))}
          </div>
          <div style={{ fontSize:12,textAlign:"right" }}>
            <div>© 2025 VivahMatch. All rights reserved.</div>
            <div style={{ color:"var(--g)",marginTop:3 }}>Made with ❤️ in Tamil Nadu, India</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
