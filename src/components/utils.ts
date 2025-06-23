// === Clipboard Utilities ===
export async function pasteFromClipboard(): Promise<string> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText()
    }
    return ""
  } catch {
    return ""
  }
}

// === Text Truncation ===
export const truncateText = (
  text: string,
  startChars: number = 6,
  endChars: number = 6,
): string => {
  if (text.length <= startChars + endChars + 3) {
    return text
  }
  return `${text.slice(0, startChars)}...${text.slice(-endChars)}`
}

// For backward compatibility
export const truncateBtcAddress = (address: string): string => {
  return truncateText(address, 6, 6)
}

// === Currency Validation ===
export type Currency = "USD" | "EUR" | "BTC"
export type Locale = "US" | "EU"

/**
 * Validates if the input represents a valid amount for the given currency.
 *
 * @param value - The input string to validate
 * @param currency - The currency type
 * @returns boolean indicating if the value is valid
 */
export function isValidAmount(value: string, currency: Currency): boolean {
  if (value === "") {
    return true
  }

  // Remove formatting characters based on currency
  let cleanValue = value
  if (currency === "EUR") {
    // EU format: 1.234,56 (dots for thousands, comma for decimal)
    cleanValue = value.replace(/\./g, "") // Remove thousand separators
    cleanValue = cleanValue.replace(",", ".") // Convert decimal separator
  } else {
    // US format: 1,234.56 (commas for thousands, dot for decimal)
    cleanValue = value.replace(/,/g, "") // Remove thousand separators
  }

  if (currency === "BTC") {
    // Bitcoin: up to 8 decimal places
    return /^\d+(?:\.\d{0,8})?$/.test(cleanValue)
  } else {
    // Fiat currencies: up to 2 decimal places
    return /^\d+(?:\.\d{0,2})?$/.test(cleanValue)
  }
}

/**
 * Formats a number string according to locale conventions
 */
export function formatCurrencyValue(value: string, locale: Locale): string {
  if (value === "") {
    return ""
  }

  const thousandSeparator = locale === "EU" ? "." : ","
  const decimalSeparator = locale === "EU" ? "," : "."

  // Split into integer and decimal parts (assume input uses dot as decimal)
  const parts = value.split(".")
  const intPart = parts[0] || ""
  const decPart = parts[1]

  // Add thousand separators to integer part
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)

  // Combine with decimal part if it exists
  return decPart !== undefined
    ? `${formattedInt}${decimalSeparator}${decPart}`
    : formattedInt
}

// === Toast Notifications ===
let toastCounter = 0

export interface ToastOptions {
  type?: "success" | "error" | "info"
  duration?: number
  sanitize?: boolean
}

// Security: HTML sanitization for toast messages
const sanitizeHtml = (str: string): string => {
  return str.replace(/[<>]/g, "")
}

export function showToast(message: string, options: ToastOptions = {}): void {
  const { type = "success", duration = 3000, sanitize = true } = options

  // Security: Validate message length
  const MAX_TOAST_MESSAGE_LENGTH = 200
  if (message.length > MAX_TOAST_MESSAGE_LENGTH) {
    message = message.substring(0, MAX_TOAST_MESSAGE_LENGTH) + "..."
  }

  // Security: Sanitize message content
  const safeMessage = sanitize ? sanitizeHtml(message) : message

  // Create toast element
  const toast = document.createElement("div")
  toast.className = `btc-toast ${type === "error" ? "btc-toast--error" : ""}`
  toast.textContent = safeMessage
  toast.id = `btc-toast-${toastCounter++}`

  // Security: Prevent toast spam
  const existingToasts = document.querySelectorAll(".btc-toast")
  if (existingToasts.length >= 5) {
    existingToasts[0]?.remove()
  }

  // Add to DOM
  document.body.appendChild(toast)

  // Remove after duration
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = "btc-toast-slide-out 0.3s ease"
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast)
        }
      }, 300)
    }
  }, duration)
}

// === Class Name Utilities ===
export type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) {
      continue
    }

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const result = clsx(...input)
      if (result) {
        classes.push(result)
      }
    }
  }

  return classes.join(" ")
}

export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs)
}
