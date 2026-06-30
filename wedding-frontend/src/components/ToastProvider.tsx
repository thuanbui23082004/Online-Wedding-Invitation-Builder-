import React, { createContext, useContext, useState, useCallback } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
}

interface ConfirmOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)
const ConfirmContext = createContext<((options: ConfirmOptions) => Promise<boolean>) | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return {
    success: (msg: string) => context.addToast(msg, 'success'),
    error: (msg: string) => context.addToast(msg, 'error'),
    warning: (msg: string) => context.addToast(msg, 'warning'),
    info: (msg: string) => context.addToast(msg, 'info'),
  }
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within ToastProvider')
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    options: ConfirmOptions
    resolve?: (value: boolean) => void
  }>({
    isOpen: false,
    options: {},
  })

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const handleConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      })
    })
  }, [])

  const handleConfirmYes = () => {
    confirmState.resolve?.(true)
    setConfirmState({ isOpen: false, options: {} })
  }

  const handleConfirmNo = () => {
    confirmState.resolve?.(false)
    setConfirmState({ isOpen: false, options: {} })
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      <ConfirmContext.Provider value={handleConfirm}>
        {children}

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-lg text-white shadow-lg animate-fade-in ${
                toast.type === 'success'
                  ? 'bg-green-500'
                  : toast.type === 'error'
                    ? 'bg-red-500'
                    : toast.type === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>

        {/* Confirm Dialog */}
        {confirmState.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h2 className="text-lg font-bold mb-2">{confirmState.options.title}</h2>
              {confirmState.options.description && (
                <p className="text-gray-600 mb-6">{confirmState.options.description}</p>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleConfirmNo}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  {confirmState.options.cancelText || 'Hủy'}
                </button>
                <button
                  onClick={handleConfirmYes}
                  className={`px-4 py-2 rounded-lg text-white ${
                    confirmState.options.danger ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {confirmState.options.confirmText || 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        )}
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  )
}
