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
        size="sm"
        color={colors[status]}
        variant="flat"
        className="capitalize"
      >
        {status}
      </Chip>
    );
}