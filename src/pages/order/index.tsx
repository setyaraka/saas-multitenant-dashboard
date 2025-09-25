import DefaultLayout from "@/layouts/default";
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
import { Pagination } from "@heroui/pagination";
import { useMemo, useState } from "react";
import Row from "@/components/layout/row";
import Col from "@/components/layout/col";
import StatusChip from "@/components/status-chip";
import RowsPerPage from "@/components/rows-per-page";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { DateRangePicker } from "@heroui/date-picker";
import dayjs, { Dayjs } from "dayjs";

type Order = {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: "paid" | "pending" | "failed";
  created: string;
};

const orders: Order[] = [
  { id: "#1001", customer: "Aya", items: 3, total: "$12.50", status: "paid", created: "2025-09-23 09:21" },
  { id: "#1002", customer: "Raka", items: 2, total: "$7.00", status: "pending", created: "2025-09-23 09:45" },
  { id: "#1003", customer: "Dewi", items: 5, total: "$20.00", status: "paid", created: "2025-09-23 10:05" },
  { id: "#1004", customer: "Bima", items: 1, total: "$3.50", status: "failed", created: "2025-09-23 10:18" },
  { id: "#1005", customer: "Sari", items: 4, total: "$16.00", status: "paid", created: "2025-09-23 10:40" },
  { id: "#1006", customer: "Dimas", items: 2, total: "$8.50", status: "pending", created: "2025-09-23 11:02" },
  { id: "#1007", customer: "Andre", items: 3, total: "$12.00", status: "failed", created: "2025-09-23 11:33" },
  { id: "#1008", customer: "Rani", items: 2, total: "$7.50", status: "paid", created: "2025-09-23 12:01" },
  { id: "#1009", customer: "Tasya", items: 1, total: "$3.00", status: "failed", created: "2025-09-23 12:14" },
  { id: "#1010", customer: "Yoga", items: 6, total: "$24.50", status: "pending", created: "2025-09-23 12:39" },
];

export default function OrdersPage() {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<"all" | Order["status"]>("all");
    const [customerName, setCustomerName] = useState("");
  
    const [dateRange, setDateRange] = useState<{ start: Dayjs | null; end: Dayjs | null }>({
        start: null,
        end: null,
    });
  
    const filtered = useMemo(() => {
        return orders.filter((o) => {
          const created = dayjs(o.created, "YYYY-MM-DD HH:mm");
    
          // search utama (id / customer)
          const matchQuery =
            query === "" ||
            o.id.toLowerCase().includes(query.toLowerCase()) ||
            o.customer.toLowerCase().includes(query.toLowerCase());
    
          const matchStatus = status === "all" || o.status === status;
    
          // NEW: filter khusus customer (substring, case-insensitive)
          const matchCustomer =
            customerName.trim() === "" ||
            o.customer.toLowerCase().includes(customerName.trim().toLowerCase());
    
          // filter tanggal (inklusif)
          let matchDate = true;
          if (dateRange.start) matchDate = matchDate && created.isAfter(dateRange.start.subtract(1, "day"));
          if (dateRange.end)   matchDate = matchDate && created.isBefore(dateRange.end.add(1, "day"));
    
          return matchQuery && matchStatus && matchCustomer && matchDate; // NEW
        });
    }, [query, status, dateRange, customerName]);

    return (
        <DefaultLayout>
            <Breadcrumbs size="lg" className="mb-5">
                <BreadcrumbItem>Home</BreadcrumbItem>
                <BreadcrumbItem>Order</BreadcrumbItem>
            </Breadcrumbs>
            <Card>
                <CardHeader className="flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-xl">Orders</p>
                        <a href="#" className="text-muted-foreground">#</a>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Input
                            type="text"
                            placeholder="Search orders"
                            className="max-w-xs"
                            size="md"
                            value={query}
                            onValueChange={setQuery}
                        />

                        <Input
                            type="text"
                            placeholder="Search by customer name"
                            className="max-w-xs"
                            size="md"
                            value={customerName}
                            onValueChange={setCustomerName}
                        />

                        <Select
                            labelPlacement="outside-left"
                            size="md"
                            selectedKeys={[status]}
                            onSelectionChange={(keys) => setStatus(Array.from(keys)[0] as any)}
                            className="w-40"
                            aria-label="Filter by status"
                        >
                            <SelectItem key="all">All</SelectItem>
                            <SelectItem key="paid">Paid</SelectItem>
                            <SelectItem key="pending">Pending</SelectItem>
                            <SelectItem key="failed">Failed</SelectItem>
                        </Select>

                        <DateRangePicker
                            size="md"
                            className="max-w-xs"
                            onChange={(v) =>
                                setDateRange({
                                start: v?.start ? dayjs(v.start.toString()) : null,
                                end:   v?.end   ? dayjs(v.end.toString())   : null,
                                })
                            }
                        />

                        <div className="ml-auto flex items-center gap-2">
                            <Button size="md" color="warning" variant="solid" onPress={() => window.location.reload()}>
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <Table
                        aria-label="Orders table"
                        removeWrapper
                    >
                        <TableHeader>
                            <TableColumn>ORDER ID</TableColumn>
                            <TableColumn>CUSTOMER</TableColumn>
                            <TableColumn>ITEMS</TableColumn>
                            <TableColumn>TOTAL</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>CREATED</TableColumn>
                        </TableHeader>
                        <TableBody>
                        {filtered.map((order) => (
                            <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell>{order.total}</TableCell>
                            <TableCell><StatusChip status={order.status} /></TableCell>
                            <TableCell>{order.created}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>

                    <Row className="items-center mt-5">
                        <Col xs={4}>
                            <span>Total Item: {filtered.length}</span>
                        </Col>
                        <Col xs={4} className="flex justify-center">
                            <Pagination initialPage={1} total={10} />
                        </Col>
                        <Col xs={4} className="flex justify-end">
                            <RowsPerPage />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </DefaultLayout>
    );
}
