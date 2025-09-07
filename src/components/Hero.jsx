import React from 'react';
import FantokenHero from "../assets/img/fantoken-hero.png";

const Section = () => {
  return (
    <section className="bg-gray-100 text-center">
      <img src={FantokenHero} alt="Hero Fantoken" className="w-screen" />
    </section>
  );
};

export default Section;
