import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { useMemo, useState } from "react";

import DefaultLayout from "@/layouts/default";
import TableFooter from "@/components/table-footer";

type User = {
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Cashier" | "Kitchen";
  status: "Active" | "Invited" | "Suspended";
  lastActive?: string | null;
};

const USERS: User[] = [
  {
    name: "Raka",
    email: "raka@example.com",
    role: "Admin",
    status: "Active",
    lastActive: "2025-09-24 21:10",
  },
  {
    name: "Aya",
    email: "aya@example.com",
    role: "Manager",
    status: "Invited",
    lastActive: null,
  },
  {
    name: "Bima",
    email: "bima@example.com",
    role: "Cashier",
    status: "Active",
    lastActive: "2025-09-24 17:03",
  },
  {
    name: "Dewi",
    email: "dewi@example.com",
    role: "Kitchen",
    status: "Suspended",
    lastActive: "2025-09-12 09:11",
  },
  {
    name: "Andre",
    email: "andre@example.com",
    role: "Cashier",
    status: "Active",
    lastActive: "2025-09-24 20:45",
  },
  {
    name: "Sari",
    email: "sari@example.com",
    role: "Manager",
    status: "Active",
    lastActive: "2025-09-23 08:25",
  },
  {
    name: "Nina",
    email: "nina@example.com",
    role: "Kitchen",
    status: "Active",
    lastActive: "2025-09-24 19:41",
  },
  {
    name: "Yoga",
    email: "yoga@example.com",
    role: "Kitchen",
    status: "Invited",
    lastActive: null,
  },
  {
    name: "Dimas",
    email: "dimas@example.com",
    role: "Cashier",
    status: "Active",
    lastActive: "2025-09-24 18:07",
  },
  {
    name: "Rani",
    email: "rani@example.com",
    role: "Admin",
    status: "Active",
    lastActive: "2025-09-24 21:05",
  },
  {
    name: "Budi",
    email: "budi@example.com",
    role: "Cashier",
    status: "Active",
    lastActive: "2025-09-20 15:12",
  },
];

function StatusChip({ status }: { status: User["status"] }) {
  const map = {
    Active: { color: "success" as const, label: "Active" },
    Invited: { color: "success" as const, label: "Invited" },
    Suspended: { color: "danger" as const, label: "Suspended" },
  }[status];

  return (
    <Chip color={map.color} size="sm" variant="flat">
      {map.label}
    </Chip>
  );
}

export default function UsersPage() {
  const [query, setQuery] = useState("");

  const [role, setRole] = useState<"all" | User["role"]>("all");
  const [status, setStatus] = useState<"all" | User["status"]>("all");

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return USERS.filter((u) => {
      const matchQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q);

      const matchRole = role === "all" || u.role === role;
      const matchStatus = status === "all" || u.status === status;

      return matchQuery && matchRole && matchStatus;
    });
  }, [query, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * rowsPerPage;
  const slice = filtered.slice(start, start + rowsPerPage);

  const resetFilters = () => {
    setQuery("");
    setRole("all");
    setStatus("all");
    setPage(1);
  };
  const isFilterActive = query !== "" || role !== "all" || status !== "all";

  return (
    <DefaultLayout>
      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-xl">Users</p>
          </div>
        </CardHeader>

        <CardBody>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Input
              className="max-w-xs"
              placeholder="Search users"
              value={query}
              onValueChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
            />

            <Select
              aria-label="Role"
              className="w-40"
              selectedKeys={[role]}
              onSelectionChange={(keys) => {
                const v = (Array.from(keys)[0] as string) || "all";

                setRole(v as any);
                setPage(1);
              }}
            >
              <SelectItem key="all">All roles</SelectItem>
              <SelectItem key="Admin">Admin</SelectItem>
              <SelectItem key="Manager">Manager</SelectItem>
              <SelectItem key="Cashier">Cashier</SelectItem>
              <SelectItem key="Kitchen">Kitchen</SelectItem>
            </Select>

            <Select
              aria-label="Status"
              className="w-40"
              selectedKeys={[status]}
              onSelectionChange={(keys) => {
                const v = (Array.from(keys)[0] as string) || "all";

                setStatus(v as any);
                setPage(1);
              }}
            >
              <SelectItem key="all">All status</SelectItem>
              <SelectItem key="Active">Active</SelectItem>
              <SelectItem key="Invited">Invited</SelectItem>
              <SelectItem key="Suspended">Suspended</SelectItem>
            </Select>

            <div className="ml-auto flex items-center gap-2">
              <Button
                isDisabled={!isFilterActive}
                variant="flat"
                onPress={resetFilters}
              >
                Reset
              </Button>

              <Button color="primary" onPress={() => alert("Invite flow…")}>
                Invite User
              </Button>
            </div>
          </div>

          <Table
            removeWrapper
            aria-label="Users table"
            className="[&_th]:py-3 [&_td]:py-3 [&_td]:text-sm [&_th]:text-xs"
          >
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>LAST ACTIVE</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No users found">
              {slice.map((u) => (
                <TableRow key={u.email}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <StatusChip status={u.status} />
                  </TableCell>
                  <TableCell>{u.lastActive ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TableFooter
            page={page}
            pageSize={rowsPerPage}
            totalItems={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={setRowsPerPage}
          />
        </CardBody>
      </Card>
    </DefaultLayout>
  );
}
