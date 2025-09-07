import Header from '../components/Navbar';
import Footer from '../components/Footer';
import Section from '../components/Hero';
import Goals from '../components/Goals';
import Bank from '../components/Bank';
import PartnersSection from '../components/PartnersSection';

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
      <PartnersSection partners={partnersData}></PartnersSection>
      <Bank />
    </>
  );
}
