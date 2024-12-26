"use client";

import { usePagination } from "@/hooks/use-pagination";

import { Button } from "@/components/ui/button";

import Fuse from "fuse.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import autoAnimate from "@formkit/auto-animate";
import { ShowingDisplay, VDPaginator } from "@/components/global/vd-paginator";
import { Hypercert } from "@/app/graphql-queries/hypercerts";
import Search from "./search";
import Card from "./card";

export function GridView({ hypercerts }: { hypercerts: Hypercert[] }) {
  const searchInputState = useState("");
  const [searchInput, setSearchInput] = searchInputState;

  const filteredHypercerts = useMemo(() => {
    if (searchInput === "") {
      return hypercerts;
    }
    const fuse = new Fuse(hypercerts, {
      keys: ["name", "description"],
      threshold: 0.1,
      ignoreLocation: true,
    });
    return fuse.search(searchInput).map((result) => result.item);
  }, [hypercerts, searchInput]);

  const gridRef = useRef<HTMLDivElement>(null);

  const clearAllFilters = useCallback(() => {
    setSearchInput("");
  }, []);

  useEffect(() => {
    if (gridRef.current) {
      autoAnimate(gridRef.current);
    }
  }, [filteredHypercerts]);

  const itemsPerPage = 10;

  const { currentPage, currentPageItems, loadPage, maxPage, needsPagination } =
    usePagination<Hypercert>(filteredHypercerts, itemsPerPage);

  return (
    <section
      className="flex w-full flex-col items-center px-2 md:px-6 py-6"
      id="discover"
    >
      <section className="flex-1 flex flex-col w-full max-w-6xl">
        {hypercerts.length && <Search inputState={searchInputState} />}
        <div className="p-3" />
        {filteredHypercerts.length ? (
          <div
            className="grid grid-cols-[minmax(300px,_1fr)] md:grid-cols-[300px_300px] lg:grid-cols-[300px_300px_300px] gap-5 md:gap-3 self-center"
            ref={gridRef}
          >
            {filteredHypercerts.map((hypercert: Hypercert) => (
              <Card hypercert={hypercert} key={hypercert.hypercertId} />
            ))}
          </div>
        ) : (
          <section className="flex w-full items-center justify-center py-6">
            <div className="flex flex-col items-center pb-24 text-center md:pb-10">
              <TriangleAlert
                className="text-muted-foreground/75 mb-4"
                size={60}
              />
              <p className="font-bold text-lg text-muted-foreground">
                We couldn't find any hypercerts matching your search or filter.
              </p>
              <p className="text-muted-foreground">
                Please remove some of your filters and try again.
              </p>
              <Button
                variant={"secondary"}
                className="mt-4"
                onClick={clearAllFilters}
              >
                Clear all filters
              </Button>
            </div>
          </section>
        )}
        {
          <section className="flex flex-col items-center justify-center gap-2 mt-4">
            {filteredHypercerts.length > 0 && (
              <ShowingDisplay
                currentPage={currentPage}
                totalItemAmount={filteredHypercerts.length}
                itemsPerPage={itemsPerPage}
              />
            )}
            <VDPaginator
              needsPagination={needsPagination}
              currentPage={currentPage}
              maxPage={maxPage}
              loadPage={loadPage}
            />
          </section>
        }
      </section>
    </section>
  );
}
