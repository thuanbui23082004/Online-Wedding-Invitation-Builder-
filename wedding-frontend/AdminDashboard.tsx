import React, { useState, useEffect, useCallback } from "react";

// ── Config ─────────────────────────────────────────────────────────────────
const API = "http://localhost:3000/admin";

// ── Tokens ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#F7F5F2", white: "#FFFFFF", border: "#F0EDE8",
  gold: "#C9A96E", goldLight: "#FEF3C7", goldDark: "#92400E",
  text: "#1C1917", textMid: "#78716C", textLight: "#A8A29E",
  green: "#10B981", amber: "#F59E0B", red: "#F43F5E",
  stone50: "#FAFAF8", stone100: "#F1EDE6",
};

const btn = (variant: "primary" | "ghost" | "outline" | "danger"): React.CSSProperties => ({
  border: "none", borderRadius: 10, cursor: "pointer",
  fontSize: 13, fontWeight: 600, transition: "opacity 0.15s",
  ...(variant === "primary" && { background: C.gold,      color: "#fff",      padding: "8px 18px" }),
  ...(variant === "ghost"   && { background: C.goldLight, color: C.goldDark,  padding: "8px 16px" }),
  ...(variant === "outline" && { background: "transparent", border: `1px solid ${C.border}`, color: C.textMid, padding: "7px 14px" }),
  ...(variant === "danger"  && { background: "#FFF1F2",   color: C.red,       padding: "7px 14px", border: `1px solid #FFE4E6` }),
});

const card: React.CSSProperties = {
  background: C.white, borderRadius: 16,
  border: `1px solid ${C.border}`,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

type Page = "dashboard" | "users" | "templates" | "cards" | "plans";

// ── Helpers ────────────────────────────────────────────────────────────────
async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function PlanBadge({ name }: { name?: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Free:    { bg: "#F3F4F6", color: "#6B7280" },
    Pro:     { bg: "#EFF6FF", color: "#1D4ED8" },
    Premium: { bg: "#FFFBEB", color: "#92400E" },
  };
  const s = map[name ?? "Free"] ?? { bg: "#F3F4F6", color: "#6B7280" };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
      {name ?? "Free"}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, { dot: string; label: string }> = {
    active:    { dot: C.green,   label: "Hoạt động" },
    inactive:  { dot: "#9CA3AF", label: "Không HĐ" },
    suspended: { dot: C.red,     label: "Bị khoá" },
    unverified:{ dot: C.amber,   label: "Chưa xác thực" },
    published: { dot: C.green,   label: "Đã xuất bản" },
    draft:     { dot: C.amber,   label: "Bản nháp" },
    archived:  { dot: "#9CA3AF", label: "Lưu trữ" },
  };
  const { dot, label } = map[status] ?? { dot: "#9CA3AF", label: status };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: C.textMid }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, display: "inline-block" }} />
      {label}
    </span>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: `3px solid ${C.stone100}`,
        borderTopColor: C.gold,
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: C.textLight }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>💌</div>
      <div style={{ fontSize: 14 }}>{label}</div>
    </div>
  );
}

// ── Modal thêm/sửa ─────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.4)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ ...card, width: 480, maxHeight: "90vh", overflow: "auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{title}</div>
          <button onClick={onClose} style={{ ...btn("outline"), padding: "4px 10px" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.textMid, display: "block", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", fontSize: 13, background: C.stone50,
  border: `1px solid ${C.border}`, borderRadius: 8,
  padding: "8px 12px", outline: "none", color: C.text,
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

// ── Dashboard Page ──────────────────────────────────────────────────────────
function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [views, setViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiFetch("/stats"), apiFetch("/stats/views-chart")])
      .then(([s, v]) => { setStats(s); setViews(v); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const statCards = [
    { label: "Tổng người dùng",  value: stats?.totalUsers   ?? 0, icon: "👥", sub: `+${stats?.newUsers ?? 0} tháng này` },
    { label: "Thiệp đã tạo",     value: stats?.totalCards   ?? 0, icon: "💌", sub: `+${stats?.newCards ?? 0} tháng này` },
    { label: "Mẫu thiệp",        value: stats?.totalTemplates ?? 0, icon: "🎨", sub: "trong thư viện" },
    { label: "Lượt xem",         value: stats?.totalViews   ?? 0, icon: "👁️", sub: "tổng tất cả thiệp" },
  ];

  const maxView = Math.max(...views.map((v: any) => v.count), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ ...card, padding: 20 }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: "-0.03em" }}>
              {s.value.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: C.textLight, marginTop: 3 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: C.gold, marginTop: 4, fontWeight: 600 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Views chart */}
      <div style={{ ...card, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Lượt xem thiệp — 7 ngày qua</div>
        <div style={{ fontSize: 11, color: C.textLight, marginBottom: 20 }}>Dữ liệu thật từ database</div>
        {views.length === 0 ? (
          <Empty label="Chưa có lượt xem nào" />
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
            {views.map((v: any, i: number) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                  <div style={{
                    width: "100%", borderRadius: "4px 4px 0 0",
                    height: `${Math.max((v.count / maxView) * 100, 4)}%`,
                    background: i === views.length - 1
                      ? "linear-gradient(to top,#C9A96E,#e8c98a)"
                      : C.stone100,
                  }} />
                </div>
                <span style={{ fontSize: 10, color: C.textLight }}>{v.date}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: C.text }}>{v.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty state hint */}
      {stats?.totalUsers === 0 && (
        <div style={{ ...card, padding: 24, textAlign: "center", borderStyle: "dashed" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🚀</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>Database đang trống</div>
          <div style={{ fontSize: 12, color: C.textLight }}>
            Thêm dữ liệu từ các tab Người dùng, Mẫu thiệp, Gói dịch vụ
          </div>
        </div>
      )}
    </div>
  );
}

// ── Users Page ──────────────────────────────────────────────────────────────
function UsersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", role: "user", status: "active" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch(`/users?page=${page}&limit=20&search=${search}`)
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await apiFetch("/users", { method: "POST", body: JSON.stringify(form) });
      setShowModal(false);
      setForm({ fullName: "", email: "", phone: "", role: "user", status: "active" });
      load();
    } catch (e: any) {
      alert("Lỗi: " + e.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xoá người dùng "${name}"?`)) return;
    try { await apiFetch(`/users/${id}`, { method: "DELETE" }); load(); }
    catch (e: any) { alert("Lỗi: " + e.message); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Người dùng</div>
          <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>
            {data?.total ?? 0} tài khoản trong database
          </div>
        </div>
        <button style={btn("primary")} onClick={() => setShowModal(true)}>+ Thêm người dùng</button>
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.stone50}`, display: "flex", gap: 10 }}>
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm kiếm tên hoặc email…"
            style={{ ...inputStyle, maxWidth: 280 }}
          />
        </div>

        {loading ? <Spinner /> : data?.users?.length === 0 ? (
          <Empty label="Chưa có người dùng nào. Nhấn + Thêm người dùng để bắt đầu." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.stone50}` }}>
                {["Họ tên", "Gói", "Thiệp đã tạo", "Ngày tham gia", "Trạng thái", ""].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.users?.map((u: any, i: number) => (
                <tr key={u.id} style={{ borderBottom: i < data.users.length - 1 ? `1px solid ${C.stone50}` : "none" }}>
                  <td style={{ padding: "12px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg,#FDE68A,#FCA5A5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 800, color: C.goldDark,
                      }}>{(u.fullName ?? u.email ?? "?").charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{u.fullName ?? "(Chưa có tên)"}</div>
                        <div style={{ fontSize: 11, color: C.textLight }}>{u.email ?? u.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 20px" }}><PlanBadge name={u.currentPlan?.name} /></td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: C.textMid }}>{u._count?.cards ?? 0}</td>
                  <td style={{ padding: "12px 20px", fontSize: 12, color: C.textLight }}>
                    {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={{ padding: "12px 20px" }}><StatusDot status={u.status} /></td>
                  <td style={{ padding: "12px 20px" }}>
                    <button style={{ ...btn("danger"), fontSize: 12 }} onClick={() => handleDelete(u.id, u.fullName ?? u.email)}>Xoá</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16, borderTop: `1px solid ${C.stone50}` }}>
            {Array.from({ length: data.totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} style={{
                ...btn(page === i + 1 ? "ghost" : "outline"), padding: "4px 12px",
              }}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Thêm người dùng mới" onClose={() => setShowModal(false)}>
          <Field label="Họ tên *">
            <input style={inputStyle} value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Nguyễn Văn A" />
          </Field>
          <Field label="Email *">
            <input style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" type="email" />
          </Field>
          <Field label="Số điện thoại">
            <input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0901234567" />
          </Field>
          <Field label="Vai trò">
            <select style={selectStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
          <Field label="Trạng thái">
            <select style={selectStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">Hoạt động</option>
              <option value="unverified">Chưa xác thực</option>
              <option value="suspended">Bị khoá</option>
            </select>
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button style={{ ...btn("outline"), flex: 1 }} onClick={() => setShowModal(false)}>Huỷ</button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={handleCreate} disabled={saving}>
              {saving ? "Đang lưu…" : "Tạo người dùng"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Templates Page ──────────────────────────────────────────────────────────
function TemplatesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", thumbnailUrl: "", isPremium: false, status: "draft" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const q = filter ? `&status=${filter}` : "";
    apiFetch(`/templates?page=1&limit=50${q}`)
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.name || !form.slug) return alert("Vui lòng nhập tên và slug");
    setSaving(true);
    try {
      await apiFetch("/templates", { method: "POST", body: JSON.stringify(form) });
      setShowModal(false);
      setForm({ name: "", slug: "", thumbnailUrl: "", isPremium: false, status: "draft" });
      load();
    } catch (e: any) { alert("Lỗi: " + e.message); }
    finally { setSaving(false); }
  };

  const handlePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try { await apiFetch(`/templates/${id}`, { method: "PUT", body: JSON.stringify({ status: newStatus }) }); load(); }
    catch (e: any) { alert("Lỗi: " + e.message); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xoá mẫu "${name}"?`)) return;
    try { await apiFetch(`/templates/${id}`, { method: "DELETE" }); load(); }
    catch (e: any) { alert("Lỗi: " + e.message); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Mẫu thiệp</div>
          <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{data?.total ?? 0} mẫu trong database</div>
        </div>
        <button style={btn("primary")} onClick={() => setShowModal(true)}>+ Tạo mẫu mới</button>
      </div>

      <div style={{ display: "flex", gap: 4, background: "#EEEBE6", borderRadius: 12, padding: 4, width: "fit-content" }}>
        {[["", "Tất cả"], ["published", "Đã xuất bản"], ["draft", "Bản nháp"], ["archived", "Lưu trữ"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            fontSize: 13, fontWeight: 600, padding: "6px 16px", borderRadius: 9,
            border: "none", cursor: "pointer",
            background: filter === v ? C.white : "transparent",
            color: filter === v ? C.text : C.textMid,
            boxShadow: filter === v ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}>{l}</button>
        ))}
      </div>

      {loading ? <Spinner /> : data?.templates?.length === 0 ? (
        <div style={{ ...card, padding: 0 }}><Empty label="Chưa có mẫu thiệp. Nhấn + Tạo mẫu mới để bắt đầu." /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {data?.templates?.map((t: any) => (
            <div key={t.id} style={{ ...card, overflow: "hidden" }}>
              <div style={{
                height: 120, background: "linear-gradient(135deg,#FDE8E8,#FEF3C7,#F7F5F2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 40, position: "relative",
              }}>
                {t.thumbnailUrl
                  ? <img src={t.thumbnailUrl} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : "🎨"}
                <div style={{ position: "absolute", top: 10, right: 10 }}><StatusDot status={t.status} /></div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.name}</div>
                  {t.isPremium && <span style={{ fontSize: 10, background: C.goldLight, color: C.goldDark, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>Premium</span>}
                </div>
                <div style={{ fontSize: 11, color: C.textLight, marginBottom: 4 }}>/{t.slug}</div>
                <div style={{ fontSize: 11, color: C.textLight, marginBottom: 14 }}>
                  {t._count?.cards ?? 0} thiệp đang dùng · {t.useCount} lượt chọn
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...btn("ghost"), flex: 1, fontSize: 12 }}
                    onClick={() => handlePublish(t.id, t.status)}>
                    {t.status === "published" ? "Gỡ xuất bản" : "Xuất bản"}
                  </button>
                  <button style={{ ...btn("danger"), fontSize: 12 }} onClick={() => handleDelete(t.id, t.name)}>Xoá</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Tạo mẫu thiệp mới" onClose={() => setShowModal(false)}>
          <Field label="Tên mẫu *">
            <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VD: Bạch Hoa Đình" />
          </Field>
          <Field label="Slug * (dùng cho URL)">
            <input style={inputStyle} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="bach-hoa-dinh" />
          </Field>
          <Field label="URL ảnh thumbnail">
            <input style={inputStyle} value={form.thumbnailUrl} onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Trạng thái">
            <select style={selectStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản ngay</option>
            </select>
          </Field>
          <Field label="Loại">
            <select style={selectStyle} value={form.isPremium ? "true" : "false"} onChange={e => setForm({ ...form, isPremium: e.target.value === "true" })}>
              <option value="false">Miễn phí</option>
              <option value="true">Premium</option>
            </select>
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button style={{ ...btn("outline"), flex: 1 }} onClick={() => setShowModal(false)}>Huỷ</button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={handleCreate} disabled={saving}>
              {saving ? "Đang lưu…" : "Tạo mẫu"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Cards Page ──────────────────────────────────────────────────────────────
function CardsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/cards?page=1&limit=50")
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Thiệp cưới</div>
        <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{data?.total ?? 0} thiệp trong database</div>
      </div>
      <div style={{ ...card, overflow: "hidden" }}>
        {loading ? <Spinner /> : data?.cards?.length === 0 ? (
          <Empty label="Chưa có thiệp nào được tạo." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.stone50}` }}>
                {["Tên thiệp", "Cô dâu & Chú rể", "Người tạo", "Mẫu dùng", "Lượt xem", "Ngày tạo", "Trạng thái"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.cards?.map((c: any, i: number) => (
                <tr key={c.id} style={{ borderBottom: i < data.cards.length - 1 ? `1px solid ${C.stone50}` : "none" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: C.text }}>{c.title}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMid }}>
                    {c.brideName && c.groomName ? `${c.brideName} & ${c.groomName}` : "(Chưa đặt tên)"}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMid }}>{c.user?.fullName ?? c.user?.email ?? "?"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMid }}>{c.template?.name ?? "(Trang trắng)"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: C.text }}>{c.viewCount}</td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: C.textLight }}>{new Date(c.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td style={{ padding: "12px 16px" }}><StatusDot status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Plans Page ──────────────────────────────────────────────────────────────
function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", price: "0", durationDays: "", maxCards: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    apiFetch("/plans").then(setPlans).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name) return alert("Vui lòng nhập tên gói");
    setSaving(true);
    try {
      await apiFetch("/plans", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price) || 0,
          durationDays: form.durationDays ? parseInt(form.durationDays) : undefined,
          maxCards: form.maxCards ? parseInt(form.maxCards) : undefined,
        }),
      });
      setShowModal(false);
      setForm({ name: "", price: "0", durationDays: "", maxCards: "" });
      load();
    } catch (e: any) { alert("Lỗi: " + e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xoá gói "${name}"? Người dùng đang dùng gói này sẽ bị ảnh hưởng.`)) return;
    try { await apiFetch(`/plans/${id}`, { method: "DELETE" }); load(); }
    catch (e: any) { alert("Lỗi: " + e.message); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Gói dịch vụ</div>
          <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{plans.length} gói trong database</div>
        </div>
        <button style={btn("primary")} onClick={() => setShowModal(true)}>+ Thêm gói mới</button>
      </div>

      {loading ? <Spinner /> : plans.length === 0 ? (
        <div style={{ ...card, padding: 0 }}><Empty label="Chưa có gói dịch vụ. Nhấn + Thêm gói mới để bắt đầu." /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {plans.map(p => (
            <div key={p.id} style={{ ...card, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{p.name}</div>
                <PlanBadge name={p.name} />
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.gold, marginBottom: 4 }}>
                {parseFloat(p.price) === 0 ? "Miễn phí" : `₫${parseFloat(p.price).toLocaleString()}`}
              </div>
              <div style={{ fontSize: 12, color: C.textLight, marginBottom: 16 }}>
                {p.durationDays ? `${p.durationDays} ngày` : "Vĩnh viễn"} ·{" "}
                {p.maxCards ? `${p.maxCards} thiệp` : "Không giới hạn thiệp"}
              </div>
              <div style={{ fontSize: 12, color: C.textMid, marginBottom: 16 }}>
                👥 {p._count?.users ?? 0} người dùng đang dùng
              </div>
              <button style={{ ...btn("danger"), width: "100%", fontSize: 12 }}
                onClick={() => handleDelete(p.id, p.name)}>
                Xoá gói
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Thêm gói dịch vụ mới" onClose={() => setShowModal(false)}>
          <Field label="Tên gói *">
            <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VD: Free, Pro, Premium" />
          </Field>
          <Field label="Giá (VND)">
            <input style={inputStyle} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0 = miễn phí" />
          </Field>
          <Field label="Thời hạn (ngày, để trống = vĩnh viễn)">
            <input style={inputStyle} type="number" value={form.durationDays} onChange={e => setForm({ ...form, durationDays: e.target.value })} placeholder="VD: 30, 365" />
          </Field>
          <Field label="Số thiệp tối đa (để trống = không giới hạn)">
            <input style={inputStyle} type="number" value={form.maxCards} onChange={e => setForm({ ...form, maxCards: e.target.value })} placeholder="VD: 3, 10" />
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button style={{ ...btn("outline"), flex: 1 }} onClick={() => setShowModal(false)}>Huỷ</button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={handleCreate} disabled={saving}>
              {saving ? "Đang lưu…" : "Tạo gói"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Root ────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [page, setPage] = useState<Page>("dashboard");

  const NAV: { id: Page; label: string; icon: string }[] = [
    { id: "dashboard", label: "Tổng quan",    icon: "◫"  },
    { id: "users",     label: "Người dùng",   icon: "👥" },
    { id: "templates", label: "Mẫu thiệp",    icon: "🎨" },
    { id: "cards",     label: "Thiệp cưới",   icon: "💌" },
    { id: "plans",     label: "Gói dịch vụ",  icon: "💎" },
  ];

  const PAGE_MAP: Record<Page, React.ReactElement> = {
    dashboard: <DashboardPage />,
    users:     <UsersPage />,
    templates: <TemplatesPage />,
    cards:     <CardsPage />,
    plans:     <PlansPage />,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex",
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      fontSize: 14, lineHeight: 1.6, color: C.text,
      background: C.bg, textAlign: "left",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: C.white, borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", height: "100%", overflowY: "auto",
      }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg,#C9A96E,#e8c98a)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>💍</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>WeddingCraft</div>
              <div style={{ fontSize: 10, color: C.textLight }}>Admin Dashboard</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "10px 10px", flex: 1 }}>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "10px 12px", marginBottom: 2,
                borderRadius: 10, border: "none", cursor: "pointer",
                background: active ? C.goldLight : "transparent",
                color: active ? C.goldDark : C.textMid,
                fontSize: 13, fontWeight: active ? 700 : 400,
                textAlign: "left",
              }}>
                <span style={{ fontSize: 16 }}>{n.icon}</span>
                {n.label}
                {active && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.gold }} />}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "14px 18px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg,#FDE68A,#FCA5A5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: C.goldDark,
            }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Admin</div>
              <div style={{ fontSize: 10, color: C.textLight }}>admin@weddingcraft.vn</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{
          background: C.white, borderBottom: `1px solid ${C.border}`,
          padding: "14px 28px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
              {NAV.find(n => n.id === page)?.label}
            </div>
            <div style={{ fontSize: 11, color: C.textLight, marginTop: 1 }}>
              Kết nối · PostgreSQL · Prisma
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.green, fontWeight: 600,
            background: "#D1FAE5", padding: "5px 12px", borderRadius: 20 }}>
            ● Đã kết nối database
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            {PAGE_MAP[page]}
          </div>
        </main>
      </div>
    </div>
  );
}