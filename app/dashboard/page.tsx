import React from 'react'
import { ArrowUpRight, DollarSign, Server, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1b858f]">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your dashboard overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Total Loads Posted </h3>
            <Server className="text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mt-2">36</p>
          <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
            <ArrowUpRight className="size-4" />
            <span>4% from last month</span>
          </div>
        </div>

        <div className="p-6 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Total Loads Under Review</h3>
            <Users className="text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mt-2">7</p>
          <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
            <ArrowUpRight className="size-4" />
            <span>12% from last month</span>
          </div>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Approved Loads</h3>
            <DollarSign  className="text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mt-2">23</p>
          <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
            <ArrowUpRight className="size-4" />
            <span>12% from last month</span>
          </div>
        </div>
      </div>

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