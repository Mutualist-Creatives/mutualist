import React from "react";
import Image from "next/image";
import { WorkItem } from "../../data/works";

interface WorkContentProps {
  work: WorkItem;
}

export default function WorkContent({ work }: WorkContentProps) {
  return (
    <div className="w-full md:w-2/3 bg-white pt-10 md:pt-32 pb-20 px-0 flex flex-col gap-3 md:gap-4">
      {work.content.map((block, index) => {
        switch (block.type) {
          case "full-width":
            return (
              <div
                key={index}
                className="w-full rounded-lg md:rounded-2xl overflow-hidden bg-zinc-200"
              >
                <div className="relative w-full aspect-video">
                  {block.images[0] ? (
                    <Image
                      src={block.images[0]}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-200" />
                  )}
                </div>
              </div>
            );
          case "two-column":
            return (
              <div
                key={index}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
              >
                {block.images.map((img, i) => (
                  <div
                    key={i}
                    className="w-full rounded-lg md:rounded-2xl overflow-hidden bg-zinc-200"
                  >
                    <div className="relative w-full aspect-square">
                      {img ? (
                        <Image src={img} alt="" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-200" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          case "three-column":
            return (
              <div
                key={index}
                className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
              >
                {block.images.map((img, i) => (
                  <div
                    key={i}
                    className="w-full rounded-lg md:rounded-2xl overflow-hidden bg-zinc-200"
                  >
                    <div className="relative w-full aspect-square">
                      {img ? (
                        <Image src={img} alt="" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-200" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
