"use client";

import { useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function ProductNotFound({ 
  slug, 
  locale,
  redirectPath = "/products" 
}: { 
  slug: string; 
  locale: string;
  redirectPath?: string;
}) {
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    showToast(
      `Product "${slug}" not found. Redirecting to products page.`,
      'error',
      5000
    );

    // Redirect after a short delay to allow toast to be seen
    const timeout = setTimeout(() => {
      router.push(`/${locale}${redirectPath}`);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [slug, locale, redirectPath, showToast, router]);

  return (
    <div className="relative overflow-hidden w-full min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The product &quot;{slug}&quot; could not be found.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Redirecting to products page...
        </p>
      </div>
    </div>
  );
}
