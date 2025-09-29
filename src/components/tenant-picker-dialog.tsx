import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";

type Tenant = { tenantId: string; name?: string; permissions?: string[] };

export default function TenantPickerDialog({
  open,
  tenants,
  onPick,
  onClose,
  pickingId,
}: {
  open: boolean;
  tenants: Tenant[];
  pickingId?: string | null;
  onPick: (tenantId: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={open} placement="center" onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="text-base font-semibold">
          Pilih Tenant
        </ModalHeader>
        <ModalBody className="space-y-2 pb-6">
          {tenants.map((t) => (
            <Button
              key={t.tenantId}
              className="justify-start"
              isLoading={pickingId === t.tenantId}
              variant="bordered"
              onPress={() => onPick(t.tenantId)}
            >
              {t.name ?? t.tenantId}
            </Button>
          ))}
          {tenants.length === 0 && (
            <div className="text-gray-600 text-sm">
              Anda belum memiliki tenant.
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
