import { Button } from "@heroui/button";

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

const GROUPS: {
  title: string;
  items: { id: SettingsSectionKey; label: string }[];
}[] = [
  {
    title: "Tenant",
    items: [
      { id: "appearance", label: "Appearance" },
      { id: "domain", label: "Domain" },
      { id: "billing", label: "Billing" },
      { id: "integrations", label: "Integrations" },
      { id: "sso", label: "Security / SSO" },
      { id: "roles", label: "Roles & Permissions" },
      { id: "localization", label: "Localization" },
      { id: "compliance", label: "Data & Compliance" },
      { id: "api", label: "API" },
    ],
  },
  {
    title: "User",
    items: [
      { id: "profile", label: "Profile" },
      { id: "notifications", label: "Notifications" },
      { id: "accessibility", label: "Accessibility" },
    ],
  },
];

export default function SettingsNav({
  section,
  onChange,
  className = "",
}: Props) {
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
