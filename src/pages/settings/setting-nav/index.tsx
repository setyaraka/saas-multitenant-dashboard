import { Button } from "@heroui/button";
import { useTranslation } from "react-i18next";

export type SettingsSectionKey =
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

type Props = {
  section: SettingsSectionKey; // current selected
  onChange: (next: SettingsSectionKey) => void;
  className?: string;
};

export default function SettingsNav({
  section,
  onChange,
  className = "",
}: Props) {
  const { t } = useTranslation();

  const GROUPS: {
    title: string;
    items: { id: SettingsSectionKey; label: string }[];
  }[] = [
    {
      title: "Tenant",
      items: [
        { id: "appearance", label: t("appearance") },
        { id: "domain", label: t("domain") },
        { id: "billing", label: t("billing") },
        { id: "integrations", label: t("integrations") },
        { id: "sso", label: `${t("security")} / SSO` },
        { id: "roles", label: t("roles_and_permissions") },
        { id: "localization", label: t("localization") },
        { id: "compliance", label: t("data_and_compliance") },
        { id: "api", label: "API" },
      ],
    },
    {
      title: "User",
      items: [
        { id: "profile", label: t("profile") },
        { id: "notifications", label: t("notifications") },
        { id: "accessibility", label: t("accessibility") },
      ],
    },
  ];

  return (
    <aside
      className={`rounded-xl border border-gray-300 shadow-xl bg-content1 p-3 ${className}`}
    >
      {GROUPS.map((g) => (
        <div key={g.title} className="mt-4 first:mt-0">
          <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
            {g.title}
          </p>
          <div className="space-y-1.5">
            {g.items.map((it) => {
              const active = section === it.id;

              return (
                <Button
                  key={it.id}
                  fullWidth
                  className="justify-start"
                  variant={active ? "flat" : "light"}
                  onPress={() => onChange(it.id)}
                >
                  {it.label}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
