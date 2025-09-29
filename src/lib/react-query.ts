import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

function showErrorToast(err: any) {
  const msg =
    err?.message ??
    (typeof err === "string" ? err : "Terjadi kesalahan. Coba lagi.");

  addToast({
    title: msg,
    description: "Toast displayed successfully",
    color: "danger",
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401) return false;

        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: showErrorToast,
  }),
  mutationCache: new MutationCache({
    onError: showErrorToast,
  }),
});
