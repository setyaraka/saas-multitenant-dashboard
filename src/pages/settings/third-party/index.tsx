import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

export type ThirdPartyValues = {
  slackSendOrderEvents: boolean;
  zapierEnableTriggers: boolean;
  webhookUrl: string;
};

type Props = {
  values: ThirdPartyValues;
  onChange: (patch: Partial<ThirdPartyValues>) => void;
  className?: string;
};

export default function ThirdPartySection({
  values,
  onChange,
  className = "",
}: Props) {
  const { slackSendOrderEvents, zapierEnableTriggers, webhookUrl } = values;

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
        THIRD-PARTY
      </CardHeader>
      <CardBody className="space-y-5">
        <Row className="items-center">
          <Col xs={3}>
            <span className="text-sm text-gray-700">Slack</span>
          </Col>
          <Col xs={9}>
            <Checkbox
              isSelected={slackSendOrderEvents}
              size="sm"
              onValueChange={(v) => onChange({ slackSendOrderEvents: v })}
            >
              Send order events
            </Checkbox>
          </Col>
        </Row>

        <Row className="items-center">
          <Col xs={3}>
            <span className="text-sm text-gray-700">Zapier</span>
          </Col>
          <Col xs={9}>
            <Checkbox
              isSelected={zapierEnableTriggers}
              size="sm"
              onValueChange={(v) => onChange({ zapierEnableTriggers: v })}
            >
              Enable Zap triggers
            </Checkbox>
          </Col>
        </Row>

        <Row className="items-center">
          <Col xs={3}>
            <span className="text-sm text-gray-700">Webhook URL</span>
          </Col>
          <Col xs={9}>
            <Input
              placeholder="https://example.com/webhook"
              value={webhookUrl}
              onValueChange={(v) => onChange({ webhookUrl: v })}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
