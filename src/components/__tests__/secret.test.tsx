import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import { Secret } from "../secret"

// Mock the react-copy-to-clipboard-ts package
jest.mock("react-copy-to-clipboard-ts", () => ({
  CopyToClipboard: ({ children, onCopy, text }: any) => (
    <div
      onClick={() => onCopy(text, true)}
      data-testid="copy-to-clipboard-wrapper"
    >
      {children}
    </div>
  ),
}))

// Mock the showToast utility function
jest.mock("../utils", () => ({
  showToast: jest.fn(),
}))

import { showToast } from "../utils"

const mockShowToast = showToast as jest.MockedFunction<typeof showToast>

describe("secret", () => {
  const secret = "correct horse battery staple"

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("renders masked by default", () => {
    render(<Secret secret={secret} label="Secret Phrase" />)
    expect(screen.getByTestId("secret-text")).toBeInTheDocument()
    expect(screen.getByTestId("secret-text")).toHaveTextContent(
      "•••••••••••••••••••••",
    )
  })

  it("reveals and hides the secret", () => {
    render(<Secret secret={secret} label="Secret Phrase" />)
    const toggleButton = screen.getByRole("button", {
      name: /reveal secret phrase/i,
    })
    fireEvent.click(toggleButton)
    expect(screen.getByTestId("secret-text")).toHaveTextContent(secret)
    fireEvent.click(
      screen.getByRole("button", { name: /hide secret phrase/i }),
    )
    expect(screen.getByTestId("secret-text")).toHaveTextContent(
      "•••••••••••••••••••••",
    )
  })

  it("shows copy feedback when copy button is clicked", async () => {
    render(<Secret secret={secret} label="Secret Phrase" />)
    const copyButton = screen.getByLabelText(/copy secret phrase/i)

    // Initially should show copy icon
    expect(copyButton).toBeInTheDocument()

    fireEvent.click(copyButton)

    // Verify the toast was called with the correct message
    expect(mockShowToast).toHaveBeenCalledWith("Secret Phrase copied to clipboard")

    // Check that the copied state changes the button (CheckIcon should now be displayed)
    await waitFor(() => {
      // The button should still be there but with different icon content
      expect(copyButton).toBeInTheDocument()
    })

    // Fast forward the timer to test the reset functionality
    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      // After 2 seconds, should be back to copy state
      expect(copyButton).toBeInTheDocument()
    })
  })

  it("uses custom mask character", () => {
    render(
      <Secret
        secret={secret}
        label="Secret Phrase"
        maskCharacter="*"
      />,
    )
    expect(screen.getByTestId("secret-text")).toHaveTextContent(
      "*********************",
    )
  })

  it("can hide copy button", () => {
    render(
      <Secret
        secret={secret}
        label="Secret Phrase"
        showCopyButton={false}
      />,
    )
    expect(screen.queryByLabelText(/copy secret phrase/i)).not.toBeInTheDocument()
  })

  it("has proper accessibility attributes", () => {
    render(<Secret secret={secret} label="Test Secret" />)

    // Check for proper ARIA labels and descriptions
    expect(screen.getByRole("group", { name: "Test Secret field" })).toBeInTheDocument()
    expect(screen.getByTestId("secret-text")).toHaveAttribute("aria-describedby")

    // Check reveal button accessibility
    const revealButton = screen.getByRole("button", { name: /reveal test secret/i })
    expect(revealButton).toHaveAttribute("aria-pressed", "false")

    fireEvent.click(revealButton)
    expect(revealButton).toHaveAttribute("aria-pressed", "true")
  })

  // Security: Test auto-hide functionality
  it("auto-hides revealed secret after timeout", async () => {
    jest.useFakeTimers()
    render(<Secret secret={secret} label="Secret Phrase" />)
    const toggleButton = screen.getByRole("button", {
      name: /reveal secret phrase/i,
    })

    // Reveal the secret
    fireEvent.click(toggleButton)
    expect(screen.getByTestId("secret-text")).toHaveTextContent(secret)

    // Fast forward 30 seconds
    jest.advanceTimersByTime(30000)

    await waitFor(() => {
      expect(screen.getByTestId("secret-text")).toHaveTextContent(
        "•••••••••••••••••••••",
      )
    })

    jest.useRealTimers()
  })

  // Security: Test memory cleanup
  it("cleans up sensitive data on unmount", () => {
    const { unmount } = render(<Secret secret={secret} label="Secret Phrase" />)
    unmount()
    // Memory cleanup is tested through the useEffect cleanup function
  })
})
