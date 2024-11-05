// app/meus-veiculos/page.tsx

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Carro } from '@/types/types'; 
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; 

export default function MeusVeiculos() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarros = async () => {
      try {
        const clientData = localStorage.getItem('clientData');
        if (clientData) {
          const client = JSON.parse(clientData);
          setClient(client);

          const response = await axios.get(
            `http://localhost:8080/api/carros/cliente/${client.idCliente}`
          );
          if (response.status === 200) {
            setCarros(response.data); 
          } else {
            console.error('Erro ao obter veículos do cliente.');
          }
        } else {
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarros();
  }, []);

  const handleDelete = async (idCarro: number) => {
    const confirmDelete = confirm('Tem certeza que deseja excluir este veículo?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/carros/${idCarro}`);
        if (response.status === 204) {
          setCarros(carros.filter((carro) => carro.idCarro !== idCarro));
        } else {
          alert('Erro ao excluir o veículo.');
        }
      } catch (error) {
        console.error('Erro ao excluir o veículo:', error);
        alert('Erro ao conectar-se ao servidor.');
      }
    }
  };

  // Função atualizada para incluir marca, cor e ano na query
  const getCarImage = async (marca: string, modelo: string, cor: string, ano: string): Promise<string> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      const cx = process.env.NEXT_PUBLIC_GOOGLE_CX_ID;
      const query = `${marca} ${modelo} ${cor} ${ano} carro`;

      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
          query
        )}&cx=${cx}&searchType=image&key=${apiKey}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        return data.items[0].link; 
      } else {
        
        return '/path/to/placeholder.jpg';
      }
    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
      
      return '/path/to/placeholder.jpg';
    }
  };

  const handleGenerateImage = async (index: number) => {
    const carro = carros[index];
    try {
      const imageUrl = await getCarImage(
        carro.marca,
        carro.modelo,
        carro.cor,
        carro.anoFabricacao
      );

      
      const novosCarros = [...carros];
      novosCarros[index] = { ...carro, imageUrl };
      setCarros(novosCarros);
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex items-center justify-between bg-black text-white p-6 rounded-lg mb-8 shadow-lg">
        <h1 className="text-2xl font-bold">Meus Veículos</h1>
        <div className="flex items-center space-x-4">
          <Link href="/inicio-cliente" className="text-lg">
            Início
          </Link>
          <div className="relative">
            <img
              src="/path/to/profile.jpg"
              alt="Perfil"
              className="w-10 h-10 rounded-full cursor-pointer border border-white"
            />
            
          </div>
        </div>
      </header>

      <main>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            {carros.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {carros.map((carro, index) => (
                  <div
                    key={carro.idCarro}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {carro.imageUrl ? (
                      <img
                        src={carro.imageUrl}
                        alt={carro.modelo}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                        <button
                          onClick={() => handleGenerateImage(index)}
                          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Gerar Imagem
                        </button>
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2">{carro.modelo}</h2>
                      <p>
                        <strong>Marca:</strong> {carro.marca}
                      </p>
                      <p>
                        <strong>Placa:</strong> {carro.placa}
                      </p>
                      <p>
                        <strong>Ano:</strong> {carro.anoFabricacao}
                      </p>
                      <p>
                        <strong>Cor:</strong> {carro.cor}
                      </p>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Link
                          href={`/meus-veiculos/editar-veiculo/${carro.idCarro}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(carro.idCarro)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xl mb-4">Você não possui nenhum veículo cadastrado.</p>
                <Link href="/cad-veiculo">
                  <button className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Cadastrar Veículo
                  </button>
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
