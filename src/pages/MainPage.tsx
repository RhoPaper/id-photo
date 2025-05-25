import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { photoSpecs, PhotoSpec } from '@/types/photoSpec';
import ImageUpload from '@/components/ImageUpload';
import SpecSelector from '@/components/SpecSelector';
import ImageEditor from '@/components/ImageEditor';
import Preview from '@/components/Preview';

// 主API: remove.bg 背景去除
const removeBackground = async (imageData: string): Promise<string> => {
  const formData = new FormData();
  const blob = await fetch(imageData).then(res => res.blob());
  formData.append("image_file", blob);
  formData.append("size", "auto");
  
  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { 
      "X-Api-Key": "5epg3RbL5BPu9EAfSqMwzL9Q" 
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`remove.bg API error: ${response.status}`);
  }

  const result = await response.blob();
  return URL.createObjectURL(result);
};

// 备用API: removal.ai 背景去除
const removeBackgroundWithRemovalAI = async (imageData: string): Promise<string> => {
  const formData = new FormData();
  const blob = await fetch(imageData).then(res => res.blob());
  formData.append("image_file", blob);
  
  const response = await fetch("https://api.removal.ai/3.0/remove", {
    method: "POST",
    headers: { 
      "Rm-Token": "48691dff-7123-4eec-acf8-80e11648dec7"
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`removal.ai API error: ${response.status}`);
  }

  const result = await response.blob();
  return URL.createObjectURL(result);
};

// 带备用方案的背景去除
const removeBackgroundWithFallback = async (imageData: string): Promise<string> => {
  try {
    return await removeBackground(imageData);
  } catch (error) {
    toast.warning('主API调用失败，尝试备用服务...');
    try {
      return await removeBackgroundWithRemovalAI(imageData);
    } catch (fallbackError) {
      throw new Error('所有背景去除服务均不可用');
    }
  }
};

export default function MainPage() {
  const [selectedSpec, setSelectedSpec] = useState<PhotoSpec>(photoSpecs[0]);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [beautyMode, setBeautyMode] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);

  const handleImageUpload = (image: string) => {
    setOriginalImage(image);
    setProcessedImage(image);
  };

  const handleBackgroundRemove = async (image: string) => {
    try {
      const result = await removeBackgroundWithFallback(image);
      setProcessedImage(result);
      toast.success('AI背景去除成功');
    } catch (error) {
      toast.error('背景去除失败，请稍后再试');
      throw error;
    }
  };

  const handleDownload = async () => {
    if (!processedImage) {
      toast.error('没有可下载的图片');
      return;
    }

    try {
      // 创建一个canvas来合成图片
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('无法创建canvas上下文');

      // 加载处理后的图片
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = processedImage;
      });

      // 解析规格尺寸（例如：35mm×49mm）
      const [width, height] = selectedSpec.size.split('×').map(dim => 
        parseFloat(dim.replace('mm', ''))
      );
      const targetRatio = width / height;

      // 计算裁切尺寸
      let cropWidth = img.width;
      let cropHeight = img.height;
      let offsetX = 0;
      let offsetY = 0;

      const currentRatio = img.width / img.height;

      if (currentRatio > targetRatio) {
        // 图片太宽，需要裁切宽度
        cropWidth = Math.round(img.height * targetRatio);
        offsetX = Math.round((img.width - cropWidth) / 2);
      } else {
        // 图片太高，需要裁切高度
        cropHeight = Math.round(img.width / targetRatio);
        offsetY = Math.round((img.height - cropHeight) / 2);
      }

      // 设置canvas尺寸为目标尺寸
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // 如果有背景色，先绘制背景
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 绘制裁切后的图片
      ctx.drawImage(
        img,
        offsetX, offsetY, cropWidth, cropHeight,  // 源图像裁切区域
        0, 0, cropWidth, cropHeight               // 目标区域
      );

      // 将canvas转换为blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `证件照-${selectedSpec.name}-${new Date().getTime()}.png`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);
      
      toast.success('证件照下载成功');
    } catch (error) {
      console.error('下载失败:', error);
      toast.error('下载失败，请稍后再试');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <header className="bg-blue-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <i className="fa-solid fa-camera-retro text-2xl mr-2"></i>
          <h1 className="text-xl font-bold">证件照制作工具</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧操作区 */}
          <div className="space-y-6">
            <ImageUpload 
              onImageUpload={handleImageUpload} 
              onBackgroundRemove={handleBackgroundRemove}
            />
            <SpecSelector 
              specs={photoSpecs} 
              selectedSpec={selectedSpec} 
              onSelect={setSelectedSpec} 
            />
            <ImageEditor 
              brightness={brightness}
              contrast={contrast}
              beautyMode={beautyMode}
              backgroundColor={backgroundColor}
              onBrightnessChange={setBrightness}
              onContrastChange={setContrast}
              onBeautyModeChange={setBeautyMode}
              onBackgroundColorChange={setBackgroundColor}
            />
          </div>

          {/* 右侧预览区 */}
          <div className="flex flex-col">
            <Preview 
              originalImage={originalImage} 
              processedImage={processedImage}
              brightness={brightness}
              contrast={contrast}
              beautyMode={beautyMode}
              backgroundColor={backgroundColor}
            />
            <button
              onClick={handleDownload}
              disabled={!processedImage}
              className={`mt-4 py-2 px-4 rounded-md text-white font-medium ${
                processedImage ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
							下载证件照
            </button>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-100 text-gray-600 p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>© 2025 证件照制作工具 - 版权所有</p>
        </div>
      </footer>
    </div>
  );
}
