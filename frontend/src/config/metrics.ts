// config/metrics.ts
// Single source of truth for ALL metric/lab-report behaviour.
// Classifications follow AHA/ACC 2017 (BP), ADA 2024 (glucose/HbA1c),
// and standard clinical ranges (heart rate).

export type MetricKey =
  | "BLOOD_PRESSURE"
  | "HEART_RATE"
  | "HBA1C"
  | "BLOOD_GLUCOSE_FASTING"
  | "BLOOD_GLUCOSE_POST_PRANDIAL";

// ─── Shared input descriptor ──────────────────────────────────────────────────

export interface ObservationInput {
  field: "value1" | "value2";
  label: string;
  placeholder: string;
  unit: string;
  min: number;
  max: number;
}

// ─── Per-metric config shape ──────────────────────────────────────────────────

export interface MetricConfig {
  label: string;
  /** ObservationCode enum value sent to the API */
  code: string;
  /**
   * GlucoseContext enum value — only set for BLOOD_GLUCOSE entries.
   * Appended as &context=... on GET, included in POST/PUT body.
   */
  context?: "FASTING" | "POST_PRANDIAL";
  inputs: ObservationInput[];
  /** Build the display string shown in the table from raw API values */
  formatValue: (value1: number, value2?: number) => string;
  /** Parse a display string back into value1/value2 (for pre-filling the edit form) */
  parseValue: (display: string) => { value1: string; value2?: string };
  getStatusColor: (display: string) => string;
  getStatusLabel: (display: string) => string;
}

// ─── Config map ───────────────────────────────────────────────────────────────

export const METRIC_CONFIG: Record<MetricKey, MetricConfig> = {

  // ── Vitals ─────────────────────────────────────────────────────────────────

  BLOOD_PRESSURE: {
    label: "Blood Pressure",
    code:  "BLOOD_PRESSURE",
    inputs: [
      { field: "value1", label: "Systolic",  placeholder: "e.g. 120", unit: "mmHg", min: 0,  max: 999 },
      { field: "value2", label: "Diastolic", placeholder: "e.g. 80",  unit: "mmHg", min: 0,  max: 999 },
    ],
    formatValue: (v1, v2) => `${v1}/${v2}`,
    parseValue: (d) => {
      const [v1, v2] = d.split("/");
      return { value1: v1, value2: v2 };
    },

    // AHA/ACC 2017 — checks BOTH systolic and diastolic.
    // Either value reaching a higher category determines the classification.
    // Hypotension thresholds: sys < 90 or dia < 60 (clinical standard).
    getStatusColor: (d) => {
      const [sys, dia] = d.split("/").map(n => parseInt(n, 10));
      if (sys < 70 || dia < 40)                                 return "#DC2626"; // Severe Hypotension
      if (sys < 90 || dia < 60)                                 return "#F59E0B"; // Low (Hypotension)
      if (sys > 180 || dia > 120)                               return "#DC2626"; // Hypertensive Crisis
      if (sys < 120 && dia < 80)                                return "#10B981"; // Normal
      if (sys < 130 && dia < 80)                                return "#F59E0B"; // Elevated
      if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) return "#FB923C"; // Stage 1
      return "#EF4444";                                                            // Stage 2
    },
    getStatusLabel: (d) => {
      const [sys, dia] = d.split("/").map(n => parseInt(n, 10));
      if (sys < 70 || dia < 40)                                 return "Critical Low";
      if (sys < 90 || dia < 60)                                 return "Low BP";
      if (sys > 180 || dia > 120)                               return "Crisis";
      if (sys < 120 && dia < 80)                                return "Normal";
      if (sys < 130 && dia < 80)                                return "Elevated";
      if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) return "Stage 1";
      return "Stage 2";
    },
  },

  HEART_RATE: {
    label: "Heart Rate",
    code:  "HEART_RATE",
    inputs: [
      { field: "value1", label: "Heart Rate", placeholder: "e.g. 72", unit: "bpm", min: 0, max: 999 },
    ],
    formatValue: (v1) => `${v1} bpm`,
    parseValue:  (d) => ({ value1: d.replace(" bpm", "").trim() }),

    // Normal resting HR: 60–100 bpm (ACC/AHA).
    // < 40 or > 150 are considered critical ranges requiring urgent attention.
    getStatusColor: (d) => {
      const r = parseInt(d, 10);
      if (r < 40 || r > 150) return "#DC2626"; // Critical
      if (r < 60 || r > 100) return "#F59E0B"; // Bradycardia / Tachycardia
      return "#10B981";                          // Normal
    },
    getStatusLabel: (d) => {
      const r = parseInt(d, 10);
      if (r < 40)   return "Critical";
      if (r < 60)   return "Bradycardia";
      if (r <= 100) return "Normal";
      if (r <= 150) return "Tachycardia";
      return "Critical";
    },
  },

  // ── Lab reports ────────────────────────────────────────────────────────────

  HBA1C: {
    label: "HbA1c",
    code:  "HBA1C",
    inputs: [
      { field: "value1", label: "HbA1c", placeholder: "e.g. 5.7", unit: "%", min: 3, max: 15 },
    ],
    formatValue: (v1) => `${v1}%`,
    parseValue:  (d) => ({ value1: d.replace("%", "").trim() }),

    // ADA 2024: < 5.7% Normal, 5.7–6.4% Pre-diabetic, ≥ 6.5% Diabetic
    getStatusColor: (d) => {
      const v = parseFloat(d);
      if (v < 5.7) return "#10B981"; // Normal
      if (v < 6.5) return "#F59E0B"; // Pre-diabetic
      return "#EF4444";              // Diabetic
    },
    getStatusLabel: (d) => {
      const v = parseFloat(d);
      if (v < 5.7) return "Normal";
      if (v < 6.5) return "Pre-diabetic";
      return "Diabetic";
    },
  },

  BLOOD_GLUCOSE_FASTING: {
    label:   "Fasting Blood Sugar",
    code:    "BLOOD_GLUCOSE",
    context: "FASTING",
    inputs: [
      { field: "value1", label: "Blood Glucose", placeholder: "e.g. 90", unit: "mg/dL", min: 40, max: 500 },
    ],
    formatValue: (v1) => `${v1} mg/dL`,
    parseValue:  (d) => ({ value1: d.replace(" mg/dL", "").trim() }),

    // ADA 2024: < 100 Normal, 100–125 Pre-diabetic, ≥ 126 Diabetic
    getStatusColor: (d) => {
      const v = parseFloat(d);
      if (v < 100) return "#10B981"; // Normal
      if (v < 126) return "#F59E0B"; // Pre-diabetic
      return "#EF4444";              // Diabetic
    },
    getStatusLabel: (d) => {
      const v = parseFloat(d);
      if (v < 100) return "Normal";
      if (v < 126) return "Pre-diabetic";
      return "Diabetic";
    },
  },

  BLOOD_GLUCOSE_POST_PRANDIAL: {
    label:   "Post Prandial Blood Sugar",
    code:    "BLOOD_GLUCOSE",
    context: "POST_PRANDIAL",
    inputs: [
      { field: "value1", label: "Blood Glucose", placeholder: "e.g. 140", unit: "mg/dL", min: 40, max: 500 },
    ],
    formatValue: (v1) => `${v1} mg/dL`,
    parseValue:  (d) => ({ value1: d.replace(" mg/dL", "").trim() }),

    // ADA 2024 (2-hour post-meal): < 140 Normal, 140–199 Pre-diabetic, ≥ 200 Diabetic
    getStatusColor: (d) => {
      const v = parseFloat(d);
      if (v < 140) return "#10B981"; // Normal
      if (v < 200) return "#F59E0B"; // Pre-diabetic
      return "#EF4444";              // Diabetic
    },
    getStatusLabel: (d) => {
      const v = parseFloat(d);
      if (v < 140) return "Normal";
      if (v < 200) return "Pre-diabetic";
      return "Diabetic";
    },
  },
};