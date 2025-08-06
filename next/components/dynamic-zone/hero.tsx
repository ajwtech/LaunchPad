"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { Button } from "../elements/button";
import { Cover } from "../decorations/cover";

interface StrapiMedia {
  id: number;
  url: string;
  name: string;
  alternativeText?: string;
  mime: string;
  width?: number;
  height?: number;
}

interface HeroProps {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
  background_video?: StrapiMedia;
  overlay_enabled?: boolean;
  overlay_opacity?: number;
  overlay_color?: string;
  video_autoplay?: boolean;
  video_muted?: boolean;
  video_loop?: boolean;
}

export const Hero = ({ 
  heading, 
  sub_heading, 
  CTAs, 
  locale, 
  background_video,
  overlay_enabled = false,
  overlay_opacity = 0.5,
  overlay_color = "#000000",
  video_autoplay = true,
  video_muted = true,
  video_loop = false
}: HeroProps) => {
  return (
    <div className="h-[5
    0vh] overflow-hidden relative flex flex-col items-center justify-center">
      {/* Video background or gradient fallback */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.5 }}
        className="absolute inset-0 z-0"
      >
        {background_video ? (
          <>
            <video
              autoPlay={video_autoplay}
              muted={video_muted}
              loop={video_loop}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster={background_video.alternativeText || undefined}
            >
              <source src={background_video.url} type={background_video.mime} />
              {/* Fallback gradient if video fails to load */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
            </video>
            {/* Optional overlay for video muting */}
            {overlay_enabled && (
              <div 
                className="absolute inset-0 z-10"
                style={{
                  backgroundColor: overlay_color,
                  opacity: overlay_opacity
                }}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        )}
      </motion.div>
      <Heading
        as="h1"
        className="text-4xl md:text-4xl lg:text-8xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-4"
      >
        {heading.substring(0, heading.lastIndexOf(" "))} <Cover>{heading.split(" ").pop()}</Cover>
      </Heading>
      <Subheading className="text-center mt-2 md:mt-6 text-base md:text-xl text-muted-foreground max-w-3xl mx-auto relative z-20">
        {sub_heading}
      </Subheading>
      <div className="flex space-x-2 items-center mt-8 relative z-20">
        {CTAs && CTAs.map((cta) => (
          <Button
            key={cta?.id}
            as={Link}
            href={`/${locale}${cta.URL}`}
            {...(cta.variant && { variant: cta.variant })}
          >
            {cta.text}
          </Button>
        ))}
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1, 
          delay: 2,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 1
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
      >
        <div className="flex flex-col items-center space-y-2 cursor-pointer group">
          <IoChevronDown 
            className="w-6 h-6 text-foreground/70 group-hover:text-foreground transition-colors duration-200" 
          />
          <div className="w-px h-8 bg-foreground/30 group-hover:bg-foreground/50 transition-colors duration-200" />
        </div>
      </motion.div>
      
      <div className="absolute inset-x-0 bottom-0 h-80 w-full bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
