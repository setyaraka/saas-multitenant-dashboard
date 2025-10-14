import { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { addToast } from "@heroui/toast";

import SettingsNav from "./setting-nav";
import AppearanceSettings, { AppearanceValues } from "./appearance";
import CustomDomainCard, { DomainValues } from "./custom-domain";
import BillingSection, { BillingValues } from "./billing";
import { Invoice } from "./invoice-table";
import ThirdPartySection, { ThirdPartyValues } from "./third-party";
import AuthenticationSection from "./authentication";
import RoleMatrixSection, { RoleMatrix, SCOPES } from "./role-matrix";
import Localization from "./localization";
import DataRetentionSection, { DataRetentionValues } from "./data-retention";
import ApiKeysSection, { ApiKeysValues } from "./api-key";
import ProfileSection, { ProfileValues } from "./profile";
import NotificationsSection, { NotificationsValues } from "./notifications";
import AccessibilitySection, { AccessibilityValues } from "./accessibility";
import { LocaleValues, SectionKey } from "./types";

import DefaultLayout from "@/layouts/default";
import {
  useTenantSettings,
  useUpdateAppearance,
  useUpdateDomain,
  useUpdateIntegration,
  useUpdateLocalization,
  useUpdateSSO,
  useUploadLogo,
} from "@/hooks/use-tenant-setting";
import {
  serverDensityToUi,
  serverModeToUi,
  uiDensityToServer,
  uiModeToServer,
} from "@/lib/appearance-adapter";
import AccentButton from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { UpdateSSODTO } from "@/services/dto/tenant-dto";

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

const DEFAULT_MATRIX: RoleMatrix = {
  Admin: [...SCOPES],
  Manager: ["orders.read", "orders.update", "menu.manage"],
  Cashier: ["orders.read"],
  Kitchen: ["orders.read"],
  Viewer: [],
};

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
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

  const [third, setThird] = useState<ThirdPartyValues>({
    slackSendOrderEvents: false,
    zapierEnableTriggers: false,
    webhookUrl: "",
  });

  const [auth, setAuth] = useState<UpdateSSODTO>({
    enforceMFA: false,
    sso: "disabled",
    allowedDomains: "",
  });

  const [matrix, setMatrix] = useState<RoleMatrix>(DEFAULT_MATRIX);

  const [locale, setLocale] = useState<LocaleValues>({
    language: "id-ID",
    timezone: "Asia/Jakarta",
    currency: "IDR",
  });

  const [retention, setRetention] = useState<DataRetentionValues>({
    retentionDays: 90,
  });

  const [apiKeys] = useState<ApiKeysValues>({
    publicKey: "pub_abcdefghijklmnop",
    secretKey: "sec_qrstuvwxyz123456",
  });

  const [profile, setProfile] = useState<ProfileValues>({
    fullName: "",
    email: "",
  });

  const [notif, setNotif] = useState<NotificationsValues>({
    orderCreatedEmail: true,
    invoiceIssuedEmail: false,
  });

  const [a11y, setA11y] = useState<AccessibilityValues>({
    reduceMotion: false,
    fontSize: "normal",
  });

  const mutApp = useUpdateAppearance();
  const mutLoc = useUpdateLocalization();
  const mutDom = useUpdateDomain();
  const mutLogo = useUploadLogo();
  const mutInt = useUpdateIntegration();
  const mutSso = useUpdateSSO();
  const { data: settings } = useTenantSettings();

  const logoFileRef = useRef<File | null>(null);

  useEffect(() => {
    if (!settings) return;

    setAppearance(() => ({
      brandName: settings.appearance.brandName ?? "",
      primary: settings.appearance.primaryColor ?? "#0ea5e9",
      accent: settings.appearance.accent ?? "#f59e0b",
      logoFileName: "",
      mode: serverModeToUi(settings.appearance.mode),
      density: serverDensityToUi(settings.appearance.density),
    }));

    setDomainCfg((prev) => ({
      ...prev,
      domain: settings.domain?.domain ?? "",
      autoHttps: settings.domain?.autoHttps ?? true,
    }));

    setThird((prev) => ({
      ...prev,
      slackSendOrderEvents: settings.integration?.slackEnabled ?? false,
      zapierEnableTriggers: settings.integration?.zapierEnabled ?? false,
      webhookUrl: settings.integration?.webhookUrl ?? "",
    }));

    setLocale(() => ({
      language: (settings.localization?.locale ??
        "id-ID") as LocaleValues["language"],
      currency: (settings.localization?.currency ??
        "IDR") as LocaleValues["currency"],
      timezone: (settings.localization?.timezone ??
        "Asia/Jakarta") as LocaleValues["timezone"],
    }));

    const lang = mapLanguageCode(settings.localization?.locale ?? "id-ID");
    i18n.changeLanguage(lang);
  }, [settings]);

  const mapLanguageCode = (lang: string): string => {
    if (lang.startsWith("id")) return "id";
    if (lang.startsWith("en")) return "en";
    return "en";
  };  

  const renderSection = () => {
    if (section === "appearance") {
      return (
        <AppearanceSettings
          values={appearance}
          onChange={(patch) => setAppearance((prev) => ({ ...prev, ...patch }))}
        />
      );
    }
    if (section === "domain") {
      return (
        <CustomDomainCard
          values={domainCfg}
          onChange={(patch) => setDomainCfg((prev) => ({ ...prev, ...patch }))}
        />
      );
    }
    if (section === "billing") {
      return (
        <BillingSection
          invoices={INVOICES}
          values={billing}
          onUpdateCard={() =>
            setBilling(() => ({ planName: "Pro", priceLabel: "$49 / month" }))
          }
        />
      );
    }
    if (section === "integrations") {
      return (
        <ThirdPartySection
          values={third}
          onChange={(patch) => setThird((prev) => ({ ...prev, ...patch }))}
        />
      );
    }
    if (section === "sso") {
      return (
        <AuthenticationSection
          values={auth}
          onChange={(patch) => setAuth((prev) => ({ ...prev, ...patch }))}
        />
      );
    }
    if (section === "roles") {
      return <RoleMatrixSection values={matrix} onChange={setMatrix} />;
    }
    if (section === "localization") {
      return (
        <Localization
          values={locale}
          onChange={(patch) => setLocale((prev) => ({ ...prev, ...patch }))}
        />
      );
    }
    if (section === "compliance") {
      return (
        <DataRetentionSection
          values={retention}
          onChange={(patch) => setRetention((prev) => ({ ...prev, ...patch }))}
          onExportJSON={() => {
            alert(`Exporting last ${retention.retentionDays} days as JSON`);
          }}
        />
      );
    }
    if (section === "api") {
      return (
        <ApiKeysSection
          values={apiKeys}
          onRotateSecret={() => alert("Rotate secret key…")}
        />
      );
    }
    if (section === "profile") {
      return (
        <ProfileSection
          values={profile}
          onChange={(patch) => setProfile((p) => ({ ...p, ...patch }))}
        />
      );
    }
    if (section === "notifications") {
      return (
        <NotificationsSection
          values={notif}
          onChange={(value) => setNotif((prev) => ({ ...prev, ...value }))}
        />
      );
    }
    if (section === "accessibility") {
      return (
        <AccessibilitySection
          values={a11y}
          onChange={(p) => setA11y((prev) => ({ ...prev, ...p }))}
        />
      );
    }
  };

  async function handleSave() {
    try {
      if (section === "appearance") {
        await mutApp.mutateAsync({
          brandName: appearance.brandName || undefined,
          primaryColor: appearance.primary,
          accent: appearance.accent,
          mode: uiModeToServer(appearance.mode),
          density: uiDensityToServer(appearance.density),
        });

        if (logoFileRef.current) {
          await mutLogo.mutateAsync(logoFileRef.current);
          logoFileRef.current = null;
          setAppearance((p) => ({ ...p, logoFileName: "" }));
        }

        addToast({
          title: "Appearance saved",
          description: "Appearance saved successfully",
          color: "success",
        });

        return;
      }

      if (section === "localization") {
        await mutLoc.mutateAsync({
          language: locale.language,
          currency: locale.currency,
          timezone: locale.timezone,
        });
        addToast({
          title: "Localization saved",
          description: "Localization saved successfully",
          color: "success",
        });

        const lang = mapLanguageCode(locale.language);
        i18n.changeLanguage(lang);
        return;
      }

      if (section === "domain") {
        await mutDom.mutateAsync({
          domain: domainCfg.domain || undefined,
          autoHttps: domainCfg.autoTLS,
        });
        addToast({
          title: "Domain saved",
          description: "Domain saved successfully",
          color: "success",
        });

        return;
      }

      if (section === "integrations") {
        await mutInt.mutateAsync({
          slackEnabled: third.slackSendOrderEvents,
          zapierEnabled: third.zapierEnableTriggers,
          webhookUrl: third.webhookUrl,
        });

        addToast({
          title: "Integration saved",
          description: "Integration saved successfully",
          color: "success",
        });

        return;
      }

      if(section === "sso") {
        await mutSso.mutateAsync({
          enforceMFA: auth.enforceMFA,
          sso: auth.sso,
          allowedDomains: auth.allowedDomains
        })
      }

      alert("Bagian ini belum terhubung ke API (di luar Epic 4).");
    } catch (e: any) {
      alert(e?.message ?? "Gagal menyimpan");
    }
  }

  return (
    <DefaultLayout>
      <Breadcrumbs className="mb-5" size="lg">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Settings</BreadcrumbItem>
      </Breadcrumbs>
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
            <Button variant="flat">{t("cancel")}</Button>
            <AccentButton variant="flat" onPress={handleSave}>
              {t("save_changes")}
            </AccentButton>
          </div>
        </CardBody>
      </Card>
    </DefaultLayout>
  );
}
