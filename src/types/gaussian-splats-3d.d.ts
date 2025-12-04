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

  export enum RenderMode {
    Always = 0,
    OnChange = 1,
    Never = 2,
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
    renderMode?: RenderMode;
    splatRenderMode?: number;
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
    renderer?: {
      domElement: HTMLCanvasElement;
      getContext: () => WebGL2RenderingContext | WebGLRenderingContext | null;
    };
    scene?: {
      background: { set: (color: number) => void } | null;
    };
    splatMesh?: {
      disposers: unknown[];
      getSplatCount: () => number;
      setPointCloudModeEnabled: (enabled: boolean) => void;
      setSplatScale: (scale: number) => void;
    };

    constructor(options?: ViewerOptions);

    addSplatScene(
      source: string,
      options?: AddSplatSceneOptions
    ): Promise<void>;

    start(): void;

    stop(): void;

    dispose(): void;

    getSplatCount(): number;
  }
}
