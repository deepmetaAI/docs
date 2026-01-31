import '@/styles/tailwind.css'
import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import glob from 'fast-glob'

export const metadata: Metadata = {
  title: {
    template: '%s - OmniMaaS',
    default: 'OmniMaaS - 统一 AI 模型接入平台',
  },
  description: 'OmniMaaS 提供统一的 AI 模型 API 接入服务，完全兼容 OpenAI、Claude、Gemini SDK，支持文本对话、图像生成、视频生成等多种 AI 能力。',
  keywords: ['OmniMaaS', 'AI API', 'OpenAI', 'Claude', 'Gemini', 'GPT', '大模型', 'API接入', '视频生成', '图像生成'],
  authors: [{ name: 'OmniMaaS' }],
  creator: 'OmniMaaS',
  metadataBase: new URL('https://docs.omnimaas.com'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'OmniMaaS',
    title: 'OmniMaaS - 统一 AI 模型接入平台',
    description: 'OmniMaaS 提供统一的 AI 模型 API 接入服务，完全兼容 OpenAI、Claude、Gemini SDK。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniMaaS - 统一 AI 模型接入平台',
    description: 'OmniMaaS 提供统一的 AI 模型 API 接入服务，完全兼容 OpenAI、Claude、Gemini SDK。',
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let pages = await glob('**/*.mdx', { cwd: 'src/app' })
  let allSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
      (await import(`@/app/${filename}`)).sections,
    ]),
  )) as Array<[string, Array<{ id: string; title: string }>]>
  let allSections = Object.fromEntries(allSectionsEntries)

  return (
    <html lang="zh-CN" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
        <Providers>
          <div className="w-full">
            <Layout allSections={allSections}>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
