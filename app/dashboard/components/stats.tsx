'use client';

import React, { useEffect, useState } from 'react'
import { ArrowUpRight, DollarSign, Server, Users } from 'lucide-react'
import getPocketBaseClient from '@/lib/pocketbase-client'

const Stats = () => {
  const [stats, setStats] = useState({
    totalLoads: 0,
    underReview: 0,
    approved: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const pb = getPocketBaseClient();
      if (!pb || !pb.authStore.isValid) return;

      try {
        // Get all loads for the current user
        const totalLoads = await pb.collection('loads').getList(1, 1, {
          filter: 'created != null'
        });

        // Get loads under review (draft status)
        const underReview = await pb.collection('loads').getList(1, 1, {
          filter: 'status = "draft"'
        });

        // Get approved loads (posted status)
        const approved = await pb.collection('loads').getList(1, 1, {
          filter: 'status = "posted"'
        });

        setStats({
          totalLoads: totalLoads.totalItems,
          underReview: underReview.totalItems,
          approved: approved.totalItems
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="p-6 bg-card rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Total Loads Posted</h3>
          <Server className="text-muted-foreground" />
        </div>
        <p className="text-3xl font-bold mt-2">{stats.totalLoads}</p>
        <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
          <ArrowUpRight className="size-4" />
          <span>Real-time data</span>
        </div>
      </div>

      <div className="p-6 bg-card rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Total Loads Under Review</h3>
          <Users className="text-muted-foreground" />
        </div>
        <p className="text-3xl font-bold mt-2">{stats.underReview}</p>
        <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
          <ArrowUpRight className="size-4" />
          <span>Draft status</span>
        </div>
      </div>

      <div className="p-6 bg-card rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Approved Loads</h3>
          <DollarSign className="text-muted-foreground" />
        </div>
        <p className="text-3xl font-bold mt-2">{stats.approved}</p>
        <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
          <ArrowUpRight className="size-4" />
          <span>Posted status</span>
        </div>
      </div>
    </div>
  )
}

export default Stats