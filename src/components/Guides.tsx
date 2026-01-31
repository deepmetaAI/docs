import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const guides = [
  {
    href: '/docs/authentication',
    name: '身份认证',
    description: '了解如何对 API 请求进行身份认证。',
  },
  {
    href: '/docs/pagination',
    name: '分页',
    description: '了解如何处理分页响应。',
  },
  {
    href: '/docs/webhooks',
    name: 'Webhooks',
    description: '了解如何为您的应用程序配置 Webhooks。',
  },
]

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        指南
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
        {guides.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                阅读更多
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
