export const terminalKb = {
  node: null as HTMLInputElement | null,
};

function scrollSnapshot() {
  const windowX = window.scrollX;
  const windowY = window.scrollY;
  const nested: { el: HTMLElement; top: number; left: number }[] = [];
  let el = terminalKb.node?.parentElement ?? null;
  while (el) {
    if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
      nested.push({ el, top: el.scrollTop, left: el.scrollLeft });
    }
    el = el.parentElement;
  }
  return () => {
    window.scrollTo(windowX, windowY);
    for (const item of nested) {
      item.el.scrollTop = item.top;
      item.el.scrollLeft = item.left;
    }
  };
}

export function armTerminalKeyboard() {
  const node = terminalKb.node;
  if (!node) return;
  const restore = scrollSnapshot();
  if (document.activeElement !== node) node.focus({ preventScroll: true });
  restore();
  requestAnimationFrame(() => {
    restore();
    requestAnimationFrame(restore);
  });
}

export function blurTerminalKeyboard() {
  const node = terminalKb.node;
  if (!node || document.activeElement !== node) return;
  node.blur();
}
