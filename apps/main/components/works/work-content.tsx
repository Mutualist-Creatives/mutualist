import React from "react";
import Image from "next/image";
import { WorkItem } from "../../data/works";

interface WorkContentProps {
  work: WorkItem;
}

const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);

export default function WorkContent({ work }: WorkContentProps) {
  return (
    <div className="w-full md:w-3/5 lg:w-2/3 bg-white pt-4 md:pt-32 pb-20 px-0 flex flex-col gap-2 md:gap-3 lg:gap-4 items-end ml-auto">
      {work.content.map((block, index) => {
        switch (block.type) {
          case "full-width":
            return (
              <div
                key={index}
                className="w-full rounded-lg md:rounded-2xl overflow-hidden bg-zinc-200"
              >
                <div className="relative w-full">
                  {block.images[0] ? (
                    isVideo(block.images[0]) ? (
                      <video
                        src={block.images[0]}
                        className="w-full h-auto bg-zinc-200"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <Image
                        src={block.images[0]}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto bg-zinc-200"
                      />
                    )
                  ) : (
                    <div className="w-full aspect-video bg-zinc-200" />
                  )}
                </div>
              </div>
            );
          case "two-column":
            return (
              <div
                key={index}
                className="w-full grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4"
              >
                {block.images.map((img, i) => (
                  <div
                    key={i}
                    className="w-full rounded-lg md:rounded-2xl overflow-hidden bg-zinc-200"
                  >
                    <div className="relative w-full">
                      {img ? (
                        isVideo(img) ? (
                          <video
                            src={img}
                            className="w-full h-auto bg-zinc-200"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <Image
                            src={img}
                            alt=""
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-auto bg-zinc-200"
                          />
                        )
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
                className="w-full grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4"
              >
                {block.images.map((img, i) => (
                  <div
                    key={i}
                    className="w-full rounded-lg md:rounded-2xl overflow-hidden bg-zinc-200"
                  >
                    <div className="relative w-full">
                      {img ? (
                        isVideo(img) ? (
                          <video
                            src={img}
                            className="w-full h-auto bg-zinc-200"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <Image
                            src={img}
                            alt=""
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-auto bg-zinc-200"
                          />
                        )
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
