import { Chip } from "@heroui/chip";

type Order = {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: "paid" | "pending" | "failed";
  created: string;
};

export default function StatusChip({ status }: { status: Order["status"] }) {
  const colors = {
    paid: "success",
    pending: "warning",
    failed: "danger",
  } as const;

  return (
    <Chip
      className="capitalize"
      color={colors[status]}
      size="sm"
      variant="flat"
    >
      {status}
    </Chip>
  );
}
