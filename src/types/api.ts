export interface Person {
    id: string
    name: string
    team: Team
}

export interface Md3 {
    matches: Match[]
}

export interface Match {
    homeScore: number
    homeTeam: Team
    awayScore: number
    awayTeam: Team
}

export interface Team {
    name: string
    image: {
        url: string
    }
    md3S: Md3[]

}