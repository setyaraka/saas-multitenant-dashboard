import { Card, CardBody, CardHeader } from "@heroui/card";

type StatCardProps = {
  label: string;
  value: string | number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <span className="font-semibold text-gray-500 text-sm">{label}</span>
      </CardHeader>
      <CardBody className="pt-1">
        <p className="text-2xl font-extrabold text-slate-900 dark:text-foreground">
          {value}
        </p>
      </CardBody>
    </Card>
  );
}
