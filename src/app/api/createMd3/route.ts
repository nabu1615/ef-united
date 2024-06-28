import { NextResponse } from "next/server";
import { GraphQLClient } from "graphql-request";

const CREATE_MD3_MUTATION = `
  mutation createMd3($matches: [MatchWhereUniqueInput!]!, $teams: [TeamWhereUniqueInput!]!, $evidence: [AssetWhereUniqueInput!]!) {
    createMd3(data: {
      matches: { connect: $matches }, 
      teams: { connect: $teams },
      evidence: { connect: $evidence }
    }) {
      teams {
        id
      }
      matches {
        id
      }
    }
  }
`;

export async function POST(request: Request) {
  const { matches, teams, evidence } = await request.json();

  const graphQLEndpoint = process.env.HYGRAPH_ENDPOINT || "";
  const token = process.env.HYGRAPH_TOKEN || "";

  const graphcms = new GraphQLClient(graphQLEndpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  try {
    // Crear el md3
    const createMd3Response: any = await graphcms.request(CREATE_MD3_MUTATION, {
      matches: matches,
      teams: teams,
      evidence: evidence,
    });

    return NextResponse.json({
      message: "Md3 creado",
      teams: createMd3Response.createMd3.teams,
    });
  } catch (error) {
    console.error("Error creando el MD3", error);
    return NextResponse.json(
      { error: "Error creando el MD3" },
      { status: 500 }
    );
  }
}
