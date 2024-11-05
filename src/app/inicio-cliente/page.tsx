// pages/inicio-cliente.tsx

"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { useMapEvent } from 'react-leaflet';
import { Carro, Cliente } from '@/types/types'; // Importando Cliente

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), {
  ssr: false,
});

export default function InicioCliente() {
  const [client, setClient] = useState<Cliente | null>(null); // Usando o tipo Cliente
  const [modeloVeiculo, setModeloVeiculo] = useState<Carro[]>([]);
  const [selectedVeiculoId, setSelectedVeiculoId] = useState<number | null>(null);
  const [descricao, setDescricao] = useState('');
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [endereco, setEndereco] = useState('');
  const [tipoProblema, setTipoProblema] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const problemasComuns = [
    'Falha na bateria',
    'Problema no motor',
    'Freios desgastados',
    'Pneus furados',
    'Problema elétrico',
  ];

  useEffect(() => {
    const fetchData = async () => {
      const clientData = localStorage.getItem('clientData');
      console.log('clientData:', clientData); // Log do clientData obtido do localStorage

      if (clientData) {
        try {
          const clientParsed: Cliente = JSON.parse(clientData);
          console.log('clientParsed:', clientParsed); // Log do objeto clientParsed

          setClient(clientParsed);

          // Buscar veículos do usuário
          try {
            const response = await axios.get(
              `http://localhost:8080/api/carros/cliente/${clientParsed.idCliente}`
            );
            if (response.status === 200) {
              setModeloVeiculo(response.data); // Supondo que response.data seja um array de Carro
            } else {
              console.error('Erro ao obter veículos do cliente.');
            }
          } catch (error) {
            console.error('Erro ao obter veículos do cliente:', error);
          }
        } catch (error) {
          console.error('Erro ao parsear clientData:', error);
          window.location.href = '/';
        }
      } else {
        window.location.href = '/';
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      setEndereco(response.data.display_name);
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
    }
  };

  const geocodeAddress = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          endereco
        )}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition(new L.LatLng(parseFloat(lat), parseFloat(lon)));
      } else {
        alert('Endereço não encontrado');
      }
    } catch (error) {
      console.error('Erro ao converter endereço em coordenadas:', error);
    }
  };

  const MapClickHandler = () => {
    useMapEvent('click', (e: L.LeafletMouseEvent) => {
      setPosition(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });
    return null;
  };

  const handleSubmit = async () => {
    if (!selectedVeiculoId) {
      alert('Por favor, selecione um veículo.');
      return;
    }
    if (!tipoProblema) {
      alert('Por favor, selecione o tipo de problema.');
      return;
    }
    if (!descricao) {
      alert('Por favor, insira a descrição do problema.');
      return;
    }
    if (!endereco) {
      alert('Por favor, insira o endereço atual.');
      return;
    }

    console.log('client:', client); // Log do objeto client
    console.log('client.idCliente:', client?.idCliente); // Log do idCliente

    // Verificação adicional
    if (!client || !client.idCliente) {
      alert('Erro: Cliente não identificado. Por favor, faça login novamente.');
      return;
    }

    try {
      const requestData = {
        idCliente: client.idCliente,
        idCarro: selectedVeiculoId,
        tipoProblema: tipoProblema,
        descricaoProblema: descricao,
        enderecoAtual: endereco,
        status: 1,
      };

      console.log('requestData:', requestData); // Log dos dados da requisição

      const response = await fetch('http://localhost:8080/api/orcamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert('Solicitação enviada com sucesso!');
      } else {
        const errorData = await response.json();
        alert(
          `Erro ao enviar solicitação: ${
            errorData.message || 'Tente novamente mais tarde.'
          }`
        );
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      alert('Erro ao conectar-se ao servidor. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <div className="pagina-inicio-cliente">
      <header className="cabecalho-inicio-cliente">
        <h1 className="titulo-cabecalho">Minhas Solicitações</h1>
        <div className="menu-opcoes">
          <Link href="/inicio-cliente/pedidos" className="link-solicitacoes">
            Minhas Solicitações
          </Link>
          <div className="menu-relativo" ref={menuRef}>
            {/* Substituindo a imagem por um ícone de usuário padrão */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="imagem-perfil cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.757 0 5.293.696 7.379 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {isMenuOpen && (
              <div className="menu-dropdown">
                <Link href="/meus-veiculos" className="item-menu-dropdown">
                  Meus veículos
                </Link>
                <Link href="meus-veiculos/cad-veiculo" className="item-menu-dropdown">
                  Cadastrar veículo
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="layout-principal">
        <div className="caixa-solicitacao">
          <h2 className="titulo-solicitacao">Solicitar Assistência</h2>

          <div className="espacamento-mb-6">
            <label className="label-campo">Nome</label>
            <p className="campo-nome">{client?.nome}</p>
          </div>

          <div className="espacamento-mb-6">
            <label className="label-campo">Modelo do Veículo</label>
            {modeloVeiculo.length > 0 ? (
              <select
                className="campo-select-veiculo"
                value={selectedVeiculoId || ''}
                onChange={(e) => setSelectedVeiculoId(Number(e.target.value))}
              >
                <option value="">Selecione um veículo</option>
                {modeloVeiculo.map((veiculo) => (
                  <option key={veiculo.idCarro} value={veiculo.idCarro}>
                    {`${veiculo.marca} ${veiculo.modelo}`}
                  </option>
                ))}
              </select>
            ) : (
              <p>
                Você não possui veículos cadastrados.{' '}
                <Link href="meus-veiculos/cad-veiculo" className="link-cadastrar-veiculo">
                  Cadastre um veículo
                </Link>
                .
              </p>
            )}
          </div>

          <div className="espacamento-mb-6">
            <label className="label-campo">Tipo de Problema</label>
            <select
              className="campo-select-problema"
              value={tipoProblema}
              onChange={(e) => setTipoProblema(e.target.value)}
            >
              <option value="">Selecione um problema</option>
              {problemasComuns.map((problema, index) => (
                <option key={index} value={problema}>
                  {problema}
                </option>
              ))}
            </select>
          </div>

          <div className="espacamento-mb-6">
            <label className="label-campo">Descrição do Problema</label>
            <textarea
              className="campo-textarea-descricao"
              rows={4}
              placeholder="Descreva o problema aqui..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedVeiculoId || !tipoProblema || !descricao || !endereco}
            className={`botao-enviar-solicitacao ${
              !selectedVeiculoId || !tipoProblema || !descricao || !endereco
                ? 'botao-enviar-desativado'
                : 'botao-enviar-ativo'
            }`}
          >
            Enviar Solicitação
          </button>
        </div>

        <div className="caixa-endereco-atual">
          <h2 className="titulo-endereco">Endereço Atual</h2>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            onBlur={geocodeAddress}
            placeholder="Digite um endereço"
            className="campo-input-endereco"
          />
          <div className="container-mapa">
            <MapContainer
              center={[-23.55052, -46.633308]}
              zoom={13}
              className="mapa-container"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {position && <Marker position={position} />}
              <MapClickHandler />
            </MapContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
