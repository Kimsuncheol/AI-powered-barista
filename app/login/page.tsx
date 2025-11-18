"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { showError, showInfo } from "@/lib/toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, loginAsDev } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: typeof fieldErrors = {};

    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Enter a valid email.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmissionError(null);
    try {
      await login({ email, password });
      router.push("/profile");
    } catch {
      const message = error ?? "Unable to log in at the moment.";
      setSubmissionError(message);
      showError(message);
    }
  };

  const handleDevLogin = async () => {
    setSubmissionError(null);
    try {
      await loginAsDev();
      router.push("/admin");
      showInfo("Signed in as Dev Admin (mock).");
    } catch {
      const message = "Unable to login as dev admin.";
      setSubmissionError(message);
      showError(message);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 8, md: 12 } }}>
      <Paper elevation={3} sx={{ p: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={600}>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access your AI barista preferences and order history.
            </Typography>
          </Stack>
          {(submissionError || error) && (
            <Alert severity="error">{submissionError ?? error}</Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password}
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                {loading ? "Signing in..." : "Log In"}
              </Button>
              {process.env.NODE_ENV === "development" && (
                <>
                  {/* TODO: gate dev auth more tightly before shipping to production. */}
                  <Button
                    variant="outlined"
                    fullWidth
                    disabled={loading}
                    sx={{ textTransform: "none" }}
                    onClick={handleDevLogin}
                  >
                    Log in as Dev Admin
                  </Button>
                </>
              )}
            </Stack>
          </Box>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Don’t have an account?{" "}
            <Link href="/signup" style={{ fontWeight: 600 }}>
              Sign up
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
