import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Header from './components/Navbar';
import Footer from './components/Footer';
import Section from './components/Section';
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Section></Section>
      <Footer />
    </>
  );
}

export default App;
