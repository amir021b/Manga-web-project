"use client";

import { useState, useRef, useEffect } from 'react';

export const AVATAR_VIEWPORT = 160;
export const AVATAR_MIN_ZOOM = 1;
export const AVATAR_MAX_ZOOM = 4;

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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getFitSize(dims: ImgDims | null) {
  if (!dims || dims.width <= 0 || dims.height <= 0) {
    return { width: AVATAR_VIEWPORT, height: AVATAR_VIEWPORT };
  }

  const scale = Math.min(
    AVATAR_VIEWPORT / dims.width,
    AVATAR_VIEWPORT / dims.height,
  );

  return {
    width: dims.width * scale,
    height: dims.height * scale,
  };
}

function getMaxZoom(dims: ImgDims | null) {
  const fit = getFitSize(dims);
  const coverZoom = AVATAR_VIEWPORT / Math.max(1, Math.min(fit.width, fit.height));
  return Math.max(AVATAR_MAX_ZOOM, coverZoom * 1.5);
}

function constrainCrop(crop: CropState, dims: ImgDims | null): CropState {
  const zoom = clamp(crop.zoom, AVATAR_MIN_ZOOM, getMaxZoom(dims));
  const fit = getFitSize(dims);
  const maxX = Math.max(0, (fit.width * zoom - AVATAR_VIEWPORT) / 2);
  const maxY = Math.max(0, (fit.height * zoom - AVATAR_VIEWPORT) / 2);

  return {
    zoom,
    x: clamp(crop.x, -maxX, maxX),
    y: clamp(crop.y, -maxY, maxY),
  };
}

function useAvatarCrop(initialAvatar: string | null = null) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatar);
  const [imgDims, setImgDims] = useState<ImgDims | null>(null);
  const [crop, setCrop] = useState<CropState>({ zoom: AVATAR_MIN_ZOOM, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<PanStart>({ x: 0, y: 0, cropX: 0, cropY: 0 });
  const panningRef = useRef(false);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview, avatarFile]);

  useEffect(() => {
    if (!avatarPreview) return;

    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (cancelled) return;
      const dims = { width: img.naturalWidth, height: img.naturalHeight };
      setImgDims(dims);
      setCrop({ zoom: AVATAR_MIN_ZOOM, x: 0, y: 0 });
    };

    img.onerror = () => {
      if (cancelled) return;
      setImgDims(null);
      setCrop({ zoom: AVATAR_MIN_ZOOM, x: 0, y: 0 });
    };

    img.src = avatarPreview;

    return () => {
      cancelled = true;
    };
  }, [avatarPreview]);

  const resetCrop = () => {
    setCrop({ zoom: AVATAR_MIN_ZOOM, x: 0, y: 0 });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
    setImgDims(null);
    setCrop({ zoom: AVATAR_MIN_ZOOM, x: 0, y: 0 });
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handlePanStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!avatarPreview || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    panningRef.current = true;
    setIsPanning(true);
    panStart.current = {
      x: e.clientX,
      y: e.clientY,
      cropX: crop.x,
      cropY: crop.y,
    };
  };

  const handlePanMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!panningRef.current) return;
    e.preventDefault();

    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;

    setCrop((current) =>
      constrainCrop(
        {
          ...current,
          x: panStart.current.cropX + dx,
          y: panStart.current.cropY + dy,
        },
        imgDims,
      ),
    );
  };

  const handlePanEnd = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (!panningRef.current) return;
    panningRef.current = false;
    setIsPanning(false);

    if (e && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextZoom = Number.parseFloat(e.target.value);
    const zoom = Number.isFinite(nextZoom)
      ? clamp(nextZoom, AVATAR_MIN_ZOOM, getMaxZoom(imgDims))
      : AVATAR_MIN_ZOOM;

    setCrop((current) => constrainCrop({ ...current, zoom }, imgDims));
  };

  const cropImage = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!avatarPreview) return resolve(null);

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = AVATAR_VIEWPORT;
        canvas.height = AVATAR_VIEWPORT;

        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        const dims = { width: img.naturalWidth, height: img.naturalHeight };
        const fit = getFitSize(dims);
        const totalScale = (fit.width / dims.width) * crop.zoom;
        const displayedWidth = dims.width * totalScale;
        const displayedHeight = dims.height * totalScale;
        const left = (AVATAR_VIEWPORT - displayedWidth) / 2 + crop.x;
        const top = (AVATAR_VIEWPORT - displayedHeight) / 2 + crop.y;

        ctx.beginPath();
        ctx.arc(
          AVATAR_VIEWPORT / 2,
          AVATAR_VIEWPORT / 2,
          AVATAR_VIEWPORT / 2,
          0,
          Math.PI * 2,
        );
        ctx.closePath();
        ctx.clip();
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          img,
          left,
          top,
          displayedWidth,
          displayedHeight,
        );

        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => resolve(null);
      img.src = avatarPreview;
    });
  };

  const fit = getFitSize(imgDims);

  return {
    avatarFile,
    setAvatarFile,
    avatarPreview,
    setAvatarPreview,
    crop,
    setCrop,
    isPanning,
    resetCrop,
    handleAvatarChange,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handleZoom,
    cropImage,
    previewWidth: fit.width,
    previewHeight: fit.height,
    minZoom: AVATAR_MIN_ZOOM,
    maxZoom: getMaxZoom(imgDims),
  };
}

export default useAvatarCrop;
