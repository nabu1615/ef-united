import React from "react";

import { BellRing } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPublishedMd3s } from "@/utils/api";
import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "@/server/get-user";

export async function UserPoints() {
  const userInfo = await currentUser();
  const email = userInfo?.emailAddresses[0]?.emailAddress.toLocaleLowerCase();
  const { md3S }: any = (await getPublishedMd3s(email!)) ?? [];
  const user = await getUser();

  const money = md3S.map((md3: any) => {
    let total = 0;
    const userTeamId = user?.team.id;

    md3.matches.forEach((match: any) => {
      if (match.homeTeam.id === userTeamId) {
        if (match.homeScore > match.awayScore) {
          total += 600;
        }

        if (match.homeScore === match.awayScore) {
          if (match.penals === "home") {
            total += 600;
          } else if (match.penals === "away") {
            total += 300;
          }
        }

        if (match.awayScore > match.homeScore) {
          total += 100;
        }
      }

      if (match.awayTeam.id === userTeamId) {
        if (match.homeScore > match.awayScore) {
          total += 100;
        }

        if (match.awayScore > match.homeScore) {
          total += 600;
        }

        if (match.awayScore === match.homeScore) {
          if (match.penals === "away") {
            total += 600;
          } else if (match.penals === "home") {
            total += 300;
          }
        }
      }
    });

    return total;
  });

  const sum = money.reduce((a: number, b: number) => a + b, 0);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formattedNumber = formatter.format(sum);

  const possibleToEarn = 40000 - sum;
  const userCanEarn = possibleToEarn > 0;

  return (
    <Card>
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-lg">Dinero Sumado</CardTitle>
        <CardDescription>
          Esto es lo que has ganado por tus Md3s.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <div className="text-2xl font-bold">{formattedNumber}</div>
        </div>
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <BellRing />
          <div className="flex-1">
            <p className="text-sm font-medium leading-none">
              Aun puedes sumar
              <div className="text-lg font-bold">
                {userCanEarn ? formatter.format(possibleToEarn) : "$" + 0}
              </div>
            </p>
            {userCanEarn ? (
              <p className="text-xs text-muted-foreground m-0">
                antes de alcanzar el limite de dinero sumado por Md3s.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground text-red-600">
                Has alcanzado el limite de dinero sumado por Md3s.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
