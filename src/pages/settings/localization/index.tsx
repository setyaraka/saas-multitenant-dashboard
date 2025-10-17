import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";
import { UpdateLocalizationDto } from "@/services/dto/tenant-dto";

const LANGUAGES = [
  { key: "en", label: "English" },
  // { key: "en-GB", label: "English (UK)" },
  { key: "id", label: "Bahasa Indonesia" },
  { key: "de", label: "German" },
  { key: "es", label: "Spanish" },
  { key: "pt", label: "Portuguese (Brazil)" },
  { key: "hi", label: "Hindi" },
  { key: "ja", label: "Japanese" },
  { key: "ru", label: "Russian" },
  { key: "tr", label: "Turkish" },
  { key: "fr", label: "French" },
  { key: "ko", label: "Korean" },
  { key: "zh", label: "Chinese (Simplified)" },
  { key: "ar", label: "Arabic" },
  { key: "ms", label: "Malay" },
  { key: "th", label: "Thai" },
  { key: "vi", label: "Vietnamese" },
  { key: "km", label: "Khmer" },
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
  values: UpdateLocalizationDto;
  onChange: (patch: Partial<UpdateLocalizationDto>) => void;
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
              selectedKeys={[language ?? "en"]}
              onSelectionChange={(keys) =>
                onChange({
                  language: Array.from(
                    keys,
                  )[0] as UpdateLocalizationDto["language"],
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
              selectedKeys={[timezone ?? "UTC"]}
              onSelectionChange={(keys) =>
                onChange({
                  timezone: Array.from(
                    keys,
                  )[0] as UpdateLocalizationDto["timezone"],
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
              selectedKeys={[currency ?? "USD"]}
              onSelectionChange={(keys) =>
                onChange({
                  currency: Array.from(
                    keys,
                  )[0] as UpdateLocalizationDto["currency"],
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
