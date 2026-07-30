export type EntityCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export const SYMBOLOGY: Record<string, EntityCategory> = {
  portos: { id: 'portos', name: 'Portos', color: '#2563EB', icon: '⚓' },
  fortificacoes: { id: 'fortificacoes', name: 'Fortificações', color: '#B91C1C', icon: '🏰' },
  objetos: { id: 'objetos', name: 'Objetos históricos', color: '#D97706', icon: '🏺' },
  documentos: { id: 'documentos', name: 'Documentos', color: '#16A34A', icon: '📜' },
  cartas: { id: 'cartas', name: 'Cartas Náuticas', color: '#0F766E', icon: '🗺️' },
  pessoas: { id: 'pessoas', name: 'Pessoas', color: '#7C3AED', icon: '👤' },
  quilombos: { id: 'quilombos', name: 'Comunidades Quilombolas', color: '#92400E', icon: '🛖' },
  indigenas: { id: 'indigenas', name: 'Povos Indígenas', color: '#15803D', icon: '🌿' },
  embarcacoes: { id: 'embarcacoes', name: 'Embarcações', color: '#1E3A8A', icon: '⛵' },
  batalhas: { id: 'batalhas', name: 'Batalhas', color: '#EF4444', icon: '⚔' },
  religiao: { id: 'religiao', name: 'Missões religiosas', color: '#6B7280', icon: '⛪' },
  arqueologia: { id: 'arqueologia', name: 'Sítios Arqueológicos', color: '#B45309', icon: '⛰' },
  eventos: { id: 'eventos', name: 'Eventos históricos', color: '#FBBF24', icon: '⭐' },
  colecoes: { id: 'colecoes', name: 'Coleções', color: '#4F46E5', icon: '📦' },
  museus: { id: 'museus', name: 'Museus', color: '#1E40AF', icon: '🏛' },
  orais: { id: 'orais', name: 'Fontes Orais', color: '#EC4899', icon: '🎙' },
  fotografias: { id: 'fotografias', name: 'Fotografias', color: '#06B6D4', icon: '📷' },
  gravuras: { id: 'gravuras', name: 'Gravuras', color: '#78350F', icon: '🖼' },
  videos: { id: 'videos', name: 'Vídeos', color: '#DC2626', icon: '▶' },
  audios: { id: 'audios', name: 'Áudios', color: '#C084FC', icon: '🔊' },
};
