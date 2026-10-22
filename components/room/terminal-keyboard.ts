export const terminalKb = {
  node: null as HTMLInputElement | null,
};

export function armTerminalKeyboard() {
  const node = terminalKb.node;
  if (!node) return;
  if (document.activeElement === node) return;
  node.focus({ preventScroll: true });
}

export function blurTerminalKeyboard() {
  const node = terminalKb.node;
  if (!node || document.activeElement !== node) return;
  node.blur();
}
