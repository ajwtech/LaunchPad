import React from "react";
import Image from "next/image";
import { Container } from "../container";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { CardContainer, CardBody, CardItem } from "../ui/3d-card";
import { strapiImage } from "@/lib/strapi/strapiImage";

interface StrapiMedia {
  id: number;
  url: string;
  name: string;
  alternativeText?: string;
  mime: string;
  width?: number;
  height?: number;
}

interface ThreeDCardProps {
  heading?: string;
  sub_heading?: string;
  card_items?: Array<{
    title: string;
    description: string;
    image?: StrapiMedia;
    cta_text?: string;
    cta_link?: string;
    secondary_cta_text?: string;
  }>;
}

export const ThreeDCard = ({ heading, sub_heading, card_items }: ThreeDCardProps) => {
  return (
    <Container className="pt-8 pb-20 max-w-7xl mx-auto">
      {heading && heading.trim() && (
        <Heading className="text-center">
          <div dangerouslySetInnerHTML={{ __html: heading }} />
        </Heading>
      )}
      {sub_heading && sub_heading.trim() && (
        <Subheading className="text-center max-w-3xl mx-auto mb-8">
          <div dangerouslySetInnerHTML={{ __html: sub_heading }} />
        </Subheading>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {card_items?.map((card, index) => (
          <ThreeDCardItem key={index} {...card} />
        ))}
      </div>
    </Container>
  );
};

const ThreeDCardItem = ({
  title,
  description,
  image,
  cta_text,
  cta_link,
  secondary_cta_text,
}: {
  title: string;
  description: string;
  image?: StrapiMedia;
  cta_text?: string;
  cta_link?: string;
  secondary_cta_text?: string;
}) => {
  return (
    <CardContainer className="inter-var w-full h-full">
      <CardBody className="bg-card relative group/card border-border w-full h-full max-w-sm mx-auto rounded-xl p-6 border flex flex-col min-h-[20rem]">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-foreground flex-shrink-0"
        >
          {title && title.trim() ? (
            <div dangerouslySetInnerHTML={{ __html: title }} />
          ) : (
            <span>Untitled</span>
          )}
        </CardItem>
        <CardItem
          as="div"
          translateZ="60"
          className="text-muted-foreground text-sm max-w-sm mt-2 flex-grow"
        >
          {description && description.trim() && (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          )}
        </CardItem>
        {image && (
          <CardItem translateZ="100" className="w-full mt-4 flex-shrink-0">
            <Image
              src={strapiImage(image.url)}
              height={1000}
              width={1000}
              className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt={image.alternativeText || "Card image"}
            />
          </CardItem>
        )}
        <div className="flex justify-between items-center mt-6 flex-shrink-0 min-h-[2.5rem]">
          {cta_text && cta_link ? (
            <>
              <CardItem
                translateZ={20}
                as="a"
                href={cta_link}
                target="_blank"
                className="px-4 py-2 rounded-xl text-xs font-normal text-foreground"
              >
                {secondary_cta_text && secondary_cta_text.trim() ? (
                  <div dangerouslySetInnerHTML={{ __html: secondary_cta_text }} />
                ) : (
                  ""
                )}
              </CardItem>
              <CardItem
                translateZ={20}
                as="a"
                href={cta_link}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
              >
                {cta_text && cta_text.trim() ? (
                  <div dangerouslySetInnerHTML={{ __html: cta_text }} />
                ) : (
                  "Learn More"
                )}
              </CardItem>
            </>
          ) : null}
        </div>
      </CardBody>
    </CardContainer>
  );
};
