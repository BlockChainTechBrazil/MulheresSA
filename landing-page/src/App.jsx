import { useState } from 'react';
import Header from './components/Navbar';
import Footer from './components/Footer';
import Section from './components/Hero';
import Goals from './components/Goals';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Section />
      <Goals />
      <Footer />
    </>
  );
}

export default App;
