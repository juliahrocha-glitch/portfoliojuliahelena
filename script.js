(function () {
  var $ = function (s) { return document.querySelector(s); };
 
  var menuBtn = $(".menu-btn"), nav = $(".nav");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });

  var soundOn = false, ctx = null, soundBtn = $(".sound-btn");
  try { soundOn = localStorage.getItem("som") === "on"; } catch (e) {}
  function paintSound() {
    soundBtn.setAttribute("aria-pressed", soundOn);
    soundBtn.textContent = "♪ som: " + (soundOn ? "ligado" : "desligado");
  }
  function beep(freq, dur) {
    if (!soundOn) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.04, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur);
    } catch (e) {}
  }
  paintSound();
  soundBtn.addEventListener("click", function () {
    soundOn = !soundOn;
    try { localStorage.setItem("som", soundOn ? "on" : "off"); } catch (e) {}
    paintSound(); beep(660, 0.12);
  });
  document.querySelectorAll(".btn, .menu-btn, .to-top").forEach(function (el) {
    el.addEventListener("click", function () { beep(520, 0.1); });
  });
  document.querySelectorAll(".nav a").forEach(function (el) {
    el.addEventListener("mouseenter", function () { beep(780, 0.06); });
  });
  document.querySelectorAll(".card").forEach(function (el) {
    el.addEventListener("mouseenter", function () { beep(900, 0.05); });
  });
 
  document.querySelectorAll(".nav a, .brand").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (a.classList.contains("active") || e.metaKey || e.ctrlKey) return;
      e.preventDefault(); beep(600, 0.08);
      document.body.classList.add("leaving");
      setTimeout(function () { location.href = a.href; }, 220);
    });
  });
  window.addEventListener("pageshow", function () { document.body.classList.remove("leaving"); });
 
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add("in"); }); }
 
  var top = $(".to-top");
  window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 400); });
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
 
  if (window.matchMedia("(pointer:fine)").matches) {
    var dot = document.createElement("div"); dot.className = "cursor-dot"; document.body.appendChild(dot);
    document.addEventListener("mousemove", function (e) { dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px"; });
    document.addEventListener("mouseover", function (e) { dot.classList.toggle("big", !!e.target.closest("a,button")); });
  }
})();
 