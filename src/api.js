// src/api.js — All backend API calls in one place

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("vm_token");

const req = async (method, path, body = null, isFormData = false) => {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const config = { method, headers };
  if (body) config.body = isFormData ? body : JSON.stringify(body);

  try {
    const res = await fetch(`${BASE}${path}`, config);
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: "Network error. Check your connection." };
  }
};

// ── AUTH ──────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => req("POST", "/auth/register", data),
  login:    (data) => req("POST", "/auth/login", data),
  me:       ()     => req("GET",  "/auth/me"),
  changePassword: (data) => req("PUT", "/auth/change-password", data),
};

// ── PROFILES ──────────────────────────────────────────────────
export const profileAPI = {
  getMe:      ()       => req("GET", "/profiles/me"),
  updateMe:   (data)   => req("PUT", "/profiles/me", data),
  search:     (params) => req("GET", `/profiles/search?${new URLSearchParams(params)}`),
  getById:    (userId) => req("GET", `/profiles/${userId}`),
  shortlist:  (userId) => req("POST", `/profiles/${userId}/shortlist`),
  uploadPhoto: (file)  => {
    const fd = new FormData();
    fd.append("photo", file);
    return req("POST", "/profiles/me/photos", fd, true);
  },
  deletePhoto: (publicId) => req("DELETE", `/profiles/me/photos/${encodeURIComponent(publicId)}`),
  setPrimary:  (publicId) => req("PUT", `/profiles/me/photos/${encodeURIComponent(publicId)}/primary`),
};

// ── INTERESTS ─────────────────────────────────────────────────
export const interestAPI = {
  send:     (userId, msg) => req("POST", `/interests/send/${userId}`, { message: msg }),
  respond:  (id, status)  => req("PUT",  `/interests/${id}/respond`, { status }),
  received: (params)      => req("GET", `/interests/received?${new URLSearchParams(params)}`),
  sent:     ()             => req("GET", "/interests/sent"),
  matches:  ()             => req("GET", "/interests/matches"),
};

// ── MESSAGES ──────────────────────────────────────────────────
export const messageAPI = {
  send:    (userId, text) => req("POST", `/messages/send/${userId}`, { text }),
  chat:    (userId, page) => req("GET", `/messages/chat/${userId}?page=${page || 1}`),
  inbox:   ()             => req("GET", "/messages/inbox"),
};

// ── NOTIFICATIONS ─────────────────────────────────────────────
export const notifAPI = {
  list:     (page) => req("GET", `/notifications?page=${page || 1}`),
  markRead: ()     => req("PUT", "/notifications/mark-read"),
  delete:   (id)   => req("DELETE", `/notifications/${id}`),
};

// ── PLAN ──────────────────────────────────────────────────────
export const planAPI = {
  upgrade: (plan, months) => req("POST", "/plan/upgrade", { plan, durationMonths: months }),
  status:  ()              => req("GET", "/plan/status"),
};

// ── HOROSCOPE ─────────────────────────────────────────────────
export const horoAPI = {
  match: (data) => req("POST", "/horoscope/match", data),
};

// ── ADMIN ─────────────────────────────────────────────────────
export const adminAPI = {
  stats:       ()              => req("GET", "/admin/stats"),
  users:       (params)        => req("GET", `/admin/users?${new URLSearchParams(params)}`),
  toggleUser:  (id)            => req("PUT", `/admin/users/${id}/toggle`),
  verifyProfile:(userId)       => req("PUT", `/admin/profiles/${userId}/verify`),
  notifyAll:   (title, body)   => req("POST", "/admin/notify-all", { title, body }),
};
