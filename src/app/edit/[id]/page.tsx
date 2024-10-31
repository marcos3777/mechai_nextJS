// app/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Data {
  id: number;
  name: string;
  tipo: string;
  materia: string;
  title: string;
  date: string;
  feedback: string;
  note: number;
  semestre: string;
}

const EditPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Obter o id dos parâmetros de rota

  const [formData, setFormData] = useState<Data | null>(null);

  const nomes = ['Marcos Vinicius', 'Richard', 'Henrique Izzi', 'Pedro Bergara', 'Arthur Ramos dos Santos'];
  const provas = ['Checkpoint', 'Sprint', 'GlobalSolution'];
  const materias = [
    'ARTIFICIAL INTELLIGENCE AND CHATBOT',
    'DOMAIN DRIVEN DESIGN USING JAVA',
    'BUILDING RELATIONAL DATABASE',
    'FRONT-END DESIGN ENGINEERING',
    'COMPUTATIONAL THINKING USING PYTHON',
    'SOFTWARE ENGINEERING AND BUSINESS MODEL',
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/base-route/${id}`);
      const data: Data = await response.json();
      setFormData(data);
    };

    fetchData();
  }, [id]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData) {
      const response = await fetch(`/api/base-route/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirecionar de volta para a página principal
        router.push('/');
      } else {
        // Lidar com erro
        console.error('Falha ao atualizar os dados');
      }
    }
  };

  if (!formData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container-edit">
      
      <form 
        onSubmit={handleSubmit}
        className="form-edit"
      >
        <h1>Editar Prova</h1>
        {/* Campo Nome */}
        <div className="div-opcoes-form-edit">
          <label>Nome</label>
          <select
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            className="entradas-form"
          >
            {nomes.map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
          </select>
        </div>

        {/* Campo Prova */}
        <div className="div-opcoes-form-edit">
          <label>Prova</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleFormChange}
            className="entradas-form"
          >
            {provas.map((prova) => (
              <option key={prova} value={prova.toLowerCase()}>
                {prova}
              </option>
            ))}
          </select>
        </div>

        {/* Campo Matéria */}
        <div className="div-opcoes-form-edit">
          <label>Matéria</label>
          <select
            name="materia"
            value={formData.materia}
            onChange={handleFormChange}
            className="entradas-form"
          >
            {materias.map((materia) => (
              <option key={materia} value={materia}>
                {materia}
              </option>
            ))}
          </select>
        </div>

        {/* Outros campos */}
        <div className="div-opcoes-form-edit">
          <label>Título</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            className="entradas-form"
          />
        </div>

        <div className="div-opcoes-form-edit">
          <label>Data</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
            className="entradas-form"
          />
        </div>

        <div className="div-opcoes-form-edit">
          <label>Feedback</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleFormChange}
            className="entradas-form"
          ></textarea>
        </div>

        <div className="div-opcoes-form-edit">
          <label>Nota</label>
          <input
            type="number"
            name="note"
            value={formData.note}
            onChange={handleFormChange}
            className="entradas-form"
            min="0"
            max="10"
            step="0.1"
          />
        </div>

        <div className="div-opcoes-form-edit">
          <label>Semestre</label>
          <select
            name="semestre"
            value={formData.semestre}
            onChange={handleFormChange}
            className="entradas-form"
          >
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>

        {/* Botões */}
        <button type="submit" className="botao-submit">
          Salvar
        </button>
        <button
          type="button"
          className="botao-cancelar"
          onClick={() => router.back()}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditPage;
