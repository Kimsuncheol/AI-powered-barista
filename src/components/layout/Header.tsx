"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ComputerIcon from "@mui/icons-material/Computer";
import { useAppearance, type Appearance } from "@/providers/AppearanceProvider";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

const APPEARANCE_MODES: Appearance[] = ["light", "dark", "system"];

const modeLabels: Record<Appearance, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const getNextAppearance = (current: Appearance): Appearance => {
  const idx = APPEARANCE_MODES.indexOf(current);
  const nextIdx = (idx + 1) % APPEARANCE_MODES.length;
  return APPEARANCE_MODES[nextIdx];
};

const renderAppearanceIcon = (mode: Appearance) => {
  switch (mode) {
    case "light":
      return <LightModeIcon fontSize="small" />;
    case "dark":
      return <DarkModeIcon fontSize="small" />;
    case "system":
    default:
      return <ComputerIcon fontSize="small" />;
  }
};

export default function Header() {
  const router = useRouter();
  const { appearance, setAppearance } = useAppearance();
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const cartQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const avatarInitial = user?.name ? user.name[0].toUpperCase() : "?";
  const menuOpen = Boolean(anchorEl);

  const handleAppearanceToggle = () => {
    const nextMode = getNextAppearance(appearance);
    setAppearance(nextMode);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    handleMenuClose();
    router.push(path);
  };

  const handleSignOut = () => {
    handleMenuClose();
    signOut();
    router.push("/");
  };

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={`Theme: ${modeLabels[appearance]}`}>
            <IconButton
              onClick={handleAppearanceToggle}
              color="inherit"
              aria-label={`Switch to ${modeLabels[getNextAppearance(appearance)]} theme`}
            >
              {renderAppearanceIcon(appearance)}
            </IconButton>
          </Tooltip>

          <IconButton
            component={Link}
            href="/cart"
            aria-label="View cart"
            color="inherit"
          >
            <Badge badgeContent={cartQuantity} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton
                size="small"
                onClick={handleAvatarClick}
                sx={{ ml: 1 }}
                aria-label="Account menu"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                  {avatarInitial}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem disableRipple disabled>
                  <Box>
                    <Typography variant="subtitle2">
                      {user.name ?? "Signed user"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleNavigate("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/profile?tab=orders")}>
                  Order history
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/profile?tab=favorites")}>
                  Favorite drinks
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/profile/settings")}>
                  Settings
                </MenuItem>
                {user.role === "ADMIN" && (
                  <MenuItem onClick={() => handleNavigate("/admin")}>
                    Admin
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleNavigate("/support")}>
                  Help &amp; support
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
              </Menu>
            </>
          ) : (
            <Button component={Link} href="/login" variant="text">
              Sign in
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
