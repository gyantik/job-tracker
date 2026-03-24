const ToastStack = ({ toasts, onDismiss }) => {
  if (!toasts.length) {
    return null
  }

  return (
    <section className="toast-stack" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <article key={toast.id} className={`toast toast-${toast.type}`} role="status">
          <p>{toast.message}</p>
          <button
            type="button"
            className="toast-dismiss"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            x
          </button>
        </article>
      ))}
    </section>
  )
}

export default ToastStack
