import { AmbientColor } from '@/components/decorations/ambient-color';
import DynamicZoneManager from '@/components/dynamic-zone/manager';
import { DynamicBackground } from '@/components/backgrounds/DynamicBackground';
import { convertStrapiBackgroundToConfig } from '@/lib/backgrounds/utils';
import { StrapiPage } from '@/types/strapi';

export default function PageContent({ pageData }: { pageData: StrapiPage }) {
  const dynamicZone = pageData?.dynamic_zone;
  
  // Convert Strapi background settings to our BackgroundConfig
  const backgroundConfig = convertStrapiBackgroundToConfig(pageData?.backgroundSettings);

  return (
    <DynamicBackground 
      config={backgroundConfig}
      className="overflow-hidden w-full min-h-screen"
    >
      <AmbientColor />
      {dynamicZone && (<DynamicZoneManager dynamicZone={dynamicZone} locale={pageData.locale} />)}
    </DynamicBackground>
  );
}
