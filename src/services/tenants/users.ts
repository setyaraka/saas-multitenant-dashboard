import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError, del, get, Paginated, patch, post } from "@/lib/api";

export type RoleCode = "OWNER" | "ADMIN" | "STAFF" | "VIEWER";
export type User = { id: string; name: string; email: string; role: RoleCode };

export type ListUsersParams = {
  tenantId: string;
  page: number;
  pageSize: number;
  q?: string;
};

export type CreateUserDto = { name: string; email: string; role: RoleCode };
export type UpdateUserDto = Partial<CreateUserDto>;

export const listUsers = (p: ListUsersParams) =>
  get<Paginated<User>>(
    `tenants/${p.tenantId}/users?page=${p.page}&pageSize=${p.pageSize}${
      p.q ? `&q=${encodeURIComponent(p.q)}` : ""
    }`,
  );

export const createUser = (tenantId: string, dto: CreateUserDto) =>
  post<User>(`tenants/${tenantId}/users`, dto);

export const updateUser = (
  tenantId: string,
  userId: string,
  dto: UpdateUserDto,
) => patch<User>(`tenants/${tenantId}/users/${userId}`, dto);

export const deleteUser = (tenantId: string, userId: string) =>
  del<{ success: true }>(`tenants/${tenantId}/users/${userId}`);

export function useUsersQuery(p?: ListUsersParams) {
  return useQuery<Paginated<User>, ApiError>({
    queryKey: [
      "tenants",
      p?.tenantId,
      "users",
      { page: p?.page, pageSize: p?.pageSize, q: p?.q },
    ] as const,
    queryFn: () => listUsers(p!),
    enabled: !!p?.tenantId,
    placeholderData: (prev) => prev,
    staleTime: 5_000,
    retry: (count, err: any) => (err?.status === 401 ? false : count < 2),
  });
}

export function useCreateUserMutation(tenantId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateUserDto) => createUser(tenantId, dto),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["tenants", tenantId, "users"] }),
  });
}

export function useUpdateUserMutation(tenantId: string, userId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateUserDto) => updateUser(tenantId, userId, dto),
    onMutate: async (dto) => {
      const keyPrefix = ["tenants", tenantId, "users"];
      const keys = qc.getQueriesData({ queryKey: keyPrefix });
      const snapshots = keys.map(([key, data]) => ({ key, data }));

      // optimistic: patch item di semua halaman cache
      for (const [key, data] of keys) {
        const pg = data as Paginated<User> | undefined;

        if (pg) {
          const items = pg.items.map((u) =>
            u.id === userId ? { ...u, ...dto } : u,
          );

          qc.setQueryData(key, { ...pg, items });
        }
      }

      return { snapshots };
    },
    onError: (_e, _v, ctx) => {
      ctx?.snapshots?.forEach(({ key, data }) => {
        // rollback

        (qc as any).setQueryData(key, data);
      });
    },
    onSettled: () =>
      qc.invalidateQueries({ queryKey: ["tenants", tenantId, "users"] }),
  });
}

export function useDeleteUserMutation(tenantId: string, userId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => deleteUser(tenantId, userId),
    onMutate: async () => {
      const keyPrefix = ["tenants", tenantId, "users"];
      const keys = qc.getQueriesData({ queryKey: keyPrefix });
      const snapshots = keys.map(([key, data]) => ({ key, data }));

      for (const [key, data] of keys) {
        const pg = data as Paginated<User> | undefined;

        if (pg) {
          const items = pg.items.filter((u) => u.id !== userId);

          qc.setQueryData(key, {
            ...pg,
            items,
            total: Math.max(0, pg.total - 1),
          });
        }
      }

      return { snapshots };
    },
    onError: (_e, _v, ctx) =>
      ctx?.snapshots?.forEach(({ key, data }) =>
        (qc as any).setQueryData(key, data),
      ),
    onSettled: () =>
      qc.invalidateQueries({ queryKey: ["tenants", tenantId, "users"] }),
  });
}
