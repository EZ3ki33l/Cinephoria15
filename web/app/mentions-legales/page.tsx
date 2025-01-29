"use client";

import React from "react";
import { Typo } from "../_components/_layout/typography";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function MentionsLegales() {
  return (
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
          className="relative flex flex-col gap-4 items-center justify-center px-4 text-center"
        >
          <div className="text-xl md:text-3xl font-bold dark:text-white ">
            Découvrez nos Mentions Légales !
          </div>
          <div className="font-extralight text-base md:text-xl dark:text-neutral-200 py-4">
            Plongez dans les détails qui garantissent votre sécurité et votre
            confiance. Nous vous expliquons ici nos engagements, nos politiques
            et vos droits en tant qu'utilisateur, car chez Cinéphoria, la
            transparence est au cœur de notre mission !
          </div>
        </motion.div>
      </AuroraBackground>

      <div className="flex flex-col justify-center my-16 space-y-10">
        <Typo variant="h1" component="h1" className="mb-8">
          Mentions Légales
        </Typo>

        <div className="space-y-8">
          <section className="relative">
            <Typo variant="h3" component="h2" className="mb-4">
              1. Éditeur du site
            </Typo>
            <Card className="flex flex-col w-[80%] mx-auto border-none">
              <ul className="list-disc px-16 py-5 space-y-2">
                <li>Cinephoria SAS</li>
                <li>Capital social : 100 000€</li>
                <li>SIRET : XXX XXX XXX 00000</li>
                <li>RCS Paris B XXX XXX XXX</li>
                <li>Siège social : [Adresse complète]</li>
                <li>Téléphone : 09 78 970 970</li>
                <li>Email : contact@cinephoria.fr</li>
              </ul>
            </Card>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              2. Directeur de la publication
            </Typo>
            <p>[Nom du directeur de la publication]</p>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              3. Hébergement
            </Typo>
            <Card className="flex flex-col w-[80%] mx-auto border-none">
              <div className="px-16 py-5 space-y-2">
                <p>Vercel Inc.</p>
                <p>340 S Lemon Ave #4133</p>
                <p>Walnut, CA 91789</p>
                <p>États-Unis</p>
              </div>
            </Card>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              4. Propriété intellectuelle
            </Typo>
            <p className="text-gray-700 leading-relaxed">
              L&apos;ensemble du contenu de ce site (architecture, textes,
              photos, illustrations, logos, fichiers...) est la propriété de
              Cinephoria ou de leurs propriétaires respectifs. Toute
              reproduction, distribution, modification, adaptation,
              retransmission ou publication, même partielle, de ces différents
              éléments est strictement interdite sans l&apos;accord exprès par
              écrit de Cinephoria.
            </p>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              5. Données personnelles
            </Typo>
            <p className="text-gray-700 leading-relaxed">
              Les informations concernant la collecte et le traitement des
              données personnelles sont détaillées dans notre Politique de
              Confidentialité.
            </p>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              6. Cookies
            </Typo>
            <p className="text-gray-700 leading-relaxed">
              Notre site utilise des cookies pour améliorer votre expérience de
              navigation. Pour plus d&apos;informations sur l&apos;utilisation
              des cookies, veuillez consulter notre Politique de
              Confidentialité.
            </p>
          </section>

          <section>
            <Typo variant="h3" component="h2" className="mb-4">
              7. Loi applicable
            </Typo>
            <p className="text-gray-700 leading-relaxed">
              Les présentes mentions légales sont régies par le droit français.
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
