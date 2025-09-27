// app/operations/kitchen-display/page.tsx  (Next.js App Router)
// atau src/pages/operations/kitchen-display.tsx (Vite/CRApp/Next pages)

"use client";

import {useEffect, useMemo, useState} from "react";
import {Breadcrumbs, BreadcrumbItem} from "@heroui/breadcrumbs";
import {Card, CardBody, CardHeader, CardFooter} from "@heroui/card";
import {Button} from "@heroui/button";
import {Chip} from "@heroui/chip";
import {Input} from "@heroui/input";
import {Select, SelectItem} from "@heroui/select";
import {Switch} from "@heroui/switch";
import {Divider} from "@heroui/divider";
import {Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@heroui/modal";

import DefaultLayout from "@/layouts/default";
import Row from "@/components/layout/row";
import Col from "@/components/layout/col";
import dayjs from "@/lib/dayjs";

type Status = "new" | "preparing" | "ready" | "done";
type Priority = "normal" | "rush";
type Station = "All" | "Bar" | "Grill" | "Bakery";

type KdsItem = { name: string; qty: number; notes?: string };
type KdsOrder = {
  id: string;
  ticket: number;
  customer?: string;
  items: KdsItem[];
  createdAt: string;
  status: Status;
  station: Station;
  priority: Priority;
  statusAt: string;
};

const STATIONS: Station[] = ["All", "Bar", "Grill", "Bakery"];

function secondsToMMSS(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function useTick(ms = 1000) {
  const [, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => v + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
}

function mockOrders(): KdsOrder[] {
  const now = dayjs();
  const base = [
    {
      ticket: 1001,
      items: [{name: "Latte", qty: 2}, {name: "Croissant", qty: 1}],
      station: "Bar" as Station,
      priority: "normal" as Priority,
      status: "new" as Status,
      createdAt: now.subtract(9, "minute").toISOString(),
    },
    {
      ticket: 1002,
      items: [{name: "Espresso", qty: 1, notes: "extra shot"}],
      station: "Bar" as Station,
      priority: "rush" as Priority,
      status: "preparing" as Status,
      createdAt: now.subtract(18, "minute").toISOString(),
    },
    {
      ticket: 1003,
      items: [{name: "Matcha Latte", qty: 1}, {name: "Brownie", qty: 1}],
      station: "Bakery" as Station,
      priority: "normal" as Priority,
      status: "ready" as Status,
      createdAt: now.subtract(28, "minute").toISOString(),
    },
    {
      ticket: 1004,
      items: [{name: "Cinnamon Roll", qty: 3}],
      station: "Bakery" as Station,
      priority: "normal" as Priority,
      status: "new" as Status,
      createdAt: now.subtract(3, "minute").toISOString(),
    },
    {
      ticket: 1005,
      items: [{name: "Affogato", qty: 1}],
      station: "Grill" as Station,
      priority: "rush" as Priority,
      status: "preparing" as Status,
      createdAt: now.subtract(6, "minute").toISOString(),
    },
  ];

  return base.map((b, i) => ({
    id: `o${b.ticket}-${i}`,
    ticket: b.ticket,
    customer: undefined,
    items: b.items,
    createdAt: b.createdAt,
    statusAt: b.createdAt,
    status: b.status,
    station: b.station,
    priority: b.priority,
  }));
}

function OrderCard({
  o,
  onStart,
  onReady,
  onBump,
  onRecall,
  onCancel,
}: {
  o: KdsOrder;
  onStart: (id: string) => void;
  onReady: (id: string) => void;
  onBump: (id: string) => void;
  onRecall: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  useTick(1000);

  const waitingSec = dayjs().diff(dayjs(o.statusAt), "second");
  const totalSec = dayjs().diff(dayjs(o.createdAt), "second");

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">#{o.ticket}</span>
          {o.priority === "rush" && (
            <Chip size="sm" color="danger" variant="flat">RUSH</Chip>
          )}
          {o.customer && (
            <Chip size="sm" variant="flat">{o.customer}</Chip>
          )}
          <Chip size="sm" color="default" variant="flat">
            {o.station}
          </Chip>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">since status</p>
          <p className="font-medium tabular-nums">{secondsToMMSS(waitingSec)}</p>
        </div>
      </CardHeader>
      <CardBody className="space-y-2">
        {o.items.map((it, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Chip variant="flat" size="sm" className="min-w-[2.25rem] justify-center">
              ×{it.qty}
            </Chip>
            <div>
              <p className="font-medium">{it.name}</p>
              {it.notes && <p className="text-xs text-gray-500">Notes: {it.notes}</p>}
            </div>
          </div>
        ))}
      </CardBody>
      <CardFooter className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          total: {secondsToMMSS(totalSec)}
        </p>
        <div className="flex gap-2">
          {o.status === "new" && (
            <>
              <Button size="sm" color="primary" onPress={() => onStart(o.id)}>Start</Button>
              <Button size="sm" variant="flat" color="danger" onPress={() => onCancel(o.id)}>Cancel</Button>
            </>
          )}
          {o.status === "preparing" && (
            <>
              <Button size="sm" color="success" onPress={() => onReady(o.id)}>Ready</Button>
              <Button size="sm" variant="flat" color="danger" onPress={() => onCancel(o.id)}>Cancel</Button>
            </>
          )}
          {o.status === "ready" && (
            <>
              <Button size="sm" color="warning" onPress={() => onBump(o.id)}>Bump</Button>
              <Button size="sm" variant="flat" onPress={() => onRecall(o.id)}>Recall</Button>
            </>
          )}
          {o.status === "done" && (
            <Button size="sm" variant="flat" onPress={() => onRecall(o.id)}>Recall</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<KdsOrder[]>(() => mockOrders());
  const [station, setStation] = useState<Station>("All");
  const [onlyRush, setOnlyRush] = useState(false);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const confirm = useDisclosure();

  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() < 0.15) {
        const nextTicket = (orders.at(-1)?.ticket ?? 1005) + 1;
        const stations: Station[] = ["Bar", "Grill", "Bakery"];
        const s = stations[Math.floor(Math.random() * stations.length)];
        const names = ["Latte", "Espresso", "Mocha", "Affogato", "Croissant", "Brownie"];
        const itemCount = 1 + Math.floor(Math.random() * 3);
        const items: KdsItem[] = Array.from({length: itemCount}).map(() => ({
          name: names[Math.floor(Math.random() * names.length)],
          qty: 1 + Math.floor(Math.random() * 2),
        }));

        const o: KdsOrder = {
          id: `o${nextTicket}-${Date.now()}`,
          ticket: nextTicket,
          customer: undefined,
          items,
          createdAt: dayjs().toISOString(),
          statusAt: dayjs().toISOString(),
          status: "new",
          station: s,
          priority: Math.random() < 0.3 ? "rush" : "normal",
        };
        setOrders((prev) => [...prev, o]);
      }
    }, 7000);
    return () => clearInterval(t);
  }, [orders.length]);

  const move = (id: string, status: Status) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? {...o, status, statusAt: dayjs().toISOString()} : o)),
    );

  const onStart  = (id: string) => move(id, "preparing");
  const onReady  = (id: string) => move(id, "ready");
  const onBump   = (id: string) => move(id, "done");
  const onRecall = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id
        ? {...o, status: o.status === "done" ? "ready" : "preparing", statusAt: dayjs().toISOString()}
        : o
      )),
    );
  };
  const onCancel = (id: string) => {
    setConfirmId(id);
    confirm.onOpen();
  };

  const doCancel = () => {
    if (confirmId) {
      setOrders((prev) => prev.filter((o) => o.id !== confirmId));
    }
    confirm.onClose();
    setConfirmId(null);
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (station !== "All" && o.station !== station) return false;
      if (onlyRush && o.priority !== "rush") return false;
      if (query && !`${o.ticket} ${o.items.map(i => i.name).join(" ")}`.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [orders, station, onlyRush, query]);

  const group = (st: Status) => filtered.filter((o) => o.status === st);

  const NewList        = group("new");
  const PreparingList  = group("preparing");
  const ReadyList      = group("ready");
  const DoneList       = group("done");

  const StatHeader = ({title, count, color} : {title: string; count: number; color: "primary"|"warning"|"success"|"default"}) => (
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-gray-600">{title}</p>
      <Chip size="sm" color={color} variant="flat">{count}</Chip>
    </div>
  );

  return (
    <DefaultLayout>
      <Breadcrumbs className="mb-5" size="lg">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Operations</BreadcrumbItem>
        <BreadcrumbItem>Kitchen Display</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mb-4">
        <CardBody>
            <Row>
                <Col className="flex gap-2">
                    <Select
                        aria-label="Station"
                        className="w-40"
                        selectedKeys={[station]}
                        onSelectionChange={(keys) => setStation(Array.from(keys)[0] as Station)}
                    >
                        {STATIONS.map((s) => <SelectItem key={s}>{s}</SelectItem>)}
                    </Select>

                    <Input
                        className="max-w-xs"
                        placeholder="Search ticket / item"
                        value={query}
                        onValueChange={setQuery}
                    />

                    <Switch isSelected={onlyRush} onValueChange={setOnlyRush}>
                        Rush only
                    </Switch>
                </Col>
                <Col className="flex justify-end gap-2">
                    <Button variant="flat" onPress={() => window.print()}>Print</Button>
                    <Button color="warning" onPress={() => window.location.reload()}>Refresh</Button>
                </Col>
            </Row>

        </CardBody>
      </Card>

      <Row>
        <Col className="pr-2 mb-5" xs={12} md={6} lg={3}>
          <Card>
            <CardHeader><StatHeader title="New" count={NewList.length} color="primary" /></CardHeader>
            <Divider />
            <CardBody className="grid gap-3">
              {NewList.map((o) => (
                <OrderCard
                  key={o.id}
                  o={o}
                  onStart={onStart}
                  onReady={onReady}
                  onBump={onBump}
                  onRecall={onRecall}
                  onCancel={onCancel}
                />
              ))}
            </CardBody>
          </Card>
        </Col>

        <Col className="pl-2 mb-5" xs={12} md={6} lg={3}>
          <Card>
            <CardHeader><StatHeader title="Preparing" count={PreparingList.length} color="warning" /></CardHeader>
            <Divider />
            <CardBody className="grid gap-3">
              {PreparingList.map((o) => (
                <OrderCard
                  key={o.id}
                  o={o}
                  onStart={onStart}
                  onReady={onReady}
                  onBump={onBump}
                  onRecall={onRecall}
                  onCancel={onCancel}
                />
              ))}
            </CardBody>
          </Card>
        </Col>

        <Col className="pr-2 mb-5" xs={12} md={6} lg={3}>
          <Card>
            <CardHeader><StatHeader title="Ready" count={ReadyList.length} color="success" /></CardHeader>
            <Divider />
            <CardBody className="grid gap-3">
              {ReadyList.map((o) => (
                <OrderCard
                  key={o.id}
                  o={o}
                  onStart={onStart}
                  onReady={onReady}
                  onBump={onBump}
                  onRecall={onRecall}
                  onCancel={onCancel}
                />
              ))}
            </CardBody>
          </Card>
        </Col>

        <Col className="pl-2 mb-5" xs={12} md={6} lg={3}>
          <Card>
            <CardHeader><StatHeader title="Done" count={DoneList.length} color="default" /></CardHeader>
            <Divider />
            <CardBody className="grid gap-3">
              {DoneList.map((o) => (
                <OrderCard
                  key={o.id}
                  o={o}
                  onStart={onStart}
                  onReady={onReady}
                  onBump={onBump}
                  onRecall={onRecall}
                  onCancel={onCancel}
                />
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={confirm.isOpen} onOpenChange={confirm.onOpenChange}>
        <ModalContent>
          <ModalHeader>Cancel order?</ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-600">
              Order akan dihapus dari KDS. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 py-2">
              <Button variant="flat" onPress={confirm.onClose}>No</Button>
              <Button color="danger" onPress={doCancel}>Yes, cancel</Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}
