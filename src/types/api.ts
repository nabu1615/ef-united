export interface User {
  _id: string;
  name: string;
  userName: string;
  md3s: Md3[];
}

export interface Md3 {
  matches: Match[];
  state: string;
}

export interface Match {
  homeScore: number;
  homeUser: User;
  awayScore: number;
  awayUser: User;
  penals?: string;
}
