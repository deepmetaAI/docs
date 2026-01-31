'use client'

import { useState, useEffect } from 'react'
import clsx from 'clsx'

function ClipboardIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        strokeWidth="0"
        d="M5.5 13.5v-5a2 2 0 0 1 2-2l.447-.894A2 2 0 0 1 9.737 4.5h.527a2 2 0 0 1 1.789 1.106l.447.894a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2Z"
      />
      <path
        fill="none"
        strokeLinejoin="round"
        d="M12.5 6.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2m5 0-.447-.894a2 2 0 0 0-1.79-1.106h-.527a2 2 0 0 0-1.789 1.106L7.5 6.5m5 0-1 1h-3l-1-1"
      />
    </svg>
  )
}

function CheckIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.5 10.5l2.5 2.5 5-5"
      />
    </svg>
  )
}

export function Endpoint({
  method,
  path,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
}) {
  const [copyCount, setCopyCount] = useState(0)
  const copied = copyCount > 0

  useEffect(() => {
    if (copyCount > 0) {
      const timeout = setTimeout(() => setCopyCount(0), 1000)
      return () => clearTimeout(timeout)
    }
  }, [copyCount])

  const handleCopy = () => {
    navigator.clipboard.writeText(path).then(() => {
      setCopyCount((count) => count + 1)
    })
  }

  return (
    <div className="group/endpoint inline-flex items-center gap-3 rounded-full bg-zinc-100 py-1.5 pr-2 pl-1.5 max-w-full dark:bg-zinc-800">
      <span className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold text-white shrink-0">
        {method}
      </span>
      <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {path}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className={clsx(
          'shrink-0 overflow-hidden rounded-full p-1.5 transition',
          copied
            ? 'bg-indigo-400/10 ring-1 ring-indigo-400/20 ring-inset'
            : 'hover:bg-zinc-200 dark:hover:bg-zinc-700',
        )}
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 stroke-indigo-400" />
        ) : (
          <ClipboardIcon className="h-4 w-4 fill-zinc-400/20 stroke-zinc-500 dark:fill-zinc-500/20 dark:stroke-zinc-400" />
        )}
      </button>
    </div>
  )
}
