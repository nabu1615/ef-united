import { query } from "@/lib/strapi";
import { client } from "@/sanity/lib/client";

interface CreateMatchParams {
  homeUserId: string;
  homeScore: number;
  awayUserId: string;
  awayScore: number;
  penals: string;
}

export async function getPersonByEmail(email: string) {
  return query(
    `people?filters[email][$eq]=${email}&populate[md_3_s][populate][matches][populate]=homeUser&populate[md_3_s][populate][matches][populate]=awayUser`
  ).then((res) => {
    return res.data[0];
  });
}

export async function getPeople() {
  return query(`people?sort=name`).then((res) => {
    return res.data;
  });
}

export async function createMatch({
  homeUserId,
  homeScore,
  awayUserId,
  awayScore,
  penals,
}: CreateMatchParams) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/matches`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            homeUser: homeUserId,
            homeScore: homeScore,
            awayUser: awayUserId,
            awayScore: awayScore,
            penals: penals,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al crear el partido: ${response.statusText}`);
    }

    const newMatch = await response.json();
    console.log("Partido creado exitosamente:", newMatch);
    return newMatch.data.id;
  } catch (error) {
    console.error("Error al crear el partido:", error);
  }
}

export async function createMd3(
  imageId: string,
  matchIds: string[],
  users: string[],
  md3sIds: string[]
) {
  try {
    // Crear el nuevo MD3 en Strapi
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/md-3s`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            evidence: imageId ? imageId : null,
            state: "pending",
            matches: [],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al crear el MD3: ${response.statusText}`);
    }

    const newMd3 = await response.json();
    const newMd3Id = newMd3.data.documentId;

    const homeUserId = users[0];
    const awayUserId = users[1];

    const awayUser = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/people/${awayUserId}?populate=md_3_s`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
      }
    );

    const awayUserData = await awayUser.json();
    const currentMd3sAway = awayUserData.data.md_3_s || [];
    const awayMd3sAwayIDs = currentMd3sAway.map((md3: any) => md3.documentId);

    // Actualizar los usuarios y el MD3 con las referencias necesarias
    await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/people/${homeUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            md_3_s: [...md3sIds, newMd3Id],
          },
        }),
      }),

      fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/people/${awayUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            md_3_s: [...awayMd3sAwayIDs, newMd3Id],
          },
        }),
      }),

      fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/md-3s/${newMd3Id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            matches: matchIds,
          },
        }),
      }),
    ]);

    console.log("MD3 creado exitosamente:", newMd3);
    return newMd3;
  } catch (error) {
    console.error("Error al crear el MD3:", error);
  }
}

export async function uploadFileHandler(file: any) {
  try {
    client.assets.upload("image", file).then((res) => {
      return res.assetId;
    });
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
