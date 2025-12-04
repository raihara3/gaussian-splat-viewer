export type BackgroundColor = "black" | "white" | "gray" | "custom";

export interface ViewerSettings {
  backgroundColor: BackgroundColor;
  customBackgroundColor: string;
  pointCloudMode: boolean;
  pointSize: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
}

export const defaultViewerSettings: ViewerSettings = {
  backgroundColor: "black",
  customBackgroundColor: "#1a1a2e",
  pointCloudMode: false,
  pointSize: 1.0,
  autoRotate: false,
  autoRotateSpeed: 1.0,
};

export const backgroundColorValues: Record<BackgroundColor, number> = {
  black: 0x0a0a0f,
  white: 0xffffff,
  gray: 0x808080,
  custom: 0x1a1a2e,
};
