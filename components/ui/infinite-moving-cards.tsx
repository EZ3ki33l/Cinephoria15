"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  onItemClick,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  onItemClick?: (item: any) => void;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const checkIfShouldAnimate = () => {
      if (scrollerRef.current && containerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);
        const containerWidth = containerRef.current.offsetWidth;
        const totalContentWidth = scrollerContent.reduce(
          (acc, item) => acc + (item as HTMLElement).offsetWidth + 16, // +16 pour le gap
          0
        );

        // Ne défile que si le contenu total est plus grand que 3 fois le conteneur
        const shouldScroll = totalContentWidth > containerWidth * 3;
        setShouldAnimate(shouldScroll);

        if (shouldScroll) {
          const scrollerContent = Array.from(scrollerRef.current.children);
          scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            scrollerRef.current?.appendChild(duplicatedItem);
          });

          getDirection();
          getSpeed();
          setStart(true);
        }
      }
    };

    // Attendre que le contenu soit chargé
    setTimeout(checkIfShouldAnimate, 100);
  }, [items, direction, speed]);

  const handleClick = (item: any) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      const duration = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          shouldAnimate && start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            onClick={() => handleClick(item)}
            className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px] cursor-pointer hover:bg-slate-800 transition-colors"
            style={{
              background: "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
            }}
            key={`${item.name}-${idx}`}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] text-gray-400 font-normal">
                    {item.name}
                  </span>
                  <span className="text-sm leading-[1.6] text-gray-400 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
