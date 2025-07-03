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
    <td>${rsvp.meal || ""}</td>
    <td>${rsvp.notes || ""}</td>
    <td>${new Date(rsvp.timestamp).toLocaleString()}</td>
  `;

  body.appendChild(row);
});

});
