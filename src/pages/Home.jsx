import Section from '../components/Hero';
import Goals from '../components/Goals';
// ...existing code...
import PartnersSection from '../components/PartnersSection';
import ProjectsSection from '../components/ProjectsSection';
import HighlightSection from '../components/HighlightSection';

import Parceiro1 from "../assets/img/parceiros/parceiro1.png";
import Parceiro2 from "../assets/img/parceiros/parceiro2.png";
import Parceiro3 from "../assets/img/parceiros/parceiro3.png";
import Parceiro4 from "../assets/img/parceiros/parceiro4.png";
import Parceiro5 from "../assets/img/parceiros/parceiro5.png";
import BTB from "../assets/img/parceiros/btb.png";


const partnersData = [
  { name: "Parceiro 1", image: Parceiro1 },
  { name: "Parceiro 2", image: Parceiro2 },
  { name: "Parceiro 3", image: Parceiro3 },
  { name: "Parceiro 4", image: Parceiro4 },
  { name: "Parceiro 5", image: Parceiro5 },
  { name: "BTB", image: BTB },
];

export default function Home() {
  return (
    <>
      <Section />
      <Goals />
      <HighlightSection
        image={'/mulher.png'}
        alt="Mulheres trabalhando em equipe"
        title="Empoderamento Feminino no Mercado de Trabalho"
        text="Mulheres estão cada vez mais presentes em áreas estratégicas, liderando projetos inovadores e transformando o ambiente corporativo. O incentivo à diversidade e à inclusão é fundamental para o crescimento sustentável das empresas e da sociedade."
      />
      <HighlightSection
        image={'/mulheres.jpg'}
        alt="Mulheres em ambiente de tecnologia"
        title="Apoio às Mulheres Artesãs"
        text="O projeto MulheresSA vai transformar a vida de artesãs brasileiras, oferecendo acesso a recursos, capacitação e oportunidades de mercado. Com sua doação, você contribui diretamente para o empoderamento econômico dessas mulheres, promovendo inclusão, geração de renda e valorização da cultura local."
        reverse
      />
      <ProjectsSection />
      <PartnersSection partners={partnersData}></PartnersSection>
  {/* Componente Bank removido */}
    </>
  );
}
