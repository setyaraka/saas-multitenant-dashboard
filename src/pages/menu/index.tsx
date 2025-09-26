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
import { Chip } from "@heroui/chip";
import React, { useMemo, useState } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";

import DefaultLayout from "@/layouts/default";
import TableFooter from "@/components/table-footer";

type MenuItem = {
  sku: string;
  name: string;
  category: "Coffee" | "Tea" | "Bakery" | "Dessert";
  price: number;
  available: boolean;
  tags: string[];
};

const DATA: MenuItem[] = [
  {
    sku: "COF-001",
    name: "Latte",
    category: "Coffee",
    price: 3.5,
    available: true,
    tags: ["hot", "best"],
  },
  {
    sku: "COF-002",
    name: "Espresso",
    category: "Coffee",
    price: 2.5,
    available: true,
    tags: ["shot"],
  },
  {
    sku: "TEA-010",
    name: "Matcha Latte",
    category: "Tea",
    price: 3.8,
    available: true,
    tags: ["green"],
  },
  {
    sku: "FD-101",
    name: "Croissant",
    category: "Bakery",
    price: 2.2,
    available: false,
    tags: ["butter"],
  },
  {
    sku: "FD-111",
    name: "Cinnamon Roll",
    category: "Bakery",
    price: 2.9,
    available: true,
    tags: ["sweet"],
  },
  {
    sku: "IC-210",
    name: "Affogato",
    category: "Dessert",
    price: 4.2,
    available: true,
    tags: ["cold"],
  },
  {
    sku: "TEA-021",
    name: "Lemon Tea",
    category: "Tea",
    price: 2.1,
    available: true,
    tags: ["ice"],
  },
  {
    sku: "COF-099",
    name: "Mocha",
    category: "Coffee",
    price: 3.7,
    available: true,
    tags: ["choco"],
  },
  {
    sku: "FD-222",
    name: "Bagel",
    category: "Bakery",
    price: 1.9,
    available: true,
    tags: ["sesame"],
  },
  {
    sku: "FD-333",
    name: "Brownie",
    category: "Dessert",
    price: 2.7,
    available: true,
    tags: ["cacao"],
  },
  {
    sku: "TEA-031",
    name: "Peach Tea",
    category: "Tea",
    price: 2.6,
    available: true,
    tags: ["fruit"],
  },
];

const ALL_TAGS = Array.from(new Set(DATA.flatMap((d) => d.tags))).sort();

export default function MenuPage() {
  const [query, setQuery] = useState("");

  const [sku, setSku] = useState("");
  const [category, setCategory] = useState<"all" | MenuItem["category"]>("all");
  const [available, setAvailable] = useState<"all" | "available" | "out">(
    "all",
  );
  const [tagKeys, setTagKeys] = useState<Set<string>>(new Set());

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const skuQ = sku.trim().toLowerCase();
    const selectedTags = Array.from(tagKeys);

    return DATA.filter((m) => {
      const matchQuery =
        !q ||
        m.sku.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q);

      const matchSku = !skuQ || m.sku.toLowerCase().includes(skuQ);
      const matchCategory = category === "all" || m.category === category;
      const matchAvail =
        available === "all" ||
        (available === "available" ? m.available : !m.available);

      const matchTags =
        selectedTags.length === 0 ||
        selectedTags.every((t) => m.tags.includes(t));

      return matchQuery && matchSku && matchCategory && matchAvail && matchTags;
    });
  }, [query, sku, category, available, tagKeys]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / Number(rowsPerPage)),
  );
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * Number(rowsPerPage);
  const slice = filtered.slice(start, start + Number(rowsPerPage));

  const money = (n: number) => `$${n.toFixed(2)}`;

  const resetFilters = () => {
    setQuery("");
    setSku("");
    setCategory("all");
    setAvailable("all");
    setTagKeys(new Set());
    setRowsPerPage(10);
    setPage(1);
  };

  const isFilterActive = query !== "" || sku !== "" || category !== "all" || available !== "all" || tagKeys !== new Set();

  return (
    <DefaultLayout>
      <Breadcrumbs className="mb-5" size="lg">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Menu</BreadcrumbItem>
      </Breadcrumbs>
      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-xl">Menu</p>
          </div>
        </CardHeader>

        <CardBody>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Input
              className="max-w-xs"
              placeholder="Search menu"
              value={query}
              onValueChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
            />

            <Input
              className="w-40"
              placeholder="SKU"
              value={sku}
              onValueChange={(v) => {
                setSku(v);
                setPage(1);
              }}
            />

            <Select
              aria-label="Category"
              className="w-40"
              selectedKeys={[category]}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;

                setCategory((val as any) || "all");
                setPage(1);
              }}
            >
              <SelectItem key="all">All categories</SelectItem>
              <SelectItem key="Coffee">Coffee</SelectItem>
              <SelectItem key="Tea">Tea</SelectItem>
              <SelectItem key="Bakery">Bakery</SelectItem>
              <SelectItem key="Dessert">Dessert</SelectItem>
            </Select>

            <Select
              aria-label="Availability"
              className="w-36"
              selectedKeys={[available]}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as "all" | "available" | "out";

                setAvailable(val);
                setPage(1);
              }}
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="available">Available</SelectItem>
              <SelectItem key="out">Out</SelectItem>
            </Select>

            <Select
              aria-label="Tags"
              className="min-w-[10rem] max-w-xs"
              placeholder="Tags"
              selectedKeys={tagKeys}
              selectionMode="multiple"
              onSelectionChange={(keys) => {
                const arr = Array.from(keys as Set<React.Key>).map(String);

                setTagKeys(new Set(arr));
                setPage(1);
              }}
            >
              {ALL_TAGS.map((t) => (
                <SelectItem key={t}>{t}</SelectItem>
              ))}
            </Select>

            <div className="ml-auto flex items-center gap-2">
            <Button
                isDisabled={!isFilterActive}
                variant="flat"
                onPress={resetFilters}
              >
                Reset
              </Button>
              <Button
                color="primary"
                onPress={() => alert("Add Item clicked!")}
              >
                Add Item
              </Button>
            </div>
          </div>

          <Table
            removeWrapper
            aria-label="Menu table"
            className="[&_th]:py-3 [&_td]:py-3 [&_td]:text-sm [&_th]:text-xs"
          >
            <TableHeader>
              <TableColumn>SKU</TableColumn>
              <TableColumn>NAME</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>AVAILABLE</TableColumn>
              <TableColumn>TAGS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No items found">
              {slice.map((m) => (
                <TableRow key={m.sku}>
                  <TableCell>{m.sku}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.category}</TableCell>
                  <TableCell>{money(m.price)}</TableCell>
                  <TableCell>
                    <Chip
                      color={m.available ? "success" : "danger"}
                      size="sm"
                      variant="flat"
                    >
                      {m.available ? "Available" : "Out"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {m.tags.map((t) => (
                        <Chip key={t} size="sm" variant="flat">
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </TableCell>
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
