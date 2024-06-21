import { Match, Md3 } from "@/types/api";
import { Zen_Dots } from "next/font/google";

const zenDots = Zen_Dots({
  subsets: ["latin"],
  weight: "400",
});

const Md3List = ({ md3s: { matches } }: { md3s: Md3 }) => {
  if (!matches) {
    return <div>Md3 not found</div>;
  }

  return (
    <div className="md3 mb-4 rounded-xl bg-slate-200">
      {matches.map((md3: Match, index: number) => {
        const userWon = md3.homeScore > md3.awayScore;

        return (
          <div
            className="match grid match-columns items-center border-b-2 border-solid border-slate-300 p-4 last-of-type:border-none"
            key={index}
          >
            <div className="flex items-center justify-end">
              <div className="text-right">
                <p className=" font-light text-sm slate-800">
                  {md3.homeTeam.name}
                </p>
                <p className=" text-xs font-light slate-400">Nombre usuario</p>
              </div>
              <div className=" bg-white rounded-full ml-3 min-w-10 min-h-10 flex flex-col justify-center items-center ">
                <img
                  src={md3.homeTeam.image.url}
                  width={30}
                  alt={md3.homeTeam.name}
                />
              </div>
            </div>
            <div className="flex justify-center items-center text-4xl">
              <p className={`text-slate-800 text-2xl ${zenDots.className}`}>
                {md3.homeScore}
              </p>
              <span className="mx-2">-</span>
              <p className={`text-slate-800 text-2xl ${zenDots.className}`}>
                {md3.awayScore}
              </p>
            </div>
            <div className="flex items-center">
              <div className=" bg-white rounded-full mr-3 min-w-10 min-h-10 flex flex-col justify-center items-center ">
                <img
                  src={md3.awayTeam.image.url}
                  width={30}
                  alt={md3.awayTeam.name}
                />
              </div>

              <div className="text-left">
                <p className=" font-light text-sm slate-800">
                  {md3.awayTeam.name}
                </p>
                <p className=" text-xs font-light slate-400">Nombre usuario</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Md3List;
