import { getTeamColor, getTeamInitials } from '../utils/teamUtils';

interface Props {
  team: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TeamBadge({ team, size = 'md' }: Props) {
  const color = getTeamColor(team);
  const initials = getTeamInitials(team);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-md flex-shrink-0`}
      style={{ backgroundColor: color }}
      title={team}
    >
      {initials}
    </div>
  );
}
