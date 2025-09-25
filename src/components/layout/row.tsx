import React, { ReactNode } from "react";

interface RowProps {
  children: ReactNode;
  className?: string;
}

const Row: React.FC<RowProps> = ({ children, className = "" }) => {
  return <div className={`flex flex-wrap w-full ${className}`}>{children}</div>;
};

export default Row;
