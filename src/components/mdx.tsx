import Link from 'next/link'
import clsx from 'clsx'

import { Feedback } from '@/components/Feedback'
import { Heading } from '@/components/Heading'
import { Prose } from '@/components/Prose'
import { CheckIcon } from '@/components/icons/CheckIcon'

export const a = Link
export { Button } from '@/components/Button'
export { CodeGroup, Code as code, Pre as pre } from '@/components/Code'

export function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <article className="flex h-full flex-col py-10">
      <Prose className="flex-auto">{children}</Prose>
      <div className="mt-16">
        <Feedback />
      </div>
    </article>
  )
}

export const h2 = function H2(
  props: Omit<React.ComponentPropsWithoutRef<typeof Heading>, 'level'>,
) {
  return <Heading level={2} {...props} />
}

function InfoIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="8" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 7.75h1.5v3.5"
      />
      <circle cx="8" cy="4" r=".5" fill="none" />
    </svg>
  )
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-2xl border border-indigo-500/20 bg-indigo-50/50 p-4 text-sm/6 text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-500/5 dark:text-indigo-200 dark:[--tw-prose-links-hover:var(--color-indigo-300)] dark:[--tw-prose-links:var(--color-white)]">
      <InfoIcon className="mt-1 h-4 w-4 flex-none fill-indigo-500 stroke-white dark:fill-indigo-200/20 dark:stroke-indigo-200" />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0 [&>h3:first-child]:mt-0.5 [&>h3]:text-indigo-900 [&>h3]:dark:text-indigo-200 [&>h3]:text-base [&>h3]:leading-5 [&>h3]:mb-2 [&>h3]:font-semibold">
        {children}
      </div>
    </div>
  )
}

export function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
      {children}
    </div>
  )
}

export function Col({
  children,
  sticky = false,
}: {
  children: React.ReactNode
  sticky?: boolean
}) {
  return (
    <div
      className={clsx(
        '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
        sticky && 'xl:sticky xl:top-24',
      )}
    >
      {children}
    </div>
  )
}

export function Properties({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6">
      <ul
        role="list"
        className="m-0 max-w-[calc(var(--container-lg)-(--spacing(8)))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5"
      >
        {children}
      </ul>
    </div>
  )
}

export function Property({
  name,
  children,
  type,
  required,
}: {
  name: string
  children: React.ReactNode
  type?: string
  required?: boolean
}) {
  return (
    <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
      <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          {name}
        </dd>
        {type && (
          <>
            <dt className="sr-only">Type</dt>
            <dd className="font-mono text-2xs text-zinc-400 dark:text-zinc-500">
              {type}
            </dd>
          </>
        )}
        {required && (
          <>
            <dt className="sr-only">Required</dt>
            <dd className="flex h-[22px] items-center rounded-lg bg-red-50 px-1.5 text-2xs font-medium text-red-600 ring-1 ring-red-500/20 ring-inset dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/30">
              必填
            </dd>
          </>
        )}
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}

export function FeatureList({ children }: { children: React.ReactNode }) {
  return (
    <ul role="list" className="m-0 list-none space-y-2 p-0">
      {children}
    </ul>
  )
}

export function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="m-0 flex items-center gap-2 p-0">
      <CheckIcon className="h-5 w-5 flex-none fill-indigo-500 stroke-white dark:fill-indigo-200/20 dark:stroke-indigo-200" />
      <span>{children}</span>
    </li>
  )
}

export { Endpoint } from '@/components/Endpoint'

export function Options({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">可选值：</span>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {children}
      </div>
    </div>
  )
}

export function Option({ value, label }: { value: string; label?: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      {value}{label && <span className="ml-1 text-zinc-400 dark:text-zinc-500">({label})</span>}
    </span>
  )
}
