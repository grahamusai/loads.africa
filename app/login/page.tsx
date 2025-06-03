'use client'
import React from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const Login = () => {  const dashboardOptions = [
    {
      title: "Carrier Dashboard",
      path: "/auth?type=carrier"
    },
    {
      title: "Goods Dashboard",
      path: "/auth?type=goods"
    },
    {
      title: "Clearing Agents",
      path: "/auth?type=agent"
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Select Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 hover:shadow-lg transition-shadow">
          {dashboardOptions.map((option) => (
            <Card key={option.path} className="p-6 ">
              <a href={option.path}>
                <Button 
                  variant="ghost" 
                  className="w-full h-32 text-xl font-semibold"
                >
                  {option.title}
                </Button>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Login