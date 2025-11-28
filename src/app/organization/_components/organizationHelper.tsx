export default function formatPriceCategory(priceCategory: string) {
  switch (priceCategory) {
    case 'FREE':
      return (
        <div className="text-base inline-block px-4 rounded-xl border border-accent-emerald font-semibold bg-accent-emerald-light text-accent-emerald">
          <p>FREE</p>
        </div>
      );
    case 'LOW':
      return (
        <div className="text-base inline-block px-4 rounded-xl border border-accent-blue font-semibold bg-accent-blue-light text-accent-blue">
          <p>€</p>
        </div>
      );
    case 'MEDIUM':
      return (
        <div className="text-base inline-block px-4 rounded-xl border border-accent-blue font-semibold bg-accent-blue-light text-accent-blue">
          <p>€€</p>
        </div>
      );
    case 'HIGH':
      return (
        <div className="text-base inline-block px-4 rounded-xl border border-accent-blue font-semibold bg-accent-blue-light text-accent-blue">
          <p>€€€</p>
        </div>
      );
    default:
      return (
        <div className="text-base inline-block px-4 rounded-xl border border-blue font-semibold bg-accent-blue-light text-accent-blue">
          <p>Keine Angabe.</p>
        </div>
      );
  }
}
