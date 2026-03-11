#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

/**
 * 下载 markdown 文件中的外链图片并替换引用
 * 
 * 使用方法:
 * node scripts/download-images.js <markdown-file-path>
 * 
 * 例如:
 * node scripts/download-images.js src/app/docs/zh-CN/client-tools/openclaw/page.mdx
 */

// 从命令行获取文件路径
const markdownFilePath = process.argv[2];

if (!markdownFilePath) {
  console.error('❌ 请提供 markdown 文件路径');
  console.log('使用方法: node scripts/download-images.js <markdown-file-path>');
  process.exit(1);
}

// 检查文件是否存在
if (!fs.existsSync(markdownFilePath)) {
  console.error(`❌ 文件不存在: ${markdownFilePath}`);
  process.exit(1);
}

// 图片保存目录
const imageDir = path.join(process.cwd(), 'public/images');

// 确保图片目录存在
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// 读取 markdown 文件
const content = fs.readFileSync(markdownFilePath, 'utf-8');

// 匹配图片链接的正则表达式
// 支持 ![alt](url) 和 <img src="url" /> 格式
const imageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)|<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/g;

// 下载图片函数
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 处理重定向
        downloadImage(response.headers.location).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`下载失败: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        // 根据 URL 或内容生成文件名
        const hash = crypto.createHash('md5').update(buffer).digest('hex');
        const ext = path.extname(new URL(url).pathname) || '.png';
        const filename = `${hash}${ext}`;
        
        resolve({ buffer, filename });
      });
    }).on('error', reject);
  });
}

// 主函数
async function processMarkdown() {
  console.log(`📄 处理文件: ${markdownFilePath}\n`);
  
  let newContent = content;
  const matches = [...content.matchAll(imageRegex)];
  
  if (matches.length === 0) {
    console.log('✅ 没有找到外链图片');
    return;
  }
  
  console.log(`🔍 找到 ${matches.length} 个图片链接\n`);
  
  for (const match of matches) {
    const fullMatch = match[0];
    const alt = match[1] || '';
    const url = match[2] || match[3];
    
    // 跳过已经是本地路径的图片
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.log(`⏭️  跳过本地图片: ${url}`);
      continue;
    }
    
    console.log(`📥 下载: ${url}`);
    
    try {
      const { buffer, filename } = await downloadImage(url);
      const filePath = path.join(imageDir, filename);
      
      // 保存图片
      fs.writeFileSync(filePath, buffer);
      console.log(`✅ 保存为: /images/${filename}\n`);
      
      // 替换 markdown 中的引用
      const localPath = `/images/${filename}`;
      
      if (fullMatch.startsWith('!')) {
        // Markdown 格式: ![alt](url)
        const replacement = `![${alt}](${localPath})`;
        newContent = newContent.replace(fullMatch, replacement);
      } else {
        // HTML img 标签格式
        const replacement = fullMatch.replace(url, localPath);
        newContent = newContent.replace(fullMatch, replacement);
      }
      
    } catch (error) {
      console.error(`❌ 下载失败: ${url}`);
      console.error(`   错误: ${error.message}\n`);
    }
  }
  
  // 写回文件
  fs.writeFileSync(markdownFilePath, newContent, 'utf-8');
  console.log(`\n✅ 完成！已更新文件: ${markdownFilePath}`);
}

// 执行
processMarkdown().catch((error) => {
  console.error('❌ 处理失败:', error);
  process.exit(1);
});
