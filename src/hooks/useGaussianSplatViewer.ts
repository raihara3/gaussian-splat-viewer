import { useRef, useCallback, useState, useEffect } from "react";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import * as THREE from "three";
import {
  type ViewerSettings,
  defaultViewerSettings,
  backgroundColorValues,
} from "../types/viewer";

interface ViewerState {
  isLoading: boolean;
  progress: number;
  isViewerActive: boolean;
  filename: string;
  splatCount: string;
  fps: number;
  error: string | null;
  memoryUsage: string;
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

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function hexToNumber(hex: string): number {
  return parseInt(hex.replace("#", ""), 16);
}

export function useGaussianSplatViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<GaussianSplats3D.Viewer | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const fpsFramesRef = useRef(0);
  const fpsTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number | null>(null);
  const autoRotateRef = useRef<number | null>(null);
  const cameraAngleRef = useRef(0);

  const [state, setState] = useState<ViewerState>({
    isLoading: false,
    progress: 0,
    isViewerActive: false,
    filename: "-",
    splatCount: "-",
    fps: 0,
    error: null,
    memoryUsage: "-",
  });

  const [settings, setSettings] = useState<ViewerSettings>(
    defaultViewerSettings
  );

  const updateMemoryUsage = useCallback(() => {
    const gl = viewerRef.current?.renderer?.getContext();
    if (gl) {
      const extension = gl.getExtension("WEBGL_debug_renderer_info");
      if (extension) {
        const memoryInfo = (
          gl as WebGL2RenderingContext & {
            getParameter: (parameter: number) => unknown;
          }
        ).getExtension("GMAN_webgl_memory");
        if (memoryInfo) {
          const info = (
            memoryInfo as { getMemoryInfo: () => { memory: { total: number } } }
          ).getMemoryInfo();
          setState((previous) => ({
            ...previous,
            memoryUsage: formatBytes(info.memory.total),
          }));
          return;
        }
      }
    }

    if (typeof performance !== "undefined" && "memory" in performance) {
      const memory = (performance as { memory: { usedJSHeapSize: number } })
        .memory;
      setState((previous) => ({
        ...previous,
        memoryUsage: formatBytes(memory.usedJSHeapSize),
      }));
    } else {
      setState((previous) => ({ ...previous, memoryUsage: "N/A" }));
    }
  }, []);

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

  const applyBackgroundColor = useCallback(
    (currentSettings: ViewerSettings) => {
      if (!viewerRef.current?.renderer) return;

      const renderer = viewerRef.current.renderer as THREE.WebGLRenderer;
      let colorValue: number;

      if (currentSettings.backgroundColor === "custom") {
        colorValue = hexToNumber(currentSettings.customBackgroundColor);
      } else {
        colorValue = backgroundColorValues[currentSettings.backgroundColor];
      }

      renderer.setClearColor(colorValue, 1);
    },
    []
  );

  const startFpsCounter = useCallback(() => {
    const updateFps = () => {
      fpsFramesRef.current++;
      const now = performance.now();
      if (now - fpsTimeRef.current >= 1000) {
        setState((previous) => ({ ...previous, fps: fpsFramesRef.current }));
        fpsFramesRef.current = 0;
        fpsTimeRef.current = now;
        updateMemoryUsage();
      }
      animationFrameRef.current = requestAnimationFrame(updateFps);
    };
    updateFps();
  }, [updateMemoryUsage]);

  const startAutoRotate = useCallback((speed: number) => {
    if (autoRotateRef.current) {
      cancelAnimationFrame(autoRotateRef.current);
    }

    const controls = viewerRef.current?.controls as unknown as {
      object?: THREE.Camera;
      target?: THREE.Vector3;
    };

    if (!controls?.object || !controls?.target) return;

    const cameraPosition = controls.object.position;
    const target = controls.target;

    const dx = cameraPosition.x - target.x;
    const dz = cameraPosition.z - target.z;
    const horizontalRadius = Math.sqrt(dx * dx + dz * dz);
    const cameraHeight = cameraPosition.y;

    cameraAngleRef.current = Math.atan2(dx, dz);

    const rotate = () => {
      if (!viewerRef.current?.controls) return;

      cameraAngleRef.current += 0.005 * speed;

      const currentControls = viewerRef.current.controls as unknown as {
        object?: THREE.Camera;
        target?: THREE.Vector3;
      };

      if (currentControls.object && currentControls.target) {
        currentControls.object.position.x =
          currentControls.target.x +
          horizontalRadius * Math.sin(cameraAngleRef.current);
        currentControls.object.position.z =
          currentControls.target.z +
          horizontalRadius * Math.cos(cameraAngleRef.current);
        currentControls.object.position.y = cameraHeight;
        currentControls.object.lookAt(currentControls.target);
      }

      autoRotateRef.current = requestAnimationFrame(rotate);
    };

    rotate();
  }, []);

  const stopAutoRotate = useCallback(() => {
    if (autoRotateRef.current) {
      cancelAnimationFrame(autoRotateRef.current);
      autoRotateRef.current = null;
    }
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
          scale: [2, -2, -2],
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
          applyBackgroundColor(settings);

          if (viewer.splatMesh) {
            if (settings.pointCloudMode) {
              viewer.splatMesh.setPointCloudModeEnabled(true);
            }
            viewer.splatMesh.setSplatScale(settings.pointSize);
          }

          if (settings.autoRotate) {
            startAutoRotate(settings.autoRotateSpeed);
          }
        }, 500);

        const updateSplatCount = () => {
          try {
            let splatCount: number | string = "N/A";
            if (viewer.splatMesh?.getSplatCount) {
              splatCount = viewer.splatMesh.getSplatCount();
            } else if (typeof viewer.getSplatCount === "function") {
              splatCount = viewer.getSplatCount();
            }

            if (typeof splatCount === "number" && splatCount > 0) {
              setState((previous) => ({
                ...previous,
                splatCount: splatCount.toLocaleString(),
              }));
            } else {
              setTimeout(updateSplatCount, 1000);
            }
          } catch {
            setTimeout(updateSplatCount, 1000);
          }
        };
        setTimeout(updateSplatCount, 1000);

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
    [
      initializeViewer,
      startFpsCounter,
      settings,
      applyBackgroundColor,
      startAutoRotate,
    ]
  );

  const loadSampleData = useCallback(() => {
    const sampleUrl =
      "https://huggingface.co/datasets/cakewalk/splat-data/resolve/main/nike.splat";
    loadSplatFile(sampleUrl, true);
  }, [loadSplatFile]);

  const resetCamera = useCallback(() => {
    if (viewerRef.current?.controls) {
      viewerRef.current.controls.reset();
      cameraAngleRef.current = 0;
    }
  }, []);

  const resetViewer = useCallback(() => {
    stopAutoRotate();

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
      memoryUsage: "-",
    });
  }, [stopAutoRotate]);

  const clearError = useCallback(() => {
    setState((previous) => ({ ...previous, error: null }));
  }, []);

  const updateSettings = useCallback(
    (newSettings: Partial<ViewerSettings>) => {
      setSettings((previous) => {
        const updated = { ...previous, ...newSettings };

        if (viewerRef.current) {
          if (
            newSettings.backgroundColor !== undefined ||
            newSettings.customBackgroundColor !== undefined
          ) {
            applyBackgroundColor(updated);
          }

          if (
            newSettings.pointCloudMode !== undefined &&
            viewerRef.current.splatMesh
          ) {
            viewerRef.current.splatMesh.setPointCloudModeEnabled(
              updated.pointCloudMode
            );
          }

          if (
            newSettings.pointSize !== undefined &&
            viewerRef.current.splatMesh
          ) {
            viewerRef.current.splatMesh.setSplatScale(updated.pointSize);
          }

          if (newSettings.autoRotate !== undefined) {
            if (updated.autoRotate) {
              startAutoRotate(updated.autoRotateSpeed);
            } else {
              stopAutoRotate();
            }
          }

          if (newSettings.autoRotateSpeed !== undefined && updated.autoRotate) {
            stopAutoRotate();
            startAutoRotate(updated.autoRotateSpeed);
          }
        }

        return updated;
      });
    },
    [applyBackgroundColor, startAutoRotate, stopAutoRotate]
  );

  useEffect(() => {
    return () => {
      stopAutoRotate();
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
  }, [stopAutoRotate]);

  return {
    containerRef,
    state,
    settings,
    loadSplatFile,
    loadSampleData,
    resetCamera,
    resetViewer,
    clearError,
    updateSettings,
  };
}
