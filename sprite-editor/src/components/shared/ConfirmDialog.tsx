import { useEffect, useRef, useCallback } from 'react'
import * as s from './confirmdialog.s'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const confirmRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement
      // Delay focus to allow render
      const timer = setTimeout(() => confirmRef.current?.focus(), 0)
      return () => clearTimeout(timer)
    } else if (previousFocusRef.current instanceof HTMLElement) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    },
    [onCancel],
  )

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onCancel()
      }
    },
    [onCancel],
  )

  if (!open) return null

  return (
    <s.Overlay onClick={handleOverlayClick} onKeyDown={handleKeyDown} role="dialog" aria-modal="true" aria-label={title}>
      <s.Dialog>
        <s.Title>{title}</s.Title>
        <s.Message>{message}</s.Message>
        <s.Actions>
          <s.CancelButton onClick={onCancel}>{cancelLabel}</s.CancelButton>
          <s.ConfirmButton ref={confirmRef} onClick={onConfirm} $variant={variant}>
            {confirmLabel}
          </s.ConfirmButton>
        </s.Actions>
      </s.Dialog>
    </s.Overlay>
  )
}

export default ConfirmDialog
