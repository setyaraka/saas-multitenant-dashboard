import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

import SettingsNav from "./setting-nav";
import AppearanceSettings, { AppearanceValues } from "./appearance";
import CustomDomainCard, { DomainValues } from "./custom-domain";
import BillingSection, { BillingValues } from "./billing";
import { Invoice } from "./invoice-table";

import DefaultLayout from "@/layouts/default";

type SectionKey =
  | "appearance"
  | "domain"
  | "billing"
  | "integrations"
  | "sso"
  | "roles"
  | "localization"
  | "compliance"
  | "api"
  | "profile"
  | "notifications"
  | "accessibility";

export default function SettingsPage() {
  const [section, setSection] = useState<SectionKey>("appearance");

  const [appearance, setAppearance] = useState<AppearanceValues>({
    brandName: "",
    primary: "#0ea5e9",
    accent: "#f59e0b",
    logoFileName: "",
    mode: "dark",
    density: "comfortable",
  });

  const [domainCfg, setDomainCfg] = useState<DomainValues>({
    domain: "",
    dnsStatus: "not_verified",
    cnameHost: "tenant.example.com",
    cnameTarget: "cname.vendor.io",
    autoTLS: true,
  });

  const [billing, setBilling] = useState<BillingValues>({
    planName: "Pro",
    priceLabel: "$49 / month",
  });

  const INVOICES: Invoice[] = [
    {
      id: "INV-2025-0005",
      date: "2025-09-10",
      periodFrom: "2025-08-01",
      periodTo: "2025-08-31",
      total: 49,
      status: "paid",
      pdfUrl: "/invoices/INV-2025-0005.pdf",
    },
    {
      id: "INV-2025-0004",
      date: "2025-08-10",
      periodFrom: "2025-07-01",
      periodTo: "2025-07-31",
      total: 49,
      status: "paid",
      pdfUrl: "/invoices/INV-2025-0004.pdf",
    },
    {
      id: "INV-2025-0003",
      date: "2025-07-10",
      periodFrom: "2025-06-01",
      periodTo: "2025-06-30",
      total: 49,
      status: "refunded",
      pdfUrl: "/invoices/INV-2025-0003.pdf",
    },
    {
      id: "INV-2025-0002",
      date: "2025-06-10",
      periodFrom: "2025-05-01",
      periodTo: "2025-05-31",
      total: 49,
      status: "paid",
      pdfUrl: "/invoices/INV-2025-0002.pdf",
    },
    {
      id: "INV-2025-0001",
      date: "2025-05-10",
      periodFrom: "2025-04-01",
      periodTo: "2025-04-30",
      total: 49,
      status: "past_due",
      pdfUrl: "/invoices/INV-2025-0001.pdf",
    },
  ];

  const renderSection = () => {
    switch (section) {
      case "appearance":
        return (
          <AppearanceSettings
            values={appearance}
            onChange={(patch) =>
              setAppearance((prev) => ({ ...prev, ...patch }))
            }
          />
        );
      case "domain":
        return (
          <CustomDomainCard
            values={domainCfg}
            onChange={(patch) =>
              setDomainCfg((prev) => ({ ...prev, ...patch }))
            }
          />
        );
      case "billing":
        return (
          <BillingSection
            invoices={INVOICES}
            values={billing}
            onUpdateCard={() =>
              setBilling(() => ({ planName: "Pro", priceLabel: "$49 / month" }))
            }
          />
        );
      default:
        return (
          <Card className="border">
            <CardBody className="text-sm text-gray-600">
              <p className="font-medium mb-1 capitalize">
                {section.replace("/", " ")}
              </p>
              <Divider className="my-3" />
              <p>
                Belum ada pengaturan di bagian ini. Pilih {`"Appearance"`} atau
                {`"Domain"`}.
              </p>
            </CardBody>
          </Card>
        );
    }
  };

  return (
    <DefaultLayout>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <p className="font-bold text-xl mt-2 ml-2">Settings</p>
        </CardHeader>

        <CardBody>
          <div className="grid mx-2 grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
            <SettingsNav section={section} onChange={setSection} />

            <section className="space-y-6">{renderSection()}</section>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="flat">Cancel</Button>
            <Button color="primary" onPress={() => alert("Saved!")}>
              Save changes
            </Button>
          </div>
        </CardBody>
      </Card>
    </DefaultLayout>
  );
}
