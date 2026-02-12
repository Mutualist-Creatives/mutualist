import React from "react";

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-medium text-purple-mutu mb-4">
        Under Maintenance
      </h1>
      <p className="text-xl md:text-3xl text-black-mutu max-w-2xl">
        We are currently updating our website to serve you better. Please check
        back later.
      </p>
    </div>
  );
}
