import { useState, useEffect } from "react";

// ─── API CONFIG ───────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = {
  get: (path) =>
    fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("vm_token")}` },
    }).then((r) => r.json()),

  post: (path, body) =>
    fetch(`${API}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("vm_token")}`,
      },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  put: (path, body) =>
    fetch(`${API}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("vm_token")}`,
      },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
};

// ─── DATA (fallback when API not connected) ──────────────────
const DEMO_BRIDES = [
  { id: 1, name: "Priya Sharma", age: 26, city: "Chennai", education: "MBA", profession: "Software Engineer", religion: "Hindu", caste: "Brahmin", height: "5'4\"", income: "8 LPA", photo: "https://i.pravatar.cc/400?img=47", verified: true, premium: true, horoscope: "Taurus", star: "Rohini", gothra: "Kashyapa", languages: ["Tamil", "English", "Hindi"], bio: "Passionate software engineer who loves classical dance, travel, and cooking traditional recipes. Family values are my foundation.", lookingFor: "Kind, educated, and family-oriented partner who respects culture and tradition." },
  { id: 2, name: "Ananya Krishnan", age: 24, city: "Coimbatore", education: "MBBS", profession: "Doctor", religion: "Hindu", caste: "Nadar", height: "5'2\"", income: "12 LPA", photo: "https://i.pravatar.cc/400?img=45", verified: true, premium: false, horoscope: "Virgo", star: "Uthiram", gothra: "Atreya", languages: ["Tamil", "Malayalam", "English"], bio: "MBBS doctor with a love for music, books, and nature walks. Family is everything to me.", lookingFor: "Educated, respectful, and caring life partner from a good family." },
  { id: 3, name: "Meera Rajan", age: 28, city: "Madurai", education: "M.Tech", profession: "Architect", religion: "Hindu", caste: "Vellalar", height: "5'5\"", income: "10 LPA", photo: "https://i.pravatar.cc/400?img=41", verified: false, premium: true, horoscope: "Leo", star: "Karthigai", gothra: "Vasishtha", languages: ["Tamil", "English"], bio: "Creative architect who finds beauty in design and simplicity. I enjoy painting, yoga, and long drives.", lookingFor: "Someone with ambition, warmth, and a good sense of humor." },
  { id: 4, name: "Divya Nair", age: 25, city: "Bangalore", education: "BCA", profession: "UX Designer", religion: "Hindu", caste: "Nair", height: "5'3\"", income: "9 LPA", photo: "https://i.pravatar.cc/400?img=44", verified: true, premium: false, horoscope: "Gemini", star: "Mrigasira", gothra: "Bhardwaj", languages: ["Tamil", "Kannada", "English"], bio: "UX designer who believes in creating meaningful experiences — in work and in life.", lookingFor: "Creative, open-minded partner with strong values and family bond." },
  { id: 5, name: "Kavitha Murugan", age: 27, city: "Trichy", education: "MCA", profession: "Data Analyst", religion: "Hindu", caste: "Mudaliar", height: "5'4\"", income: "7 LPA", photo: "https://i.pravatar.cc/400?img=48", verified: true, premium: true, horoscope: "Scorpio", star: "Anusham", gothra: "Kaundinya", languages: ["Tamil", "English"], bio: "Numbers and stories both fascinate me. I love Carnatic music and weekend temple visits with family.", lookingFor: "A grounded, respectful partner from a good and caring family." },
  { id: 6, name: "Lakshmi Venkat", age: 23, city: "Salem", education: "B.Sc", profession: "Teacher", religion: "Hindu", caste: "Gounder", height: "5'1\"", income: "5 LPA", photo: "https://i.pravatar.cc/400?img=43", verified: false, premium: false, horoscope: "Aries", star: "Aswini", gothra: "Agasthya", languages: ["Tamil", "Telugu", "English"], bio: "Educator at heart. Teaching young minds is my purpose. I love gardening and reading Tamil literature.", lookingFor: "Humble, caring, and family-first partner who values simplicity." },
  { id: 7, name: "Saranya Pillai", age: 29, city: "Chennai", education: "MBA", profession: "HR Manager", religion: "Hindu", caste: "Pillai", height: "5'5\"", income: "11 LPA", photo: "https://i.pravatar.cc/400?img=40", verified: true, premium: true, horoscope: "Sagittarius", star: "Pooradam", gothra: "Vishwamitra", languages: ["Tamil", "English", "Hindi"], bio: "HR professional who understands people deeply. I enjoy cooking, Bharatanatyam, and family gatherings.", lookingFor: "Stable, emotionally mature, and loving life partner." },
  { id: 8, name: "Nithya Subramanian", age: 26, city: "Madurai", education: "B.E", profession: "Civil Engineer", religion: "Hindu", caste: "Brahmin", height: "5'3\"", income: "8 LPA", photo: "https://i.pravatar.cc/400?img=46", verified: true, premium: false, horoscope: "Libra", star: "Swathi", gothra: "Parasara", languages: ["Tamil", "English"], bio: "Civil engineer with a passion for sustainable architecture. I love trekking, cooking, and family road trips.", lookingFor: "Ambitious, kind, and family-loving partner who shares similar values." },
];

const DEMO_GROOMS = [
  { id: 101, name: "Arun Selvam", age: 29, city: "Chennai", education: "MBA", profession: "Business Analyst", religion: "Hindu", caste: "Brahmin", height: "5'10\"", income: "14 LPA", photo: "https://i.pravatar.cc/400?img=12", verified: true, premium: true, horoscope: "Pisces", star: "Revathi", gothra: "Kashyapa", languages: ["Tamil", "English"], bio: "Driven professional who values family traditions. Love cricket, travel, and trying new cuisines.", lookingFor: "Educated, cheerful, and understanding partner who loves family." },
  { id: 102, name: "Karthik Rajan", age: 27, city: "Coimbatore", education: "B.Tech", profession: "Software Developer", religion: "Hindu", caste: "Nadar", height: "5'9\"", income: "11 LPA", photo: "https://i.pravatar.cc/400?img=15", verified: true, premium: false, horoscope: "Aquarius", star: "Sathayam", gothra: "Atreya", languages: ["Tamil", "English", "Hindi"], bio: "Full-stack developer by day, guitarist by night. Simple, honest, and looking for my forever partner.", lookingFor: "Smart, kind, and fun-loving life partner from a traditional family." },
  { id: 103, name: "Vijay Kumar", age: 31, city: "Madurai", education: "ME", profession: "Civil Engineer", religion: "Hindu", caste: "Vellalar", height: "5'11\"", income: "9 LPA", photo: "https://i.pravatar.cc/400?img=18", verified: false, premium: true, horoscope: "Capricorn", star: "Uthiradam", gothra: "Vasishtha", languages: ["Tamil", "English"], bio: "Infrastructure engineer passionate about building bridges in steel and in relationships.", lookingFor: "Warm, respectful, and family-oriented partner with good values." },
  { id: 104, name: "Surya Narayanan", age: 26, city: "Bangalore", education: "B.Com", profession: "Chartered Accountant", religion: "Hindu", caste: "Iyer", height: "5'8\"", income: "13 LPA", photo: "https://i.pravatar.cc/400?img=20", verified: true, premium: true, horoscope: "Taurus", star: "Rohini", gothra: "Bhardwaj", languages: ["Tamil", "Kannada", "English"], bio: "Chartered accountant with a love for chess, philosophy, and weekend bike rides across the ghats.", lookingFor: "Intellectually curious, warm, and caring partner from a good family." },
  { id: 105, name: "Dinesh Balaji", age: 28, city: "Trichy", education: "B.Pharm", profession: "Pharmacist", religion: "Hindu", caste: "Mudaliar", height: "5'9\"", income: "7 LPA", photo: "https://i.pravatar.cc/400?img=22", verified: true, premium: false, horoscope: "Cancer", star: "Punarpusam", gothra: "Kaundinya", languages: ["Tamil", "English", "Telugu"], bio: "Healthcare professional who values simplicity. I love cooking, badminton, and classic Tamil songs.", lookingFor: "Simple, homely, and cheerful life partner who values family above all." },
  { id: 106, name: "Praveen Gopal", age: 25, city: "Salem", education: "B.E", profession: "Mechanical Engineer", religion: "Hindu", caste: "Gounder", height: "5'10\"", income: "6 LPA", photo: "https://i.pravatar.cc/400?img=25", verified: false, premium: false, horoscope: "Libra", star: "Chithirai", gothra: "Agasthya", languages: ["Tamil", "English"], bio: "Early career engineer with big dreams. Passionate about motorsports, trekking, and family values.", lookingFor: "Energetic, positive, and supportive partner ready to build a life together." },
  { id: 107, name: "Rahul Menon", age: 30, city: "Chennai", education: "M.Tech", profession: "Product Manager", religion: "Hindu", caste: "Nair", height: "5'11\"", income: "28 LPA", photo: "https://i.pravatar.cc/400?img=28", verified: true, premium: true, horoscope: "Scorpio", star: "Anusham", gothra: "Vishwamitra", languages: ["Tamil", "Malayalam", "English"], bio: "Tech product manager building digital products that matter. Avid reader, foodie, and fitness enthusiast.", lookingFor: "Independent, caring, and intellectually stimulating life partner." },
  { id: 108, name: "Sanjay Venkatesh", age: 27, city: "Hyderabad", education: "MBA", profession: "Marketing Manager", religion: "Hindu", caste: "Brahmin", height: "5'9\"", income: "12 LPA", photo: "https://i.pravatar.cc/400?img=30", verified: true, premium: false, horoscope: "Virgo", star: "Hastham", gothra: "Parasara", languages: ["Tamil", "Telugu", "English", "Hindi"], bio: "Creative marketing manager who loves storytelling. Travel, photography, and cooking are my passions.", lookingFor: "Warm, expressive, and family-oriented partner who loves adventures." },
];

const SUCCESS_STORIES = [
  { bride: "Anitha", groom: "Suresh", city: "Chennai", year: "2024", imgBride: "https://i.pravatar.cc/120?img=47", imgGroom: "https://i.pravatar.cc/120?img=12", quote: "We found each other on VivahMatch and within 6 months we were married. The horoscope matching gave our families confidence. Best decision of our lives!", months: 4 },
  { bride: "Preethi", groom: "Ramesh", city: "Coimbatore", year: "2023", imgBride: "https://i.pravatar.cc/120?img=45", imgGroom: "https://i.pravatar.cc/120?img=20", quote: "The verified badge made us trust each other from day one. Three months of chatting, one proposal, and a lifetime of love. Thank you VivahMatch!", months: 3 },
  { bride: "Kavitha", groom: "Arjun", city: "Madurai", year: "2024", imgBride: "https://i.pravatar.cc/120?img=43", imgGroom: "https://i.pravatar.cc/120?img=22", quote: "As an NRI family, we were worried about finding the right match back home. VivahMatch made it effortless. So grateful!", months: 5 },
  { bride: "Deepa", groom: "Senthil", city: "Trichy", year: "2023", imgBride: "https://i.pravatar.cc/120?img=41", imgGroom: "https://i.pravatar.cc/120?img=25", quote: "Premium plan was worth every rupee. The relationship manager guided our families through the entire process.", months: 6 },
  { bride: "Yamini", groom: "Gowtham", city: "Bangalore", year: "2024", imgBride: "https://i.pravatar.cc/120?img=44", imgGroom: "https://i.pravatar.cc/120?img=28", quote: "Matched on a Monday, chatted for weeks, met in December, and got engaged on Valentine's Day!", months: 2 },
  { bride: "Hema", groom: "Kiran", city: "Salem", year: "2023", imgBride: "https://i.pravatar.cc/120?img=46", imgGroom: "https://i.pravatar.cc/120?img=30", quote: "Our parents were skeptical about online matrimony, but seeing our story they now recommend VivahMatch to everyone!", months: 7 },
];

const PLANS = [
  { name: "Free", price: 0, color: "#8B7355", features: [{ ok: true, text: "Create detailed profile" }, { ok: true, text: "10 profile views per day" }, { ok: true, text: "Basic search filters" }, { ok: true, text: "Send 5 interests per day" }, { ok: true, text: "Upload 2 photos" }, { ok: false, text: "View contact details" }, { ok: false, text: "Horoscope matching report" }, { ok: false, text: "Premium badge" }] },
  { name: "Gold", price: 999, badge: "MOST POPULAR", color: "#C9913D", features: [{ ok: true, text: "Unlimited profile views" }, { ok: true, text: "Advanced search filters" }, { ok: true, text: "Unlimited interests" }, { ok: true, text: "View 50 contact details" }, { ok: true, text: "Upload 10 photos" }, { ok: true, text: "Horoscope matching report" }, { ok: true, text: "Priority listing" }, { ok: false, text: "Dedicated relationship manager" }] },
  { name: "Diamond", price: 1999, badge: "BEST VALUE", color: "#6A9FD4", features: [{ ok: true, text: "Everything in Gold" }, { ok: true, text: "Unlimited contact views" }, { ok: true, text: "Featured profile badge" }, { ok: true, text: "Weekly profile boost" }, { ok: true, text: "Upload 30 photos + video" }, { ok: true, text: "Dedicated relationship manager" }, { ok: true, text: "Video calling feature" }, { ok: true, text: "Background verification" }] },
];

const CITIES = ["All Cities", "Chennai", "Coimbatore", "Madurai", "Bangalore", "Trichy", "Salem", "Hyderabad"];
const RELIGIONS = ["All Religions", "Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain"];
const EDUCATIONS = ["All Education", "B.Tech/B.E", "MBBS/BDS", "MBA", "CA/CS", "B.Sc", "M.Tech", "MCA", "PhD"];

// ─── CSS ──────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --m:#7B1D3A;--md:#4A0F22;--g:#C9913D;--gl:#F0C878;
  --cr:#FDF8F2;--cd:#F5EDE0;--tx:#1E0D0D;--ts:#5C3D2E;
  --mu:#9B7B5C;--br:rgba(201,145,61,0.22);--brd:rgba(201,145,61,0.45);
  --card:#FFFCF7;--ss:0 2px 12px rgba(123,29,58,0.07);
  --sm:0 8px 32px rgba(123,29,58,0.12);--sl:0 20px 60px rgba(123,29,58,0.18);
}
body{overflow-x:hidden;background:var(--cr);font-family:'DM Sans',sans-serif;}
.fh{font-family:'Playfair Display',serif}
.fs{font-family:'Cormorant Garamond',serif}

.vm-nav{position:fixed;top:0;left:0;right:0;z-index:200;height:66px;display:flex;
  align-items:center;justify-content:space-between;padding:0 22px;transition:all .3s}
.vm-nav.sc{background:rgba(253,248,242,.96);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--br);box-shadow:var(--ss)}
.nl{font-size:14px;font-weight:500;cursor:pointer;padding:4px 0;
  border-bottom:2px solid transparent;transition:all .2s}
.nl:hover{border-bottom-color:var(--g)}
.nl.active{font-weight:700;border-bottom-color:var(--m)}

.bm{background:linear-gradient(135deg,#7B1D3A,#9B3A50);color:#FDF8F2;border:none;
  border-radius:50px;font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;transition:all .25s}
.bm:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(123,29,58,.38)}
.bg{background:linear-gradient(135deg,#C9913D,#E8B860,#C9913D);color:#2C1005;border:none;
  border-radius:50px;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;transition:all .25s}
.bg:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,145,61,.45)}
.bo{background:transparent;border-radius:50px;font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;transition:all .25s}
.bgh{background:rgba(253,248,242,.15);border:1.5px solid rgba(253,248,242,.45);border-radius:50px;
  color:#FDF8F2;font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;transition:all .25s}
.bgh:hover{background:rgba(253,248,242,.28)}

.inp{width:100%;padding:12px 16px;border:1.5px solid #E5D8C8;border-radius:12px;
  font-family:'DM Sans',sans-serif;font-size:15px;background:#FFFDF9;color:var(--tx);outline:none;transition:border-color .2s}
.inp:focus{border-color:var(--g)}
.sel{width:100%;padding:12px 16px;border:1.5px solid #E5D8C8;border-radius:12px;
  font-family:'DM Sans',sans-serif;font-size:14px;background:#FFFDF9;color:var(--tx);outline:none;appearance:none;cursor:pointer}
.sel:focus{border-color:var(--g)}

.pc{background:var(--card);border:1px solid var(--br);border-radius:22px;
  overflow:hidden;position:relative;cursor:pointer;
  transition:all .32s cubic-bezier(.34,1.48,.64,1)}
.pc:hover{transform:translateY(-7px);box-shadow:var(--sl);border-color:var(--brd)}
.pco{position:absolute;inset:0;
  background:linear-gradient(to top,rgba(30,5,5,.9) 0%,rgba(30,5,5,.3) 45%,transparent 70%);
  pointer-events:none}

.bdg{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;
  border-radius:50px;font-size:11px;font-weight:700}
.bv{background:#E8F5E9;color:#2E7D32}
.bp{background:linear-gradient(135deg,#C9913D,#E8B860);color:#2C1005}

.tp{padding:9px 22px;border-radius:50px;font-size:13px;font-weight:600;
  cursor:pointer;transition:all .2s;border:1.5px solid var(--br);white-space:nowrap}
.tp.active{background:var(--m);color:#FDF8F2;border-color:var(--m)}
.tp:not(.active){background:transparent;color:var(--mu)}
.tp:not(.active):hover{border-color:var(--g);color:var(--g)}

.mo{position:fixed;inset:0;z-index:500;background:rgba(30,5,5,.55);
  backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:16px}
.mb{background:#FFFCF7;border-radius:26px;width:100%;max-width:460px;max-height:92vh;
  overflow-y:auto;border:1px solid var(--br);box-shadow:0 40px 100px rgba(30,5,5,.35);
  animation:fu .35s cubic-bezier(.34,1.2,.64,1)}

.shim{background:linear-gradient(90deg,#C9913D 0%,#F0C878 40%,#C9913D 80%);
  background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
  animation:sh 3.5s linear infinite}
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);
  background:#1E0D0D;color:#F0C878;padding:13px 28px;border-radius:50px;
  font-weight:600;font-size:14px;z-index:900;box-shadow:0 8px 32px rgba(30,5,5,.45);
  animation:fu .3s ease;white-space:nowrap}

input[type=range]{accent-color:var(--m);width:100%;cursor:pointer}
.orn{text-align:center;color:var(--g);font-size:16px;letter-spacing:8px;margin:4px 0}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:#FDF8F2}
::-webkit-scrollbar-thumb{background:var(--brd);border-radius:10px}

@keyframes fu{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes sh{0%{background-position:-200% center}100%{background-position:200% center}}

.fu{animation:fu .6s ease both}
.fu1{animation:fu .6s .12s ease both}
.fu2{animation:fu .6s .24s ease both}
.fu3{animation:fu .6s .38s ease both}

.hbg{background:linear-gradient(145deg,#2C0A1A 0%,#7B1D3A 42%,#9B4020 72%,#C9913D 100%)}
.hpat{background-image:url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10c1.1-1.1 2.9-1.1 4 0l2 2 2-2c1.1-1.1 2.9-1.1 4 0s1.1 2.9 0 4l-6 6-6-6c-1.1-1.1-1.1-2.9 0-4z' fill='%23C9913D' fill-opacity='0.07'/%3E%3C/svg%3E")}
.sc-pad{padding:70px 20px}
.con{max-width:1140px;margin:0 auto}
.fc{background:var(--card);border:1px solid var(--br);border-radius:20px;padding:28px 24px;transition:all .3s}
.fc:hover{transform:translateY(-5px);box-shadow:var(--sm);border-color:var(--brd)}
.stc{background:var(--card);border:1px solid var(--br);border-radius:22px;padding:28px 22px;transition:all .3s;position:relative;overflow:hidden}
.stc:hover{transform:translateY(-5px);box-shadow:var(--sm)}
.plc{border-radius:24px;padding:32px 24px;border:2px solid;transition:transform .3s ease}
.plc:hover{transform:translateY(-9px)}

@media(max-width:900px){.nav-lk{display:none !important}}
@media(max-width:700px){
  .pgrid{grid-template-columns:1fr 1fr !important}
  .plgrid{grid-template-columns:1fr !important}
  .dgrid{grid-template-columns:1fr !important}
  .sgrid{grid-template-columns:1fr 1fr !important}
}
@media(max-width:480px){
  .pgrid{grid-template-columns:1fr !important}
  .qgrid{grid-template-columns:1fr 1fr !important}
}
`;

// ─── AUTH CONTEXT ─────────────────────────────────────────────
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vm_token");
    const saved = localStorage.getItem("vm_user");
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch (e) {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.success) {
      localStorage.setItem("vm_token", res.token);
      localStorage.setItem("vm_user", JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  };

  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    if (res.success) {
      localStorage.setItem("vm_token", res.token);
      localStorage.setItem("vm_user", JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem("vm_token");
    localStorage.removeItem("vm_user");
    setUser(null);
  };

  return { user, loading, login, register, logout };
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const auth = useAuth();
  const [page, setPage] = useState("home");
  const [lookingFor, setLookingFor] = useState("bride");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modal, setModal] = useState(null);
  const [likedIds, setLikedIds] = useState([]);
  const [sentIds, setSentIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [filters, setFilters] = useState({ ageMin: 21, ageMax: 35, religion: "All Religions", city: "All Cities", education: "All Education" });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3200); };

  const toggleLike = (id, e) => {
    if (e) e.stopPropagation();
    setLikedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const sendInterest = async (id) => {
    if (sentIds.includes(id)) { showToast("✓ Interest already sent!"); return; }
    if (auth.user) {
      const res = await api.post(`/interests/send/${id}`, { message: "Interested in your profile!" });
      if (res.success) { setSentIds(prev => [...prev, id]); showToast("💌 Interest sent!"); }
      else showToast(res.message || "Could not send interest.");
    } else {
      setSentIds(prev => [...prev, id]);
      showToast("💌 Interest sent!");
    }
    if (modal === "interest") setModal(null);
  };

  const openProfile = (p) => { setSelectedProfile(p); setPage("detail"); };

  const allProfiles = lookingFor === "bride" ? DEMO_BRIDES : DEMO_GROOMS;
  const filteredProfiles = allProfiles.filter(p => {
    if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
    if (filters.religion !== "All Religions" && p.religion !== filters.religion) return false;
    if (filters.city !== "All Cities" && p.city !== filters.city) return false;
    if (filters.education !== "All Education" && !p.education.toLowerCase().includes(filters.education.split("/")[0].toLowerCase())) return false;
    return true;
  });

  const nc = scrolled ? "var(--tx)" : "rgba(253,248,242,0.82)";
  const na = scrolled ? "var(--m)" : "var(--gl)";

  if (auth.loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cr)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💍</div>
        <div className="fh" style={{ fontSize: 24, color: "var(--m)" }}>VivahMatch</div>
        <div style={{ color: "var(--mu)", fontSize: 14, marginTop: 8 }}>Loading...</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className={`vm-nav${scrolled ? " sc" : ""}`}>
        <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          <span style={{ fontSize: 24 }}>💍</span>
          <span className="fh" style={{ fontSize: 21, fontWeight: 700, color: scrolled ? "var(--m)" : "#FDF8F2" }}>VivahMatch</span>
        </div>
        <div className="nav-lk" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {[["home","Home"],["profiles","Find Match"],["plans","Plans"],["success","Success Stories"]].map(([p,lbl]) => (
            <span key={p} className={`nl${page===p?" active":""}`} onClick={() => setPage(p)} style={{ color: page===p?na:nc }}>{lbl}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
          {auth.user ? (
            <>
              <span style={{ fontSize: 13, color: scrolled?"var(--m)":"rgba(253,248,242,0.8)", fontWeight: 600 }}>👤 {auth.user.name.split(" ")[0]}</span>
              <button className="bo" style={{ padding: "8px 16px", fontSize: 13, border: `1.5px solid ${scrolled?"var(--m)":"rgba(253,248,242,0.6)"}`, color: scrolled?"var(--m)":"#FDF8F2" }} onClick={auth.logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="bo" style={{ padding: "9px 18px", fontSize: 13, border: `1.5px solid ${scrolled?"var(--m)":"rgba(253,248,242,0.6)"}`, color: scrolled?"var(--m)":"#FDF8F2" }} onClick={() => setModal("login")}>Login</button>
              <button className="bg" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => setModal("register")}>Register Free</button>
            </>
          )}
        </div>
      </nav>

      {/* PAGES */}
      {page === "home" && <HomePage setPage={setPage} setModal={setModal} />}
      {page === "profiles" && <ProfilesPage lookingFor={lookingFor} setLookingFor={setLookingFor} profiles={filteredProfiles} allCount={allProfiles.length} filters={filters} setFilters={setFilters} likedIds={likedIds} toggleLike={toggleLike} sentIds={sentIds} sendInterest={sendInterest} openProfile={openProfile} setModal={setModal} showToast={showToast} />}
      {page === "detail" && selectedProfile && <ProfileDetail profile={selectedProfile} back={() => setPage("profiles")} likedIds={likedIds} toggleLike={toggleLike} sentIds={sentIds} sendInterest={sendInterest} setModal={setModal} showToast={showToast} />}
      {page === "plans" && <PlansPage setModal={setModal} />}
      {page === "success" && <SuccessPage setModal={setModal} />}

      {/* MODALS */}
      {modal === "login" && <LoginModal onClose={() => setModal(null)} onSwitch={() => setModal("register")} auth={auth} showToast={showToast} />}
      {modal === "register" && <RegisterModal onClose={() => setModal(null)} onSwitch={() => setModal("login")} auth={auth} showToast={showToast} />}
      {modal === "interest" && selectedProfile && <InterestModal profile={selectedProfile} onClose={() => setModal(null)} onSend={() => sendInterest(selectedProfile.id)} alreadySent={sentIds.includes(selectedProfile?.id)} />}

      {toast && <div className="toast">{toast}</div>}

      <SiteFooter setPage={setPage} setModal={setModal} />
    </>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ setPage, setModal }) {
  const FEATURES = [
    { icon: "🔐", title: "Verified Profiles", desc: "Every profile is manually reviewed and photo-verified for authenticity you can trust." },
    { icon: "🔮", title: "Horoscope Matching", desc: "Advanced Kundali compatibility with star matching, gothra check, and detailed score." },
    { icon: "💬", title: "Private Chat", desc: "End-to-end encrypted messaging that unlocks after mutual interest — completely safe." },
    { icon: "🎯", title: "Smart Filters", desc: "Filter by community, education, profession, income, city, star, gothra, and more." },
    { icon: "👑", title: "Premium Badge", desc: "Stand out with a premium badge and receive 3× more profile visits." },
    { icon: "🤝", title: "Relationship Manager", desc: "Diamond members get a dedicated human manager to guide your entire journey." },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="hbg hpat" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 66, position: "relative", overflow: "hidden" }}>
        <div style={{ position:"absolute",width:500,height:500,borderRadius:"50%",background:"rgba(201,145,61,0.12)",filter:"blur(90px)",top:"5%",right:"-10%",pointerEvents:"none" }} />
        <div style={{ position:"absolute",width:350,height:350,borderRadius:"50%",background:"rgba(123,29,58,0.28)",filter:"blur(80px)",bottom:"10%",left:"-8%",pointerEvents:"none" }} />
        <div style={{ textAlign:"center",padding:"60px 20px 80px",maxWidth:820,position:"relative",zIndex:1 }}>
          <div className="fu" style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(201,145,61,0.18)",border:"1px solid rgba(201,145,61,0.4)",borderRadius:50,padding:"6px 20px",marginBottom:28 }}>
            <span style={{ fontSize:13 }}>✨</span>
            <span style={{ fontSize:12,fontWeight:700,color:"#F0C878",letterSpacing:1.2 }}>INDIA'S MOST TRUSTED MATRIMONY PLATFORM</span>
          </div>
          <h1 className="fu1 fh" style={{ fontSize:"clamp(38px,7vw,72px)",color:"#FDF8F2",fontWeight:700,lineHeight:1.12,marginBottom:20 }}>
            Find Your<br /><span className="shim">Perfect Life Partner</span>
          </h1>
          <p className="fu2" style={{ fontSize:"clamp(15px,2.2vw,18px)",color:"rgba(253,248,242,0.82)",lineHeight:1.75,maxWidth:540,margin:"0 auto 36px" }}>
            Join 5 lakh+ families who found their perfect match. Verified profiles, horoscope matching, and dedicated support — all in one place.
          </p>
          <div className="fu3" style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:60 }}>
            <button className="bg" style={{ padding:"15px 38px",fontSize:16 }} onClick={() => setModal("register")}>Register Free →</button>
            <button className="bgh" style={{ padding:"15px 32px",fontSize:15 }} onClick={() => setPage("profiles")}>Browse Profiles</button>
          </div>
          <div className="sgrid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,background:"rgba(253,248,242,0.07)",border:"1px solid rgba(201,145,61,0.28)",borderRadius:20,padding:"20px 14px" }}>
            {[["5L+","Profiles"],["2.3L+","Marriages"],["98%","Success Rate"],["24/7","Support"]].map(([v,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div className="fh" style={{ fontSize:"clamp(18px,3.5vw,30px)",color:"#F0C878",fontWeight:700 }}>{v}</div>
                <div style={{ fontSize:"clamp(10px,1.5vw,13px)",color:"rgba(253,248,242,0.6)",marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK SEARCH */}
      <div style={{ padding:"0 20px" }}>
        <div className="con" style={{ marginTop:-28 }}>
          <div style={{ background:"var(--card)",border:"1px solid var(--br)",borderRadius:24,padding:"30px 26px",boxShadow:"var(--sl)" }}>
            <h2 className="fh" style={{ fontSize:22,color:"var(--m)",marginBottom:20,textAlign:"center" }}>Quick Profile Search</h2>
            <div className="qgrid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16 }}>
              {[["Looking For",["Bride 👰","Groom 🤵"]],["Religion",["Hindu","Muslim","Christian"]],["Age Range",["21–25","26–30","31–35"]],["City",["Chennai","Coimbatore","Madurai","Bangalore"]]].map(([lbl,opts]) => (
                <div key={lbl}>
                  <div style={{ fontSize:11,fontWeight:700,color:"var(--mu)",letterSpacing:0.8,marginBottom:7 }}>{lbl.toUpperCase()}</div>
                  <select className="sel">{opts.map(o => <option key={o}>{o}</option>)}</select>
                </div>
              ))}
            </div>
            <button className="bm" style={{ width:"100%",padding:"14px",fontSize:16 }} onClick={() => setPage("profiles")}>🔍 &nbsp;Search Profiles</button>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="sc-pad" style={{ background:"linear-gradient(to bottom,var(--cr),var(--cd))" }}>
        <div className="con" style={{ textAlign:"center" }}>
          <div className="orn">❧ ✦ ❧</div>
          <h2 className="fh" style={{ fontSize:"clamp(26px,4vw,40px)",color:"var(--tx)",margin:"12px 0 10px" }}>Why Choose VivahMatch?</h2>
          <p style={{ fontSize:15,color:"var(--mu)",marginBottom:46,maxWidth:480,margin:"0 auto 46px" }}>Trusted features crafted to make your matrimony journey smooth and successful</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:18 }}>
            {FEATURES.map((f,i) => (
              <div key={i} className="fc" style={{ textAlign:"left" }}>
                <div style={{ fontSize:36,marginBottom:14 }}>{f.icon}</div>
                <div className="fh" style={{ fontSize:19,fontWeight:600,color:"var(--m)",marginBottom:8 }}>{f.title}</div>
                <p style={{ fontSize:14,color:"var(--ts)",lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="sc-pad">
        <div className="con" style={{ textAlign:"center" }}>
          <div className="orn">❧ ✦ ❧</div>
          <h2 className="fh" style={{ fontSize:"clamp(26px,4vw,40px)",color:"var(--tx)",margin:"12px 0 10px" }}>How It Works</h2>
          <p style={{ fontSize:15,color:"var(--mu)",marginBottom:46 }}>Three simple steps to finding your perfect life partner</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18,marginBottom:44 }}>
            {[{n:"01",icon:"📝",title:"Create Profile",desc:"Sign up free. Add photos, preferences, education, and horoscope details in minutes."},
              {n:"02",icon:"💡",title:"Discover Matches",desc:"Browse curated profiles. Use advanced filters and AI-powered compatibility scoring."},
              {n:"03",icon:"💞",title:"Connect & Celebrate",desc:"Send interest, unlock chat, get families involved, and begin your journey together."}
            ].map((s,i) => (
              <div key={i} style={{ background:"linear-gradient(135deg,rgba(123,29,58,0.04),rgba(201,145,61,0.07))",border:"1px solid var(--br)",borderRadius:22,padding:"32px 24px",position:"relative",overflow:"hidden" }}>
                <div className="fh" style={{ position:"absolute",top:10,right:16,fontSize:50,color:"rgba(201,145,61,0.12)",fontWeight:700,lineHeight:1 }}>{s.n}</div>
                <div style={{ fontSize:40,marginBottom:16,position:"relative",zIndex:1 }}>{s.icon}</div>
                <div className="fh" style={{ fontSize:19,fontWeight:700,color:"var(--m)",marginBottom:8,position:"relative",zIndex:1 }}>{s.title}</div>
                <p style={{ fontSize:14,color:"var(--ts)",lineHeight:1.7,position:"relative",zIndex:1 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <button className="bm" style={{ padding:"14px 40px",fontSize:16 }} onClick={() => setModal("register")}>Get Started — It's Free</button>
        </div>
      </section>

      {/* SUCCESS PREVIEW */}
      <section className="sc-pad" style={{ background:"var(--cd)" }}>
        <div className="con" style={{ textAlign:"center" }}>
          <div className="orn">❧ ✦ ❧</div>
          <h2 className="fh" style={{ fontSize:"clamp(26px,4vw,40px)",color:"var(--tx)",margin:"12px 0 10px" }}>Recent Success Stories</h2>
          <p style={{ fontSize:15,color:"var(--mu)",marginBottom:44 }}>Real couples, real happiness — all found on VivahMatch</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18,marginBottom:36 }}>
            {SUCCESS_STORIES.slice(0,3).map((s,i) => <StoryCard key={i} story={s} />)}
          </div>
          <button className="bo" style={{ padding:"12px 30px",fontSize:14,border:"1.5px solid var(--m)",color:"var(--m)" }} onClick={() => setPage("success")}>View All Stories →</button>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"0 20px 70px" }}>
        <div className="con">
          <div style={{ background:"linear-gradient(135deg,#4A0F22,#7B1D3A,#C9913D)",borderRadius:26,padding:"50px 30px",textAlign:"center",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",width:280,height:280,borderRadius:"50%",background:"rgba(253,248,242,0.07)",top:-70,right:-50,pointerEvents:"none" }} />
            <div style={{ position:"relative",zIndex:1 }}>
              <div style={{ fontSize:38,marginBottom:12 }}>💍</div>
              <h2 className="fh" style={{ fontSize:"clamp(22px,4vw,36px)",color:"#FDF8F2",marginBottom:10 }}>Your Perfect Match is Waiting</h2>
              <p style={{ color:"rgba(253,248,242,0.82)",fontSize:16,marginBottom:28 }}>Join 5 lakh+ families. Register free and start your journey today.</p>
              <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
                <button className="bg" style={{ padding:"14px 34px",fontSize:16 }} onClick={() => setModal("register")}>Register Free Now</button>
                <button className="bgh" style={{ padding:"14px 30px",fontSize:15 }} onClick={() => setPage("profiles")}>Browse Profiles</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PROFILES PAGE ────────────────────────────────────────────
function ProfilesPage({ lookingFor, setLookingFor, profiles, allCount, filters, setFilters, likedIds, toggleLike, sentIds, sendInterest, openProfile, setModal, showToast }) {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const sorted = [...profiles].sort((a,b) => {
    if (sortBy==="age-asc") return a.age-b.age;
    if (sortBy==="age-desc") return b.age-a.age;
    if (sortBy==="premium") return (b.premium?1:0)-(a.premium?1:0);
    return 0;
  });

  return (
    <div style={{ minHeight:"100vh" }}>
      <div style={{ background:"linear-gradient(135deg,#2C0A1A,#7B1D3A,#9B4020)",paddingTop:66 }}>
        <div style={{ padding:"40px 20px 32px",textAlign:"center" }}>
          <h1 className="fh" style={{ fontSize:"clamp(24px,5vw,40px)",color:"#FDF8F2",marginBottom:8 }}>Find Your Match</h1>
          <p style={{ color:"rgba(253,248,242,0.78)",fontSize:15,marginBottom:24 }}>Browse {allCount} verified {lookingFor} profiles</p>
          <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
            {[["bride","👰 Find Bride"],["groom","🤵 Find Groom"]].map(([g,lbl]) => (
              <button key={g} onClick={() => setLookingFor(g)} className={`tp${lookingFor===g?" active":""}`} style={{ background:lookingFor===g?"rgba(253,248,242,0.22)":"transparent",border:`1.5px solid ${lookingFor===g?"#FDF8F2":"rgba(253,248,242,0.42)"}`,color:"#FDF8F2" }}>{lbl}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="con" style={{ padding:"24px 16px" }}>
        <div style={{ background:"var(--card)",border:"1px solid var(--br)",borderRadius:18,padding:"16px 20px",marginBottom:22 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontWeight:700,color:"var(--m)",fontSize:15 }}>🔍 Filters</span>
              <span style={{ background:"rgba(123,29,58,0.1)",color:"var(--m)",padding:"2px 10px",borderRadius:50,fontSize:12,fontWeight:600 }}>{profiles.length} results</span>
            </div>
            <div style={{ display:"flex",gap:9,alignItems:"center" }}>
              <select className="sel" style={{ width:"auto",padding:"8px 12px",fontSize:13 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="default">Sort: Default</option>
                <option value="age-asc">Age: Low–High</option>
                <option value="age-desc">Age: High–Low</option>
                <option value="premium">Premium First</option>
              </select>
              <button style={{ background:"none",border:"1.5px solid var(--br)",borderRadius:10,padding:"8px 14px",color:"var(--g)",fontWeight:600,fontSize:13,cursor:"pointer" }} onClick={() => setShowFilters(v=>!v)}>{showFilters?"▲ Hide":"▼ Filters"}</button>
            </div>
          </div>
          {showFilters && (
            <div style={{ marginTop:18,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:14 }}>
              <div>
                <label style={{ fontSize:11,fontWeight:700,color:"var(--mu)",letterSpacing:0.8 }}>AGE: {filters.ageMin}–{filters.ageMax} yrs</label>
                <div style={{ display:"flex",gap:8,marginTop:7 }}>
                  <input type="range" min={18} max={50} value={filters.ageMin} onChange={e => setFilters(f=>({...f,ageMin:+e.target.value}))} />
                  <input type="range" min={18} max={55} value={filters.ageMax} onChange={e => setFilters(f=>({...f,ageMax:+e.target.value}))} />
                </div>
              </div>
              {[["Religion","religion",RELIGIONS],["City","city",CITIES],["Education","education",EDUCATIONS]].map(([lbl,key,opts]) => (
                <div key={key}>
                  <label style={{ fontSize:11,fontWeight:700,color:"var(--mu)",letterSpacing:0.8,display:"block",marginBottom:6 }}>{lbl.toUpperCase()}</label>
                  <select className="sel" value={filters[key]} onChange={e => setFilters(f=>({...f,[key]:e.target.value}))}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ display:"flex",alignItems:"flex-end" }}>
                <button className="bo" style={{ padding:"11px 18px",fontSize:13,border:"1.5px solid var(--br)",color:"var(--mu)",width:"100%" }} onClick={() => setFilters({ageMin:21,ageMax:35,religion:"All Religions",city:"All Cities",education:"All Education"})}>↺ Reset</button>
              </div>
            </div>
          )}
        </div>
        {sorted.length === 0 ? (
          <div style={{ textAlign:"center",padding:"80px 20px" }}>
            <div style={{ fontSize:56,marginBottom:14 }}>😔</div>
            <div className="fh" style={{ fontSize:22,color:"var(--m)",marginBottom:8 }}>No profiles found</div>
            <p style={{ color:"var(--mu)",fontSize:14 }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="pgrid" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:18 }}>
            {sorted.map(p => <ProfileCard key={p.id} profile={p} likedIds={likedIds} toggleLike={toggleLike} sentIds={sentIds} sendInterest={sendInterest} openProfile={openProfile} showToast={showToast} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileCard({ profile: p, likedIds, toggleLike, sentIds, sendInterest, openProfile, showToast }) {
  return (
    <div className="pc" onClick={() => openProfile(p)} style={{ height:360 }}>
      <img src={p.photo} alt={p.name} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
      <div className="pco" />
      <div style={{ position:"absolute",top:13,left:13,display:"flex",gap:5,zIndex:2 }}>
        {p.verified && <span className="bdg bv">✓ Verified</span>}
        {p.premium && <span className="bdg bp">👑 Premium</span>}
      </div>
      <button style={{ position:"absolute",top:11,right:13,zIndex:2,background:"rgba(253,248,242,0.92)",border:"none",borderRadius:"50%",width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,transition:"transform 0.2s" }}
        onClick={e => toggleLike(p.id,e)}
        onMouseEnter={e => e.currentTarget.style.transform="scale(1.25)"}
        onMouseLeave={e => e.currentTarget.style.transform=""}>
        {likedIds.includes(p.id)?"❤️":"🤍"}
      </button>
      <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"16px 14px",zIndex:2 }}>
        <div className="fh" style={{ fontSize:20,color:"#FDF8F2",fontWeight:700,marginBottom:3 }}>{p.name}, {p.age}</div>
        <div style={{ fontSize:12,color:"rgba(253,248,242,0.82)",marginBottom:10 }}>{p.profession} · {p.city}</div>
        <div style={{ display:"flex",gap:8 }}>
          <button className="bg" style={{ padding:"8px 14px",fontSize:12,flex:1 }} onClick={e => { e.stopPropagation(); sentIds.includes(p.id)?showToast("✓ Already sent!"):sendInterest(p.id); }}>{sentIds.includes(p.id)?"✓ Sent":"💌 Interest"}</button>
          <button style={{ padding:"8px 13px",fontSize:12,background:"rgba(253,248,242,0.18)",border:"1px solid rgba(253,248,242,0.45)",borderRadius:50,color:"#FDF8F2",fontWeight:600,cursor:"pointer" }} onClick={e => { e.stopPropagation(); openProfile(p); }}>View →</button>
        </div>
      </div>
    </div>
  );
}

function ProfileDetail({ profile: p, back, likedIds, toggleLike, sentIds, sendInterest, setModal, showToast }) {
  const sent = sentIds.includes(p.id);
  return (
    <div style={{ minHeight:"100vh" }}>
      <div style={{ background:"linear-gradient(135deg,#2C0A1A,#7B1D3A)",paddingTop:66 }}>
        <div className="con" style={{ padding:"18px 20px",display:"flex",alignItems:"center",gap:14 }}>
          <button style={{ background:"rgba(253,248,242,0.15)",border:"1px solid rgba(253,248,242,0.4)",borderRadius:50,padding:"8px 18px",color:"#FDF8F2",fontSize:13,fontWeight:600,cursor:"pointer" }} onClick={back}>← Back</button>
          <div>
            <span className="fh" style={{ color:"#FDF8F2",fontSize:19 }}>{p.name}</span>
            <span style={{ color:"rgba(253,248,242,0.6)",fontSize:13,marginLeft:10 }}>{p.profession} · {p.city}</span>
          </div>
        </div>
      </div>
      <div className="con" style={{ padding:"28px 16px 60px" }}>
        <div className="dgrid" style={{ display:"grid",gridTemplateColumns:"370px 1fr",gap:26 }}>
          <div>
            <div style={{ position:"relative",borderRadius:20,overflow:"hidden",boxShadow:"var(--sm)" }}>
              <img src={p.photo} alt={p.name} style={{ width:"100%",aspectRatio:"4/5",objectFit:"cover",display:"block" }} />
              <button style={{ position:"absolute",top:13,right:13,background:"rgba(253,248,242,0.92)",border:"none",borderRadius:"50%",width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:20,zIndex:2 }} onClick={() => toggleLike(p.id,null)}>
                {likedIds.includes(p.id)?"❤️":"🤍"}
              </button>
            </div>
            <div style={{ display:"flex",gap:7,marginTop:13,flexWrap:"wrap" }}>
              {p.verified && <span className="bdg bv" style={{ fontSize:12 }}>✓ Verified Profile</span>}
              {p.premium && <span className="bdg bp" style={{ fontSize:12 }}>👑 Premium Member</span>}
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:9,marginTop:16 }}>
              <button className="bm" style={{ padding:"13px",fontSize:15,width:"100%" }} onClick={() => sent?showToast("✓ Already sent!"):sendInterest(p.id)}>{sent?"✓ Interest Sent":"💌 Send Interest"}</button>
              <button className="bo" style={{ padding:"12px",fontSize:15,width:"100%",border:"1.5px solid var(--m)",color:"var(--m)" }} onClick={() => setModal("register")}>💬 Start Chat</button>
              <button className="bo" style={{ padding:"12px",fontSize:15,width:"100%",border:"1.5px solid var(--br)",color:"var(--mu)" }} onClick={() => setModal("register")}>📞 View Contact</button>
            </div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            <div style={{ background:"var(--card)",border:"1px solid var(--br)",borderRadius:18,padding:"22px" }}>
              <h1 className="fh" style={{ fontSize:30,color:"var(--tx)",marginBottom:5 }}>{p.name}</h1>
              <p style={{ color:"var(--mu)",fontSize:15,marginBottom:14 }}>{p.profession} · {p.city} · {p.age} years</p>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {[p.religion,p.caste,p.education].map(tag => <span key={tag} style={{ background:"rgba(123,29,58,0.07)",color:"var(--m)",padding:"5px 14px",borderRadius:50,fontSize:13,fontWeight:600 }}>{tag}</span>)}
              </div>
            </div>
            <div style={{ background:"var(--card)",border:"1px solid var(--br)",borderRadius:18,padding:"22px" }}>
              <div style={{ fontSize:11,fontWeight:700,color:"var(--mu)",letterSpacing:1,marginBottom:16 }}>BASIC DETAILS</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:0 }}>
                {[["🎂 Age",`${p.age} years`],["📏 Height",p.height],["🎓 Education",p.education],["💼 Profession",p.profession],["🕉️ Religion",p.religion],["🏛️ Caste",p.caste],["⭐ Rashi",p.horoscope],["🌟 Star",p.star],["🌿 Gothra",p.gothra],["💰 Income",p.income]].map(([lbl,val]) => (
                  <div key={lbl} style={{ padding:"10px 0",borderBottom:"1px solid var(--br)" }}>
                    <div style={{ fontSize:11,color:"var(--g)",fontWeight:700,letterSpacing:0.4,marginBottom:3 }}>{lbl}</div>
                    <div style={{ fontSize:15,color:"var(--tx)",fontWeight:500 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:"var(--card)",border:"1px solid var(--br)",borderRadius:18,padding:"22px" }}>
              <div style={{ fontSize:11,fontWeight:700,color:"var(--mu)",letterSpacing:1,marginBottom:12 }}>ABOUT ME</div>
              <p className="fs" style={{ fontSize:18,color:"var(--ts)",lineHeight:1.75 }}>{p.bio}</p>
            </div>
            <div style={{ background:"linear-gradient(135deg,rgba(123,29,58,0.05),rgba(201,145,61,0.07))",border:"1px solid var(--br)",borderRadius:18,padding:"22px" }}>
              <div style={{ fontSize:11,fontWeight:700,color:"var(--mu)",letterSpacing:1,marginBottom:12 }}>PARTNER PREFERENCE</div>
              <p className="fs" style={{ fontSize:18,color:"var(--ts)",lineHeight:1.75,fontStyle:"italic" }}>"{p.lookingFor}"</p>
            </div>
            <div style={{ background:"var(--card)",border:"1px solid var(--br)",borderRadius:18,padding:"22px" }}>
              <div style={{ fontSize:11,fontWeight:700,color:"var(--mu)",letterSpacing:1,marginBottom:13 }}>LANGUAGES KNOWN</div>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {p.languages.map(l => <span key={l} style={{ background:"rgba(123,29,58,0.08)",color:"var(--m)",padding:"6px 16px",borderRadius:50,fontSize:14,fontWeight:600,border:"1px solid rgba(123,29,58,0.15)" }}>{l}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlansPage({ setModal }) {
  return (
    <div style={{ minHeight:"100vh" }}>
      <div style={{ background:"linear-gradient(135deg,#2C0A1A,#7B1D3A)",paddingTop:66 }}>
        <div style={{ padding:"46px 20px 40px",textAlign:"center" }}>
          <h1 className="fh" style={{ fontSize:"clamp(26px,5vw,42px)",color:"#FDF8F2",marginBottom:10 }}>Membership Plans</h1>
          <p style={{ color:"rgba(253,248,242,0.78)",fontSize:16 }}>Choose the plan that fits your journey</p>
        </div>
      </div>
      <div className="con" style={{ padding:"40px 20px 70px" }}>
        <div className="plgrid" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:22,alignItems:"start" }}>
          {PLANS.map((plan,i) => {
            const isPop=i===1,isDia=i===2;
            return (
              <div key={plan.name} className="plc" style={{ background:isDia?"linear-gradient(145deg,#0D0A1E,#1B1445)":"var(--card)",borderColor:plan.color,boxShadow:isPop?`0 20px 60px rgba(201,145,61,0.22)`:"var(--ss)",transform:isPop?"scale(1.03)":"none",position:"relative" }}>
                {plan.badge && <div style={{ position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:isPop?"linear-gradient(135deg,#C9913D,#F0C878)":"linear-gradient(135deg,#6A9FD4,#A8CFF0)",color:isDia?"#FDF8F2":"#2C1005",padding:"5px 20px",borderRadius:50,fontWeight:800,fontSize:11,letterSpacing:1.2,whiteSpace:"nowrap" }}>{plan.badge}</div>}
                <div style={{ textAlign:"center",paddingTop:plan.badge?14:0,marginBottom:24 }}>
                  <div className="fh" style={{ fontSize:24,fontWeight:700,color:plan.color,marginBottom:4 }}>{plan.name}</div>
                  <div className="fh" style={{ fontSize:38,fontWeight:700,color:isDia?"#FDF8F2":"var(--tx)" }}>
                    {plan.price===0?"Free":`₹${plan.price}`}
                    {plan.price>0 && <span style={{ fontSize:15,fontWeight:400,color:isDia?"rgba(253,248,242,0.5)":"var(--mu)" }}>/month</span>}
                  </div>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:9,marginBottom:26 }}>
                  {plan.features.map((f,fi) => (
                    <div key={fi} style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                      <span style={{ color:f.ok?plan.color:(isDia?"rgba(253,248,242,0.22)":"#DDD"),fontWeight:700,flexShrink:0,marginTop:1,fontSize:14 }}>{f.ok?"✓":"✗"}</span>
                      <span style={{ fontSize:14,color:f.ok?(isDia?"rgba(253,248,242,0.88)":"var(--ts)"):(isDia?"rgba(253,248,242,0.28)":"#B0A090") }}>{f.text}</span>
                    </div>
                  ))}
                </div>
                <button style={{ width:"100%",padding:"13px",borderRadius:50,fontSize:15,fontWeight:700,cursor:"pointer",border:`2px solid ${plan.color}`,background:plan.price===0?"transparent":`linear-gradient(135deg,${plan.color},${isDia?"#A8CFF0":"#F0C878"})`,color:plan.price===0?plan.color:"#2C1005",transition:"all .25s" }} onClick={() => setModal("register")}>{plan.price===0?"Get Started Free":`Choose ${plan.name}`}</button>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign:"center",marginTop:40,display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap" }}>
          {["🔒 Secure Payment","30-Day Money Back","Cancel Anytime","GST Invoice"].map(item => <span key={item} style={{ fontSize:13,color:"var(--mu)",fontWeight:500 }}>{item}</span>)}
        </div>
      </div>
    </div>
  );
}

function SuccessPage({ setModal }) {
  return (
    <div style={{ minHeight:"100vh" }}>
      <div style={{ background:"linear-gradient(135deg,#7B1D3A,#9B4020,#C9913D)",paddingTop:66 }}>
        <div style={{ padding:"46px 20px 40px",textAlign:"center" }}>
          <div style={{ fontSize:40,marginBottom:8 }}>💍</div>
          <h1 className="fh" style={{ fontSize:"clamp(26px,5vw,42px)",color:"#FDF8F2",marginBottom:10 }}>Success Stories</h1>
          <p style={{ color:"rgba(253,248,242,0.8)",fontSize:16 }}>Real couples, real happiness — all connected through VivahMatch</p>
        </div>
      </div>
      <div className="con" style={{ padding:"40px 20px 70px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20,marginBottom:46 }}>
          {SUCCESS_STORIES.map((s,i) => <StoryCard key={i} story={s} />)}
        </div>
        <div style={{ background:"var(--card)",border:"1px solid var(--br)",borderRadius:24,padding:"42px 28px",textAlign:"center" }}>
          <div className="orn" style={{ marginBottom:14 }}>❧ ✦ ❧</div>
          <h2 className="fh" style={{ fontSize:"clamp(20px,4vw,32px)",color:"var(--m)",marginBottom:10 }}>2,30,000+ Marriages & Counting</h2>
          <p style={{ fontSize:15,color:"var(--mu)",marginBottom:32 }}>Every month, hundreds of families celebrate because of VivahMatch</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:12,marginBottom:32 }}>
            {[["2.3L+","Couples Married"],["5L+","Active Profiles"],["98%","Satisfaction"],["18 Yrs","Of Trust"],["50+","Cities"],["3","Languages"]].map(([n,l]) => (
              <div key={l} style={{ background:"linear-gradient(135deg,rgba(123,29,58,0.05),rgba(201,145,61,0.08))",border:"1px solid var(--br)",borderRadius:14,padding:"16px 10px" }}>
                <div className="fh" style={{ fontSize:22,color:"var(--g)",fontWeight:700 }}>{n}</div>
                <div style={{ fontSize:11,color:"var(--mu)",marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
          <button className="bm" style={{ padding:"13px 34px",fontSize:15 }} onClick={() => setModal("register")}>Write Your Own Story →</button>
        </div>
      </div>
    </div>
  );
}

function StoryCard({ story: s }) {
  return (
    <div className="stc">
      <div style={{ position:"absolute",top:0,left:0,right:0,height:4,background:"linear-gradient(90deg,var(--m),var(--g))" }} />
      <div style={{ display:"flex",alignItems:"center",gap:11,marginBottom:16 }}>
        <div style={{ display:"flex" }}>
          <img src={s.imgBride} alt={s.bride} style={{ width:48,height:48,borderRadius:"50%",border:"2.5px solid #FDF8F2",objectFit:"cover" }} />
          <img src={s.imgGroom} alt={s.groom} style={{ width:48,height:48,borderRadius:"50%",border:"2.5px solid #FDF8F2",objectFit:"cover",marginLeft:-14 }} />
        </div>
        <div>
          <div className="fh" style={{ fontSize:16,fontWeight:700,color:"var(--m)" }}>{s.bride} & {s.groom}</div>
          <div style={{ fontSize:12,color:"var(--mu)" }}>{s.city} · {s.year} · {s.months} months</div>
        </div>
      </div>
      <div className="fh" style={{ fontSize:30,color:"var(--g)",lineHeight:1,marginBottom:7 }}>"</div>
      <p className="fs" style={{ fontSize:17,color:"var(--ts)",lineHeight:1.75,fontStyle:"italic" }}>{s.quote}</p>
      <div style={{ marginTop:12,color:"var(--g)",fontSize:14 }}>★★★★★</div>
    </div>
  );
}

function LoginModal({ onClose, onSwitch, auth, showToast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { showToast("⚠️ Fill all fields"); return; }
    setLoading(true);
    const res = await auth.login(email, password);
    setLoading(false);
    if (res.success) { showToast("🎉 Welcome back!"); onClose(); }
    else showToast(res.message || "Login failed");
  };

  return (
    <div className="mo" onClick={onClose}>
      <div className="mb" onClick={e => e.stopPropagation()}>
        <div style={{ padding:"34px 30px" }}>
          <div style={{ textAlign:"center",marginBottom:26 }}>
            <div style={{ fontSize:36,marginBottom:8 }}>💍</div>
            <h2 className="fh" style={{ fontSize:26,color:"var(--m)" }}>Welcome Back</h2>
            <p style={{ fontSize:14,color:"var(--mu)",marginTop:5 }}>Sign in to your VivahMatch account</p>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
            <div>
              <label style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,display:"block",marginBottom:5 }}>EMAIL ADDRESS</label>
              <input className="inp" placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,display:"block",marginBottom:5 }}>PASSWORD</label>
              <input className="inp" placeholder="Your password" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter"&&handleLogin()} />
            </div>
            <div style={{ textAlign:"right" }}>
              <span style={{ fontSize:13,color:"var(--g)",cursor:"pointer",fontWeight:600 }}>Forgot Password?</span>
            </div>
            <button className="bm" style={{ padding:"14px",fontSize:16,opacity:loading?0.7:1 }} onClick={handleLogin} disabled={loading}>{loading?"Signing in...":"Sign In →"}</button>
            <p style={{ textAlign:"center",fontSize:14,color:"var(--mu)" }}>
              No account? <span style={{ color:"var(--m)",fontWeight:700,cursor:"pointer" }} onClick={onSwitch}>Register Free</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterModal({ onClose, onSwitch, auth, showToast }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"",email:"",phone:"",password:"",gender:"Bride",religion:"Hindu",caste:"",city:"",education:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleFinish = async () => {
    if (!form.name||!form.email||!form.password) { showToast("⚠️ Fill all required fields"); return; }
    const res = await auth.register({ name:form.name,email:form.email,phone:form.phone,password:form.password,gender:form.gender });
    if (res.success) { showToast("🎉 Welcome to VivahMatch!"); onClose(); }
    else showToast(res.message || "Registration failed");
  };

  return (
    <div className="mo" onClick={onClose}>
      <div className="mb" onClick={e => e.stopPropagation()}>
        <div style={{ padding:"30px 30px" }}>
          <div style={{ textAlign:"center",marginBottom:22 }}>
            <div style={{ fontSize:32,marginBottom:6 }}>💍</div>
            <h2 className="fh" style={{ fontSize:24,color:"var(--m)" }}>Create Your Profile</h2>
            <p style={{ fontSize:13,color:"var(--mu)",marginTop:4 }}>Step {step} of 3</p>
          </div>
          <div style={{ display:"flex",gap:5,marginBottom:22 }}>
            {[1,2,3].map(s => <div key={s} style={{ flex:1,height:4,borderRadius:2,background:step>=s?"var(--m)":"#E5D8C8",transition:"background .3s" }} />)}
          </div>

          {step===1 && (
            <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,display:"block",marginBottom:7 }}>PROFILE FOR *</label>
                <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  {["Bride","Groom","Son","Daughter"].map(g => (
                    <button key={g} onClick={() => set("gender",g)} style={{ padding:"9px 14px",borderRadius:10,border:`1.5px solid ${form.gender===g?"var(--m)":"#E5D8C8"}`,background:form.gender===g?"rgba(123,29,58,0.08)":"transparent",color:form.gender===g?"var(--m)":"var(--mu)",fontWeight:600,cursor:"pointer",fontSize:13 }}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,display:"block",marginBottom:5 }}>FULL NAME *</label>
                <input className="inp" placeholder="Enter full name" value={form.name} onChange={e => set("name",e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,display:"block",marginBottom:5 }}>EMAIL ADDRESS *</label>
                <input className="inp" placeholder="you@example.com" type="email" value={form.email} onChange={e => set("email",e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,display:"block",marginBottom:5 }}>MOBILE NUMBER</label>
                <input className="inp" placeholder="+91 XXXXX XXXXX" type="tel" value={form.phone} onChange={e => set("phone",e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,display:"block",marginBottom:5 }}>PASSWORD *</label>
                <input className="inp" placeholder="Min 6 characters" type="password" value={form.password} onChange={e => set("password",e.target.value)} />
              </div>
              <button className="bm" style={{ padding:"13px",fontSize:15 }} onClick={() => { if(!form.name||!form.email||!form.password){showToast("⚠️ Fill required fields");return;} setStep(2); }}>Continue →</button>
            </div>
          )}

          {step===2 && (
            <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                <div>
                  <label style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,display:"block",marginBottom:5 }}>RELIGION</label>
                  <select className="sel" value={form.religion} onChange={e => set("religion",e.target.value)}>
                    {["Hindu","Muslim","Christian","Sikh","Jain","Buddhist"].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,display:"block",marginBottom:5 }}>CASTE</label>
                  <input className="inp" placeholder="Enter caste" value={form.caste} onChange={e => set("caste",e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,display:"block",marginBottom:5 }}>CITY</label>
                <input className="inp" placeholder="Your city" value={form.city} onChange={e => set("city",e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,display:"block",marginBottom:5 }}>EDUCATION</label>
                <select className="sel" value={form.education} onChange={e => set("education",e.target.value)}>
                  <option value="">Select Education</option>
                  {["B.Tech/B.E","MBBS","MBA","CA","B.Sc","M.Tech","MCA","PhD","Other"].map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div style={{ display:"flex",gap:9 }}>
                <button className="bo" style={{ flex:1,padding:"12px",border:"1.5px solid var(--br)",color:"var(--mu)",fontSize:14 }} onClick={() => setStep(1)}>← Back</button>
                <button className="bm" style={{ flex:2,padding:"12px",fontSize:14 }} onClick={() => setStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {step===3 && (
            <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
              <div style={{ background:"linear-gradient(135deg,rgba(123,29,58,0.05),rgba(201,145,61,0.07))",border:"1px solid var(--br)",borderRadius:14,padding:"16px" }}>
                <div style={{ fontSize:12,fontWeight:700,color:"var(--mu)",letterSpacing:0.5,marginBottom:12 }}>PROFILE SUMMARY</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  {[["Name",form.name||"—"],["Gender",form.gender],["Religion",form.religion],["City",form.city||"—"],["Education",form.education||"—"]].map(([k,v]) => (
                    <div key={k} style={{ padding:"5px 0" }}>
                      <div style={{ fontSize:11,color:"var(--g)",fontWeight:700 }}>{k}</div>
                      <div style={{ fontSize:14,color:"var(--tx)",fontWeight:500 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background:"#E8F5E9",borderRadius:10,padding:"12px 14px" }}>
                <div style={{ fontSize:13,color:"#2E7D32",fontWeight:600 }}>✓ Free membership: 10 views/day · 5 interests/day</div>
              </div>
              <p style={{ fontSize:12,color:"var(--mu)",textAlign:"center",lineHeight:1.6 }}>
                By registering you agree to our <span style={{ color:"var(--m)",cursor:"pointer" }}>Terms</span> and <span style={{ color:"var(--m)",cursor:"pointer" }}>Privacy Policy</span>
              </p>
              <button className="bg" style={{ padding:"14px",fontSize:16 }} onClick={handleFinish}>🎉 Create My Profile</button>
              <button className="bo" style={{ padding:"11px",border:"1.5px solid var(--br)",color:"var(--mu)",fontSize:14 }} onClick={() => setStep(2)}>← Back</button>
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

function InterestModal({ profile: p, onClose, onSend, alreadySent }) {
  return (
    <div className="mo" onClick={onClose}>
      <div className="mb" onClick={e => e.stopPropagation()}>
        <div style={{ padding:"34px 30px",textAlign:"center" }}>
          <img src={p.photo} alt={p.name} style={{ width:88,height:88,borderRadius:"50%",objectFit:"cover",border:"3px solid var(--g)",marginBottom:14 }} />
          <h2 className="fh" style={{ fontSize:22,color:"var(--m)",marginBottom:8 }}>{alreadySent?"Interest Already Sent":`Send Interest to ${p.name}?`}</h2>
          <p style={{ fontSize:14,color:"var(--mu)",lineHeight:1.65,marginBottom:24 }}>{alreadySent?`You already expressed interest in ${p.name}.`:`${p.name} will be notified. If accepted, you can chat and share contacts.`}</p>
          <div style={{ display:"flex",gap:10 }}>
            <button className="bo" style={{ flex:1,padding:"12px",border:"1.5px solid var(--br)",color:"var(--mu)",fontSize:14 }} onClick={onClose}>Cancel</button>
            {!alreadySent && <button className="bm" style={{ flex:2,padding:"12px",fontSize:15 }} onClick={onSend}>💌 Send Interest</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteFooter({ setPage, setModal }) {
  const cols = [
    { title:"Find Match", links:[["Find Bride",()=>setPage("profiles")],["Find Groom",()=>setPage("profiles")],["NRI Matrimony",()=>setModal("register")],["Premium Plans",()=>setPage("plans")]] },
    { title:"Community", links:[["Hindu Matrimony",()=>setPage("profiles")],["Muslim Matrimony",()=>setPage("profiles")],["Christian Matrimony",()=>setPage("profiles")],["By Profession",()=>setPage("profiles")]] },
    { title:"Company", links:[["About Us",()=>{}],["Success Stories",()=>setPage("success")],["Blog",()=>{}],["Careers",()=>{}]] },
    { title:"Support", links:[["Help Center",()=>{}],["Privacy Policy",()=>{}],["Terms of Use",()=>{}],["Contact Us",()=>{}]] },
  ];
  return (
    <footer style={{ background:"#0D0408",color:"rgba(253,248,242,0.62)" }}>
      <div className="con" style={{ padding:"52px 20px 0" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:26,marginBottom:44 }}>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14,cursor:"pointer" }} onClick={() => setPage("home")}>
              <span style={{ fontSize:20 }}>💍</span>
              <span className="fh" style={{ fontSize:19,color:"#F0C878",fontWeight:700 }}>VivahMatch</span>
            </div>
            <p style={{ fontSize:14,lineHeight:1.75,marginBottom:18,maxWidth:210 }}>India's most trusted matrimony platform. Connecting hearts since 2006.</p>
            <div style={{ display:"flex",gap:9 }}>
              {["📘","📸","🐦","▶️"].map((ic,i) => <div key={i} style={{ width:34,height:34,borderRadius:"50%",background:"rgba(201,145,61,0.14)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15 }}>{ic}</div>)}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontWeight:700,color:"var(--g)",marginBottom:14,fontSize:11,letterSpacing:1.2 }}>{col.title.toUpperCase()}</div>
              {col.links.map(([lbl,fn]) => (
                <div key={lbl} style={{ fontSize:14,marginBottom:9,cursor:"pointer",transition:"color .2s" }} onClick={fn}
                  onMouseEnter={e => e.currentTarget.style.color="#F0C878"}
                  onMouseLeave={e => e.currentTarget.style.color=""}>{lbl}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(201,145,61,0.14)",padding:"22px 0",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
          <div style={{ display:"flex",gap:9 }}>
            {["🍎 App Store","🤖 Play Store"].map(s => <div key={s} style={{ padding:"7px 14px",border:"1px solid rgba(201,145,61,0.3)",borderRadius:9,fontSize:12,cursor:"pointer" }}>{s}</div>)}
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
