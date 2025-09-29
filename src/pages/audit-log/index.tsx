import { useMemo, useState } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { DateRangePicker } from "@heroui/date-picker";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Dayjs } from "dayjs";

import TableFooter from "@/components/table-footer";
import dayjs from "@/lib/dayjs";

type Result = "success" | "fail" | "denied";
type Action =
  | "auth.login"
  | "order.create"
  | "order.refund"
  | "user.update"
  | "menu.update";

type Log = {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: "staff" | "manager";
  action: Action;
  resourceType: "user" | "order" | "menu";
  resourceId: number;
  reference?: string;
  result: Result;
  ip: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  correlationId: string;
};

const ACTORS = [
  ["Raka", "staff"],
  ["Dina", "manager"],
  ["Bima", "manager"],
  ["Sari", "staff"],
] as const;

const ACTIONS: Action[] = [
  "auth.login",
  "order.create",
  "order.refund",
  "user.update",
  "menu.update",
];

const METHODS: Array<Log["method"]> = ["GET", "POST", "PUT", "DELETE"];
const RESULTS: Result[] = ["success", "fail", "denied"];

function randPick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genLogs(n = 120): Log[] {
  const out: Log[] = [];
  let now = dayjs();

  for (let i = 0; i < n; i++) {
    now = now.subtract(1, "hour");
    const [name, role] = randPick(ACTORS);
    const action = randPick(ACTIONS);
    const resourceType: Log["resourceType"] = action.startsWith("order")
      ? "order"
      : action.startsWith("menu")
        ? "menu"
        : "user";
    const id = 1000 + Math.floor(Math.random() * 200);
    const method = randPick(METHODS);
    const result = randPick(RESULTS);
    const ip = `10.0.0.${1 + Math.floor(Math.random() * 12)}`;
    const path = `/api/${Math.floor(Math.random() * 3)}`;

    out.push({
      id: `log-${i + 1}`,
      timestamp: now.toISOString(),
      actorName: name,
      actorRole: role,
      action,
      resourceType,
      resourceId: id,
      reference: `#${id}`,
      result,
      ip,
      method,
      path,
      correlationId: crypto.randomUUID().slice(0, 8),
    });
  }

  return out;
}

const DATA = genLogs();

function ResultChip({ value }: { value: Result }) {
  const map = {
    success: { label: "Success", color: "success" as const },
    denied: { label: "Denied", color: "warning" as const },
    fail: { label: "Fail", color: "danger" as const },
  }[value];

  return (
    <Chip color={map.color} variant="flat">
      {map.label}
    </Chip>
  );
}

export default function AuditLogPage() {
  const [range, setRange] = useState<{
    start: Dayjs | null;
    end: Dayjs | null;
  }>({
    start: dayjs().subtract(14, "day"),
    end: dayjs(),
  });
  const [actionFilter, setActionFilter] = useState<"all" | Action>("all");
  const [resultFilter, setResultFilter] = useState<"all" | Result>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    return DATA.filter((log) => {
      const t = dayjs(log.timestamp);
      let ok = true;

      if (range.start) ok = ok && t.isSameOrAfter(range.start, "day");
      if (range.end) ok = ok && t.isSameOrBefore(range.end, "day");
      if (actionFilter !== "all") ok = ok && log.action === actionFilter;
      if (resultFilter !== "all") ok = ok && log.result === resultFilter;
      if (qq) {
        const hay =
          `${log.actorName} ${log.actorRole} ${log.action} ${log.resourceType} ${log.resourceId} ${log.reference} ${log.ip} ${log.method} ${log.path} ${log.correlationId}`.toLowerCase();

        ok = ok && hay.includes(qq);
      }

      return ok;
    });
  }, [range, actionFilter, resultFilter, q]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Log | null>(null);

  const openDetail = (log: Log) => {
    setSelected(log);
    setOpen(true);
  };

  const exportCsv = () => {
    const headers = [
      "time",
      "actor",
      "role",
      "action",
      "resource",
      "result",
      "ip",
      "method",
      "path",
      "correlation",
    ];
    const rows = filtered.map((l) => [
      dayjs(l.timestamp).format("YYYY-MM-DD HH:mm:ss"),
      l.actorName,
      l.actorRole,
      l.action,
      `${l.resourceType}:${l.resourceId}`,
      l.result,
      l.ip,
      l.method,
      l.path,
      l.correlationId,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `audit-log-${dayjs().format("YYYYMMDD-HHmmss")}.csv`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <div className="h-screen">
      <Breadcrumbs className="mb-4" size="lg">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Audit log</BreadcrumbItem>
      </Breadcrumbs>

      <Card>
        <CardHeader className="font-bold text-xl">Audit log</CardHeader>
        <CardBody>
          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-[260px_220px_200px_1fr_auto]">
            <DateRangePicker
              aria-label="Date range"
              onChange={(v) =>
                setRange({
                  start: v?.start ? dayjs(v.start.toString()) : null,
                  end: v?.end ? dayjs(v.end.toString()) : null,
                })
              }
            />

            <Select
              aria-label="Action"
              selectedKeys={[actionFilter]}
              onSelectionChange={(keys) =>
                setActionFilter(Array.from(keys)[0] as "all" | Action)
              }
            >
              <SelectItem key="all">All actions</SelectItem>
              <SelectItem key="all">auth.login</SelectItem>
              <SelectItem key="all">order.create</SelectItem>
              <SelectItem key="all">order.refund</SelectItem>
              <SelectItem key="all">user.update</SelectItem>
              <SelectItem key="all">menu.update</SelectItem>
            </Select>

            <Select
              aria-label="Result"
              selectedKeys={[resultFilter]}
              onSelectionChange={(keys) =>
                setResultFilter(Array.from(keys)[0] as "all" | Result)
              }
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="success">Success</SelectItem>
              <SelectItem key="denied">Denied</SelectItem>
              <SelectItem key="fail">Fail</SelectItem>
            </Select>

            <Input
              placeholder="actor, resource, IP, correlation…"
              value={q}
              onValueChange={setQ}
            />

            <Button color="primary" onPress={exportCsv}>
              Export CSV
            </Button>
          </div>

          <Table
            removeWrapper
            aria-label="Audit log table"
            className="[&_th]:py-2.5 [&_td]:py-3 [&_td]:align-top [&_th]:text-xs [&_td]:text-sm"
          >
            <TableHeader>
              <TableColumn width={180}>Time</TableColumn>
              <TableColumn>Actor</TableColumn>
              <TableColumn>Action → Resource</TableColumn>
              <TableColumn width={120}>Result</TableColumn>
              <TableColumn width={140}>IP</TableColumn>
              <TableColumn width={90}>View</TableColumn>
            </TableHeader>

            <TableBody emptyContent="No log entries">
              {slice.map((log) => {
                const t = dayjs(log.timestamp);

                return (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="leading-tight">
                        <div>{t.format("M/D/YYYY, h:mm:ss A")}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="leading-tight">
                        <div className="font-medium">{log.actorName}</div>
                        <div className="text-xs text-gray-500">
                          ({log.actorRole})
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="leading-tight">
                        <div className="font-medium">{log.action}</div>
                        <div className="text-xs text-gray-500">
                          {log.resourceType} • {log.resourceId} •{" "}
                          {log.reference}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <ResultChip value={log.result} />
                    </TableCell>

                    <TableCell>
                      <div className="leading-tight">
                        <div>{log.ip}</div>
                        <div className="text-xs text-gray-500">
                          {log.method} {log.path}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Button variant="flat" onPress={() => openDetail(log)}>
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <TableFooter
            showRange
            className="mt-3"
            page={safePage}
            pageSize={pageSize}
            totalItems={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </CardBody>
      </Card>

      <Modal isOpen={open} scrollBehavior="inside" onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader className="text-base font-semibold">
            Log detail
          </ModalHeader>
          <ModalBody>
            {selected && (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">ID:</span> {selected.id}
                </div>
                <div>
                  <span className="font-medium">Time:</span>{" "}
                  {dayjs(selected.timestamp).format("YYYY-MM-DD HH:mm:ss")}
                </div>
                <div>
                  <span className="font-medium">Actor:</span>{" "}
                  {selected.actorName} ({selected.actorRole})
                </div>
                <div>
                  <span className="font-medium">Action:</span> {selected.action}
                </div>
                <div>
                  <span className="font-medium">Resource:</span>{" "}
                  {selected.resourceType} • {selected.resourceId} •{" "}
                  {selected.reference}
                </div>
                <div>
                  <span className="font-medium">Result:</span> {selected.result}
                </div>
                <div>
                  <span className="font-medium">IP:</span> {selected.ip}
                </div>
                <div>
                  <span className="font-medium">Request:</span>{" "}
                  {selected.method} {selected.path}
                </div>
                <div>
                  <span className="font-medium">Correlation:</span>{" "}
                  {selected.correlationId}
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
