import React from "react";
import { WorkItem, ServiceType } from "../../data/works";

interface WorkSidebarProps {
  work: WorkItem;
}

export default function WorkSidebar({ work }: WorkSidebarProps) {
  const allServices: ServiceType[] = ["A", "B", "C", "S"];

  return (
    <aside className="w-full md:w-2/5 lg:w-1/3 md:h-screen md:sticky md:top-0 bg-white px-0 md:pr-10 pt-24 pb-5 md:py-32 flex flex-col gap-8 md:gap-12 overflow-y-auto no-scrollbar self-start">
      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-2xl lg:text-5xl font-medium text-purple-mutu mb-2">
          {work.title}
        </h1>
        <p className="text-sm md:text-base lg:text-xl font-medium text-black-mutu">
          {work.industry}
        </p>
        <p className="text-sm md:text-base lg:text-xl font-medium text-black-mutu">
          {work.year}
        </p>
      </div>

      {/* Services */}
      <div className="flex flex-col gap-3 md:gap-4">
        <h3 className="text-sm md:text-lg lg:text-xl font-medium text-purple-mutu">
          Services
        </h3>

        {/* ABCS Icons */}
        <div className="flex gap-2 md:gap-3">
          {allServices.map((service) => {
            const isActive = work.serviceIcons.includes(service);
            return (
              <div
                key={service}
                className={`
                  w-8 h-8 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center text-sm md:text-sm font-medium border-2
                  ${
                    isActive
                      ? "bg-black-mutu border-black-mutu text-white"
                      : "bg-transparent border-black-mutu text-black-mutu"
                  }
                `}
              >
                {service}
              </div>
            );
          })}
        </div>

        <p className="text-sm md:text-sm lg:text-base font-medium text-black-mutu">
          {work.serviceNames}
        </p>
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-3 md:gap-4">
        <h3 className="text-sm md:text-lg lg:text-xl font-bold text-purple-mutu">
          Teams
        </h3>
        <div className="grid grid-cols-[max-content_1fr] gap-x-4 md:gap-x-4 lg:gap-x-4 gap-y-3 md:gap-y-4">
          {(() => {
            // Group teams by role
            const groupedTeams = work.teams.reduce(
              (acc, curr) => {
                const existing = acc.find((t) => t.role === curr.role);
                if (existing) {
                  // detailed check to avoid duplicates if user enters same name
                  const newNames = curr.names.filter(
                    (n) => !existing.names.includes(n)
                  );
                  existing.names.push(...newNames);
                } else {
                  acc.push({ role: curr.role, names: [...curr.names] });
                }
                return acc;
              },
              [] as typeof work.teams
            );

            return groupedTeams.map((team, index) => (
              <React.Fragment key={index}>
                <span className="text-sm md:text-sm lg:text-base font-medium text-purple-mutu whitespace-nowrap">
                  {team.role}
                </span>
                <div className="flex flex-col">
                  {team.names.map((name, i) => (
                    <span
                      key={i}
                      className="text-sm md:text-sm lg:text-base font-medium text-black-mutu"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </React.Fragment>
            ));
          })()}
        </div>
      </div>
    </aside>
  );
}
