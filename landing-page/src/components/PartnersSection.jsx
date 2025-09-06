import React from 'react';

const PartnersSection = ({ partners }) => {
  return (
    <section className="bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Parceiros</h1>
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 px-4 md:px-8">
        {partners.map((partner, index) => (
          <div key={index} className="text-center">
            <img src={partner.image} alt={partner.name} className="mx-auto mb-4 w-32 h-32 object-contain" />
            <p className="text-sm font-semibold">{partner.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnersSection;
