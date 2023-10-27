import { useState, useEffect } from 'react';
import Image from "next/image";
import { pointsData } from '@/data/points';
import Head from 'next/head';

export default function Home() {
  const [selectedPoints, setSelectedPoints] = useState<{
    flash: number[];
    twoOrMore: number[];
  }>({
    flash: [],
    twoOrMore: []
  });

  // Carregando o estado inicial do localStorage quando o componente é montado
  useEffect(() => {
    const savedData = localStorage.getItem('tocaRankingPoints');
    if (savedData) {
      setSelectedPoints(JSON.parse(savedData));
    }
  }, []);

  const handlePointClick = (type: 'flash' | 'twoOrMore', point: number, boulder: number) => {
    if (type === 'flash' && selectedPoints.twoOrMore.includes(boulder)) return;
    if (type === 'twoOrMore' && selectedPoints.flash.includes(boulder)) return;

    if (!selectedPoints[type].includes(boulder)) {
      setSelectedPoints({
        ...selectedPoints,
        [type]: [...selectedPoints[type], boulder]
      });
    } else {
      setSelectedPoints({
        ...selectedPoints,
        [type]: selectedPoints[type].filter(p => p !== boulder)
      });
    }
    // Salvando o estado atual no localStorage
    localStorage.setItem('tocaRankingPoints', JSON.stringify({
      ...selectedPoints,
      [type]: selectedPoints[type].includes(boulder) ? selectedPoints[type].filter(p => p !== boulder) : [...selectedPoints[type], boulder]
    }));
  }

  const getTotalPoints = (): number => {
    const flashPoints = selectedPoints.flash.reduce((a, b) => a + pointsData?.find(item => item.boulder === b)!.flash, 0);
    const twoOrMorePoints = selectedPoints.twoOrMore.reduce((a, b) => a + pointsData?.find(item => item.boulder === b)!.twoOrMore, 0);
    return flashPoints + twoOrMorePoints;
  }

  const clearSelections = () => {
    // confirmando se o usuário realmente quer limpar as seleções
    if (!confirm('Tem certeza que deseja limpar as seleções? Todos os dados serão perdidos.')) return;
    setSelectedPoints({
      flash: [],
      twoOrMore: []
    });
    localStorage.removeItem('tocaRankingPoints');
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-screen p-4 pb-0">
      <Head>
        <title>Toca Ranking Boulder 2023</title>
        <meta name="description" content="Contador de pontos para o Toca Ranking Boulder 2023" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="flex flex-col justify-center items-center border-2 p-2 rounded-lg mb-4">
        <div className='flex flex-row items-center justify-center'>
          <Image
            src="/logo.png"
            alt="Toca Ranking Logo"
            width={50}
            height={50}
          />
          <h1 className="text-2xl text-center font-bold text-gray-800 ml-2">
            Toca Ranking Boulder 2023
          </h1>
        </div>
        <span className="text-xl font-bold text-gray-500 mt-2">Pontos totais: {getTotalPoints()}</span>
      </div>
      <div className='flex flex-col items-center justify-start w-full h-full overflow-y-auto pb-16'>
        <table className="border-collapse border border-gray-800 w-full max-w-sm mb-4 shadow-md">
          <thead>
            <tr>
              <th className="border border-gray-800 px-4 py-2">BOULDER</th>
              <th className="border border-gray-800 px-4 py-2">FLASH</th>
              <th className="border border-gray-800 px-4 py-2">2 OU MAIS</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {pointsData?.map((item, index) => (
              <tr key={item.boulder} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                <td className="border border-gray-800 select-none px-4 py-2 w-20">{item.boulder}</td>
                <td
                  className={`border border-gray-800 select-none px-4 py-2 cursor-pointer ${selectedPoints.flash.includes(item.boulder) ? 'bg-green-300' : ''}`}
                  onClick={() => handlePointClick('flash', item.flash, item.boulder)}
                >
                  {item.flash}
                </td>
                <td
                  className={`border border-gray-800 select-none px-4 py-2 cursor-pointer ${selectedPoints.twoOrMore.includes(item.boulder) ? 'bg-purple-300' : ''}`}
                  onClick={() => handlePointClick('twoOrMore', item.twoOrMore, item.boulder)}
                >
                  {item.twoOrMore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={clearSelections}>
          Limpar Seleções
        </button>
      </div>

      <footer>
        <a
          href="https://instagram.com/andreocunha"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center justify-center mt-4 p-2"
        >
          <span className="text-gray-500 text-sm">Feito por</span>
          <span className="text-gray-800 text-sm font-bold ml-1 underline">André Cunha</span>
        </a>
      </footer>
    </div>
  )
}
