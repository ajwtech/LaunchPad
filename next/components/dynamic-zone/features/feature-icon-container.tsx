import { cn } from "@/lib/utils";
import React from "react";

export const FeatureIconContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className=" [perspective:400px] [transform-style:preserve-3d]">
      <div
        className={cn(
          "h-14 w-14 p-[4px] rounded-md bg-gradient-to-b from-accent to-muted mx-auto relative"
        )}
        style={{
          transform: "rotateX(25deg)",
          transformOrigin: "center",
        }}
      >
        <div
          className={cn(
            "bg-primary rounded-[5px] h-full w-full relative z-20 flex items-center justify-center",
            className
          )}
        >
          {children}
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-muted-foreground opacity-50 rounded-full blur-lg h-4 w-full mx-auto z-30"></div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-border to-transparent h-px w-[60%] mx-auto"></div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-transparent via-border blur-sm to-transparent h-[8px] w-[60%] mx-auto"></div>
      </div>
    </div>
  );
};
