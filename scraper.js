const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://www.pciconcursos.com.br/vagas/engenheiro-civil-pr';

async function scrapeConcursos() {
  const { data } = await axios.get(URL);
  const $ = cheerio.load(data);
  const concursos = [];

  $('.ca').each((i, el) => {
    const texto = $(el).text();
    const link = $(el).find('a').attr('href');
    const cidade = texto.match(/em ([\w\s]+-PR)/i)?.[1] || 'PR';

    if (texto.toLowerCase().includes('engenheiro civil')) {
      concursos.push({
        titulo: texto.trim(),
        link: 'https://www.pciconcursos.com.br' + link,
        cidade,
      });
    }
  });

  fs.writeFileSync('./src/dados-concursos.json', JSON.stringify(concursos, null, 2));
  console.log('✅ Arquivo de concursos atualizado!');
}

scrapeConcursos();