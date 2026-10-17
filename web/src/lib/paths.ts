/** Trajets de nettoyage en serpentin, pour les schémas SVG. */
export function serpentine(
  kind: "n" | "z",
  box: { x: number; y: number; w: number; h: number },
  lanes: number,
): string {
  const steps = Array.from({ length: lanes }, (_, i) => i / (lanes - 1));
  const left = box.x;
  const right = box.x + box.w;
  const top = box.y;
  const bottom = box.y + box.h;

  if (kind === "z") {
    // Passages horizontaux, de haut en bas.
    return steps
      .map((t, i) => {
        const y = top + t * box.h;
        const [from, to] = i % 2 === 0 ? [left, right] : [right, left];
        return `${i === 0 ? `M ${from} ${y}` : `V ${y}`} H ${to}`;
      })
      .join(" ");
  }

  // Passages verticaux, de gauche à droite.
  return steps
    .map((t, i) => {
      const x = left + t * box.w;
      const [from, to] = i % 2 === 0 ? [top, bottom] : [bottom, top];
      return `${i === 0 ? `M ${x} ${from}` : `H ${x}`} V ${to}`;
    })
    .join(" ");
}
