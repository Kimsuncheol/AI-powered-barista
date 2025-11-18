"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Paper,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

export default function AISettingsPage() {
  const [assistantEnabled, setAssistantEnabled] = useState(true);
  const [recommendationsEnabled, setRecommendationsEnabled] = useState(true);
  const [creativity, setCreativity] = useState(50);

  return (
    <Container component="main" maxWidth="md" sx={{ py: 8 }}>
      <Paper variant="outlined" sx={{ borderRadius: 3, p: 4 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              AI Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Control how the AI barista and recommendations behave across the experience.
            </Typography>
          </Stack>
          <FormControlLabel
            control={
              <Switch
                checked={assistantEnabled}
                onChange={(_, checked) => setAssistantEnabled(checked)}
              />
            }
            label="AI assistant enabled"
          />
          <FormControlLabel
            control={
              <Switch
                checked={recommendationsEnabled}
                onChange={(_, checked) => setRecommendationsEnabled(checked)}
              />
            }
            label="Recommendations enabled"
          />
          <Stack spacing={1}>
            <Typography variant="subtitle1">Creativity level</Typography>
            <Slider
              value={creativity}
              onChange={(_, value) => setCreativity(value as number)}
              aria-label="Creativity level"
              valueLabelDisplay="auto"
            />
          </Stack>
          <Box textAlign="right">
            <Button
              variant="contained"
              onClick={() => {
                // TODO: save AI settings via PATCH /admin/ai-settings
              }}
            >
              Save settings
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
