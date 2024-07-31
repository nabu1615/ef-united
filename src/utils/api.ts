import { User, Team } from "@/types/api";
import { GraphQLClient, gql, request } from "graphql-request";

const endpoint = process.env.HYGRAPH_ENDPOINT || "";
const token = process.env.HYGRAPH_TOKEN || "";

const graphcms = new GraphQLClient(endpoint, {
  headers: { Authorization: `Bearer ${token}` },
});

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
                    md3S(first: 3) {
                        matches {
                            homeScore
                            homeTeam {
                                id
                                name
                                image {
                                    url
                                }
                            }
                            awayScore
                            awayTeam {
                                id
                                name
                                image {
                                    url
                                }
                            }
                            penals
                        }
                    }
                }
            }
        }
    `;

  try {
    const data: { person: User } = await request(endpoint, personQuery);

    return data.person;
  } catch (error) {
    console.error(error);
  }
};

export const getTeams = async () => {
  const teamsQuery = gql`
    query TeamsUnlessUser {
      teams(first: 100) {
        id
        name
        image {
          url
        }
      }
    }
  `;

  try {
    const data: { teams: Team[] } = await graphcms.request(teamsQuery);

    return data.teams;
  } catch (error) {
    console.error(error);
  }
};

export const getPeople = async () => {
  const peopleQuery = gql`
    query People {
      people {
        name
        team {
          id
          name
        }
      }
    }
  `;

  try {
    const data: { people: User[] } = await request(endpoint, peopleQuery);

    return data.people;
  } catch (error) {
    console.error(error);
  }
};

export const publishAsset = async (id: string) => {
  const mutation = gql`
  mutation {
    publishAsset(where: {id: "${id}"}, to: PUBLISHED) {
      id
    }
  }
  `;
  const result = await graphcms.request(mutation, {
    id,
  });

  return result;
};

export const createAsset = async () => {
  const mutation = gql`
    mutation createAsset {
      createAsset(data: {}) {
        id
        url
      }
    }
  `;
  const result = await graphcms.request(mutation);

  return result;
};
