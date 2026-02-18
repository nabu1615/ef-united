"use client";

import Login from "@/components/Login";
import { Fragment } from "react";
import {
  deleteMd3s,
  deleteMatches,
  deleteAllMd3s,
  deleteAllMatches,
} from "@/sanity/lib/deleteMd3s";

export default function Home() {
  return (
    <Fragment>
      <Login />
      {/* 
      <div className="m-3">
        <h1>Estamos revisando sus MD3s, vuelva luego.</h1>
        <button onClick={deleteMd3s} className="mr-2">
          Delete MD3s
        </button>
        <button onClick={deleteMatches}>Delete Matches</button>
        <button onClick={deleteAllMd3s} className="ml-2">
          {" "}
          Delete All MD3s
        </button>
        <button onClick={deleteAllMatches} className="ml-2">
          Delete All Matches
        </button>
      </div> */}
    </Fragment>
  );
}
