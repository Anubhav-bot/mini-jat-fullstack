import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import type { Application, ApplicationStatus } from '@/types/application'

const statusVariant: Record<ApplicationStatus, 'info' | 'warning' | 'success' | 'destructive'> = {
  Applied: 'info',
  Interviewing: 'warning',
  Offer: 'success',
  Rejected: 'destructive',
}

const columnHelper = createColumnHelper<Application>()

interface Props {
  data: Application[]
  onView: (app: Application) => void
  onEdit: (app: Application) => void
  onDelete: (app: Application) => void
}

function TableContent({
  table,
}: {
  table: ReturnType<typeof useReactTable<Application>>
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function ApplicationTable({ data, onView, onEdit, onDelete }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      columnHelper.accessor('company_name', {
        size: 200,
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting()}
          >
            Company
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 size-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 size-4" />
            ) : (
              <ArrowUpDown className="ml-1 size-4" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => (
          <span className="truncate block">{getValue()}</span>
        ),
      }),
      columnHelper.accessor('job_title', {
        size: 250,
        header: 'Job Title',
        cell: ({ getValue }) => (
          <span className="truncate block">{getValue()}</span>
        ),
      }),
      columnHelper.accessor('job_type', {
        size: 120,
        header: 'Type',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground truncate block">{getValue()}</span>
        ),
      }),
      columnHelper.accessor('status', {
        size: 130,
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge variant={statusVariant[getValue()]} className="truncate">{getValue()}</Badge>
        ),
      }),
      columnHelper.accessor('applied_date', {
        size: 130,
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting()}
          >
            Applied
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1 size-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1 size-4" />
            ) : (
              <ArrowUpDown className="ml-1 size-4" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => {
          const date = getValue()
          return <span className="whitespace-nowrap">{new Date(date).toLocaleDateString()}</span>
        },
      }),
      columnHelper.accessor('id', {
        size: 140,
        header: '',
        cell: ({ row }) => (
          <div className="flex gap-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(row.original)}
              title="View details"
            >
              <Eye className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.original)}
              title="Edit"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(row.original)}
              title="Delete"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ),
      }),
    ],
    [onView, onEdit, onDelete]
  )

  // TanStack Table returns closure-based accessors — React Compiler skips this leaf component.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (data.length === 0) return null

  return <TableContent table={table} />
}
