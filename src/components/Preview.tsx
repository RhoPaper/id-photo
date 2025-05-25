interface PreviewProps {
  originalImage: string | null;
  processedImage: string | null;
  brightness: number;
  contrast: number;
  beautyMode: boolean;
  backgroundColor: string | null;
}

export default function Preview({
  originalImage,
  processedImage,
  brightness,
  contrast,
  beautyMode,
  backgroundColor,
}: PreviewProps) {
  const getImageStyle = () => {
    const filters = [];
    if (brightness !== 0) filters.push(`brightness(${100 + brightness}%)`);
    if (contrast !== 0) filters.push(`contrast(${100 + contrast}%)`);
    if (beautyMode) filters.push('blur(0.5px) saturate(1.5)');
    
    return filters.length > 0 ? { filter: filters.join(' ') } : {};
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">效果预览</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">原图</h3>
          <div className="bg-gray-100 rounded-md overflow-hidden aspect-[3/4] flex items-center justify-center">
            {originalImage ? (
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400">
                <i className="fa-solid fa-image text-4xl mb-2"></i>
                <p className="text-sm">未上传图片</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">效果图</h3>
          <div 
            className="rounded-md overflow-hidden aspect-[3/4] flex items-center justify-center relative"
            style={{ backgroundColor: backgroundColor || 'transparent' }}
          >
            {processedImage ? (
              <img
                src={processedImage}
                alt="Processed"
                className="w-full h-full object-cover"
                style={{
                  ...getImageStyle(),
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            ) : (
              <div className="text-gray-400">
                <i className="fa-solid fa-wand-magic-sparkles text-4xl mb-2"></i>
                <p className="text-sm">等待处理</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
