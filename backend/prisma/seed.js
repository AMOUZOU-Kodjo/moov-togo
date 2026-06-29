const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.create({
    data: {
      phone: '90000000',
      name: 'Admin Moov',
      role: 'ADMIN',
      isVerified: true,
    },
  })

  const driver1 = await prisma.user.create({
    data: {
      phone: '90111111',
      name: 'Koffi A.',
      role: 'DRIVER',
      isVerified: true,
      isOnline: true,
      lastLat: 6.1319,
      lastLng: 1.2223,
      rating: 4.5,
      rideCount: 120,
      vehicles: {
        create: { type: 'zemidjan', brand: 'Yamaha', color: 'Rouge', licensePlate: 'TG-1234' },
      },
    },
  })

  const driver2 = await prisma.user.create({
    data: {
      phone: '90222222',
      name: 'Ama D.',
      role: 'DRIVER',
      isVerified: true,
      isOnline: true,
      lastLat: 6.1400,
      lastLng: 1.2100,
      rating: 4.8,
      rideCount: 230,
      vehicles: {
        create: { type: 'voiture', brand: 'Toyota', color: 'Bleu', licensePlate: 'TG-5678' },
      },
    },
  })

  const driver3 = await prisma.user.create({
    data: {
      phone: '90333333',
      name: 'Yao M.',
      role: 'DRIVER',
      isVerified: true,
      isOnline: true,
      lastLat: 6.1250,
      lastLng: 1.2350,
      rating: 4.2,
      rideCount: 85,
      vehicles: {
        create: { type: 'zemidjan', brand: 'Honda', color: 'Noir', licensePlate: 'TG-9012' },
      },
    },
  })

  await prisma.user.create({
    data: {
      phone: '90444444',
      name: 'Essi K.',
      role: 'CLIENT',
      isVerified: true,
    },
  })

  await prisma.user.create({
    data: {
      phone: '90555555',
      name: 'Komlan B.',
      role: 'CLIENT',
      isVerified: true,
    },
  })

  const cantine1 = await prisma.cantine.create({
    data: {
      ownerId: admin.id,
      name: 'Cantine Akodessewa',
      description: 'Plats locaux et européens',
      phone: '90666666',
      address: 'Akodessewa, rue des écoles',
      quartier: 'Akodessewa',
      lat: 6.1319,
      lng: 1.2223,
      rating: 4.5,
      deliveryFee: 500,
      isOpen: true,
    },
  })

  const cantine2 = await prisma.cantine.create({
    data: {
      ownerId: admin.id,
      name: 'Chez Ama - Kodjoviakopé',
      description: 'Cuisine togolaise traditionnelle',
      phone: '90777777',
      address: 'Kodjoviakopé, plage',
      quartier: 'Kodjoviakopé',
      lat: 6.1400,
      lng: 1.2100,
      rating: 4.2,
      deliveryFee: 500,
      isOpen: true,
    },
  })

  const cantine3 = await prisma.cantine.create({
    data: {
      ownerId: admin.id,
      name: 'Resto du Port',
      description: 'Poissons frais et fruits de mer',
      phone: '90888888',
      address: 'Boulevard du Port',
      quartier: 'Port',
      lat: 6.1200,
      lng: 1.2400,
      rating: 4.7,
      deliveryFee: 600,
      isOpen: true,
    },
  })

  const menuItems = [
    { cantineId: cantine1.id, name: 'Riz Sauce Arachide', price: 1500, category: 'plat' },
    { cantineId: cantine1.id, name: 'Pâtes Bolognese', price: 1800, category: 'plat' },
    { cantineId: cantine1.id, name: 'Salade Composée', price: 1200, category: 'plat' },
    { cantineId: cantine1.id, name: 'Jus de Bissap', price: 500, category: 'boisson' },
    { cantineId: cantine2.id, name: 'Fufu Sauce Gombo', price: 1200, category: 'plat' },
    { cantineId: cantine2.id, name: 'Pâte de Maïs', price: 1000, category: 'plat' },
    { cantineId: cantine2.id, name: 'Poisson Braisé', price: 2500, category: 'plat' },
    { cantineId: cantine2.id, name: 'Tchoukoutou', price: 700, category: 'boisson' },
    { cantineId: cantine3.id, name: 'Poisson Grillé Sauce', price: 3000, category: 'plat' },
    { cantineId: cantine3.id, name: 'Riz Parfumé aux Crevettes', price: 2500, category: 'plat' },
    { cantineId: cantine3.id, name: 'Brochettes de Bœuf', price: 2000, category: 'plat' },
    { cantineId: cantine3.id, name: "Jus d'Ananas", price: 600, category: 'boisson' },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item })
  }

  console.log('✅ Base de données initialisée avec succès !')
  console.log('📱 Admins: 90000000')
  console.log('🏍️ Chauffeurs: 90111111, 90222222, 90333333')
  console.log('👤 Clients: 90444444, 90555555')
  console.log('🍽️ Cantines: Akodessewa, Chez Ama, Resto du Port')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
