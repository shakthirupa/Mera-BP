// data/learnCategories.ts

export type CategorySection = {
  id: string;
  icon: string;
  title: string;
  content: string;
  topicId: string;
};

export type LearnCategory = {
  id: string;
  title: string;
  sections: CategorySection[];
};

export const learnCategories: LearnCategory[] = [
  {
    id: "hypertension",
    title: "About Hypertension",
    sections: [
      {
        id: "what-is-bp",
        icon: "heart-outline",
        title: "What is Blood pressure?",
        content:
          "Blood pressure is the pressure exerted by flowing blood on the walls of the arteries and is essential for delivering oxygen and nutrients throughout the body.",
        topicId: "what-is-bp",
      },
      {
        id: "measure-bp",
        icon: "fitness-outline",
        title: "How to measure Blood pressure?",
        content:
          "Blood pressure should be measured in a relaxed state, using proper positioning and technique, preferably by a physician and not too frequently at home.",
        topicId: "measure-bp",
      },
      {
        id: "why-matters",
        icon: "alert-circle-outline",
        title: "Why It Matters?",
        content:
          "Blood pressure matters because it is essential for supplying oxygen and nutrients to the body and uncontrolled high blood pressure can damage vital organs.",
        topicId: "why-matters",
      },
      {
        id: "monitor-bp",
        icon: "pulse-outline",
        title: "Monitor your blood pressure",
        content:
          "Blood pressure should be monitored periodically, preferably by a physician, and not too frequently at home.",
        topicId: "monitor-bp",
      },
      {
        id: "seek-help",
        icon: "medical-outline",
        title: "When to seek doctors' help",
        content:
          "You should seek medical attention if you are at risk for hypertension or if your blood pressure readings are consistently high, and immediately if serious symptoms appear.",
        topicId: "seek-help",
      },
      {
        id: "emergency-signs",
        icon: "warning-outline",
        title: "Identify emergency signs related to Hypertension",
        content:
          "Emergency signs related to hypertension include severe symptoms that indicate possible damage to vital organs and require immediate hospital attention.",
        topicId: "emergency-signs",
      },
    ],
  },
  {
    id: "diet",
    title: "Diet",
    sections: [
      {
        id: "diet-what-to-eat",
        icon: "checkmark-circle-outline",
        title: "What to eat?",
        content:
          "A heart-healthy diet includes fruits, vegetables, whole grains, lean proteins, and low-fat dairy products.",
        topicId: "diet-what-to-eat",
      },
      {
        id: "diet-what-to-avoid",
        icon: "ban-outline",
        title: "What should avoid?",
        content:
          "Foods high in salt, saturated fat, processed items, and unhealthy lifestyle substances should be avoided.",
        topicId: "diet-what-to-avoid",
      },
      {
        id: "diet-fats",
        icon: "scale-outline",
        title: "Examples of Healthy and unhealthy fats",
        content:
          "Healthy fats include vegetable oils, while unhealthy fats include trans-fat and saturated fats.",
        topicId: "diet-fats",
      },
      {
        id: "diet-dash",
        icon: "heart-outline",
        title: "DASH Diet",
        content:
          "DASH (Dietary Approaches to Stop Hypertension) is a flexible and balanced eating plan that helps create a heart-healthy eating style for life.",
        topicId: "diet-dash",
      },
    ],
  },
  {
    id: "exercise",
    title: "Exercise",
    sections: [
      {
        id: "exercise-physical",
        icon: "walk-outline",
        title: "Physical Activity",
        content:
          "Regular physical activity helps lower blood pressure. Aim for 150 minutes of moderate exercise weekly.",
        topicId: "exercise-physical",
      },
      {
        id: "exercise-aerobic",
        icon: "bicycle-outline",
        title: "Aerobic exercise",
        content:
          "Walking, jogging, cycling, swimming. Start slowly and gradually increase intensity and duration.",
        topicId: "exercise-aerobic",
      },
      {
        id: "exercise-flexibility",
        icon: "body-outline",
        title: "Flexibility and balance exercises",
        content:
          "Stretching, balance training help improve overall fitness and reduce injury risk during exercise.",
        topicId: "exercise-flexibility",
      },
      {
        id: "exercise-yoga",
        icon: "flower-outline",
        title: "Yoga",
        content:
          "Combines physical postures, breathing exercises, and meditation to reduce stress and lower blood pressure.",
        topicId: "exercise-yoga",
      },
      {
        id: "exercise-taichi",
        icon: "leaf-outline",
        title: "Tai-chi",
        content:
          "Gentle, flowing movements that improve balance, flexibility, and help manage stress and blood pressure.",
        topicId: "exercise-taichi",
      },
    ],
  },
  {
    id: "medication",
    title: "Medication Adherence",
    sections: [
      {
        id: "medication-monitor",
        icon: "time-outline",
        title: "Monitor medication",
        content:
          "Blood pressure medicines should be taken regularly and monitored under medical supervision.",
        topicId: "medication-monitor",
      },
      {
        id: "medication-pill-count",
        icon: "calculator-outline",
        title: "Pill Count Technique",
        content:
          "Count remaining tablets in your strip and compare with doses you should have taken. Extra tablets mean missed doses. Helps track adherence and prevent complications.",
        topicId: "medication-pill-count",
      },
      {
        id: "medication-measure",
        icon: "analytics-outline",
        title: "Measure your Medical adherence",
        content:
          "Patients should adhere to medication and treatment recommendations under supervision of a physician.",
        topicId: "medication-measure",
      },
      {
        id: "medication-self",
        icon: "warning-outline",
        title: "Self medication",
        content:
          "Medicines should not be stopped, modified, or taken without proper medical advice.",
        topicId: "medication-self",
      },
    ],
  },
  {
    id: "weight",
    title: "Weight Management",
    sections: [
      {
        id: "weight-caloric",
        icon: "calculator-outline",
        title: "Caloric balance",
        content:
          "Caloric balance means the energy from food equals energy your body uses. Eating more than needed leads to weight gain, which strains the heart and raises blood pressure. Combining healthy eating with regular activity is the safest way to manage weight.",
        topicId: "weight-caloric",
      },
      {
        id: "weight-diet",
        icon: "nutrition-outline",
        title: "Weight reduction diet",
        content:
          "Weight can be reduced by modifying diet, reducing fat, sugar and salt, and avoiding processed and unhealthy foods.",
        topicId: "weight-diet",
      },
      {
        id: "weight-exercise",
        icon: "fitness-outline",
        title: "Exercises for weight reduction",
        content:
          "Regular aerobic exercise and physical activity help in prevention and control of hypertension and weight-related risk.",
        topicId: "weight-exercise",
      },
      {
        id: "weight-lifestyle",
        icon: "checkmark-circle-outline",
        title: "Lifestyle Modifications for maintaining weight loss",
        content:
          "Healthy lifestyle practices including sleep, exercise, diet control and avoidance of harmful substances help prevent and manage hypertension.",
        topicId: "weight-lifestyle",
      },
    ],
  },
  {
    id: "myths",
    title: "Myths & Facts",
    sections: [
      {
        id: "myth-symptoms",
        icon: "bulb-outline",
        title: "Myth: Hypertension always has symptoms",
        content:
          "Fact: Hypertension is often called the 'silent killer' because most people have no symptoms at all.",
        topicId: "myth-symptoms",
      },
      {
        id: "myth-young",
        icon: "bulb-outline",
        title: "Myth: Only older people get hypertension",
        content:
          "Fact: Hypertension can affect people of all ages, including children and young adults.",
        topicId: "myth-young",
      },
      {
        id: "myth-cured",
        icon: "bulb-outline",
        title: "Myth: Hypertension can be cured",
        content:
          "Fact: While hypertension can be managed effectively with lifestyle changes and medication, it is a lifelong condition.",
        topicId: "myth-cured",
      },
      {
        id: "myth-medication-stop",
        icon: "bulb-outline",
        title: "Myth: You can stop medication when BP is normal",
        content:
          "Fact: Normal BP readings while on medication mean the medication is working. Stopping it may cause BP to rise again.",
        topicId: "myth-medication-stop",
      },
    ],
  },
  {
    id: "about",
    title: "About the App",
    sections: [
      {
        id: "app-purpose",
        icon: "information-circle-outline",
        title: "Purpose of Mera BP",
        content:
          "Mera BP is designed to help patients understand, monitor, and manage their blood pressure through education and tracking.",
        topicId: "app-purpose",
      },
      {
        id: "app-features",
        icon: "apps-outline",
        title: "Key Features",
        content:
          "The app includes BP tracking, educational content, medication reminders, and an AI chatbot for health queries.",
        topicId: "app-features",
      },
      {
        id: "app-privacy",
        icon: "lock-closed-outline",
        title: "Privacy & Data",
        content:
          "Your health data is stored securely and is never shared with third parties without your consent.",
        topicId: "app-privacy",
      },
    ],
  },
];

export function getCategoryById(id: string): LearnCategory | undefined {
  return learnCategories.find((c) => c.id === id);
}