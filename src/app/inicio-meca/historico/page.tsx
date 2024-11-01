// pages/inicio-meca/historico.tsx

"use client";

import { useState } from 'react';

export default function HistoricoPage() {
  // Dados de exemplo, serão substituídos por dados da API
  const [historicoData] = useState([
    { tipo: "Reparo", data: "04/03/24", ganhos: "R$ 50,00" },
    { tipo: "Reparo", data: "01/09/23", ganhos: "R$ 500,00" },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Pesquisa de Atendimentos</h1>

      {/* Campo de pesquisa por semana */}
      <div className="max-w-4xl mx-auto mb-10 bg-white shadow-lg rounded-lg p-6">
        <label className="text-gray-600 text-xl font-semibold block mb-3">Pesquisar por semana:</label>
        <input
          type="text"
          placeholder="1 Mar, 2024 - Mar 8, 2024"
          className="w-full border border-gray-300 rounded-md p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabela de atendimentos com melhor espaçamento e estilo */}
      <div className="max-w-6xl mx-auto overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-4 text-lg font-semibold border-b-2">Tipo</th>
              <th className="p-4 text-lg font-semibold border-b-2">Data</th>
              <th className="p-4 text-lg font-semibold border-b-2">Ganhos</th>
            </tr>
          </thead>
          <tbody>
            {historicoData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100 transition-colors">
                <td className="p-4 text-gray-800 border-b">{item.tipo}</td>
                <td className="p-4 text-gray-800 border-b">{item.data}</td>
                <td className="p-4 text-gray-800 border-b">{item.ganhos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
