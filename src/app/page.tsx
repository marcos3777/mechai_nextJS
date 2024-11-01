// pages/index.tsx

"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/base-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, senha }),
      });

      if (response.ok) {
        window.location.href = '/mechai';
      } else {
        alert('Erro na autenticação, verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full space-y-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800">LOGIN</h2>
        
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Entrar
        </button>

        <div className="flex justify-between pt-4">
          <Link href="/cad-cliente" className="bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">
            Cadastrar Cliente
          </Link>
          
          <Link href="/cad-meca" className="bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">
            Cadastrar Mecânico
          </Link>
        </div>
      </div>
    </div>
  );
}
