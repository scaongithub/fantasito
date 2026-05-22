export interface Match {
  homeTeam: string;
  awayTeam: string;
  homeFantaPoints: number;
  awayFantaPoints: number;
  homeGoals: number;
  awayGoals: number;
  result: string;
  played: boolean;
}

export interface Matchday {
  number: number;
  serieAMatchday: number | null;
  matches: Match[];
}

export interface SeasonData {
  leagueName: string;
  leagueUrl: string;
  teams: string[];
  matchdays: Matchday[];
}

export interface TeamStanding {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  fantaPointsFor: number;
  fantaPointsAgainst: number;
}

export interface H2HRecord {
  teamA: string;
  teamB: string;
  winsA: number;
  winsB: number;
  draws: number;
  goalsA: number;
  goalsB: number;
  matches: Match[];
}

export interface TeamStreak {
  team: string;
  longestWinStreak: number;
  longestLossStreak: number;
  longestUnbeatenStreak: number;
  longestDrawStreak: number;
  currentForm: ('W' | 'D' | 'L')[];
}

export interface MatchdayAward {
  matchday: number;
  highestScore: { team: string; points: number };
  lowestScore: { team: string; points: number };
  biggestWin: { home: string; away: string; margin: number; result: string };
  closestMatch: { home: string; away: string; diff: number; result: string };
}

export interface MatchdayKing {
  matchday: number;
  kings: { team: string; points: number }[];
}

export interface KingLeaderboard {
  team: string;
  crowns: number;
}
