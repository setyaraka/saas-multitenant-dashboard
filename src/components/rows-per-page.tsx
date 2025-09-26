import { Select, SelectItem } from "@heroui/select";

type RowsPerPageProps = {
  value: number;
  onChange: (next: number) => void;
  options?: number[];
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
        aria-label="Row per page"
        className="w-20"
        selectedKeys={[String(value)]}
        size={size}
        onSelectionChange={(keys) => {
          const next = Number(Array.from(keys)[0]);

          onChange(next);
        }}
      >
        {options.map((n) => (
          <SelectItem key={String(n)} textValue={String(n)}>
            {n}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
