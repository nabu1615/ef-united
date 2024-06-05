import { Match, Md3 } from "@/types/api";

const Md3List = ({ md3s: { matches } }: { md3s: Md3 }) => {
  if (!matches) {
    return <div>Md3 not found</div>;
  }

  return (
    <div className="md3 bg-white rounded shadow-md px-10 mb-4">
      {matches.map((md3: Match, index: number) => {
        return (
          <div className="match grid grid-cols-3 items-center m-4" key={index}>
            <div className="flex flex-col items-center">
              <img
                className="m-2"
                src={md3.homeTeam.image.url}
                width={40}
                alt={md3.homeTeam.name}
              />
              <p className="text-center text-bold text-sm">
                {md3.homeTeam.name}
              </p>
            </div>
            <div className="flex justify-center text-4xl mx-4">
              <p>{md3.homeScore}</p>
              <span className="mx-2">-</span>
              <p>{md3.awayScore}</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                className="m-2"
                src={md3.awayTeam.image.url}
                width={40}
                alt={md3.awayTeam.name}
              />
              <p className="text-center text-bold text-sm">
                {md3.awayTeam.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Md3List;
