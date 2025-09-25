import React from "react";
import { Select, SelectItem } from "@heroui/select";

type RowsPerPageProps = {
  value: string;                    // nilai saat ini (mis. 10)
  onChange: (next: number) => void; // handler saat berubah
  options?: number[];               // default: [5,10,25,50]
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

export default function RowsPerPage({
  value,
  onChange,
  options = [5, 10, 25, 50],
  size = "sm",
  label = "Row per page",
  className = "",
}: RowsPerPageProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <Select
        size={size}
        aria-label="Row per page"
        className="w-20"
        defaultSelectedKeys={["10"]}
        selectedKeys={value}
        disallowEmptySelection
        onSelectionChange={(keys) => {
          const first = Array.from(keys as Set<React.Key>)[0];
          const next = Number(first?.toString());
          if (!Number.isNaN(next)) onChange(next);
        }}
      >
        {options.map((n) => (
          <SelectItem key={String(n)}>{n}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
