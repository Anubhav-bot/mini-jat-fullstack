import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { ApplicationsPage } from '@/components/applications-page'

vi.mock('@/lib/api', () => ({
  fetchApplications: vi.fn(),
  fetchApplication: vi.fn(),
  createApplication: vi.fn(),
  updateApplication: vi.fn(),
  deleteApplication: vi.fn(),
}))

import { fetchApplications } from '@/lib/api'

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ApplicationsPage />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('ApplicationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    vi.mocked(fetchApplications).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    })
    renderPage()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows empty state when no applications', async () => {
    vi.mocked(fetchApplications).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/no applications/i)).toBeInTheDocument()
    })
  })

  it('shows error state on fetch failure', async () => {
    vi.mocked(fetchApplications).mockRejectedValue(new Error('Network error'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  it('renders applications in table', async () => {
    vi.mocked(fetchApplications).mockResolvedValue({
      data: [
        {
          id: 1,
          company_name: 'Google',
          job_title: 'Software Engineer',
          job_type: 'Full-time',
          status: 'Applied',
          applied_date: '2024-06-01',
          notes: null,
          created_at: '2024-06-01T00:00:00Z',
          updated_at: '2024-06-01T00:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Google')).toBeInTheDocument()
      expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    })
  })

  it('opens add form when clicking add button', async () => {
    const user = userEvent.setup()
    vi.mocked(fetchApplications).mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    })
    renderPage()
    await user.click(screen.getByText(/add application/i))
    expect(screen.getByRole('heading', { name: 'New Application' })).toBeInTheDocument()
  })
})
