import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Checkbox } from "@heroui/checkbox";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

export type DomainValues = {
  domain: string;
  dnsStatus: "not_verified" | "verifying" | "verified";
  cnameHost: string;
  cnameTarget: string;
  autoTLS: boolean;
};

type Props = {
  values: DomainValues;
  onChange: (patch: Partial<DomainValues>) => void;
  className?: string;
};

const statusMap: Record<
  DomainValues["dnsStatus"],
  { label: string; barClass: string; textClass: string }
> = {
  not_verified: {
    label: "Not verified",
    barClass: "bg-success-100",
    textClass: "text-success-600",
  },
  verifying: {
    label: "Verifying…",
    barClass: "bg-warning-100",
    textClass: "text-warning-700",
  },
  verified: {
    label: "Verified",
    barClass: "bg-success-200",
    textClass: "text-success-700",
  },
};

export default function CustomDomainCard({
  values,
  onChange,
  className = "",
}: Props) {
  const { domain, dnsStatus, cnameHost, cnameTarget, autoTLS } = values;
  const sm = statusMap[dnsStatus];

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
        CUSTOM DOMAIN
      </CardHeader>
      <CardBody className="space-y-5">
        <Row className="items-start">
          <Col xs={2}>
            <div>
              <span className="text-sm text-gray-700">Domain</span>
              <p className="mt-2 text-xs text-gray-500">
                Gunakan subdomain yang kamu miliki.
              </p>
            </div>
          </Col>
          <Col xs={10}>
            <Input
              placeholder="e.g. app.alphacoffee.com"
              value={domain}
              onValueChange={(v) => onChange({ domain: v })}
            />
          </Col>
        </Row>

        <Row className="items-start">
          <Col xs={2}>
            <span className="text-sm text-gray-700">DNS Status</span>
          </Col>
          <Col xs={10}>
            <div
              className={`w-full rounded-full px-3 py-1 text-xs font-medium ${sm.barClass} ${sm.textClass}`}
            >
              {sm.label}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Tambahkan CNAME →{" "}
              <Chip size="sm" variant="flat">
                {cnameHost}
              </Chip>{" "}
              ke{" "}
              <Chip size="sm" variant="flat">
                {cnameTarget}
              </Chip>
            </div>
          </Col>
        </Row>

        <Row className="items-start">
          <Col xs={2}>
            <span className="text-sm text-gray-700">Auto HTTPS</span>
          </Col>
          <Col xs={10}>
            <Checkbox
              isSelected={autoTLS}
              size="sm"
              onValueChange={(v) => onChange({ autoTLS: v })}
            >
              Enable automatic TLS
            </Checkbox>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
