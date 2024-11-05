// pages/page.tsx

"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleClientLogin = async () => {
    try {
      console.log('Tentando fazer login com:', { login, senha });
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login,
          senhaHash: senha,
        }),
      });
  
      const data = await response.json();
      console.log('Dados recebidos:', data);
  
      if (response.ok) {
        localStorage.setItem('clientData', JSON.stringify(data));
        window.location.href = '/inicio-cliente';
      } else {
        alert(`Erro na autenticação: ${data.message || 'Verifique suas credenciais.'}`);
      }
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
      alert('Erro ao conectar-se ao servidor. Por favor, tente novamente mais tarde.');
    }
  };

  const handleMechanicLogin = async () => {
    try {
      console.log('Tentando fazer login de mecânico com:', { login, senha });
      const response = await fetch('http://localhost:5000/mecanicos/login', { // Atualize a URL com o endpoint da API Python
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: login,
          senha,
        }),
      });
  
      const data = await response.json();
      console.log('Dados recebidos do mecânico:', data);
  
      if (response.ok) {
        localStorage.setItem('mecanicoData', JSON.stringify(data)); // Alterado para 'mecanicoData'
        window.location.href = '/inicio-meca';
      } else {
        alert(`Erro na autenticação de mecânico: ${data.message || 'Verifique suas credenciais.'}`);
      }
    } catch (error) {
      console.error('Erro ao chamar a API de mecânico:', error);
      alert('Erro ao conectar-se ao servidor de mecânicos. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <div className="pagina-login"> 
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full space-y-4">
          <h2 className="text-2xl font-semibold text-center text-gray-800">LOGIN</h2>
          
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="input-login"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="input-senha"
          />

          {/* Botão para Cliente */}
          <button
            onClick={handleClientLogin}
            className="botao-cliente"
          >
            Entrar como Cliente
          </button>

          {/* Botão para Mecânico */}
          <button
            onClick={handleMechanicLogin}
            className="botao-mecanico"
          >
            Entrar como Mecânico
          </button>

          <div className="flex justify-between pt-4">
            <Link href="/cad-cliente" className="link-cadastrar-cliente">
              Cadastrar Cliente
            </Link>
            
            <Link href="/cad-meca" className="link-cadastrar-mecanico">
              Cadastrar Mecânico
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
