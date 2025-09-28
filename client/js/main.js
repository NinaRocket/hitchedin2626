// const form = document.getElementById("rsvp-form");
// const message = document.getElementById("rsvp-message");

// const isLocal =
//   location.hostname === "localhost" || location.hostname.startsWith("127.");
// const API_BASE = isLocal ? "/api" : "https://api.ninajohnny4ever.com/api";

// if (form) {
//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const btn = form.querySelector('button[type="submit"]');
//     const originalText = btn ? btn.textContent : "";
//     if (btn) {
//       btn.disabled = true;
//       btn.classList.add("is-loading");
//       btn.textContent = "Sending…";
//     }
//     if (message) { message.textContent = ""; message.style.color = ""; }

//     // collect data
//     const formData = new FormData(form);
//     const data = Object.fromEntries(formData);

//     try {
//       const res = await fetch(`${API_BASE}/rsvp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//       });

//       let payload = null;
//       try { payload = await res.json(); } catch {}

//       if (!res.ok) {
//         const reason = payload?.error || `Server error (${res.status})`;
//         throw new Error(reason);
//       }

//       if (message) {
//         message.textContent = payload?.message || "🎉 RSVP received! Thank you!";
//         message.style.color = "#0A9396"; // teal success
//       }
//       form.reset();

//     } catch (err) {
//       console.error(err);
//       if (message) {
//         message.textContent = "❌ That didn’t go through. Please try again (or text us).";
//         message.style.color = "#AE2012"; // red error
//       }
//     } finally {
//       if (btn) {
//         btn.disabled = false;
//         btn.classList.remove("is-loading");
//         btn.textContent = originalText || "Send My RSVP 💌";
//       }
//     }
//   });
// }
const form = document.getElementById("rsvp-form");
const message = document.getElementById("rsvp-message");

const isLocal =
  location.hostname === "localhost" || location.hostname.startsWith("127.");
const API_BASE = isLocal ? "/api" : "https://api.ninajohnny4ever.com/api";

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.textContent : "";
    if (btn) {
      btn.disabled = true;
      btn.classList.add("is-loading");
      btn.textContent = "Sending…";
    }
    if (message) { message.textContent = ""; message.style.color = ""; }

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(`${API_BASE}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      let payload = null;
      try { payload = await res.json(); } catch {}

      if (!res.ok) {
        const reason = payload?.error || `Server error (${res.status})`;
        throw new Error(reason);
      }

      // ✅ success → fade out + hide the form
      // form.classList.add("fade-out");
      // setTimeout(() => { form.style.display = "none"; }, 260);
      document.getElementById("rsvp-success")?.removeAttribute("hidden");
form.classList.add("fade-out");
setTimeout(() => { form.style.display = "none"; }, 260);


      if (message) {
        message.textContent = payload?.message || "🎉 RSVP received! Thank you! 🎉 ";
        message.style.color = "#0A9396"; 
      }

    } catch (err) {
      console.error(err);
      if (message) {
        message.textContent = "❌ That didn’t go through. Please try again (or text us).";
        message.style.color = "#AE2012";
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove("is-loading");
        btn.textContent = originalText || "Send My RSVP 💌";
      }
    }
  });
}


// --- Slideshow ---
class Slideshow {
  constructor(root) {
    this.root = root;
    this.slides = [...root.querySelectorAll(".slide")];
    this.prevBtn = root.querySelector(".prev");
    this.nextBtn = root.querySelector(".next");
    this.dotsWrap = root.querySelector(".dots");

    this.index = 0;
    this.intervalMs = Number(root.dataset.interval) || 0o0;
    this.autoplay = (root.dataset.autoplay || "false") === "true";
    this.timer = null;

    this._buildDots();
    this._show(0);
    this._bind();
    if (this.autoplay) this.play();
  }

  _buildDots() {
    this.dotBtns = this.slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.setAttribute("role", "tab");
      b.addEventListener("click", () => {
        this._show(i);
        this.pause(); this.play();
      });
      this.dotsWrap.appendChild(b);
      return b;
    });
  }

  _show(i) {
    this.slides[this.index]?.classList.remove("is-active");
    this.index = (i + this.slides.length) % this.slides.length;
    this.slides[this.index].classList.add("is-active");
    this._syncDots();
  }

  _syncDots() {
    if (!this.dotBtns) return;
    this.dotBtns.forEach((b, i) =>
      b.setAttribute("aria-selected", String(i === this.index))
    );
  }

  next = () => this._show(this.index + 1);
  prev = () => this._show(this.index - 1);

  _bind() {
    this.nextBtn?.addEventListener("click", () => { this.next(); this.pause(); this.play(); });
    this.prevBtn?.addEventListener("click", () => { this.prev(); this.pause(); this.play(); });

    // pause on hover
    this.root.addEventListener("mouseenter", () => this.pause());
    this.root.addEventListener("mouseleave", () => this.play());

    // keyboard (only when hovered)
    document.addEventListener("keydown", (e) => {
      if (!this.root.matches(":hover")) return;
      if (e.key === "ArrowRight") this.next();
      if (e.key === "ArrowLeft") this.prev();
    });

    // touch swipe
    let startX = 0;
    this.root.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      this.pause();
    }, { passive: true });

    this.root.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) (dx < 0 ? this.next() : this.prev());
      this.play();
    }, { passive: true });
  }

  play() {
    if (!this.autoplay) return;
    clearInterval(this.timer);
    this.timer = setInterval(() => this.next(), this.intervalMs);
  }

  pause() {
    clearInterval(this.timer);
  }
}

// init any .slideshow on the page
document.querySelectorAll(".slideshow").forEach(el => new Slideshow(el));

// ---- Add-to-calendar ----
const eventInfo = {
  title: "Nina & Johnny – Celebration of Love",
  start: "2025-11-22T16:00:00-07:00", // 4:00pm America/Phoenix
  end:   "2025-11-22T21:00:00-07:00", // 9:00pm America/Phoenix
  location: "4144 W Wethersfield Rd, Phoenix, AZ 85029",
  description:
    "Backyard reception! Cake, food, snacks, drinks & fun!",
  url: "https://ninajohnny4ever.com",
  tz: "America/Phoenix"
};

// Helpers
const pad = n => (n < 10 ? "0" + n : "" + n);
const fmtUTC = (iso) => {
  // 2025-11-22T16:00-07:00 -> 20251122T230000Z (UTC for Google)
  const d = new Date(iso);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
};
const fmtLocalICS = (iso) => {
  // Local (with TZID in ICS)
  const d = new Date(iso);
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate())
  ].join("") + "T" + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join("");
};
const escICS = (s) => String(s).replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");

function googleCalURL(evt) {
  const dates = `${fmtUTC(evt.start)}/${fmtUTC(evt.end)}`;
  const base = "https://www.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: evt.title,
    dates,
    location: evt.location,
    details: `${evt.description}\n${evt.url}`
  });
  return `${base}&${params.toString()}`;
}

function buildICS(evt) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NinaJohnny//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    `TZID:${evt.tz}`,
    "X-LIC-LOCATION:" + evt.tz,
    // Phoenix is MST all year (UTC-7). One STANDARD block is fine.
    "BEGIN:STANDARD",
    "TZOFFSETFROM:-0700",
    "TZOFFSETTO:-0700",
    "TZNAME:MST",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@ninajohnny4ever.com`,
    `DTSTAMP:${fmtUTC(new Date().toISOString()).replace(/Z$/, "Z")}`,
    `DTSTART;TZID=${evt.tz}:${fmtLocalICS(evt.start)}`,
    `DTEND;TZID=${evt.tz}:${fmtLocalICS(evt.end)}`,
    `SUMMARY:${escICS(evt.title)}`,
    `DESCRIPTION:${escICS(evt.description)}\\n${escICS(evt.url)}`,
    `LOCATION:${escICS(evt.location)}`,
    `URL:${evt.url}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];
  // Use CRLF for maximum compatibility
  return lines.join("\r\n");
}

function downloadICS(content, filename = "event.ics") {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Wire up buttons
document.getElementById("add-gcal")?.addEventListener("click", () => {
  const url = googleCalURL(eventInfo);
  window.open(url, "_blank", "noopener");
});

document.getElementById("add-ics")?.addEventListener("click", () => {
  const ics = buildICS(eventInfo);
  downloadICS(ics, "NinaJohnny-Celebration-2025-11-22.ics");
});
