import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

export type AppearanceValues = {
  brandName: string;
  primary: string;
  accent: string;
  logoFileName?: string;
  mode: "light" | "dark" | "system";
  density: "comfortable" | "compact";
};

type Props = {
  values: AppearanceValues;
  onChange: (patch: Partial<AppearanceValues>) => void;
  className?: string;
};

export default function AppearanceSettings({
  values,
  onChange,
  className = "",
}: Props) {
  const { brandName, primary, accent, logoFileName, mode, density } = values;

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="border border-gray-300">
        <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
          BRAND
        </CardHeader>
        <CardBody className="space-y-4">
          <Row className="items-center">
            <Col xs={2}>
              <span className="text-sm text-gray-700">Brand name</span>
            </Col>
            <Col xs={10}>
              <Input
                placeholder="e.g. Alpha Coffee"
                value={brandName}
                onValueChange={(v) => onChange({ brandName: v })}
              />
            </Col>
          </Row>

          <Row className="items-center">
            <Col xs={2}>
              <span className="text-sm text-gray-700">Primary color</span>
            </Col>
            <Col xs={10}>
              <div className="flex items-center gap-3">
                <input
                  className="h-9 w-12 cursor-pointer rounded-md border"
                  type="color"
                  value={primary}
                  onChange={(e) => onChange({ primary: e.target.value })}
                />
                <span className="text-sm text-gray-500">{primary}</span>
              </div>
            </Col>
          </Row>

          <Row className="items-center">
            <Col xs={2}>
              <span className="text-sm text-gray-700">Accent color</span>
            </Col>
            <Col xs={10}>
              <div className="flex items-center gap-3">
                <input
                  className="h-9 w-12 cursor-pointer rounded-md border"
                  type="color"
                  value={accent}
                  onChange={(e) => onChange({ accent: e.target.value })}
                />
                <span className="text-sm text-gray-500">{accent}</span>
              </div>
            </Col>
          </Row>

          <Row className="items-center">
            <Col xs={2}>
              <span className="text-sm text-gray-700">Logo</span>
            </Col>
            <Col xs={10}>
              <input
                accept="image/png,image/svg+xml"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  onChange({ logoFileName: file ? file.name : "" });
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                PNG/SVG, max 1MB. Preview otomatis.
              </p>
              {logoFileName && (
                <p className="mt-1 text-xs text-gray-600">
                  Selected: {logoFileName}
                </p>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="border border-gray-300">
        <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
          THEME
        </CardHeader>
        <CardBody className="space-y-4">
          <Row className="items-center">
            <Col xs={2}>
              <span className="text-sm text-gray-700">Mode</span>
            </Col>
            <Col xs={10}>
              <Select
                className="max-w-xs"
                selectedKeys={[mode]}
                onSelectionChange={(keys) =>
                  onChange({
                    mode: Array.from(keys)[0] as AppearanceValues["mode"],
                  })
                }
              >
                <SelectItem key="light">Light</SelectItem>
                <SelectItem key="dark">Dark</SelectItem>
                <SelectItem key="system">System</SelectItem>
              </Select>
            </Col>
          </Row>

          <Row className="items-center">
            <Col xs={2}>
              <span className="text-sm text-gray-700">Density</span>
            </Col>
            <Col xs={10}>
              <Select
                className="max-w-xs"
                selectedKeys={[density]}
                onSelectionChange={(keys) =>
                  onChange({
                    density: Array.from(keys)[0] as AppearanceValues["density"],
                  })
                }
              >
                <SelectItem key="comfortable">Comfortable</SelectItem>
                <SelectItem key="compact">Compact</SelectItem>
              </Select>
              <p className="mt-2 text-xs text-gray-500">
                Mempengaruhi tabel & kontrol padat/lega.
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
}
