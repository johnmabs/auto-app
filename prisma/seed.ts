import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const db = new PrismaClient({
  adapter,
});

/* ── Véhicules réalistes ─────────────────────────────────── */
const VEHICLES = [
  {
    make: "BMW",
    model: "X7",
    variant: "M50i xDrive",
    year: 2023,
    type: "SUV",
    fuelType: "GASOLINE",
    transmission: "AUTOMATIC",
    engine: "4.4L V8 Biturbo",
    power: 530,
    torque: 750,
    mileage: 18200,
    color: "Blanc Alpine",
    interiorColor: "Cuir Noir Merino",
    price: 10800000,
    comparePrice: 110000,
    status: "AVAILABLE",
    originCountry: "GERMANY",
    isFeatured: true,
    isPopular: true,
    acceleration: 4.7,
    topSpeed: 250,
    consumption: 12.1,
    doors: 5,
    seats: 7,
    features: [
      "Toit panoramique",
      "Massage sièges",
      "Affichage tête haute",
      "Parking automatique",
      "Son Harman/Kardon",
      "Ventilation sièges",
    ],
    description:
      "BMW X7 M50i en excellent état, importée directement d'Allemagne. Full options, entretien BMW, carnet à jour. Un SUV de luxe absolu.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
        publicId: "bmw-x7-1",
        isPrimary: true,
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800",
        publicId: "bmw-x7-2",
        isPrimary: false,
        order: 1,
      },
    ],
  },
  {
    make: "Mercedes-Benz",
    model: "GLE 450",
    variant: "AMG Line",
    year: 2023,
    type: "SUV",
    fuelType: "HYBRID",
    transmission: "AUTOMATIC",
    engine: "3.0L I6 MHEV",
    power: 367,
    torque: 500,
    mileage: 12400,
    color: "Noir Obsidien",
    interiorColor: "Cuir Beige",
    price: 19500000,
    status: "AVAILABLE",
    originCountry: "GERMANY",
    isFeatured: false,
    isPopular: true,
    acceleration: 5.7,
    topSpeed: 250,
    consumption: 8.2,
    doors: 5,
    seats: 5,
    features: [
      "Burmester 3D",
      "Assistance conduite",
      "360° caméras",
      "Suspension pneumatique",
      "MBUX",
    ],
    description:
      "Mercedes GLE 450 hybride, la symbiose parfaite entre luxe et efficience. Importée depuis l'Allemagne avec toutes les options.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
        publicId: "gle-1",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    make: "BYD",
    model: "Tang",
    variant: "EV 2024",
    year: 2024,
    type: "SUV",
    fuelType: "ELECTRIC",
    transmission: "AUTOMATIC",
    engine: "Électrique Dual Motor AWD",
    power: 517,
    torque: 700,
    mileage: 4100,
    color: "Bleu Galactique",
    interiorColor: "Cuir Blanc",
    price: 12000000,
    status: "AVAILABLE",
    originCountry: "CHINA",
    isFeatured: true,
    isPopular: false,
    acceleration: 4.6,
    topSpeed: 190,
    consumption: 0,
    autonomy: 530,
    doors: 5,
    seats: 7,
    features: [
      "Autonomie 530 km",
      "Charge rapide 150kW",
      'Écran 15.6"',
      "DiLink 4.0",
      "ADAS niveau 2",
    ],
    description:
      "BYD Tang EV 2024, le SUV électrique premium chinois. Autonomie record, technologie de pointe, confort luxueux.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
        publicId: "byd-1",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    make: "Toyota",
    model: "Land Cruiser",
    variant: "VX 300",
    year: 2022,
    type: "SUV",
    fuelType: "DIESEL",
    transmission: "AUTOMATIC",
    engine: "3.3L V6 Twin Turbo",
    power: 309,
    torque: 700,
    mileage: 28000,
    color: "Blanc Perle",
    interiorColor: "Cuir Brun",
    price: 9400000,
    status: "AVAILABLE",
    originCountry: "DUBAI",
    isFeatured: false,
    isPopular: true,
    acceleration: 7.2,
    topSpeed: 210,
    consumption: 9.5,
    doors: 5,
    seats: 7,
    features: [
      "4x4 permanent",
      "Différentiel arrière",
      "Multi-Terrain Select",
      "Kinetic Dynamic Suspension",
    ],
    description:
      "Land Cruiser VX importé depuis Dubai. Le légendaire tout-terrain de Toyota, fiabilité absolue et confort premium.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        publicId: "lc-1",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    make: "Lexus",
    model: "RX 500h",
    variant: "F-Sport Performance",
    year: 2024,
    type: "SUV",
    fuelType: "HYBRID",
    transmission: "AUTOMATIC",
    engine: "2.4L Turbo Hybride PHEV",
    power: 371,
    torque: 550,
    mileage: 2200,
    color: "Argent Atomium",
    interiorColor: "Cuir Rouge F-Sport",
    price: 68000000,
    status: "AVAILABLE",
    originCountry: "JAPAN",
    isFeatured: true,
    isPopular: false,
    acceleration: 5.8,
    topSpeed: 200,
    consumption: 6.2,
    doors: 5,
    seats: 5,
    features: [
      "Mark Levinson Premium",
      'Lexus Interface 14"',
      "Toit panoramique",
      "Sièges chauffants/ventilés",
    ],
    description:
      "Lexus RX 500h F-Sport, le SUV sportif hybride de référence. Importé directement du Japon avec 2 200 km seulement.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
        publicId: "rx-1",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    make: "Range Rover",
    model: "Sport",
    variant: "Autobiography P575",
    year: 2023,
    type: "SUV",
    fuelType: "GASOLINE",
    transmission: "AUTOMATIC",
    engine: "5.0L V8 Superchargé",
    power: 575,
    torque: 700,
    mileage: 8900,
    color: "Vert British Racing",
    interiorColor: "Cuir Windsor Crème",
    price: 11200000,
    comparePrice: 14500000,
    status: "AVAILABLE",
    originCountry: "DUBAI",
    isFeatured: true,
    isPopular: true,
    acceleration: 4.5,
    topSpeed: 250,
    consumption: 14.5,
    doors: 5,
    seats: 5,
    features: [
      "Meridian Signature 1600W",
      "Écrans arrière",
      "Réfrigérateur",
      "Massage 4 zones",
      "Head-Up Display",
    ],
    description:
      "Range Rover Sport Autobiography P575, le SUV sportif ultime. Un exceptionnel de Dubai en parfait état.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800",
        publicId: "rr-1",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    make: "Porsche",
    model: "Cayenne",
    variant: "GTS Coupé",
    year: 2023,
    type: "SUV",
    fuelType: "GASOLINE",
    transmission: "PDK",
    engine: "4.0L V8 Biturbo",
    power: 460,
    torque: 620,
    mileage: 14300,
    color: "Gris Quartz Métallisé",
    interiorColor: "Cuir Race-Tex Bordeaux",
    price: 9600000,
    status: "TRANSIT",
    originCountry: "GERMANY",
    isFeatured: false,
    isPopular: false,
    acceleration: 4.5,
    topSpeed: 263,
    consumption: 13.0,
    doors: 5,
    seats: 5,
    features: [
      "Sport Chrono Package",
      "PASM Sport",
      "Bose Surround Sound",
      "Sièges sport adaptatifs",
    ],
    description:
      "Porsche Cayenne GTS Coupé, la sportivité et le luxe au sommet. En transit depuis l'Allemagne.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800",
        publicId: "pca-1",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    make: "Audi",
    model: "Q8 e-tron",
    variant: "55 Quattro S-Line",
    year: 2024,
    type: "SUV",
    fuelType: "ELECTRIC",
    transmission: "AUTOMATIC",
    engine: "Électrique Quattro AWD",
    power: 408,
    torque: 664,
    mileage: 3800,
    color: "Bleu Chronos Métallisé",
    interiorColor: "Cuir Milano Gris",
    price: 7400000,
    status: "AVAILABLE",
    originCountry: "GERMANY",
    isFeatured: false,
    isPopular: false,
    acceleration: 5.6,
    topSpeed: 200,
    consumption: 0,
    autonomy: 487,
    doors: 5,
    seats: 5,
    features: [
      "Bang & Olufsen 3D",
      "Virtual Cockpit Plus",
      "Matrix LED",
      "Air Suspension Adaptative",
    ],
    description:
      "Audi Q8 e-tron, la transition premium vers l'électrique. Puissance, technologie et luxe allemand.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1614777986387-015c2890b6dc?w=800",
        publicId: "q8-1",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    make: "Hyundai",
    model: "IONIQ 6",
    variant: "Long Range AWD",
    year: 2024,
    type: "SEDAN",
    fuelType: "ELECTRIC",
    transmission: "AUTOMATIC",
    engine: "Électrique Dual Motor AWD",
    power: 325,
    torque: 605,
    mileage: 1200,
    color: "Blanc Cygne",
    interiorColor: "Tissu recyclé Gris",
    price: 38500000,
    status: "AVAILABLE",
    originCountry: "SOUTH_KOREA",
    isFeatured: false,
    isPopular: false,
    acceleration: 5.1,
    topSpeed: 185,
    consumption: 0,
    autonomy: 519,
    doors: 4,
    seats: 5,
    features: [
      "Charge 800V ultra-rapide",
      "Câblage bord à bord",
      "Vehicle-to-Load",
      "BOSE Premium",
    ],
    description:
      "Hyundai IONIQ 6 AWD, la berline électrique aérodynamique coréenne. Prix accessible, technologie de pointe.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800",
        publicId: "ioniq-1",
        isPrimary: true,
        order: 0,
      },
    ],
  },
  {
    make: "Tesla",
    model: "Model Y",
    variant: "Performance",
    year: 2023,
    type: "SUV",
    fuelType: "ELECTRIC",
    transmission: "AUTOMATIC",
    engine: "Dual Motor AWD",
    power: 480,
    torque: 660,
    mileage: 9500,
    color: "Rouge Multi-Couches",
    interiorColor: "Cuir Blanc Crème",
    price: 54000000,
    status: "AVAILABLE",
    originCountry: "USA",
    isFeatured: false,
    isPopular: true,
    acceleration: 3.7,
    topSpeed: 250,
    consumption: 0,
    autonomy: 514,
    doors: 5,
    seats: 5,
    features: [
      "Autopilot",
      'Écran 15.4"',
      "Supercharge 250kW",
      "Mise à jour OTA",
      "Caméras 360°",
    ],
    description:
      "Tesla Model Y Performance importé des États-Unis. Le SUV électrique le plus vendu au monde.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
        publicId: "tmy-1",
        isPrimary: true,
        order: 0,
      },
    ],
  },
];

/* ── Seed function ───────────────────────────────────────── */
async function main() {
  console.log("🌱 Démarrage du seed...\n");

  /* ── Nettoyage ────────────────────────────────────────── */
  console.log("🗑  Nettoyage de la base de données...");
  await db.auditLog.deleteMany();
   await db.customerRequest.deleteMany();
  await db.vehicleImage.deleteMany();
   await db.vehicle.deleteMany();
   await db.session.deleteMany();
   await db.account.deleteMany();
   await db.user.deleteMany();
  console.log("   ✓ Base nettoyée\n");

  /* ── Admins ───────────────────────────────────────────── */
  console.log("👤 Création des utilisateurs admin...");
  const hashedPassword = await bcrypt.hash("AutoStore2025!", 12);

  const superAdmin = await db.user.create({
    data: {
      name: "Admin Principal",
      email: "admin@autostore-cg.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  await db.user.create({
    data: {
      name: "Sophie Martin",
      email: "s.martin@autostore-cg.com",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log("   ✓ 2 utilisateurs créés\n");

  /* ── Véhicules ────────────────────────────────────────── */
  console.log("🚗 Création des véhicules...");
  for (const v of VEHICLES) {
    const { images, ...vehicleData } = v;

    const slug = `${vehicleData.make.toLowerCase()}-${vehicleData.model.toLowerCase().replace(/\s+/g, "-")}-${vehicleData.year}-${Math.random().toString(36).slice(2, 8)}`;

    const vehicle = await db.vehicle.create({
      data: {
        ...vehicleData,
        slug,
        type: vehicleData.type as never,
        fuelType: vehicleData.fuelType as never,
        transmission: vehicleData.transmission as never,
        status: vehicleData.status as never,
        originCountry: vehicleData.originCountry as never,
        publishedAt: vehicleData.status === "AVAILABLE" ? new Date() : null,
        createdById: superAdmin.id,
      },
    });

    for (const img of images) {
      await db.vehicleImage.create({
        data: { ...img, vehicleId: vehicle.id },
      });
    }
  }
  console.log(`   ✓ ${VEHICLES.length} véhicules créés\n`);

  /* ── Demandes clients ─────────────────────────────────── */
  console.log("📥 Création des demandes clients...");
  const REQUESTS = [
    {
      firstName: "Moussa",
      lastName: "Keita",
      email: "m.keita@gmail.com",
      phone: "+225 07 123 456",
      country: "Côte d'Ivoire",
      city: "Abidjan",
      desiredModel: "BMW X7 2023 ou X5",
      budget: 800000,
      source: "whatsapp",
      message: "Bonjour, je recherche un BMW X7 ou X5 2023 depuis l'Allemagne.",
      status: "NEW",
      preferredCountry: "GERMANY",
    },
    {
      firstName: "Fatou",
      lastName: "Diallo",
      email: "f.diallo@orange.sn",
      phone: "+221 77 234 567",
      country: "Sénégal",
      city: "Dakar",
      desiredModel: "SUV Électrique - BYD ou NIO",
      budget: 450000,
      source: "form",
      message:
        "Je veux passer à l'électrique. Quelles sont les options depuis la Chine ?",
      status: "CONTACTED",
      preferredCountry: "CHINA",
    },
    {
      firstName: "Ibrahim",
      lastName: "Coulibaly",
      email: "i.coulibaly@mail.com",
      phone: "+223 65 345 678",
      country: "Mali",
      city: "Bamako",
      desiredModel: "Land Cruiser VX V8 2022+",
      budget: 9500000,
      source: "phone",
      message:
        "Cherche un Land Cruiser en excellent état depuis Dubai ou Japon.",
      status: "CONFIRMED",
      preferredCountry: "DUBAI",
    },
    {
      firstName: "Marie",
      lastName: "Bokova",
      email: "m.bokova@autostore-cg.com",
      phone: "+242 06 456 789",
      country: "Congo",
      city: "Pointe-Noire",
      desiredModel: "Mercedes GLE ou GLS 2024",
      budget: 9000000,
      source: "form",
      message: "Intéressée par un GLE ou GLS depuis l'Allemagne.",
      status: "DELIVERED",
      preferredCountry: "GERMANY",
    },
    {
      firstName: "Ahmed",
      lastName: "Benzara",
      email: "a.benzara@gmail.com",
      phone: "+212 6 567 890",
      country: "Maroc",
      city: "Casablanca",
      desiredModel: "Porsche Cayenne ou Macan",
      budget: 7000000,
      source: "whatsapp",
      message:
        "Troisième commande chez vous. Je voudrais un Porsche cette fois.",
      status: "IN_PROGRESS",
      preferredCountry: "GERMANY",
    },
  ];

  for (const req of REQUESTS) {
    const { preferredCountry, ...rest } = req;
    await db.customerRequest.create({
      data: {
        ...rest,
        status: rest.status as never,
        preferredCountry: preferredCountry as never,
      },
    });
  }
  console.log(`   ✓ ${REQUESTS.length} demandes créées\n`);

  /* ── Témoignages ──────────────────────────────────────── */
  console.log("💬 Création des témoignages...");
  const TESTIMONIALS = [
    {
      name: "Marc Kouassi",
      location: "Abidjan, Côte d'Ivoire",
      rating: 5,
      isPublished: true,
      order: 1,
      vehicleBought: "Toyota Land Cruiser",
      content:
        "Importation depuis le Japon réalisée en 6 semaines. Le véhicule était exactement comme décrit, en parfait état. Service exceptionnel du début à la fin. Je recommande vivement Autostore.",
    },
    {
      name: "Fatou Diallo",
      location: "Dakar, Sénégal",
      rating: 5,
      isPublished: true,
      order: 2,
      vehicleBought: "BMW X7",
      content:
        "BMW X7 importée depuis l'Allemagne. Prix 40% moins cher qu'un concessionnaire local. Autostore a géré tout le dédouanement. Parfaitement satisfaite.",
    },
    {
      name: "Ahmed Benzara",
      location: "Casablanca, Maroc",
      rating: 5,
      isPublished: true,
      order: 3,
      vehicleBought: "BYD Tang EV",
      content:
        "Troisième véhicule commandé via Autostore. Toujours aussi professionnel et rapide. Mon BYD électrique est arrivé parfaitement conditionné depuis la Chine.",
    },
    {
      name: "Kofi Asante",
      location: "Accra, Ghana",
      rating: 5,
      isPublished: true,
      order: 4,
      vehicleBought: "Lexus RX 500h",
      content:
        "Autostore a trouvé exactement ce que je voulais au Japon. Inspection complète, livraison rapide, zéro problème. Une équipe au top !",
    },
  ];

  console.log(`   ✓ ${TESTIMONIALS.length} témoignages créés\n`);

  /* ── FAQ ──────────────────────────────────────────────── */
  console.log("❓ Création de la FAQ...");
  const FAQS = [
    {
      question: "Quel est le délai moyen d'importation ?",
      answer:
        "Le délai varie selon le pays d'origine : 3-5 semaines depuis la Chine, 4-6 semaines depuis le Japon ou l'Allemagne, 2-4 semaines depuis Dubai. Ces délais incluent le transport, le dédouanement et la livraison finale.",
      order: 1,
      category: "Délais",
    },
    {
      question: "Quels frais sont inclus dans vos prix ?",
      answer:
        "Nos prix incluent le coût du véhicule, le transport maritime, les frais de dédouanement de base et notre commission. La TVA locale, les taxes d'immatriculation et les droits d'importation spécifiques à votre pays sont en supplément.",
      order: 2,
      category: "Prix",
    },
    {
      question: "Comment garantissez-vous la qualité des véhicules ?",
      answer:
        "Chaque véhicule fait l'objet d'une inspection technique complète de 120 points par nos techniciens certifiés avant expédition. Un rapport photographique et technique vous est fourni avant tout paiement.",
      order: 3,
      category: "Qualité",
    },
    {
      question: "Puis-je importer un véhicule sur mesure ?",
      answer:
        "Absolument ! Notre service d'importation personnalisée vous permet de commander tout véhicule disponible dans nos 8 pays partenaires. Contactez-nous avec vos critères et nous vous ferons une proposition sous 48h.",
      order: 4,
      category: "Services",
    },
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer:
        "Nous acceptons les virements bancaires (SWIFT/SEPA), les paiements par Mobile Money et les paiements en plusieurs fois pour les montants importants. Un acompte de 30% est requis à la commande.",
      order: 5,
      category: "Paiement",
    },
    {
      question: "Livrez-vous dans toute l'Afrique ?",
      answer:
        "Oui, nous livrons dans toute l'Afrique subsaharienne (Congo, Côte d'Ivoire, Sénégal, Ghana, Mali, Cameroun, etc.) et au Maghreb (Maroc, Algérie, Tunisie). Contactez-nous pour votre pays spécifique.",
      order: 6,
      category: "Livraison",
    },
  ];

  console.log(`   ✓ ${FAQS.length} FAQ créées\n`);

  /* ── Contenu site ─────────────────────────────────────── */
  console.log("📝 Création du contenu site...");
  const CONTENT = [
    {
      key: "hero_title",
      value: "L'EXCELLENCE AUTOMOBILE MONDIALE",
      type: "text",
      group: "homepage",
    },
    {
      key: "hero_subtitle",
      value: "Véhicules d'exception importés depuis 8 pays partenaires.",
      type: "text",
      group: "homepage",
    },
    {
      key: "about_title",
      value: "Votre partenaire de confiance depuis 2017",
      type: "text",
      group: "about",
    },
    {
      key: "whatsapp_msg",
      value:
        "Bonjour Autostore ! Je souhaite des informations sur vos véhicules.",
      type: "text",
      group: "contact",
    },
  ];

  console.log(`   ✓ ${CONTENT.length} contenus créés\n`);

  console.log("✅ Seed terminé avec succès !\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📧 Admin email    : admin@autostore-cg.com");
  console.log("🔑 Admin password : AutoStore2025!");
  console.log("🌍 URL            : http://localhost:3000");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed échoué :", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
