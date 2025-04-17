"use client";

// =============================================================================================

import { Link } from "next-view-transitions";
import { motion } from "motion/react";

// =============================================================================================

type SwitchLinkProps = {
  sentence: string;
  instruction: string;
  path: string;
};

export default function SwitchLink({ sentence, instruction, path }: SwitchLinkProps) {
  return (
    <motion.div whileHover="hover" className="text-neutral-500 flex gap-x-1">
      <p>{sentence}</p>
      <Link href={path} className="text-black font-semibold relative">
        {instruction}
        <AnimatedLine />
      </Link>
    </motion.div>
  );
}

// =============================================================================================

function AnimatedLine() {
  return (
    <motion.div
      className="absolute bottom-0 h-0.5 w-full bg-primary-500"
      initial={{ width: "0%" }}
      variants={AnimatedLineVariant}
      transition={{ duration: 0.2 }}
    />
  );
}

// =============================================================================================

const AnimatedLineVariant = {
  hover: { width: "100%" },
};

// =============================================================================================
