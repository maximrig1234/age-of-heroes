// Мелкие улучшения для телефонов: оглавление в начале страницы свёрнуто и раскрывается по нажатию.
(function () {
  var mq = window.matchMedia("(max-width: 1199px)");

  function collapseToc() {
    if (!mq.matches) return;
    document.querySelectorAll(".okolo-cols .toc").forEach(function (toc) {
      if (toc.__okoloToc) return;
      toc.__okoloToc = true;
      var btn = toc.querySelector(".toc-header");
      if (btn && btn.getAttribute("aria-expanded") === "true") btn.click();
    });
  }

  // Пока поле поиска/вкладки меняют размер окна, оглавление не должно схлопываться снова.
  document.addEventListener("nav", function () {
    setTimeout(collapseToc, 50);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", collapseToc);
  else setTimeout(collapseToc, 50);
})();
