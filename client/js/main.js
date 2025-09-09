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
// --- Slideshow ---
class Slideshow {
  constructor(root) {
    this.root = root;
    this.slides = [...root.querySelectorAll(".slide")];
    this.prevBtn = root.querySelector(".prev");
    this.nextBtn = root.querySelector(".next");
    this.dotsWrap = root.querySelector(".dots");

    this.index = 0;
    this.intervalMs = Number(root.dataset.interval) || 4000;
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
