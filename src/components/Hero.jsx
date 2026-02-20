import LogoOriginal from "/logo-original.png";

const Section = () => {
  return (
    <section className="text-center">
      <div className="relative w-full overflow-hidden h-64 sm:h-72 md:h-80 lg:h-96 flex items-center justify-center bg-white">
        <img
          src={LogoOriginal}
          alt="Logo B2Black"
          className="max-w-full sm:max-w-xl md:max-w-2xl max-h-full object-contain p-4 px-6 sm:px-4"
        />
      </div>
    </section>
  );
};

export default Section;
