const clients = [
  "ADELINE ESTHER",
  "AEROWISATA",
  "ALBATROSS BSD",
  "ALPHABETH",
  "AYTHAYA WINERY",
  "BEACHBOY CANGGU",
  "BFI FINANCE",
  "BMW",
  "ERNST & YOUNG",
  "FIESTA",
  "GAPURA ANGKASA",
  "GREATMIND",
  "HASBRO",
  "HOOQ",
  "HOTEL TENTREM",
  "KHAYA LUXURY VILLAS",
  "KOKARA",
  "KOPIYOR",
  "LOUIS VUITTON",
  "MILKITA",
  "MOSS",
  "OCBC NISP",
  "ORIGIN BSD",
  "REVOLVER",
  "SARIAYU",
  "SCISSORHAND",
  "SUNSET GARDEN",
  "TASTY FRUIT",
  "WILLDER",
];

export default function ClientSection() {
  return (
    <section className="w-full bg-purple-mutu">
      <div className="max-w-screen-2xl mx-auto w-full py-20 px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex flex-row items-start justify-between">
        <div className="w-auto md:w-1/4 shrink-0 pr-6 md:pr-0">
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-medium text-yellow-mutu text-left">
            Clients
          </h2>
        </div>

        <div className="flex-1 md:w-3/4 columns-2 md:columns-3 lg:columns-3 gap-4 md:gap-8 space-y-4">
          {clients.map((client, index) => (
            <div key={index} className="break-inside-avoid mb-4">
              <span className="text-white text-xs md:text-sm lg:text-lg font-normal block">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
