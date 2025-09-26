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
import { useMemo, useState } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";

import TableFooter from "@/components/table-footer";
import DefaultLayout from "@/layouts/default";

type RoleRow = {
  role: string;
  permissions: string[];
  members: number;
  created: string;
};

const DATA: RoleRow[] = [
  { role: "Admin", permissions: ["*"], members: 2, created: "2025-08-01" },
  {
    role: "Manager",
    permissions: ["orders.read", "orders.update", "menu.*"],
    members: 2,
    created: "2025-08-02",
  },
  {
    role: "Cashier",
    permissions: ["orders.create", "orders.read"],
    members: 3,
    created: "2025-08-03",
  },
  {
    role: "Kitchen",
    permissions: ["kitchen.read", "kitchen.update"],
    members: 3,
    created: "2025-08-03",
  },
  {
    role: "Viewer",
    permissions: ["read.only"],
    members: 1,
    created: "2025-08-05",
  },
];

export default function RolesPage() {
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return DATA;

    return DATA.filter(
      (r) =>
        r.role.toLowerCase().includes(q) ||
        r.permissions.some((p) => p.toLowerCase().includes(q)),
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * rowsPerPage;
  const slice = filtered.slice(start, start + rowsPerPage);

  return (
    <DefaultLayout>
      <Breadcrumbs className="mb-5" size="lg">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Users & Roles</BreadcrumbItem>
        <BreadcrumbItem>Roles</BreadcrumbItem>
      </Breadcrumbs>
      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-xl">Roles</p>
          </div>
        </CardHeader>

        <CardBody>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Input
              className="max-w-xs"
              placeholder="Search roles"
              value={query}
              onValueChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
            />

            <div className="ml-auto">
              <Button color="primary" onPress={() => alert("Add Role clicked")}>
                Add Role
              </Button>
            </div>
          </div>

          <Table
            removeWrapper
            aria-label="Roles table"
            className="[&_th]:py-3 [&_td]:py-3 [&_td]:text-sm [&_th]:text-xs"
          >
            <TableHeader>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>PERMISSIONS</TableColumn>
              <TableColumn>MEMBERS</TableColumn>
              <TableColumn>CREATED</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No roles found">
              {slice.map((r) => (
                <TableRow key={r.role}>
                  <TableCell>{r.role}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {r.permissions.map((p) => (
                        <Chip key={p} size="sm" variant="flat">
                          {p}
                        </Chip>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{r.members}</TableCell>
                  <TableCell>{r.created}</TableCell>
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
