// components/settings/ProfileSection.tsx
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

export type ProfileValues = {
  fullName: string;
  email: string;
};

type Props = {
  values: ProfileValues;
  onChange: (patch: Partial<ProfileValues>) => void;
  className?: string;
};

export default function ProfileSection({
  values,
  onChange,
  className = "",
}: Props) {
  const { fullName, email } = values;

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
        PROFILE
      </CardHeader>

      <CardBody className="space-y-5">
        <Row className="items-center">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Full name</span>
          </Col>
          <Col xs={10}>
            <Input
              placeholder="Your name"
              value={fullName}
              onValueChange={(v) => onChange({ fullName: v })}
            />
          </Col>
        </Row>

        <Row className="items-center">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Email</span>
          </Col>
          <Col xs={10}>
            <Input
              placeholder="you@example.com"
              type="email"
              value={email}
              onValueChange={(value) => onChange({ email: value })}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
