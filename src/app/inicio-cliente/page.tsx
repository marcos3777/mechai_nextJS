// pages/inicio-cliente.tsx

"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { useMapEvent } from 'react-leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

export default function InicioCliente() {
  const [client, setClient] = useState<any>(null);
  const [modeloVeiculo, setModeloVeiculo] = useState<string[]>([]);
  const [problema, setProblema] = useState('');
  const [descricao, setDescricao] = useState('');
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [endereco, setEndereco] = useState('');
  const [tipoProblema, setTipoProblema] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const problemasComuns = [
    "Falha na bateria",
    "Problema no motor",
    "Freios desgastados",
    "Pneus furados",
    "Problema elétrico"
  ];

  useEffect(() => {
    const fetchData = async () => {
      const clientData = localStorage.getItem('clientData');
      if (clientData) {
        setClient(JSON.parse(clientData));
      } else {
        window.location.href = '/';
      }
      setModeloVeiculo(["Modelo A", "Modelo B", "Modelo C"]);
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
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      setEndereco(response.data.display_name);
    } catch (error) {
      console.error("Erro ao obter endereço:", error);
    }
  };

  const geocodeAddress = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${endereco}`);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition(new L.LatLng(parseFloat(lat), parseFloat(lon)));
      } else {
        alert("Endereço não encontrado");
      }
    } catch (error) {
      console.error("Erro ao converter endereço em coordenadas:", error);
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
    try {
      const requestData = {
        idCliente: client.idCliente,
        idCarro: 1,
        tipoProblema: tipoProblema,
        descricaoProblema: descricao,
        enderecoAtual: endereco,
        status: 1,
      };

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
        alert(`Erro ao enviar solicitação: ${errorData.message || 'Tente novamente mais tarde.'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      alert('Erro ao conectar-se ao servidor. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex items-center justify-between bg-black text-white p-6 rounded-lg mb-8 shadow-lg">
        <h1 className="text-2xl font-bold">Minhas Solicitações</h1>
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-lg">Minhas Solicitações</Link>
          <div className="relative" ref={menuRef}>
            <img
              src="/path/to/profile.jpg"
              alt="Perfil"
              className="w-10 h-10 rounded-full cursor-pointer border border-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                <Link href="/meus-veiculos" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Meus veículos</Link>
                <Link href="/cadastrar-veiculo" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Cadastrar veículo</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Solicitar Assistência</h2>

          <div className="mb-6">
            <label className="block text-gray-600 font-semibold mb-2">Nome</label>
            <p className="bg-gray-100 p-3 rounded-lg border">{client?.nome}</p>
          </div>

          {/* Comentário: Precisamos criar o CRUD para obter os modelos de veículos do cliente */}
          <div className="mb-6">
            <label className="block text-gray-600 font-semibold mb-2">Modelo do Veículo</label>
            <select className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione um modelo</option>
              {modeloVeiculo.map((modelo, index) => (
                <option key={index} value={modelo}>{modelo}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 font-semibold mb-2">Tipo de Problema</label>
            <select
              className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tipoProblema}
              onChange={(e) => setTipoProblema(e.target.value)}
            >
              <option value="">Selecione um problema</option>
              {problemasComuns.map((problema, index) => (
                <option key={index} value={problema}>{problema}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 font-semibold mb-2">Descrição do Problema</label>
            <textarea
              className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Descreva o problema aqui..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enviar Solicitação
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Endereço Atual</h2>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            onBlur={geocodeAddress}
            placeholder="Digite um endereço"
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="h-80 rounded-lg overflow-hidden">
            <MapContainer center={[-23.55052, -46.633308]} zoom={13} className="w-full h-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
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
