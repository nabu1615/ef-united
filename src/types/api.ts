export interface Md3 {
  documentId: string;
  matches: Match[];
  state: string;
}

export interface User {
  documentId: string;
  name: string;
  userName: string;
  md_3_s: Md3[];
}

export interface Match {
  homeScore: number;
  homeUser: User;
  awayScore: number;
  awayUser: User;
  penals?: string;
}
