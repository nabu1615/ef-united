"use server";

import { getPersonInfo } from "@/utils/api";
import { currentUser } from "@clerk/nextjs";

export async function getUser() {
  try {
    const userInfo = await currentUser();
    const email = userInfo?.emailAddresses[0]?.emailAddress;
    const user = await getPersonInfo(email!);

    return user;
  } catch (error) {
    console.error(error);
  }
}
