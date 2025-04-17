"use client";

// =======================================================================================================

import { cn } from "@/lib/utils";
import { default as NextImage, ImageProps as NextImageProps } from "next/image";
import { useState } from "react";

// =======================================================================================================

export type ImageProps = NextImageProps & {
  containerClassName?: string;
  loadingClassName?: string;
};

// =======================================================================================================

export default function Image({ containerClassName, loadingClassName, ...props }: ImageProps) {
  const [imageIsLoading, setImageIsLoading] = useState(true);

  return (
    <div
      className={cn(
        "relative",
        containerClassName,
        imageIsLoading && `animate-pulse bg-primary-900/15 ${loadingClassName}`
      )}
    >
      <NextImage {...props} onLoad={() => setImageIsLoading(false)} fill />
    </div>
  );
}

// =======================================================================================================
