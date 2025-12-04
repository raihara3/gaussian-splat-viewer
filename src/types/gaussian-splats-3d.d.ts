declare module "@mkkellogg/gaussian-splats-3d" {
  export enum SceneRevealMode {
    Instant = 0,
    Gradual = 1,
  }

  export enum SceneFormat {
    Ply = 0,
    Splat = 1,
    KSplat = 2,
  }

  export enum LogLevel {
    None = 0,
    Minimal = 1,
    Info = 2,
    Debug = 3,
  }

  export interface ViewerOptions {
    cameraUp?: [number, number, number];
    initialCameraPosition?: [number, number, number];
    initialCameraLookAt?: [number, number, number];
    rootElement?: HTMLElement;
    selfDrivenMode?: boolean;
    sharedMemoryForWorkers?: boolean;
    dynamicScene?: boolean;
    sceneRevealMode?: SceneRevealMode;
    antialiased?: boolean;
    focalAdjustment?: number;
    logLevel?: LogLevel;
    sphericalHarmonicsDegree?: number;
  }

  export interface AddSplatSceneOptions {
    format?: SceneFormat;
    scale?: [number, number, number];
    progressiveLoad?: boolean;
    showLoadingUI?: boolean;
    onProgress?: (progress: number, message: string, stage: string) => void;
  }

  export interface ViewerControls {
    reset: () => void;
  }

  export class Viewer {
    controls?: ViewerControls;

    constructor(options?: ViewerOptions);

    addSplatScene(
      source: string,
      options?: AddSplatSceneOptions
    ): Promise<void>;

    start(): void;

    dispose(): void;

    getSplatCount(): number;
  }
}
