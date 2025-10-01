import { useMemo, useState } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Select, SelectItem } from "@heroui/select";
import { DateRangePicker } from "@heroui/date-picker";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Dayjs } from "dayjs";

import DefaultLayout from "@/layouts/default";
import TableFooter from "@/components/table-footer";
import dayjs from "@/lib/dayjs";
import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

type Category = "Coffee" | "Tea" | "Bakery" | "Dessert";

const BASE_PRICE: Record<Category, number> = {
  Coffee: 3.5,
  Tea: 2.2,
  Bakery: 2.1,
  Dessert: 3.8,
};

type Order = {
  id: string;
  date: string;
  product: string;
  category: Category;
  qty: number;
  price: number;
  returning: boolean;
};

function genData(): Order[] {
  const products = [
    ["Latte", "Coffee"],
    ["Espresso", "Coffee"],
    ["Mocha", "Coffee"],
    ["Matcha Latte", "Tea"],
    ["Lemon Tea", "Tea"],
    ["Croissant", "Bakery"],
    ["Cinnamon Roll", "Bakery"],
    ["Affogato", "Dessert"],
    ["Brownie", "Dessert"],
  ] as const satisfies readonly (readonly [string, Category])[];

  const out: Order[] = [];
  const today = dayjs();
  let id = 1000;

  for (let i = 0; i < 60; i++) {
    const d = today.subtract(i, "day");
    const n = 5 + Math.floor(Math.random() * 12);

    for (let j = 0; j < n; j++) {
      const [p, c] = products[Math.floor(Math.random() * products.length)];
      const qty = 1 + Math.floor(Math.random() * 3);
      const base = BASE_PRICE[c];
      const price = Number((base + Math.random()).toFixed(2));

      out.push({
        id: `#${id++}`,
        date: d.format("YYYY-MM-DD"),
        product: p,
        category: c,
        qty,
        price: Number((price + Math.random()).toFixed(2)),
        returning: Math.random() < 0.35,
      });
    }
  }

  return out.reverse();
}

const DATA = genData();

type Granularity = "day" | "week" | "month";

export default function AnalyticsPage() {
  const tenantPrimary =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      ?.trim() || "#3b82f6";

  const [granularity, setGranularity] = useState<Granularity>("day");
  const [search, setSearch] = useState("");

  const [range, setRange] = useState<{
    start: Dayjs | null;
    end: Dayjs | null;
  }>({
    start: dayjs().subtract(13, "day"),
    end: dayjs(),
  });

  const filtered = useMemo(() => {
    return DATA.filter((o) => {
      const d = dayjs(o.date, "YYYY-MM-DD");
      let ok = true;

      if (range.start) ok = ok && d.isSameOrAfter(range.start, "day");
      if (range.end) ok = ok && d.isSameOrBefore(range.end, "day");

      return ok;
    });
  }, [range]);

  const bucketed = useMemo(() => {
    const map = new Map<
      string,
      { label: string; orders: number; revenue: number; ts: number }
    >();

    filtered.forEach((o) => {
      const d = dayjs(o.date);

      const key =
        granularity === "day"
          ? d.format("YYYY-MM-DD")
          : granularity === "week"
            ? `${d.isoWeekYear()}-W${String(d.isoWeek()).padStart(2, "0")}`
            : d.format("YYYY-MM");

      const label =
        granularity === "day"
          ? d.format("DD MMM")
          : granularity === "week"
            ? `W${d.isoWeek()} ${d.isoWeekYear()}`
            : d.format("MMM YYYY");

      const ts =
        granularity === "day"
          ? d.startOf("day").valueOf()
          : granularity === "week"
            ? d.startOf("week").valueOf()
            : d.startOf("month").valueOf();

      const prev = map.get(key) ?? { label, orders: 0, revenue: 0, ts };

      prev.orders += 1;
      prev.revenue += o.qty * o.price;
      map.set(key, prev);
    });

    return Array.from(map.values())
      .sort((a, b) => a.ts - b.ts)
      .map(({ label, orders, revenue }) => ({ label, orders, revenue }));
  }, [filtered, granularity]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();

    filtered.forEach((o) =>
      map.set(o.category, (map.get(o.category) ?? 0) + 1),
    );

    return Array.from(map.entries()).map(([category, orders]) => ({
      category,
      orders,
    }));
  }, [filtered]);

  const topProducts = useMemo(() => {
    const m = new Map<
      string,
      { product: string; orders: number; revenue: number }
    >();

    filtered.forEach((o) => {
      const prev = m.get(o.product) ?? {
        product: o.product,
        orders: 0,
        revenue: 0,
      };

      prev.orders += 1;
      prev.revenue += o.qty * o.price;
      m.set(o.product, prev);
    });

    return Array.from(m.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(topProducts.length / pageSize));
  const start = (Math.min(page, totalPages) - 1) * pageSize;
  const slice = topProducts.slice(start, start + pageSize);

  const money = (n: number) => `$${n.toFixed(2)}`;

  return (
    <DefaultLayout>
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Analytics</BreadcrumbItem>
      </Breadcrumbs>

      <Card>
        <CardHeader>
          <p className="font-bold text-xl">Analytics</p>
        </CardHeader>
        <CardBody>
          <Row>
            <Col className="flex gap-2" xs={10}>
              <DateRangePicker
                onChange={(v) =>
                  setRange({
                    start: v?.start ? dayjs(v.start.toString()) : null,
                    end: v?.end ? dayjs(v.end.toString()) : null,
                  })
                }
              />
              <Select
                selectedKeys={[granularity]}
                onChange={(e) =>
                  setGranularity((e.target.value as any) || "day")
                }
              >
                <SelectItem key="day">Day</SelectItem>
                <SelectItem key="week">Week</SelectItem>
                <SelectItem key="month">Month</SelectItem>
              </Select>
              <Input
                placeholder="Find product / order…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col className="text-end" xs={2}>
              <Button className="bg-accent text-white">Export CSV</Button>
            </Col>
          </Row>
          <Tabs aria-label="analytics-tabs" className="mt-2">
            <Tab key="charts" title="Charts">
              <div className="space-y-6">
                <Card className="border border-default-200">
                  <CardHeader className="py-3">
                    <div>
                      <p className="text-sm text-default-500">
                        Revenue over time
                      </p>
                      <p className="text-xs text-default-400">
                        Granularity: {granularity}
                      </p>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="h-70">
                      <ResponsiveContainer height="100%" width="100%">
                        <LineChart
                          data={bucketed}
                          margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
                        >
                          <CartesianGrid opacity={0.25} strokeDasharray="3 3" />
                          <XAxis
                            axisLine={false}
                            dataKey="label"
                            tickLine={false}
                          />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                              border: "1px solid var(--border)",
                              boxShadow: "var(--shadow)",
                            }}
                            formatter={(val: any) => [
                              `$${Number(val).toFixed(2)}`,
                              "Revenue",
                            ]}
                          />
                          <Line
                            activeDot={{ r: 5 }}
                            dataKey="revenue"
                            dot={false}
                            stroke={tenantPrimary}
                            strokeWidth={2}
                            type="monotone"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardBody>
                </Card>

                <Card className="border border-default-200">
                  <CardHeader className="py-3">
                    <div>
                      <p className="text-sm text-default-500">
                        Orders by category
                      </p>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="h-60">
                      <ResponsiveContainer height="100%" width="100%">
                        <BarChart
                          data={byCategory}
                          margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
                        >
                          <CartesianGrid opacity={0.25} strokeDasharray="3 3" />
                          <XAxis
                            axisLine={false}
                            dataKey="category"
                            tickLine={false}
                          />
                          <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                            }}
                            formatter={(val: any) => [String(val), "Orders"]}
                          />
                          <Legend />
                          <Bar
                            dataKey="orders"
                            fill={tenantPrimary}
                            name="Orders"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>
            <Tab key="top" title="Top products">
              <Card className="border border-default-200">
                <CardHeader className="text-sm font-semibold text-gray-600">
                  Top products
                </CardHeader>
                <CardBody>
                  <Table removeWrapper aria-label="Top products">
                    <TableHeader>
                      <TableColumn>PRODUCT</TableColumn>
                      <TableColumn>ORDERS</TableColumn>
                      <TableColumn>REVENUE</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No data">
                      {slice.map((r) => (
                        <TableRow key={r.product}>
                          <TableCell className="font-medium">
                            {r.product}
                          </TableCell>
                          <TableCell>{r.orders}</TableCell>
                          <TableCell>{money(r.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <TableFooter
                    showRange
                    page={page}
                    pageSize={pageSize}
                    totalItems={topProducts.length}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                  />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </DefaultLayout>
  );
}
