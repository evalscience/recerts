"use client";
import React from "react";
import { motion } from "framer-motion";

const Progress = ({
  percentage,
  ...props
}: { percentage: number } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={`h-2 w-full rounded-full bg-accent overflow-hidden ${
        props.className ?? ""
      }`}
    >
      <motion.div
        className="h-full bg-primary"
        initial={{ width: `0%` }}
        animate={{ width: `${5 + (percentage / 100) * 95}%` }}
        transition={{ duration: 0.5 }}
      ></motion.div>
    </div>
  );
};

export default Progress;
