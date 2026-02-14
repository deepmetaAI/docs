export type NavLink = {
  title: string
  href: string
}

export type NavGroup = {
  title: string
  links: NavLink[]
}

export type Space = {
  name: string
  slug: string
  navigation: NavGroup[]
}

export const spaces: Space[] = [
  {
    name: 'API文档',
    slug: 'docs',
    navigation: [
      {
        title: 'OmniMaaS',
        links: [
          { title: '快速开始', href: '/docs/zh-CN' },
        ],
      },
      {
        title: 'SDK 集成',
        links: [
          { title: 'OpenAI', href: '/docs/zh-CN/sdk-integration/sdk-openai' },
          { title: 'Anthropic', href: '/docs/zh-CN/sdk-integration/sdk-anthropic' },
          { title: 'Gemini', href: '/docs/zh-CN/sdk-integration/sdk-google' },
        ],
      },
      {
        title: '文本对话',
        links: [
          { title: '对话补全', href: '/docs/zh-CN/text-chat/chat-completions' },
        ],
      },
      {
        title: '图像生成',
        links: [
          { title: 'OpenAI 图像生成', href: '/docs/zh-CN/image-generation/image-openai' },
          { title: 'Gemini 图像生成', href: '/docs/zh-CN/image-generation/image-gemini' },
          { title: 'Qwen & Wan 图像生成', href: '/docs/zh-CN/image-generation/image-qwen' },
          { title: '豆包 Seedream 图像生成', href: '/docs/zh-CN/image-generation/image-doubao' },
        ],
      },
      {
        title: '视频生成',
        links: [
          { title: 'Sora 视频生成', href: '/docs/zh-CN/video-generation/video-sora' },
          { title: 'Vidu 视频生成', href: '/docs/zh-CN/video-generation/video-vidu' },
          { title: 'Kling 视频生成', href: '/docs/zh-CN/video-generation/video-kling' },
          { title: 'MiniMax 海螺视频生成', href: '/docs/zh-CN/video-generation/video-minimax' },
          { title: 'Jimeng 视频生成', href: '/docs/zh-CN/video-generation/video-jimeng' },
          { title: 'Wan 视频生成', href: '/docs/zh-CN/video-generation/video-wan' },
        ],
      },
      {
        title: 'Embedding & Rerank',
        links: [
          { title: 'Embedding & Rerank', href: '/docs/zh-CN/embedding-rerank/embedding-rerank' },
        ],
      },
      {
        title: '客户端工具',
        links: [
          { title: 'Cherry Studio 配置', href: '/docs/zh-CN/client-tools/cherry-studio' },
        ],
      },
    ],
  },
]

export function getSpaceBySlug(slug: string): Space | undefined {
  return spaces.find((space) => space.slug === slug)
}

export function getSpaceFromPathname(pathname: string): Space | undefined {
  const slug = pathname.split('/')[1]
  return getSpaceBySlug(slug)
}

export function getNavigationForPathname(pathname: string): NavGroup[] {
  const space = getSpaceFromPathname(pathname)
  return space?.navigation ?? []
}
