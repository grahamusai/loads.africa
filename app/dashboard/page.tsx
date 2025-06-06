import React from 'react'

import { Button } from '@/components/ui/button'
import Stats from './components/stats'

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1b858f]">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your dashboard overview.</p>
      </div>

      <Stats />

      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Activity</h2>
          <Button variant="outline" size="sm">View all</Button>
        </div>
        <div className="text-sm text-muted-foreground">
          No recent activity to show.
        </div>
      </div>
    </div>
  )
}

export default Dashboard