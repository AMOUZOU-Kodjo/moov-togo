import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bike, UtensilsCrossed, Package, Smartphone, Shield, Zap, ChevronRight } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' },
}

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.15 },
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        className="bg-moov-500 text-white"
      >
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-extrabold"
            >
              Moov'
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg opacity-80"
            >
              Togo
            </motion.span>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/login" className="btn btn-ghost text-white btn-sm gap-1">
              Connexion <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-moov-500 text-white relative overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
          className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -5, 0],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
          className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"
        />
        <div className="max-w-5xl mx-auto px-4 py-20 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold mb-4"
          >
            Toute la mobilité <br />du Togo dans une app
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg opacity-90 mb-8 max-w-xl mx-auto"
          >
            Zémidjans, repas des cantines, envoi de colis — payez par Flooz ou TMoney.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="btn bg-white text-moov-500 hover:bg-gray-100 btn-lg rounded-xl font-bold shadow-xl">
                Commencer
              </Link>
            </motion.div>
            <a href="#features" className="btn btn-outline border-white text-white hover:bg-white hover:text-moov-500 btn-lg rounded-xl">
              En savoir plus
            </a>
          </motion.div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} id="features" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Nos services
          </motion.h2>
          <motion.div {...stagger} className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Bike, title: 'Courses', desc: 'Zémidjans et taxis en temps réel. Prix estimé avant la réservation.', color: 'text-secondary' },
              { icon: UtensilsCrossed, title: 'Livraison repas', desc: 'Commandez depuis les cantines près de chez vous. Livraison rapide.', color: 'text-moov-500' },
              { icon: Package, title: 'Envoi colis', desc: 'Colis local ou inter-ville (Lomé → Kara). Suivi en temps réel.', color: 'text-accent' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                variants={{
                  initial: { opacity: 0, y: 40 },
                  whileInView: { opacity: 1, y: 0 },
                }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="card bg-base-100 shadow-xl rounded-2xl hover:shadow-2xl transition-shadow"
              >
                <div className="card-body items-center text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-3 rounded-full bg-base-200 ${color}`}
                  >
                    <Icon size={32} />
                  </motion.div>
                  <h3 className="card-title text-lg">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Pourquoi Moov' ?
          </motion.h2>
          <motion.div {...stagger} className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Rapide', desc: 'Réservation en un clic. Chauffeur en moins de 5 minutes.' },
              { icon: Smartphone, title: 'Paiement Mobile', desc: 'Flooz et TMoney acceptés. Pas de liquide.' },
              { icon: Shield, title: 'Sécurisé', desc: 'Avis vérifiés, géolocalisation, support client.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={{
                  initial: { opacity: 0, x: -30 },
                  whileInView: { opacity: 1, x: 0 },
                }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-4 items-start p-4 rounded-2xl hover:bg-white transition-colors"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="p-2 rounded-xl bg-moov-100 text-moov-500"
                >
                  <Icon size={24} />
                </motion.div>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="py-20 px-4 text-center bg-moov-500 text-white relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
        />
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Prêt à rouler ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="opacity-90 mb-8"
          >
            Rejoignez des milliers d'utilisateurs au Togo.
          </motion.p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login" className="btn bg-white text-moov-500 hover:bg-gray-100 btn-lg rounded-xl font-bold shadow-xl">
              Créer un compte gratuit
            </Link>
          </motion.div>
          <p className="text-xs opacity-70 mt-4">Disponible sur mobile et web</p>
        </div>
      </motion.section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p>© 2024 Moov' Togo. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
