"use client";

import { Typo } from "@/app/_components/_layout/typography";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";

export default function CGVpage() {
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
              Explorez nos Conditions Générales de Vente !
            </div>
            <div className="font-extralight text-base md:text-xl dark:text-neutral-200 text-center py-4">
              Plongez dans les détails de nos politiques de vente et découvrez
              tout ce que vous devez savoir sur vos droits en tant que client.
              Nous sommes là pour vous garantir une expérience d'achat fluide
              et sécurisée, afin que vous puissiez profiter pleinement de chaque
              moment avec Cinéphoria !
            </div>
          </motion.div>
        </AuroraBackground>
      </div>
      <div className="my-16 space-y-10">
        <Typo variant="h2">1. Champ d'application</Typo>
        <Typo variant="body-base">
          Les présentes Conditions Générales de Vente (CGV) s'appliquent à
          toutes les ventes de billets et de services proposés par Cinéphoria,
          ci-après dénommée "le Vendeur", sur son site internet et dans ses
          établissements.
        </Typo>

        <Typo variant="h2">2. Acceptation des CGV</Typo>
        <Typo variant="body-base">
          Toute commande implique l'acceptation sans réserve des présentes CGV.
          Le client, ci-après dénommé "l'Acheteur", déclare avoir pris
          connaissance des CGV avant de passer commande.
        </Typo>

        <Typo variant="h2">3. Commande</Typo>
        <Typo variant="body-base">
          Les commandes peuvent être effectuées en ligne sur le site de
          Cinéphoria ou directement dans nos cinémas. L'Acheteur doit fournir
          des informations exactes lors de la commande.
        </Typo>

        <Typo variant="h2">4. Prix</Typo>
        <Typo variant="body-base">
          Les prix des billets et des services sont indiqués en euros, toutes
          taxes comprises. Cinéphoria se réserve le droit de modifier ses prix à
          tout moment, mais les produits seront facturés sur la base des tarifs
          en vigueur au moment de la validation de la commande.
        </Typo>

        <Typo variant="h2">5. Paiement</Typo>
        <Typo variant="body-base">
          Le paiement peut être effectué par carte bancaire, espèces ou tout
          autre moyen de paiement accepté par Cinéphoria. La commande ne sera
          considérée comme définitive qu'après validation du paiement.
        </Typo>

        <Typo variant="h2">6. Billetterie</Typo>
        <Typo variant="body-base">
          Les billets achetés en ligne doivent être présentés à l'entrée du
          cinéma, soit sous forme imprimée, soit sous forme numérique sur un
          appareil mobile. Les billets ne sont pas remboursables, sauf en cas
          d'annulation de la séance par Cinéphoria.
        </Typo>

        <Typo variant="h2">7. Annulation et remboursement</Typo>
        <Typo variant="body-base">
          En cas d'annulation d'une séance par Cinéphoria, l'Acheteur sera
          informé par email et pourra demander un remboursement ou un échange
          pour une autre séance. Les demandes de remboursement doivent être
          effectuées dans un délai de 14 jours suivant l'annulation.
        </Typo>

        <Typo variant="h2">8. Responsabilité</Typo>
        <Typo variant="body-base">
          Cinéphoria ne pourra être tenue responsable des dommages indirects ou
          immatériels résultant de l'utilisation de ses services. La
          responsabilité du Vendeur est limitée au montant de la commande.
        </Typo>

        <Typo variant="h2">9. Protection des données personnelles</Typo>
        <Typo variant="body-base">
          Les informations collectées lors de la commande sont nécessaires à la
          gestion de la commande et à la relation client. L'Acheteur dispose
          d'un droit d'accès, de rectification et de suppression de ses données
          personnelles conformément à la législation en vigueur.
        </Typo>

        <Typo variant="h2">10. Modifications des CGV</Typo>
        <Typo variant="body-base">
          Cinéphoria se réserve le droit de modifier les présentes CGV à tout
          moment. Les modifications seront applicables dès leur publication sur
          le site internet.
        </Typo>

        <Typo variant="h2">11. Droit applicable</Typo>
        <Typo variant="body-base">
          Les présentes CGV sont soumises au droit français. En cas de litige,
          les tribunaux français seront seuls compétents.
        </Typo>
      </div>
    </div>
  );
}
