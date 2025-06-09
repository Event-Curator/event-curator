export default function FormattedPrice({ price }: { price: number }) {
  if (price === undefined || price === null) return "-";

  return price === 0 ? (
    <span className="text-green-600 font-semibold">Free Entry</span>
  ) : (
    <>¥{price.toLocaleString()}</>
  );
}
