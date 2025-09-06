import React, { useState } from 'react';
import ConnectWallet from './ConnectWallet';
import LogoSemFundo from "../assets/logo/logo-sa-s-fundo.png";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <nav className="bg-blue-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="bg-white p-2 rounded">
          <img src={LogoSemFundo} alt="Logo" className="h-10" />
        </div>
        <div className="ml-4">
          <span className="text-xl font-bold">Fantoken MSA</span>
        </div>
      </div>
      <div>
        <ConnectWallet
          onConnect={setWalletAddress}
          address={walletAddress}
          buttonStyle="px-4 py-1 text-sm"
        />
      </div>
    </nav>
  );
};

export default Navbar;