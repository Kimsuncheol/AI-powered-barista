"use client";

import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  useAppearance,
  type Appearance,
} from "@/providers/AppearanceProvider";
import { mockUser } from "@/lib/mockUser";

const appearanceOptions: { value: Appearance; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export default function Header() {
  const { appearance, setAppearance } = useAppearance();

  const handleAppearanceChange = (
    _: React.MouseEvent<HTMLElement>,
    next: Appearance | null
  ) => {
    if (next) {
      setAppearance(next);
    }
  };

  const isSignedIn = mockUser.isSignedIn;
  const userInitial = mockUser.name?.[0] ?? "U";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backgroundColor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 2, sm: 3 },
          minHeight: 70,
          display: "flex",
          gap: 2,
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: 0.5 }}
            component="span"
          >
            AI-Powered Barista
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ToggleButtonGroup
            size="small"
            value={appearance}
            exclusive
            color="primary"
            onChange={handleAppearanceChange}
            aria-label="Select appearance"
            sx={{ borderRadius: 2 }}
          >
            {appearanceOptions.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <IconButton
            component={Link}
            href="/cart"
            aria-label="View cart"
            color="inherit"
          >
            <Badge badgeContent={mockUser.cartItemCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {isSignedIn ? (
            <Avatar sx={{ bgcolor: "primary.main" }}>{userInitial}</Avatar>
          ) : (
            <Button component={Link} href="/signin" variant="text">
              Sign in
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
