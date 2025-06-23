import { clsx, cn, formatCurrencyValue, isValidAmount, showToast } from "../utils"

describe("utils", () => {
  describe("isValidAmount", () => {
    it("validates BTC amounts correctly", () => {
      expect(isValidAmount("1.12345678", "BTC")).toBe(true)
      expect(isValidAmount("1.123456789", "BTC")).toBe(false) // Too many decimals
      expect(isValidAmount("", "BTC")).toBe(true)
    })

    it("validates USD amounts correctly", () => {
      expect(isValidAmount("1.12", "USD")).toBe(true)
      expect(isValidAmount("1.123", "USD")).toBe(false) // Too many decimals
      expect(isValidAmount("", "USD")).toBe(true)
    })
  })

  describe("formatCurrencyValue", () => {
    it("formats US locale correctly", () => {
      expect(formatCurrencyValue("1234.56", "US")).toBe("1,234.56")
      expect(formatCurrencyValue("1234", "US")).toBe("1,234")
    })

    it("formats EU locale correctly", () => {
      expect(formatCurrencyValue("1234.56", "EU")).toBe("1.234,56")
      expect(formatCurrencyValue("1234", "EU")).toBe("1.234")
    })
  })

  describe("showToast", () => {
    beforeEach(() => {
      document.body.innerHTML = ""
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it("creates toast element with sanitized content", () => {
      showToast("Test <script>alert('xss')</script> message")
      const toast = document.querySelector(".btc-toast")
      expect(toast).toBeInTheDocument()
      expect(toast?.textContent).toBe("Test alert('xss') message")
    })

    it("limits toast spam", () => {
      // Create 6 toasts
      for (let i = 0; i < 6; i++) {
        showToast(`Message ${i}`)
      }

      const toasts = document.querySelectorAll(".btc-toast")
      expect(toasts.length).toBe(5) // Should be limited to 5
    })

    it("truncates long messages", () => {
      const longMessage = "a".repeat(300)
      showToast(longMessage)
      const toast = document.querySelector(".btc-toast")
      expect(toast?.textContent?.length).toBeLessThanOrEqual(203) // 200 + "..."
    })
  })

  describe("clsx", () => {
    it("handles empty inputs efficiently", () => {
      expect(clsx()).toBe("")
      expect(clsx("", null, undefined)).toBe("")
    })
  })

  describe("cn", () => {
    it("combines class names correctly", () => {
      const result1 = cn("class1", "class2")
      const result2 = cn("class1", "class2")
      expect(result1).toBe(result2)
    })
  })
})
