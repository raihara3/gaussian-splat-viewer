import { useRef, useCallback, useState, useEffect } from "react";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

interface ViewerState {
  isLoading: boolean;
  progress: number;
  isViewerActive: boolean;
  filename: string;
  splatCount: string;
  fps: number;
  error: string | null;
}

function getFileFormat(filename: string): GaussianSplats3D.SceneFormat {
  const extension = filename.toLowerCase().split(".").pop();
  switch (extension) {
    case "ply":
      return GaussianSplats3D.SceneFormat.Ply;
    case "splat":
      return GaussianSplats3D.SceneFormat.Splat;
    case "ksplat":
      return GaussianSplats3D.SceneFormat.KSplat;
    default:
      return GaussianSplats3D.SceneFormat.Ply;
  }
}

export function useGaussianSplatViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<GaussianSplats3D.Viewer | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const fpsFramesRef = useRef(0);
  const fpsTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  const [state, setState] = useState<ViewerState>({
    isLoading: false,
    progress: 0,
    isViewerActive: false,
    filename: "-",
    splatCount: "-",
    fps: 0,
    error: null,
  });

  const initializeViewer = useCallback(() => {
    if (viewerRef.current) {
      viewerRef.current.dispose();
    }

    if (!containerRef.current) {
      return null;
    }

    const viewer = new GaussianSplats3D.Viewer({
      cameraUp: [0, 1, 0],
      initialCameraPosition: [0, 0, 5],
      initialCameraLookAt: [0, 0, 0],
      rootElement: containerRef.current,
      selfDrivenMode: true,
      sharedMemoryForWorkers: false,
      dynamicScene: false,
      sceneRevealMode: GaussianSplats3D.SceneRevealMode.Instant,
      antialiased: true,
      focalAdjustment: 1.0,
      logLevel: GaussianSplats3D.LogLevel.None,
      sphericalHarmonicsDegree: 0,
    });

    viewerRef.current = viewer;
    return viewer;
  }, []);

  const startFpsCounter = useCallback(() => {
    const updateFps = () => {
      fpsFramesRef.current++;
      const now = performance.now();
      if (now - fpsTimeRef.current >= 1000) {
        setState((previous) => ({ ...previous, fps: fpsFramesRef.current }));
        fpsFramesRef.current = 0;
        fpsTimeRef.current = now;
      }
      animationFrameRef.current = requestAnimationFrame(updateFps);
    };
    updateFps();
  }, []);

  const loadSplatFile = useCallback(
    async (file: File | string, isUrl = false) => {
      setState((previous) => ({
        ...previous,
        isLoading: true,
        progress: 0,
        error: null,
      }));

      try {
        const viewer = initializeViewer();
        if (!viewer) {
          throw new Error("Failed to initialize viewer");
        }

        let source: string;
        let filename: string;

        if (isUrl && typeof file === "string") {
          source = file;
          filename = file.split("/").pop()?.split("?")[0] || "sample.splat";
        } else if (file instanceof File) {
          if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
          }
          objectUrlRef.current = URL.createObjectURL(file);
          source = objectUrlRef.current;
          filename = file.name;
        } else {
          throw new Error("Invalid file input");
        }

        const format = getFileFormat(filename);

        await viewer.addSplatScene(source, {
          scale: [2, -2, 2],
          format,
          progressiveLoad: true,
          showLoadingUI: false,
          onProgress: (progress: number) => {
            const percent = Math.round(progress * 100);
            setState((previous) => ({ ...previous, progress: percent }));
          },
        });

        viewer.start();

        setTimeout(() => {
          const splatCount = viewer.getSplatCount
            ? viewer.getSplatCount()
            : "N/A";
          setState((previous) => ({
            ...previous,
            splatCount:
              typeof splatCount === "number"
                ? splatCount.toLocaleString()
                : String(splatCount),
          }));
        }, 500);

        setState((previous) => ({
          ...previous,
          isLoading: false,
          isViewerActive: true,
          filename,
        }));

        startFpsCounter();
      } catch (error) {
        console.error("Error loading splat:", error);
        setState((previous) => ({
          ...previous,
          isLoading: false,
          error: "Failed to load file. Please check the format.",
        }));
      }
    },
    [initializeViewer, startFpsCounter]
  );

  const loadSampleData = useCallback(() => {
    const sampleUrl =
      "https://huggingface.co/datasets/cakewalk/splat-data/resolve/main/nike.splat";
    loadSplatFile(sampleUrl, true);
  }, [loadSplatFile]);

  const resetCamera = useCallback(() => {
    if (viewerRef.current?.controls) {
      viewerRef.current.controls.reset();
    }
  }, []);

  const resetViewer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (viewerRef.current) {
      viewerRef.current.dispose();
      viewerRef.current = null;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    setState({
      isLoading: false,
      progress: 0,
      isViewerActive: false,
      filename: "-",
      splatCount: "-",
      fps: 0,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((previous) => ({ ...previous, error: null }));
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (viewerRef.current) {
        viewerRef.current.dispose();
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    state,
    loadSplatFile,
    loadSampleData,
    resetCamera,
    resetViewer,
    clearError,
  };
}
