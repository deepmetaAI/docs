'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useSectionStore } from '@/components/SectionProvider'

function TableOfContentsInner() {
  const rawSections = useSectionStore((s) => s.sections)
  const [activeId, setActiveId] = useState<string>('')
  const isClickScrolling = useRef(false)

  // Deduplicate sections by id
  const sections = rawSections.filter(
    (section, index, self) => self.findIndex((s) => s.id === section.id) === index
  )

  const handleScroll = useCallback(() => {
    if (isClickScrolling.current) return
    if (sections.length === 0) return

    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollY = window.scrollY

    // At the bottom of the page - highlight last section
    if (scrollY + windowHeight >= documentHeight - 30) {
      setActiveId(sections[sections.length - 1]?.id || '')
      return
    }

    // Find the last section that has scrolled past the threshold
    let activeSection = sections[0]?.id || ''
    const threshold = 150

    for (const section of sections) {
      const element = document.getElementById(section.id)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= threshold) {
          activeSection = section.id
        }
      }
    }

    setActiveId(activeSection)
  }, [sections])

  useEffect(() => {
    if (sections.length === 0) {
      setActiveId('')
      return
    }

    // Initial check with delay
    const timer = setTimeout(handleScroll, 100)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [sections, handleScroll])

  const handleClick = useCallback((e: React.MouseEvent, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      // Set flag to prevent scroll handler from interfering
      isClickScrolling.current = true
      setActiveId(sectionId)
      
      const top = element.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: 'smooth' })
      
      // Reset flag after scroll animation completes
      setTimeout(() => {
        isClickScrolling.current = false
      }, 500)
    }
  }, [])

  if (sections.length === 0) {
    return null
  }

  return (
    <div>
      <h5 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 4h12M2 8h12M2 12h8" strokeLinecap="round" />
        </svg>
        本页目录
      </h5>
      <nav>
        <ul className="space-y-2.5 text-sm">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={clsx(
                  'block transition-colors',
                  activeId === section.id
                    ? 'text-indigo-500 font-medium'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                )}
                onClick={(e) => handleClick(e, section.id)}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export function TableOfContents() {
  const pathname = usePathname()

  // Use pathname as key to force remount on page change
  return (
    <div className="hidden xl:block" key={pathname}>
      <TableOfContentsInner />
    </div>
  )
}
