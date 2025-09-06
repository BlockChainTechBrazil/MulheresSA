import React from 'react';

const Bank = () => {
  return (
    <section className="bg-gradient-to-r from-purple-300 to-blue-300 py-8 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Saldo do Cofre Solidário</h2>
        <p className="text-4xl font-bold text-blue-500 mb-4">0.453 ETH</p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Atualizar saldo</button>
        <p className="text-gray-600 mt-4">
          Este é o saldo total disponível no cofre atual para doações às crianças. Transparência garantida via blockchain.
        </p>
      </div>
    </section>
  );
};

export default Bank;
