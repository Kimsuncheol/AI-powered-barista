"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_RULE_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

const isStrongPassword = (value: string) => {
  if (!value) {
    return false;
  }
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);
  const meetsLength = value.length >= PASSWORD_MIN_LENGTH;
  return hasUpper && hasLower && hasNumber && hasSpecial && meetsLength;
};

export default function SignupPage() {
  const router = useRouter();
  const { signup, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
  }>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: typeof fieldErrors = {};
    let hasMissingFields = false;

    if (!name.trim()) {
      errors.name = "Name is required.";
      hasMissingFields = true;
    }
    if (!email) {
      errors.email = "Email is required.";
      hasMissingFields = true;
    } else if (!emailRegex.test(email)) {
      errors.email = "Enter a valid email.";
    }
    if (!password) {
      errors.password = "Password is required.";
      hasMissingFields = true;
    } else if (!isStrongPassword(password)) {
      errors.password = PASSWORD_RULE_MESSAGE;
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm your password.";
      hasMissingFields = true;
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required.";
      hasMissingFields = true;
    }

    setFieldErrors(errors);

    if (hasMissingFields) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (errors.password) {
      toast.error(PASSWORD_RULE_MESSAGE);
      return;
    }

    if (password !== confirmPassword) {
      const mismatchError = "Passwords do not match.";
      setFieldErrors((prev) => ({ ...prev, confirmPassword: mismatchError }));
      toast.error(mismatchError);
      return;
    }

    setSubmissionError(null);
    try {
      await signup({ name: name.trim(), email, password, phone: phone.trim() });
      toast.success("Account created successfully!");
      router.push("/profile");
    } catch (signupError) {
      const message =
        signupError instanceof Error
          ? signupError.message
          : error ?? "Unable to create an account right now.";
      setSubmissionError(message);
      toast.error(message);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 8, md: 12 } }}>
      <Paper elevation={3} sx={{ p: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={600}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start building your personalized AI-powered barista experience.
            </Typography>
          </Stack>
          {(submissionError || error) && (
            <Alert severity="error">{submissionError ?? error}</Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                error={Boolean(fieldErrors.name)}
                helperText={fieldErrors.name}
                required
              />
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
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                error={Boolean(fieldErrors.confirmPassword)}
                helperText={fieldErrors.confirmPassword}
                required
              />
              <TextField
                label="Phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                error={Boolean(fieldErrors.phone)}
                helperText={fieldErrors.phone}
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </Stack>
          </Box>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Already have an account?{" "}
            <Link href="/login" style={{ fontWeight: 600 }}>
              Log in
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
