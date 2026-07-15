/* =====================================================================
   HADI_X_HACKER — CYBER SECURITY PORTFOLIO
   File: script.js  (vanilla JS, no frameworks)
   ===================================================================== */
(() => {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const GITHUB_USER = "ButtSultan";

  /* ---------------------------------------------------------------
     LOADING SCREEN
     --------------------------------------------------------------- */
  function initLoader() {
    const screen = $("#loading-screen");
    const fill = $("#loader-fill");
    const pct = $("#loader-pct");
    const cmd = $("#loader-cmd");
    const cmds = ["establishing secure connection", "verifying identity", "decrypting portfolio", "ready"];
    let i = 0, p = 0;
    cmd.textContent = cmds[0];
    const cmdTimer = setInterval(() => {
      i = (i + 1) % cmds.length;
      cmd.textContent = cmds[i];
    }, 550);
    const timer = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) p = 100;
      fill.style.width = p + "%";
      pct.textContent = Math.floor(p);
      if (p >= 100) {
        clearInterval(timer);
        clearInterval(cmdTimer);
        setTimeout(() => screen.classList.add("hidden"), 350);
      }
    }, 140);
  }

  /* ---------------------------------------------------------------
     CUSTOM CURSOR + GLOW
     --------------------------------------------------------------- */
  function initCursor() {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const dot = $("#cursor-dot"), ring = $("#cursor-ring"), glow = $("#cursor-glow");
    let rx = 0, ry = 0, x = 0, y = 0;
    window.addEventListener("mousemove", e => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      glow.style.left = x + "px"; glow.style.top = y + "px";
    });
    (function loop() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    $$("a,button,.card,.skill-tab,input,textarea").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  }

  /* ---------------------------------------------------------------
     BACKGROUND NETWORK-NODE CANVAS
     --------------------------------------------------------------- */
  function initNetworkCanvas() {
    const canvas = $("#bg-canvas");
    const ctx = canvas.getContext("2d");
    let w, h, nodes = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(70, Math.floor((w * h) / 22000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }
    window.addEventListener("resize", resize);
    resize();

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(57,255,136,${0.14 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = "rgba(53,231,255,0.55)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------------------------------------------------------------
     MATRIX RAIN TOGGLE
     --------------------------------------------------------------- */
  function initMatrix() {
    const canvas = $("#matrix-canvas");
    const ctx = canvas.getContext("2d");
    const btn = $("#matrix-toggle");
    let running = false, columns, drops, w, h, raf;
    const chars = "アイウエオカキクケコ01001101ハクシタセキュリティ";

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      columns = Math.floor(w / 16);
      drops = new Array(columns).fill(1);
    }
    window.addEventListener("resize", () => { if (running) resize(); });

    function frame() {
      ctx.fillStyle = "rgba(4,7,10,0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#39ff88";
      ctx.font = "14px monospace";
      drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 16, y * 16);
        if (y * 16 > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      raf = requestAnimationFrame(frame);
    }

    btn.addEventListener("click", () => {
      running = !running;
      canvas.classList.toggle("active", running);
      btn.style.color = running ? "var(--green)" : "";
      if (running) { resize(); frame(); }
      else cancelAnimationFrame(raf);
    });
  }

  /* ---------------------------------------------------------------
     NAVIGATION: scroll state, mobile toggle, active link, smooth scroll
     --------------------------------------------------------------- */
  function initNav() {
    const navbar = $("#navbar");
    const toggle = $("#nav-toggle");
    const links = $("#nav-links");

    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    });

    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    $$("#nav-links a").forEach(a => a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
    }));

    const sections = $$("main section[id], .hero");
    const navAnchors = $$("#nav-links a");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => observer.observe(s));
  }

  /* ---------------------------------------------------------------
     SCROLL PROGRESS + BACK TO TOP
     --------------------------------------------------------------- */
  function initScrollProgress() {
    const bar = $("#scroll-progress");
    const backTop = $("#back-to-top");
    window.addEventListener("scroll", () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + "%";
      backTop.classList.toggle("show", h.scrollTop > 600);
    });
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------------------------------------------------------------
     REVEAL ON SCROLL
     --------------------------------------------------------------- */
  function initReveal() {
    const items = $$(".reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(i => io.observe(i));
  }

  /* ---------------------------------------------------------------
     HERO TERMINAL TYPING SEQUENCE
     --------------------------------------------------------------- */
  function initHeroTerminal() {
    const el = $("#hero-term-body");
    const lines = [
      { p: true,  t: "whoami" },
      { c: true,  t: "muhammad_usman aka Hadi_X_Hacker" },
      { p: true,  t: "cat role.txt" },
      { c: true,  t: "BSCS Student · Cyber Security Enthusiast" },
      { p: true,  t: "cat focus.txt" },
      { c: true,  t: "Ethical Hacking · Digital Forensics · SOC" },
      { p: true,  t: "status --check" },
      { c: true,  t: "[OK] Ready for new opportunities" },
    ];
    let li = 0, ci = 0;
    el.innerHTML = "";
    const lineEls = [];

    function typeNext() {
      if (li >= lines.length) {
        el.insertAdjacentHTML("beforeend", `<span class="term-cursor"></span>`);
        return;
      }
      const line = lines[li];
      if (ci === 0) {
        const div = document.createElement("div");
        if (line.p) div.innerHTML = `<span class="prompt">$ </span>`;
        el.appendChild(div);
        lineEls[li] = div;
      }
      const div = lineEls[li];
      if (ci < line.t.length) {
        div.innerHTML = (line.p ? `<span class="prompt">$ </span>` : `<span class="muted">→ </span>`) + line.t.slice(0, ci + 1);
        ci++;
        setTimeout(typeNext, line.p ? 55 : 22);
      } else {
        ci = 0; li++;
        setTimeout(typeNext, 260);
      }
    }
    typeNext();
  }

  /* ---------------------------------------------------------------
     HUD CLOCK + UPTIME
     --------------------------------------------------------------- */
  function initClock() {
    const start = Date.now();
    const hudClock = $("#hud-clock");
    const uptime = $("#hud-uptime");
    function pad(n) { return String(n).padStart(2, "0"); }
    function tick() {
      const now = new Date();
      hudClock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const s = Math.floor((Date.now() - start) / 1000);
      uptime.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------
     SKILLS: tabs + animated progress bars + counters
     --------------------------------------------------------------- */
  function initSkillsTabs() {
    const tabs = $$(".skill-tab[data-tab]");
    const panels = $$(".skills-panel");
    tabs.forEach(tab => tab.addEventListener("click", () => {
      tabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("active"); tab.setAttribute("aria-selected", "true");
      panels.forEach(p => p.hidden = p.dataset.panel !== tab.dataset.tab);
      animateBarsIn(panels.find(p => !p.hidden));
    }));
  }

  function animateBarsIn(scope) {
    if (!scope) return;
    $$(".bar-fill", scope).forEach(bar => {
      bar.style.width = "0%";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        bar.style.width = bar.dataset.fill + "%";
      }));
    });
  }

  function initSkillsObserver() {
    const section = $("#skills");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateBarsIn($(".skills-panel:not([hidden])"));
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(section);
  }

  /* ---------------------------------------------------------------
     STATISTICS COUNTERS
     --------------------------------------------------------------- */
  function initCounters() {
    const nums = $$(".stat-num");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = cur;
        }, 24);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  }

  /* ---------------------------------------------------------------
     PROJECT FILTERING
     --------------------------------------------------------------- */
  function initProjectFilter() {
    const buttons = $$(".filter-bar .skill-tab");
    const cards = $$(".project-card");
    buttons.forEach(btn => btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === "all" || card.dataset.status === filter;
        card.style.display = show ? "" : "none";
      });
    }));

    $$(".disabled-link").forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      showToast(a.dataset.toast || "Not available yet.", "info");
    }));
  }

  /* ---------------------------------------------------------------
     CERTIFICATE LIGHTBOX
     --------------------------------------------------------------- */
  function initLightbox() {
    const lightbox = $("#lightbox");
    const img = $("#lightbox-img");
    const closeBtn = $("#lightbox-close");

    function open(src, alt) {
      img.src = src; img.alt = alt || "Certificate";
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    $$(".cert-card").forEach(card => {
      const trigger = () => open(card.dataset.certImg, card.dataset.certTitle);
      card.addEventListener("click", trigger);
      card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); trigger(); } });
    });
    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  /* ---------------------------------------------------------------
     GITHUB API INTEGRATION
     --------------------------------------------------------------- */
  async function initGithub() {
    const reposList = $("#gh-repos-list");
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USER}`),
        fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=5`),
      ]);
      if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API request failed");
      const user = await userRes.json();
      const repos = await reposRes.json();

      $("#gh-avatar-img").src = user.avatar_url || "assets/images/profile.jpg";
      $("#gh-name").textContent = user.name || "Muhammad Usman";
      $("#gh-handle").textContent = "@" + (user.login || GITHUB_USER);
      $("#gh-repos-count").textContent = user.public_repos ?? "—";
      $("#gh-followers").textContent = user.followers ?? "—";
      $("#gh-following").textContent = user.following ?? "—";

      if (Array.isArray(repos) && repos.length) {
        reposList.innerHTML = repos.map(r => `
          <div class="repo-item card">
            <div>
              <div class="name">${escapeHtml(r.name)}</div>
              <div class="desc">${escapeHtml(r.description || "No description provided.")}</div>
            </div>
            <div class="repo-meta">
              <span>★ ${r.stargazers_count}</span>
              <span>${r.language || "—"}</span>
              <a href="${r.html_url}" target="_blank" rel="noopener" class="text-green">view</a>
            </div>
          </div>
        `).join("");
      } else {
        reposList.innerHTML = `<div class="gh-loading mono">No public repositories found yet.</div>`;
      }
    } catch (err) {
      reposList.innerHTML = `<div class="gh-error mono">Couldn't load live GitHub data right now — visit the <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener" class="text-green">GitHub profile</a> directly.</div>`;
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
  }

  /* ---------------------------------------------------------------
     CONTACT FORM (validated, opens mailto with prefilled content)
     --------------------------------------------------------------- */
  function initContactForm() {
    const form = $("#contact-form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const fields = [
        { id: "cf-name", group: "fg-name", validate: v => v.trim().length > 1 },
        { id: "cf-email", group: "fg-email", validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        { id: "cf-subject", group: "fg-subject", validate: v => v.trim().length > 2 },
        { id: "cf-message", group: "fg-message", validate: v => v.trim().length > 5 },
      ];
      let valid = true;
      const values = {};
      fields.forEach(f => {
        const input = $("#" + f.id);
        const group = $("#" + f.group);
        values[f.id] = input.value;
        const ok = f.validate(input.value);
        group.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });
      if (!valid) { showToast("Please fix the highlighted fields.", "error"); return; }

      const subject = encodeURIComponent(`[Portfolio] ${values["cf-subject"]}`);
      const body = encodeURIComponent(
        `Name: ${values["cf-name"]}\nEmail: ${values["cf-email"]}\n\n${values["cf-message"]}`
      );
      window.location.href = `mailto:buttsultan120@gmail.com?subject=${subject}&body=${body}`;
      showToast("Opening your email client…", "success");
      form.reset();
    });

    $$("#contact-form input, #contact-form textarea").forEach(el => {
      el.addEventListener("input", () => el.closest(".form-group").classList.remove("invalid"));
    });
  }

  /* ---------------------------------------------------------------
     COPY EMAIL BUTTON
     --------------------------------------------------------------- */
  function initCopyEmail() {
    const btn = $("#copy-email");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("buttsultan120@gmail.com");
        showToast("Email copied to clipboard.", "success");
      } catch {
        showToast("Couldn't copy automatically — buttsultan120@gmail.com", "error");
      }
    });
  }

  /* ---------------------------------------------------------------
     TOASTS
     --------------------------------------------------------------- */
  function showToast(message, type = "info") {
    const container = $("#toast-container");
    const toast = document.createElement("div");
    toast.className = "toast" + (type === "error" ? " error" : "");
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* ---------------------------------------------------------------
     MAGNETIC + RIPPLE BUTTONS
     --------------------------------------------------------------- */
  function initButtonFX() {
    $$(".btn").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.28}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
      btn.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = (e.clientX - rect.left) + "px";
        ripple.style.top = (e.clientY - rect.top) + "px";
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  /* ---------------------------------------------------------------
     THEME TOGGLE (dark <-> high-contrast light)
     --------------------------------------------------------------- */
  function initThemeToggle() {
    const btn = $("#theme-toggle");
    const saved = localStorage.getItem("hxh-theme");
    if (saved === "light") document.documentElement.classList.add("light-theme");
    applyLightVars(document.documentElement.classList.contains("light-theme"));

    btn.addEventListener("click", () => {
      const isLight = document.documentElement.classList.toggle("light-theme");
      localStorage.setItem("hxh-theme", isLight ? "light" : "dark");
      applyLightVars(isLight);
      showToast(isLight ? "Light mode enabled." : "Dark mode enabled.", "info");
    });
  }
  function applyLightVars(isLight) {
    const root = document.documentElement.style;
    if (isLight) {
      root.setProperty("--void", "#f4f7f6");
      root.setProperty("--panel", "#ffffff");
      root.setProperty("--panel-2", "#eef2f1");
      root.setProperty("--panel-3", "#e3e9e7");
      root.setProperty("--text-hi", "#0b1210");
      root.setProperty("--text-mid", "#3a4744");
      root.setProperty("--text-low", "#6c7975");
      root.setProperty("--line", "rgba(20,30,28,0.12)");
      root.setProperty("--line-strong", "rgba(20,30,28,0.22)");
    } else {
      ["--void","--panel","--panel-2","--panel-3","--text-hi","--text-mid","--text-low","--line","--line-strong"]
        .forEach(p => root.removeProperty(p));
    }
  }

  /* ---------------------------------------------------------------
     AMBIENT SOUND TOGGLE (Web Audio synth — no external audio file)
     --------------------------------------------------------------- */
  function initMusicToggle() {
    const btn = $("#music-toggle");
    let ctx, osc, gain, playing = false;
    btn.addEventListener("click", () => {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (!playing) {
        osc = ctx.createOscillator();
        gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 110;
        gain.gain.value = 0.0001;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.6);
        playing = true;
        btn.style.color = "var(--green)";
        showToast("Ambient tone on.", "info");
      } else {
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        setTimeout(() => osc.stop(), 450);
        playing = false;
        btn.style.color = "";
        showToast("Ambient tone off.", "info");
      }
    });
  }

  /* ---------------------------------------------------------------
     VISITOR COUNTER (client-side, localStorage)
     --------------------------------------------------------------- */
  function initVisitorCounter() {
    const el = $("#visitor-count");
    let count = parseInt(localStorage.getItem("hxh-visits") || "0", 10);
    count += 1;
    localStorage.setItem("hxh-visits", String(count));
    el.textContent = `views: ${count}`;
    el.title = "Local visit count on this browser (no server tracking)";
  }

  /* ---------------------------------------------------------------
     FAKE INTERACTIVE TERMINAL
     --------------------------------------------------------------- */
  function initTerminal() {
    const modal = $("#term-modal");
    const openBtn = $("#terminal-open");
    const closeBtn = $("#term-close");
    const output = $("#term-output");
    const input = $("#term-input");

    const commands = {
      help: () => `Available commands: help, whoami, about, skills, projects, certificates, contact, socials, clear, exit`,
      whoami: () => `Muhammad Usman — "Hadi_X_Hacker" — Cyber Security Student, Rawalpindi, Pakistan`,
      about: () => `5th-semester BSCS student focused on ethical hacking, digital forensics and network security.`,
      skills: () => `Ethical Hacking · OSINT · Web Security · Network Security · Digital Forensics · Python · Bash · Linux`,
      projects: () => `ThreatLens AI · Android Security Toolkit · Password Generator · Port Scanner · Network Scanner · Bug Hunting Notes · Cyber Dashboard`,
      certificates: () => `1) Real Ethical Hacking in 46 Hours (CSEH+CEH PRO) — Udemy\n2) Cyber Security Specialization — Innovista Learn Easy`,
      contact: () => `Email: buttsultan120@gmail.com | GitHub: github.com/${GITHUB_USER} | LinkedIn: pk.linkedin.com/in/muhammad-usman-8ab9a5398`,
      socials: () => `GitHub → github.com/${GITHUB_USER}\nLinkedIn → pk.linkedin.com/in/muhammad-usman-8ab9a5398`,
      clear: () => "__CLEAR__",
      exit: () => "__EXIT__",
    };

    function printLine(text, cls = "") {
      const div = document.createElement("div");
      div.className = "line " + cls;
      div.textContent = text;
      output.appendChild(div);
      output.scrollTop = output.scrollHeight;
    }

    function boot() {
      output.innerHTML = "";
      printLine("Hadi_X_Hacker interactive terminal — type 'help' to see available commands.", "muted");
    }

    function open() { modal.classList.add("open"); document.body.style.overflow = "hidden"; input.focus(); }
    function close() { modal.classList.remove("open"); document.body.style.overflow = ""; }

    openBtn.addEventListener("click", () => { boot(); open(); });
    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", e => { if (e.target === modal) close(); });

    input.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      const raw = input.value.trim();
      if (!raw) return;
      printLine("hadi@x-hacker:~$ " + raw, "cyan");
      const fn = commands[raw.toLowerCase()];
      if (!fn) {
        printLine(`command not found: ${raw} — type 'help'`, "muted");
      } else {
        const result = fn();
        if (result === "__CLEAR__") { boot(); }
        else if (result === "__EXIT__") { printLine("closing session…", "muted"); setTimeout(close, 400); }
        else printLine(result);
      }
      input.value = "";
    });
  }

  /* ---------------------------------------------------------------
     PRINT RESUME (uses browser print on request)
     --------------------------------------------------------------- */
  function initPrint() {
    $("#print-resume-link").addEventListener("click", e => {
      e.preventDefault();
      window.print();
    });
  }

  /* ---------------------------------------------------------------
     MISC: footer year
     --------------------------------------------------------------- */
  function initMisc() {
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------
     BOOTSTRAP
     --------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initCursor();
    initNetworkCanvas();
    initMatrix();
    initNav();
    initScrollProgress();
    initReveal();
    initHeroTerminal();
    initClock();
    initSkillsTabs();
    initSkillsObserver();
    initCounters();
    initProjectFilter();
    initLightbox();
    initGithub();
    initContactForm();
    initCopyEmail();
    initButtonFX();
    initThemeToggle();
    initMusicToggle();
    initVisitorCounter();
    initTerminal();
    initPrint();
    initMisc();
  });
})();
