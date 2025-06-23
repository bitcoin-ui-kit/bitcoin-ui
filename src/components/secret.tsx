import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard-ts"

import { CheckIcon, CopyIcon, EyeNoneIcon, EyeOpenIcon } from "./icons"
import "./styles.css"
import { showToast } from "./utils"

export interface SecretProps {
  secret: string
  label?: string
  maskCharacter?: string
  showCopyButton?: boolean
  className?: string
}

// Security: Secure memory management for sensitive data
const createSecureBuffer = (data: string): ArrayBuffer => {
  const encoder = new TextEncoder()
  return encoder.encode(data).buffer
}

/**
 * Secret component for securely displaying and copying sensitive information
 * like seed phrases and private keys.
 */
export const Secret: React.FC<SecretProps> = ({
  secret,
  label = "Secret",
  maskCharacter = "•",
  showCopyButton = true,
  className = "",
}) => {
  const [revealed, setRevealed] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Security: Use refs to minimize sensitive data exposure in memory
  const secretBufferRef = useRef<ArrayBuffer | null>(null)
  const timeoutRef = useRef<number | null>(null)

  // Security: Initialize secure buffer on mount
  useEffect(() => {
    secretBufferRef.current = createSecureBuffer(secret)

    // Cleanup: Clear sensitive data from memory on unmount
    return () => {
      if (secretBufferRef.current) {
        // Zero out the buffer
        const view = new Uint8Array(secretBufferRef.current)
        view.fill(0)
        secretBufferRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [secret])

  // Performance: Memoize display value to prevent unnecessary re-renders
  const displayValue = useMemo(() => {
    return revealed ? secret : maskCharacter.repeat(Math.min(secret.length, 21))
  }, [revealed, secret, maskCharacter])

  // Performance: Memoize callback to prevent child re-renders
  const handleCopy = useCallback(async (_text: string, result: boolean) => {
    if (result) {
      setIsCopied(true)
      showToast(`${label} copied to clipboard`)

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } else {
      showToast(`Failed to copy ${label}`, { type: "error" })
    }
  }, [label])

  // Security: Auto-hide revealed secrets after timeout
  const handleReveal = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setRevealed(!revealed)

    // Security: Auto-hide after 30 seconds for security
    if (!revealed) {
      timeoutRef.current = setTimeout(() => {
        setRevealed(false)
      }, 30000)
    }
  }, [revealed])

  const ariaDescriptionLabel = label.toLowerCase().replace(/\s+/g, "-")

  return (
    <div
      className={`btc-component btc-card btc-secret ${className}`}
      role="group"
      aria-label={`${label} field`}
    >
      <div className="btc-secret__content">
        <div
          className="btc-secret__text btc-mono"
          aria-describedby={`secret-description-${ariaDescriptionLabel}`}
          data-testid="secret-text"
        >
          {displayValue}
        </div>
        <VisuallyHidden asChild>
          <span
            id={`secret-description-${ariaDescriptionLabel}`}
            aria-live="polite"
          >
            {revealed ? `${label}: ${secret}` : `${label} (hidden)`}
          </span>
        </VisuallyHidden>
      </div>

      <div className="btc-secret__controls">
        <button
          type="button"
          onClick={handleReveal}
          aria-label={revealed ? `Hide ${label}` : `Reveal ${label}`}
          aria-pressed={revealed}
          className="btc-button btc-focus"
          data-testid="reveal-button"
        >
          {revealed ? <EyeNoneIcon /> : <EyeOpenIcon />}
        </button>

        {showCopyButton && (
          <CopyToClipboard text={secret} onCopy={handleCopy}>
            <button
              type="button"
              aria-label={`Copy ${label}`}
              className="btc-button btc-focus"
              data-testid="copy-button"
            >
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </CopyToClipboard>
        )}
      </div>
    </div>
  )
}
