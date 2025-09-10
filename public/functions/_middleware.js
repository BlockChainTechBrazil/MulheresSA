export async function onRequest(context) {
  try {
    return await context.next();
  } catch (err) {
    // Se não encontrar a rota, retorna o index.html para o React Router lidar com ela
    return context.env.ASSETS.fetch(new URL("/index.html", context.request.url));
  }
}
