import React from "react";
import { WorkItem, ServiceType } from "../../data/works";

interface WorkSidebarProps {
  work: WorkItem;
}

export default function WorkSidebar({ work }: WorkSidebarProps) {
  const allServices: ServiceType[] = ["A", "B", "C", "S"];

  return (
    <aside className="w-full md:w-1/3 md:h-screen md:sticky md:top-0 bg-white px-6 md:px-14 py-20 md:py-32 flex flex-col gap-12 overflow-y-auto no-scrollbar">
      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl md:text-5xl font-medium text-purple-mutu mb-2">
          {work.title}
        </h1>
        <p className="text-lg font-medium text-black-mutu">{work.industry}</p>
        <p className="text-lg font-medium text-black-mutu">{work.year}</p>
      </div>

      {/* Services */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-medium text-purple-mutu">Services</h3>

        {/* ABCS Icons */}
        <div className="flex gap-3">
          {allServices.map((service) => {
            const isActive = work.serviceIcons.includes(service);
            return (
              <div
                key={service}
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-lg font-medium border-2
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

        <p className="text-base font-medium text-black-mutu">
          {work.serviceNames}
        </p>
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-purple-mutu">Teams</h3>
        <div className="flex flex-col gap-4">
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
              <div key={index} className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-base font-medium text-purple-mutu">
                  {team.role}
                </span>
                <div className="flex flex-col">
                  {team.names.map((name, i) => (
                    <span
                      key={i}
                      className="text-base font-medium text-black-mutu"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </aside>
  );
}
