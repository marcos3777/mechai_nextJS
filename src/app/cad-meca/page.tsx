// pages/cad_meca.tsx

"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function CadMeca() {
  const [formData, setFormData] = useState({
    usuario: '',  // Campo de login
    senha: '',    // Campo de senha
    cpf: '',
    nome: '',
    nm_empresa: '',
    endereco: '',
    telefone: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/mecanicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        alert('Mecânico cadastrado com sucesso!');
        
        // Limpar o formulário após o sucesso
        setFormData({
          usuario: '',
          senha: '',
          cpf: '',
          nome: '',
          nm_empresa: '',
          endereco: '',
          telefone: '',
          email: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Erro na resposta da API:', errorData);
        alert('Erro ao cadastrar mecânico.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao cadastrar mecânico.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full space-y-4">
        <h2 className="text-2xl font-semibold text-center text-white">Cadastro de Mecânico</h2>
        
        {/* Campos de login e senha primeiro */}
        {['usuario', 'senha', 'cpf', 'nome', 'nm_empresa', 'endereco', 'telefone', 'email'].map((field) => (
          <input
            key={field}
            type={field === 'senha' ? 'password' : 'text'}  // Campo de senha oculto
            name={field}
            placeholder={
              field === 'usuario' ? 'Login' :
              field === 'senha' ? 'Senha' :
              field === 'nm_empresa' ? 'Nome da Empresa' :
              field
            }
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
