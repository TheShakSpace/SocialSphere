import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileImage, X, RefreshCw } from "lucide-react";
import axios from "axios";

interface ImageUploadProps {
  label: string;
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  onClear?: () => void;
  aspectRatio?: string; // e.g. "aspect-[16/9]" or "aspect-square"
  maxHeightClass?: string; // e.g. "max-h-[160px]"
  compressMaxWidth?: number;
  compressMaxHeight?: number;
  compressQuality?: number;
}

export default function ImageUpload({
  label,
  onUploadSuccess,
  currentImageUrl,
  onClear,
  aspectRatio = "aspect-[16/9]",
  maxHeightClass = "max-h-[180px]",
  compressMaxWidth = 1200,
  compressMaxHeight = 1200,
  compressQuality = 0.8,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side image compression helper
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > compressMaxWidth) {
            height = Math.round((height * compressMaxWidth) / width);
            width = compressMaxWidth;
          }
          if (height > compressMaxHeight) {
            width = Math.round((width * compressMaxHeight) / height);
            height = compressMaxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Compression failed"));
              }
            },
            "image/jpeg",
            compressQuality
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const processAndUploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files are supported.");
      return;
    }

    setUploading(true);
    setProgress(5); // Initial state
    setCompressionRatio(null);

    // Create a local object URL for instant preview before upload completes
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const originalSize = file.size;
      setProgress(15);

      // Perform compression
      const compressedBlob = await compressImage(file);
      const compressedSize = compressedBlob.size;
      const savings = Math.round(((originalSize - compressedSize) / originalSize) * 100);
      
      if (savings > 0) {
        setCompressionRatio(`Compressed by ${savings}% (${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB)`);
      } else {
        setCompressionRatio(`Optimized size: ${(compressedSize / 1024).toFixed(0)}KB`);
      }
      setProgress(30);

      // Prepare form data
      const formData = new FormData();
      formData.append("image", compressedBlob, file.name || "upload.jpg");

      // Upload with progress tracking
      const token = localStorage.getItem("socialsphere_token");
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const calculatedProgress = Math.min(
              95,
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
            setProgress(calculatedProgress);
          } else {
            setProgress((prev) => Math.min(95, prev + 10));
          }
        },
      });

      setProgress(100);
      if (response.data?.url) {
        onUploadSuccess(response.data.url);
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert("Failed to upload image. Falling back to local preview.");
      // Fallback: use base64 or object URL directly for client-side persistence
      const fallbackUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      onUploadSuccess(fallbackUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processAndUploadFile(e.target.files[0]);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const displayedImage = previewUrl || currentImageUrl;

  return (
    <div className="w-full">
      <span className="block font-sans text-[10px] text-muted-custom font-bold uppercase tracking-wider mb-2">
        {label}
      </span>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {displayedImage ? (
        <div className={`relative rounded-xl overflow-hidden border border-border-custom bg-black/5 dark:bg-white/5 ${aspectRatio} ${maxHeightClass} group`}>
          <img
            src={displayedImage}
            alt="Preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            {compressionRatio && (
              <span className="text-[10px] text-white/90 font-mono font-medium block">
                {compressionRatio}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setPreviewUrl(null);
              setCompressionRatio(null);
              if (onClear) onClear();
            }}
            className="absolute top-2.5 right-2.5 rounded-full bg-black/70 p-2 text-white hover:text-red-400 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerSelect}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-primary-custom bg-primary-custom/5 scale-[0.99]"
              : "border-border-custom bg-black/[0.01] dark:bg-white/[0.01] hover:border-primary-custom/40 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
          }`}
        >
          <div className="rounded-full bg-black/5 dark:bg-white/5 p-3 mb-2.5 text-muted-custom">
            <UploadCloud className="h-5 w-5 text-primary-custom" />
          </div>
          <p className="font-sans text-xs font-bold text-text-custom mb-1 text-center">
            Drag & Drop image here
          </p>
          <p className="font-sans text-[10px] text-muted-custom text-center">
            or click to select file
          </p>
        </div>
      )}

      {/* Progress Bar & Compression Tag */}
      {uploading && (
        <div className="mt-3 bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 font-heading text-[10px] font-bold text-text-custom">
              <RefreshCw className="h-3 w-3 animate-spin text-primary-custom" />
              <span>TRANSMITTING IMAGE DATA...</span>
            </span>
            <span className="font-mono text-[10px] font-bold text-primary-custom">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-custom to-secondary-custom h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {compressionRatio && (
            <span className="block mt-1.5 font-mono text-[9px] text-muted-custom">
              {compressionRatio}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
