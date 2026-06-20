export function validate({ body, query, params }) {
  return (req, res, next) => {
    try {
      req.validated = {
        ...(req.validated || {}),
        ...(body ? { body: body.parse(req.body) } : {}),
        ...(query ? { query: query.parse(req.query) } : {}),
        ...(params ? { params: params.parse(req.params) } : {})
      };
      next();
    } catch (error) {
      next(error);
    }
  };
}
