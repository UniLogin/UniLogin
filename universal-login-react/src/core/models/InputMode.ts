export enum InputMode {
  KeyboardMode,
  PanelMode
}

export type InputModeWithAddress = {
  mode: InputMode;
  address: string | undefined;
};

export const DEFAULT_INPUT_MODE_WITH_ADDRESS = {
  mode: InputMode.KeyboardMode,
  address: undefined
};
