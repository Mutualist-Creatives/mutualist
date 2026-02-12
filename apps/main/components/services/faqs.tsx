"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import clsx from "clsx";

const faqsData = {
  advertising: [
    {
      question: "What types of advertising services do you offer?",
      answer:
        "We provide services for both traditional advertising (billboards, print ads, OOH media) and digital advertising (Meta Ads, Google Ads, YouTube). We also support brand events and on-ground activations.",
    },
    {
      question: "Do you handle ad strategy or just design?",
      answer:
        "We handle both! We can help define the strategy to reach your target audience and then craft the perfect visuals to execute it.",
    },
    {
      question: "How long does it take to prepare a campaign?",
      answer:
        "Timelines vary based on the scope, but typically a full campaign takes 2-4 weeks from strategy to final assets.",
    },
    {
      question: "Can you adapt our existing campaign assets?",
      answer:
        "Absolutely. We can take your existing key visuals and adapt them across various formats and platforms for consistency.",
    },
  ],
  branding: [
    {
      question: "What is included in a branding package?",
      answer:
        "Our standard package includes logo design, color palette, typography system, and a brand guideline book. We can also add collateral design as needed.",
    },
    {
      question: "How many revisions do we get?",
      answer:
        "We typically offer 2-3 rounds of revisions to ensure the final design aligns perfectly with your vision.",
    },
    {
      question: "Do you do rebrands or just new brands?",
      answer:
        "We love both! Whether starting from scratch or refreshing an existing identity, we're ready to help.",
    },
  ],
  "character-design": [
    {
      question: "Do I own the rights to the character?",
      answer:
        "Yes, once the project is complete and paid for, you have full ownership rights to the character usage.",
    },
    {
      question: "Can you animate the characters?",
      answer:
        "We specialize in design, but we can prepare the files (rig-ready) for animators to take over easily.",
    },
    {
      question: "What styles can you do?",
      answer:
        "From cute and flat to detailed and semi-realistic, we adapt our style to fit your brand's voice.",
    },
  ],
  "social-media": [
    {
      question: "Do you manage the posting as well?",
      answer:
        "Our primary focus is on content creation and strategy. We can recommend partners for community management if needed.",
    },
    {
      question: "What platforms do you design for?",
      answer:
        "We design for Instagram, TikTok, LinkedIn, Twitter/X, and Facebook, optimizing formats for each.",
    },
    {
      question: "Can we get a monthly retainer?",
      answer:
        "Yes! We offer monthly packages for consistent content creation so your feed never runs dry.",
    },
  ],
};

type ServiceCategory = keyof typeof faqsData;

interface FAQsProps {
  category: ServiceCategory;
}

export function FAQs({ category }: FAQsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const questions = faqsData[category] || [];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-10 md:py-20 px-6 md:px-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-20">
        {/* Left Column: FAQs */}
        <div className="md:col-span-7 lg:col-span-7">
          <h2 className="text-3xl md:text-4xl lg:text-7xl font-medium text-purple-mutu mb-8 md:mb-12 font-sans">
            FAQs
          </h2>

          <div className="flex flex-col gap-4 md:gap-6">
            {questions.map((item, index) => (
              <div key={index} className="pb-4 md:pb-6 mb-2">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-start gap-4 text-left group cursor-pointer"
                >
                  <div
                    className={clsx(
                      "flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-lg border-2 flex items-center justify-center transition-colors duration-300 mt-1",
                      openIndex === index
                        ? "border-purple-mutu bg-purple-mutu text-white"
                        : "border-purple-mutu text-purple-mutu group-hover:bg-purple-mutu group-hover:text-white",
                    )}
                  >
                    {openIndex === index ? (
                      <Minus size={14} className="md:w-4 md:h-4" />
                    ) : (
                      <Plus size={14} className="md:w-4 md:h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm md:text-base lg:text-lg font-bold text-black-mutu py-1 font-sans">
                      {item.question}
                    </h3>
                    <div
                      className={clsx(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        openIndex === index
                          ? "max-h-96 opacity-100 mt-2"
                          : "max-h-0 opacity-0",
                      )}
                    >
                      <p className="text-black-mutu leading-relaxed font-normal text-sm md:text-sm lg:text-base text-opacity-80 font-instrument">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Mutu Said Card */}
        <div className="md:col-span-5 lg:col-span-4 lg:col-start-9 mt-8 md:mt-0">
          <div className="bg-cream-mutu rounded-2xl p-6 md:p-6 lg:p-8 flex flex-col items-center text-center shadow-sm h-full md:h-auto sticky md:top-24">
            {/* Mascot */}
            <div className="relative w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 mb-4 md:mb-6">
              <Image
                src="/assets/services/faqs/faqs_mascot.png"
                alt="Mutu Mascot"
                fill
                className="object-contain"
              />
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-xl lg:text-2xl font-bold text-green-mutu mb-2 md:mb-4 font-sans">
              Mutu Said,
            </h3>

            {/* Quote */}
            <p className="text-black-mutu font-medium text-sm md:text-sm lg:text-base leading-relaxed">
              Good ads don&apos;t shout. They strike with purpose. We craft
              bold, thoughtful visuals that speak clearly and powerfully, so you
              don&apos;t have to explain twice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
