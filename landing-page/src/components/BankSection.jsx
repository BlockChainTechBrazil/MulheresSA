import React from 'react';

const BankSection = () => {
  return (
    <section className="bg-white py-8 flex justify-center items-center">
      <div className="rounded-lg shadow-lg p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Saldo do Cofre Solidário</h2>
        <p className="text-4xl font-bold text-[#193CB8] mb-4">0.453 ETH</p>
        <button className="bg-[#193CB8] text-white py-2 px-4 rounded-lg hover:bg-[#193CB8]">Atualizar saldo</button>
        <p className="text-gray-600 mt-4">
          Este é o saldo total disponível no cofre atual para doações às crianças. Transparência garantida via blockchain.
        </p>
      </div>
    </section>
  );
};

export default BankSection;
