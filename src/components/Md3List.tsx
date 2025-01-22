import { Match, Md3, User } from "@/types/api";
import { Zen_Dots } from "next/font/google";
import { Badge } from "@/components/ui/badge";
import { getPeople } from "@/utils/api";

const zenDots = Zen_Dots({
  subsets: ["latin"],
  weight: "400",
});

function getTeamUser(people: User[], teamId: string, defaultName: string) {
  return (
    (people && people.find((person: any) => person.documentId === teamId)) || {
      name: defaultName,
    }
  );
}

const Md3List = async ({
  md3s: { matches },
  user,
}: {
  md3s: Md3;
  user: User;
}) => {
  const people = await getPeople();
  const userTeamId = user?.documentId;

  if (!matches) {
    return <div>Md3 not found</div>;
  }

  const whoWon = () => {
    const didUserWinMatch = (match: Match): boolean => {
      if (match?.homeUser?.documentId === userTeamId) {
        return (
          match?.homeScore > match?.awayScore ||
          (match?.homeScore === match?.awayScore && match?.penals === "home")
        );
      }
      if (match?.awayUser?.documentId === userTeamId) {
        // User lost the md3
        if (
          match?.awayScore > match?.homeScore ||
          (match?.awayScore === match?.homeScore && match?.penals === "away")
        ) {
          return false;
        }
      }

      return false;
    };

    for (const match of matches) {
      if (didUserWinMatch(match)) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="md3 mb-4 rounded-xl bg-slate-200 relative">
      {
        <Badge
          className="absolute -top-2 -left-2"
          variant={whoWon() ? "success" : "destructive"}
        >
          {whoWon() ? "Ganado" : "Perdido"}
        </Badge>
      }
      {matches.map((match: Match, index: number) => {
        const userHomeOrAway =
          match?.homeUser?.documentId === userTeamId ? "home" : "away";
        const wonInPenals = match?.penals && match?.penals === userHomeOrAway;
        const homeUser =
          people &&
          getTeamUser(
            people,
            match?.homeUser?.documentId,
            "Nombre Usuario Local"
          );

        console.log("homeUser", homeUser);

        const awayUser =
          people &&
          getTeamUser(
            people,
            match?.awayUser?.documentId,
            "Nombre Usuario Visitante"
          );

        return (
          <div
            className="match grid match-columns items-center border-b-2 border-solid border-slate-300 p-4 last-of-type:border-none relative"
            key={index}
          >
            <div className="flex items-center justify-end">
              <div className="text-right mb-2">
                <p className="flex font-bold text-sm slate-800 justify-end">
                  {match?.homeUser?.name}
                </p>
                <p className="text-xs font-light slate-400">
                  {homeUser?.userName}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center text-4xl flex-col">
              <div className="flex items-center">
                <p
                  className={`text-slate-800 text-lg md:text-2xl ${zenDots.className}`}
                >
                  {match?.homeScore}
                </p>
                <span className="mx-2">-</span>
                <p
                  className={`text-slate-800 text-lg md:text-2xl ${zenDots.className}`}
                >
                  {match?.awayScore}
                </p>
              </div>

              {match?.penals && (
                <div
                  className={
                    (wonInPenals ? "bg-green-500" : "bg-red-500") +
                    " text-white px-2 py-1 rounded-full text-xs text-center"
                  }
                >
                  {wonInPenals ? "Ganado" : "Perdido"} en penales
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div className="text-left mb-2">
                <p className="flex font-bold text-sm slate-800">
                  {match?.awayUser.name}
                </p>
                <p className="text-xs font-light slate-400">
                  {awayUser?.userName}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Md3List;
