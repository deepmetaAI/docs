'use client'

import {
  forwardRef,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import Highlighter from 'react-highlight-words'
import { useRouter } from 'next/navigation'
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react'
import clsx from 'clsx'

import searchData from '@/lib/search-data.json'

type SearchResult = {
  url: string
  title: string
  pageTitle: string
  content: string
  section?: string
}

function searchContent(query: string): SearchResult[] {
  if (!query.trim()) return []
  
  const lowerQuery = query.toLowerCase()
  const results: SearchResult[] = []
  const seenUrls = new Set<string>()
  
  for (const item of searchData as SearchResult[]) {
    const titleMatch = item.title.toLowerCase().includes(lowerQuery)
    const contentMatch = item.content.toLowerCase().includes(lowerQuery)
    
    if (titleMatch || contentMatch) {
      // Deduplicate by base URL (without anchor)
      const baseUrl = item.url.split('#')[0]
      if (!seenUrls.has(baseUrl) || item.section) {
        results.push(item)
        if (!item.section) {
          seenUrls.add(baseUrl)
        }
      }
    }
  }
  
  // Sort: title matches first, then by relevance
  results.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(lowerQuery)
    const bTitle = b.title.toLowerCase().includes(lowerQuery)
    if (aTitle && !bTitle) return -1
    if (!aTitle && bTitle) return 1
    // Prefer main pages over sections
    if (!a.section && b.section) return -1
    if (a.section && !b.section) return 1
    return 0
  })
  
  return results.slice(0, 15)
}

function getMatchingExcerpt(content: string, query: string): string {
  const lowerContent = content.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerContent.indexOf(lowerQuery)
  
  if (index === -1) return content.slice(0, 120) + '...'
  
  const start = Math.max(0, index - 40)
  const end = Math.min(content.length, index + query.length + 80)
  
  let excerpt = content.slice(start, end)
  if (start > 0) excerpt = '...' + excerpt
  if (end < content.length) excerpt = excerpt + '...'
  
  return excerpt
}

function SearchIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
      />
    </svg>
  )
}

function NoResultsIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.237 4.237 0 0 0 1.24-3c0-.62-.132-1.207-.37-1.738M12.01 12A4.237 4.237 0 0 1 9 13.25c-.635 0-1.237-.14-1.777-.388M12.01 12l3.24 3.25m-3.715-9.661a4.25 4.25 0 0 0-5.975 5.908M4.5 15.5l11-11"
      />
    </svg>
  )
}

function LoadingIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  let id = useId()

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
      <path
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
      />
      <defs>
        <linearGradient
          id={id}
          x1="13"
          x2="9.5"
          y1="9"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function HighlightQuery({ text, query }: { text: string; query: string }) {
  return (
    <Highlighter
      highlightClassName="bg-indigo-100 text-indigo-800 dark:bg-indigo-400/20 dark:text-indigo-300 rounded px-0.5"
      searchWords={[query]}
      autoEscape={true}
      textToHighlight={text}
    />
  )
}

function SearchResultItem({
  result,
  query,
  onSelect,
}: {
  result: SearchResult
  query: string
  onSelect: (url: string) => void
}) {
  const excerpt = getMatchingExcerpt(result.content, query)
  
  return (
    <li
      className="group cursor-pointer rounded-lg px-3 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      onClick={() => onSelect(result.url)}
    >
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{result.pageTitle}</span>
        {result.section && (
          <>
            <span className="text-zinc-300 dark:text-zinc-600">&rsaquo;</span>
            <span>{result.section}</span>
          </>
        )}
      </div>
      <div className="mt-1 text-sm font-medium text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
        <HighlightQuery text={result.title} query={query} />
      </div>
      <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
        <HighlightQuery text={excerpt} query={query} />
      </div>
    </li>
  )
}

function SearchResults({
  results,
  query,
  onSelect,
}: {
  results: SearchResult[]
  query: string
  onSelect: (url: string) => void
}) {
  if (results.length === 0) {
    return (
      <div className="p-6 text-center">
        <NoResultsIcon className="mx-auto h-5 w-5 stroke-zinc-900 dark:stroke-zinc-600" />
        <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-400">
          未找到 &ldquo;
          <span className="break-words text-zinc-900 dark:text-white">
            {query}
          </span>
          &rdquo; 相关结果
        </p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {results.map((result, index) => (
        <SearchResultItem
          key={`${result.url}-${index}`}
          result={result}
          query={query}
          onSelect={onSelect}
        />
      ))}
    </ul>
  )
}

const SearchInput = forwardRef<
  React.ElementRef<'input'>,
  {
    value: string
    onChange: (value: string) => void
    onClose: () => void
    isLoading?: boolean
  }
>(function SearchInput({ value, onChange, onClose, isLoading }, inputRef) {
  return (
    <div className="group relative flex h-12">
      <SearchIcon className="pointer-events-none absolute left-4 top-0 h-full w-5 stroke-zinc-500" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索文档..."
        className={clsx(
          'flex-auto appearance-none bg-transparent pl-12 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none sm:text-sm dark:text-white [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden',
          isLoading ? 'pr-11' : 'pr-4',
        )}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            onClose()
          }
        }}
      />
      {isLoading && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <LoadingIcon className="h-6 w-6 animate-spin stroke-zinc-200 text-zinc-400 dark:stroke-zinc-800" />
        </div>
      )}
    </div>
  )
})

function SearchDialog({
  open,
  setOpen,
  className,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  className?: string
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    const timer = setTimeout(() => {
      const searchResults = searchContent(query)
      setResults(searchResults)
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = useCallback(
    (url: string) => {
      setOpen(false)
      setQuery('')
      router.push(url)
    },
    [router, setOpen],
  )

  const handleClose = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [setOpen])

  useEffect(() => {
    if (open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, setOpen])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={clsx('fixed inset-0 z-50', className)}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-black/40"
      />

      <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
        <DialogPanel
          transition
          className="mx-auto transform-gpu overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-zinc-900/7.5 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:max-w-xl dark:bg-zinc-900 dark:ring-zinc-800"
        >
          <SearchInput
            ref={inputRef}
            value={query}
            onChange={setQuery}
            onClose={handleClose}
            isLoading={isLoading}
          />
          {query && (
            <div className="max-h-[60vh] overflow-y-auto border-t border-zinc-200 bg-white dark:border-zinc-400/10 dark:bg-zinc-900">
              <SearchResults
                results={results}
                query={query}
                onSelect={handleSelect}
              />
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}

function useSearchProps() {
  let buttonRef = useRef<React.ElementRef<'button'>>(null)
  let [open, setOpen] = useState(false)

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true)
      },
    },
    dialogProps: {
      open,
      setOpen: useCallback(
        (open: boolean) => {
          let { width = 0, height = 0 } =
            buttonRef.current?.getBoundingClientRect() ?? {}
          if (!open || (width !== 0 && height !== 0)) {
            setOpen(open)
          }
        },
        [setOpen],
      ),
    },
  }
}

export function Search() {
  let [modifierKey, setModifierKey] = useState<string>()
  let { buttonProps, dialogProps } = useSearchProps()

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl ',
    )
  }, [])

  return (
    <div className="hidden lg:block w-full max-w-xl">
      <button
        type="button"
        className="hidden h-9 w-full items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 lg:flex dark:bg-white/10 dark:text-zinc-400 dark:ring-white/10 dark:hover:ring-white/20"
        {...buttonProps}
      >
        <SearchIcon className="h-5 w-5 stroke-current" />
        搜索文档...
        <kbd className="ml-auto text-2xs text-zinc-400 dark:text-zinc-500">
          <kbd className="font-sans">{modifierKey}</kbd>
          <kbd className="font-sans">K</kbd>
        </kbd>
      </button>
      <Suspense fallback={null}>
        <SearchDialog className="hidden lg:block" {...dialogProps} />
      </Suspense>
    </div>
  )
}

export function MobileSearch() {
  let { buttonProps, dialogProps } = useSearchProps()

  return (
    <div className="contents lg:hidden">
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 lg:hidden dark:hover:bg-white/5"
        aria-label="搜索文档..."
        {...buttonProps}
      >
        <SearchIcon className="h-5 w-5 stroke-zinc-900 dark:stroke-white" />
      </button>
      <Suspense fallback={null}>
        <SearchDialog className="lg:hidden" {...dialogProps} />
      </Suspense>
    </div>
  )
}
