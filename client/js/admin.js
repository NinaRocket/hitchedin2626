document.getElementById("login-btn").addEventListener("click", async () => {
  const password = document.getElementById("admin-password").value;
  const msg = document.getElementById("admin-message");
  const table = document.getElementById("rsvp-table-container");
  const body = document.getElementById("rsvp-table-body");

  const res = await fetch(`/rsvp/admin?password=${encodeURIComponent(password)}`);
  const data = await res.json();

  if (!res.ok) {
    msg.textContent = "❌ Incorrect password!";
    table.style.display = "none";
    return;
  }

  msg.textContent = `✅ Showing ${data.length} RSVPs`;
  table.style.display = "block";

  body.innerHTML = ""; // clear it first

data.forEach(rsvp => {
  const row = document.createElement("tr");

  // Apply a class if they’re NOT attending
  if (rsvp.attending.toLowerCase() === "no") {
    row.classList.add("not-attending");
  }

  row.innerHTML = `
    <td>${rsvp.name}</td>
    <td>${rsvp.attending}</td>
    <td>${rsvp.guest || ""}</td>
    <td>${rsvp.guestCount || ""}</td>
    <td>${rsvp.notes || ""}</td>
    <td>${new Date(rsvp.timestamp).toLocaleString()}</td>
    <td class="actions">
     <button class="btn-link danger" data-id="${rsvp._id}">Delete</button>
     </td>
  `;

  body.appendChild(row);
});
// Event delegation for delete clicks
document.getElementById("rsvp-table-body").addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-link.danger");
  if (!btn) return;

  const id = btn.dataset.id;
  if (!id) return;

  const row = btn.closest("tr");
  const name = row?.firstElementChild?.textContent?.trim() || "this RSVP";

  if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

  const res = await fetch(`/admin/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });

  if (res.ok) {
    row.remove();
    // update count text
    const msg = document.getElementById("admin-message");
    const remaining = document.querySelectorAll("#rsvp-table-body tr").length;
    msg.textContent = `✅ Showing ${remaining} RSVPs`;
  } else {
    const { error } = await res.json().catch(() => ({ error: "Failed to delete" }));
    alert(`❌ ${error || "Failed to delete"}`);
  }
});


});



