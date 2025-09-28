// client/js/admin.js
const isLocal =
  location.hostname === "localhost" || location.hostname.startsWith("127.");
const API_BASE = isLocal ? "/api" : "https://api.ninajohnny4ever.com/api";

const loginBtn  = document.getElementById("login-btn");
const passInput = document.getElementById("admin-password");
const msg       = document.getElementById("admin-message");
const tableWrap = document.getElementById("rsvp-table-container");
const tbody     = document.getElementById("rsvp-table-body");

async function loadList(pw) {
  msg.textContent = "Loading...";
  tableWrap.style.display = "none";
  tbody.innerHTML = "";

  try {
    // ✅ use API_BASE
    const res = await fetch(`${API_BASE}/admin?password=${encodeURIComponent(pw)}`);
    const data = await res.json().catch(() => null);

    if (!res.ok || !Array.isArray(data)) {
      msg.textContent = `❌ ${data?.error || `Auth failed (${res.status})`}`;
      return;
    }

    renderRows(data);
    msg.textContent = `✅ Showing ${data.length} RSVPs`;
    tableWrap.style.display = "block";
  } catch (e) {
    console.error(e);
    msg.textContent = "❌ Network error";
  }
}

function renderRows(rows) {
  for (const rsvp of rows) {
    const tr = document.createElement("tr");

    const attendingBool =
      typeof rsvp.attending === "boolean"
        ? rsvp.attending
        : String(rsvp.attending).toLowerCase() === "yes";

    if (!attendingBool) tr.classList.add("not-attending");

    const when = rsvp.createdAt || rsvp.timestamp;

    tr.innerHTML = `
      <td>${rsvp.name ?? ""}</td>
       <td>${rsvp.email ?? ""}</td>
      <td>${attendingBool ? "yes" : "no"}</td>
      <td>${rsvp.guest ?? ""}</td>
      <td>${rsvp.guestCount ?? ""}</td>
      <td>${rsvp.notes ?? ""}</td>
      <td>${when ? new Date(when).toLocaleString() : ""}</td>
      <td class="actions">
        <button class="btn-link danger" data-id="${rsvp._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

// ✅ proper DELETE with API_BASE and options INSIDE fetch()
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-link.danger");
  if (!btn) return;

  const id = btn.dataset.id;
  if (!id) return;

  const row  = btn.closest("tr");
  const name = row?.firstElementChild?.textContent?.trim() || "this RSVP";
  const pw   = passInput.value;

  if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

  try {
    const res = await fetch(
      `${API_BASE}/admin/${encodeURIComponent(id)}?password=${encodeURIComponent(pw)}`,
      { method: "DELETE" }
    );
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      alert(`❌ ${data?.error || `Delete failed (${res.status})`}`);
      return;
    }

    row.remove();
    msg.textContent = `✅ Showing ${document.querySelectorAll("#rsvp-table-body tr").length} RSVPs`;
  } catch (err) {
    console.error(err);
    alert("❌ Network error");
  }
});

loginBtn?.addEventListener("click", () => loadList(passInput.value));
