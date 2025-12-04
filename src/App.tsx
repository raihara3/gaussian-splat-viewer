import { useCallback } from "react";
import { Header } from "./components/Header";
import { DropZone } from "./components/DropZone";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { InfoPanel } from "./components/InfoPanel";
import { ControlsPanel } from "./components/ControlsPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { ErrorMessage } from "./components/ErrorMessage";
import { useGaussianSplatViewer } from "./hooks/useGaussianSplatViewer";

export default function App() {
  const {
    containerRef,
    state,
    settings,
    loadSplatFile,
    loadSampleData,
    resetCamera,
    resetViewer,
    clearError,
    updateSettings,
  } = useGaussianSplatViewer();

  const handleFileSelect = useCallback(
    (file: File) => {
      loadSplatFile(file);
    },
    [loadSplatFile]
  );

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 z-[1]"
      />

      <Header />

      <DropZone
        visible={!state.isViewerActive && !state.isLoading}
        onFileSelect={handleFileSelect}
        onLoadSample={loadSampleData}
      />

      <LoadingOverlay visible={state.isLoading} progress={state.progress} />

      <SettingsPanel
        visible={state.isViewerActive}
        settings={settings}
        onSettingsChange={updateSettings}
        memoryUsage={state.memoryUsage}
      />

      <InfoPanel
        visible={state.isViewerActive}
        filename={state.filename}
        splatCount={state.splatCount}
        fps={state.fps}
      />

      <ControlsPanel
        visible={state.isViewerActive}
        onReset={resetCamera}
        onNewFile={resetViewer}
      />

      <ErrorMessage message={state.error} onDismiss={clearError} />
    </>
  );
}
