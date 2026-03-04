import React, { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown, MoreHorizontal, Trash2, User, Edit2, Eye } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Dashboard.jsx
 * Self-contained Dashboard with chart + user-management table (static data).
 *
 * Notes:
 * - Uses TailwindCSS classes everywhere.
 * - Ensure recharts & lucide-react are installed.
 */

/* -------------------------
   Sample chart data
   ------------------------- */
const chartData = [
  { name: "Jan", visitors: 400 },
  { name: "Feb", visitors: 300 },
  { name: "Mar", visitors: 600 },
  { name: "Apr", visitors: 800 },
  { name: "May", visitors: 500 },
  { name: "Jun", visitors: 900 },
];

/* -------------------------
   Sample static user data
   ------------------------- */
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    status: "Active",
    reviewer: "Alice",
    joined: "2025-01-10",
  },
  {
    id: 2,
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    status: "In Process",
    reviewer: "Bob",
    joined: "2025-01-12",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    status: "Active",
    reviewer: "Charlie",
    joined: "2025-02-05",
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    status: "Pending",
    reviewer: "Alice",
    joined: "2025-03-02",
  },
  {
    id: 5,
    name: "Carlos Ruiz",
    email: "carlos.ruiz@example.com",
    status: "Active",
    reviewer: "Bob",
    joined: "2025-03-18",
  },
  {
    id: 6,
    name: "Aisha Khan",
    email: "aisha.khan@example.com",
    status: "In Process",
    reviewer: "Charlie",
    joined: "2025-04-01",
  },
  {
    id: 7,
    name: "Liam O'Neil",
    email: "liam.oneil@example.com",
    status: "Active",
    reviewer: "Bob",
    joined: "2025-04-15",
  },
  {
    id: 8,
    name: "Eva Novak",
    email: "eva.novak@example.com",
    status: "Pending",
    reviewer: "Alice",
    joined: "2025-05-08",
  },
];

/* -------------------------
   Helper utilities
   ------------------------- */
const STATUS_STYLES = {
  Active: "bg-green-500/10 text-green-400",
  "In Process": "bg-orange-500/10 text-orange-400",
  Pending: "bg-yellow-500/10 text-yellow-400",
};

/* format date */
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/* compare values for sorting */
function compareValues(a, b, direction = "asc") {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  if (typeof a === "string" && typeof b === "string") {
    const res = a.localeCompare(b);
    return direction === "asc" ? res : -res;
  }
  return direction === "asc" ? (a > b ? 1 : -1) : a > b ? -1 : 1;
}

/* -------------------------
   Dashboard Component
   ------------------------- */
export default function Dashboard() {
  // Chart tab
  const [activeTab, setActiveTab] = useState("30");

  // Table states
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [reviewers] = useState(["Alice", "Bob", "Charlie", "Unassigned"]);
  const [bulkReviewer, setBulkReviewer] = useState("");

  /* -------- derived filtered & sorted users ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [users, query]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let aVal = a[sortBy.key];
      let bVal = b[sortBy.key];
      // if sorting by joined date, compare date objects
      if (sortBy.key === "joined") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = aVal?.toString() ?? "";
        bVal = bVal?.toString() ?? "";
      }
      return compareValues(aVal, bVal, sortBy.dir);
    });
    return arr;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  /* -------------- handlers ---------------- */
  function toggleSort(key) {
    setPage(1);
    setSortBy((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  }

  function toggleSelectAllOnPage() {
    const currentIds = paginated.map((u) => u.id);
    const allSelected = currentIds.every((id) => selectedIds.has(id));
    const newSet = new Set(selectedIds);
    if (allSelected) {
      currentIds.forEach((id) => newSet.delete(id));
    } else {
      currentIds.forEach((id) => newSet.add(id));
    }
    setSelectedIds(newSet);
  }

  function toggleSelect(id) {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  }

  function deleteUser(id) {
    if (!window.confirm("Delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    // also remove from selection
    setSelectedIds((s) => {
      const copy = new Set(s);
      copy.delete(id);
      return copy;
    });
  }

  function bulkDelete() {
    if (selectedIds.size === 0) return alert("Select some rows first.");
    if (!window.confirm("Delete selected users?")) return;
    setUsers((prev) => prev.filter((u) => !selectedIds.has(u.id)));
    setSelectedIds(new Set());
  }

  function assignReviewerToRow(id, reviewer) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, reviewer } : u)));
  }

  function bulkAssignReviewer() {
    if (selectedIds.size === 0) return alert("Select some rows first.");
    if (!bulkReviewer) return alert("Choose a reviewer to assign.");
    setUsers((prev) => prev.map((u) => (selectedIds.has(u.id) ? { ...u, reviewer: bulkReviewer } : u)));
    setBulkReviewer("");
    setSelectedIds(new Set());
  }

  function handleView(user) {
    alert(`View user: ${user.name}\nEmail: ${user.email}\nReviewer: ${user.reviewer}`);
  }

  function handleEdit(user) {
    const newName = prompt("Edit name", user.name);
    if (newName && newName.trim()) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, name: newName.trim() } : u)));
    }
  }

  /* -------------------------
     Render
     ------------------------- */
  return (
    <div className="space-y-8 p-4">
      {/* Top Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Users", value: "1,245", change: "+12.5%", type: "up", sub: "This month" },
          { title: "Revenue", value: "$24.3k", change: "-3.2%", type: "down", sub: "Last 30 days" },
          { title: "Orders", value: "342", change: "+8.1%", type: "up", sub: "This period" },
          { title: "Active", value: "98%", change: "+1.2%", type: "up", sub: "Engagement" },
        ].map((m, i) => (
          <div key={i} className="bg-[#111111] border border-white/10 rounded-2xl p-4 shadow-sm text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-gray-400 uppercase">{m.title}</div>
              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${m.type === "up" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {m.type === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{m.change}</span>
              </div>
            </div>

            <div className="text-2xl lg:text-3xl font-bold mb-2">{m.value}</div>
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <span>{m.sub}</span>
              <TrendingUp size={14} className="text-orange-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Visitors Chart Section */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 shadow text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Total Visitors</h3>
            <p className="text-gray-500 text-sm">Total for the selected range</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 lg:mt-0">
            {[
              { label: "Last 3 months", key: "90" },
              { label: "Last 30 days", key: "30" },
              { label: "Last 7 days", key: "7" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`px-3 py-1.5 rounded-md text-sm border transition ${activeTab === tab.key
                    ? "bg-white text-black"
                    : "bg-transparent border-white/10 text-gray-300"
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffa500" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ffa500" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#555" />
              <CartesianGrid stroke="#222" strokeDasharray="3 3" />
              <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #222" }} />
              <Area type="monotone" dataKey="visitors" stroke="#ffa500" fill="url(#visitorGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 shadow text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold">User Management</h3>
            <p className="text-gray-500 text-sm">Manage users, assign reviewers, and bulk actions</p>
          </div>

          {/* Bulk controls */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search name or email..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="flex-1 min-w-[140px] bg-white/3 placeholder-gray-400 text-sm px-3 py-2 rounded-md outline-none border border-white/8"
            />

            <select
              value={bulkReviewer}
              onChange={(e) => setBulkReviewer(e.target.value)}
              className="bg-white/3 text-sm px-2 py-2 rounded-md border border-white/8"
            >
              <option value="">Bulk assign reviewer</option>
              {reviewers.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>

            <button
              onClick={bulkAssignReviewer}
              className="px-3 py-2 bg-orange-600/90 text-white rounded-md text-sm hover:opacity-95"
            >
              Assign
            </button>

            <button
              onClick={bulkDelete}
              className="px-3 py-2 bg-red-600/80 text-white rounded-md text-sm hover:opacity-95 flex items-center gap-2"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-gray-400">
                <th className="px-3 py-2">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAllOnPage}
                    checked={paginated.every((u) => selectedIds.has(u.id)) && paginated.length > 0}
                    className="w-4 h-4"
                  />
                </th>

                <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort("name")}>
                  <div className="flex items-center gap-2">
                    Name
                    {sortBy.key === "name" ? (sortBy.dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort("email")}>
                  <div className="flex items-center gap-2">
                    Email
                    {sortBy.key === "email" ? (sortBy.dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort("status")}>
                  <div className="flex items-center gap-2">
                    Status
                    {sortBy.key === "status" ? (sortBy.dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="px-3 py-2">Reviewer</th>

                <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort("joined")}>
                  <div className="flex items-center gap-2">
                    Joined
                    {sortBy.key === "joined" ? (sortBy.dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/6">
              {paginated.map((u) => (
                <tr key={u.id} className="hover:bg-white/3">
                  <td className="px-3 py-3 align-middle">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(u.id)}
                      onChange={() => toggleSelect(u.id)}
                      className="w-4 h-4"
                    />
                  </td>

                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/6 flex items-center justify-center text-xs font-semibold">
                        {u.name[0]}
                      </div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 align-middle hidden">{/* placeholder if needed */}</td>

                  <td className="px-3 py-3 align-middle">
                    <div className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full ${STATUS_STYLES[u.status] || "bg-white/5 text-gray-300"}`}>
                      <span className="w-2 h-2 rounded-full block" />
                      {u.status}
                    </div>
                  </td>

                  <td className="px-3 py-3 align-middle">
                    <select
                      value={u.reviewer}
                      onChange={(e) => assignReviewerToRow(u.id, e.target.value)}
                      className="bg-transparent text-sm border border-white/6 px-2 py-1 rounded-md"
                    >
                      {reviewers.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>

                  <td className="px-3 py-3 align-middle">{formatDate(u.joined)}</td>

                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleView(u)} className="p-1 rounded-md hover:bg-white/5">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleEdit(u)} className="p-1 rounded-md hover:bg-white/5">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteUser(u.id)} className="p-1 rounded-md hover:bg-red-700/10 text-red-400">
                        <Trash2 size={14} />
                      </button>

                      {/* Dots menu (simple) */}
                      <div className="relative">
                        <button onClick={(e) => {
                          // toggle small contextual menu near the row
                          const menu = e.currentTarget.nextElementSibling;
                          if (!menu) return;
                          menu.classList.toggle("hidden");
                        }} className="p-1 rounded-md hover:bg-white/5">
                          <MoreHorizontal size={16} />
                        </button>

                        <div className="hidden absolute right-0 mt-1 w-40 bg-[#181818] border border-white/10 rounded-md shadow-lg z-20">
                          <button onClick={() => handleView(u)} className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 flex items-center gap-2">
                            <Eye size={14} /> View
                          </button>
                          <button onClick={() => handleEdit(u)} className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 flex items-center gap-2">
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => deleteUser(u.id)} className="w-full text-left px-3 py-2 text-sm hover:bg-red-700/10 text-red-400 flex items-center gap-2">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="text-gray-400 text-center sm:text-left">
            Showing <span className="text-white">{(page - 1) * PAGE_SIZE + 1}</span> -{" "}
            <span className="text-white">{Math.min(page * PAGE_SIZE, sorted.length)}</span> of{" "}
            <span className="text-white">{sorted.length}</span>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-white/3 disabled:opacity-30"
            >
              Prev
            </button>

            <div className="px-3 py-1 rounded-md bg-white/6 text-sm">
              Page {page} / {totalPages}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md bg-white/3 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
