import React from "react"

export function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-neutral-800 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-24 rounded bg-neutral-800 animate-pulse" />
              <div className="h-6 w-12 rounded bg-neutral-800 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-8 w-8 rounded-lg bg-neutral-800 animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-neutral-800 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-3/4 rounded bg-neutral-800 animate-pulse" />
              <div className="h-4 w-full rounded bg-neutral-800 animate-pulse" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-8 w-8 rounded-full border-2 border-neutral-900 bg-neutral-800 animate-pulse" />
              ))}
            </div>
            <div className="h-4 w-12 rounded bg-neutral-800 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function RecentActivitySkeleton() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 shadow-sm overflow-hidden">
      <div className="border-b border-neutral-800 px-6 py-5">
        <div className="h-5 w-40 rounded bg-neutral-800 animate-pulse" />
      </div>
      <div className="divide-y divide-neutral-800">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4">
            <div className="h-10 w-10 rounded-full bg-neutral-800 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-full max-w-sm rounded bg-neutral-800 animate-pulse" />
              <div className="h-3 w-24 rounded bg-neutral-800 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
