import axios from 'axios'
import type {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
  PaginatedResponse,
} from '@/types/application'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

export async function fetchApplications(params?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}): Promise<PaginatedResponse<Application>> {
  const { data } = await api.get<PaginatedResponse<Application>>('/applications', { params })
  return data
}

export async function fetchApplication(id: number): Promise<Application> {
  const { data } = await api.get<Application>(`/applications/${id}`)
  return data
}

export async function createApplication(
  input: CreateApplicationInput
): Promise<Application> {
  const { data } = await api.post<Application>('/applications', input)
  return data
}

export async function updateApplication(
  id: number,
  input: UpdateApplicationInput
): Promise<Application> {
  const { data } = await api.patch<Application>(`/applications/${id}`, input)
  return data
}

export async function deleteApplication(id: number): Promise<void> {
  await api.delete(`/applications/${id}`)
}
