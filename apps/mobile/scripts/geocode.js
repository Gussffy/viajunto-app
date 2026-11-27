const USER_AGENT = 'Viajunto-Faculdade/1.0 (local Expo app)';
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const addresses = [
  {
    id: 'unex',
    title: 'UNEX',
    subtitle: 'Recreio, Vitória da Conquista - BA',
    fullAddress: 'R. Ubaldino Figueira, 200 - Recreio, Vitória da Conquista - BA, 45020-510',
  },
  {
    id: 'candido-sales',
    title: 'Rua Baraúnas, 1-119',
    subtitle: 'Cândido Sales - BA',
    fullAddress: 'Rua Baraúnas, 1-119 - Cândido Sales, BA, 45157-000',
  },
  {
    id: 'barra-do-choca',
    title: 'R. João Antônio Amorim, 201',
    subtitle: 'Barra do Choça - BA',
    fullAddress: 'R. João Antônio Amorim, 201 - Barra do Choça, BA, 45120-000',
  },
  {
    id: 'brumado',
    title: 'R. Wilson Parani, 22',
    subtitle: 'Centro, Brumado - BA',
    fullAddress: 'R. Wilson Parani, 22 - Centro, Brumado - BA, 46100-000',
  },
];

async function geocode(fullAddress, fallbacks) {
  for (const query of [fullAddress, ...fallbacks]) {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');
    url.searchParams.set('countrycodes', 'br');

    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    });

    if (!response.ok) throw new Error(`Nominatim respondeu ${response.status}`);
    const results = await response.json();
    if (results.length > 0) {
      return {
        latitude: Number(results[0].lat),
        longitude: Number(results[0].lon),
        approximate: query !== fullAddress,
      };
    }

    await delay(1000);
  }

  throw new Error(`Nenhum resultado encontrado para: ${fullAddress}`);
}

async function main() {
  const values = [];

  for (let index = 0; index < addresses.length; index += 1) {
    const place = addresses[index];
    const fallbacks = [
      place.fullAddress.includes('UNEX')
        ? 'UNEX Vitória da Conquista Bahia'
        : place.fullAddress.replace(/,\s*\d{5}-?\d{3}/, ''),
      place.fullAddress.match(/Vitória da Conquista|Cândido Sales|Barra do Choça|Brumado/)?.[0] ?? '',
    ].filter(Boolean);

    const result = await geocode(place.fullAddress, fallbacks);
    values.push({ ...place, ...result });

    if (index < addresses.length - 1) await delay(1000);
  }

  console.log('\nCole os resultados em apps/mobile/data/mock-places.ts:\n');
  console.log(JSON.stringify(values, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
