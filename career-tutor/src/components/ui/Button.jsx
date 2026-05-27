export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-6 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:-translate-y-0.5',
    ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}