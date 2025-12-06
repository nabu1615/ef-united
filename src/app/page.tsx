"use client";

import Login from "@/components/Login";
import { Fragment } from "react";
import { deleteMd3s, deleteMatches } from "@/sanity/lib/deleteMd3s";

export default function Home() {
  return (
    <Fragment>
      <Login />
      {/*       <div className="m-3">
        <h1>Estamos revisando sus MD3s, vuelva luego.</h1>
        <button onClick={deleteMd3s} className="mr-2">
          Delete MD3s
        </button>
        <button onClick={deleteMatches}>Delete Matches</button>
      </div> */}
    </Fragment>
  );
}
