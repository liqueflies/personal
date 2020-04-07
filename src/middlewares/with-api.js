import Prismic from 'prismic-javascript';

let api = null;
const apiEndpoint = 'https://loregirardi.prismic.io/api/v2';

export default async (req, res, next) => {
  if (!api) {
    console.log('Called -> Prismic.getApi');
    api = await Prismic.getApi(apiEndpoint);
  }

  req.prismic = {
    ref: api.masterRef.ref,
    apiEndpoint,
    api,
  }
  next();
}

