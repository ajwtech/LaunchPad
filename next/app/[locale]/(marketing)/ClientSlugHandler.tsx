"use client";

import { useEffect, useRef } from "react";
import { useSlugContext } from "@/app/context/SlugContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function ClientSlugHandler({
  localizedSlugs,
  missingSlug,
}: {
  localizedSlugs: Record<string, string>;
  missingSlug?: string;
}) {
  const { dispatch } = useSlugContext();
  const { showToast } = useToast();
  const router = useRouter();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (localizedSlugs) {
      dispatch({ type: "SET_SLUGS", payload: localizedSlugs });
    }
  }, [localizedSlugs, dispatch]);

  useEffect(() => {
    if (missingSlug && !toastShownRef.current) {
      toastShownRef.current = true;
      showToast(
        `Page "${missingSlug}" not found. Showing home page instead.`,
        'warning',
        6000
      );
    }
  }, [missingSlug, showToast]);

  useEffect(() => {
    const handleMessage = async (message: MessageEvent<any>) => {
      if (
        message.origin === process.env.NEXT_PUBLIC_API_URL &&
        message.data.type === "strapiUpdate"
      ) {
        router.refresh();
      }
    };

    // Add the event listener
    window.addEventListener("message", handleMessage);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

  return null; // This component only handles the state and doesn't render anything.
}
