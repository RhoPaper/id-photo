interface ImageEditorProps {
  brightness: number;
  contrast: number;
  beautyMode: boolean;
  backgroundColor: string | null;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onBeautyModeChange: (value: boolean) => void;
  onBackgroundColorChange: (value: string | null) => void;
}

const BACKGROUND_COLORS = [
  { value: null, label: '无背景', color: 'transparent' },
  { value: '#02A7F0', label: '浅蓝', color: '#02A7F0' },
  { value: '#3492C4', label: '深蓝', color: '#3492C4' },
  { value: '#D9001B', label: '暗红', color: '#D9001B' },
  { value: '#FF0000', label: '亮红', color: '#FF0000' },
  { value: '#FFFFFF', label: '纯白', color: '#FFFFFF' },
];

export default function ImageEditor({
  brightness,
  contrast,
  beautyMode,
  backgroundColor,
  onBrightnessChange,
  onContrastChange,
  onBeautyModeChange,
  onBackgroundColorChange,
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

        <div>
          <span className="text-sm text-gray-600 block mb-2">背景颜色</span>
          <div className="grid grid-cols-3 gap-2">
            {BACKGROUND_COLORS.map(({ value, label, color }) => (
              <button
                key={value || 'transparent'}
                onClick={() => onBackgroundColorChange(value)}
                className={`flex items-center justify-center p-2 rounded-md border transition-colors ${
                  backgroundColor === value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full mr-2 border border-gray-200"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
