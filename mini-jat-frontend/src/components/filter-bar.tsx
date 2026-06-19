import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface Props {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
}

const statuses = ['All', 'Applied', 'Interviewing', 'Offer', 'Rejected'] as const

export function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="Search by company or job title..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:max-w-xs"
      />
      <Select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="sm:max-w-[180px]"
      >
        {statuses.map((status) => (
          <option key={status} value={status === 'All' ? '' : status}>
            {status}
          </option>
        ))}
      </Select>
    </div>
  )
}
