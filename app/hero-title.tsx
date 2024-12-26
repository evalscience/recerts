"use client";

import React from "react";
import { motion } from "framer-motion";

const HeroTitleVariants = {
  initial: {
    opacity: 0,
    y: 100,
    filter: "blur(20px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

const HeroTitle = () => {
  return (
    <h2 className="py-6 px-4 text-center flex flex-col items-center gap-2 leading-none text-4xl font-bold text-foreground/50 relative">
      <motion.div
        className="h-20 aspect-square rounded-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-green-500 opacity-80 blur-3xl"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1.5 }}
        transition={{ duration: 3 }}
      />
      <motion.span
        variants={HeroTitleVariants}
        initial={"initial"}
        animate={"animate"}
        transition={{
          duration: 0.5,
        }}
      >
        Fund
      </motion.span>
      <motion.span
        variants={HeroTitleVariants}
        initial={"initial"}
        animate={"animate"}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className="text-6xl font-black bg-gradient-to-b from-green-400 to-green-700 inline-block text-transparent bg-clip-text"
      >
        impactful
      </motion.span>
      <motion.span
        variants={HeroTitleVariants}
        initial={"initial"}
        animate={"animate"}
        transition={{
          duration: 0.5,
          delay: 0.4,
        }}
      >
        regenerative projects.
      </motion.span>
    </h2>
  );
};

export default HeroTitle;
