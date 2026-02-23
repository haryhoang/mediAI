import * as React from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface CardProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export const Card = ({ children, className = "", delay = 0, ...props }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
