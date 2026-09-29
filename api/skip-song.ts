import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  const apiKey = process.env.AZURACAST_API_KEY;
  const baseUrl = process.env.AZURACAST_BASE_URL;

  if (!apiKey || !baseUrl) {
    return res.status(500).json({
      error: "Configuración de AzuraCast incompleta",
    });
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/station/1/backend/skip`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error(
        "AzuraCast skip error:",
        response.status,
        text
      );

      return res.status(response.status).json({
        error: "AzuraCast no pudo pasar la canción",
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Skip song error:", error);

    return res.status(500).json({
      error: "No se pudo conectar con AzuraCast",
    });
  }
}