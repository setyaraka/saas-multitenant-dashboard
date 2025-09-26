import { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";

import TableFooter from "@/components/table-footer";

export type Invoice = {
  id: string;
  date: string;
  periodFrom: string;
  periodTo: string;
  total: number;
  status: "paid" | "past_due" | "refunded";
  pdfUrl?: string;
};

type Props = {
  invoices: Invoice[];
  className?: string;
};

const money = (n: number) => `$${n.toFixed(2)}`;

const StatusChip = ({ s }: { s: Invoice["status"] }) => {
  const map = {
    paid: { label: "Paid", color: "success" as const },
    past_due: { label: "Past due", color: "danger" as const },
    refunded: { label: "Refunded", color: "warning" as const },
  }[s];

  return (
    <Chip color={map.color} size="sm" variant="flat">
      {map.label}
    </Chip>
  );
};

export default function InvoicesTable({ invoices, className = "" }: Props) {
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const filtered = useMemo(() => {
    const qq = query.trim().toLowerCase();

    if (!qq) return invoices;

    return invoices.filter(
      (invoice) =>
        invoice.id.toLowerCase().includes(qq) ||
        invoice.status.toLowerCase().includes(qq),
    );
  }, [query, invoices]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * rowsPerPage;
  const slice = filtered.slice(start, start + rowsPerPage);

  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          className="max-w-xs"
          placeholder="Search invoices (ID / status)"
          value={query}
          onValueChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
        />
      </div>

      <Table
        removeWrapper
        aria-label="Invoices table"
        className="[&_th]:py-3 [&_td]:py-3 [&_td]:text-sm [&_th]:text-xs"
      >
        <TableHeader>
          <TableColumn>INVOICE</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>PERIOD</TableColumn>
          <TableColumn>TOTAL</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No invoices found">
          {slice.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>
                {invoice.periodFrom} — {invoice.periodTo}
              </TableCell>
              <TableCell>{money(invoice.total)}</TableCell>
              <TableCell>
                <StatusChip s={invoice.status} />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isDisabled={!invoice.pdfUrl}
                    size="sm"
                    variant="flat"
                    onPress={() => window.open(invoice.pdfUrl ?? "#", "_blank")}
                  >
                    Download PDF
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TableFooter
        showRange
        page={page}
        pageSize={rowsPerPage}
        totalItems={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={setRowsPerPage}
      />
    </div>
  );
}
