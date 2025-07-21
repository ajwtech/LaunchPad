"use client";
import React from "react";
import { Container } from "./container";
import { Logo } from "./logo";
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import { Button } from "./elements/button";

export const Register = () => {
  return (
    <Container className="h-screen max-w-lg mx-auto flex flex-col items-center justify-center">
      <Logo />
      <h1 className="text-xl md:text-4xl font-bold my-4">
        Sign up for LaunchPad
      </h1>

      <form className="w-full my-4">
        <input
          type="email"
          placeholder="Email Address"
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="password"
          placeholder="Password"
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button variant="muted" type="submit" className="w-full py-3">
          <span className="text-sm">Sign up</span>
        </Button>
      </form>

      <Divider />

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button className="flex flex-1 justify-center space-x-2 items-center bg-primary-foreground px-4 py-3 rounded-md text-primary hover:bg-primary-foreground/80 transition duration-200 shadow-md">
          <IconBrandGithubFilled className="h-4 w-4 text-primary" />
          <span className="text-sm">Login with GitHub</span>
        </button>
        <button className="flex flex-1 justify-center space-x-2 items-center bg-secondary px-4 py-3 rounded-md text-secondary-foreground hover:bg-secondary/80 transition duration-200 shadow-md">
          <IconBrandGoogleFilled className="h-4 w-4 text-secondary-foreground" />
          <span className="text-sm">Login with Google</span>
        </button>
      </div>
    </Container>
  );
};

const Divider = () => {
  return (
    <div className="relative w-full py-8">
      <div className="w-full h-px bg-border rounded-tr-xl rounded-tl-xl" />
      <div className="w-full h-px bg-border/60 rounded-br-xl rounded-bl-xl" />
      <div className="absolute inset-0 h-5 w-5 m-auto rounded-md px-3 py-0.5 text-xs bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground">
        OR
      </div>
    </div>
  );
};
