import React from "react";
import Image from "next/image";
import { Container } from "../container";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { CardContainer, CardBody, CardItem } from "../ui/3d-card";
import { cn } from "@/lib/utils";

interface ThreeDCardProps {
  heading?: string;
  sub_heading?: string;
  card_items?: Array<{
    title: string;
    description: string;
    image?: string;
    cta_text?: string;
    cta_link?: string;
  }>;
}

export const ThreeDCard = ({ heading, sub_heading, card_items }: ThreeDCardProps) => {
  return (
    <Container className="pt-8 pb-20 max-w-7xl mx-auto">
      {heading && <Heading className="text-center">{heading}</Heading>}
      {sub_heading && (
        <Subheading className="text-center max-w-3xl mx-auto mb-8">
          {sub_heading}
        </Subheading>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
}: {
  title: string;
  description: string;
  image?: string;
  cta_text?: string;
  cta_link?: string;
}) => {
  return (
    <CardContainer className="inter-var w-full">
      <CardBody className="bg-card relative group/card border-border w-full max-w-sm mx-auto h-auto rounded-xl p-6 border">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-foreground"
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-muted-foreground text-sm max-w-sm mt-2"
        >
          {description}
        </CardItem>
        {image && (
          <CardItem translateZ="100" className="w-full mt-4">
            <Image
              src={image}
              height={1000}
              width={1000}
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt={title}
            />
          </CardItem>
        )}
        {cta_text && cta_link && (
          <div className="flex justify-between items-center mt-6">
            <CardItem
              translateZ={20}
              as="a"
              href={cta_link}
              target="_blank"
              className="px-4 py-2 rounded-xl text-xs font-normal text-foreground"
            >
              Try now →
            </CardItem>
            <CardItem
              translateZ={20}
              as="a"
              href={cta_link}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
            >
              {cta_text}
            </CardItem>
          </div>
        )}
      </CardBody>
    </CardContainer>
  );
};
