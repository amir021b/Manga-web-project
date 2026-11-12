import { useState, useRef, useEffect } from 'react';

const VIEWPORT = 160;

interface CropState {
  zoom: number;
  x: number;
  y: number;
}

interface PanStart {
  x: number;
  y: number;
  cropX: number;
  cropY: number;
}

interface ImgDims {
  width: number;
  height: number;
}

function useAvatarCrop(initialAvatar: string | null = null) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatar);
  const [imgDims, setImgDims] = useState<ImgDims | null>(null);
  const [crop, setCrop] = useState<CropState>({ zoom: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<PanStart>({ x: 0, y: 0, cropX: 0, cropY: 0 });

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview, avatarFile]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgDims({ width: img.naturalWidth, height: img.naturalHeight });
      const fs = Math.min(VIEWPORT / img.naturalWidth, VIEWPORT / img.naturalHeight);
      setCrop({ zoom: fs, x: 0, y: 0 });
    };
    img.onerror = () => {
      setImgDims(null);
      setCrop({ zoom: 1, x: 0, y: 0 });
    };
    img.src = avatarPreview || '';
  }, [avatarPreview]);

  const resetCrop = () => {
    const fs = imgDims
      ? Math.min(VIEWPORT / imgDims.width, VIEWPORT / imgDims.height)
      : 1;
    setCrop({ zoom: fs, x: 0, y: 0 });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (!avatarPreview) return;
    setIsPanning(true);
    panStart.current = {
      x: e.clientX,
      y: e.clientY,
      cropX: crop.x,
      cropY: crop.y,
    };
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setCrop((c) => ({
      ...c,
      x: panStart.current.cropX + dx,
      y: panStart.current.cropY + dy,
    }));
  };

  const handlePanEnd = () => setIsPanning(false);

  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zoom = parseFloat(e.target.value);
    setCrop((c) => ({ ...c, zoom }));
  };

  const cropImage = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!avatarPreview) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = VIEWPORT;
        canvas.height = VIEWPORT;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.beginPath();
        ctx.arc(VIEWPORT / 2, VIEWPORT / 2, VIEWPORT / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const scale = crop.zoom;
        const dispW = img.naturalWidth * scale;
        const dispH = img.naturalHeight * scale;
        const left = VIEWPORT / 2 - dispW / 2 + crop.x;
        const top = VIEWPORT / 2 - dispH / 2 + crop.y;
        const sx = (0 - left) / scale;
        const sy = (0 - top) / scale;
        const sSize = VIEWPORT / scale;
        ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, VIEWPORT, VIEWPORT);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = avatarPreview;
    });
  };

  const transform = `translate(-50%, -50%) translate(${crop.x}px, ${crop.y}px) scale(${crop.zoom})`;

  return {
    avatarFile,
    setAvatarFile,
    avatarPreview,
    setAvatarPreview,
    crop,
    setCrop,
    isPanning,
    setIsPanning,
    panStart,
    resetCrop,
    handleAvatarChange,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handleZoom,
    cropImage,
    transform,
  };
}

export default useAvatarCrop;
