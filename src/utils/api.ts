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
                    md3S(
                      where: { documentInStages_some: { stage: PUBLISHED } }
                      first: 100) {
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
      people(first: 100) {
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

export const getPublishedMd3s = async (email: string) => {
  const md3sQuery = gql`
    query md3Points {
      person(where: {email: "${email}"}) {
        team {
          md3S(
            where: { documentInStages_some: { stage: PUBLISHED } }
            first: 100
          ) {
            matches {
              homeScore
              homeTeam {
                id
              }
              awayTeam {
                id
              }
              awayScore
              penals
            }
          }
        }
      }
    }
  `;

  try {
    const data: { person: User } = await request(endpoint, md3sQuery);

    return data.person.team;
  } catch (error) {
    console.error(error);
  }
};

export const getTeamsMD3s = async () => {
  const md3sQuery = gql`
    query md3Points {
      teams(first: 100) {
        id
        name
        md3S(
          where: { documentInStages_some: { stage: PUBLISHED } }
          first: 1000
        ) {
          matches {
            homeScore
            homeTeam {
              id
            }
            penals
            awayTeam {
              id
            }
            awayScore
          }
        }
      }
    }
  `;

  try {
    const data: { teams: Team[] } = await request(endpoint, md3sQuery);

    return data;
  } catch (error) {
    console.error(error);
  }
};
