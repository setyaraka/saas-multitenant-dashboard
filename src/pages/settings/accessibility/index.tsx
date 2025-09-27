import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Select, SelectItem } from "@heroui/select";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

export type AccessibilityValues = {
  reduceMotion: boolean;
  fontSize: "small" | "normal" | "large";
};

type Props = {
  values: AccessibilityValues;
  onChange: (patch: Partial<AccessibilityValues>) => void;
  className?: string;
};

export default function AccessibilitySection({
  values,
  onChange,
  className = "",
}: Props) {
  const { reduceMotion, fontSize } = values;

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
        ACCESSIBILITY
      </CardHeader>

      <CardBody className="space-y-5">
        <Row className="items-center">
          <Col xs={3}>
            <span className="text-sm text-gray-700">Reduce motion</span>
          </Col>
          <Col xs={9}>
            <Checkbox
              isSelected={reduceMotion}
              size="sm"
              onValueChange={(v) => onChange({ reduceMotion: v })}
            >
              Prefer reduced motion
            </Checkbox>
          </Col>
        </Row>

        <Row className="items-center">
          <Col xs={3}>
            <span className="text-sm text-gray-700">Font size</span>
          </Col>
          <Col xs={9}>
            <Select
              selectedKeys={[fontSize]}
              onSelectionChange={(keys) =>
                onChange({
                  fontSize: Array.from(
                    keys,
                  )[0] as AccessibilityValues["fontSize"],
                })
              }
            >
              <SelectItem key="small">Small</SelectItem>
              <SelectItem key="normal">Normal</SelectItem>
              <SelectItem key="large">Large</SelectItem>
            </Select>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
