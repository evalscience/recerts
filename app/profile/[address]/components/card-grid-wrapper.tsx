import React from "react";

const CardGridWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      {children}
    </div>
  );
};

export default CardGridWrapper;
