import { useState, useMemo, useEffect, useRef } from 'react'
import { useApplications, useCreateApplication, useUpdateApplication, useDeleteApplication } from '@/hooks/use-applications'
import { ApplicationTable } from '@/components/application-table'
import { ApplicationForm } from '@/components/application-form'
import { ConfirmDelete } from '@/components/confirm-delete'
import { FilterBar } from '@/components/filter-bar'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Briefcase, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import type { Application, CreateApplicationInput, UpdateApplicationInput } from '@/types/application'

const PAGE_SIZE = 10

export function ApplicationsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  const [formOpen, setFormOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [deletingApp, setDeletingApp] = useState<Application | null>(null)
  const [viewingApp, setViewingApp] = useState<Application | null>(null)

  const params = useMemo(
    () => ({
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      page,
      limit: PAGE_SIZE,
    }),
    [statusFilter, debouncedSearch, page]
  )

  const { data, isLoading, isError, error, refetch } = useApplications(params)
  const createMutation = useCreateApplication()
  const updateMutation = useUpdateApplication()
  const deleteMutation = useDeleteApplication()

  const handleSearchChange = (value: string) => setSearch(value)

  const handleAdd = () => {
    setEditingApp(null)
    setFormOpen(true)
  }

  const handleEdit = (app: Application) => {
    setEditingApp(app)
    setFormOpen(true)
  }

  const handleCreate = async (input: CreateApplicationInput | UpdateApplicationInput) => {
    await createMutation.mutateAsync(input as CreateApplicationInput)
  }

  const handleUpdate = async (input: CreateApplicationInput | UpdateApplicationInput) => {
    if (!editingApp) return
    await updateMutation.mutateAsync({ id: editingApp.id, input })
  }

  const handleDelete = async () => {
    if (!deletingApp) return
    await deleteMutation.mutateAsync(deletingApp.id)
    setDeletingApp(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="size-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Job Tracker</h1>
              <p className="text-xs text-muted-foreground leading-tight">Mini Job Application Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Applications</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="mr-1 size-4" />
              Add Application
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <FilterBar
              search={search}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusFilterChange={(value) => {
                setStatusFilter(value)
                setPage(1)
              }}
            />

            {isLoading ? (
              <LoadingSpinner text="Loading applications..." />
            ) : isError ? (
              <ErrorState
                message={(error as Error)?.message || 'Failed to load applications'}
                onRetry={() => refetch()}
              />
            ) : !data || data.data.length === 0 ? (
              <EmptyState
                message={
                  search || statusFilter
                    ? 'No applications match your filters'
                    : 'No applications yet. Add your first one!'
                }
              />
            ) : (
              <>
                <ApplicationTable
                  data={data.data}
                  onView={setViewingApp}
                  onEdit={handleEdit}
                  onDelete={setDeletingApp}
                />
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">
                    Page {data.page} of {data.totalPages} ({data.total} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= (data.totalPages)}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <ApplicationForm
        key={editingApp ? `edit-${editingApp.id}` : 'create'}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingApp(null)
        }}
        onSubmit={editingApp ? handleUpdate : handleCreate}
        application={editingApp}
      />

      <ConfirmDelete
        open={!!deletingApp}
        onOpenChange={(open) => {
          if (!open) setDeletingApp(null)
        }}
        onConfirm={handleDelete}
        companyName={deletingApp?.company_name || ''}
        loading={deleteMutation.isPending}
      />

      <Dialog open={!!viewingApp} onOpenChange={(open) => { if (!open) setViewingApp(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewingApp?.job_title}</DialogTitle>
            <DialogDescription>{viewingApp?.company_name}</DialogDescription>
          </DialogHeader>
          {viewingApp && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Job Type:</span>{' '}
                  {viewingApp.job_type}
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  {viewingApp.status}
                </div>
                <div>
                  <span className="text-muted-foreground">Applied:</span>{' '}
                  {new Date(viewingApp.applied_date).toLocaleDateString()}
                </div>
              </div>
              {viewingApp.notes && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="mt-1 whitespace-pre-wrap">{viewingApp.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
