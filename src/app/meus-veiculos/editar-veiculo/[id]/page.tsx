// app/meus-veiculos/editar-veiculo/[id]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Carro, Cliente } from '@/types/types';
import Link from 'next/link';

interface EditarVeiculoProps {
  params: {
    id: string;
  };
}

export default function EditarVeiculo({ params }: EditarVeiculoProps) {
  const { id } = params;

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [anoFabricacao, setAnoFabricacao] = useState('');
  const [cor, setCor] = useState('');
  const [client, setClient] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const clientData = localStorage.getItem('clientData');
      if (clientData) {
        try {
          const clientParsed: Cliente = JSON.parse(clientData);
          setClient(clientParsed);
        } catch (error) {
          console.error('Erro ao parsear clientData:', error);
          alert('Dados do cliente inválidos.');
          window.location.href = '/';
          return;
        }
      } else {
        alert('Usuário não autenticado.');
        window.location.href = '/';
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/carros/${id}`);
        if (response.status === 200) {
          const carro: Carro = response.data;
          // Preenche os estados com os dados do veículo
          setMarca(carro.marca);
          setModelo(carro.modelo);
          setPlaca(carro.placa);
          setAnoFabricacao(carro.anoFabricacao);
          setCor(carro.cor);
        } else {
          alert('Veículo não encontrado.');
          window.location.href = '/meus-veiculos';
        }
      } catch (error) {
        console.error('Erro ao obter dados do veículo:', error);
        alert('Erro ao conectar-se ao servidor.');
        window.location.href = '/meus-veiculos';
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!client) {
      alert('Usuário não autenticado.');
      window.location.href = '/';
      return;
    }

    const carroAtualizado: Carro = {
      idCarro: Number(id),
      idCliente: client.idCliente,
      marca,
      modelo,
      placa,
      anoFabricacao,
      cor,
      status: 1,
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/carros/${id}`, carroAtualizado);
      if (response.status === 200) {
        alert('Veículo atualizado com sucesso!');
        window.location.href = '/meus-veiculos';
      } else {
        alert('Erro ao atualizar veículo.');
      }
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      alert('Erro ao conectar-se ao servidor.');
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex items-center justify-between bg-black text-white p-6 rounded-lg mb-8 shadow-lg">
        <h1 className="text-2xl font-bold">Editar Veículo</h1>
        <div className="flex items-center space-x-4">
          <Link href="/meus-veiculos" className="text-lg">
            Meus Veículos
          </Link>
          <div className="relative">
            <img
              src="/path/to/profile.jpg"
              alt="Perfil"
              className="w-10 h-10 rounded-full cursor-pointer border border-white"
            />
            {/* Adicione aqui o menu do perfil se necessário */}
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Marca</label>
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Modelo</label>
            <input
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Placa</label>
            <input
              type="text"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={7}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Ano de Fabricação</label>
            <input
              type="number"
              value={anoFabricacao}
              onChange={(e) => setAnoFabricacao(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={1900}
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Cor</label>
            <input
              type="text"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
