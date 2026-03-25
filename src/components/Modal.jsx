export default function Modal({ isOpen, onClose, title, message, type = 'info' }) {
  if (!isOpen) return null;

  const icons = {
    info: (
      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    success: (
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    warning: (
      <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    ),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone */}
        {icons[type]}

        {/* Título */}
        {title && (
          <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        )}

        {/* Mensagem */}
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

        {/* Botão */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          OK
        </button>
      </div>
    </div>
  );
}
