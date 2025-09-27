// components/settings/DataRetentionSection.tsx
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

export type DataRetentionValues = {
  // batasi ke nilai yang didukung
  retentionDays: 7 | 30 | 60 | 90 | 180 | 365;
};

type Props = {
  values: DataRetentionValues;
  onChange: (patch: Partial<DataRetentionValues>) => void;
  onExportJSON?: () => void; // handler klik Export JSON
  className?: string;
};

const RET_OPTIONS = [
  { key: 7, label: "7 days" },
  { key: 30, label: "30 days" },
  { key: 60, label: "60 days" },
  { key: 90, label: "90 days" },
  { key: 180, label: "180 days" },
  { key: 365, label: "365 days" },
] as const;

export default function DataRetentionSection({
  values,
  onChange,
  onExportJSON,
  className = "",
}: Props) {
  const { retentionDays } = values;

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
        DATA RETENTION
      </CardHeader>

      <CardBody className="space-y-5">
        <Row className="items-center">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Retention</span>
          </Col>
          <Col xs={10}>
            <Select
              selectedKeys={[String(retentionDays)]}
              onSelectionChange={(keys) => {
                const v = Number(
                  Array.from(keys)[0],
                ) as DataRetentionValues["retentionDays"];

                onChange({ retentionDays: v });
              }}
            >
              {RET_OPTIONS.map((opt) => (
                <SelectItem key={String(opt.key)}>{opt.label}</SelectItem>
              ))}
            </Select>
          </Col>
        </Row>

        <Row className="items-center">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Export</span>
          </Col>
          <Col xs={10}>
            <Button className="w-full" variant="flat" onPress={onExportJSON}>
              Export JSON
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
