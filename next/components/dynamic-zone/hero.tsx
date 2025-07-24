"use client";
import React from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { sceneConfigurations } from '@/components/decorations/architectural-elements/scenes';

// Import ArchitecturalCAD dynamically with SSR disabled to prevent hydration issues
const ArchitecturalCAD = dynamic(
  () => import('@/components/decorations/architectural-cad'),
  { ssr: false }
);

import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { Button } from "../elements/button";
import { Cover } from "../decorations/cover";
import { motion } from "framer-motion";

export const Hero = ({ heading, sub_heading, CTAs, locale }: { heading: string; sub_heading: string; CTAs: any[], locale: string }) => {
  return (
    <div className="h-[80vh] overflow-hidden relative flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.5 }}
        className="absolute inset-0 z-0"
      >
        <ArchitecturalCAD {...sceneConfigurations.heroSection} />
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
      <div className="absolute inset-x-0 bottom-0 h-80 w-full bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
