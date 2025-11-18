"use client";

import { apiFetch } from "./client";
import type { User } from "@/types/auth";

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

type AuthResponse = {
  user: User;
};

export async function login(payload: LoginPayload): Promise<User> {
  const { user } = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return user;
}

export async function signup(payload: SignupPayload): Promise<User> {
  const { user } = await apiFetch<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return user;
}

export async function logout() {
  await apiFetch<void>("/auth/logout", {
    method: "POST",
  });
}

export async function getMe(): Promise<User> {
  return apiFetch<User>("/me");
}
