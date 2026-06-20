export function authRequired(req, res, next) {
  const expectedKey = process.env.DEMO_API_KEY || "week6-demo-key";
  const providedKey = req.header("x-api-key");

  if (providedKey !== expectedKey) {
    res.status(401).json({
      ok: false,
      error: {
        message: "A valid x-api-key header is required for this route."
      }
    });
    return;
  }

  next();
}
