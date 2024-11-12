"use server";

import { fetchPersonByEmail, getPersonInfo } from "@/utils/api";
import { currentUser } from "@clerk/nextjs/server";

export async function getUser() {
  try {
    const userInfo = await currentUser();
    const email = userInfo?.emailAddresses[0]?.emailAddress.toLocaleLowerCase();
    const user = await fetchPersonByEmail(email!);

    return user;
  } catch (error) {
    console.error(error);
  }
}
