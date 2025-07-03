const countdownEl = document.getElementById("countdown");

// 👰 Set your wedding date here!
const weddingDate = new Date("2026-02-06T00:00:00");

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    countdownEl.textContent = "🎉 It's wedding time!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);


const form = document.getElementById("rsvp-form");
const message = document.getElementById("rsvp-message");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const res = await fetch("/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok) {
      message.textContent = "🎉 RSVP received! Thank you!";
      form.reset();
    } else {
      message.textContent = `❌ ${result.error || "Something went wrong!"}`;
    }
  });
}
