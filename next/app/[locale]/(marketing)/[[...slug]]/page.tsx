import { Metadata } from 'next';
import PageContent from '@/lib/shared/PageContent';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { generateMetadataObject } from '@/lib/shared/metadata';
import ClientSlugHandler from '../ClientSlugHandler';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug?: string[] };
}): Promise<Metadata> {
  const slug = params.slug?.[0] || 'home';
  
  const pageData = await fetchContentType(
    "pages",
    {
      filters: {
        slug: slug,
        locale: params.locale,
      },
      populate: "seo.metaImage",
    },
    true,
  );

  const seo = pageData?.seo;
  return generateMetadataObject(seo);
}

export default async function Page({ params }: { params: { locale: string, slug?: string[] } }) {
  const slug = params.slug?.[0] || 'home';
  
  const pageData = await fetchContentType(
    "pages",
    {
      filters: {
        slug: slug,
        locale: params.locale,
      },
    },
    true,
  );

  // If no data found, try to get the fallback home page
  if (!pageData && slug !== 'home') {
    const homePageData = await fetchContentType(
      "pages",
      {
        filters: {
          slug: 'home',
          locale: params.locale,
        },
      },
      true,
    );

    if (homePageData) {
      // Will show toast notification for missing slug via ClientSlugHandler
      const localizedSlugs = homePageData.localizations?.reduce(
        (acc: Record<string, string>, localization: any) => {
          acc[localization.locale] = localization.slug;
          return acc;
        },
        { [params.locale]: 'home' }
      );

      return (
        <>
          <ClientSlugHandler 
            localizedSlugs={localizedSlugs} 
            missingSlug={slug}
          />
          <PageContent pageData={homePageData} />
        </>
      );
    }
  }

  // If no page data found at all, return 404
  if (!pageData) {
    notFound();
  }

  const localizedSlugs = pageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [params.locale]: slug }
  );

  return (
    <>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} />
    </>

  );
}