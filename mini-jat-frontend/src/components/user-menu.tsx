export function UserMenu() {

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm">
      <div className="size-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
        JS
      </div>
      <div className="hidden sm:block leading-tight">
        <p className="font-medium text-sm">John Smith</p>
        <p className="text-xs text-muted-foreground">john@example.com</p>
      </div>
    </div>
  )
}
