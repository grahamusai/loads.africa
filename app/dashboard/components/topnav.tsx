import { Search, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Topnav() {
  return (
    <div 
      className="h-16 border-b border-border px-6 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
     
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <h2 className='text-xl font-bold '>Loads Dashboard</h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
         
        >
          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
        </div>

        <div
      
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}