const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { image } = await req.json();

    if (!image || typeof image !== "string") {
      return new Response(
        JSON.stringify({
          error: "No se recibió ninguna imagen.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "No está configurada la API key de OpenAI.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5",
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: `
Analizá esta imagen de un menú de una rotisería.

Extraé únicamente las opciones de comida que una persona podría elegir para hacer un pedido.

No incluy:
- precios
- bebidas
- títulos generales
- nombre de la rotisería
- fechas
- teléfonos
- direcciones
- textos promocionales

Mantené los nombres de los platos lo más parecidos posible a como aparecen en la imagen.

Si una opción tiene una descripción, integrala brevemente cuando sea útil.

Si la imagen no contiene un menú reconocible, devolvé una lista vacía.
                  `,
                },
                {
                  type: "input_image",
                  image_url: image,
                  detail: "high",
                },
              ],
            },
          ],
          text: {
            format: {
              type: "json_schema",
              name: "menu_options",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  opciones: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                required: ["opciones"],
                additionalProperties: false,
              },
            },
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Error de OpenAI:", errorText);

      return new Response(
        JSON.stringify({
          error: "La IA no pudo analizar la imagen.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const data = await response.json();

    if (!data.output_text) {
      throw new Error("La IA no devolvió un resultado.");
    }

    const resultado = JSON.parse(data.output_text);

    return new Response(
      JSON.stringify(resultado),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error en analizar-menu:", error);

    return new Response(
      JSON.stringify({
        error: "No se pudo analizar el menú.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});