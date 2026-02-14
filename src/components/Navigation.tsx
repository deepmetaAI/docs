'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { getNavigationForPathname, type NavGroup } from '@/lib/navigation'

function useInitialValue<T>(value: T, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({
  href,
  children,
  active = false,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex items-center rounded-lg py-1.5 px-2.5 text-sm transition',
        active
          ? 'bg-indigo-50 font-medium text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
      )}
    >
      <span className="truncate">{children}</span>
    </Link>
  )
}

function NavigationGroup({
  group,
  className,
}: {
  group: NavGroup
  className?: string
}) {
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let pathname = useInitialValue(usePathname(), isInsideMobileNavigation)

  return (
    <li className={clsx('mt-6', className)}>
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
        {group.title}
      </h2>
      <ul role="list" className="mt-1.5 -mx-2 space-y-0.5">
        {group.links.map((link) => (
          <li key={link.href}>
            <NavLink href={link.href} active={link.href === pathname}>
              {link.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </li>
  )
}

export function Navigation(props: React.ComponentPropsWithoutRef<'nav'>) {
  let pathname = usePathname()
  let navigation = getNavigationForPathname(pathname)

  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/docs/zh-CN">API文档</TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? 'md:mt-0' : ''}
          />
        ))}
      </ul>
    </nav>
  )
}
