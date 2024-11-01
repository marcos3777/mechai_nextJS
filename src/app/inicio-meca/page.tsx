// pages/inicio-meca.tsx

"use client";

import Link from 'next/link';

export default function InicioMeca() {
  // Dados provisórios; serão substituídos pelos dados do backend ao integrar a API.
  const exampleOrders = [
    {
      id: 1,
      cliente: "Leonardo",
      modelo: "Modelo A",
      tipo: "Tipo 1",
      descricao: "Descrição detalhada do serviço solicitado pelo cliente",
      valor: "R$ 200,00",
      dataPrevista: "10/11/2024",
      foto: "/path/to/foto1.jpg", // Substituir com a URL da imagem do cliente
    },
    {
      id: 2,
      cliente: "Marcos",
      modelo: "Modelo B",
      tipo: "Tipo 2",
      descricao: "Descrição detalhada do serviço solicitado pelo cliente",
      valor: "R$ 150,00",
      dataPrevista: "11/11/2024",
      foto: "/path/to/foto2.jpg", // Substituir com a URL da imagem do cliente
    },
    {
      id: 3,
      cliente: "Carla",
      modelo: "Modelo C",
      tipo: "Tipo 3",
      descricao: "Descrição detalhada do serviço solicitado pelo cliente",
      valor: "R$ 300,00",
      dataPrevista: "12/11/2024",
      foto: "/path/to/foto3.jpg", // Substituir com a URL da imagem do cliente
    },
  ];

  return (
    <div className="flex h-screen flex-col md:flex-row bg-gray-100 p-4 space-y-4 md:space-y-0 md:space-x-4">
      {/* Coluna da esquerda: Lista de Pedidos */}
      <div className="flex-1 bg-gray-900 p-4 rounded-lg overflow-y-auto">
        {exampleOrders.map((order) => (
          <div key={order.id} className="bg-gray-800 text-white p-6 rounded-lg mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out">
            <div className="flex items-center justify-center mb-4">
              <img
                src={order.foto}
                alt={`Foto de ${order.cliente}`}
                className="w-16 h-16 rounded-full border-2 border-blue-500"
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">{order.cliente}</h3>
              <p className="text-gray-400">Modelo: <span className="text-white font-medium">{order.modelo}</span></p>
              <p className="text-gray-400">Tipo: <span className="text-white font-medium">{order.tipo}</span></p>
              <p className="text-gray-400">Descrição:</p>
              <p className="text-white text-sm px-4">{order.descricao}</p>
              <p className="text-gray-400">Valor: <span className="text-white font-medium">{order.valor}</span></p>
              <p className="text-gray-400">Data Prevista: <span className="text-white font-medium">{order.dataPrevista}</span></p>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <button className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors">Aceitar</button>
              <button className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition-colors">Recusar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Coluna da direita: Detalhes do Pedido Atual */}
      <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">Pedido Selecionado</h2>
        <div className="bg-gray-700 p-6 rounded-lg text-white shadow-lg text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            <img
              src={exampleOrders[0].foto}
              alt={`Foto de ${exampleOrders[0].cliente}`}
              className="w-20 h-20 rounded-full border-2 border-blue-500"
            />
          </div>
          <h3 className="text-2xl font-bold">{exampleOrders[0].cliente}</h3> {/* Dados provisórios */}
          <p className="text-gray-400">Modelo: <span className="text-white font-medium">{exampleOrders[0].modelo}</span></p>
          <p className="text-gray-400">Tipo: <span className="text-white font-medium">{exampleOrders[0].tipo}</span></p>
          <p className="text-gray-400">Descrição:</p>
          <p className="text-white text-sm px-4">{exampleOrders[0].descricao}</p> {/* Substituir por dados da API */}
          <p className="text-gray-400">Valor: <span className="text-white font-medium">{exampleOrders[0].valor}</span></p> {/* Substituir por dados da API */}
          <p className="text-gray-400">Data Prevista: <span className="text-white font-medium">{exampleOrders[0].dataPrevista}</span></p> {/* Substituir por dados da API */}
          <button className="bg-green-500 text-white py-2 px-8 mt-6 rounded hover:bg-green-600 transition-colors">Finalizar</button>
        </div>
      </div>
    </div>
  );
}
