import React from "react";

import { BellRing } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getUserMoney } from "@/utils/utils";

export async function UserPoints({ md3Approved, id }: any) {
  const money = getUserMoney(md3Approved, id);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formattedNumber = formatter.format(money);

  const possibleToEarn = 40000 - money;
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
              Aun puedes sumar{" "}
              <span className="text-lg font-bold">
                {userCanEarn ? formatter.format(possibleToEarn) : "$" + 0}
              </span>
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
