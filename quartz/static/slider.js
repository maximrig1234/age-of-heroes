// Слайд-шоу на титульной странице: стрелки, свайп, клавиши, пауза при наведении и просмотр на весь экран.
(function () {
  function init() {
    var box = document.querySelector("[data-okolo-slider]");
    if (!box || box.__okoloInit) return;
    box.__okoloInit = true;

    var slides = Array.prototype.slice.call(box.querySelectorAll(".okolo-slide"));
    var counter = box.querySelector("[data-okolo-count]");
    var delay = parseInt(box.getAttribute("data-okolo-delay") || "7000", 10);
    var cur = 0;
    var timer = null;
    var hold = false;
    var box_open = false;

    function load(n) {
      var img = slides[n] && slides[n].querySelector("img");
      if (img && img.getAttribute("data-src")) {
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
      }
    }

    function show(n) {
      cur = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle("active", k === cur);
      });
      load(cur);
      load((cur + 1) % slides.length);
      if (counter) counter.textContent = cur + 1 + " / " + slides.length;
      if (lb) updateLb();
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function start() {
      stop();
      if (hold || box_open || slides.length < 2) return;
      timer = setInterval(function () {
        if (!document.hidden) show(cur + 1);
      }, delay);
    }
    function go(n) {
      show(n);
      start();
    }

    box.querySelector("[data-okolo-prev]").addEventListener("click", function (e) {
      e.stopPropagation();
      go(cur - 1);
    });
    box.querySelector("[data-okolo-next]").addEventListener("click", function (e) {
      e.stopPropagation();
      go(cur + 1);
    });
    box.addEventListener("mouseenter", function () {
      hold = true;
      stop();
    });
    box.addEventListener("mouseleave", function () {
      hold = false;
      start();
    });

    // свайп
    var sx = null;
    var sy = null;
    function swipeStart(e) {
      sx = e.clientX;
      sy = e.clientY;
    }
    function swipeEnd(e) {
      if (sx === null) return;
      var dx = e.clientX - sx;
      var dy = e.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx < 0 ? 1 : -1));
    }
    box.addEventListener("pointerdown", swipeStart);
    box.addEventListener("pointerup", swipeEnd);
    box.addEventListener("pointercancel", function () {
      sx = null;
    });

    // просмотр на весь экран
    var lb = null;
    var lbImg = null;
    var lbCap = null;
    function updateLb() {
      var img = slides[cur].querySelector("img");
      lbImg.src = img.getAttribute("data-src") || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt + "  ·  " + (cur + 1) + " / " + slides.length;
    }
    function openLb() {
      if (!lb) {
        lb = document.createElement("div");
        lb.className = "okolo-lightbox";
        lb.innerHTML =
          '<button type="button" class="okolo-lb-close" aria-label="Закрыть">×</button>' +
          '<button type="button" class="okolo-lb-prev" aria-label="Назад">‹</button>' +
          '<img alt="">' +
          '<button type="button" class="okolo-lb-next" aria-label="Вперёд">›</button>' +
          '<div class="okolo-lb-cap"></div>';
        document.body.appendChild(lb);
        lbImg = lb.querySelector("img");
        lbCap = lb.querySelector(".okolo-lb-cap");
        lb.querySelector(".okolo-lb-close").addEventListener("click", closeLb);
        lb.querySelector(".okolo-lb-prev").addEventListener("click", function () {
          show(cur - 1);
        });
        lb.querySelector(".okolo-lb-next").addEventListener("click", function () {
          show(cur + 1);
        });
        lb.addEventListener("click", function (e) {
          if (e.target === lb) closeLb();
        });
        var lx = null;
        lb.addEventListener("pointerdown", function (e) {
          lx = e.clientX;
        });
        lb.addEventListener("pointerup", function (e) {
          if (lx === null) return;
          var dx = e.clientX - lx;
          lx = null;
          if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
        });
      }
      box_open = true;
      stop();
      lb.classList.add("open");
      updateLb();
    }
    function closeLb() {
      if (!lb) return;
      lb.classList.remove("open");
      box_open = false;
      start();
    }
    box.querySelector("[data-okolo-full]").addEventListener("click", function (e) {
      e.stopPropagation();
      openLb();
    });
    slides.forEach(function (s) {
      s.querySelector("img").addEventListener("click", openLb);
    });

    document.addEventListener("keydown", function (e) {
      if (!document.body.contains(box)) return;
      if (e.key === "Escape") closeLb();
      if (box_open && e.key === "ArrowLeft") show(cur - 1);
      if (box_open && e.key === "ArrowRight") show(cur + 1);
    });

    show(0);
    start();
  }

  document.addEventListener("nav", init);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
