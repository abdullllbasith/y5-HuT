import React from 'react';

export const TagSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-[14px] border border-line p-4 animate-pulse flex flex-col justify-between space-y-4 min-h-[380px]"
        >
          {/* Hole placeholder */}
          <div className="w-3.5 h-3.5 rounded-full bg-paper-sunk mx-auto" />

          {/* Stage Disc Silhouette */}
          <div className="w-36 h-36 rounded-full bg-paper-sunk/60 mx-auto my-2" />

          {/* Specs / Meta */}
          <div className="space-y-2">
            <div className="w-20 h-3 bg-paper-sunk rounded" />
            <div className="w-full h-5 bg-paper-sunk rounded" />
            <div className="w-24 h-4 bg-paper-sunk rounded" />
          </div>

          {/* Perforation line */}
          <div className="border-b border-dashed border-line my-1" />

          {/* Price stub & button */}
          <div className="space-y-2">
            <div className="w-32 h-6 bg-paper-sunk rounded" />
            <div className="w-full h-11 bg-paper-sunk rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
};

