import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import Row from "@/components/layout/row";
import Col from "@/components/layout/col";

export type AuthValues = {
  enforceMFA: boolean;
  sso: "disabled" | "saml" | "oidc-google" | "oidc-microsoft";
  allowedDomains: string;
};

type Props = {
  values: AuthValues;
  onChange: (patch: Partial<AuthValues>) => void;
  className?: string;
};

export default function AuthenticationSection({
  values,
  onChange,
  className = "",
}: Props) {
  const { enforceMFA, sso, allowedDomains } = values;

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
        AUTHENTICATION
      </CardHeader>

      <CardBody className="space-y-5">
        <Row className="items-center">
          <Col xs={3}>
            <span className="text-sm text-gray-700">MFA</span>
          </Col>
          <Col xs={9}>
            <Checkbox
              isSelected={enforceMFA}
              size="sm"
              onValueChange={(v) => onChange({ enforceMFA: v })}
            >
              Enforce MFA for all members
            </Checkbox>
          </Col>
        </Row>

        <Row className="items-center">
          <Col xs={3}>
            <span className="text-sm text-gray-700">SSO</span>
          </Col>
          <Col xs={9}>
            <Select
              className="max-w-xs"
              selectedKeys={[sso]}
              onSelectionChange={(keys) =>
                onChange({ sso: Array.from(keys)[0] as AuthValues["sso"] })
              }
            >
              <SelectItem key="disabled">Disabled</SelectItem>
              <SelectItem key="saml">SAML</SelectItem>
              <SelectItem key="oidc-google">OIDC — Google</SelectItem>
              <SelectItem key="oidc-microsoft">OIDC — Microsoft</SelectItem>
            </Select>
          </Col>
        </Row>

        <Row className="items-center">
          <Col xs={3}>
            <span className="text-sm text-gray-700">Allowed domains</span>
          </Col>
          <Col xs={9}>
            <Input
              placeholder="e.g. alphacoffee.com; partner.co"
              value={allowedDomains}
              onValueChange={(v) => onChange({ allowedDomains: v })}
            />
            <p className="mt-2 text-xs text-gray-500">
              Pisahkan dengan koma atau titik-koma. Hanya email dari domain ini
              yang bisa mendaftar/login.
            </p>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
