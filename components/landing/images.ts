/* ==========================================================================
   Fotografías de Unsplash (Unsplash License: uso libre, comercial y
   hotlink permitidos, sin necesidad de atribución). Se sirven optimizadas
   desde el CDN de Unsplash con formato y tamaño automáticos.
   ========================================================================== */

const U = (id: string, w = 1200) => {
  if (id.startsWith('http://') || id.startsWith('https://')) {
    return id;
  }
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;
};

export const IMG = {
  // Hero: contenedores de reciclaje clasificados por color.
  heroBins: U('photo-1532996122724-e3c354a0b15b', 1600),

  // Problema: contenedor urbano desbordado.
  problema: U('photo-1605600659908-0ef719419d41', 1000),

  // Clasificación · una foto por categoría de residuo.
  carton_papel: U('photo-1530587191325-3db32d826c18', 720),
  plastico: U('photo-1526951521990-620dc14c214b', 720),
  organico: U('photo-1542601906990-b4d3fb778b09', 720),

  // Arquitectura: trabajo de ingeniería sobre el nodo Edge.
  arquitectura: U('photo-1581091226825-a6a2a5aee158', 1100),
} as const;

