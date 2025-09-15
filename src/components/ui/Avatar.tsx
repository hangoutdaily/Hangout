"use client";

import Image from "next/image";

type AvatarProps = {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
};

export default function Avatar({ src, alt, size = "md" }: AvatarProps) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-full 
                 border border-border bg-surface"
      style={{ width: sizeMap[size], height: sizeMap[size] }}
    >
      <Image
        src={src}
        alt={alt}
        width={sizeMap[size]}
        height={sizeMap[size]}
        className="object-cover"
      />
    </div>
  );
}
