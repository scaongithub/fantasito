// Assegnazione colori squadre per grafici e badge
const TEAM_COLORS: Record<string, string> = {
  'AC SELVAGGIO LEORIN': '#e74c3c',
  'FC BARCIOLONA': '#3498db',
  'FC POGGITOMMI': '#2ecc71',
  'Forette indipendente': '#9b59b6',
  'Isolalta 1312': '#f39c12',
  'Mama che bela Troia': '#e91e63',
  'Niccardo Biglia Intimo': '#00bcd4',
  'Notte prima degli Asllani': '#1a237e',
  'Salta che ti passa': '#ff9800',
  'Team NZ': '#4caf50',
  'Veltins Club': '#607d8b',
  'sca eagles': '#795548',
};

export function getTeamColor(team: string): string {
  return TEAM_COLORS[team] || '#888888';
}

export function getTeamInitials(team: string): string {
  return team
    .split(' ')
    .filter(w => w.length > 1 || w === w.toUpperCase())
    .map(w => w[0].toUpperCase())
    .slice(0, 3)
    .join('');
}

export function getTeamEmoji(position: number): string {
  if (position === 1) return '🏆';
  if (position === 2) return '🥈';
  if (position === 3) return '🥉';
  if (position <= 6) return '✅';
  if (position <= 10) return '⚠️';
  return '💀';
}

export function getFormDot(result: 'W' | 'D' | 'L'): { color: string; label: string } {
  switch (result) {
    case 'W': return { color: '#22c55e', label: 'W' };
    case 'D': return { color: '#f59e0b', label: 'D' };
    case 'L': return { color: '#ef4444', label: 'L' };
  }
}
