import type { BlogPost } from "@/types/blog";

export const BLOG_PAGE_SIZE = 6;

const BLOG_IMAGES_DIR = "/blogsImages";

function localBlogImage(fileName: string): string {
  return `${BLOG_IMAGES_DIR}/${encodeURIComponent(fileName)}`;
}

/**
 * Blog cover images in `/public/blogsImages/` (filename = article title).
 * Remaining posts use Unsplash until local photos are added.
 */
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "location-voiture-dakhla-limosud-cars",
    title: "Location de voiture à Dakhla : pourquoi choisir Limosud Cars ?",
    excerpt:
      "Agence locale, livraison à l'aéroport, flotte 4x4 et citadines, assistance 24h/24 : tout ce qui fait de Limosud Cars un partenaire fiable à Dakhla.",
    coverImage:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&h=675&q=80",
    publishedAt: "2026-03-01",
    content: `Dakhla attire de plus en plus de voyageurs, kitesurfeurs et professionnels. Pour profiter pleinement de la région, une voiture de location est souvent indispensable. Limosud Cars est une agence de location basée à Dakhla, reconnue pour sa flotte variée et son service réactif.

Chez Limosud Cars, vous pouvez louer des 4x4 pour les pistes et les excursions, ainsi que des voitures compactes pour la ville et les trajets quotidiens. La réservation est simple : vous choisissez votre véhicule, vos dates, puis l'équipe confirme la disponibilité.

L'un des grands avantages reste la livraison à l'aéroport de Dakhla ou directement à votre hébergement. À l'arrivée, le véhicule vous attend avec le contrat prêt. L'assistance client est disponible 7j/7 pour répondre à vos questions avant, pendant et après la location.

Que vous veniez pour le kitesurf, le tourisme ou un déplacement professionnel, Limosud Cars propose des tarifs transparents et une flotte entretenue. Contactez l'agence au 06 61 04 09 67 ou par e-mail à limosudcars@gmail.com pour préparer votre séjour.`,
  },
  {
    id: 2,
    slug: "livraison-aeroport-dakhla",
    title: "Livraison à l'aéroport de Dakhla : comment ça se passe ?",
    excerpt:
      "Récupérez votre voiture dès l'atterrissage. Voici le déroulement type d'une prise en charge aéroport avec Limosud Cars.",
    coverImage:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&h=675&q=80",
    publishedAt: "2026-02-20",
    content: `Vous atterrissez à Dakhla et souhaitez partir immédiatement vers votre hôtel, la lagune ou un spot de kitesurf ? La livraison aéroport est la solution la plus pratique.

Lors de votre réservation, indiquez votre numéro de vol et l'heure d'arrivée prévue. L'équipe Limosud Cars suit votre vol et adapte la remise du véhicule en cas de retard. À la sortie du terminal, un conseiller vous accueille avec le contrat et le véhicule préparé.

Avant de partir, un état des lieux rapide est réalisé : carrosserie, intérieur, niveau de carburant. Vous recevez les contacts d'urgence et les consignes pour le retour. En quelques minutes, vous êtes sur la route.

Ce service évite les taxis imprévus et vous fait gagner du temps dès les premières heures de votre séjour. Pour réserver une livraison aéroport, parcourez la flotte en ligne ou appelez le 06 55 75 09 46.`,
  },
  {
    id: 3,
    slug: "4x4-ou-citadine-dakhla",
    title: "4x4 ou citadine : quel véhicule louer à Dakhla ?",
    excerpt:
      "Lagunes, dunes, ville et routes côtières : guide rapide pour choisir entre un SUV/4x4 et une voiture compacte.",
    coverImage:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&h=675&q=80",
    publishedAt: "2026-02-10",
    content: `Le bon choix de véhicule dépend surtout de votre programme à Dakhla. Si vous restez en ville et sur routes goudronnées, une citadine ou un compact suffit : consommation réduite, stationnement facile, tarif journalier attractif.

En revanche, pour rejoindre des plages isolées, des spots de kitesurf hors des axes principaux ou des pistes désertiques, un 4x4 ou un SUV comme un Dacia Duster est fortement recommandé. Ces véhicules offrent une meilleure garde au sol et plus de confiance sur terrain mixte.

Limosud Cars propose les deux catégories dans sa flotte. Pensez à anticiper le nombre de passagers et le volume des bagages — boards de kitesurf et valises incluses. En haute saison, réservez tôt le modèle adapté à votre usage.

En cas de doute, l'équipe Limosud Cars peut vous conseiller selon la durée du séjour et les lieux que vous souhaitez visiter.`,
  },
  {
    id: 4,
    slug: "explorer-lagune-kitesurf-dakhla",
    title: "Explorer la lagune et les spots de kitesurf en voiture",
    excerpt:
      "Dakhla est une capitale mondiale du kitesurf. Itinéraires, accès et conseils pour se déplacer librement avec une location Limosud Cars.",
    coverImage: localBlogImage("Explorer la lagune et les spots de kitesurf en voiture.jpg"),
    publishedAt: "2026-01-28",
    content: `La baie de Dakhla et ses lagunes offrent des conditions de vent exceptionnelles une grande partie de l'année. Pour un rider, avoir sa propre voiture change tout : vous choisissez vos sessions selon la météo et n'êtes pas dépendant des navettes.

Depuis le centre-ville ou votre hébergement, comptez quelques minutes en voiture pour rejoindre les zones les plus connues. Un 4x4 est utile si vous explorez des plages plus éloignées ou des pistes sablonneuses.

Prévoyez toujours eau, crème solaire et une carte hors ligne. Respectez les zones protégées et les communautés locales. Au retour, un véhicule propre et en bon état facilite la restitution sans frais supplémentaires.

Limosud Cars connaît bien les besoins des sportifs de glisse : espace coffre, horaires flexibles et livraison rapide. Réservez votre véhicule avant l'arrivée pour profiter du vent dès le premier jour.`,
  },
  {
    id: 5,
    slug: "comment-reserver-limosud-cars",
    title: "Comment réserver votre voiture chez Limosud Cars",
    excerpt:
      "Étapes simples pour choisir un véhicule, vérifier les dates et confirmer votre location à Dakhla.",
    coverImage: localBlogImage("Comment réserver votre voiture chez Limosud Cars.jpg"),
    publishedAt: "2026-01-15",
    content: `Réserver une voiture avec Limosud Cars prend quelques minutes. Commencez par parcourir la flotte disponible sur le site : chaque fiche indique le modèle, la capacité, le type de carburant et le tarif journalier.

Sélectionnez vos dates de début et de fin, puis le lieu de prise en charge — agence Limosud Cars à Dakhla (Hay alqods) ou aéroport. Renseignez vos coordonnées et, si besoin, un message pour préciser votre vol ou votre hôtel.

Après envoi de la demande, l'équipe vérifie la disponibilité et vous confirme la réservation. Munissez-vous d'un permis de conduire valide et d'une pièce d'identité pour la signature du contrat. Une caution peut être demandée selon le véhicule et les options d'assurance choisies.

Pour toute question avant de réserver, contactez limosudcars@gmail.com ou le 06 61 04 09 67. L'assistance reste disponible 24h/24 pendant votre location.`,
  },
  {
    id: 6,
    slug: "assurance-caution-location-maroc",
    title: "Assurance et caution : ce qu'il faut savoir avant de louer",
    excerpt:
      "CDW, franchise, dépôt de garantie : comprenez les options proposées lors d'une location avec Limosud Cars à Dakhla.",
    coverImage: localBlogImage("Assurance et caution  ce qu'il faut savoir avant de louer.jpg"),
    publishedAt: "2026-01-05",
    content: `La location d'un véhicule au Maroc inclut en général une assurance de base couvrant la responsabilité civile. Chez Limosud Cars, des options complémentaires peuvent réduire la franchise en cas de dommage à la carrosserie — un point important si vous roulez sur des pistes ou des parkings sablonneux.

La caution est bloquée au départ du véhicule et libérée après restitution, sous réserve qu'aucun dommage ni infraction ne soit constaté. Un état des lieux détaillé est fait à la prise en charge et au retour : prenez le temps de signaler toute rayure existante.

Lisez attentivement le contrat avant signature : kilométrage, carburant, heures de retour et zones de circulation autorisées. En cas de doute, demandez une explication à l'équipe — la transparence fait partie de l'engagement qualité de Limosud Cars.

Pour un voyage serein à Dakhla, anticipez ces points lors de la réservation plutôt qu'à l'aéroport dans l'urgence du voyage.`,
  },
  {
    id: 7,
    slug: "road-trip-cotier-dakhla",
    title: "Road trip côtier au sud de Dakhla",
    excerpt:
      "Une journée type entre océan Atlantique, plages sauvages et pauses panoramiques — à faire en voiture de location.",
    coverImage: localBlogImage("Road trip côtier au sud de Dakhla.jpg"),
    publishedAt: "2025-12-18",
    content: `Le littoral au sud de Dakhla réserve des paysages saisissants : mer turquoise, falaises, dunes blanches et longues plages désertes. Un road trip d'une journée est l'un des meilleurs moyens d'en profiter.

Partez tôt pour bénéficier de la lumière du matin et des températures douces. Emportez de l'eau, des snacks et un chargeur. Un 4x4 est recommandé si vous quittez les routes principales ; sinon un SUV confortable suffit pour la majorité des trajets côtiers.

Respectez l'environnement : ne laissez aucun déchet et évitez de rouler sur la végétation fragile. Informez quelqu'un de votre itinéraire approximatif si vous vous aventurez loin des axes connus.

Au retour à Dakhla, faites le plein si nécessaire et respectez l'heure convenue avec Limosud Cars. Une location bien planifiée transforme une simple journée en souvenir inoubliable.`,
  },
  {
    id: 8,
    slug: "dacia-duster-aventures-dakhla",
    title: "Dacia Duster et SUV : les alliés des aventures à Dakhla",
    excerpt:
      "Robuste, économique et adapté aux routes marocaines, le Duster fait partie des favoris de la flotte Limosud Cars.",
    coverImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&h=675&q=80",
    publishedAt: "2025-12-01",
    content: `Le Dacia Duster est l'un des véhicules les plus demandés chez Limosud Cars pour un séjour à Dakhla. Son rapport capacité / prix / robustesse en fait un excellent choix pour les familles, les couples ou les petits groupes d'amis.

Avec cinq places et un coffre généreux, il accueille valises et équipements de sport. Sa garde au sol permet d'aborder les pistes compactées et les routes côtières sans inquiétude, tout en restant confortable sur autoroute et en ville.

Limosud Cars entretient régulièrement sa flotte SUV pour garantir climatisation, freinage et pneumatiques en bon état — un critère essentiel sous le soleil du Sahara atlantique.

Si le Duster n'est pas disponible aux dates souhaitées, d'autres SUV et 4x4 de la flotte offrent des caractéristiques similaires. Réservez à l'avance en haute saison pour sécuriser le modèle idéal pour vos aventures dakhloises.`,
  },
];
