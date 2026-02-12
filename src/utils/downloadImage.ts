import html2canvas from 'html2canvas'

export interface DownloadOptions {
  filename?: string
  scale?: number
  backgroundColor?: string
}

/**
 * 将指定 DOM 节点导出为 PNG 并触发下载
 */
export async function downloadElementAsImage(
  element: HTMLElement,
  options: DownloadOptions = {}
): Promise<void> {
  const { filename = 'image.png', scale = 2, backgroundColor = '#ffffff' } = options
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor,
    logging: false,
    imageTimeout: 0,
  })
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 生成带时间戳的文件名
 */
export function receiptFilename(prefix: string): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  return `${prefix}_${date}_${time}.png`
}
