import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="size-12 text-destructive" />
      <p className="mt-3 text-sm text-destructive">
        {message || 'Something went wrong'}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          <RefreshCw className="mr-2 size-4" />
          Retry
        </Button>
      )}
    </div>
  )
}
