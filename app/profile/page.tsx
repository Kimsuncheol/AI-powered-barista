"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useFavoriteDrinks } from "@/hooks/useFavoriteDrinks";
import { useOrderHistory } from "@/hooks/useOrderHistory";
import type { OrderHistoryItem } from "@/types/auth";

const statusColors: Record<OrderHistoryItem["status"], "default" | "info" | "warning" | "success"> = {
  PENDING: "default",
  ACCEPTED: "info",
  IN_PREPARATION: "warning",
  READY_FOR_PICKUP: "success",
  COMPLETED: "success",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: orderHistory, loading: orderLoading, error: orderError } = useOrderHistory(user?.id);
  const { data: favorites, loading: favoritesLoading, error: favoritesError } = useFavoriteDrinks(
    user?.id
  );

  useEffect(() => {
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
  }, [user?.name, user?.phone]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage(null);
    setFormError(null);

    const errors: typeof fieldErrors = {};
    if (!name.trim()) {
      errors.name = "Name is required.";
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() });
      setFormMessage("Profile updated!");
    } catch {
      setFormError("Unable to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <Container component="main" maxWidth="sm" sx={{ py: 8 }}>
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
          <Typography variant="h5" fontWeight={600}>
            Please sign in
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Log in to view your profile, order history, and favorites.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Button variant="contained">Log in</Button>
            </Link>
            <Link href="/signup" style={{ textDecoration: "none" }}>
              <Button variant="outlined">Sign up</Button>
            </Link>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={6}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight={700}>
            My Profile
          </Typography>
          <Button variant="text" onClick={() => { logout(); router.push("/"); }}>
            Log out
          </Button>
        </Stack>

        <Paper variant="outlined" sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              Profile Information
            </Typography>
            {formMessage && <Alert severity="success">{formMessage}</Alert>}
            {formError && <Alert severity="error">{formError}</Alert>}
            <Box component="form" onSubmit={handleSave}>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  error={Boolean(fieldErrors.name)}
                  helperText={fieldErrors.name}
                  required
                />
                <TextField label="Email" value={user.email} InputProps={{ readOnly: true }} />
                <TextField
                  label="Phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  error={Boolean(fieldErrors.phone)}
                  helperText={fieldErrors.phone}
                  required
                />
                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSaving}
                    sx={{ textTransform: "none" }}
                  >
                    {isSaving ? "Saving…" : "Save changes"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={600}>
            Order History
          </Typography>
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
            {orderLoading ? (
              <Stack alignItems="center">
                <CircularProgress />
              </Stack>
            ) : orderError ? (
              <Alert severity="error">{orderError}</Alert>
            ) : orderHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                You have no past orders yet.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {orderHistory.map((order) => (
                  <Paper
                    key={order.id}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2 }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Order {order.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(order.createdAt)}
                        </Typography>
                      </Stack>
                      <Stack alignItems="flex-end">
                        <Chip
                          label={order.status.replace(/_/g, " ")}
                          color={statusColors[order.status]}
                          size="small"
                        />
                        <Typography variant="subtitle2" fontWeight={600}>
                          {formatCurrency(order.total)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Stack>

        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={600}>
            Favorite Drinks
          </Typography>
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
            {favoritesLoading ? (
              <Stack alignItems="center">
                <CircularProgress />
              </Stack>
            ) : favoritesError ? (
              <Alert severity="error">{favoritesError}</Alert>
            ) : favorites.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                You don’t have any favorite drinks yet.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {favorites.map((drink) => (
                  <Grid item xs={12} sm={6} md={4} key={drink.id}>
                    <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      {drink.imageUrl && (
                        <CardMedia
                          component="img"
                          height="150"
                          image={drink.imageUrl}
                          alt={drink.name}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {drink.name}
                        </Typography>
                        {drink.description && (
                          <Typography variant="body2" color="text.secondary">
                            {drink.description}
                          </Typography>
                        )}
                        {drink.price != null && (
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{ mt: 1 }}
                          >
                            {formatCurrency(drink.price)}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          variant="contained"
                          fullWidth
                          onClick={() => {
                            console.info("Add favorite to cart (mock)", drink.id);
                            // TODO: hook this up with the shared cart service.
                          }}
                        >
                          Add to cart
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Stack>
      </Stack>
    </Container>
  );
}
