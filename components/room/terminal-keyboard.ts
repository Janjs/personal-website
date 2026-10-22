export const terminalKb = {
  node: null as HTMLInputElement | null,
};

export function armTerminalKeyboard() {
  terminalKb.node?.focus({ preventScroll: true });
}

export function blurTerminalKeyboard() {
  terminalKb.node?.blur();
}
