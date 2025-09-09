const form = document.getElementById("rsvp-form");
const message = document.getElementById("rsvp-message");

const isLocal =
  location.hostname === "localhost" || location.hostname.startsWith("127.");
const API_BASE = isLocal ? "/api" : "https://api.ninajohnny4ever.com/api";

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      // ✅ keep a handle to the response
      const res = await fetch(`${API_BASE}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      let payload = null;
      try { payload = await res.json(); } catch {}

      if (!res.ok) {
        if (message) message.textContent = `❌ ${payload?.error || `Server error (${res.status})`}`;
        return;
      }

      if (message) message.textContent = "🎉 RSVP received! Thank you!";
      form.reset();
    } catch (err) {
      console.error(err);
      if (message) message.textContent = "❌ Network error — is the backend running?";
    }
  });
}
