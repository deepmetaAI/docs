'use client'

import { usePathname } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HeroPattern } from '@/components/HeroPattern'
import { Navigation } from '@/components/Navigation'
import { type Section, SectionProvider } from '@/components/SectionProvider'
import { TableOfContents } from '@/components/TableOfContents'

const hideTocPages = [
  '/docs/zh-CN/text-chat/chat-completions',
  '/docs/zh-CN/image-generation/image-openai',
  '/docs/zh-CN/image-generation/image-qwen',
  '/docs/zh-CN/video-generation/video-vidu',
  '/docs/zh-CN/video-generation/video-kling',
  '/docs/zh-CN/video-generation/video-sora',
  '/docs/zh-CN/video-generation/video-jimeng',
  '/docs/zh-CN/video-generation/video-wan',
  '/docs/zh-CN/sdk-integration/sdk-openai',
  '/docs/zh-CN/sdk-integration/sdk-anthropic',
  '/docs/zh-CN/sdk-integration/sdk-google',
]

export function Layout({
  children,
  allSections,
}: {
  children: React.ReactNode
  allSections: Record<string, Array<Section>>
}) {
  let pathname = usePathname()
  const showToc = !hideTocPages.includes(pathname)

  return (
    <SectionProvider sections={allSections[pathname] ?? []}>
      <div className="relative h-full">
        {/* 背景纹理 - 所有页面都显示 */}
        <HeroPattern />

        {/* 顶部 Header - 通栏 */}
        <Header />

        {/* 主体内容区域 */}
        <div className="pt-14 md:pt-[5.5rem]">
          <div className="flex">
            {/* 左侧导航 */}
            <aside className="hidden w-60 flex-shrink-0 lg:block">
              <div className="fixed top-14 h-[calc(100vh-3.5rem)] w-60 overflow-y-auto border-r border-zinc-900/5 pt-14 pr-4 pb-8 pl-8 md:top-[5.5rem] md:h-[calc(100vh-5.5rem)] dark:border-white/5">
                <Navigation />
              </div>
            </aside>

            {/* 中间内容区域 */}
            <div className="min-w-0 flex-1">
              <div className="flex">
                <main className={`mx-auto min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8 ${showToc ? 'max-w-3xl' : 'max-w-5xl'}`}>
                  {children}
                </main>
              </div>
              <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${showToc ? 'max-w-3xl' : 'max-w-5xl'}`}>
                <Footer />
              </div>
            </div>

            {/* 右侧目录 - 固定在右边 */}
            {showToc && (
              <aside className="hidden w-56 flex-shrink-0 xl:block">
                <div className="fixed top-14 w-56 pt-14 pr-6 md:top-[5.5rem]">
                  <TableOfContents />
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </SectionProvider>
  )
}
