import React from 'react';
import TargetImage from "../assets/img/alvo.png";
import Partners from "./Partners";
import Parceiro1 from "../assets/img/parceiros/parceiro1.png";
import Parceiro2 from "../assets/img/parceiros/parceiro2.png";
import Parceiro3 from "../assets/img/parceiros/parceiro3.png";
import Parceiro4 from "../assets/img/parceiros/parceiro4.png";
import Parceiro5 from "../assets/img/parceiros/parceiro5.png";
import BTB from "../assets/img/parceiros/btb.png";

const partnersData = [
    { name: "BTB", image: BTB },
  { name: "Parceiro 1", image: Parceiro1 },
  { name: "Parceiro 2", image: Parceiro2 },
  { name: "Parceiro 3", image: Parceiro3 },
  { name: "Parceiro 4", image: Parceiro4 },
  { name: "Parceiro 5", image: Parceiro5 },
  
];

const Goals = () => {
  return (
    <section className="bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Objetivos e Metas</h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8">
        <div className="border-4 border-[#F9C448] p-4 text-center rounded-lg">
          <h3 className="text-xl font-bold mb-4">Meta 1</h3>
          <img src={TargetImage} alt="Alvo" className="mx-auto mb-4 w-30 h-30" />
          <p className="text-lg">Divulgar a causa das Mulheres Brasileiras para o mundo.</p>
        </div>
        <div className="border-4 border-[#F9C448] p-4 text-center rounded-lg">
          <h3 className="text-xl font-bold mb-4">Meta 2</h3>
          <img src={TargetImage} alt="Alvo" className="mx-auto mb-4 w-30 h-30" />
          <p className="text-lg">Captar funding de R$800.000 para os projetos da OSC.</p>
        </div>
        <div className="border-4 border-[#F9C448] p-4 text-center rounded-lg">
          <h3 className="text-xl font-bold mb-4">Meta 3</h3>
          <img src={TargetImage} alt="Alvo" className="mx-auto mb-4 w-30 h-30" />
          <p className="text-lg">Beneficiar parceiros e sociedade com produtos e serviços.</p>
        </div>
      </div>
      <Partners partners={partnersData} />
    </section>
  );
};

export default Goals;
