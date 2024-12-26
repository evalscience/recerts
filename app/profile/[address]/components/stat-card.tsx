import React from "react";

const StatCard = ({
  title,
  count,
  icon,
}: {
  title: React.ReactNode;
  count: number;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={
        "flex-1 rounded-3xl bg-accent flex flex-col p-6 gap-4 relative overflow-hidden"
      }
    >
      <div className="absolute -bottom-4 -right-4 text-primary/50 -rotate-45">
        {icon}
      </div>
      <div className={"font-bold text-muted-foreground text-sm"}>{title}</div>
      <div>
        <data className="font-bold text-4xl">{count}</data>
      </div>
    </div>
  );
};

export default StatCard;
