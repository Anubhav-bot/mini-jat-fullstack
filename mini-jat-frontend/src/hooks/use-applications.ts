import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchApplications,
  fetchApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '@/lib/api'
import type {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
  PaginatedResponse,
} from '@/types/application'

export function useApplications(params?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => fetchApplications(params),
  })
}

export function useApplication(id: number | null) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => fetchApplication(id!),
    enabled: id !== null,
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateApplicationInput) => createApplication(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useUpdateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateApplicationInput }) =>
      updateApplication(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] })
      const previousQueries = queryClient.getQueriesData<PaginatedResponse<Application>>({
        queryKey: ['applications'],
      })

      for (const [queryKey, data] of previousQueries) {
        if (!data) continue
        queryClient.setQueryData<PaginatedResponse<Application>>(queryKey, {
          ...data,
          data: data.data.map((app) =>
            app.id === id ? { ...app, ...input, updated_at: new Date().toISOString() } : app
          ),
        })
      }

      return { previousQueries }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousQueries) {
        for (const [key, data] of context.previousQueries) {
          queryClient.setQueryData(key, data)
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useDeleteApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteApplication(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] })
      const previousQueries = queryClient.getQueriesData<PaginatedResponse<Application>>({
        queryKey: ['applications'],
      })

      for (const [queryKey, data] of previousQueries) {
        if (!data) continue
        queryClient.setQueryData<PaginatedResponse<Application>>(queryKey, {
          ...data,
          data: data.data.filter((app) => app.id !== id),
          total: data.total - 1,
        })
      }

      return { previousQueries }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousQueries) {
        for (const [key, data] of context.previousQueries) {
          queryClient.setQueryData(key, data)
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
