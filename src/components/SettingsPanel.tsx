import { useState } from "react";
import type { ViewerSettings, BackgroundColor } from "../types/viewer";

interface SettingsPanelProps {
  visible: boolean;
  settings: ViewerSettings;
  onSettingsChange: (settings: Partial<ViewerSettings>) => void;
  memoryUsage: string;
}

export function SettingsPanel({
  visible,
  settings,
  onSettingsChange,
  memoryUsage,
}: SettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed top-20 left-[30px] z-[100] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[13px] w-[280px]">
      <button
        className="w-full px-5 py-3 flex items-center justify-between text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded-t-xl transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium">Settings</span>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-5 pb-4 space-y-4">
          <div>
            <label className="block text-[var(--text-secondary)] mb-2">
              Background
            </label>
            <div className="flex gap-2">
              {(["black", "white", "gray"] as BackgroundColor[]).map(
                (color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-lg border-2 transition-colors ${
                      settings.backgroundColor === color
                        ? "border-[var(--accent)]"
                        : "border-transparent"
                    }`}
                    style={{
                      backgroundColor:
                        color === "black"
                          ? "#0a0a0f"
                          : color === "white"
                            ? "#ffffff"
                            : "#808080",
                    }}
                    onClick={() => onSettingsChange({ backgroundColor: color })}
                    title={color.charAt(0).toUpperCase() + color.slice(1)}
                  />
                )
              )}
              <input
                type="color"
                value={settings.customBackgroundColor}
                onChange={(event) =>
                  onSettingsChange({
                    backgroundColor: "custom",
                    customBackgroundColor: event.target.value,
                  })
                }
                className={`w-8 h-8 rounded-lg border-2 cursor-pointer ${
                  settings.backgroundColor === "custom"
                    ? "border-[var(--accent)]"
                    : "border-transparent"
                }`}
                title="Custom Color"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span>Point Cloud Mode</span>
              <button
                className={`w-10 h-5 rounded-full transition-colors ${
                  settings.pointCloudMode
                    ? "bg-[var(--accent)]"
                    : "bg-[var(--border)]"
                }`}
                onClick={() =>
                  onSettingsChange({ pointCloudMode: !settings.pointCloudMode })
                }
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.pointCloudMode
                      ? "translate-x-5"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] mb-2">
              Point Size: {settings.pointSize.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={settings.pointSize}
              onChange={(event) =>
                onSettingsChange({ pointSize: parseFloat(event.target.value) })
              }
              className="w-full h-2 bg-[var(--bg-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
          </div>

          <div>
            <label className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span>Auto Rotate</span>
              <button
                className={`w-10 h-5 rounded-full transition-colors ${
                  settings.autoRotate
                    ? "bg-[var(--accent)]"
                    : "bg-[var(--border)]"
                }`}
                onClick={() =>
                  onSettingsChange({ autoRotate: !settings.autoRotate })
                }
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.autoRotate ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
            {settings.autoRotate && (
              <div className="mt-2">
                <label className="block text-[var(--text-secondary)] text-xs mb-1">
                  Speed: {settings.autoRotateSpeed.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={settings.autoRotateSpeed}
                  onChange={(event) =>
                    onSettingsChange({
                      autoRotateSpeed: parseFloat(event.target.value),
                    })
                  }
                  className="w-full h-2 bg-[var(--bg-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                />
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[var(--border)]">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>GPU Memory</span>
              <span className="font-mono text-[var(--accent)]">
                {memoryUsage}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
