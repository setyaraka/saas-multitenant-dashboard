import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

export type ApiKeysValues = {
  publicKey: string;
  secretKey: string;
};

type Props = {
  values: ApiKeysValues;
  onRotateSecret?: () => void;
  className?: string;
};

const maskKey = (key: string) => {
  const [prefix, rest = ""] = key.split("_");

  return `${prefix}_` + "*".repeat(Math.max(12, rest.length || 12));
};

export default function ApiKeysSection({
  values,
  onRotateSecret,
  className = "",
}: Props) {
  const { publicKey, secretKey } = values;
  const [showSecret, setShowSecret] = useState(false);

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
        API KEYS
      </CardHeader>

      <CardBody className="space-y-5">
        <Row className="items-center">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Public key</span>
          </Col>
          <Col xs={10}>
            <Input readOnly className="" value={maskKey(publicKey)} />
          </Col>
        </Row>

        <Row className="items-center">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Secret key</span>
          </Col>
          <Col xs={10}>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                className="max-w-4xl"
                value={showSecret ? secretKey : maskKey(secretKey)}
              />
              <Button
                variant="bordered"
                onPress={() => setShowSecret((s) => !s)}
              >
                {showSecret ? "Hide" : "Show"}
              </Button>
              <Button variant="flat" onPress={onRotateSecret}>
                Rotate
              </Button>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
