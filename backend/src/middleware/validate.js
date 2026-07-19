import ApiError from "../utils/ApiError.js";
// factory to generate validation middlewares for each route
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body||{},
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return next(new ApiError(400, "validation failed", errors));
  }
  //contains the parsed and potentially transformed data (Zod can coerce types, strip unknown fields, apply defaults, etc., depending on schema configuration). We attach this to a new property req.validated — deliberately not overwriting req.body directly — so that controllers can trust req.validated as the single source of already-validated, already-shaped data, while req.body remains the raw original if ever needed for debugging.
  req.validated = result.data;
  next();
};

export default validate;
