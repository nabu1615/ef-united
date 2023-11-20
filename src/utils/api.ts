import { Person, Team } from "@/types/api";
import { GraphQLClient, gql, request } from "graphql-request";

const endpoint = process.env.HYGRAPH_ENDPOINT || '';
const token = process.env.HYGRAPH_TOKEN || '';

const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
        "Authorization": `Bearer ${token}`,
        "content-type": "application/json"
    }
})

export const getPersonInfo = async (email: string) => {
    const personQuery = gql`
        query PersonQuery {
            person(where: {email: "${email}"}) {
                id
                name
                team {
                    id
                    name
                    image {
                        url
                    }
                    md3S {
                        matches {
                            homeScore
                            homeTeam {
                                name
                                image {
                                    url
                                }
                            }
                            awayScore
                            awayTeam {
                                name
                                image {
                                    url
                                }
                            }
                        }
                    }
                }
            }
        }
    `

    try {
        const data: { person: Person } = await request(endpoint, personQuery);

        return data.person;

    } catch (error) {
        console.error(error);
    }

}

export const getTeams = async () => {
    const teamsQuery = gql`
    query TeamsUnlessUser {
        teams {
            id
            name
            image {
                url
            }
        }
    }
    `

    try {
        const data: { teams: Team[] } = await request(endpoint, teamsQuery);

        return data.teams;

    } catch (error) {
        console.error(error);
    }
}