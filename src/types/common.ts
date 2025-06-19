import { type ReactNode } from 'react'

/**
 * Base props that all components should accept
 */
export interface BaseComponentProps {
  /** Custom CSS class name */
  className?: string | undefined
  /** Custom inline styles */
  style?: React.CSSProperties
  /** Children elements */
  children?: ReactNode
  /** Test ID for testing purposes */
  'data-testid'?: string
}

/**
 * Common size variants
 */
export type Size = 'sm' | 'md' | 'lg'

/**
 * Common color variants
 */
export type Variant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'

/**
 * Loading state
 */
export interface LoadingState {
  /** Whether the component is in a loading state */
  loading?: boolean
  /** Loading text for screen readers */
  loadingText?: string
}
