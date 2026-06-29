const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.review.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.deliveryItem.deleteMany()
  await prisma.delivery.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.cantine.deleteMany()
  await prisma.ride.deleteMany()
  await prisma.otpCode.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.driverDocument.deleteMany()
  await prisma.user.deleteMany()

  // Admin user
  const admin = await prisma.user.create({
    data: { phone: '+22890000000', name: 'Admin Moov', role: 'ADMIN', isVerified: true, walletBalance: 1000000 },
  })
  console.log(`Admin created: ${admin.phone}`)

  // Drivers
  const drivers = []
  const driverNames = ['Koffi A.', 'Yao M.', 'Ama D.', 'Komlan E.', 'Afia S.', 'Kodjo T.', 'Mensah B.', 'Edem K.']
  const lomeCoords = [
    { lat: 6.1319, lng: 1.2238 }, { lat: 6.1400, lng: 1.2100 }, { lat: 6.1250, lng: 1.2200 },
    { lat: 6.1500, lng: 1.2300 }, { lat: 6.1350, lng: 1.2150 }, { lat: 6.1450, lng: 1.2250 },
    { lat: 6.1280, lng: 1.2180 }, { lat: 6.1420, lng: 1.2120 },
  ]
  for (let i = 0; i < driverNames.length; i++) {
    const driver = await prisma.user.create({
      data: {
        phone: `+228901000${i}`, name: driverNames[i], role: 'DRIVER', isVerified: true,
        walletBalance: Math.floor(Math.random() * 50000),
        rideCount: Math.floor(Math.random() * 100),
        rating: +(3.5 + Math.random() * 1.5).toFixed(1),
        isOnline: true,
        lastLat: lomeCoords[i].lat + (Math.random() - 0.5) * 0.01,
        lastLng: lomeCoords[i].lng + (Math.random() - 0.5) * 0.01,
      },
    })
    await prisma.vehicle.create({
      data: {
        driverId: driver.id, type: i < 4 ? 'zemidjan' : (i < 6 ? 'moto' : 'voiture'),
        brand: i < 4 ? 'TVS' : (i < 6 ? 'Honda' : 'Toyota'),
        model: i < 4 ? 'HLX 125' : (i < 6 ? 'CB 125' : 'Corolla'),
        licensePlate: `TG-${1000 + i}${String.fromCharCode(65 + i)}`,
        color: ['Rouge', 'Bleu', 'Noir', 'Jaune', 'Vert', 'Blanc', 'Gris', 'Orange'][i],
      },
    })
    drivers.push(driver)
  }
  console.log(`${drivers.length} drivers created`)

  // Clients
  const clients = []
  const clientNames = ['Essi K.', 'Sika B.', 'Kodzo A.', 'Mawuena D.', 'Yawo H.', 'Adjoa T.']
  for (let i = 0; i < clientNames.length; i++) {
    const client = await prisma.user.create({
      data: {
        phone: `+228902000${i}`, name: clientNames[i], role: 'CLIENT', isVerified: true,
        walletBalance: Math.floor(Math.random() * 100000),
        rideCount: Math.floor(Math.random() * 30),
      },
    })
    clients.push(client)
  }
  console.log(`${clients.length} clients created`)

  // Cantine owners
  const cantineData = [
    { name: 'Maman Bénédicte', desc: 'Plats traditionnels togolais faits maison', phone: '+22890300000', address: 'Rue de la Paix, Quartier Kégué', quartier: 'Kégué', lat: 6.1400, lng: 1.2150, imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', deliveryFee: 500 },
    { name: 'Délice de Lomé', desc: 'Pizzas, burgers et cuisine africaine moderne', phone: '+22890300001', address: 'Boulevard du 13 Janvier, Quartier Tokoin', quartier: 'Tokoin', lat: 6.1320, lng: 1.2200, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', deliveryFee: 600 },
    { name: 'Chez Ama', desc: 'Poisson braisé, fufu et sauces traditionnelles', phone: '+22890300002', address: 'Marché de Lomé, Quartier Bé', quartier: 'Bé', lat: 6.1250, lng: 1.2250, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', deliveryFee: 400 },
    { name: 'Café Lomé', desc: 'Petit-déjeuner, café, pâtisseries et smoothies', phone: '+22890300003', address: 'Avenue de la Libération, Quartier Nyékonakpoè', quartier: 'Nyékonakpoè', lat: 6.1450, lng: 1.2100, imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400', deliveryFee: 350 },
    { name: 'Epices d\'Afrique', desc: 'Cuisine ouest-africaine riche en épices', phone: '+22890300004', address: 'Rue des Artisans, Quartier Kodjoviakopé', quartier: 'Kodjoviakopé', lat: 6.1350, lng: 1.2300, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', deliveryFee: 500 },
    { name: 'Grill & Brochettes', desc: 'Brochettes, grilled chicken, alloco', phone: '+22890300005', address: 'Plage de Lomé, Quartier Béniglato', quartier: 'Béniglato', lat: 6.1500, lng: 1.2350, imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400', deliveryFee: 550 },
  ]

  for (let i = 0; i < cantineData.length; i++) {
    const owner = await prisma.user.create({
      data: {
        phone: cantineData[i].phone, name: `Propriétaire ${cantineData[i].name}`,
        role: 'CANTINE', isVerified: true, walletBalance: 0,
      },
    })

    const cantine = await prisma.cantine.create({
      data: {
        ownerId: owner.id, name: cantineData[i].name, description: cantineData[i].desc,
        phone: cantineData[i].phone, address: cantineData[i].address,
        quartier: cantineData[i].quartier, lat: cantineData[i].lat, lng: cantineData[i].lng,
        imageUrl: cantineData[i].imageUrl, deliveryFee: cantineData[i].deliveryFee,
        isOpen: true, rating: +(3.8 + Math.random() * 1.2).toFixed(1),
      },
    })

    // Menu items for each cantine
    const menuItems = [
      { name: 'Riz Sauce Arachide', desc: 'Riz blanc accompagné de sauce arachide', price: 1500, category: 'plat' },
      { name: 'Fufu Sauce Gombo', desc: 'Fufu traditionnel sauce gombo', price: 2000, category: 'plat' },
      { name: 'Poulet Braisé', desc: 'Poulet braisé accompagné d\'alloco', price: 3500, category: 'plat' },
      { name: 'Poisson Braisé', desc: 'Poisson frais braisé', price: 3000, category: 'plat' },
      { name: 'Jus de Bissap', desc: 'Jus naturel de bissap', price: 500, category: 'boisson' },
      { name: 'Jus de Gingembre', desc: 'Jus de gingembre frais', price: 500, category: 'boisson' },
      { name: 'Beignets', desc: 'Beignets maison', price: 500, category: 'dessert' },
    ]
    for (const item of menuItems) {
      await prisma.menuItem.create({
        data: { cantineId: cantine.id, ...item },
      })
    }
  }
  console.log(`${cantineData.length} cantines with menu items created`)

  // Sample rides
  const rideStatuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'CANCELLED', 'COMPLETED']
  for (let i = 0; i < 15; i++) {
    const client = clients[i % clients.length]
    const driver = drivers[i % drivers.length]
    const pickupIdx = i % lomeCoords.length
    const dropoffIdx = (i + 1) % lomeCoords.length
    const km = +(1 + Math.random() * 8).toFixed(1)
    const price = Math.round(500 + km * 200 + Math.random() * 100)
    const status = rideStatuses[i % rideStatuses.length]

    const ride = await prisma.ride.create({
      data: {
        riderId: client.id, driverId: status !== 'CANCELLED' ? driver.id : null,
        pickupLat: lomeCoords[pickupIdx].lat, pickupLng: lomeCoords[pickupIdx].lng,
        pickupAddress: `Quartier ${['Kégué', 'Tokoin', 'Bé', 'Nyékonakpoè', 'Kodjoviakopé', 'Béniglato'][pickupIdx % 6]}`,
        dropoffLat: lomeCoords[dropoffIdx].lat, dropoffLng: lomeCoords[dropoffIdx].lng,
        dropoffAddress: `Quartier ${['Kégué', 'Tokoin', 'Bé', 'Nyékonakpoè', 'Kodjoviakopé', 'Béniglato'][dropoffIdx % 6]}`,
        status, distanceKm: km, durationMin: Math.round(km * 3), price,
        vehicleType: ['zemidjan', 'zemidjan', 'moto', 'voiture', 'zemidjan'][i % 5],
        completedAt: status === 'COMPLETED' ? new Date(Date.now() - i * 3600000) : undefined,
        cancelledAt: status === 'CANCELLED' ? new Date() : undefined,
      },
    })

    if (status !== 'CANCELLED') {
      await prisma.payment.create({
        data: {
          userId: client.id, rideId: ride.id, amount: price,
          provider: ['FLOOZ', 'TMONEY', 'WALLET'][i % 3],
          status: 'SUCCESS', transactionId: `TX-${Date.now()}-${i}`,
          commission: Math.round(price * 0.15), paidAt: new Date(),
        },
      })
    }
  }
  console.log('15 sample rides created')

  // Sample deliveries (food)
  const allCantines = await prisma.cantine.findMany({ include: { menuItems: true } })
  for (let i = 0; i < 10; i++) {
    const client = clients[i % clients.length]
    const cantine = allCantines[i % allCantines.length]
    const item = cantine.menuItems[Math.floor(Math.random() * cantine.menuItems.length)]
    const delivery = await prisma.delivery.create({
      data: {
        orderType: 'FOOD', senderId: client.id, cantineId: cantine.id,
        pickupLat: cantine.lat, pickupLng: cantine.lng, pickupAddress: cantine.address,
        dropoffLat: 6.13 + Math.random() * 0.02, dropoffLng: 1.21 + Math.random() * 0.02,
        dropoffAddress: `Lomé, Quartier ${['Kégué', 'Tokoin', 'Bé', 'Nyékonakpoè'][i % 4]}`,
        status: ['PENDING', 'PREPARING', 'DELIVERED', 'DELIVERED', 'CANCELLED'][i % 5],
        distanceKm: +(1 + Math.random() * 3).toFixed(1),
        price: Math.round(item.price + cantine.deliveryFee),
        deliveryFee: cantine.deliveryFee, note: 'Merci !',
        deliveredAt: i < 3 ? new Date(Date.now() - i * 7200000) : undefined,
      },
    })
    await prisma.deliveryItem.create({
      data: { deliveryId: delivery.id, menuItemId: item.id, name: item.name, quantity: 1 + Math.floor(Math.random() * 3), price: item.price },
    })
  }
  console.log('10 sample food deliveries created')

  console.log('\nSeed completed successfully!')
  console.log(`\nTest accounts (code: 123456):`)
  console.log(`  Admin:  +22890000000`)
  console.log(`  Driver: +2289010000`)
  console.log(`  Client: +2289020000`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
