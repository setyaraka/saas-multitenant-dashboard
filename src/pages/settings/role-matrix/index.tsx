import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Checkbox } from "@heroui/checkbox";

export const SCOPES = [
  "orders.read",
  "orders.update",
  "menu.manage",
  "users.manage",
];
export type Scope = (typeof SCOPES)[number];

export const ROLES = ["Admin", "Manager", "Cashier", "Kitchen", "Viewer"];
export type Role = (typeof ROLES)[number];

export type RoleMatrix = Record<Role, Scope[]>;

type Props = {
  values: RoleMatrix;
  onChange: (next: RoleMatrix) => void;
  className?: string;
};

export default function RoleMatrixSection({
  values,
  onChange,
  className = "",
}: Props) {
  const toggle = (role: Role, scope: Scope, checked: boolean) => {
    const current = values[role] ?? [];
    const nextForRole = checked
      ? Array.from(new Set([...current, scope]))
      : current.filter((s) => s !== scope);

    onChange({ ...values, [role]: nextForRole });
  };

  const isChecked = (role: Role, scope: Scope) =>
    (values[role] ?? []).includes(scope);

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader className="text-sm font-semibold tracking-wide text-gray-600">
        ROLE MATRIX (PREVIEW)
      </CardHeader>
      <CardBody>
        <p className="mb-3 text-sm text-gray-500">
          Tandai scope yang diizinkan.
        </p>

        <Table
          removeWrapper
          aria-label="Role matrix"
          className="[&_th]:py-3 [&_td]:py-3 [&_th]:text-xs [&_td]:text-sm"
        >
          <TableHeader>
            <TableColumn className="w-44">ROLE</TableColumn>
            <TableColumn className="w-44">ORDERS.READ</TableColumn>
            <TableColumn className="w-44">ORDERS.UPDATE</TableColumn>
            <TableColumn className="w-44">MENU.MANAGE</TableColumn>
            <TableColumn className="w-44">USERS.MANAGE</TableColumn>
          </TableHeader>
          <TableBody>
            {ROLES.map((role, idx) => (
              <TableRow key={`role-matrix-${idx}`}>
                <TableCell className="font-medium">{role}</TableCell>

                <TableCell className="font-medium">
                  <Checkbox
                    isSelected={isChecked(role, "ORDERS.READ")}
                    size="sm"
                    onValueChange={(v) => toggle(role, "ORDERS.READ", v)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Checkbox
                    isSelected={isChecked(role, "ORDERS.UPDATE")}
                    size="sm"
                    onValueChange={(v) => toggle(role, "ORDERS.READ", v)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Checkbox
                    isSelected={isChecked(role, "MENU.MANAGE")}
                    size="sm"
                    onValueChange={(v) => toggle(role, "MENU.MANAGE", v)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Checkbox
                    isSelected={isChecked(role, "USERS.MANAGE")}
                    size="sm"
                    onValueChange={(v) => toggle(role, "USERS.MANAGE", v)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
