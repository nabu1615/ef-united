export interface User {
  id: string;
  name: string;
  team: Team;
}

export interface Md3 {
  matches: Match[];
}

export interface Match {
  homeScore: number;
  homeTeam: Team;
  awayScore: number;
  awayTeam: Team;
  penals?: string;
}

export interface Team {
  id: string;
  name: string;
  image: {
    url: string;
  };
  md3S: Md3[];
}
