"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { useAuth } from "@/hooks/useAuth";

const drawerWidth = 260;

type AdminNavItem = {
  label: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: AdminNavItem[] = [
  { label: "Users", icon: <PeopleIcon />, path: "/admin/users" },
  { label: "Menu Items", icon: <MenuBookIcon />, path: "/admin/menu" },
  { label: "Orders", icon: <ReceiptLongIcon />, path: "/admin/orders" },
  { label: "Analytics", icon: <AnalyticsIcon />, path: "/admin/analytics" },
  { label: "AI Settings", icon: <SettingsSuggestIcon />, path: "/admin/ai-settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const canViewAdmin = Boolean(user && (user.role === "ADMIN" || user.role === "STAFF"));

  if (!canViewAdmin) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Stack spacing={2} textAlign="center">
          <Typography variant="h5" fontWeight={600}>
            Access denied
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You need an admin account to view this area.
          </Typography>
          <Button variant="contained" onClick={() => router.push("/login")}>
            Log in
          </Button>
        </Stack>
      </Box>
    );
  }

  const activePath = pathname ?? "/admin";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="primary"
        elevation={1}
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar  sx={{
          px: { xs: 2, sm: 3 },
          minHeight: 70,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" component="div"             sx={{ fontWeight: 700, letterSpacing: 0.5 }}
            >
              Admin Dashboard
            </Typography>
          </Link>
          <Button color="inherit" onClick={() => logout()}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar>
          <Stack spacing={1}>
            <Typography variant="h6">AI Barista</Typography>
            <Typography variant="body2" color="text.secondary">
              Admin Console
            </Typography>
          </Stack>
        </Toolbar>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItemButton
              component={Link}
              href={item.path}
              key={item.path}
              selected={activePath === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, ml: `${drawerWidth}px`, pt: "90px", px: { xs: 2, md: 4 }, pb: 4 }}
      >
        {children}
      </Box>
    </Box>
  );
}
