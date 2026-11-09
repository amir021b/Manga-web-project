import { useState, useRef, useEffect } from 'react';

function useAvatarCrop(initialAvatar = null) {
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(initialAvatar);
  const [crop, setCrop] = useState({ zoom: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, cropX: 0, cropY: 0 });

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview, avatarFile]);

  const resetCrop = () => setCrop({ zoom: 1, x: 0, y: 0 });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    resetCrop();
  };

  const handlePanStart = (e) => {
    if (!avatarPreview) return;
    setIsPanning(true);
    panStart.current = {
      x: e.clientX,
      y: e.clientY,
      cropX: crop.x,
      cropY: crop.y,
    };
  };

  const handlePanMove = (e) => {
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

  const handleZoom = (e) => {
    const zoom = parseFloat(e.target.value);
    setCrop((c) => ({ ...c, zoom }));
  };

  const cropImage = () => {
    const VIEWPORT = 160;
    return new Promise((resolve) => {
      if (!avatarPreview) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = VIEWPORT;
        canvas.height = VIEWPORT;
        const ctx = canvas.getContext('2d');
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
