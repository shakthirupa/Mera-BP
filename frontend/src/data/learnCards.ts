// data/learnCards.ts

export type LearnCard = {
  id: string;
  icon: string;
  bg: string;
  title: string;
  subtitle: string;
};

export const learnCards: LearnCard[] = [
  {
    id: "hypertension",
    icon: "medkit-outline",
    bg: "#E0F2FE",
    title: "About Hypertension",
    subtitle: "Understand & manage high blood pressure.",
  },
  {
    id: "diet",
    icon: "nutrition-outline",
    bg: "#ECFDF5",
    title: "Diet",
    subtitle: "Follow healthy eating patterns.",
  },
  {
    id: "exercise",
    icon: "walk-outline",
    bg: "#EFF6FF",
    title: "Exercise",
    subtitle: "Stay active & reduce stress.",
  },
  {
    id: "medication",
    icon: "medical-outline",
    bg: "#F0F9FF",
    title: "Medication Adherence",
    subtitle: "Track your daily medications.",
  },
  {
    id: "weight",
    icon: "scale-outline",
    bg: "#e9faff",
    title: "Weight Management",
    subtitle: "Monitor your weight and maintain healthy BMI.",
  },
  {
    id: "myths",
    icon: "bulb-outline",
    bg: "#e8ebff",
    title: "Myths & Facts",
    subtitle: "Learn the truth about hypertension.",
  },
];