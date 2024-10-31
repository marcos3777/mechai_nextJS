// Page.tsx

"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdModeEdit, MdDelete, MdArrowDropDown } from "react-icons/md"; // Import the arrow icon
import imgMarcos from "@/public/marcosimage.jpg";
import imgRichardy from "@/public/richardyimage.jpg";
import imgHenrique from "@/public/izziimage.jpg";
import imgArthur from "@/public/arthurimage.jpg";
import imgPedro from "@/public/pedroimage.jpg";

interface CustomDropdownProps {
  options: string[];
  label: string;
  value: string;
  onSelect: (value: string) => void;
}

const CustomDropdown = ({ options, label, value, onSelect }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelect = (option: string) => {
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div ref={dropdownRef} className="dropdownnomes">
      {/* Label */}
      <p
        className="opcoesnomes flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || label}
        <MdArrowDropDown className="ml-2" />
      </p>

      {/* Options */}
      {isOpen && (
        <div className="coresposicoesopcoes">
          {options.map((option) => (
            <div
              key={option}
              className="opcoeshover"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Page() {
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

  const [selectedName, setSelectedName] = useState('');
  const [selectedProva, setSelectedProva] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [semestre1Data, setSemestre1Data] = useState<Data[]>([]);
  const [semestre2Data, setSemestre2Data] = useState<Data[]>([]);

  const participants = [
    {
      name: 'Marcos Vinicius',
      image: imgMarcos,
    },
    {
      name: 'Richardy Borges',
      image: imgRichardy,
    },
    {
      name: 'Henrique Izzi',
      image: imgHenrique,
    },
    {
      name: 'Pedro Bergara',
      image: imgPedro, 
    },
    {
      name: 'Arthur Ramos dos Santos',
      image: imgArthur, 
    },
  ];

  const nomes = ['Marcos Vinicius', 'Richardy Borges', 'Henrique Izzi', 'Pedro Bergara', 'Arthur Ramos dos Santos'];
  const provas = ['Checkpoint', 'Sprint', 'GlobalSolution'];
  const materias = [
    'ARTIFICIAL INTELLIGENCE AND CHATBOT',
    'DOMAIN DRIVEN DESIGN USING JAVA',
    'BUILDING RELATIONAL DATABASE',
    'FRONT-END DESIGN ENGINEERING',
    'COMPUTATIONAL THINKING USING PYTHON',
    'SOFTWARE ENGINEERING AND BUSINESS MODEL',
  ];

  const fetchData = async () => {
    const response = await fetch('/api/base-route');
    const data: Data[] = await response.json();

    const semestre1 = data.filter(
      (item) =>
        item.name === selectedName &&
        item.tipo === selectedProva.toLowerCase() &&
        item.materia === selectedMateria &&
        item.semestre === '1'
    );
    const semestre2 = data.filter(
      (item) =>
        item.name === selectedName &&
        item.tipo === selectedProva.toLowerCase() &&
        item.materia === selectedMateria &&
        item.semestre === '2'
    );

    setSemestre1Data(semestre1);
    setSemestre2Data(semestre2);
  };

  useEffect(() => {
    if (selectedName && selectedProva && selectedMateria) {
      fetchData();
    }
  }, [selectedName, selectedProva, selectedMateria]);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('Tem certeza que deseja deletar este item?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/base-route/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error('Failed to delete the item');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  const handleBack = () => {
    setSelectedName('');
    setSelectedProva('');
    setSelectedMateria('');
    setSemestre1Data([]);
    setSemestre2Data([]);
  };

  const participant = participants.find((p) => p.name === selectedName);

  return (
    <div className="conteiner-home">
      {(!selectedName || !selectedProva || !selectedMateria) && (
        <>
          {/* Dropdowns */}
          <div className="container-botao">
            <select
              className="butao"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
            >
              <option value="">Nome</option>
              {nomes.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </select>

            <select
              className="butao"
              value={selectedProva}
              onChange={(e) => setSelectedProva(e.target.value)}
            >
              <option value="">Provas</option>
              {provas.map((prova) => (
                <option key={prova} value={prova}>
                  {prova}
                </option>
              ))}
            </select>

            <select
              className="butao"
              value={selectedMateria}
              onChange={(e) => setSelectedMateria(e.target.value)}
            >
              <option value="">Matéria</option>
              {materias.map((materia) => (
                <option key={materia} value={materia}>
                  {materia}
                </option>
              ))}
            </select>
            {/* Botão Cadastrar */}
            <button
              className="butao-cad"
              onClick={() => {
                window.location.href = '/cadastrar';
              }}
            >
              Cadastrar
            </button>
          </div>

          {/* Conteudo tela inicial */}
          <div className="conteiner-welcome">
            <h1 className="welcome-text">Bem-vindo ao Sistema de Notas</h1>
            <p className="item-p1">
              Para visualizar os dados das provas, por favor selecione o{' '}
              <strong>Nome</strong>, <strong>Prova</strong> e{' '}
              <strong>Matéria</strong> nos menus acima.
            </p>
            <p className="item-p2">Aplicação ainda em desenvolvimento.</p>
          </div>
        </>
      )}

      {/* Conteudo depois q tudo foi selecionado */}
      {selectedName && selectedProva && selectedMateria && (
        <>
          {/* Header e image, custom dropdowns, e o buttons */}
          <div className="header">
            {/* Image */}
            <div className="image-container">
              {participant?.image ? (
                <Image
                  src={participant.image}
                  alt={participant.name}
                  className="participant-image rounded-full"
                  width={96}
                  height={96}
                />
              ) : (
                <div className="participant-placeholder">
                  <p>Imagem não disponível</p>
                </div>
              )}
            </div>
            {/* Header e image, custom dropdowns, e o buttons */}
            <div className="labels">
              <CustomDropdown
                options={nomes}
                label="Selecione um nome"
                value={selectedName}
                onSelect={(value) => setSelectedName(value)}
              />
              <CustomDropdown
                options={provas}
                label="Selecione uma prova"
                value={selectedProva}
                onSelect={(value) => setSelectedProva(value)}
              />
              <CustomDropdown
                options={materias}
                label="Selecione uma matéria"
                value={selectedMateria}
                onSelect={(value) => setSelectedMateria(value)}
              />
            </div>
            {/* Buttons */}
            <div className="button-group">
              <button className="butao-cad" onClick={handleBack}>
                Voltar
              </button>
              <button
                className="butao-cad"
                onClick={() => {
                  window.location.href = '/cadastrar';
                }}
              >
                Cadastrar
              </button>
            </div>
          </div>
          <div className="container-principal">
            {/* Semestre 1 */}
            <div className="conteudo-semestr">
              <h2>Semestre 1</h2>
              {semestre1Data.length > 0 ? (
                semestre1Data.map((item) => (
                  <div key={item.id} className="caixa-semestr">
                    <Link href={`/edit/${item.id}`} className="edit">
                      <MdModeEdit />
                    </Link>
                    <button
                      className="delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <MdDelete />
                    </button>
                    <h3 className="titulo-item-semestr">{item.title}</h3>
                    <p>{item.date}</p>
                    <p>Feedback: {item.feedback}</p>
                    <h4>Nota: {item.note}</h4>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-300">
                  Nenhum dado disponível para o Semestre 1.
                </p>
              )}
            </div>

            {/* Semestre 2 */}
            <div className="conteudo-semestr">
              <h2>Semestre 2</h2>
              {semestre2Data.length > 0 ? (
                semestre2Data.map((item) => (
                  <div key={item.id} className="caixa-semestr">
                    <Link href={`/edit/${item.id}`} className="edit">
                      <MdModeEdit />
                    </Link>
                    <button
                      className="delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <MdDelete />
                    </button>
                    <h3 className="titulo-item-semestr">{item.title}</h3>
                    <p>{item.date}</p>
                    <p>Feedback: {item.feedback}</p>
                    <h4>Nota: {item.note}</h4>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-300">
                  Nenhum dado disponível para o Semestre 2.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
