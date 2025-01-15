"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

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
