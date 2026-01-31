'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'

import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from '@/components/MobileNavigation'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { MobileSearch, Search } from '@/components/Search'
import { ThemeToggle } from '@/components/ThemeToggle'
import { spaces } from '@/lib/navigation'

function TopLevelNavItem({
  href,
  children,
  active = false,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <li className="relative">
      <Link
        href={href}
        className={clsx(
          'block py-2 text-sm transition',
          active
            ? 'text-zinc-900 font-medium dark:text-white'
            : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
        )}
      >
        {children}
      </Link>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
      )}
    </li>
  )
}

export const Header = forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<typeof motion.div>
>(function Header({ className, ...props }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let pathname = usePathname()
  let currentSpaceSlug = pathname.split('/')[1]

  let { scrollY } = useScroll()
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

  return (
    <motion.div
      {...props}
      ref={ref}
      className={clsx(
        className,
        'fixed inset-x-0 top-0 z-50 flex flex-col transition',
        !isInsideMobileNavigation && 'backdrop-blur-sm',
        isInsideMobileNavigation
          ? 'bg-white dark:bg-zinc-900'
          : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]',
      )}
      style={
        {
          '--bg-opacity-light': bgOpacityLight,
          '--bg-opacity-dark': bgOpacityDark,
        } as React.CSSProperties
      }
    >
      {/* 第一行：Logo、搜索和操作按钮 */}
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* 左侧：移动端汉堡+Logo，桌面端Logo */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="lg:hidden">
            <MobileNavigation />
          </div>
          <Link href="/docs/zh-CN" aria-label="Home">
            <Logo className="h-6" />
          </Link>
        </div>
        
        {/* 中间：搜索框（仅桌面端显示） */}
        <div className="hidden lg:flex flex-1 justify-center max-w-2xl mx-auto">
          <Search />
        </div>
        
        {/* 右侧：操作按钮 */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex gap-4">
            <MobileSearch />
          </div>
          <div className="hidden min-[416px]:contents">
            <Button href="https://omnimaas.com/login">注册</Button>
          </div>
        </div>
      </div>
      
      {/* 第二行：分类导航 */}
      <div className="hidden md:block border-t border-zinc-900/5 dark:border-white/5">
        <nav className="px-4 sm:px-6 lg:px-8">
          <ul role="list" className="flex items-center gap-8">
            {spaces.map((space) => (
              <TopLevelNavItem
                key={space.slug}
                href={`/${space.slug}`}
                active={currentSpaceSlug === space.slug}
              >
                {space.name}
              </TopLevelNavItem>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* 底部分隔线 */}
      <div
        className={clsx(
          'h-px',
          (isInsideMobileNavigation || !mobileNavIsOpen) &&
            'bg-zinc-900/5 dark:bg-white/5',
        )}
      />
    </motion.div>
  )
})
