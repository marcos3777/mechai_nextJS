// pages/inicio-cliente/pedidos.tsx

"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Orcamento } from '../../../types/types'; // Ajuste o caminho conforme necessário
import Link from 'next/link';

export default function Pedidos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrcamentos = async () => {
      try {
        const clientData = localStorage.getItem('clientData');
        if (clientData) {
          const client = JSON.parse(clientData);
          setClient(client);

          console.log('ID do Cliente:', client.idCliente);

          // Faça a requisição para obter os orçamentos do cliente
          const response = await axios.get(
            `http://localhost:8080/api/orcamentos/cliente/${client.idCliente}`
          );

          if (response.status === 200) {
            console.log('Orçamentos recebidos:', response.data);
            setOrcamentos(response.data);
          } else {
            console.error('Erro ao obter os orçamentos do cliente.');
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
    fetchOrcamentos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex items-center justify-between bg-black text-white p-6 rounded-lg mb-8 shadow-lg">
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
        <div className="flex items-center space-x-4">
          <Link href="/inicio-cliente" className="text-lg">
            Início
          </Link>
          <div className="relative">
            {/* Substituindo a imagem por um ícone de usuário padrão */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="imagem-perfil cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => { /* Adicione a lógica do menu se necessário */ }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.757 0 5.293.696 7.379 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {/* Adicione aqui o menu do perfil se necessário */}
          </div>
        </div>
      </header>

      <main>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            {orcamentos && orcamentos.length > 0 ? (
              <div className="space-y-6">
                {orcamentos.map((orcamento) => (
                  <div
                    key={orcamento.idOrcamento}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      Pedido #{orcamento.idOrcamento}
                    </h2>
                    <p>
                      <strong>Tipo de Problema:</strong> {orcamento.tipoProblema}
                    </p>
                    <p>
                      <strong>Descrição:</strong> {orcamento.descricaoProblema}
                    </p>
                    <p>
                      <strong>Endereço Atual:</strong> {orcamento.enderecoAtual}
                    </p>
                    <p>
                      <strong>Data Prevista de Finalização:</strong> {orcamento.dtPrevistaFinalizacao || 'Não informada'}
                    </p>
                    <p>
                      <strong>Status:</strong> {getStatusText(orcamento.status)}
                    </p>
                    <div className="mt-4">
                      <Link
                        href={`/inicio-cliente/pedidos/${orcamento.idOrcamento}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xl mb-4">Você não possui nenhum pedido.</p>
                {/* Você pode adicionar um botão para criar um novo pedido, se aplicável */}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Função para converter o status em texto legível
function getStatusText(status: number): string {
  switch (status) {
    case 0:
      return 'Pendente';
    case 1:
      return 'Em Andamento';
    case 2:
      return 'Concluído';
    case 3:
      return 'Cancelado';
    default:
      return 'Desconhecido';
  }
}
