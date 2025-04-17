"use client";

// =============================================================================================

import { motion } from "motion/react";

// =============================================================================================

export default function ForgetCredentials() {
  return (
    <motion.div whileHover="hover" className="text-neutral-500 items-center flex flex-col lg:flex-row gap-x-1">
      <p>Vous avez perdu vos identifiants ?</p>
      <div className="text-black font-semibold relative">
        <p>Contactez votre supérieur</p>
        <AnimatedLine />
      </div>
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
