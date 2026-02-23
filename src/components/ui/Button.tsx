import * as React from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-medi-teal text-white hover:bg-medi-teal-dark shadow-sm",
    outline: "border-2 border-medi-teal text-medi-teal hover:bg-medi-teal/5",
    ghost: "text-slate-600 hover:text-medi-teal hover:bg-slate-50",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
