'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/container';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden w-full min-h-[60vh] flex items-center justify-center">
      <Container className="text-center py-20">
        <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Go Back
          </button>
        </div>
      </Container>
    </div>
  );
}
