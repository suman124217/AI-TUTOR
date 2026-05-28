export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-6 py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 hover:-translate-y-1 hover:shadow-xl',
    secondary: 'bg-white/60 backdrop-blur-md text-slate-700 border border-white/80 hover:bg-white/90 hover:shadow-md hover:-translate-y-1 shadow-sm',
    ghost: 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 backdrop-blur-sm hover:-translate-y-0.5',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}