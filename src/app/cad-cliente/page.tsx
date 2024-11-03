// pages/cad_client.tsx

"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Cliente } from '@/types/types'; // Importa o tipo Cliente

// Define o tipo FormData que inclui o tipo Cliente sem 'idCliente' e com o campo adicional 'senha'
type FormData = Omit<Cliente, 'idCliente'> & { senha: string };

export default function CadClient() {
  // Usa o tipo FormData para o estado do formulário
  const [formData, setFormData] = useState<FormData>({
    loginCliente: '',
    senha: '',
    cpf: '',
    nome: '',
    endereco: '',
    email: '',
    telefone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log('Submitting form data:', formData); // Log para verificar os dados do formulário
    try {
      const response = await fetch('http://localhost:8080/api/clients/cad-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: {
            cpf: formData.cpf,
            nome: formData.nome,
            endereco: formData.endereco,
            email: formData.email,
            telefone: formData.telefone,
            loginCliente: formData.loginCliente,
          },
          senhaHash: formData.senha,
        }),
      });

      console.log('Response status:', response.status); // Log para verificar o status da resposta
      const responseData = await response.json();
      console.log('Response data:', responseData); // Log para verificar os dados retornados

      if (response.ok) {
        alert('Cliente cadastrado com sucesso!');
      } else {
        alert(`Erro ao cadastrar cliente: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      alert('Erro ao cadastrar cliente');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full space-y-4">
        <h2 className="text-2xl font-semibold text-center text-white">Cadastro de Cliente</h2>

        {/* Gera os campos do formulário dinamicamente */}
        {['loginCliente', 'senha', 'cpf', 'nome', 'endereco', 'email', 'telefone'].map((field) => (
          <input
            key={field}
            type={field === 'senha' ? 'password' : 'text'}
            name={field}
            placeholder={field}
            value={formData[field as keyof FormData]}
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
