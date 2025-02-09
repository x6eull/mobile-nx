(() => {
  const state = {};
  let nodesToDestroy = [];
  let pendingUpdate = false;

  function destroyAnyNodes() {
    nodesToDestroy.forEach((el) => el.remove());
    nodesToDestroy = [];
  }

  function update() {
    if (pendingUpdate === true) {
      return;
    }
    pendingUpdate = true;

    document.querySelectorAll("[data-el='button-1']").forEach((el) => {
      el.setAttribute("openLinkInNewTab", false);
    });

    destroyAnyNodes();
    pendingUpdate = false;
  }

  update();
})();
