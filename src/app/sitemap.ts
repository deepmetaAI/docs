import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://docs.omnimaas.com'
  
  const routes = [
    '/docs/zh-CN',
    '/docs/zh-CN/sdk-integration/sdk-openai',
    '/docs/zh-CN/sdk-integration/sdk-anthropic',
    '/docs/zh-CN/sdk-integration/sdk-google',
    '/docs/zh-CN/text-chat/chat-completions',
    '/docs/zh-CN/image-generation/image-openai',
    '/docs/zh-CN/image-generation/image-qwen',
    '/docs/zh-CN/video-generation/video-sora',
    '/docs/zh-CN/video-generation/video-vidu',
    '/docs/zh-CN/video-generation/video-kling',
    '/docs/zh-CN/video-generation/video-jimeng',
    '/docs/zh-CN/video-generation/video-wan',
    '/docs/zh-CN/client-tools/cherry-studio',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '/docs/zh-CN' ? 1 : 0.8,
  }))
}
