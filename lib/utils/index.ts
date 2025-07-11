import { clsx, type ClassValue } from 'clsx'
 
 

export function formatNumber(num: number, decimals = 2): string {
 return new Intl.NumberFormat('en-US', {
 minimumFractionDigits: decimals,
 maximumFractionDigits: decimals,
 }).format(num)
}

export function formatCurrency(amount: number, currency = 'USD'): string {
 return new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency,
 }).format(amount)
}

export function formatPercentage(value: number, decimals = 1): string {
 return `${value.toFixed(decimals)}%`
}

export function debounce<T extends (...args: any[]) => any>(
 func: T,
 wait: number
): (...args: Parameters<T>) => void {
 let timeout: NodeJS.Timeout
 return (...args: Parameters<T>) => {
 clearTimeout(timeout)
 timeout = setTimeout(() => func(...args), wait)
 }
}

export function throttle<T extends (...args: any[]) => any>(
 func: T,
 limit: number
): (...args: Parameters<T>) => void {
 let inThrottle: boolean
 return (...args: Parameters<T>) => {
 if (!inThrottle) {
 func(...args)
 inThrottle = true
 setTimeout(() => (inThrottle = false), limit)
 }
 }
}

export function generateId(): string {
 return Math.random().toString(36).substr(2, 9)
}

export function copyToClipboard(text: string): Promise<void> {
 if (navigator.clipboard && window.isSecureContext) {
 return navigator.clipboard.writeText(text)
 } else {
 const textarea = document.createElement('textarea')
 textarea.value = text
 textarea.style.position = 'absolute'
 textarea.style.left = '-999999px'
 document.body.prepend(textarea)
 textarea.select()
 try {
 document.execCommand('copy')
 } finally {
 textarea.remove()
 }
 return Promise.resolve()
 }
}

export function downloadCSV(data: any[], filename: string): void {
 const csv = convertToCSV(data)
 const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
 const link = document.createElement('a')
 
 if (link.download !== undefined) {
 const url = URL.createObjectURL(blob)
 link.setAttribute('href', url)
 link.setAttribute('download', filename)
 link.style.visibility = 'hidden'
 document.body.appendChild(link)
 link.click()
 document.body.removeChild(link)
 }
}

function convertToCSV(data: any[]): string {
 if (data.length === 0) return ''
 
 const headers = Object.keys(data[0])
 const csvRows = [
 headers.join(','),
 ...data.map(row => 
 headers.map(header => JSON.stringify(row[header] ?? '')).join(',')
 )
 ]
 
 return csvRows.join('\n')
}

export function validateEmail(email: string): boolean {
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 return emailRegex.test(email)
}

export function sanitizeInput(input: string): string {
 return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

export function getContrastColor(hexColor: string): string {
 const r = parseInt(hexColor.slice(1, 3), 16)
 const g = parseInt(hexColor.slice(3, 5), 16)
 const b = parseInt(hexColor.slice(5, 7), 16)
 const brightness = (r * 299 + g * 587 + b * 114) / 1000
 return brightness > 128 ? '#000000' : '#FFFFFF'
}

export function interpolateColor(color1: string, color2: string, factor: number): string {
 if (factor <= 0) return color1
 if (factor >= 1) return color2
 
 const hex1 = color1.replace('#', '')
 const hex2 = color2.replace('#', '')
 
 const r1 = parseInt(hex1.substr(0, 2), 16)
 const g1 = parseInt(hex1.substr(2, 2), 16)
 const b1 = parseInt(hex1.substr(4, 2), 16)
 
 const r2 = parseInt(hex2.substr(0, 2), 16)
 const g2 = parseInt(hex2.substr(2, 2), 16)
 const b2 = parseInt(hex2.substr(4, 2), 16)
 
 const r = Math.round(r1 + (r2 - r1) * factor)
 const g = Math.round(g1 + (g2 - g1) * factor)
 const b = Math.round(b1 + (b2 - b1) * factor)
 
 const toHex = (n: number) => n.toString(16).padStart(2, '0')
 
 return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
