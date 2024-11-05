// pages/inicio-meca.tsx

"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Orcamento, OrcamentoComDetalhes, Mecanico, Cliente, Carro } from '../../types/types'; // Ajuste o caminho conforme necessário
import { FaUserCircle } from 'react-icons/fa'; // Ícone de usuário

export default function InicioMeca() {
  const [orcamentosStatus1, setOrcamentosStatus1] = useState<OrcamentoComDetalhes[]>([]);
  const [orcamentosStatus2, setOrcamentosStatus2] = useState<OrcamentoComDetalhes[]>([]);
  const [selectedOrcamento, setSelectedOrcamento] = useState<OrcamentoComDetalhes | null>(null);
  const [valor, setValor] = useState('');
  const [dataPrevista, setDataPrevista] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mecanico, setMecanico] = useState<Mecanico | null>(null);

  useEffect(() => {
    // Obter dados do mecânico logado
    const mecanicoData = localStorage.getItem('mecanicoData');
    console.log('mecanicoData do localStorage:', mecanicoData);

    if (mecanicoData) {
      try {
        const mecanicoParsed: Mecanico = JSON.parse(mecanicoData);
        console.log('mecanicoParsed:', mecanicoParsed);
        setMecanico(mecanicoParsed);
      } catch (error) {
        console.error('Erro ao parsear mecanicoData:', error);
        setError('Erro ao carregar dados do mecânico.');
      }
    } else {
      console.log('Nenhum mecanicoData encontrado.');
      // window.location.href = '/'; // Mantenha comentado para teste
    }
  }, []);

  useEffect(() => {
    const fetchOrcamentos = async () => {
      try {
        console.log('Buscando orçamentos...');
        const response = await axios.get('http://localhost:8080/api/orcamentos');
        console.log('Resposta de orçamentos:', response);
        if (response.status === 200) {
          const allOrcamentos = response.data as Orcamento[];
          console.log('Total de orçamentos recebidos:', allOrcamentos.length);

          // Obter informações adicionais de cliente e carro
          const orcamentosComDetalhes: OrcamentoComDetalhes[] = await Promise.all(
            allOrcamentos.map(async (orcamento) => {
              // Obter nome do cliente
              let clienteNome = 'Cliente Desconhecido';
              try {
                const clienteResponse = await axios.get(`http://localhost:8080/api/clients/${orcamento.idCliente}`);
                const cliente = clienteResponse.data as Cliente;
                clienteNome = cliente.nome;
              } catch (error) {
                console.error(`Erro ao obter cliente para orçamento ${orcamento.idOrcamento}:`, error);
              }

              // Obter modelo do carro
              let carroModelo = 'Carro Desconhecido';
              try {
                const carroResponse = await axios.get(`http://localhost:8080/api/carros/${orcamento.idCarro}`);
                const carro = carroResponse.data as Carro;
                carroModelo = `${carro.marca} ${carro.modelo}`;
              } catch (error) {
                console.error(`Erro ao obter carro para orçamento ${orcamento.idOrcamento}:`, error);
              }

              return {
                ...orcamento,
                clienteNome,
                carroModelo,
              };
            })
          );

          console.log('Orçamentos com detalhes:', orcamentosComDetalhes);

          // Filtrar orçamentos válidos
          const orcamentosValidos = orcamentosComDetalhes.filter(
            (o) => o !== null
          ) as OrcamentoComDetalhes[];

          console.log('Orçamentos válidos após filtrar null:', orcamentosValidos.length);

          // Filtrar por status
          const orcamentosStatus1Filtered = orcamentosValidos.filter((o) => o.status === 1);
          const orcamentosStatus2Filtered = orcamentosValidos.filter((o) => o.status === 2);

          // Atualizar os estados
          setOrcamentosStatus1(orcamentosStatus1Filtered);
          setOrcamentosStatus2(orcamentosStatus2Filtered);

          // Logar os tamanhos filtrados
          console.log('OrcamentosStatus1 (status 1):', orcamentosStatus1Filtered.length);
          console.log('OrcamentosStatus2 (status 2):', orcamentosStatus2Filtered.length);
        } else {
          console.error('Erro ao obter os orçamentos.');
          setError('Erro ao obter os orçamentos.');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        setError('Erro ao buscar orçamentos.');
      } finally {
        setLoading(false);
      }
    };

    if (mecanico) {
      fetchOrcamentos();
    }
  }, [mecanico]);

  const handleAccept = (orcamento: OrcamentoComDetalhes) => {
    setSelectedOrcamento(orcamento);
  };

  const handleConfirmAccept = async () => {
    if (!selectedOrcamento || !mecanico) return;

    // Validação básica
    if (valor.trim() === '' || dataPrevista.trim() === '') {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Verificar se a data está no formato YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dataPrevista)) {
      alert('Formato da data inválido. Use o formato AAAA-MM-DD.');
      return;
    }

    // Construir o objeto de atualização
    const updatedOrcamento: OrcamentoComDetalhes = {
      ...selectedOrcamento,
      valor,
      dtPrevistaFinalizacao: dataPrevista, // Manter como string
      status: 2,
      idMecanico: mecanico.idMecanico,
    };

    console.log('Dados enviados para atualização:', updatedOrcamento);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/orcamentos/${selectedOrcamento.idOrcamento}`,
        updatedOrcamento
      );

      console.log('Resposta da atualização do orçamento:', response);

      if (response.status === 200) {
        alert('Orçamento atualizado com sucesso!');
        // Atualizar a lista de orçamentos
        setOrcamentosStatus1(
          orcamentosStatus1.filter(
            (o) => o.idOrcamento !== selectedOrcamento.idOrcamento
          )
        );
        setOrcamentosStatus2([...orcamentosStatus2, response.data]); // Use response.data para garantir que os dados estão atualizados
        // Limpar os estados
        setSelectedOrcamento(null);
        setValor('');
        setDataPrevista('');
      } else {
        console.error('Erro ao atualizar o orçamento.', response);
        alert('Erro ao atualizar o orçamento.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao atualizar o orçamento.');
    }
  };

  const handleFinalize = async (orcamento: OrcamentoComDetalhes) => {
    try {
      const updatedOrcamento: OrcamentoComDetalhes = {
        ...orcamento,
        status: 3,
        dtFinalizacao: new Date().toISOString().split('T')[0], // Data atual
      };

      const response = await axios.put(
        `http://localhost:8080/api/orcamentos/${orcamento.idOrcamento}`,
        updatedOrcamento
      );

      console.log('Resposta da finalização do orçamento:', response);

      if (response.status === 200) {
        alert('Orçamento finalizado com sucesso!');
        // Remover o orçamento da lista
        setOrcamentosStatus2(
          orcamentosStatus2.filter((o) => o.idOrcamento !== orcamento.idOrcamento)
        );
      } else {
        console.error('Erro ao finalizar o orçamento.', response);
        alert('Erro ao finalizar o orçamento.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao finalizar o orçamento.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!mecanico) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-xl mb-4">Você não está logado como mecânico.</p>
        <Link href="/login" className="text-blue-500 underline">
          Ir para Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col md:flex-row bg-gray-100 p-4 space-y-4 md:space-y-0 md:space-x-4">
      {/* Coluna da esquerda: Lista de Pedidos */}
      <div className="flex-1 bg-gray-900 p-4 rounded-lg overflow-y-auto">
        <h2 className="text-xl text-white mb-4">Pedidos Aguardando Aceite</h2>
        {orcamentosStatus1.length > 0 ? (
          orcamentosStatus1.map((orcamento) => (
            <div
              key={orcamento.idOrcamento}
              className="bg-gray-800 text-white p-6 rounded-lg mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              <div className="flex items-center justify-center mb-4">
                <FaUserCircle className="w-16 h-16 text-blue-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">{orcamento.clienteNome}</h3>
                <p className="text-gray-400">
                  Modelo: <span className="text-white font-medium">{orcamento.carroModelo}</span>
                </p>
                <p className="text-gray-400">
                  Tipo: <span className="text-white font-medium">{orcamento.tipoProblema}</span>
                </p>
                <p className="text-gray-400">Descrição:</p>
                <p className="text-white text-sm px-4">{orcamento.descricaoProblema}</p>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => handleAccept(orcamento)}
                  className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors"
                >
                  Aceitar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Nenhum pedido aguardando aceite.</p>
        )}

        <h2 className="text-xl text-white mb-4">Pedidos em Andamento</h2>
        {orcamentosStatus2.length > 0 ? (
          orcamentosStatus2.map((orcamento) => (
            <div
              key={orcamento.idOrcamento}
              className="bg-gray-800 text-white p-6 rounded-lg mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              <div className="flex items-center justify-center mb-4">
                <FaUserCircle className="w-16 h-16 text-blue-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">{orcamento.clienteNome}</h3>
                <p className="text-gray-400">
                  Modelo: <span className="text-white font-medium">{orcamento.carroModelo}</span>
                </p>
                <p className="text-gray-400">
                  Tipo: <span className="text-white font-medium">{orcamento.tipoProblema}</span>
                </p>
                <p className="text-gray-400">Descrição:</p>
                <p className="text-white text-sm px-4">{orcamento.descricaoProblema}</p>
                <p className="text-gray-400">
                  Valor: <span className="text-white font-medium">{orcamento.valor}</span>
                </p>
                <p className="text-gray-400">
                  Data Prevista:{' '}
                  <span className="text-white font-medium">
                    {orcamento.dtPrevistaFinalizacao}
                  </span>
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => handleFinalize(orcamento)}
                  className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition-colors"
                >
                  Finalizar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Nenhum pedido em andamento.</p>
        )}
      </div>

      {/* Coluna da direita: Detalhes do Pedido Atual ou Formulário */}
      <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
        {selectedOrcamento ? (
          <div className="bg-gray-700 p-6 rounded-lg text-white shadow-lg text-center space-y-4">
            <h2 className="text-2xl font-semibold mb-6">
              Definir Valor e Data Prevista
            </h2>
            <div className="flex items-center justify-center mb-4">
              <FaUserCircle className="w-20 h-20 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">{selectedOrcamento.clienteNome}</h3>
            <p className="text-gray-400">
              Modelo:{' '}
              <span className="text-white font-medium">
                {selectedOrcamento.carroModelo}
              </span>
            </p>
            <p className="text-gray-400">
              Tipo:{' '}
              <span className="text-white font-medium">
                {selectedOrcamento.tipoProblema}
              </span>
            </p>
            <p className="text-gray-400">Descrição:</p>
            <p className="text-white text-sm px-4">
              {selectedOrcamento.descricaoProblema}
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-400">Valor:</label>
                <input
                  type="text"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full p-2 rounded bg-gray-600 text-white"
                  placeholder="Digite o valor"
                />
              </div>
              <div>
                <label className="block text-gray-400">Data Prevista:</label>
                <input
                  type="date"
                  value={dataPrevista}
                  onChange={(e) => setDataPrevista(e.target.value)}
                  className="w-full p-2 rounded bg-gray-600 text-white"
                />
              </div>
            </div>
            <button
              onClick={handleConfirmAccept}
              className="bg-green-500 text-white py-2 px-8 mt-6 rounded hover:bg-green-600 transition-colors"
            >
              Confirmar
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white text-xl">
              Selecione um pedido para visualizar os detalhes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
