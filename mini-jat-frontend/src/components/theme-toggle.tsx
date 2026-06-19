import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
    </Button>
  )
}
