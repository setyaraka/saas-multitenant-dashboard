import DefaultLayout from "@/layouts/default";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
export default function IndexPage() {
  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <p className="font-bold text-xl">Sidebar Demo</p>
        </CardHeader>
        <CardBody>lalala</CardBody>
        <CardFooter>sip</CardFooter>
      </Card>
    </DefaultLayout>
  );
}
