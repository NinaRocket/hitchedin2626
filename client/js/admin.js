// document.getElementById("login-btn").addEventListener("click", async () => {
//   const password = document.getElementById("admin-password").value;
//   const msg = document.getElementById("admin-message");
//   const table = document.getElementById("rsvp-table-container");
//   const body = document.getElementById("rsvp-table-body");

//   const res = await fetch(`/rsvp/admin?password=${encodeURIComponent(password)}`);
//   const data = await res.json();

//   if (!res.ok) {
//     msg.textContent = "❌ Incorrect password!";
//     table.style.display = "none";
//     return;
//   }

//   msg.textContent = `✅ Showing ${data.length} RSVPs`;
//   table.style.display = "block";

//   body.innerHTML = ""; // clear it first

// data.forEach(rsvp => {
//   const row = document.createElement("tr");

//   // Apply a class if they’re NOT attending
//   if (rsvp.attending.toLowerCase() === "no") {
//     row.classList.add("not-attending");
//   }

//   row.innerHTML = `
//     <td>${rsvp.name}</td>
//     <td>${rsvp.attending}</td>
//     <td>${rsvp.guest || ""}</td>
//     <td>${rsvp.guestCount || ""}</td>
//     <td>${rsvp.notes || ""}</td>
//     <td>${new Date(rsvp.timestamp).toLocaleString()}</td>
//     <td class="actions">
//      <button class="btn-link danger" data-id="${rsvp._id}">Delete</button>
//      </td>
//   `;

//   body.appendChild(row);
// });
// // Event delegation for delete clicks
// document.getElementById("rsvp-table-body").addEventListener("click", async (e) => {
//   const btn = e.target.closest(".btn-link.danger");
//   if (!btn) return;

//   const id = btn.dataset.id;
//   if (!id) return;

//   const row = btn.closest("tr");
//   const name = row?.firstElementChild?.textContent?.trim() || "this RSVP";

//   if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

//   const res = await fetch(`/admin/${encodeURIComponent(id)}`, {
//     method: "DELETE"
//   });

//   if (res.ok) {
//     row.remove();
//     // update count text
//     const msg = document.getElementById("admin-message");
//     const remaining = document.querySelectorAll("#rsvp-table-body tr").length;
//     msg.textContent = `✅ Showing ${remaining} RSVPs`;
//   } else {
//     const { error } = await res.json().catch(() => ({ error: "Failed to delete" }));
//     alert(`❌ ${error || "Failed to delete"}`);
//   }
// });


// });

// client/js/admin.js

const loginBtn   = document.getElementById("login-btn");
const passInput  = document.getElementById("admin-password");
const msg        = document.getElementById("admin-message");
const tableWrap  = document.getElementById("rsvp-table-container");
const tbody      = document.getElementById("rsvp-table-body");

async function loadList(pw) {
  msg.textContent = "Loading...";
  tableWrap.style.display = "none";
  tbody.innerHTML = "";

  try {
    const res = await fetch(`/api/admin?password=${encodeURIComponent(pw)}`);
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

    // attending may be boolean OR "yes"/"no" string — normalize
    const attendingBool =
      typeof rsvp.attending === "boolean"
        ? rsvp.attending
        : String(rsvp.attending).toLowerCase() === "yes";

    if (!attendingBool) tr.classList.add("not-attending");

    const when = rsvp.createdAt || rsvp.timestamp;

    tr.innerHTML = `
      <td>${rsvp.name ?? ""}</td>
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

// Delete via event delegation (registered once)
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-link.danger");
  if (!btn) return;

  const id = btn.dataset.id;
  if (!id) return;

  const row = btn.closest("tr");
  const name = row?.firstElementChild?.textContent?.trim() || "this RSVP";
  const pw = passInput.value;

  if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

  try {
    const res = await fetch(`/api/admin/${encodeURIComponent(id)}?password=${encodeURIComponent(pw)}`, {
      method: "DELETE"
    });
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


