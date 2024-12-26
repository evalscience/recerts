import { Button } from "@/components/ui/button";
import { CircleAlert, Home, RotateCw } from "lucide-react";
import Link from "next/link";
import React from "react";

const PageError = ({ title, body }: { title?: string; body?: string }) => {
  return (
    <section className="flex flex-col w-full items-center justify-center gap-2 ">
      <div className="w-full max-w-6xl p-8">
        <Link href={"/"}>
          <Button variant={"link"} className="gap-2 p-0">
            <Home size={20} /> Home
          </Button>
        </Link>
      </div>
      <div className="w-full max-w-6xl flex flex-col items-center pb-24 text-center md:pb-10 px-8">
        <CircleAlert className="text-muted-foreground/75 mb-4" size={60} />
        <p className="font-bold text-lg text-muted-foreground">
          {title ?? "We couldn't load this page."}
        </p>
        <p className="text-muted-foreground">
          {body ?? "Please try refreshing the page."}
        </p>
        <Link href={""}>
          <Button className="mt-4 gap-2">
            <RotateCw size={20} />
            Refresh
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default PageError;
