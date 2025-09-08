import FantokenHero from "/fantoken.png";
import MulherHero from "/mulher.png";

const Section = () => {
  return (
    <section className="text-center">
      <div className="relative w-full overflow-hidden h-56 sm:h-80 md:h-96 lg:h-[900px]">
        {/* background faded image */}
        <img
          src={MulherHero}
          alt="Hero Mulher"
          className="w-full h-full object-cover opacity-40"
          aria-hidden
        />

        {/* foreground Fantoken - made more prominent */}
        <img
          src={FantokenHero}
          alt="Hero Fantoken"
          className="w-full h-full absolute inset-0 z-20 object-cover opacity-100 filter saturate-125 drop-shadow-xl pointer-events-none"
        />
      </div>
    </section>
  );
};

export default Section;
