// Componente de seção destacada com imagem e texto alternados
export default function HighlightSection({ image, alt, title, text, reverse }) {
  return (
    <section className={`w-full py-16 bg-white ${reverse ? 'bg-gray-50' : ''}`}>
      <div className={`max-w-7xl mx-auto flex flex-col md:flex-row items-center ${reverse ? 'md:flex-row-reverse' : ''} px-4 gap-8`}>
        <div className="md:w-1/2 w-full flex justify-center">
          <img src={image} alt={alt} className="rounded-xl shadow-lg max-h-80 object-cover w-full md:w-auto" />
        </div>
        <div className="md:w-1/2 w-full mt-8 md:mt-0">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r text-blue-800  bg-clip-text">
            {title}
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">{text}</p>
        </div>
      </div>
    </section>
  );
}
