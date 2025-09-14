import React, { Fragment } from "react";
import Md3List from "@/components/Md3List";
import { Md3, User } from "@/types/api";
import CreateMd3 from "@/components/CreateMd3";
import { getUser } from "@/server/get-user";
import { UserNotFound } from "@/components/UserNotFound";
import { fetchPeople, fetchUserMd3s } from "@/utils/api";
import { UserPoints } from "@/components/UserPoints";

const Dashboard = async () => {
  const user = await getUser();
  const email = user?.email;
  const md3Response = await fetchUserMd3s("jedi7diego@gmail.com");

  const md3ApprovedAndPending = md3Response?.md3s?.filter(
    (md3: Md3) => md3.state !== "rejected"
  );

  const md3Approved = md3Response?.md3s?.filter(
    (md3: Md3) => md3.state === "approved"
  );
  const users = (await fetchPeople()) as User[];

  if (!user) {
    return <UserNotFound />;
  }

  return (
    <Fragment>
      <div className="bg-slate-100 px-6 rounded-xl w-full md:w-3/4 py-8">
        <p className="text-center">
          {" "}
          Estamos revisando sus MD3s, vuelva pronto para ver sus puntos y MD3s
          aprobados.
        </p>
      </div>
    </Fragment>
  );
};

export default Dashboard;
