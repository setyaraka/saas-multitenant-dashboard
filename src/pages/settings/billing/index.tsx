import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import InvoicesTable, { Invoice } from "../invoice-table";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

export type BillingValues = {
  planName: string;
  priceLabel: string;
};

type Props = {
  values: BillingValues;
  invoices: Invoice[];
  onUpdateCard?: () => void;
  className?: string;
};

export default function BillingSection({
  values,
  invoices,
  onUpdateCard,
  className = "",
}: Props) {
  const { planName, priceLabel } = values;

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="border border-gray-200">
        <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
          PLAN
        </CardHeader>
        <CardBody className="space-y-5">
          <Row className="items-center">
            <Col xs={2}>
              <span className="text-sm text-gray-700">Current plan</span>
            </Col>
            <Col xs={10}>
              <div className="flex items-center gap-3">
                <Chip size="sm" variant="flat">
                  {planName}
                </Chip>
                <span className="text-sm text-gray-600">— {priceLabel}</span>
              </div>
            </Col>
          </Row>

          <Row className="items-start">
            <Col xs={2}>
              <span className="text-sm text-gray-700">Payment method</span>
            </Col>
            <Col xs={10}>
              <Button size="sm" variant="flat" onPress={onUpdateCard}>
                Update card
              </Button>
              <p className="mt-2 text-xs text-gray-500">
                Dikelola lewat gateway pembayaran (mock).
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
          INVOICES
        </CardHeader>
        <CardBody>
          <InvoicesTable invoices={invoices} />
        </CardBody>
      </Card>
    </div>
  );
}
