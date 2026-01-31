import { Button } from '@/components/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col pb-12 pt-16">
      <main className="mx-auto flex w-full max-w-7xl grow flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-600 dark:text-indigo-500">
              404
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              页面未找到
            </h1>
            <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
              抱歉，我们找不到您要查找的页面。
            </p>
            <div className="mt-6">
              <Button href="/" arrow="right">
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
