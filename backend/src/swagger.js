const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Moov\' Togo API',
      version: '1.0.0',
      description: 'API de la super-app de mobilité et livraison au Togo',
    },
    servers: [{ url: '/api', description: 'API base URL' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            phone: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['CLIENT', 'DRIVER', 'CANTINE', 'ADMIN'] },
            rating: { type: 'number' },
            walletBalance: { type: 'number' },
          },
        },
        Ride: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            pickupAddress: { type: 'string' },
            dropoffAddress: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
            price: { type: 'number' },
            distanceKm: { type: 'number' },
            vehicleType: { type: 'string' },
          },
        },
        Delivery: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            orderType: { type: 'string', enum: ['FOOD', 'PARCEL'] },
            pickupAddress: { type: 'string' },
            dropoffAddress: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'PREPARING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'] },
            price: { type: 'number' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            amount: { type: 'number' },
            provider: { type: 'string', enum: ['FLOOZ', 'TMONEY', 'CASH', 'WALLET'] },
            status: { type: 'string', enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'] },
            transactionId: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/auth/send-otp': {
        post: {
          tags: ['Auth'],
          summary: 'Envoyer un code OTP',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { phone: { type: 'string', example: '+22890000000' } }, required: ['phone'] } } },
          },
          responses: { '200': { description: 'Code envoyé' }, '400': { description: 'Numéro invalide' } },
        },
      },
      '/auth/verify-otp': {
        post: {
          tags: ['Auth'],
          summary: 'Vérifier le code OTP et récupérer un JWT',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { phone: { type: 'string', example: '+22890000000' }, code: { type: 'string', example: '123456' } }, required: ['phone', 'code'] } } },
          },
          responses: { '200': { description: 'Connexion réussie, retourne le token JWT' }, '401': { description: 'Code invalide' } },
        },
      },
      '/auth/profile': {
        get: {
          tags: ['Auth'],
          summary: 'Profil utilisateur connecté',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Profil utilisateur' } },
        },
        put: {
          tags: ['Auth'],
          summary: 'Mettre à jour le profil',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' } } } } },
          },
          responses: { '200': { description: 'Profil mis à jour' } },
        },
      },
      '/rides/estimate': {
        post: {
          tags: ['Courses'],
          summary: 'Estimer le prix d\'une course',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'application/json': { schema: { type: 'object', properties: { pickupLat: { type: 'number' }, pickupLng: { type: 'number' }, dropoffLat: { type: 'number' }, dropoffLng: { type: 'number' }, vehicleType: { type: 'string' } } } } },
          },
          responses: { '200': { description: 'Estimation du prix et de la distance' } },
        },
      },
      '/rides': {
        post: {
          tags: ['Courses'],
          summary: 'Créer une course',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'application/json': { schema: { type: 'object', properties: { pickupAddress: { type: 'string' }, dropoffAddress: { type: 'string' }, pickupLat: { type: 'number' }, pickupLng: { type: 'number' }, dropoffLat: { type: 'number' }, dropoffLng: { type: 'number' }, vehicleType: { type: 'string' } } } } },
          },
          responses: { '201': { description: 'Course créée' } },
        },
        get: {
          tags: ['Courses'],
          summary: 'Liste des courses',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Liste des courses' } },
        },
      },
      '/rides/nearby-drivers': {
        get: {
          tags: ['Courses'],
          summary: 'Chauffeurs disponibles à proximité',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'lat', in: 'query', schema: { type: 'number' } },
            { name: 'lng', in: 'query', schema: { type: 'number' } },
            { name: 'radius', in: 'query', schema: { type: 'number' } },
          ],
          responses: { '200': { description: 'Liste des chauffeurs' } },
        },
      },
      '/rides/active': {
        get: {
          tags: ['Courses'],
          summary: 'Course active du chauffeur',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Course active ou null' } },
        },
      },
      '/rides/{rideId}/accept': {
        post: {
          tags: ['Courses'],
          summary: 'Accepter une course (chauffeur)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'rideId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Course acceptée' } },
        },
      },
      '/rides/{rideId}/status': {
        patch: {
          tags: ['Courses'],
          summary: 'Mettre à jour le statut d\'une course',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'rideId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] } }, required: ['status'] } } },
          },
          responses: { '200': { description: 'Statut mis à jour' } },
        },
      },
      '/deliveries/cantines': {
        get: {
          tags: ['Livraisons'],
          summary: 'Rechercher des cantines',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'quartier', in: 'query', schema: { type: 'string' } },
            { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Recherche textuelle' },
          ],
          responses: { '200': { description: 'Liste des cantines' } },
        },
      },
      '/deliveries/food': {
        post: {
          tags: ['Livraisons'],
          summary: 'Commander un repas',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'application/json': { schema: { type: 'object', properties: { cantineId: { type: 'string' }, items: { type: 'array', items: { type: 'object', properties: { menuItemId: { type: 'string' }, quantity: { type: 'integer' } } } }, dropoffAddress: { type: 'string' }, dropoffLat: { type: 'number' }, dropoffLng: { type: 'number' } }, required: ['cantineId', 'items', 'dropoffAddress'] } } },
          },
          responses: { '201': { description: 'Commande créée' } },
        },
      },
      '/deliveries/parcel': {
        post: {
          tags: ['Livraisons'],
          summary: 'Envoyer un colis',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'application/json': { schema: { type: 'object', properties: { pickupAddress: { type: 'string' }, pickupLat: { type: 'number' }, pickupLng: { type: 'number' }, dropoffAddress: { type: 'string' }, dropoffLat: { type: 'number' }, dropoffLng: { type: 'number' }, recipientName: { type: 'string' }, recipientPhone: { type: 'string' }, note: { type: 'string' } }, required: ['pickupAddress', 'dropoffAddress'] } } },
          },
          responses: { '201': { description: 'Colis créé' } },
        },
      },
      '/deliveries': {
        get: {
          tags: ['Livraisons'],
          summary: 'Liste des livraisons',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Liste des livraisons' } },
        },
      },
      '/deliveries/{deliveryId}/accept': {
        post: {
          tags: ['Livraisons'],
          summary: 'Accepter une livraison (livreur)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'deliveryId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Livraison acceptée' } },
        },
      },
      '/deliveries/{deliveryId}/status': {
        patch: {
          tags: ['Livraisons'],
          summary: 'Mettre à jour le statut d\'une livraison',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'deliveryId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['PREPARING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'] } }, required: ['status'] } } },
          },
          responses: { '200': { description: 'Statut mis à jour' } },
        },
      },
      '/payments/pay': {
        post: {
          tags: ['Paiements'],
          summary: 'Effectuer un paiement Mobile Money',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'application/json': { schema: { type: 'object', properties: { rideId: { type: 'string' }, deliveryId: { type: 'string' }, amount: { type: 'number' }, provider: { type: 'string', enum: ['FLOOZ', 'TMONEY'] }, providerPhone: { type: 'string' } }, required: ['amount', 'provider'] } } },
          },
          responses: { '200': { description: 'Paiement effectué' } },
        },
      },
      '/payments/history': {
        get: {
          tags: ['Paiements'],
          summary: 'Historique des paiements',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Historique des paiements' } },
        },
      },
      '/payments/wallet': {
        get: {
          tags: ['Paiements'],
          summary: 'Solde du portefeuille',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Solde du portefeuille' } },
        },
      },
      '/admin/dashboard': {
        get: {
          tags: ['Administration'],
          summary: 'Dashboard admin (stats, mensuel, répartition, récent)',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Données du dashboard' } },
        },
      },
      '/admin/users': {
        get: {
          tags: ['Administration'],
          summary: 'Liste des utilisateurs',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }],
          responses: { '200': { description: 'Liste paginée des utilisateurs' } },
        },
      },
      '/admin/payments': {
        get: {
          tags: ['Administration'],
          summary: 'Liste des paiements',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }],
          responses: { '200': { description: 'Liste paginée des paiements' } },
        },
      },
      '/health': {
        get: {
          tags: ['Système'],
          summary: 'Vérifier l\'état de l\'API',
          responses: { '200': { description: 'API opérationnelle' } },
        },
      },
    },
  },
  apis: [],
}

module.exports = swaggerJsdoc(options)
