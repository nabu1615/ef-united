import { Person } from "@/types/api";
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
                    name
                    image {
                        url
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