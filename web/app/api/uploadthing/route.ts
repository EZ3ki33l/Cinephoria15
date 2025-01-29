import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { UTApi } from "uploadthing/server";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

// DELETE : Supprime un fichier spécifique
export async function DELETE(request: Request) {
  try {
    const data = await request.json();

    if (!data.url) {
      return new Response(JSON.stringify({ error: "URL manquante" }), {
        status: 400,
      });
    }

    // Extraction de l'identifiant du fichier
    const url = new URL(data.url);
    const fileId = url.pathname.split("/").pop(); // Extract file ID
    if (!fileId) {
      return new Response(
        JSON.stringify({ error: "Identifiant introuvable" }),
        {
          status: 400,
        }
      );
    }

    const utapi = new UTApi();

    console.log("Tentative de suppression du fichier :", fileId);
    const result = await utapi.deleteFiles(fileId);
    console.log("Résultat de suppression :", result);

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
