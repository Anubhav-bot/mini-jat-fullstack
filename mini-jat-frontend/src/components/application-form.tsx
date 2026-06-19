import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import type {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
  JobType,
  ApplicationStatus,
} from '@/types/application'

type FormData = {
  company_name: string
  job_title: string
  job_type: JobType
  status: ApplicationStatus
  applied_date: string
  notes: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

function getInitialData(application?: Application | null): FormData {
  if (application) {
    return {
      company_name: application.company_name,
      job_title: application.job_title,
      job_type: application.job_type,
      status: application.status,
      applied_date: application.applied_date.split('T')[0],
      notes: application.notes || '',
    }
  }
  return {
    company_name: '',
    job_title: '',
    job_type: 'Internship',
    status: 'Applied',
    applied_date: new Date().toISOString().split('T')[0],
    notes: '',
  }
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateApplicationInput | UpdateApplicationInput) => Promise<void>
  application?: Application | null
}

export function ApplicationForm({ open, onOpenChange, onSubmit, application }: Props) {
  const [formData, setFormData] = useState<FormData>(() => getInitialData(application))
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const isEditing = !!application

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!formData.company_name || formData.company_name.trim().length < 2) {
      newErrors.company_name = 'Company name must be at least 2 characters'
    }
    if (!formData.job_title || formData.job_title.trim().length === 0) {
      newErrors.job_title = 'Job title is required'
    }
    if (!formData.applied_date) {
      newErrors.applied_date = 'Applied date is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const data = {
        company_name: formData.company_name.trim(),
        job_title: formData.job_title.trim(),
        job_type: formData.job_type,
        status: formData.status,
        applied_date: formData.applied_date,
        notes: formData.notes.trim() || undefined,
      }
      await onSubmit(data)
      onOpenChange(false)
    } catch {
      // error is handled by react-query
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Application' : 'New Application'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the details of your job application.'
              : 'Track a new job application.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Position</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="company_name">Company name</Label>
                  <Input
                    id="company_name"
                    placeholder="e.g. Google, Stripe, Airbnb"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, company_name: e.target.value }))
                    }
                  />
                  {errors.company_name && (
                    <p className="text-xs text-destructive">{errors.company_name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="job_title">Job title</Label>
                  <Input
                    id="job_title"
                    placeholder="e.g. Software Engineer Intern"
                    value={formData.job_title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, job_title: e.target.value }))
                    }
                  />
                  {errors.job_title && (
                    <p className="text-xs text-destructive">{errors.job_title}</p>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-t" />

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Details</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="job_type">Type</Label>
                  <Select
                    id="job_type"
                    value={formData.job_type}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, job_type: e.target.value as JobType }))
                    }
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as ApplicationStatus,
                      }))
                    }
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="applied_date">Date</Label>
                  <Input
                    id="applied_date"
                    type="date"
                    value={formData.applied_date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, applied_date: e.target.value }))
                    }
                  />
                  {errors.applied_date && (
                    <p className="text-xs text-destructive">{errors.applied_date}</p>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-t" />

            <div className="space-y-1.5">
              <Label htmlFor="notes">
                Notes <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this application..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
