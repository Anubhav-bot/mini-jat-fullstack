import { FileText } from 'lucide-react'

export function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileText className="size-12 text-muted-foreground/50" />
      <p className="mt-3 text-sm text-muted-foreground">
        {message || 'No applications found'}
      </p>
    </div>
  )
}
