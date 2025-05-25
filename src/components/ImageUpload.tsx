import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageUpload: (image: string) => void;
  onBackgroundRemove: (image: string) => Promise<void>;
}

export default function ImageUpload({ onImageUpload, onBackgroundRemove }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      toast.error('仅支持JPG/PNG格式的图片');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('图片大小不能超过10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageData = e.target.result as string;
        onImageUpload(imageData);
        
        // 自动触发背景去除
        setIsProcessing(true);
        onBackgroundRemove(imageData)
          .catch(() => toast.error('背景去除失败'))
          .finally(() => setIsProcessing(false));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">上传照片</h2>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        } ${isProcessing ? 'opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {isProcessing ? (
          <>
            <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-500 mb-3"></i>
            <p className="text-gray-600 mb-2">AI正在去除背景...</p>
          </>
        ) : (
          <>
            <i className="fa-solid fa-cloud-arrow-up text-4xl text-blue-500 mb-3"></i>
            <p className="text-gray-600 mb-2">
              {isDragging ? '松开鼠标上传照片' : '拖放照片到此处或点击上传'}
            </p>
            <p className="text-sm text-gray-500">支持JPG/PNG格式，最大10MB</p>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
}
