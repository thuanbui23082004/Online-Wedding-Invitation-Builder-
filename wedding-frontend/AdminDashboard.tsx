import React, { useState, useEffect, useCallback } from "react";

// ── Config ──────────────────────────────────────────────────────────────────
const API = "http://localhost:3000/admin";

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

// ── Types ───────────────────────────────────────────────────────────────────
type Page = "dashboard" | "users" | "templates" | "cards" | "wishes" | "plans";

interface Stats { totalUsers: number; totalCards: number; totalWishes: number; totalRsvps: number; }
interface UserRow { id: string; email: string; fullName: string | null; role: string; status: string; authProvider: string; createdAt: string; currentPlan: { name: string } | null; _count: { cards: number }; }
interface TemplateRow { id: string; name: string; slug: string; isPremium: boolean; status: string; useCount: number; thumbnailUrl: string | null; createdAt: string; category: { name: string } | null; requiredPlan: { name: string } | null; }
interface CardRow { id: string; title: string; slug: string; groomName: string | null; brideName: string | null; status: string; viewCount: number; createdAt: string; user: { fullName: string | null; email: string } | null; template: { name: string } | null; _count: { guests: number; rsvps: number; wishes: number }; }
interface WishRow { id: string; displayName: string; message: string; isApproved: boolean; isHidden: boolean; createdAt: string; card: { title: string; slug: string } | null; }
interface PlanRow { id: string; name: string; price: string; durationDays: number | null; maxCards: number | null; isActive: boolean; createdAt: string; _count: { users: number }; }

// ── Tokens ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#F7F5F2", white: "#FFFFFF", border: "#F0EDE8",
  gold: "#C9A96E", goldLight: "#FEF3C7", goldDark: "#92400E",
  text: "#1C1917", textMid: "#78716C", textLight: "#A8A29E",
  green: "#10B981", amber: "#F59E0B", red: "#F43F5E",
  stone50: "#FAFAF8", stone100: "#F1EDE6",
};

const btn = (v: "primary"|"ghost"|"outline"|"danger"): React.CSSProperties => ({
  border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
  padding: "6px 14px", transition: "opacity 0.15s",
  ...(v==="primary" && { background: C.gold, color: "#fff" }),
  ...(v==="ghost"   && { background: C.goldLight, color: C.goldDark }),
  ...(v==="outline" && { background: "transparent", border: `1px solid ${C.border}`, color: C.textMid }),
  ...(v==="danger"  && { background: "#FFF1F2", color: C.red, border: `1px solid #FFE4E6` }),
});

const card: React.CSSProperties = {
  background: C.white, borderRadius: 14,
  border: `1px solid ${C.border}`,
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

// ── Micro UI ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:48 }}>
      <div style={{
        width:28, height:28, borderRadius:"50%",
        border:`3px solid ${C.stone100}`,
        borderTopColor: C.gold,
        animation:"spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div style={{ textAlign:"center", padding:"48px 24px", color: C.textLight }}>
      <div style={{ fontSize:32, marginBottom:8 }}>🌸</div>
      <div style={{ fontSize:13 }}>{label}</div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, { dot: string; label: string }> = {
    active:    { dot: C.green,   label: "Hoạt động" },
    inactive:  { dot: "#9CA3AF", label: "Không HĐ" },
    suspended: { dot: C.red,     label: "Bị khóa" },
    unverified:{ dot: C.amber,   label: "Chưa xác thực" },
    published: { dot: C.green,   label: "Đã xuất bản" },
    draft:     { dot: C.amber,   label: "Bản nháp" },
    archived:  { dot: "#9CA3AF", label: "Lưu trữ" },
  };
  const { dot, label } = map[status] ?? { dot:"#9CA3AF", label: status };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, color: C.textMid }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background: dot }} />
      {label}
    </span>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th style={{ padding:"10px 16px", textAlign:"left", fontSize:10,
      fontWeight:700, color: C.textLight, textTransform:"uppercase", letterSpacing:"0.06em",
      borderBottom:`1px solid ${C.stone100}`, whiteSpace:"nowrap" }}>
      {children}
    </th>
  );
}
function Td({ children, mono }: { children?: React.ReactNode; mono?: boolean }) {
  return (
    <td style={{ padding:"11px 16px", fontSize:12, color: C.text,
      borderBottom:`1px solid ${C.stone50}`,
      fontFamily: mono ? "monospace" : undefined }}>
      {children}
    </td>
  );
}

// ── Modal tạo Template ───────────────────────────────────────────────────────
function CreateTemplateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name:"", slug:"", isPremium: false, thumbnailUrl:"" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!form.name || !form.slug) { setErr("Vui lòng điền tên và slug"); return; }
    setLoading(true);
    try {
      await apiFetch("/templates", { method:"POST", body: JSON.stringify(form) });
      onCreated();
      onClose();
    } catch { setErr("Tạo thất bại, kiểm tra slug trùng lặp"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ ...card, width:420, padding:28 }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:20 }}>Tạo mẫu thiệp mới</div>
        {err && <div style={{ background:"#FFF1F2", color:C.red, fontSize:12, padding:"8px 12px", borderRadius:8, marginBottom:12 }}>{err}</div>}
        {[
          { label:"Tên mẫu", key:"name", placeholder:"VD: Bạch Hoa Đình" },
          { label:"Slug (URL)", key:"slug", placeholder:"VD: bach-hoa-dinh" },
          { label:"URL ảnh thumbnail", key:"thumbnailUrl", placeholder:"https://..." },
        ].map(f => (
          <div key={f.key} style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, color:C.textMid, display:"block", marginBottom:4 }}>{f.label}</label>
            <input
              value={(form as any)[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              style={{ width:"100%", boxSizing:"border-box", fontSize:13, padding:"8px 12px",
                border:`1px solid ${C.border}`, borderRadius:8, outline:"none", color:C.text }}
            />
          </div>
        ))}
        <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.textMid, marginBottom:20, cursor:"pointer" }}>
          <input type="checkbox" checked={form.isPremium}
            onChange={e => setForm(p => ({ ...p, isPremium: e.target.checked }))} />
          Mẫu Premium
        </label>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button style={btn("outline")} onClick={onClose}>Hủy</button>
          <button style={btn("primary")} onClick={submit} disabled={loading}>
            {loading ? "Đang tạo…" : "Tạo mẫu"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal tạo Plan ───────────────────────────────────────────────────────────
function CreatePlanModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name:"", price:"0", durationDays:"", maxCards:"" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!form.name) { setErr("Vui lòng điền tên gói"); return; }
    setLoading(true);
    try {
      await apiFetch("/plans", {
        method:"POST",
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price) || 0,
          durationDays: form.durationDays ? parseInt(form.durationDays) : undefined,
          maxCards: form.maxCards ? parseInt(form.maxCards) : undefined,
        }),
      });
      onCreated();
      onClose();
    } catch { setErr("Tạo gói thất bại"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ ...card, width:400, padding:28 }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:20 }}>Tạo gói dịch vụ mới</div>
        {err && <div style={{ background:"#FFF1F2", color:C.red, fontSize:12, padding:"8px 12px", borderRadius:8, marginBottom:12 }}>{err}</div>}
        {[
          { label:"Tên gói", key:"name", placeholder:"VD: Pro, Premium" },
          { label:"Giá (VNĐ)", key:"price", placeholder:"0 = miễn phí" },
          { label:"Thời hạn (ngày, để trống = vĩnh viễn)", key:"durationDays", placeholder:"VD: 30, 365" },
          { label:"Số thiệp tối đa (để trống = không giới hạn)", key:"maxCards", placeholder:"VD: 5" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, color:C.textMid, display:"block", marginBottom:4 }}>{f.label}</label>
            <input
              value={(form as any)[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              style={{ width:"100%", boxSizing:"border-box", fontSize:13, padding:"8px 12px",
                border:`1px solid ${C.border}`, borderRadius:8, outline:"none", color:C.text }}
            />
          </div>
        ))}
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button style={btn("outline")} onClick={onClose}>Hủy</button>
          <button style={btn("primary")} onClick={submit} disabled={loading}>
            {loading ? "Đang tạo…" : "Tạo gói"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiFetch("/stats")
      .then(setStats)
      .catch(() => setErr("Không thể kết nối backend. Kiểm tra backend đã chạy chưa."))
      .finally(() => setLoading(false));
  }, []);

  const CARDS = stats ? [
    { label:"Tổng người dùng", value: stats.totalUsers,  icon:"👥", color:"#EFF6FF" },
    { label:"Thiệp đã tạo",    value: stats.totalCards,   icon:"💌", color:"#FFF7ED" },
    { label:"Lời chúc",        value: stats.totalWishes,  icon:"💬", color:"#F0FDF4" },
    { label:"RSVP nhận được",  value: stats.totalRsvps,   icon:"✅", color:"#FEFCE8" },
  ] : [];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      {err && (
        <div style={{ background:"#FFF1F2", border:`1px solid #FFE4E6`, borderRadius:12,
          padding:"14px 20px", fontSize:13, color:C.red }}>
          ⚠️ {err}
        </div>
      )}
      {loading ? <Spinner /> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {CARDS.map(s => (
            <div key={s.label} style={{ ...card, padding:20, background:s.color }}>
              <div style={{ fontSize:24, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:28, fontWeight:800, color:C.text, letterSpacing:"-0.04em" }}>
                {s.value.toLocaleString()}
              </div>
              <div style={{ fontSize:12, color:C.textMid, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ ...card, padding:24 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:8 }}>Hướng dẫn bắt đầu</div>
        <div style={{ fontSize:13, color:C.textMid, lineHeight:1.8 }}>
          Database đang trống. Hãy bắt đầu bằng cách:<br/>
          1. Tạo <b>Gói dịch vụ</b> (tab Gói dịch vụ) → VD: Free, Pro, Premium<br/>
          2. Tạo <b>Mẫu thiệp</b> (tab Mẫu thiệp) → thêm các template cho user chọn<br/>
          3. Người dùng sẽ tự đăng ký qua frontend và xuất hiện ở tab <b>Người dùng</b>
        </div>
      </div>
    </div>
  );
}

// ── Users Page ───────────────────────────────────────────────────────────────
function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    apiFetch("/users").then(setUsers).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(u =>
    (u.fullName ?? "").toLowerCase().includes(q.toLowerCase()) ||
    (u.email ?? "").toLowerCase().includes(q.toLowerCase())
  );

  const toggleStatus = async (u: UserRow) => {
    const next = u.status === "active" ? "suspended" : "active";
    await apiFetch(`/users/${u.id}/status`, { method:"PATCH", body: JSON.stringify({ status: next }) });
    load();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Xóa người dùng này?")) return;
    await apiFetch(`/users/${id}`, { method:"DELETE" });
    load();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:C.text }}>Người dùng</div>
          <div style={{ fontSize:11, color:C.textLight, marginTop:2 }}>{users.length} tài khoản</div>
        </div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm kiếm…"
          style={{ fontSize:12, padding:"7px 14px", border:`1px solid ${C.border}`,
            borderRadius:8, outline:"none", color:C.text, width:200 }} />
      </div>
      <div style={{ ...card, overflow:"hidden" }}>
        {loading ? <Spinner /> : filtered.length === 0 ? <Empty label="Chưa có người dùng nào" /> : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <Th>Họ tên</Th><Th>Gói</Th><Th>Thiệp</Th><Th>Đăng nhập</Th>
              <Th>Ngày tạo</Th><Th>Trạng thái</Th><Th></Th>
            </tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ background:C.white }}>
                  <Td>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
                        background:"linear-gradient(135deg,#FDE68A,#FCA5A5)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:12, fontWeight:800, color:C.goldDark }}>
                        {(u.fullName ?? u.email ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight:600 }}>{u.fullName ?? "(chưa đặt tên)"}</div>
                        <div style={{ fontSize:11, color:C.textLight }}>{u.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{u.currentPlan?.name ?? <span style={{ color:C.textLight }}>—</span>}</Td>
                  <Td>{u._count.cards}</Td>
                  <Td>{u.authProvider}</Td>
                  <Td>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</Td>
                  <Td><StatusDot status={u.status} /></Td>
                  <Td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button style={btn("outline")} onClick={() => toggleStatus(u)}>
                        {u.status === "active" ? "Khóa" : "Mở khóa"}
                      </button>
                      <button style={btn("danger")} onClick={() => deleteUser(u.id)}>Xóa</button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Templates Page ───────────────────────────────────────────────────────────
function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch("/templates").then(setTemplates).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleStatus = async (t: TemplateRow) => {
    const next = t.status === "published" ? "draft" : "published";
    await apiFetch(`/templates/${t.id}`, { method:"PATCH", body: JSON.stringify({ status: next }) });
    load();
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Xóa mẫu thiệp này?")) return;
    await apiFetch(`/templates/${id}`, { method:"DELETE" });
    load();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {showCreate && <CreateTemplateModal onClose={() => setShowCreate(false)} onCreated={load} />}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:C.text }}>Mẫu thiệp</div>
          <div style={{ fontSize:11, color:C.textLight, marginTop:2 }}>{templates.length} mẫu</div>
        </div>
        <button style={btn("primary")} onClick={() => setShowCreate(true)}>+ Tạo mẫu mới</button>
      </div>
      <div style={{ ...card, overflow:"hidden" }}>
        {loading ? <Spinner /> : templates.length === 0 ? <Empty label="Chưa có mẫu thiệp nào. Hãy tạo mẫu đầu tiên!" /> : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <Th>Tên mẫu</Th><Th>Danh mục</Th><Th>Gói yêu cầu</Th>
              <Th>Lượt dùng</Th><Th>Ngày tạo</Th><Th>Trạng thái</Th><Th></Th>
            </tr></thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.id}>
                  <Td>
                    <div style={{ fontWeight:600 }}>{t.name}</div>
                    <div style={{ fontSize:10, color:C.textLight, fontFamily:"monospace" }}>{t.slug}</div>
                  </Td>
                  <Td>{t.category?.name ?? <span style={{ color:C.textLight }}>—</span>}</Td>
                  <Td>{t.requiredPlan?.name ?? <span style={{ color:C.textLight }}>Free</span>}</Td>
                  <Td>{t.useCount.toLocaleString()}</Td>
                  <Td>{new Date(t.createdAt).toLocaleDateString("vi-VN")}</Td>
                  <Td><StatusDot status={t.status} /></Td>
                  <Td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button style={btn("ghost")} onClick={() => toggleStatus(t)}>
                        {t.status === "published" ? "Ẩn" : "Xuất bản"}
                      </button>
                      <button style={btn("danger")} onClick={() => deleteTemplate(t.id)}>Xóa</button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Cards Page ───────────────────────────────────────────────────────────────
function CardsPage() {
  const [cards, setCards] = useState<CardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/cards").then(setCards).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <div style={{ fontSize:16, fontWeight:700, color:C.text }}>Thiệp cưới</div>
        <div style={{ fontSize:11, color:C.textLight, marginTop:2 }}>{cards.length} thiệp đã tạo</div>
      </div>
      <div style={{ ...card, overflow:"hidden" }}>
        {loading ? <Spinner /> : cards.length === 0 ? <Empty label="Chưa có thiệp nào được tạo" /> : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <Th>Tiêu đề</Th><Th>Cô dâu / Chú rể</Th><Th>Chủ sở hữu</Th>
              <Th>Mẫu</Th><Th>Lượt xem</Th><Th>RSVP</Th><Th>Trạng thái</Th>
            </tr></thead>
            <tbody>
              {cards.map(c => (
                <tr key={c.id}>
                  <Td>
                    <div style={{ fontWeight:600 }}>{c.title}</div>
                    <div style={{ fontSize:10, color:C.textLight, fontFamily:"monospace" }}>{c.slug}</div>
                  </Td>
                  <Td>{[c.brideName, c.groomName].filter(Boolean).join(" & ") || "—"}</Td>
                  <Td>
                    <div>{c.user?.fullName ?? "—"}</div>
                    <div style={{ fontSize:10, color:C.textLight }}>{c.user?.email}</div>
                  </Td>
                  <Td>{c.template?.name ?? <span style={{ color:C.textLight }}>Trang trắng</span>}</Td>
                  <Td>{c.viewCount}</Td>
                  <Td>{c._count.rsvps}</Td>
                  <Td><StatusDot status={c.status} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Wishes Page ──────────────────────────────────────────────────────────────
function WishesPage() {
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch("/wishes").then(setWishes).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (w: WishRow, key: "isApproved"|"isHidden") => {
    await apiFetch(`/wishes/${w.id}`, {
      method:"PATCH",
      body: JSON.stringify({ [key]: !w[key] }),
    });
    load();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <div style={{ fontSize:16, fontWeight:700, color:C.text }}>Lời chúc</div>
        <div style={{ fontSize:11, color:C.textLight, marginTop:2 }}>{wishes.length} lời chúc</div>
      </div>
      <div style={{ ...card, overflow:"hidden" }}>
        {loading ? <Spinner /> : wishes.length === 0 ? <Empty label="Chưa có lời chúc nào" /> : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <Th>Người gửi</Th><Th>Nội dung</Th><Th>Thiệp</Th><Th>Ngày</Th><Th>Duyệt</Th><Th></Th>
            </tr></thead>
            <tbody>
              {wishes.map(w => (
                <tr key={w.id}>
                  <Td><span style={{ fontWeight:600 }}>{w.displayName}</span></Td>
                  <Td>
                    <div style={{ maxWidth:280, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {w.message}
                    </div>
                  </Td>
                  <Td>{w.card?.title ?? "—"}</Td>
                  <Td>{new Date(w.createdAt).toLocaleDateString("vi-VN")}</Td>
                  <Td>
                    <span style={{
                      fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20,
                      background: w.isApproved ? "#D1FAE5" : "#FEF3C7",
                      color:      w.isApproved ? "#065F46" : C.goldDark,
                    }}>
                      {w.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </Td>
                  <Td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button style={btn("ghost")} onClick={() => toggle(w, "isApproved")}>
                        {w.isApproved ? "Bỏ duyệt" : "Duyệt"}
                      </button>
                      <button style={btn("outline")} onClick={() => toggle(w, "isHidden")}>
                        {w.isHidden ? "Hiện" : "Ẩn"}
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Plans Page ───────────────────────────────────────────────────────────────
function PlansPage() {
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch("/plans").then(setPlans).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleActive = async (p: PlanRow) => {
    await apiFetch(`/plans/${p.id}`, { method:"PATCH", body: JSON.stringify({ isActive: !p.isActive }) });
    load();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {showCreate && <CreatePlanModal onClose={() => setShowCreate(false)} onCreated={load} />}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:C.text }}>Gói dịch vụ</div>
          <div style={{ fontSize:11, color:C.textLight, marginTop:2 }}>{plans.length} gói</div>
        </div>
        <button style={btn("primary")} onClick={() => setShowCreate(true)}>+ Tạo gói mới</button>
      </div>
      <div style={{ ...card, overflow:"hidden" }}>
        {loading ? <Spinner /> : plans.length === 0 ? <Empty label="Chưa có gói nào. Hãy tạo gói Free trước!" /> : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <Th>Tên gói</Th><Th>Giá</Th><Th>Thời hạn</Th><Th>Thiệp tối đa</Th>
              <Th>Số người dùng</Th><Th>Trạng thái</Th><Th></Th>
            </tr></thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id}>
                  <Td><span style={{ fontWeight:700 }}>{p.name}</span></Td>
                  <Td>{parseFloat(p.price) === 0 ? "Miễn phí" : `₫${parseInt(p.price).toLocaleString("vi-VN")}`}</Td>
                  <Td>{p.durationDays ? `${p.durationDays} ngày` : "Vĩnh viễn"}</Td>
                  <Td>{p.maxCards ?? "Không giới hạn"}</Td>
                  <Td>{p._count.users}</Td>
                  <Td>
                    <span style={{
                      fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20,
                      background: p.isActive ? "#D1FAE5" : "#F3F4F6",
                      color:      p.isActive ? "#065F46" : "#6B7280",
                    }}>
                      {p.isActive ? "Đang hoạt động" : "Tắt"}
                    </span>
                  </Td>
                  <Td>
                    <button style={btn("outline")} onClick={() => toggleActive(p)}>
                      {p.isActive ? "Tắt gói" : "Bật gói"}
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [page, setPage] = useState<Page>("dashboard");

  const NAV: { id: Page; label: string; icon: string }[] = [
    { id:"dashboard", label:"Tổng quan",    icon:"◫"  },
    { id:"users",     label:"Người dùng",   icon:"👥" },
    { id:"templates", label:"Mẫu thiệp",    icon:"💌" },
    { id:"cards",     label:"Thiệp cưới",   icon:"📄" },
    { id:"wishes",    label:"Lời chúc",     icon:"💬" },
    { id:"plans",     label:"Gói dịch vụ",  icon:"💎" },
  ];

  const PAGE_MAP: Record<Page, React.ReactElement> = {
    dashboard: <DashboardPage />,
    users:     <UsersPage />,
    templates: <TemplatesPage />,
    cards:     <CardsPage />,
    wishes:    <WishesPage />,
    plans:     <PlansPage />,
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      display:"flex",
      fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",
      fontSize:14, lineHeight:1.6, color:C.text,
      background:C.bg, textAlign:"left",
    }}>
      {/* Sidebar */}
      <aside style={{
        width:220, flexShrink:0,
        background:C.white, borderRight:`1px solid ${C.border}`,
        display:"flex", flexDirection:"column", height:"100%", overflowY:"auto",
      }}>
        {/* Logo */}
        <div style={{ padding:"20px 18px 16px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:34, height:34, borderRadius:10, flexShrink:0,
              background:"linear-gradient(135deg,#C9A96E,#e8c98a)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:17,
            }}>💍</div>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:C.text, letterSpacing:"-0.02em" }}>WeddingCraft</div>
              <div style={{ fontSize:10, color:C.textLight }}>Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding:"10px 8px", flex:1 }}>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                display:"flex", alignItems:"center", gap:9,
                width:"100%", padding:"9px 12px", marginBottom:1,
                borderRadius:9, border:"none", cursor:"pointer",
                background: active ? C.goldLight : "transparent",
                color:      active ? C.goldDark  : C.textMid,
                fontSize:13, fontWeight: active ? 700 : 400,
                textAlign:"left",
              }}>
                <span style={{ fontSize:15 }}>{n.icon}</span>
                {n.label}
                {active && <span style={{ marginLeft:"auto", width:5, height:5,
                  borderRadius:"50%", background:C.gold }} />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
              background:"linear-gradient(135deg,#FDE68A,#FCA5A5)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:800, color:C.goldDark }}>A</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:C.text }}>Admin</div>
              <div style={{ fontSize:10, color:C.textLight }}>localhost:3000</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <header style={{
          background:C.white, borderBottom:`1px solid ${C.border}`,
          padding:"12px 24px", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.text }}>
              {NAV.find(n=>n.id===page)?.label}
            </div>
            <div style={{ fontSize:10, color:C.textLight }}>WeddingCraft Admin · {new Date().toLocaleDateString("vi-VN")}</div>
          </div>
          <div style={{ fontSize:11, color:C.textLight, background:C.stone100,
            padding:"5px 12px", borderRadius:20 }}>
            API: {API}
          </div>
        </header>

        {/* Content */}
        <main style={{ flex:1, overflowY:"auto", padding:24 }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            {PAGE_MAP[page]}
          </div>
        </main>
      </div>
    </div>
  );
}