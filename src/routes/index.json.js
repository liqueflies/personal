import {Predicates} from 'prismic-javascript';

export async function get(req, res) {
  const { results } = await req.prismic.api.query(
    Predicates.at('document.type', 'work'),
    { orderings : '[my.work.release desc]' }
  );

  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify({ results }));
}