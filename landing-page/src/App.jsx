import { useState } from 'react'
import './components/Navbar.jsx';
import Header from './components/Navbar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header></Header>
    </>
  )
}

export default App
