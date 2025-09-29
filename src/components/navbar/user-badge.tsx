import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";

import { useMeQuery } from "@/services/auth";

export default function UserBadge() {
  const { data, error } = useMeQuery();

  if ((error as any)?.status === 401) {
    return <Chip color="warning">Please login</Chip>;
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar name={data?.email ?? "?"} size="sm" />
      <span className="text-sm">{data?.email ?? "Loading…"}</span>
    </div>
  );
}
