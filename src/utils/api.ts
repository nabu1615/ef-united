import { client } from "@/sanity/lib/client";

// Use a non-CDN client for GETs that must be fresh (no cache)
const freshClient = client.withConfig({ useCdn: false });

interface CreateMatchParams {
  homeUserId: string;
  homeScore: number;
  awayUserId: string;
  awayScore: number;
  penals: string;
}

export async function fetchPeople() {
  try {
    const people = await freshClient.fetch(`
    *[_type == "person"] | order(name asc) {
      _id,
      name,
      email, 
      userName
    }
      `);
    return people;
  } catch (error) {
    console.error("Error fetching people:", error);
    return null;
  }
}

export async function fetchPersonByEmail(email: string) {
  try {
    const person = await freshClient.fetch(
      `*[_type == "person" && email == $email][0]`,
      { email }
    );
    return person;
  } catch (error) {
    console.error("Error fetching person by email:", error);
    return null;
  }
}

function generateRandomKey() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export async function fetchTeams() {
  try {
    const teams = await freshClient.fetch(
      `
      *[_type == "person"] | order(name asc) {
        _id,
        name,
        md3s[]-> {
          _id,
          state,
          _createdAt,
          matches[]-> {
            _id,
            homeUser-> {
              _id,
              name,
              userName
            },
            awayUser-> {
              _id,
              name,
              userName
            },
            awayScore,
            homeScore,
            penals
          }
        }
      }
    `
    );
    return teams;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return null;
  }
}

export async function fetchUserMd3s(email: string) {
  try {
    const md3s = await freshClient.fetch(
      `
      *[_type == "person" && email == $email][0] {
        "md3s": md3s[]->| order(_createdAt desc) {
          _id,
          state,
          _createdAt,
          matches[]-> {
            _id,
            homeUser-> {
              _id,
              name,
              userName
            },
            awayUser-> {
              _id,
              name,
              userName
            },
            awayScore,
            homeScore,
            penals
          }
        }
      }
      `,
      { email }
    );
    return md3s;
  } catch (error) {
    console.error("Error fetching MD3s:", error);
    return null;
  }
}

export async function createMatch({
  homeUserId,
  homeScore,
  awayUserId,
  awayScore,
  penals,
}: CreateMatchParams) {
  {
    try {
      const newMatch = await client.create({
        _type: "match",
        homeUser: { _type: "reference", _ref: homeUserId },
        homeScore: homeScore,
        awayUser: { _type: "reference", _ref: awayUserId },
        awayScore: awayScore,
        penals: penals,
      });

      console.log("Partido creado exitosamente:", newMatch);
      return newMatch._id;
    } catch (error) {
      console.error("Error al crear el partido:", error);
    }
  }
}

export async function createMd3(
  imageId: string,
  matchIds: string[],
  users: string[]
) {
  try {
    const newMd3 = await client.create({
      _type: "md3",
      evidence: imageId
        ? { _type: "image", asset: { _type: "reference", _ref: imageId } }
        : undefined,
      state: "pending",
    });

    const homeUserId = users[0];
    const awayUserId = users[1];

    await Promise.all([
      client
        .patch(homeUserId)
        .setIfMissing({ md3s: [] })
        .append("md3s", [{ _type: "reference", _ref: newMd3._id }])
        .commit({
          autoGenerateArrayKeys: true,
        }),

      client
        .patch(awayUserId)
        .setIfMissing({ md3s: [] })
        .append("md3s", [{ _type: "reference", _ref: newMd3._id }])
        .commit({
          autoGenerateArrayKeys: true,
        }),

      client
        .patch(newMd3._id)
        .set({
          matches: matchIds.map((id) => ({ _type: "reference", _ref: id })),
        })
        .commit({
          autoGenerateArrayKeys: true,
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
    const res = await client.assets.upload("image", file);
    return res?.asset?._ref || res?.assetId || res?.asset?.id || null;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
