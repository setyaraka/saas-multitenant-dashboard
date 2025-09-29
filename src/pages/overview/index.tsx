import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";

import StatCard from "@/components/card/stat-card";

export default function OverviewPage() {
  return (
    <>
      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-xl">Overview</p>
            <Link
              className="text-muted-foreground"
              href="#"
              size="sm"
              underline="hover"
            >
              #
            </Link>
          </div>
        </CardHeader>

        <CardBody className="py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="TODAY ORDERS" value={12} />
            <StatCard label="REVENUE" value="$89.00" />
            <StatCard label="AVG. PREP TIME" value="12m" />
            <StatCard label="ACTIVE USERS" value={8} />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
