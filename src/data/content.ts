export type PlatformKey =
  | 'Netflix'
  | 'Prime Video'
  | 'Disney+'
  | 'Max'
  | 'Apple TV+'
  | 'Globoplay';

export type ContentItem = {
  id: string;
  title: string;
  year: number;
  duration: string;
  genre: string[];
  imdb: number;
  type: 'Filme' | 'Serie';
  poster: string;
  backdrop: string;
  shortSynopsis: string;
  aiSynopsis: string;
  cast: string[];
  availableOn: PlatformKey[];
  trending?: boolean;
  recommended?: boolean;
  favorite?: boolean;
  watched?: boolean;
  watchLater?: boolean;
};

export const platformMeta: Record<
  PlatformKey,
  { color: string; short: string; url: string }
> = {
  Netflix: { color: '#e50914', short: 'N', url: 'https://www.netflix.com' },
  'Prime Video': {
    color: '#00a8e1',
    short: 'PV',
    url: 'https://www.primevideo.com',
  },
  'Disney+': {
    color: '#113ccf',
    short: 'D+',
    url: 'https://www.disneyplus.com',
  },
  Max: { color: '#6c3dff', short: 'M', url: 'https://www.max.com' },
  'Apple TV+': {
    color: '#e5e5ea',
    short: 'ATV',
    url: 'https://tv.apple.com',
  },
  Globoplay: {
    color: '#ff5a36',
    short: 'G',
    url: 'https://globoplay.globo.com',
  },
};

export const contentLibrary: ContentItem[] = [
  {
    id: 'duna-2',
    title: 'Duna: Parte Dois',
    year: 2024,
    duration: '2h 46min',
    genre: ['Ficção Científica', 'Aventura'],
    imdb: 8.5,
    type: 'Filme',
    poster:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1502139214982-d0ad755818d8?auto=format&fit=crop&w=1400&q=80',
    shortSynopsis:
      'Paul Atreides assume um destino maior enquanto guerra e profecia se chocam em Arrakis.',
    aiSynopsis:
      'Uma jornada grandiosa sobre escolhas, poder e legado. Ideal para quem curte mundos densos, visual cinematográfico forte e tensão política constante.',
    cast: ['Timothee Chalamet', 'Zendaya', 'Rebecca Ferguson'],
    availableOn: ['Max', 'Prime Video'],
    trending: true,
    recommended: true,
    favorite: true,
    watched: true,
  },
  {
    id: 'ruptura',
    title: 'Ruptura',
    year: 2022,
    duration: '2 temporadas',
    genre: ['Suspense', 'Drama'],
    imdb: 8.7,
    type: 'Serie',
    poster:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1400&q=80',
    shortSynopsis:
      'Funcionários dividem memória pessoal e profissional em um experimento corporativo perturbador.',
    aiSynopsis:
      'Curadoria para quem gosta de mistério elegante, crítica social e narrativas que deixam perguntas no ar a cada episódio.',
    cast: ['Adam Scott', 'Britt Lower', 'Patricia Arquette'],
    availableOn: ['Apple TV+'],
    recommended: true,
    favorite: true,
    watchLater: true,
  },
  {
    id: 'divertida-mente-2',
    title: 'Divertida Mente 2',
    year: 2024,
    duration: '1h 36min',
    genre: ['Animação', 'Família'],
    imdb: 7.8,
    type: 'Filme',
    poster:
      'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?auto=format&fit=crop&w=1400&q=80',
    shortSynopsis:
      'Novas emoções chegam para baguncar a central de comando de Riley na adolescencia.',
    aiSynopsis:
      'Recomendação calorosa para ver em família, com humor acessível e uma camada emocional que conversa bem com várias idades.',
    cast: ['Amy Poehler', 'Maya Hawke', 'Kensington Tallman'],
    availableOn: ['Disney+'],
    trending: true,
    watchLater: true,
  },
  {
    id: 'fallout',
    title: 'Fallout',
    year: 2024,
    duration: '1 temporada',
    genre: ['Ação', 'Ficção Científica'],
    imdb: 8.3,
    type: 'Serie',
    poster:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=80',
    shortSynopsis:
      'Sobreviventes deixam bunkers subterraneos e encaram um mundo devastado e absurdo.',
    aiSynopsis:
      'Boa pedida para quem quer ritmo alto, humor sombrio e universo pós-apocalíptico com identidade forte.',
    cast: ['Ella Purnell', 'Aaron Moten', 'Walton Goggins'],
    availableOn: ['Prime Video'],
    trending: true,
    recommended: true,
    favorite: true,
  },
  {
    id: 'o-urso',
    title: 'O Urso',
    year: 2023,
    duration: '3 temporadas',
    genre: ['Drama', 'Comédia'],
    imdb: 8.6,
    type: 'Serie',
    poster:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
    shortSynopsis:
      'Um chef premiado tenta salvar o restaurante da família enquanto lida com luto e pressão.',
    aiSynopsis:
      'Para momentos em que você quer algo intenso e humano, com diálogos afiados e energia quase caótica.',
    cast: ['Jeremy Allen White', 'Ayo Edebiri', 'Ebon Moss-Bachrach'],
    availableOn: ['Disney+'],
    recommended: true,
    watched: true,
  },
  {
    id: 'round-6',
    title: 'Round 6',
    year: 2021,
    duration: '2 temporadas',
    genre: ['Suspense', 'Ação'],
    imdb: 8,
    type: 'Serie',
    poster:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80',
    backdrop:
      'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1400&q=80',
    shortSynopsis:
      'Competidores endividados entram em jogos mortais em busca de um premio transformador.',
    aiSynopsis:
      'Sugestão para maratonar quando você busca alta tensão, crítica social direta e episódios que prendem muito.',
    cast: ['Lee Jung-jae', 'Wi Ha-jun', 'Lee Byung-hun'],
    availableOn: ['Netflix'],
    trending: true,
    favorite: true,
    watchLater: true,
  },
];

export const genres = [
  'Ação',
  'Animação',
  'Comédia',
  'Drama',
  'Família',
  'Ficção Científica',
  'Romance',
  'Suspense',
];

export const aiConversation = [
  {
    id: 'u1',
    role: 'user' as const,
    text: 'Quero algo para ver em família hoje à noite.',
  },
  {
    id: 'a1',
    role: 'assistant' as const,
    text: 'Separei opcoes leves, divertidas e com boa recepcao para diferentes idades.',
    picks: ['divertida-mente-2', 'o-urso'],
  },
  {
    id: 'u2',
    role: 'user' as const,
    text: 'E se eu quiser uma série mais intensa para depois?',
  },
  {
    id: 'a2',
    role: 'assistant' as const,
    text: 'Nesse clima, você pode ir de suspense psicológico ou distopia com mais adrenalina.',
    picks: ['ruptura', 'fallout'],
  },
];
