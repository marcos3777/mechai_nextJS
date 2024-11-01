// pages/cad_client.tsx

"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function CadClient() {
  const [formData, setFormData] = useState({
    login: '',
    senha: '',
    cpf: '',
    nome: '',
    endereco: '',
    email: '',
    tel: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    // Função para integrar com a API posteriormente
    console.log('Form data:', formData);
    alert('Cliente cadastrado com sucesso! (Simulação)');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full space-y-4">
        <h2 className="text-2xl font-semibold text-center text-white">Cadastro de Cliente</h2>
        
        {['login', 'senha', 'cpf', 'nome', 'endereco', 'email', 'tel'].map((field) => (
          <input
            key={field}
            type={field === 'senha' ? 'password' : 'text'}
            name={field}
            placeholder={field}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Cadastrar
        </button>

        <Link href="/" passHref>
          <button className="w-full py-3 mt-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  );
}
