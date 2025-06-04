import { useEffect, useState } from 'react';
import { getDistance } from 'geolib';

const curitiba = { latitude: -25.4284, longitude: -49.2733 };

export default function ConcursosParana() {
  const [concursos, setConcursos] = useState([]);

  useEffect(() => {
    fetch('/dados-concursos.json')
      .then(res => res.json())
      .then(async data => {
        const atualizados = await Promise.all(data.map(async concurso => {
          const coords = await getCoords(concurso.cidade);
          if (coords) {
            concurso.distancia = (getDistance(coords, curitiba) / 1000).toFixed(1);
          }
          return concurso;
        }));
        setConcursos(atualizados);
      });
  }, []);

  async function getCoords(cidade) {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cidade)}&format=json`);
    const json = await res.json();
    if (json[0]) {
      return {
        latitude: parseFloat(json[0].lat),
        longitude: parseFloat(json[0].lon)
      };
    }
    return null;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Concursos para Engenheiro Civil no Paraná</h1>
      <ul>
        {concursos.map((c, i) => (
          <li key={i}>
            <a href={c.link} target="_blank" rel="noreferrer">{c.titulo}</a>
            <div>{c.cidade}</div>
            {c.distancia && <div>Distância até Curitiba: {c.distancia} km</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}