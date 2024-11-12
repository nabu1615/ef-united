export const getUserMoney = (md3S: any, teamId: any) => {
  let total = 0;
  md3S.forEach((md3: any) => {
    md3.matches.forEach((match: any) => {
      if (match.homeUser._id === teamId) {
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

      if (match.awayUser._id === teamId) {
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
  });

  return total;
};
