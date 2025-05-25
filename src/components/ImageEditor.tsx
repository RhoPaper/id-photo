interface ImageEditorProps {
  brightness: number;
  contrast: number;
  beautyMode: boolean;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onBeautyModeChange: (value: boolean) => void;
}

export default function ImageEditor({
  brightness,
  contrast,
  beautyMode,
  onBrightnessChange,
  onContrastChange,
  onBeautyModeChange,
}: ImageEditorProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">图像处理</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">亮度: {brightness}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={brightness}
            onChange={(e) => onBrightnessChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">对比度: {contrast}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={contrast}
            onChange={(e) => onContrastChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">美颜效果</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={beautyMode}
              onChange={(e) => onBeautyModeChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
