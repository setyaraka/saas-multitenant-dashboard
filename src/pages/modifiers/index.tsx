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

import DefaultLayout from "@/layouts/default";
import TableFooter from "@/components/table-footer";

type Modifier = {
  name: string;
  type: "single" | "stepper" | "multi";
  options: string[];
  updated: string;
};

const DATA: Modifier[] = [
  {
    name: "Milk",
    type: "single",
    options: ["Whole", "Oat", "Almond"],
    updated: "2025-09-21",
  },
  {
    name: "Sugar",
    type: "stepper",
    options: ["0%", "25%", "50%", "75%", "100%"],
    updated: "2025-09-20",
  },
  {
    name: "Ice",
    type: "stepper",
    options: ["Less", "Normal", "Extra"],
    updated: "2025-09-20",
  },
  {
    name: "Toppings",
    type: "multi",
    options: ["Pearl", "Pudding", "Grass Jelly"],
    updated: "2025-09-22",
  },
];

const typeLabel: Record<Modifier["type"], string> = {
  single: "Single select",
  stepper: "Stepper",
  multi: "Multi select",
};

export default function ModifiersPage() {
  const [query, setQuery] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return DATA;

    return DATA.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        typeLabel[m.type].toLowerCase().includes(q) ||
        m.options.some((o) => o.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <DefaultLayout>
      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-xl">Modifiers</p>
          </div>
        </CardHeader>

        <CardBody>
          <div className="flex items-center gap-3 mb-4">
            <Input
              className="max-w-xs"
              placeholder="Search modifiers"
              value={query}
              onValueChange={setQuery}
            />
            <div className="ml-auto">
              <Button color="primary" onPress={() => alert("Add Modifier")}>
                Add Modifier
              </Button>
            </div>
          </div>

          <Table
            removeWrapper
            aria-label="Modifiers table"
            className="[&_th]:py-3 [&_td]:py-3 [&_td]:text-sm [&_th]:text-xs"
          >
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>OPTIONS</TableColumn>
              <TableColumn>UPDATED</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No modifiers found">
              {filtered.map((m) => (
                <TableRow key={m.name}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{typeLabel[m.type]}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {m.options.map((o) => (
                        <Chip key={o} size="sm" variant="flat">
                          {o}
                        </Chip>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{m.updated}</TableCell>
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
