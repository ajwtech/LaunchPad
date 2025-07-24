"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Link } from "next-view-transitions";
import { BlurImage } from "./blur-image";

import { strapiImage } from "@/lib/strapi/strapiImage";
import { Image } from "@/types/types";

export const Logo = ({ image, locale }: { image?: Image, locale?: string }) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Link
        href={`/${locale || 'en'}`}
        className="font-normal flex space-x-2 items-center text-sm mr-4 relative z-20"
      >
        {image && (
          <BlurImage
            src={strapiImage(image?.url)}
            alt={image.alternativeText}
            width={200}
            height={200}
            className="h-10 w-10 rounded-xl mr-2"
          />
        )}
        <span className="font-bold text-foreground">LaunchPad</span>
      </Link>
    );
  }
  
  if (image) {
    return (
      <Link
        href={`/${locale || 'en'}`}
        className="font-normal flex space-x-2 items-center text-sm mr-4 relative z-20"
      >
        <BlurImage
          src={strapiImage(image?.url)}
          alt={image.alternativeText}
          width={200}
          height={200}
          className="h-10 w-10 rounded-xl mr-2"
        />

        <span 
          className="font-bold transition-colors duration-200 text-foreground"
        >
          LaunchPad
        </span>
      </Link>
    );
  }

  return null;
};
