export function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      {text && <p className="mt-3 text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}
