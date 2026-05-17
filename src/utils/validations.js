import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().strict().min(2).max(100).required(),
  email: Joi.string().strict().email().required(),
  password: Joi.string().strict().min(6).required(),
  role: Joi.string()
    .strict()
    .valid("applicant", "recruiter", "user")
    .default("applicant"),
});

export const loginSchema = Joi.object({
  email: Joi.string().strict().email().required(),
  password: Joi.string().strict().required(),
});

export const companySchema = Joi.object({
  name: Joi.string().strict().min(2).max(100).required(),
  description: Joi.string().strict().min(5).required(),
  location: Joi.string().strict().min(2).required(),
  website: Joi.string().strict().uri().optional().allow(""),
}).unknown(false);

export const updateCompanySchema = Joi.object({
  name: Joi.string().strict().min(2).max(100).optional(),
  description: Joi.string().strict().min(5).optional().allow("", null),
  location: Joi.string().strict().min(2).optional().allow("", null),
  website: Joi.string().strict().uri().optional().allow("", null),
}).unknown(false);

export const categorySchema = Joi.object({
  name: Joi.string().strict().min(2).max(100).required(),
});

export const jobSchema = Joi.object({
  company_id: Joi.string().strict().required(),
  category_id: Joi.string().strict().optional().allow("", null),
  title: Joi.string().strict().min(2).max(200).required(),
  description: Joi.string().strict().optional().allow(""),
  location: Joi.string().strict().optional().allow(""),
  salary_min: Joi.number().integer().optional().allow(null),
  salary_max: Joi.number().integer().optional().allow(null),
  job_type: Joi.string().strict().optional().allow(""),
  experience_level: Joi.string().strict().optional().allow(""),
  location_type: Joi.string().strict().optional().allow(""),
  status: Joi.string().strict().optional().allow(""),
}).unknown(true);

export const updateJobSchema = Joi.object({
  company_id: Joi.string().strict().optional(),
  category_id: Joi.string().strict().optional().allow("", null),
  title: Joi.string().strict().min(2).max(200).optional(),
  description: Joi.string().strict().optional().allow(""),
  location: Joi.string().strict().optional().allow(""),
  salary_min: Joi.number().integer().optional().allow(null),
  salary_max: Joi.number().integer().optional().allow(null),
  job_type: Joi.string().strict().optional().allow(""),
  experience_level: Joi.string().strict().optional().allow(""),
  location_type: Joi.string().strict().optional().allow(""),
  status: Joi.string().strict().optional().allow(""),
}).unknown(true);

export const applicationSchema = Joi.object({
  job_id: Joi.string().required(),
  cover_letter: Joi.string().optional().allow(""),
  status: Joi.string().optional().allow(""),
  user_id: Joi.string().optional().allow(""),
}).unknown(true);

export const applicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "reviewed", "accepted", "rejected")
    .required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
