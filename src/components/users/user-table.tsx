import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";

import { useAuth } from "@/store/auth";
import {
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  User,
} from "@/services/tenants/users";
import { RequirePerm } from "@/hooks/use-require-perm";

export default function UsersTable() {
  const { tenantId } = useAuth();
  const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);
  const [pageSize] = useState(10);
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 300);

    return () => clearTimeout(t);
  }, [q]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useUsersQuery(
      tenantId
        ? { tenantId, page, pageSize, q: qDebounced || undefined }
        : undefined,
    );

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const createM = useCreateUserMutation(tenantId || "");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const updateM = useUpdateUserMutation(tenantId || "", pendingId || "");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteM = useDeleteUserMutation(tenantId || "", deleteId || "");

  const rows = useMemo(() => data?.items ?? [], [data?.items]);

  if (!tenantId) return <div>Pilih tenant terlebih dahulu.</div>;

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Spinner /> <span>Memuat users…</span>
      </div>
    );
  }
  if (isError) {
    const msg = (error as any)?.message ?? "Gagal memuat users.";

    return (
      <div className="space-y-2">
        <div className="text-danger-500">{msg}</div>
        <Button onPress={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <Input
          isClearable
          placeholder="Cari nama/email…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          onClear={() => {
            setQ("");
            setPage(1);
          }}
        />
        <RequirePerm fallback={<Chip>Read-only</Chip>} perm="USERS_MANAGE">
          <Button
            color="primary"
            isLoading={createM.isPending}
            onPress={() =>
              createM.mutate({
                name: "New User",
                email: `user${Date.now()}@example.com`,
                role: "STAFF",
              })
            }
          >
            Create User
          </Button>
        </RequirePerm>
        {isFetching && <Spinner size="sm" />}
      </div>

      {rows.length === 0 ? (
        <div className="text-gray-500">
          Belum ada user.{" "}
          <RequirePerm perm="USERS_MANAGE">
            <Button
              className="ml-2"
              size="sm"
              variant="flat"
              onPress={() =>
                createM.mutate({
                  name: "First User",
                  email: `first${Date.now()}@example.com`,
                  role: "ADMIN",
                })
              }
            >
              Create User
            </Button>
          </RequirePerm>
        </div>
      ) : (
        <Table aria-label="Users table">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn className="w-40">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {(u: User) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">
                    {u.role}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <RequirePerm perm="USERS_MANAGE">
                      <Button
                        isLoading={updateM.isPending && pendingId === u.id}
                        size="sm"
                        variant="flat"
                        onPress={() => {
                          setPendingId(u.id);
                          updateM.mutate({
                            role: u.role === "ADMIN" ? "STAFF" : "ADMIN",
                          });
                        }}
                      >
                        Toggle Role
                      </Button>
                    </RequirePerm>
                    <RequirePerm perm="USERS_MANAGE">
                      <Button
                        color="danger"
                        isLoading={deleteM.isPending && deleteId === u.id}
                        size="sm"
                        variant="flat"
                        onPress={() => {
                          setDeleteId(u.id);
                          deleteM.mutate();
                        }}
                      >
                        Delete
                      </Button>
                    </RequirePerm>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Total: {total}</div>
        <Pagination
          showControls
          page={page}
          total={totalPages}
          onChange={setPage}
        />
      </div>

      {/* Error toasts inline */}
      {(createM.isError || updateM.isError || deleteM.isError) && (
        <div className="text-danger-500 text-sm">
          {((createM.error || updateM.error || deleteM.error) as any)
            ?.message ?? "Operasi gagal. Coba lagi."}
        </div>
      )}
    </div>
  );
}
