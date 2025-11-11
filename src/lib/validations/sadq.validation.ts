import { z } from "zod";

/**
 * Sadq Authentication Validation Schemas
 * Validates Sadq API requests and responses
 */

export const sadqCredentialsSchema = z.object({
  grant_type: z.string().min(1, "Grant type is required"),
  password: z.string().min(1, "Password is required"),
  username: z.string().min(1, "Username is required"),
  accountId: z.string().min(1, "Account ID is required"),
  accountSecret: z.string().min(1, "Account Secret is required"),
});

export const sadqTokenResponseSchema = z.object({
  access_token: z.string().nullable(),
  expires_in: z.number(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  error: z.string().nullable(),
  errorMessage: z.string().nullable(),
  useraccessKey: z.string().nullable(),
});

export const sadqAuthRequestSchema = z.object({
  grant_type: z.string().default("test"),
  password: z.string().min(1, "Password is required"),
  username: z.string().min(1, "Username is required"),
  accountId: z.string().min(1, "Account ID is required"),
  accountSecret: z.string().min(1, "Account Secret is required"),
});

export const sadqConfigSchema = z.object({
  baseUrl: z.string().url("Invalid base URL"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  accountId: z.string().min(1, "Account ID is required"),
  accountSecret: z.string().min(1, "Account Secret is required"),
  basicAuth: z.string().min(1, "Basic auth is required"),
});

export type SadqCredentials = z.infer<typeof sadqCredentialsSchema>;
export type SadqTokenResponse = z.infer<typeof sadqTokenResponseSchema>;
export type SadqAuthRequest = z.infer<typeof sadqAuthRequestSchema>;
export type SadqConfig = z.infer<typeof sadqConfigSchema>;
