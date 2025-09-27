// components/settings/NotificationsSection.tsx
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

export type NotificationsValues = {
  orderCreatedEmail: boolean;
  invoiceIssuedEmail: boolean;
};

type Props = {
  values: NotificationsValues;
  onChange: (patch: Partial<NotificationsValues>) => void;
  className?: string;
};

export default function NotificationsSection({
  values,
  onChange,
  className = "",
}: Props) {
  const { orderCreatedEmail, invoiceIssuedEmail } = values;

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
        NOTIFICATIONS
      </CardHeader>

      <CardBody className="space-y-5">
        <Row className="items-center">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Orders</span>
          </Col>
          <Col xs={10}>
            <Checkbox
              isSelected={orderCreatedEmail}
              size="sm"
              onValueChange={(v) => onChange({ orderCreatedEmail: v })}
            >
              Email when order created
            </Checkbox>
          </Col>
        </Row>

        <Row className="items-center">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Billing</span>
          </Col>
          <Col xs={10}>
            <Checkbox
              isSelected={invoiceIssuedEmail}
              size="sm"
              onValueChange={(v) => onChange({ invoiceIssuedEmail: v })}
            >
              Email on invoice issued
            </Checkbox>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
