import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";

import { LocaleValues } from "../types";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

const LANGUAGES = [
  { key: "id-ID", label: "Bahasa Indonesia" },
  { key: "en-US", label: "English (US)" },
  { key: "en-GB", label: "English (UK)" },
] as const;

const TIMEZONES = [
  { key: "Asia/Jakarta", label: "Asia/Jakarta (WIB)" },
  { key: "Asia/Makassar", label: "Asia/Makassar (WITA)" },
  { key: "Asia/Jayapura", label: "Asia/Jayapura (WIT)" },
  { key: "Asia/Singapore", label: "Asia/Singapore" },
  { key: "UTC", label: "UTC" },
] as const;

const CURRENCIES = [
  { key: "IDR", label: "IDR" },
  { key: "USD", label: "USD" },
  { key: "EUR", label: "EUR" },
  { key: "SGD", label: "SGD" },
] as const;

type Props = {
  values: LocaleValues;
  onChange: (patch: Partial<LocaleValues>) => void;
  className?: string;
};

export default function Localization({
  values,
  onChange,
  className = "",
}: Props) {
  const { language, timezone, currency } = values;

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
        LOCALE
      </CardHeader>

      <CardBody className="space-y-5">
        <Row className="items-center">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Language</span>
          </Col>
          <Col xs={10}>
            <Select
              selectedKeys={[language]}
              onSelectionChange={(keys) =>
                onChange({
                  language: Array.from(keys)[0] as LocaleValues["language"],
                })
              }
            >
              {LANGUAGES.map((l) => (
                <SelectItem key={l.key}>{l.label}</SelectItem>
              ))}
            </Select>
          </Col>
        </Row>

        <Row className="items-center">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Timezone</span>
          </Col>
          <Col xs={10}>
            <Select
              selectedKeys={[timezone]}
              onSelectionChange={(keys) =>
                onChange({
                  timezone: Array.from(keys)[0] as LocaleValues["timezone"],
                })
              }
            >
              {TIMEZONES.map((t) => (
                <SelectItem key={t.key}>{t.label}</SelectItem>
              ))}
            </Select>
          </Col>
        </Row>

        <Row className="items-center">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Currency</span>
          </Col>
          <Col xs={10}>
            <Select
              selectedKeys={[currency]}
              onSelectionChange={(keys) =>
                onChange({
                  currency: Array.from(keys)[0] as LocaleValues["currency"],
                })
              }
            >
              {CURRENCIES.map((c) => (
                <SelectItem key={c.key}>{c.label}</SelectItem>
              ))}
            </Select>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
