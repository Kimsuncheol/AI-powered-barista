"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { AdminUser, UserRole } from "@/types/admin";

const mockUsers: AdminUser[] = [
  {
    id: "admin-1",
    name: "Hana Barista",
    email: "hana@ai-barista.com",
    role: "ADMIN",
    phone: "010-5555-0101",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "staff-1",
    name: "Liam Staff",
    email: "liam@ai-barista.com",
    role: "STAFF",
    phone: "010-5555-0202",
    isActive: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "customer-1",
    name: "Keira Customer",
    email: "keira@example.com",
    role: "CUSTOMER",
    phone: "010-5555-0303",
    isActive: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(dateString));

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [tempRole, setTempRole] = useState<UserRole>("CUSTOMER");
  const [tempActive, setTempActive] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const openDialog = (user: AdminUser) => {
    setCurrentUser(user);
    setTempRole(user.role);
    setTempActive(user.isActive);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUser.id
          ? { ...user, role: tempRole, isActive: tempActive }
          : user
      )
    );
    setMessage("User updated (mock).");
    setDialogOpen(false);
  };

  const toggleActive = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
    setMessage("User status toggled (mock).");
    // TODO: replace with PATCH /admin/users/{id}.
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor and update user roles and activation status from here.
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
      >
        <TextField
          label="Search by name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="role-filter-label">Role</InputLabel>
          <Select
            labelId="role-filter-label"
            label="Role"
            value={roleFilter}
            onChange={(event: SelectChangeEvent<"ALL" | UserRole>) =>
              setRoleFilter(event.target.value as "ALL" | UserRole)
            }
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="CUSTOMER">Customer</MenuItem>
            <MenuItem value="STAFF">Staff</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {message && <Alert severity="success">{message}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.phone ?? "—"}</TableCell>
                <TableCell>
                  <Typography color={user.isActive ? "success.main" : "error.main"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" onClick={() => openDialog(user)}>
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => toggleActive(user.id)}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField margin="normal" label="Name" value={currentUser?.name ?? ""} fullWidth />
          <TextField
            margin="normal"
            label="Email"
            value={currentUser?.email ?? ""}
            fullWidth
            disabled
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              label="Role"
              value={tempRole}
              onChange={(event: SelectChangeEvent<UserRole>) =>
                setTempRole(event.target.value as UserRole)
              }
            >
              <MenuItem value="CUSTOMER">Customer</MenuItem>
              <MenuItem value="STAFF">Staff</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
            <Switch
              checked={tempActive}
              onChange={(_, checked) => setTempActive(checked)}
            />
            <Typography>{tempActive ? "Active" : "Inactive"}</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
