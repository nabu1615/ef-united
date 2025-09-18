/**
 * Formatea una fecha en formato español (día de mes de año)
 * @param dateString - String de fecha ISO
 * @returns Fecha formateada en español
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const getUserMoney = (md3S: any, userId: any) => {
  let total = 0;

  md3S?.forEach((md3: any) => {
    md3?.matches?.forEach((match: any) => {
      if (match.homeUser._id === userId) {
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

      if (match.awayUser._id === userId) {
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
