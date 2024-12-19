import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Typo } from "../_components/_layout/typography";
import { Maps } from "../_components/_maps/maps";
import { Button } from "../_components/_layout/button";
import { InfiniteExpandableCards } from "../_components/expandableMovieCard";
import { NewsCarousel } from "../_components/newsCarousel";
import { AnimationHome } from "@/components/ui/animationHome";

export default function Home() {
  return (
    <div className="flex flex-col space-y-6">
      <AnimationHome />
      <div className="flex flex-col py-5">
        <Typo variant="h1" component="h1">
          Les dernières sorties :
        </Typo>
        <div className="pt-5">
          <InfiniteExpandableCards />
        </div>
      </div>
      <Separator className="my-10" />
      <div className="flex flex-col py-5">
        <Typo variant="h1" component="h1">
          Nos cinémas :
        </Typo>
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-center gap-y-3 pr-16 text-justify">
            <Typo variant="body-base" component="p">
              <strong className="text-lg">Cinéphoria</strong>, c'est un réseau
              de cinémas où chaque projection est un{" "}
              <strong className="text-lg">moment unique</strong>.
            </Typo>
            <Typo variant="body-base" component="p">
              Retrouvez-nous à :
            </Typo>
            <ul className="list-disc list-inside ml-5 font-semibold">
              <li>Nantes</li>
              <li>Bordeaux</li>
              <li>Paris</li>
              <li>Toulouse</li>
              <li>Lille</li>
              <li>Charleroi</li>
              <li>Liège</li>
            </ul>
            <Typo variant="body-base" component="p">
              Nos salles{" "}
              <strong className="text-lg">modernes et conviviales</strong> vous
              offrent l’opportunité de vivre le cinéma sous toutes ses formes,
              des grands classiques aux nouveautés.
            </Typo>
          </div>
          <div className="">
            <Maps />
          </div>
        </div>
      </div>
      <Separator className="my-10" />
      <div className="grid md:grid-cols-6 py-5 mb-5">
        <div className="md:col-span-2">
          <Typo variant="h1" component="h1">
            Nous connaitre :
          </Typo>
          <div className="flex flex-col gap-3 text-justify px-3 ">
            <Typo variant="body-base" component="p" className="py-2">
              <span className="text-lg font-semibold">Cinéphoria :</span> Plus
              qu'un cinéma, une expérience.
            </Typo>
            <Typo variant="body-base" component="p">
              Dégustez de délicieux produits locaux, installez-vous dans nos
              fauteuils grand confort et laissez-vous emporter par des films
              soigneusement sélectionnés. Un engagement fort pour
              l'environnement vient compléter cette offre.
            </Typo>
          </div>
          <Link href="/a-propos" className="flex justify-center py-5">
            <Button
              variant="primary"
              iconPosition="right"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              En voir plus
            </Button>
          </Link>
        </div>
        <div className="md:col-span-4 md:ml-10">
          <Typo variant="h1" component="h1">
            Nos actualités :
          </Typo>
          <div className="">
            <NewsCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}
