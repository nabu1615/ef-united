import { NextResponse } from "next/server";
import { GraphQLClient } from "graphql-request";

const CREATE_MATCH_MUTATION = `
mutation CreateMatch($homeTeamId: ID!, $awayTeamId: ID!, $homeScore: Int!, $awayScore: Int!, $penals: String) {
  createMatch(
    data: {
      homeTeam: { connect: { id: $homeTeamId } }
      awayTeam: { connect: { id: $awayTeamId } }
      homeScore: $homeScore
      awayScore: $awayScore
      penals: $penals
    }
  ) {
    id
  }
}
`;

const PUBLISH_MATCH_MUTATION = `
mutation PublishMatch($id: ID!) {
  publishMatch(where: { id: $id }, to: PUBLISHED) {
    id,
    homeTeam {
      id
    }
    awayTeam {
      id
    }
  }
}
`;

export async function POST(request: Request) {
  const { homeTeamId, awayTeamId, homeScore, awayScore, penals } =
    await request.json();

  const graphQLEndpoint = process.env.HYGRAPH_ENDPOINT || "";
  const token = process.env.HYGRAPH_TOKEN || "";

  const graphcms = new GraphQLClient(graphQLEndpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  try {
    // Crear el Match
    const createMatchResponse: any = await graphcms.request(
      CREATE_MATCH_MUTATION,
      {
        homeTeamId,
        awayTeamId,
        homeScore,
        awayScore,
        penals,
      }
    );

    const matchId = createMatchResponse.createMatch.id;

    // Publicar el Match
    const publishMatchResponse: any = await graphcms.request(
      PUBLISH_MATCH_MUTATION,
      {
        id: matchId,
      }
    );

    return NextResponse.json({
      message: "Match creado y publicado",
      matchId: publishMatchResponse.publishMatch.id,
      homeTeamId: publishMatchResponse.publishMatch.homeTeam.id,
      awayTeamId: publishMatchResponse.publishMatch.awayTeam.id,
    });
  } catch (error) {
    console.error("Error creando y publicando el match:", error);
    return NextResponse.json(
      { error: "Error creando y publicando el match" },
      { status: 500 }
    );
  }
}
