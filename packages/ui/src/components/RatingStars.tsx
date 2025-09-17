interface RatingStarsProps {
  /**
   * The value to render, typically between 1 and 5.  Fractional values are
   * supported to one decimal place (e.g., 3.5 will show a half‑filled star).
   */
  value: number;
}

/**
 * RatingStars displays a row of five star glyphs representing the given
 * numeric rating.  It uses Unicode stars rather than external icon
 * libraries to minimise dependencies.  A fractional value will result in
 * a half‑filled star.
 */
export function RatingStars({ value }: RatingStarsProps) {
  const filledCount = Math.floor(value);
  const hasHalf = value - filledCount >= 0.5;
  return (
    <span className="flex space-x-0.5 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < filledCount) {
          return <span key={i}>★</span>;
        }
        if (i === filledCount && hasHalf) {
          return <span key={i}>☆</span>;
        }
        return <span key={i} className="text-gray-300">★</span>;
      })}
    </span>
  );
}
