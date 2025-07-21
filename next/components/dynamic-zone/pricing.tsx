"use client";

import React from "react";
import { Container } from "../container";
import { FeatureIconContainer } from "./features/feature-icon-container";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { IconCheck, IconPlus, IconReceipt2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "../elements/button";

type Perks = {
  [key: string]: string;
}

type CTA = {
  [key: string]: string;
}

type Plan = {
  name: string;
  price: number;
  perks: Perks[];
  additional_perks: Perks[];
  description: string;
  number: string;
  featured?: boolean;
  CTA?: CTA | undefined;
};

export const Pricing = ({ heading, sub_heading, plans }: { heading: string, sub_heading: string, plans: any[] }) => {
  const onClick = (plan: Plan) => {
    console.log("click", plan);
  };
  return (
    <div className="pt-40">
      <Container>
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconReceipt2 className="h-6 w-6 text-primary-foreground" />
        </FeatureIconContainer>
        <Heading className="pt-4">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto">
          {sub_heading}
        </Subheading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-4 py-20 lg:items-start">
          {plans.map((plan) => (
            <Card onClick={() => onClick(plan)} key={plan.name} plan={plan} />
          ))}
        </div>
      </Container>
    </div>
  );
};

const Card = ({ plan, onClick }: { plan: Plan; onClick: () => void }) => {
  return (
    <div
      className={cn(
        "p-4 md:p-4 rounded-3xl bg-card border-2 border-border",
        plan.featured && "bg-gradient-to-b from-white to-white"
      )}
    >
      <div
        className={cn(
          "p-4 bg-card rounded-2xl shadow-[0px_-1px_0px_0px_hsl(var(--border))]",
          plan.featured && "bg-primary-foreground shadow-lg"
        )}
      >
        <div className="flex justify-between items-center">
          <p className={cn("font-medium", plan.featured && "text-primary")}>
            {plan.name}
          </p>
          {plan.featured && (
            <div
              className={cn(
                "font-medium text-xs px-3 py-1 rounded-full relative bg-accent text-accent-foreground"
              )}
            >
              <div className="absolute inset-x-0 bottom-0 w-3/4 mx-auto h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              Featured
            </div>
          )}
        </div>
        <div className="mt-8">
          {plan.price && (
            <span
              className={cn(
                "text-lg font-bold text-muted-foreground",
                plan.featured && "text-primary/70"
              )}
            >
              $
            </span>
          )}
          <span
            className={cn("text-4xl font-bold", plan.featured && "text-primary")}
          >
            {plan.price || plan?.CTA?.text}
          </span>
          {plan.price && (
            <span
              className={cn(
                "text-lg font-normal text-muted-foreground ml-2",
                plan.featured && "text-primary/70"
              )}
            >
              / launch
            </span>
          )}
        </div>
        <Button
          variant="outline"
          className={cn(
            "w-full mt-10 mb-4",
            plan.featured &&
            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          )}
          onClick={onClick}
        >
          {plan?.CTA?.text}
        </Button>
      </div>
      <div className="mt-1 p-4">
        {plan.perks.map((feature, idx) => (
          <Step featured={plan.featured} key={idx}>
            {feature.text}
          </Step>
        ))}
      </div>
      {plan.additional_perks && plan.additional_perks.length > 0 && (
        <Divider featured={plan.featured} />
      )}
      <div className="p-4">
        {plan.additional_perks?.map((feature, idx) => (
          <Step featured={plan.featured} additional key={idx}>
            {feature.text}
          </Step>
        ))}
      </div>
    </div>
  );
};

const Step = ({
  children,
  additional,
  featured,
}: {
  children: React.ReactNode;
  additional?: boolean;
  featured?: boolean;
}) => {
  return (
    <div className="flex items-start justify-start gap-2 my-4">
      <div
        className={cn(
          "h-4 w-4 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5",
          additional ? "bg-primary" : "bg-muted"
        )}
      >
        <IconCheck className="h-3 w-3 [stroke-width:4px] text-primary-foreground" />
      </div>
      <div
        className={cn(
          "font-medium text-foreground text-sm",
          featured && "text-primary"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Divider = ({ featured }: { featured?: boolean }) => {
  return (
    <div className="relative">
      <div
        className={cn("w-full h-px bg-border", featured && "bg-primary")}
      />
      <div
        className={cn(
          "w-full h-px bg-border",
          featured && "bg-primary"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 h-5 w-5 m-auto rounded-xl bg-card border border-border shadow-sm flex items-center justify-center",
          featured && "bg-primary-foreground shadow-lg"
        )}
      >
        <IconPlus
          className={cn(
            "h-3 w-3 [stroke-width:4px] text-muted-foreground",
            featured && "text-primary"
          )}
        />
      </div>
    </div>
  );
};
