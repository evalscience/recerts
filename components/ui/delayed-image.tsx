"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface DelayedImageProps extends Omit<ImageProps, "onLoad"> {
  src: string;
  alt: string;
}

export default function DelayedImage({
  src,
  alt,
  ...props
}: DelayedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImageLoaded(true);
  }, [src]);

  if (!imageLoaded) {
    return null; // Don't render anything until the image is loaded
  }

  return <Image src={src} alt={alt} {...props} />;
}
