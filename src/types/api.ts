export interface Person {
    id: string
    name: string
    team: Team
}

export interface Team {
    name: string
    image: {
        url: string
    }
}