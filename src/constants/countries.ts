export type Country =
  | "CHINA"
  | "DUBAI"
  | "JAPAN"
  | "GERMANY"
  | "FRANCE"
  | "SOUTH_KOREA"
  | "USA"
  | "EUROPE";

export interface CountryInfo {
  code: Country;
  name: string;
  flag: string;
  continent: string;
  currency: string;
  description: string;
  highlights: string[];
  active: boolean;
}

export const COUNTRIES: CountryInfo[] = [
  {
    code: "CHINA",
    name: "Chine",
    flag: "🇨🇳",
    continent: "Asie",
    currency: "CNY",
    description:
      "Leader mondial de l'électrique, des SUV premium et des berlines technologiques à prix compétitifs.",
    highlights: ["BYD", "NIO", "SAIC", "Geely", "Haval"],
    active: true,
  },
  {
    code: "DUBAI",
    name: "Dubai / EAU",
    flag: "🇦🇪",
    continent: "Moyen-Orient",
    currency: "AED",
    description:
      "Marché du luxe et des véhicules haut de gamme. Excellente source de 4x4 et de supercars.",
    highlights: ["Land Rover", "Mercedes AMG", "BMW M", "Porsche", "Ferrari"],
    active: true,
  },
  {
    code: "JAPAN",
    name: "Japon",
    flag: "🇯🇵",
    continent: "Asie",
    currency: "JPY",
    description:
      "Fiabilité légendaire, faible kilométrage et entretien irréprochable. Référence qualité mondiale.",
    highlights: ["Toyota", "Lexus", "Honda", "Nissan", "Subaru"],
    active: true,
  },
  {
    code: "GERMANY",
    name: "Allemagne",
    flag: "🇩🇪",
    continent: "Europe",
    currency: "EUR",
    description:
      "L'excellence automobile européenne : BMW, Mercedes, Audi, Porsche. Ingénierie de précision.",
    highlights: ["BMW", "Mercedes-Benz", "Audi", "Porsche", "Volkswagen"],
    active: true,
  },
  {
    code: "SOUTH_KOREA",
    name: "Corée du Sud",
    flag: "🇰🇷",
    continent: "Asie",
    currency: "KRW",
    description:
      "Technologies avancées et design moderne. Meilleur rapport qualité-prix du marché.",
    highlights: ["Hyundai", "Kia", "Genesis"],
    active: true,
  },
  {
    code: "FRANCE",
    name: "France",
    flag: "🇫🇷",
    continent: "Europe",
    currency: "EUR",
    description:
      "Véhicules premium français et européens. Sélection rigoureuse de voitures de qualité.",
    highlights: ["Peugeot", "Renault", "Citroën", "DS", "Alpine"],
    active: true,
  },
  {
    code: "USA",
    name: "États-Unis",
    flag: "🇺🇸",
    continent: "Amérique du Nord",
    currency: "USD",
    description:
      "Pickups imposants, muscle cars et SUV américains. Le choix de la puissance.",
    highlights: ["Ford", "Chevrolet", "Dodge", "Cadillac", "Tesla"],
    active: true,
  },
  {
    code: "EUROPE",
    name: "Europe",
    flag: "🇪🇺",
    continent: "Europe",
    currency: "EUR",
    description:
      "Sélection multi-pays européenne : Italie, UK, Suède. Diversité et excellence.",
    highlights: ["Ferrari", "Lamborghini", "Jaguar", "Volvo", "Alfa Romeo"],
    active: true,
  },
];

export const COUNTRY_MAP = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c]),
) as Record<Country, CountryInfo>;

export function getCountryInfo(code: Country): CountryInfo {
  return COUNTRY_MAP[code] ?? COUNTRIES[0]!;
}

export function getCountryName(code: Country): string {
  return COUNTRY_MAP[code]?.name ?? code;
}

export function getCountryFlag(code: Country): string {
  return COUNTRY_MAP[code]?.flag ?? "🌍";
}
