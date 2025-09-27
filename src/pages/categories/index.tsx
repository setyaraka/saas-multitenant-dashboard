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
import { useMemo, useState } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";

import DefaultLayout from "@/layouts/default";
import TableFooter from "@/components/table-footer";

type Category = {
  name: string;
  items: number;
  updated: string;
};

const DATA: Category[] = [
  { name: "Coffee", items: 6, updated: "2025-09-20" },
  { name: "Tea", items: 4, updated: "2025-09-21" },
  { name: "Bakery", items: 5, updated: "2025-09-22" },
  { name: "Dessert", items: 3, updated: "2025-09-22" },
];

export default function CategoriesPage() {
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return DATA;

    return DATA.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <DefaultLayout>
      <Breadcrumbs className="mb-5" size="lg">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Catalog</BreadcrumbItem>
        <BreadcrumbItem>Categories</BreadcrumbItem>
      </Breadcrumbs>
      <Card>
        <CardHeader>
          <p className="font-bold text-xl">Categories</p>
        </CardHeader>

        <CardBody>
          <div className="flex items-center gap-3 mb-4">
            <Input
              className="max-w-xs"
              placeholder="Search categories"
              value={query}
              onValueChange={setQuery}
            />
            <div className="ml-auto">
              <Button color="primary" onPress={() => alert("Add Category")}>
                Add Category
              </Button>
            </div>
          </div>

          <Table
            removeWrapper
            aria-label="Categories table"
            className="[&_th]:py-3 [&_td]:py-3 [&_td]:text-sm [&_th]:text-xs"
          >
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>ITEMS</TableColumn>
              <TableColumn>UPDATED</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No categories found">
              {filtered.map((c) => (
                <TableRow key={c.name}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.items}</TableCell>
                  <TableCell>{c.updated}</TableCell>
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
