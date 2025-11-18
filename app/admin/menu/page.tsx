"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { AdminMenuItem, AdminOptionGroup, AdminOptionItem } from "@/types/admin";

const categories = ["Coffee", "Tea", "Non-Coffee", "Dessert"];

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const mockMenuItems: AdminMenuItem[] = [
  {
    id: "menu-1",
    name: "Cinnamon Espresso Craft",
    description: "Espresso, toasted cinnamon, and steamed oat milk.",
    category: "Coffee",
    basePrice: 5.5,
    imageUrl:
      "https://images.unsplash.com/photo-1510626176961-4b57c4d6c7b0?auto=format&fit=crop&w=900&q=80",
    isHidden: false,
    isOutOfStock: false,
    isSeasonal: false,
    tags: ["hot", "sweet"],
    optionGroups: [
      {
        id: "group-size",
        name: "Size",
        isRequired: true,
        minSelect: 1,
        maxSelect: 1,
        options: [
          { id: "opt-small", name: "Small", priceDelta: 0, isDefault: false },
          { id: "opt-medium", name: "Medium", priceDelta: 0.5, isDefault: true },
          { id: "opt-large", name: "Large", priceDelta: 1, isDefault: false },
        ],
      },
    ],
  },
  {
    id: "menu-2",
    name: "Hibiscus Citrus Tea",
    description: "Floral hibiscus with Valencia orange and mint.",
    category: "Tea",
    basePrice: 4.2,
    imageUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
    isHidden: false,
    isOutOfStock: false,
    isSeasonal: true,
    seasonStart: "2024-06-01",
    seasonEnd: "2024-09-01",
    tags: ["cold", "refreshing"],
    optionGroups: [],
  },
];

const defaultOptionItem = (): AdminOptionItem => ({
  id: generateId(),
  name: "",
  priceDelta: 0,
  isDefault: false,
});

const defaultOptionGroup = (): AdminOptionGroup => ({
  id: generateId(),
  name: "",
  isRequired: false,
  minSelect: 0,
  maxSelect: 1,
  options: [defaultOptionItem()],
});

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function AdminMenuPage() {
  const [items, setItems] = useState<AdminMenuItem[]>(mockMenuItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<AdminMenuItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const tagOptions = useMemo(
    () =>
      Array.from(
        new Set(
          items.flatMap((item) => item.tags)
        )
      ),
    [items]
  );

  const handleOpen = (item?: AdminMenuItem) => {
    if (item) {
      setFormState({ ...item, optionGroups: item.optionGroups.map((group) => ({ ...group })) });
      setIsEditing(true);
    } else {
      setFormState({
        id: generateId(),
        name: "",
        description: "",
        category: categories[0],
        basePrice: 0,
        isHidden: false,
        isOutOfStock: false,
        isSeasonal: false,
        tags: [],
        optionGroups: [defaultOptionGroup()],
      });
      setIsEditing(false);
    }
    setDialogOpen(true);
    setMessage(null);
  };

  const handleFormChange = <K extends keyof AdminMenuItem>(field: K, value: AdminMenuItem[K]) => {
    setFormState((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleGroupChange = (
    groupId: string,
    field: keyof AdminOptionGroup,
    value: string | number | boolean
  ) => {
    setFormState((prev) => {
      if (!prev) return prev;
      const nextGroups = prev.optionGroups.map((group) =>
        group.id === groupId ? { ...group, [field]: value } : group
      );
      return { ...prev, optionGroups: nextGroups };
    });
  };

  const handleOptionItemChange = (
    groupId: string,
    optionId: string,
    field: keyof AdminOptionItem,
    value: string | number | boolean
  ) => {
    setFormState((prev) => {
      if (!prev) return prev;
      const nextGroups = prev.optionGroups.map((group) => {
        if (group.id !== groupId) return group;

        const nextOptions = group.options.map((option) =>
          option.id === optionId ? { ...option, [field]: value } : option
        );
        return { ...group, options: nextOptions };
      });
      return { ...prev, optionGroups: nextGroups };
    });
  };

  const handleAddOption = (groupId: string) => {
    setFormState((prev) => {
      if (!prev) return prev;
      const nextGroups = prev.optionGroups.map((group) =>
        group.id === groupId
          ? { ...group, options: [...group.options, defaultOptionItem()] }
          : group
      );
      return { ...prev, optionGroups: nextGroups };
    });
  };

  const handleDeleteOption = (groupId: string, optionId: string) => {
    setFormState((prev) => {
      if (!prev) return prev;
      const nextGroups = prev.optionGroups.map((group) =>
        group.id === groupId
          ? { ...group, options: group.options.filter((option) => option.id !== optionId) }
          : group
      );
      return { ...prev, optionGroups: nextGroups };
    });
  };

  const handleAddGroup = () => {
    setFormState((prev) => (prev ? { ...prev, optionGroups: [...prev.optionGroups, defaultOptionGroup()] } : null));
  };

  const handleDeleteGroup = (groupId: string) => {
    setFormState((prev) => (prev ? { ...prev, optionGroups: prev.optionGroups.filter((group) => group.id !== groupId) } : null));
  };

  const handleSubmit = () => {
    if (!formState) return;
    if (isEditing) {
      setItems((prev) =>
        prev.map((item) => (item.id === formState.id ? formState : item))
      );
      setMessage("Menu item updated (mock).");
    } else {
      setItems((prev) => [...prev, formState]);
      setMessage("Menu item created (mock).");
    }
    // TODO: hook up POST /admin/menu/items and PATCH /admin/menu/items/{id}.
    setDialogOpen(false);
  };

  const handleDelete = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setMessage("Menu item removed (mock).");
    // TODO: DELETE /admin/menu/items/{id}
  };

  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            Menu Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add, edit, or remove menu items and configure option groups.
          </Typography>
        </Stack>
        <Button variant="contained" onClick={() => handleOpen()}>
          Create new item
        </Button>
      </Stack>

      {message && <Alert severity="success">{message}</Alert>}

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={1}>
                <Typography variant="h6" fontWeight={600}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Typography variant="body2">
                  Category: {item.category}
                </Typography>
                <Typography variant="subtitle1" fontWeight={600}>
                  {formatCurrency(item.basePrice)}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {item.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ pt: 1 }}>
                  <Chip label={item.isHidden ? "Hidden" : "Visible"} color={item.isHidden ? "default" : "success"} />
                  <Chip label={item.isOutOfStock ? "Out of Stock" : "In Stock"} color={item.isOutOfStock ? "warning" : "info"} />
                  {item.isSeasonal && (
                    <Chip label="Seasonal" color="secondary" />
                  )}
                </Stack>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" variant="outlined" onClick={() => handleOpen(item)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{isEditing ? "Edit Menu Item" : "New Menu Item"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={formState?.name ?? ""}
              onChange={(event) => handleFormChange("name", event.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={formState?.description ?? ""}
              onChange={(event) => handleFormChange("description", event.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="category-select">Category</InputLabel>
                <Select
                  labelId="category-select"
                  label="Category"
                  value={formState?.category ?? categories[0]}
                  onChange={(event) =>
                    handleFormChange("category", event.target.value as string)
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Base price"
                type="number"
                value={formState?.basePrice ?? 0}
                onChange={(event) => handleFormChange("basePrice", Number(event.target.value))}
                InputProps={{ inputMode: "decimal" }}
                fullWidth
              />
            </Stack>
            <Autocomplete
              multiple
              freeSolo
              options={tagOptions}
              value={formState?.tags ?? []}
              onChange={(_, value) => handleFormChange("tags", value)}
              renderInput={(params) => <TextField {...params} label="Tags" />}
            />
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <FormControlLabel
                control={
                  <Switch
                    checked={formState?.isHidden ?? false}
                    onChange={(_, checked) => handleFormChange("isHidden", checked)}
                  />
                }
                label="Hidden"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formState?.isOutOfStock ?? false}
                    onChange={(_, checked) => handleFormChange("isOutOfStock", checked)}
                  />
                }
                label="Out of stock"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formState?.isSeasonal ?? false}
                    onChange={(_, checked) => handleFormChange("isSeasonal", checked)}
                  />
                }
                label="Seasonal"
              />
            </Stack>
            {formState?.isSeasonal && (
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Season start"
                  type="date"
                  value={formState?.seasonStart ?? ""}
                  onChange={(event) => handleFormChange("seasonStart", event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Season end"
                  type="date"
                  value={formState?.seasonEnd ?? ""}
                  onChange={(event) => handleFormChange("seasonEnd", event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            )}
            <Divider />
            <Stack spacing={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                Option Groups
              </Typography>
              {formState?.optionGroups.map((group) => (
                <Card key={group.id} variant="outlined" sx={{ p: 2 }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Group name"
                          value={group.name}
                          onChange={(event) =>
                            handleGroupChange(group.id, "name", event.target.value)
                          }
                          fullWidth
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={group.isRequired}
                              onChange={(_, checked) =>
                                handleGroupChange(group.id, "isRequired", checked)
                              }
                            />
                          }
                          label="Required"
                        />
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Min select"
                          type="number"
                          value={group.minSelect}
                          onChange={(event) =>
                            handleGroupChange(group.id, "minSelect", Number(event.target.value))
                          }
                          sx={{ width: 120 }}
                        />
                        <TextField
                          label="Max select"
                          type="number"
                          value={group.maxSelect}
                          onChange={(event) =>
                            handleGroupChange(group.id, "maxSelect", Number(event.target.value))
                          }
                          sx={{ width: 120 }}
                        />
                        <Button
                          variant="text"
                          color="error"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          Remove group
                        </Button>
                      </Stack>
                      <Stack spacing={1}>
                        {group.options.map((option) => (
                          <Stack
                            key={option.id}
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <TextField
                              label="Option name"
                              value={option.name}
                              onChange={(event) =>
                                handleOptionItemChange(
                                  group.id,
                                  option.id,
                                  "name",
                                  event.target.value
                                )
                              }
                              fullWidth
                            />
                            <TextField
                              label="Price delta"
                              type="number"
                              value={option.priceDelta}
                              onChange={(event) =>
                                handleOptionItemChange(
                                  group.id,
                                  option.id,
                                  "priceDelta",
                                  Number(event.target.value)
                                )
                              }
                              sx={{ width: 120 }}
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={option.isDefault}
                                  onChange={(_, checked) =>
                                    handleOptionItemChange(group.id, option.id, "isDefault", checked)
                                  }
                                />
                              }
                              label="Default"
                            />
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeleteOption(group.id, option.id)}
                            >
                              Remove
                            </Button>
                          </Stack>
                        ))}
                      </Stack>
                      <Button
                        variant="outlined"
                        onClick={() => handleAddOption(group.id)}
                        sx={{ width: "fit-content" }}
                      >
                        Add option
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
              <Button variant="text" onClick={handleAddGroup}>
                + Add option group
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {isEditing ? "Save changes" : "Create item"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
