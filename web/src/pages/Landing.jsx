import { Link } from 'react-router-dom'
import { Bike, UtensilsCrossed, Package, Smartphone, Shield, Zap } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-moov-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold">Moov'</span>
            <span className="text-lg opacity-80">Togo</span>
          </div>
          <Link to="/login" className="btn btn-ghost text-white btn-sm">
            Connexion
          </Link>
        </div>
      </header>

      <section className="bg-moov-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Toute la mobilité <br />du Togo dans une app
          </h1>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Zémidjans, repas des cantines, envoi de colis — payez par Flooz ou TMoney.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="btn bg-white text-moov-500 hover:bg-gray-100 btn-lg rounded-xl font-bold">
              Commencer
            </Link>
            <a href="#features" className="btn btn-outline border-white text-white hover:bg-white hover:text-moov-500 btn-lg rounded-xl">
              En savoir plus
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nos services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Bike, title: 'Courses', desc: 'Zémidjans et taxis en temps réel. Prix estimé avant la réservation.', color: 'text-secondary' },
              { icon: UtensilsCrossed, title: 'Livraison repas', desc: 'Commandez depuis les cantines près de chez vous. Livraison rapide.', color: 'text-moov-500' },
              { icon: Package, title: 'Envoi colis', desc: 'Colis local ou inter-ville (Lomé → Kara). Suivi en temps réel.', color: 'text-accent' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card bg-base-100 shadow-xl rounded-2xl">
                <div className="card-body items-center text-center">
                  <div className={`p-3 rounded-full bg-base-200 ${color}`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="card-title text-lg">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Moov' ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Rapide', desc: 'Réservation en un clic. Chauffeur en moins de 5 minutes.' },
              { icon: Smartphone, title: 'Paiement Mobile', desc: 'Flooz et TMoney acceptés. Pas de liquide.' },
              { icon: Shield, title: 'Sécurisé', desc: 'Avis vérifiés, géolocalisation, support client.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 items-start">
                <div className="p-2 rounded-xl bg-moov-100 text-moov-500">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center bg-moov-500 text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Prêt à rouler ?</h2>
          <p className="opacity-90 mb-8">Rejoignez des milliers d'utilisateurs au Togo.</p>
          <Link to="/login" className="btn bg-white text-moov-500 hover:bg-gray-100 btn-lg rounded-xl font-bold">
            Créer un compte gratuit
          </Link>
          <p className="text-xs opacity-70 mt-4">Disponible sur mobile et web</p>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p>© 2024 Moov' Togo. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
