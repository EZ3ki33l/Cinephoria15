"use client";

import { Typo } from "../_components/_layout/typography";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";

export default function PolitiqueConfidentialite() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center px-4"
          >
            <div className="text-xl md:text-3xl font-bold dark:text-white text-center">
              Votre vie privée est notre priorité !
            </div>
            <div className="font-extralight text-base md:text-xl dark:text-neutral-200 text-center py-4">
              Sur cette page, découvrez comment nous protégeons vos données
              personnelles et assurons la transparence de nos pratiques, afin
              que vous puissiez profiter de votre expérience avec Cinéphoria en
              toute confiance.
            </div>
          </motion.div>
        </AuroraBackground>
      </div>
      <div className="my-16 space-y-10">
        <Typo variant="h1" component="h1" className="mb-8">
          Politique de Confidentialité
        </Typo>

        <div className="space-y-8">
          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              1. Introduction
            </Typo>
            <p className="text-gray-700 leading-relaxed">
              Chez Cinephoria, nous accordons une grande importance à la
              protection de vos données personnelles. Cette politique de
              confidentialité explique comment nous collectons, utilisons et
              protégeons vos informations personnelles conformément au Règlement
              Général sur la Protection des Données (RGPD).
            </p>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              2. Données collectées
            </Typo>
            <div className="space-y-4">
              <p className="text-gray-700">
                Nous collectons les données suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Informations d&apos;identification (nom, prénom)</li>
                <li>Coordonnées (email, numéro de téléphone)</li>
                <li>Données de réservation (date, heure, film, siège)</li>
                <li>Historique des transactions</li>
                <li>Données de navigation sur notre site</li>
              </ul>
            </div>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              3. Utilisation des données
            </Typo>
            <div className="space-y-4">
              <p className="text-gray-700">Vos données sont utilisées pour :</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Gérer vos réservations et transactions</li>
                <li>Vous informer sur nos services et promotions</li>
                <li>Améliorer notre service client</li>
                <li>Respecter nos obligations légales</li>
                <li>Analyser et optimiser notre site web</li>
              </ul>
            </div>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              4. Conservation des données
            </Typo>
            <p className="text-gray-700 leading-relaxed">
              Nous conservons vos données personnelles pendant la durée
              nécessaire à la réalisation des finalités pour lesquelles elles
              ont été collectées, augmentée des délais légaux de conservation et
              de prescription.
            </p>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              5. Vos droits
            </Typo>
            <div className="space-y-4">
              <p className="text-gray-700">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Droit d&apos;accès à vos données</li>
                <li>Droit de rectification</li>
                <li>
                  Droit à l&apos;effacement (&quot;droit à l&apos;oubli&quot;)
                </li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d&apos;opposition</li>
              </ul>
            </div>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              6. Cookies
            </Typo>
            <div className="space-y-4">
              <p className="text-gray-700">
                Notre site utilise des cookies pour :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Assurer le bon fonctionnement du site</li>
                <li>Mesurer l&apos;audience et la navigation</li>
                <li>Personnaliser votre expérience</li>
                <li>
                  Vous permettre de partager du contenu sur les réseaux sociaux
                </li>
              </ul>
            </div>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              7. Sécurité
            </Typo>
            <p className="text-gray-700 leading-relaxed">
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données personnelles contre toute
              perte, accès non autorisé, divulgation ou destruction.
            </p>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              8. Contact
            </Typo>
            <div className="space-y-4">
              <p className="text-gray-700">
                Pour toute question concernant notre politique de
                confidentialité ou pour exercer vos droits, vous pouvez nous
                contacter :
              </p>
              <ul className="list-none space-y-2 text-gray-700">
                <li>Email : dpo@cinephoria.fr</li>
                <li>Téléphone : 09 78 970 970</li>
                <li>Adresse : [Adresse du DPO]</li>
              </ul>
            </div>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              9. Modifications
            </Typo>
            <p className="text-gray-700 leading-relaxed">
              Nous nous réservons le droit de modifier cette politique de
              confidentialité à tout moment. Les modifications prendront effet
              dès leur publication sur notre site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
