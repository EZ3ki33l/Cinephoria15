import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { UTApi } from "uploadthing/server";
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

// DELETE : Supprime un fichier spécifique
export async function DELETE(request: Request) {
  try {
    const data = await request.json(); // Récupère les données de la requête
    if (!data.url) {
      return new Response(JSON.stringify({ error: "URL manquante" }), {
        status: 400,
      });
    }

    // Extraction de l'identifiant du fichier
    const fileId = data.url.substring(data.url.lastIndexOf("/") + 1);
    const utapi = new UTApi();

    // Suppression du fichier via Uploadthing
    await utapi.deleteFiles(fileId);

    return new Response(JSON.stringify({ message: "Fichier supprimé" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier :", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la suppression" }),
      { status: 500 }
    );
  }
}