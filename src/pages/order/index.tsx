import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { useMemo, useState } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { DateRangePicker } from "@heroui/date-picker";
import dayjs, { Dayjs } from "dayjs";

import StatusChip from "@/components/status-chip";
import DefaultLayout from "@/layouts/default";
import TableFooter from "@/components/table-footer";

type Order = {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: "paid" | "pending" | "failed";
  created: string;
};

const orders: Order[] = [
  {
    id: "#1001",
    customer: "Aya",
    items: 3,
    total: "$12.50",
    status: "paid",
    created: "2025-09-23 09:21",
  },
  {
    id: "#1002",
    customer: "Raka",
    items: 2,
    total: "$7.00",
    status: "pending",
    created: "2025-09-23 09:45",
  },
  {
    id: "#1003",
    customer: "Dewi",
    items: 5,
    total: "$20.00",
    status: "paid",
    created: "2025-09-23 10:05",
  },
  {
    id: "#1004",
    customer: "Bima",
    items: 1,
    total: "$3.50",
    status: "failed",
    created: "2025-09-23 10:18",
  },
  {
    id: "#1005",
    customer: "Sari",
    items: 4,
    total: "$16.00",
    status: "paid",
    created: "2025-09-23 10:40",
  },
  {
    id: "#1006",
    customer: "Dimas",
    items: 2,
    total: "$8.50",
    status: "pending",
    created: "2025-09-23 11:02",
  },
  {
    id: "#1007",
    customer: "Andre",
    items: 3,
    total: "$12.00",
    status: "failed",
    created: "2025-09-23 11:33",
  },
  {
    id: "#1008",
    customer: "Rani",
    items: 2,
    total: "$7.50",
    status: "paid",
    created: "2025-09-23 12:01",
  },
  {
    id: "#1009",
    customer: "Tasya",
    items: 1,
    total: "$3.00",
    status: "failed",
    created: "2025-09-23 12:14",
  },
  {
    id: "#1010",
    customer: "Yoga",
    items: 6,
    total: "$24.50",
    status: "pending",
    created: "2025-09-23 12:39",
  },
];

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Order["status"]>("all");
  const [customerName, setCustomerName] = useState("");

  const [dateRange, setDateRange] = useState<{
    start: Dayjs | null;
    end: Dayjs | null;
  }>({
    start: null,
    end: null,
  });

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const created = dayjs(o.created, "YYYY-MM-DD HH:mm");

      const matchQuery =
        query === "" ||
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase());

      const matchStatus = status === "all" || o.status === status;

      const matchCustomer =
        customerName.trim() === "" ||
        o.customer.toLowerCase().includes(customerName.trim().toLowerCase());

      let matchDate = true;

      if (dateRange.start)
        matchDate =
          matchDate && created.isAfter(dateRange.start.subtract(1, "day"));
      if (dateRange.end)
        matchDate = matchDate && created.isBefore(dateRange.end.add(1, "day"));

      return matchQuery && matchStatus && matchCustomer && matchDate; // NEW
    });
  }, [query, status, dateRange, customerName]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / Number(rowsPerPage)),
  );
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * Number(rowsPerPage);
  const slice = filtered.slice(start, start + Number(rowsPerPage));

  const resetFilters = () => {
    setQuery("");
    setCustomerName("");
    setStatus("all");
    setPage(1);
  };

  const isFilterActive = query !== "" || customerName !== "" || status !== "all";

  return (
    <DefaultLayout>
      <Breadcrumbs className="mb-5" size="lg">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Order</BreadcrumbItem>
      </Breadcrumbs>
      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-xl">Orders</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Input
              className="max-w-xs"
              placeholder="Search orders"
              size="md"
              type="text"
              value={query}
              onValueChange={setQuery}
            />

            <Input
              className="max-w-xs"
              placeholder="Search by customer name"
              size="md"
              type="text"
              value={customerName}
              onValueChange={setCustomerName}
            />

            <Select
              aria-label="Filter by status"
              className="w-40"
              labelPlacement="outside-left"
              selectedKeys={[status]}
              size="md"
              onSelectionChange={(keys) =>
                setStatus(Array.from(keys)[0] as any)
              }
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="paid">Paid</SelectItem>
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="failed">Failed</SelectItem>
            </Select>

            <DateRangePicker
              className="max-w-xs"
              size="md"
              onChange={(v) =>
                setDateRange({
                  start: v?.start ? dayjs(v.start.toString()) : null,
                  end: v?.end ? dayjs(v.end.toString()) : null,
                })
              }
            />

            <div className="ml-auto flex items-center gap-2">
              <Button
                isDisabled={!isFilterActive}
                variant="flat"
                onPress={resetFilters}
              >
                Reset
              </Button>
            </div>
          </div>

          <Table removeWrapper aria-label="Orders table">
            <TableHeader>
              <TableColumn>ORDER ID</TableColumn>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>ITEMS</TableColumn>
              <TableColumn>TOTAL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>CREATED</TableColumn>
            </TableHeader>
            <TableBody>
              {slice.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <StatusChip status={order.status} />
                  </TableCell>
                  <TableCell>{order.created}</TableCell>
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
