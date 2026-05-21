import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid("applicant", "recruiter", "user")
    .default("applicant"),
}).unknown(true);

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(true);

export const companySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(5).required(),
  location: Joi.string().min(2).required(),
  website: Joi.string().uri().optional().allow(""),
}).unknown(true);

export const updateCompanySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().min(5).optional().allow("", null),
  location: Joi.string().min(2).optional().allow("", null),
  website: Joi.string().uri().optional().allow("", null),
}).unknown(true);

export const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
}).unknown(true);

export const jobSchema = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().optional().allow("", null),
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().optional().allow(""),
  location: Joi.string().optional().allow(""),
  salary_min: Joi.number().integer().optional().allow(null),
  salary_max: Joi.number().integer().optional().allow(null),
  job_type: Joi.string().optional().allow(""),
  experience_level: Joi.string().optional().allow(""),
  location_type: Joi.string().optional().allow(""),
  status: Joi.string().optional().allow(""),
}).unknown(true);

export const updateJobSchema = Joi.object({
  company_id: Joi.string().optional(),
  category_id: Joi.string().optional().allow("", null),
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().optional().allow(""),
  location: Joi.string().optional().allow(""),
  salary_min: Joi.number().integer().optional().allow(null),
  salary_max: Joi.number().integer().optional().allow(null),
  job_type: Joi.string().optional().allow(""),
  experience_level: Joi.string().optional().allow(""),
  location_type: Joi.string().optional().allow(""),
  status: Joi.string().optional().allow(""),
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
}).unknown(true);

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
}).unknown(true);
