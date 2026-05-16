// data/healthTopics.ts

export type Scene = {
  id: string;
  patientImage: any;
  doctorImage: any;
  patientText: string;
  patientSpeech: string;
  doctorLines: string[];
  doctorSpeech: string;
  decorImage?: any;
};

export type HealthTopic = {
  id: string;
  title: string;
  backgroundImage: any;
  scenes: Scene[];
};

export const healthTopics: HealthTopic[] = [
  {
    id: "what-is-bp",
    title: "What is Blood Pressure?",
    backgroundImage: require("@/assets/images/bh.png"),
    scenes: [
      {
        id: "what-is-bp-scene1",
        patientImage: require("@/assets/images/scene1pbp.png"),
        doctorImage: require("@/assets/images/scene1dbp.png"),
        patientText: "Doctor, what is blood pressure?",
        patientSpeech: "Doctor, what is blood pressure?",                                                                        
        doctorLines: [
          "Blood pressure is a pressure exerted by flowing blood on the walls of our arteries.",
          "It is important because it is the driving force for blood to travel around the body to deliver oxygen and nutrients to the organs of the body.",
        ],
        doctorSpeech:
          "Blood pressure, is a pressure exerted by flowing blood, on the walls of our arteries. It is important, because it is the driving force, for blood to travel around the body, to deliver oxygen and nutrients, to the organs of the body.",
        decorImage: require("@/assets/images/heart.png"),
      },
      {
        id: "what-is-bp-scene2",
        patientImage: require("@/assets/images/scene2pbp.png"),
        doctorImage: require("@/assets/images/scene2dbp.png"),
        patientText: "I see two numbers in my report. What do they mean?",
        patientSpeech: "I see two numbers in my report. What do they mean?",
        doctorLines: [
          "Systolic Blood Pressure (upper BP reading) is a result of Cardiac Activity (Active Cardiac Pumping).",
          "Diastolic pressure (lower BP reading) indicates pressure maintained in arteries even as heart relaxes between beats.",
        ],
        doctorSpeech:
          "Systolic Blood Pressure, upper BP reading, is a result of Cardiac Activity, Active Cardiac Pumping. Diastolic pressure, lower BP reading, indicates pressure maintained in arteries, even as heart relaxes between beats.",
        decorImage: require("@/assets/images/sysdias.png"),
      },
      {
        id: "what-is-bp-scene3",
        patientImage: require("@/assets/images/scene3pbp.png"),
        doctorImage: require("@/assets/images/scene3dbp.png"),
        patientText: "What is considered normal?",
        patientSpeech: "What is considered normal?",
        doctorLines: [
          "The generally accepted level for normal blood pressure is < 130 mm Hg for systolic, and < 85 mm Hg diastolic.",
        ],
        doctorSpeech:
          "The generally accepted level for normal blood pressure is, less than 130 mm Hg for systolic, and less than 85 mm Hg diastolic.",
      },
      {
        id: "what-is-bp-scene4",
        patientImage: require("@/assets/images/scene4pbp.png"),
        doctorImage: require("@/assets/images/scene4dbp.png"),
        patientText: "Does blood pressure remain the same all the time?",
        patientSpeech: "Does blood pressure remain the same all the time?",
        doctorLines: [
          "Blood pressure never remains constant, it varies from beat to beat.",
          "Blood pressure variation can be normal or abnormal.",
        ],
        doctorSpeech:
          "Blood pressure never remains constant. It varies from beat to beat. Blood pressure variation, can be normal, or abnormal.",
      },
      {
        id: "what-is-bp-scene5",
        patientImage: require("@/assets/images/scene5pbp.png"),
        doctorImage: require("@/assets/images/scene5dbp.png"),
        patientText: "When does it change?",
        patientSpeech: "When does it change?",
        doctorLines: [
          "Such variation can be physiological such as during sleep, food (post-meals), physical activity and exercise, stress, etc.",
          "It may also be pathological due to disease conditions of kidney, heart, endocrine system.",
          "Blood pressure may also be affected by changes in posture, advancing age, or by volume of blood in circulation such as in dehydration.",
        ],
        doctorSpeech:
          "Such variation can be physiological, such as during sleep, food, post-meals, physical activity and exercise, stress, etc. It may also be pathological, due to disease conditions of kidney, heart, endocrine system. Blood pressure may also be affected by changes in posture, advancing age, or by volume of blood in circulation, such as in dehydration.",
      },
    ],
  },

  {
    id: "measure-bp",
    title: "How to Measure BP?",
    backgroundImage: require("@/assets/images/bh.png"),
    scenes: [
      {
        id: "measure-bp-scene1",
        patientImage: require("@/assets/images/scene1pmbp.png"),
        doctorImage: require("@/assets/images/scene1dmbp.png"),
        patientText: "Doctor, I'm a little confused… how should I measure my blood pressure properly at home?",
        patientSpeech: "Doctor, I'm a little confused… how should I measure my blood pressure properly at home?",
        doctorLines: [
          "That's okay, ma'am. I'll explain it step by step.",
          "First, please sit quietly and relax for at least 5 minutes before checking.",
          "And try not to drink tea, coffee, or smoke for about 30 minutes before measuring.",
        ],
        doctorSpeech:
          "That's okay, ma'am. I'll explain it step by step. First, please sit quietly and relax for at least 5 minutes before checking. And try not to drink tea, coffee, or smoke for about 30 minutes before measuring.",
        decorImage: require("@/assets/images/cup.png"),
      },
      {
        id: "measure-bp-scene2",
        patientImage: require("@/assets/images/scene2pmbp.png"),
        doctorImage: require("@/assets/images/scene2dmbp.png"),
        patientText: "Oh… alright dear. How should I sit?",
        patientSpeech: "Oh… alright dear. How should I sit?",
        doctorLines: [
          "Sit comfortably on a chair with your back supported.",
          "Keep your feet flat on the floor — don't cross your legs.",
          "And rest your arm on a table so that it is at the same level as your heart.",
        ],
        doctorSpeech:
          "Sit comfortably on a chair with your back supported. Keep your feet flat on the floor — don't cross your legs. And rest your arm on a table so that it is at the same level as your heart.",
        decorImage: require("@/assets/images/hand.png"),
      },
      {
        id: "measure-bp-scene3",
        patientImage: require("@/assets/images/scene3pmbp.png"),
        doctorImage: require("@/assets/images/scene3dmbp.png"),
        patientText: "I see… and how do I use the machine?",
        patientSpeech: "I see… and how do I use the machine?",
        doctorLines: [
          "Wrap the cuff snugly around your upper arm, just above the elbow.",
          "Switch on the digital machine.",
          "It will tighten for a few seconds and then slowly loosen.",
          "After that, it will show two numbers — the upper number is called systolic, and the lower number is diastolic.",
        ],
        doctorSpeech:
          "Wrap the cuff snugly around your upper arm, just above the elbow. Switch on the digital machine. It will tighten for a few seconds and then slowly loosen. After that, it will show two numbers — the upper number is called systolic, and the lower number is diastolic.",
        decorImage: require("@/assets/images/tight.png"),
      },
      {
        id: "measure-bp-scene4",
        patientImage: require("@/assets/images/scene4pmbp.png"),
        doctorImage: require("@/assets/images/scene4dmbp.png"),
        patientText: "Should I keep checking it every day?",
        patientSpeech: "Should I keep checking it every day?",
        doctorLines: [
          "No, ma'am. You don't need to check it too often.",
          "For most people, checking once a month is enough unless your doctor advises more frequent monitoring.",
        ],
        doctorSpeech:
          "No, ma'am. You don't need to check it too often. For most people, checking once a month is enough unless your doctor advises more frequent monitoring.",
      },
      {
        id: "measure-bp-scene5",
        patientImage: require("@/assets/images/scene5pmbp.png"),
        doctorImage: require("@/assets/images/scene5dmbp.png"),
        patientText: "Thank you, doctor. That's very helpful.",
        patientSpeech: "Thank you, doctor. That's very helpful.",
        doctorLines: [
          "If you take a reading, take two measurements a few minutes apart and note the average.",
          "And always bring your machine when you visit your doctor so we can check if it's working correctly.",
        ],
        doctorSpeech:
          "If you take a reading, take two measurements a few minutes apart and note the average. And always bring your machine when you visit your doctor so we can check if it's working correctly.",
      },
    ],
  },

  {
    id: "why-matters",
    title: "Why It Matters",
    backgroundImage: require("@/assets/images/bh.png"),
    scenes: [
      {
        id: "why-matters-scene1",
        patientImage: require("@/assets/images/scene1mopbp.png"),
        doctorImage: require("@/assets/images/scene3modbp.png"),
        patientText: "Doctor… why is blood pressure so important?",
        patientSpeech: "Doctor… why is blood pressure so important?",
        doctorLines: [
          "That's a very good question, ma'am.",
          "Blood pressure is important because it is the driving force that helps blood travel around your body.",
          "It carries oxygen and nutrients to all your organs — like your heart, brain, kidneys, and eyes.",
        ],
        doctorSpeech:
          "That's a very good question, ma'am. Blood pressure is important because it is the driving force that helps blood travel around your body. It carries oxygen and nutrients to all your organs — like your heart, brain, kidneys, and eyes.",
        decorImage: require("@/assets/images/sysdias.png"),
      },
      {
        id: "why-matters-scene2",
        patientImage: require("@/assets/images/scene2mopbp.png"),
        doctorImage: require("@/assets/images/scene2modbp.png"),
        patientText: "Oh… so if it becomes high, is that dangerous?",
        patientSpeech: "Oh… so if it becomes high, is that dangerous?",
        doctorLines: [
          "Yes, ma'am.",
          "If blood pressure stays high for a long time, it can slowly damage your blood vessels.",
          "It can affect important organs like your heart, brain, kidneys, and eyes.",
        ],
        doctorSpeech:
          "Yes, ma'am. If blood pressure stays high for a long time, it can slowly damage your blood vessels. It can affect important organs like your heart, brain, kidneys, and eyes.",
      },
      {
        id: "why-matters-scene3",
        patientImage: require("@/assets/images/scene3mopbp.png"),
        doctorImage: require("@/assets/images/scene3modbp.png"),
        patientText: "What kind of problems can it cause?",
        patientSpeech: "What kind of problems can it cause?",
        doctorLines: [
          "It may lead to heart problems like heart attack, chest pain (angina), or heart failure.",
          "It can also cause stroke or paralysis.",
          "In some people, it may damage the kidneys and lead to kidney failure.",
          "And sometimes, it can even affect vision.",
        ],
        doctorSpeech:
          "It may lead to heart problems like heart attack, chest pain (angina), or heart failure. It can also cause stroke or paralysis. In some people, it may damage the kidneys and lead to kidney failure. And sometimes, it can even affect vision.",
      },
      {
        id: "why-matters-scene4",
        patientImage: require("@/assets/images/scene4mopbp.png"),
        doctorImage: require("@/assets/images/scene2modbp.png"),
        patientText: "That sounds very serious, doctor.",
        patientSpeech: "That sounds very serious, doctor.",
        doctorLines: [
          "But don't worry, ma'am. With regular check-ups, proper medicines, and a healthy lifestyle, we can control it safely.",
        ],
        doctorSpeech:
          "But don't worry, ma'am. With regular check-ups, proper medicines, and a healthy lifestyle, we can control it safely.",
      },
      {
        id: "why-matters-scene5",
        patientImage: require("@/assets/images/scene5mopbp.png"),
        doctorImage: require("@/assets/images/scene3modbp.png"),
        patientText: "Thank you, doctor. I feel much better now.",
        patientSpeech: "Thank you, doctor. I feel much better now.",
        doctorLines: [
          "You're welcome, ma'am. Just follow the treatment plan and stay positive.",
        ],
        doctorSpeech:
          "You're welcome, ma'am. Just follow the treatment plan and stay positive.",
      },
    ],
  },

  {
    id: "monitor-bp",
    title: "Monitor Your BP",
    backgroundImage: require("@/assets/images/bh.png"),
    scenes: [
      {
        id: "monitor-bp-scene1",
        patientImage: require("@/assets/images/scene1monpbp.png"),
        doctorImage: require("@/assets/images/scene1mondbp.png"),
        patientText: "Doctor, how often should I monitor my blood pressure?",
        patientSpeech: "Doctor, how often should I monitor my blood pressure?",
        doctorLines: [
          "Regular monitoring is important, but it is not necessary to check your blood pressure every day.",
          "In most cases, measuring it once every 2 to 3 weeks is sufficient, or during each visit to your physician.",
        ],
        doctorSpeech:
          "Regular monitoring is important, but it is not necessary to check your blood pressure every day. In most cases, measuring it once every 2 to 3 weeks is sufficient, or during each visit to your physician.",
        decorImage: require("@/assets/images/monitor.png"),
      },
      {
        id: "monitor-bp-scene2",
        patientImage: require("@/assets/images/scene2monpbp.png"),
        doctorImage: require("@/assets/images/scene2mondbp.png"),
        patientText: "I have been checking it frequently at home. Is that acceptable?",
        patientSpeech: "I have been checking it frequently at home. Is that acceptable?",
        doctorLines: [
          "Frequent monitoring at home is not recommended unless specifically advised.",
          "Checking too often may lead to unnecessary anxiety, and stress can itself increase blood pressure.",
        ],
        doctorSpeech:
          "Frequent monitoring at home is not recommended unless specifically advised. Checking too often may lead to unnecessary anxiety, and stress can itself increase blood pressure.",
      },
      {
        id: "monitor-bp-scene3",
        patientImage: require("@/assets/images/scene3monpbp.png"),
        doctorImage: require("@/assets/images/scene3mondbp.png"),
        patientText: "Should I avoid checking it at home completely?",
        patientSpeech: "Should I avoid checking it at home completely?",
        doctorLines: [
          "It is preferable to have your blood pressure checked by your physician.",
          "However, if you wish to monitor it at home, you should purchase a reliable, good-quality electronic blood pressure monitor.",
        ],
        doctorSpeech:
          "It is preferable to have your blood pressure checked by your physician. However, if you wish to monitor it at home, you should purchase a reliable, good-quality electronic blood pressure monitor.",
      },
      {
        id: "monitor-bp-scene4",
        patientImage: require("@/assets/images/scene4monpbp.png"),
        doctorImage: require("@/assets/images/scene4mondbp.png"),
        patientText: "Thank you, Doctor. I understand.",
        patientSpeech: "Thank you, Doctor. I understand.",
        doctorLines: [
          "You may bring the device during your medical visits so that its accuracy can be verified.",
          "Most importantly, avoid excessive monitoring and remain calm.",
        ],
        doctorSpeech:
          "You may bring the device during your medical visits so that its accuracy can be verified. Most importantly, avoid excessive monitoring and remain calm.",
      },
    ],
  },

  {
    id: "seek-help",
    title: "When to Seek Help",
    backgroundImage: require("@/assets/images/bh.png"),
    scenes: [
      {
        id: "seek-help-scene1",
        patientImage: require("@/assets/images/scene1spbp.png"),
        doctorImage: require("@/assets/images/scene1sdbp.png"),
        patientText: "Doctor, when should I consult a physician regarding my blood pressure?",
        patientSpeech: "Doctor, when should I consult a physician regarding my blood pressure?",
        doctorLines: [
          "If you are above 30 years of age, have a family history of hypertension, or are overweight, you should have your blood pressure checked regularly.",
          "If your readings are consistently 130/80 mmHg or higher, you must seek medical attention.",
        ],
        doctorSpeech:
          "If you are above 30 years of age, have a family history of hypertension, or are overweight, you should have your blood pressure checked regularly. If your readings are consistently 130/80 mmHg or higher, you must seek medical attention.",
      },
      {
        id: "seek-help-scene2",
        patientImage: require("@/assets/images/scene2spbp.png"),
        doctorImage: require("@/assets/images/scene2sdbp.png"),
        patientText: "How frequently should I visit the clinician?",
        patientSpeech: "How frequently should I visit the clinician?",
        doctorLines: [
          "A routine visit once every three months is generally sufficient.",
          "However, you must consult a clinician immediately if you experience certain warning symptoms.",
        ],
        doctorSpeech:
          "A routine visit once every three months is generally sufficient. However, you must consult a clinician immediately if you experience certain warning symptoms.",
      },
      {
        id: "seek-help-scene3",
        patientImage: require("@/assets/images/scene3spbp.png"),
        doctorImage: require("@/assets/images/scene3sdbp.png"),
        patientText: "What are those warning symptoms?",
        patientSpeech: "What are those warning symptoms?",
        doctorLines: [
          "Severe headache, chest pain, difficulty breathing, blurred vision, or sudden weakness on one side of the body.",
          "These require immediate medical attention.",
        ],
        doctorSpeech:
          "Severe headache, chest pain, difficulty breathing, blurred vision, or sudden weakness on one side of the body. These require immediate medical attention.",
      },
      {
        id: "seek-help-scene4",
        patientImage: require("@/assets/images/scene4spbp.png"),
        doctorImage: require("@/assets/images/scene4sdbp.png"),
        patientText: "Thank you, Doctor. I will keep that in mind.",
        patientSpeech: "Thank you, Doctor. I will keep that in mind.",
        doctorLines: [
          "You're welcome. Stay vigilant and take care of your health.",
        ],
        doctorSpeech: "You're welcome. Stay vigilant and take care of your health.",
      },
    ],
  },
  {
    id: "emergency-signs",
    title: "Emergency Signs",
    backgroundImage: require("@/assets/images/bh.png"),
    scenes: [
      {
        id: "emergency-signs-scene1",
        patientImage: require("@/assets/images/scene1epbp.png"),
        doctorImage: require("@/assets/images/scene1edbp.png"),
        patientText: "Doctor, when should I call emergency services immediately?",
        patientSpeech: "Doctor, when should I call emergency services immediately?",
        doctorLines: [
          "You must seek emergency medical care immediately if you experience signs of a hypertensive crisis.",
          "A hypertensive crisis is a sudden and severe rise in blood pressure.",
          "It can cause damage to vital organs and requires urgent hospital treatment.",
        ],
        doctorSpeech:
          "You must seek emergency medical care immediately if you experience signs of a hypertensive crisis. A hypertensive crisis is a sudden and severe rise in blood pressure. It can cause damage to vital organs and requires urgent hospital treatment.",
        decorImage: require("@/assets/images/sympt1.png"),
      },
      {
        id: "emergency-signs-scene2",
        patientImage: require("@/assets/images/scene2epbp.png"),
        doctorImage: require("@/assets/images/scene2edbp.png"),
        patientText: "What symptoms should I consider as warning signs?",
        patientSpeech: "What symptoms should I consider as warning signs?",
        doctorLines: [
          "You must call emergency services immediately if you experience any of the following:",
          "• Severe and persistent headache",
          "• Weakness in any part of the body, including the face",
          "• Chest pain, tightness, or heaviness",
          "• Breathlessness at rest or with minimal activity",
          "• Swelling of the feet",
          "• Epistaxis (bleeding from the nose)",
          "• Bleeding in the eyes",
          "• Blurring of vision",
        ],
        doctorSpeech:
          "You must call emergency services immediately if you experience any of the following: Severe and persistent headache, Weakness in any part of the body including the face, Chest pain tightness or heaviness, Breathlessness at rest or with minimal activity, Swelling of the feet, Epistaxis bleeding from the nose, Bleeding in the eyes, Blurring of vision.",
        decorImage: require("@/assets/images/sympt2.png"),
      },
      {
        id: "emergency-signs-scene3",
        patientImage: require("@/assets/images/scene3epbp.png"),
        doctorImage: require("@/assets/images/scene3edbp.png"),
        patientText: "I understand, Doctor. I will act immediately if I experience these symptoms.",
        patientSpeech: "I understand, Doctor. I will act immediately if I experience these symptoms.",
        doctorLines: [
          "Do not ignore these symptoms.",
          "Do not wait for them to improve.",
          "Seek emergency medical attention without delay.",
        ],
        doctorSpeech:
          "Do not ignore these symptoms. Do not wait for them to improve. Seek emergency medical attention without delay.",
      },
    ],
  },

  {
    id: "diet-what-to-eat",
    title: "What Should I Eat?",
    backgroundImage: require("@/assets/images/diet.png"),
    scenes: [
      {
        id: "diet-what-to-eat-scene1",
        patientImage: require("@/assets/images/scene1pwte.png"),
        doctorImage: require("@/assets/images/scene1dwte.png"),
        patientText: "Doctor, what type of diet should I follow to control my blood pressure?",
        patientSpeech: "Doctor, what type of diet should I follow to control my blood pressure?",
        doctorLines: [
          "You should focus on consuming vegetables, fruits, and whole grains on a daily basis.",
          "These foods are rich in fiber, vitamins, and minerals that support heart health.",
        ],
        doctorSpeech:
          "You should focus on consuming vegetables, fruits, and whole grains on a daily basis. These foods are rich in fiber, vitamins, and minerals that support heart health.",
      },
      {
        id: "diet-what-to-eat-scene2",
        patientImage: require("@/assets/images/scene2pwte.png"),
        doctorImage: require("@/assets/images/scene2dwte.png"),
        patientText: "Are there specific protein sources that are recommended?",
        patientSpeech: "Are there specific protein sources that are recommended?",
        doctorLines: [
          "Yes. You may include fat-free or low-fat dairy products, fish, poultry, beans, nuts, and vegetable oils.",
          "These provide essential nutrients without increasing unhealthy fat intake.",
        ],
        doctorSpeech:
          "Yes. You may include fat-free or low-fat dairy products, fish, poultry, beans, nuts, and vegetable oils. These provide essential nutrients without increasing unhealthy fat intake.",
        decorImage: require("@/assets/images/di.png"),
      },
      {
        id: "diet-what-to-eat-scene3",
        patientImage: require("@/assets/images/scene4pwte.png"),
        doctorImage: require("@/assets/images/scene3dwte.png"),
        patientText: "I have heard about the DASH diet. Is it helpful?",
        patientSpeech: "I have heard about the DASH diet. Is it helpful?",
        doctorLines: [
          "The DASH diet is strongly recommended for individuals with high blood pressure.",
          "It emphasizes fruits, vegetables, whole grains, lean proteins, and low-fat dairy products.",
          "It also limits sodium, added sugars, and saturated fats.",
          "Following this eating plan consistently for approximately eight weeks can significantly reduce blood pressure.",
        ],
        doctorSpeech:
          "The DASH diet is strongly recommended for individuals with high blood pressure. It emphasizes fruits, vegetables, whole grains, lean proteins, and low-fat dairy products. It also limits sodium, added sugars, and saturated fats. Following this eating plan consistently for approximately eight weeks can significantly reduce blood pressure.",
      },
      {
        id: "diet-what-to-eat-scene4",
        patientImage: require("@/assets/images/scene3pwte.png"),
        doctorImage: require("@/assets/images/scene4dwte.png"),
        patientText: "Thank you, Doctor. I will make the necessary dietary changes.",
        patientSpeech: "Thank you, Doctor. I will make the necessary dietary changes.",
        doctorLines: [
          "As much as possible, choose foods that are natural and minimally processed.",
          "A balanced and mindful diet plays a major role in blood pressure control.",
        ],
        doctorSpeech:
          "As much as possible, choose foods that are natural and minimally processed. A balanced and mindful diet plays a major role in blood pressure control.",
      },
    ],
  },
  {
    id: "diet-what-to-avoid",
    title: "What Should I Avoid?",
    backgroundImage: require("@/assets/images/diet.png"),
    scenes: [
      {
        id: "diet-avoid-scene1",
        patientImage: require("@/assets/images/scene1pwta.png"),
        doctorImage: require("@/assets/images/scene1dbp.png"),
        patientText: "Doctor, which foods should I avoid to control my blood pressure?",
        patientSpeech: "Doctor, which foods should I avoid to control my blood pressure?",
        doctorLines: [
          "You should limit foods that are high in saturated fat.",
          "These include fatty meats, full-fat dairy products, and tropical oils such as coconut oil, palm kernel oil, and palm oil.",
        ],
        doctorSpeech:
          "You should limit foods that are high in saturated fat. These include fatty meats, full-fat dairy products, and tropical oils such as coconut oil, palm kernel oil, and palm oil.",
      },
      {
        id: "diet-avoid-scene2",
        patientImage: require("@/assets/images/scene2pwta.png"),
        doctorImage: require("@/assets/images/scene1dwta.png"),
        patientText: "Should I also reduce sugar intake?",
        patientSpeech: "Should I also reduce sugar intake?",
        doctorLines: [
          "Yes. You must limit sugar-sweetened beverages and sweets.",
          "Excess sugar can contribute to weight gain and poor blood pressure control.",
        ],
        doctorSpeech:
          "Yes. You must limit sugar-sweetened beverages and sweets. Excess sugar can contribute to weight gain and poor blood pressure control.",
        decorImage: require("@/assets/images/no.png"),
      },
      {
        id: "diet-avoid-scene3",
        patientImage: require("@/assets/images/scene3pwta.png"),
        doctorImage: require("@/assets/images/scene2dwta.png"),
        patientText: "Are there specific items that I should completely avoid?",
        patientSpeech: "Are there specific items that I should completely avoid?",
        doctorLines: [
          "As far as possible, you should avoid or strictly limit the following:",
          "• Added table salt in chapati dough, rice, salads, and curd",
          "• Salted snacks",
          "• Bakery products prepared using baking soda",
          "• Pickles and chutneys",
          "• Processed and ultra-processed foods, which often contain high amounts of salt as preservatives or flavor enhancers",
        ],
        doctorSpeech:
          "As far as possible, you should avoid or strictly limit the following: Added table salt in chapati dough, rice, salads, and curd. Salted snacks. Bakery products prepared using baking soda. Pickles and chutneys. Processed and ultra-processed foods, which often contain high amounts of salt as preservatives or flavor enhancers.",
      },
      {
        id: "diet-avoid-scene4",
        patientImage: require("@/assets/images/scene4pwta.png"),
        doctorImage: require("@/assets/images/scene3dwta.png"),
        patientText: "Thank you, Doctor. I will be more cautious about my food choices.",
        patientSpeech: "Thank you, Doctor. I will be more cautious about my food choices.",
        doctorLines: [
          "A mindful diet and healthy lifestyle choices are essential for effective blood pressure control.",
        ],
        doctorSpeech:
          "A mindful diet and healthy lifestyle choices are essential for effective blood pressure control.",
      },
    ],
  },
  {
    id: "diet-fats",
    title: "Understanding Fats",
    backgroundImage: require("@/assets/images/diet.png"),
    scenes: [
      {
        id: "diet-fats-scene1",
        patientImage: require("@/assets/images/scene1pf.png"),
        doctorImage: require("@/assets/images/scene1df.png"),
        patientText: "Doctor, I'm confused about fats. Should I completely avoid them?",
        patientSpeech: "Doctor, I'm confused about fats. Should I completely avoid them?",
        doctorLines: [
          "That's a very common question! Not all fats are bad. Your body actually needs healthy fats to function properly.",
        ],
        doctorSpeech:
          "That's a very common question! Not all fats are bad. Your body actually needs healthy fats to function properly.",
      },
      {
        id: "diet-fats-scene2",
        patientImage: require("@/assets/images/scene2pf.png"),
        doctorImage: require("@/assets/images/scene2df.png"),
        patientText: "Really? Then what kind of fats should I include?",
        patientSpeech: "Really? Then what kind of fats should I include?",
        doctorLines: [
          "You should include healthy sources like:",
          "• Fat-free or low-fat dairy products",
          "• Fish and poultry",
          "• Beans and nuts",
          "• Vegetable oils",
          "These provide essential nutrients without harming your heart.",
        ],
        doctorSpeech:
          "You should include healthy sources like: Fat-free or low-fat dairy products, Fish and poultry, Beans and nuts, Vegetable oils. These provide essential nutrients without harming your heart.",
        decorImage: require("@/assets/images/oil.png"),
      },
      {
        id: "diet-fats-scene3",
        patientImage: require("@/assets/images/scene3pf.png"),
        doctorImage: require("@/assets/images/scene3df.png"),
        patientText: "Oh… so what should I avoid?",
        patientSpeech: "Oh… so what should I avoid?",
        doctorLines: [
          "You must completely avoid trans fats. They are very harmful and increase the risk of heart disease.",
        ],
        doctorSpeech:
          "You must completely avoid trans fats. They are very harmful and increase the risk of heart disease.",
      },
      {
        id: "diet-fats-scene4",
        patientImage: require("@/assets/images/scene4pf.png"),
        doctorImage: require("@/assets/images/scene4df.png"),
        patientText: "What about saturated fats?",
        patientSpeech: "What about saturated fats?",
        doctorLines: [
          "Good question. You should limit foods high in saturated fats such as:",
          "• Fatty meats",
          "• Full-fat dairy products",
          "• Tropical oils like coconut oil, palm oil, and palm kernel oil",
          "Too much of these can increase bad cholesterol.",
        ],
        doctorSpeech:
          "Good question. You should limit foods high in saturated fats such as: Fatty meats, Full-fat dairy products, Tropical oils like coconut oil, palm oil, and palm kernel oil. Too much of these can increase bad cholesterol.",
      },
      {
        id: "diet-fats-scene5",
        patientImage: require("@/assets/images/scene5pf.png"),
        doctorImage: require("@/assets/images/scene5df.png"),
        patientText: "Is there anything else I should reduce in my diet?",
        patientSpeech: "Is there anything else I should reduce in my diet?",
        doctorLines: [
          "Yes. Try to reduce:",
          "• Excess fat",
          "• Sugar",
          "• Salt (sodium)",
          "A balanced diet is key to maintaining good heart health.",
        ],
        doctorSpeech:
          "Yes. Try to reduce excess fat, sugar, and salt. A balanced diet is key to maintaining good heart health.",
      },
      {
        id: "diet-fats-scene6",
        patientImage: require("@/assets/images/scene6pf.png"),
        doctorImage: require("@/assets/images/scene6df.png"),
        patientText: "Thank you, doctor. Now I understand that it's not about avoiding all fats — it's about choosing the right ones.",
        patientSpeech: "Thank you, doctor. Now I understand that it's not about avoiding all fats — it's about choosing the right ones.",
        doctorLines: [
          "Exactly! Smart choices lead to a healthy heart.",
        ],
        doctorSpeech: "Exactly! Smart choices lead to a healthy heart.",
      },
    ],
  },
  {
    id: "diet-dash",
    title: "DASH Diet",
    backgroundImage: require("@/assets/images/diet.png"),
    scenes: [
      {
        id: "diet-dash-scene1",
        patientImage: require("@/assets/images/scene1mopbp.png"),
        doctorImage: require("@/assets/images/scene3modbp.png"),
        patientText: "Doctor… what is this DASH diet everyone talks about?",
        patientSpeech: "Doctor… what is this DASH diet everyone talks about?",
        doctorLines: [
          "DASH stands for Dietary Approaches to Stop Hypertension. It is a flexible and balanced eating plan designed to help control blood pressure and protect your heart.",
        ],
        doctorSpeech:
          "DASH stands for Dietary Approaches to Stop Hypertension. It is a flexible and balanced eating plan designed to help control blood pressure and protect your heart.",
      },
      {
        id: "diet-dash-scene2",
        patientImage: require("@/assets/images/scene2mopbp.png"),
        doctorImage: require("@/assets/images/scene2modbp.png"),
        patientText: "So… do I need to buy any special foods?",
        patientSpeech: "So… do I need to buy any special foods?",
        doctorLines: [
          "No, not at all. The DASH diet does not require special foods.",
          "It simply gives daily and weekly nutritional goals to help you eat healthier.",
        ],
        doctorSpeech:
          "No, not at all. The DASH diet does not require special foods. It simply gives daily and weekly nutritional goals to help you eat healthier.",
        decorImage: require("@/assets/images/dash.png"),
      },
      {
        id: "diet-dash-scene3",
        patientImage: require("@/assets/images/scene3mopbp.png"),
        doctorImage: require("@/assets/images/scene3modbp.png"),
        patientText: "What kind of foods should I eat then?",
        patientSpeech: "What kind of foods should I eat then?",
        doctorLines: [
          "You should focus on:",
          "• Eating more vegetables, fruits, and whole grains",
          "• Including fat-free or low-fat dairy products",
          "• Eating fish, poultry, beans, nuts, and vegetable oils",
        ],
        doctorSpeech:
          "You should focus on eating more vegetables, fruits, and whole grains. Including fat-free or low-fat dairy products. Eating fish, poultry, beans, nuts, and vegetable oils.",
      },
      {
        id: "diet-dash-scene4",
        patientImage: require("@/assets/images/scene4mopbp.png"),
        doctorImage: require("@/assets/images/scene2modbp.png"),
        patientText: "Are there foods I should avoid?",
        patientSpeech: "Are there foods I should avoid?",
        doctorLines: [
          "Yes, you should limit:",
          "• Foods high in saturated fat like fatty meats and full-fat dairy",
          "• Tropical oils such as coconut oil and palm oil",
          "• Sugar-sweetened drinks and sweets",
          "• Too much salt (sodium)",
        ],
        doctorSpeech:
          "Yes, you should limit foods high in saturated fat like fatty meats and full-fat dairy, tropical oils such as coconut oil and palm oil, sugar-sweetened drinks and sweets, and too much salt.",
      },
      {
        id: "diet-dash-scene5",
        patientImage: require("@/assets/images/scene5mopbp.png"),
        doctorImage: require("@/assets/images/scene3modbp.png"),
        patientText: "Will this really help my blood pressure?",
        patientSpeech: "Will this really help my blood pressure?",
        doctorLines: [
          "Yes. If you follow the DASH eating plan properly for about 8 weeks, it can significantly reduce your blood pressure.",
        ],
        doctorSpeech:
          "Yes. If you follow the DASH eating plan properly for about 8 weeks, it can significantly reduce your blood pressure.",
      },
    ],
  },

  {
    id: "exercise-physical",
    title: "Physical Activity",
    backgroundImage: require("@/assets/images/ex.png"),
    scenes: [
      {
        id: "exercise-physical-scene1",
        patientImage: require("@/assets/images/scene1pphy.png"),
        doctorImage: require("@/assets/images/scene1dphy.png"),
        patientText: "Doctor… is exercise really that important for blood pressure?",
        patientSpeech: "Doctor… is exercise really that important for blood pressure?",
        doctorLines: [
          "Yes, absolutely. Physical activity is one of the most important non-medicine treatments for high blood pressure. Regular exercise can significantly reduce your BP and protect your heart.",
        ],
        doctorSpeech: "Yes, absolutely. Physical activity is one of the most important non-medicine treatments for high blood pressure. Regular exercise can significantly reduce your BP and protect your heart.",
      },
      {
        id: "exercise-physical-scene2",
        patientImage: require("@/assets/images/scene2pphy.png"),
        doctorImage: require("@/assets/images/scene2dphy.png"),
        patientText: "How does exercise actually help?",
        patientSpeech: "How does exercise actually help?",
        doctorLines: [
          "Regular exercise helps by:",
          "• Reducing systolic and diastolic blood pressure",
          "• Decreasing resistance in your blood vessels",
          "• Improving your heart's efficiency",
          "• Reducing body weight",
          "• Improving insulin sensitivity",
          "• Lowering stress hormones",
          "• Improving cholesterol levels",
        ],
        doctorSpeech: "Regular exercise helps by reducing systolic and diastolic blood pressure, decreasing resistance in your blood vessels, improving your heart's efficiency, reducing body weight, improving insulin sensitivity, lowering stress hormones, and improving cholesterol levels.",
        decorImage: require("@/assets/images/ex.png"),
      },
      {
        id: "exercise-physical-scene3",
        patientImage: require("@/assets/images/scene3pphy.png"),
        doctorImage: require("@/assets/images/scene3dphy.png"),
        patientText: "Really? How much can it reduce my BP?",
        patientSpeech: "Really? How much can it reduce my BP?",
        doctorLines: [
          "On average, aerobic exercise can reduce blood pressure by 3 to 8 mmHg.",
          "In people who already have hypertension, the reduction can be even greater.",
        ],
        doctorSpeech: "On average, aerobic exercise can reduce blood pressure by 3 to 8 mmHg. In people who already have hypertension, the reduction can be even greater.",
      },
      {
        id: "exercise-physical-scene4",
        patientImage: require("@/assets/images/scene4pphy.png"),
        doctorImage: require("@/assets/images/scene4dphy.png"),
        patientText: "What kind of exercise should I do?",
        patientSpeech: "What kind of exercise should I do?",
        doctorLines: [
          "The most important type is aerobic exercise, such as:",
          "• Brisk walking",
          "• Jogging",
          "• Cycling",
          "• Swimming",
          "• Dancing",
          "• Skipping",
        ],
        doctorSpeech: "The most important type is aerobic exercise, such as brisk walking, jogging, cycling, swimming, dancing, and skipping.",
        decorImage: require("@/assets/images/hand.png"),
      },
      {
        id: "exercise-physical-scene5",
        patientImage: require("@/assets/images/scene5pphy.png"),
        doctorImage: require("@/assets/images/scene5dphy.png"),
        patientText: "How much should I exercise?",
        patientSpeech: "How much should I exercise?",
        doctorLines: [
          "You should aim for:",
          "• At least 30 minutes of moderate-intensity activity",
          "• On most days of the week — about 5 to 7 days",
        ],
        doctorSpeech: "You should aim for at least 30 minutes of moderate-intensity activity, on most days of the week — about 5 to 7 days.",
      },
      {
        id: "exercise-physical-scene6",
        patientImage: require("@/assets/images/scene6pphy.png"),
        doctorImage: require("@/assets/images/scene6dphy.png"),
        patientText: "What does 'moderate intensity' mean?",
        patientSpeech: "What does moderate intensity mean?",
        doctorLines: [
          "It means:",
          "• You can talk, but you cannot sing",
          "• Your breathing is slightly faster",
          "• You may sweat mildly",
        ],
        doctorSpeech: "It means you can talk but you cannot sing, your breathing is slightly faster, and you may sweat mildly.",
      },
      {
        id: "exercise-physical-scene7",
        patientImage: require("@/assets/images/scene1pphy.png"),
        doctorImage: require("@/assets/images/scene1dphy.png"),
        patientText: "Can I lift weights?",
        patientSpeech: "Can I lift weights?",
        doctorLines: [
          "Yes, light weight training or bodyweight exercises can help.",
          "But they should not replace aerobic exercise.",
          "Also, avoid heavy weight lifting if your blood pressure is uncontrolled.",
        ],
        doctorSpeech: "Yes, light weight training or bodyweight exercises can help. But they should not replace aerobic exercise. Also, avoid heavy weight lifting if your blood pressure is uncontrolled.",
      },
      {
        id: "exercise-physical-scene8",
        patientImage: require("@/assets/images/scene2pphy.png"),
        doctorImage: require("@/assets/images/scene2dphy.png"),
        patientText: "Is there anything I should not do?",
        patientSpeech: "Is there anything I should not do?",
        doctorLines: [
          "Yes, avoid:",
          "• Sudden intense heavy lifting",
          "• Very strenuous exercise if your BP is very high",
          "• Exercising without medical clearance if you have severe hypertension",
        ],
        doctorSpeech: "Yes, avoid sudden intense heavy lifting, very strenuous exercise if your BP is very high, and exercising without medical clearance if you have severe hypertension.",
        decorImage: require("@/assets/images/health.png"),
      },
      {
        id: "exercise-physical-scene9",
        patientImage: require("@/assets/images/scene3pphy.png"),
        doctorImage: require("@/assets/images/scene3dphy.png"),
        patientText: "So regular exercise can actually protect my heart?",
        patientSpeech: "So regular exercise can actually protect my heart?",
        doctorLines: [
          "Exactly. A simple habit like daily brisk walking can make a powerful difference in controlling your blood pressure.",
        ],
        doctorSpeech: "Exactly. A simple habit like daily brisk walking can make a powerful difference in controlling your blood pressure.",
      },
    ],
  },
  {
    id: "exercise-aerobic",
    title: "Aerobic Exercise",
    backgroundImage: require("@/assets/images/ex.png"),
    scenes: [
      {
        id: "exercise-aerobic-scene1",
        patientImage: require("@/assets/images/scene1monpbp.png"),
        doctorImage: require("@/assets/images/scene1mondbp.png"),
        patientText: "Doctor, what is aerobic exercise?",
        patientSpeech: "Doctor, what is aerobic exercise?",
        doctorLines: [
          "Aerobic exercise is any activity that increases your heart rate and breathing. It strengthens your heart and lungs, and helps lower blood pressure naturally.",
        ],
        doctorSpeech: "Aerobic exercise is any activity that increases your heart rate and breathing. It strengthens your heart and lungs, and helps lower blood pressure naturally.",
      },
      {
        id: "exercise-aerobic-scene2",
        patientImage: require("@/assets/images/scene2monpbp.png"),
        doctorImage: require("@/assets/images/scene2mondbp.png"),
        patientText: "What are some examples?",
        patientSpeech: "What are some examples?",
        doctorLines: [
          "Great examples include:",
          "• Brisk walking",
          "• Jogging or running",
          "• Cycling",
          "• Swimming",
          "• Dancing",
          "• Jumping rope",
          "Choose activities you enjoy so you'll stick with them.",
        ],
        doctorSpeech: "Great examples include brisk walking, jogging or running, cycling, swimming, dancing, and jumping rope. Choose activities you enjoy so you'll stick with them.",
        decorImage: require("@/assets/images/sssss.png"),
      },
      {
        id: "exercise-aerobic-scene3",
        patientImage: require("@/assets/images/scene3monpbp.png"),
        doctorImage: require("@/assets/images/scene3mondbp.png"),
        patientText: "How much should I do?",
        patientSpeech: "How much should I do?",
        doctorLines: [
          "Aim for at least 30 minutes of moderate-intensity aerobic exercise, most days of the week.",
          "You can break it into shorter sessions if needed, like three 10-minute walks.",
        ],
        doctorSpeech: "Aim for at least 30 minutes of moderate-intensity aerobic exercise, most days of the week. You can break it into shorter sessions if needed, like three 10-minute walks.",
        decorImage: require("@/assets/images/ssss.png"),
      },
      {
        id: "exercise-aerobic-scene4",
        patientImage: require("@/assets/images/scene4monpbp.png"),
        doctorImage: require("@/assets/images/scene4mondbp.png"),
        patientText: "What is moderate intensity?",
        patientSpeech: "What is moderate intensity?",
        doctorLines: [
          "Moderate intensity means you can talk but not sing during the activity.",
          "Your breathing is faster, and you may sweat lightly. You should feel your heart beating faster.",
        ],
        doctorSpeech: "Moderate intensity means you can talk but not sing during the activity. Your breathing is faster, and you may sweat lightly. You should feel your heart beating faster.",
      },
      {
        id: "exercise-aerobic-scene5",
        patientImage: require("@/assets/images/scene2monpbp.png"),
        doctorImage: require("@/assets/images/scene2mondbp.png"),
        patientText: "How does it lower blood pressure?",
        patientSpeech: "How does it lower blood pressure?",
        doctorLines: [
          "Aerobic exercise makes your heart stronger, so it pumps blood more efficiently.",
          "It also helps blood vessels relax and reduces stress hormones. Over time, this lowers your resting blood pressure.",
        ],
        doctorSpeech: "Aerobic exercise makes your heart stronger, so it pumps blood more efficiently. It also helps blood vessels relax and reduces stress hormones. Over time, this lowers your resting blood pressure.",
      },
      {
        id: "exercise-aerobic-scene6",
        patientImage: require("@/assets/images/scene1monpbp.png"),
        doctorImage: require("@/assets/images/scene1mondbp.png"),
        patientText: "Are there any precautions?",
        patientSpeech: "Are there any precautions?",
        doctorLines: [
          "Yes. Start slowly if you're new to exercise.",
          "Stop if you feel chest pain, dizziness, or severe shortness of breath.",
          "Always warm up before and cool down after exercise.",
        ],
        doctorSpeech: "Yes. Start slowly if you're new to exercise. Stop if you feel chest pain, dizziness, or severe shortness of breath. Always warm up before and cool down after exercise.",
      },
      {
        id: "exercise-aerobic-scene7",
        patientImage: require("@/assets/images/scene2monpbp.png"),
        doctorImage: require("@/assets/images/scene2mondbp.png"),
        patientText: "Who benefits most from aerobic exercise?",
        patientSpeech: "Who benefits most from aerobic exercise?",
        doctorLines: [
          "Everyone benefits! But it's especially helpful for people with high blood pressure, those at risk for heart disease, and anyone wanting to improve their overall health and fitness.",
        ],
        doctorSpeech: "Everyone benefits! But it's especially helpful for people with high blood pressure, those at risk for heart disease, and anyone wanting to improve their overall health and fitness.",
      },
      {
        id: "exercise-aerobic-scene8",
        patientImage: require("@/assets/images/scene3monpbp.png"),
        doctorImage: require("@/assets/images/scene3mondbp.png"),
        patientText: "Any simple advice to get started?",
        patientSpeech: "Any simple advice to get started?",
        doctorLines: [
          "Start with just 10 minutes a day of brisk walking. Gradually increase the time as you feel comfortable.",
          "The key is consistency — make it a daily habit, and you'll see great results!",
        ],
        doctorSpeech: "Start with just 10 minutes a day of brisk walking. Gradually increase the time as you feel comfortable. The key is consistency, make it a daily habit, and you'll see great results!",
      },
      {
        id: "exercise-aerobic-scene9",
        patientImage: require("@/assets/images/scene4monpbp.png"),
        doctorImage: require("@/assets/images/scene4mondbp.png"),
        patientText: "How does aerobic exercise help control high blood pressure?",
        patientSpeech: "How does aerobic exercise help control high blood pressure?",
        doctorLines: [
          "It makes your heart stronger and improves blood flow. When your heart becomes more efficient, it pumps blood with less effort, reducing pressure on your blood vessels.",
          "Regular aerobic exercise can reduce systolic BP by about 5 mmHg and diastolic BP by around 3 mmHg, which is clinically significant.",
        ],
        doctorSpeech: "It makes your heart stronger and improves blood flow. Regular aerobic exercise can reduce systolic BP by about 5 mmHg and diastolic BP by around 3 mmHg, which is clinically significant.",
      },
      {
        id: "exercise-aerobic-scene10",
        patientImage: require("@/assets/images/scene1monpbp.png"),
        doctorImage: require("@/assets/images/scene1mondbp.png"),
        patientText: "How often should I do aerobic exercise?",
        patientSpeech: "How often should I do aerobic exercise?",
        doctorLines: [
          "Ideally, 3–5 days per week. Each session should last 30–60 minutes.",
          "Even 4 weeks of regular exercise can show improvement, but longer duration gives better results.",
        ],
        doctorSpeech: "Ideally, 3 to 5 days per week. Each session should last 30 to 60 minutes. Even 4 weeks of regular exercise can show improvement, but longer duration gives better results.",
      },
      {
        id: "exercise-aerobic-scene11",
        patientImage: require("@/assets/images/scene2monpbp.png"),
        doctorImage: require("@/assets/images/scene2mondbp.png"),
        patientText: "Which aerobic exercise is best for someone with hypertension?",
        patientSpeech: "Which aerobic exercise is best for someone with hypertension?",
        doctorLines: [
          "Moderate-intensity activities like brisk walking, cycling, light jogging, swimming, or aerobic dance are best.",
          "Brisk walking is especially recommended because it's safe, affordable, and easy to continue long term.",
        ],
        doctorSpeech: "Moderate-intensity activities like brisk walking, cycling, light jogging, swimming, or aerobic dance are best. Brisk walking is especially recommended because it's safe, affordable, and easy to continue long term.",
      },
      {
        id: "exercise-aerobic-scene12",
        patientImage: require("@/assets/images/scene3monpbp.png"),
        doctorImage: require("@/assets/images/scene3mondbp.png"),
        patientText: "Can aerobic exercise prevent hypertension?",
        patientSpeech: "Can aerobic exercise prevent hypertension?",
        doctorLines: [
          "Yes. It works both as prevention and treatment.",
          "It keeps blood vessels healthy, reduces stress, improves heart function, and prevents weight gain — all of which reduce the risk of high blood pressure.",
        ],
        doctorSpeech: "Yes. It works both as prevention and treatment. It keeps blood vessels healthy, reduces stress, improves heart function, and prevents weight gain — all of which reduce the risk of high blood pressure.",
      },
      {
        id: "exercise-aerobic-scene13",
        patientImage: require("@/assets/images/scene4monpbp.png"),
        doctorImage: require("@/assets/images/scene4mondbp.png"),
        patientText: "How does it help with weight management?",
        patientSpeech: "How does it help with weight management?",
        doctorLines: [
          "Aerobic exercise burns calories and reduces body fat. For example, walking or running 1 mile burns about 100 calories.",
          "Regular moderate exercise can prevent weight gain and support long-term weight control.",
        ],
        doctorSpeech: "Aerobic exercise burns calories and reduces body fat. Regular moderate exercise can prevent weight gain and support long-term weight control.",
      },
      {
        id: "exercise-aerobic-scene14",
        patientImage: require("@/assets/images/scene1monpbp.png"),
        doctorImage: require("@/assets/images/scene1mondbp.png"),
        patientText: "Can exercise alone help me lose weight?",
        patientSpeech: "Can exercise alone help me lose weight?",
        doctorLines: [
          "Exercise works best when combined with healthy eating.",
          "Physical activity increases calorie burning and prevents the drop in metabolism that happens with dieting alone.",
        ],
        doctorSpeech: "Exercise works best when combined with healthy eating. Physical activity increases calorie burning and prevents the drop in metabolism that happens with dieting alone.",
      },
      {
        id: "exercise-aerobic-scene15",
        patientImage: require("@/assets/images/scene2monpbp.png"),
        doctorImage: require("@/assets/images/scene2mondbp.png"),
        patientText: "Does weight loss help control blood pressure?",
        patientSpeech: "Does weight loss help control blood pressure?",
        doctorLines: [
          "Absolutely. Losing excess weight reduces strain on your heart and blood vessels.",
          "Aerobic exercise gives a double benefit — direct BP reduction and weight loss support.",
        ],
        doctorSpeech: "Absolutely. Losing excess weight reduces strain on your heart and blood vessels. Aerobic exercise gives a double benefit — direct BP reduction and weight loss support.",
      },
      {
        id: "exercise-aerobic-scene16",
        patientImage: require("@/assets/images/scene3monpbp.png"),
        doctorImage: require("@/assets/images/scene3mondbp.png"),
        patientText: "How long does it take to see benefits?",
        patientSpeech: "How long does it take to see benefits?",
        doctorLines: [
          "Some improvements start within a few weeks.",
          "Blood pressure reductions are measurable after 3–4 weeks, with greater benefits after 12 weeks or more.",
        ],
        doctorSpeech: "Some improvements start within a few weeks. Blood pressure reductions are measurable after 3 to 4 weeks, with greater benefits after 12 weeks or more.",
      },
      {
        id: "exercise-aerobic-scene17",
        patientImage: require("@/assets/images/scene4monpbp.png"),
        doctorImage: require("@/assets/images/scene4mondbp.png"),
        patientText: "Is aerobic exercise helpful if I already have hypertension?",
        patientSpeech: "Is aerobic exercise helpful if I already have hypertension?",
        doctorLines: [
          "Yes, it is strongly recommended, especially in mild to moderate hypertension.",
          "It works well along with medicines and lifestyle changes.",
        ],
        doctorSpeech: "Yes, it is strongly recommended, especially in mild to moderate hypertension. It works well along with medicines and lifestyle changes.",
      },
      {
        id: "exercise-aerobic-scene18",
        patientImage: require("@/assets/images/scene1monpbp.png"),
        doctorImage: require("@/assets/images/scene1mondbp.png"),
        patientText: "Does it improve heart health in other ways?",
        patientSpeech: "Does it improve heart health in other ways?",
        doctorLines: [
          "Yes. It reduces bad cholesterol (LDL), increases good cholesterol (HDL), improves circulation, and lowers the risk of heart disease and stroke.",
        ],
        doctorSpeech: "Yes. It reduces bad cholesterol, increases good cholesterol, improves circulation, and lowers the risk of heart disease and stroke.",
      },
      {
        id: "exercise-aerobic-scene19",
        patientImage: require("@/assets/images/scene2monpbp.png"),
        doctorImage: require("@/assets/images/scene2mondbp.png"),
        patientText: "Can it help people with diabetes or obesity?",
        patientSpeech: "Can it help people with diabetes or obesity?",
        doctorLines: [
          "Yes. Aerobic exercise improves blood sugar control, body composition, and often leads to greater blood pressure reduction in people with diabetes and obesity.",
        ],
        doctorSpeech: "Yes. Aerobic exercise improves blood sugar control, body composition, and often leads to greater blood pressure reduction in people with diabetes and obesity.",
      },
      {
        id: "exercise-aerobic-scene20",
        patientImage: require("@/assets/images/scene3monpbp.png"),
        doctorImage: require("@/assets/images/scene3mondbp.png"),
        patientText: "How hard should I exercise?",
        patientSpeech: "How hard should I exercise?",
        doctorLines: [
          "Moderate intensity is ideal. You can aim for about 60–90% of your maximum heart rate, roughly calculated as 220 minus your age.",
          "Start slow and gradually increase intensity.",
        ],
        doctorSpeech: "Moderate intensity is ideal. You can aim for about 60 to 90 percent of your maximum heart rate, roughly calculated as 220 minus your age. Start slow and gradually increase intensity.",
      },
      {
        id: "exercise-aerobic-scene21",
        patientImage: require("@/assets/images/scene4monpbp.png"),
        doctorImage: require("@/assets/images/scene4mondbp.png"),
        patientText: "What happens if I stop exercising?",
        patientSpeech: "What happens if I stop exercising?",
        doctorLines: [
          "The benefits gradually reduce. Fitness levels and oxygen capacity can decline within weeks of inactivity.",
          "Regular continuation is important.",
        ],
        doctorSpeech: "The benefits gradually reduce. Fitness levels and oxygen capacity can decline within weeks of inactivity. Regular continuation is important.",
      },
      {
        id: "exercise-aerobic-scene22",
        patientImage: require("@/assets/images/scene1monpbp.png"),
        doctorImage: require("@/assets/images/scene1mondbp.png"),
        patientText: "Are there mental health benefits too?",
        patientSpeech: "Are there mental health benefits too?",
        doctorLines: [
          "Yes. Aerobic exercise reduces stress, anxiety, and depression.",
          "It improves mood, energy levels, and overall quality of life, which also helps in better blood pressure control.",
        ],
        doctorSpeech: "Yes. Aerobic exercise reduces stress, anxiety, and depression. It improves mood, energy levels, and overall quality of life, which also helps in better blood pressure control.",
      },
    ],
  },
  {
    id: "exercise-flexibility",
    title: "Flexibility & Balance",
    backgroundImage: require("@/assets/images/ex.png"),
    scenes: [
      {
        id: "exercise-flex-scene1",
        patientImage: require("@/assets/images/scene1mopbp.png"),
        doctorImage: require("@/assets/images/scene2modbp.png"),
        patientText: "Doctor, what are flexibility exercises? Are they really important for me?",
        patientSpeech: "Doctor, what are flexibility exercises? Are they really important for me?",
        doctorLines: [
          "Yes, they are very important. Flexibility exercises improve your range of motion, reduce stiffness, and help prevent injuries.",
        ],
        doctorSpeech: "Yes, they are very important. Flexibility exercises improve your range of motion, reduce stiffness, and help prevent injuries.",
      },
      {
        id: "exercise-flex-scene2",
        patientImage: require("@/assets/images/scene2mopbp.png"),
        doctorImage: require("@/assets/images/scene2modbp.png"),
        patientText: "What benefits will I get from them?",
        patientSpeech: "What benefits will I get from them?",
        doctorLines: [
          "They help by:",
          "• Improving joint mobility",
          "• Reducing muscle tension",
          "• Enhancing posture",
          "• Preventing falls, especially in elderly people",
        ],
        doctorSpeech: "They help by improving joint mobility, reducing muscle tension, enhancing posture, and preventing falls, especially in elderly people.",
      },
      {
        id: "exercise-flex-scene3",
        patientImage: require("@/assets/images/scene3mopbp.png"),
        doctorImage: require("@/assets/images/scene3modbp.png"),
        patientText: "What kind of flexibility exercises can I do?",
        patientSpeech: "What kind of flexibility exercises can I do?",
        doctorLines: [
          "You can try:",
          "• Simple stretching exercises",
          "• Yoga",
          "• Tai Chi",
          "• Pilates",
        ],
        doctorSpeech: "You can try simple stretching exercises, yoga, tai chi, and pilates.",
      },
      {
        id: "exercise-flex-scene4",
        patientImage: require("@/assets/images/scene4mopbp.png"),
        doctorImage: require("@/assets/images/scene2modbp.png"),
        patientText: "How should I do them safely?",
        patientSpeech: "How should I do them safely?",
        doctorLines: [
          "Follow these steps:",
          "• Warm up for 5–10 minutes before stretching",
          "• Hold each stretch for 10–30 seconds",
          "• Don't bounce while stretching",
          "• Breathe normally, don't hold your breath",
          "• Do them 2–3 times per week",
        ],
        doctorSpeech: "Warm up for 5 to 10 minutes before stretching. Hold each stretch for 10 to 30 seconds. Don't bounce while stretching. Breathe normally, don't hold your breath. Do them 2 to 3 times per week.",
      },
      {
        id: "exercise-flex-scene5",
        patientImage: require("@/assets/images/scene1mopbp.png"),
        doctorImage: require("@/assets/images/scene3modbp.png"),
        patientText: "What about balance exercises?",
        patientSpeech: "What about balance exercises?",
        doctorLines: [
          "Balance exercises help prevent falls and improve stability. They are especially important for elderly people with hypertension.",
        ],
        doctorSpeech: "Balance exercises help prevent falls and improve stability. They are especially important for elderly people with hypertension.",
      },
      {
        id: "exercise-flex-scene6",
        patientImage: require("@/assets/images/scene2mopbp.png"),
        doctorImage: require("@/assets/images/scene2modbp.png"),
        patientText: "What are their benefits?",
        patientSpeech: "What are their benefits?",
        doctorLines: [
          "They:",
          "• Prevent falls and injuries",
          "• Improve coordination",
          "• Strengthen core muscles",
          "• Increase confidence while moving",
        ],
        doctorSpeech: "They prevent falls and injuries, improve coordination, strengthen core muscles, and increase confidence while moving.",
      },
      {
        id: "exercise-flex-scene7",
        patientImage: require("@/assets/images/scene3mopbp.png"),
        doctorImage: require("@/assets/images/scene2modbp.png"),
        patientText: "Can you give me some examples?",
        patientSpeech: "Can you give me some examples?",
        doctorLines: [
          "Sure:",
          "• Standing on one leg",
          "• Heel-to-toe walking",
          "• Tai Chi",
          "• Balance board exercises",
          "• Yoga poses like tree pose or warrior pose",
        ],
        doctorSpeech: "Sure. Standing on one leg, heel-to-toe walking, Tai Chi, balance board exercises, and yoga poses like tree pose or warrior pose.",
      },
      {
        id: "exercise-flex-scene8",
        patientImage: require("@/assets/images/scene4mopbp.png"),
        doctorImage: require("@/assets/images/scene3modbp.png"),
        patientText: "How often should I practice?",
        patientSpeech: "How often should I practice?",
        doctorLines: [
          "Start near a wall or chair for support.",
          "Practice daily for 10–15 minutes.",
          "Progress gradually as your balance improves.",
          "And combine them with strength training.",
        ],
        doctorSpeech: "Start near a wall or chair for support. Practice daily for 10 to 15 minutes. Progress gradually as your balance improves. And combine them with strength training.",
      },
      {
        id: "exercise-flex-scene9",
        patientImage: require("@/assets/images/scene1mopbp.png"),
        doctorImage: require("@/assets/images/scene3modbp.png"),
        patientText: "Do these exercises reduce blood pressure directly?",
        patientSpeech: "Do these exercises reduce blood pressure directly?",
        doctorLines: [
          "They don't lower blood pressure as much as aerobic exercise, but they:",
          "• Reduce stress and anxiety",
          "• Complement aerobic exercise",
          "• Improve overall physical function",
          "• Are safe for all ages",
        ],
        doctorSpeech: "They don't lower blood pressure as much as aerobic exercise, but they reduce stress and anxiety, complement aerobic exercise, improve overall physical function, and are safe for all ages.",
      },
      {
        id: "exercise-flex-scene10",
        patientImage: require("@/assets/images/scene2mopbp.png"),
        doctorImage: require("@/assets/images/scene2modbp.png"),
        patientText: "So I should combine all types of exercise?",
        patientSpeech: "So I should combine all types of exercise?",
        doctorLines: [
          "Exactly. Aerobic exercise, flexibility, and balance together create a complete and safe routine for heart health.",
        ],
        doctorSpeech: "Exactly. Aerobic exercise, flexibility, and balance together create a complete and safe routine for heart health.",
      },
    ],
  },
  {
    id: "exercise-yoga",
    title: "Yoga",
    backgroundImage: require("@/assets/images/ex.png"),
    scenes: [
      {
        id: "exercise-yoga-scene1",
        patientImage: require("@/assets/images/scene1pyoga.png"),
        doctorImage: require("@/assets/images/scene1dyoga.png"),
        patientText: "Doctor, what is yoga?",
        patientSpeech: "Doctor, what is yoga?",
        doctorLines: [
          "Yoga is an art, a science, and a philosophy of living a healthy lifestyle. It originated in India over 5000 years ago.",
          "'Yoga' means union — the merging of individual consciousness with universal consciousness.",
          "Practically, yoga enhances holistic health, happiness, and harmony. It includes postures (asana), breathing exercises (pranayama), meditation (dhyana), relaxation, cleansing practices, and spiritual discipline.",
        ],
        doctorSpeech: "Yoga is an art, a science, and a philosophy of living a healthy lifestyle. It originated in India over 5000 years ago. Practically, yoga enhances holistic health, happiness, and harmony.",
      },
      {
        id: "exercise-yoga-scene2",
        patientImage: require("@/assets/images/scene2pyoga.png"),
        doctorImage: require("@/assets/images/scene2dyoga.png"),
        patientText: "Can yoga help control my high blood pressure?",
        patientSpeech: "Can yoga help control my high blood pressure?",
        doctorLines: [
          "Yes — yoga can help control hypertension. Regular practice can reduce blood pressure enough to lower heart disease and stroke risk.",
          "However, it works best along with medicines and lifestyle changes. It is supportive therapy, not a replacement.",
        ],
        doctorSpeech: "Yes, yoga can help control hypertension. Regular practice can reduce blood pressure enough to lower heart disease and stroke risk. However, it is supportive therapy, not a replacement for medicines.",
      },
      {
        id: "exercise-yoga-scene3",
        patientImage: require("@/assets/images/scene3pyoga.png"),
        doctorImage: require("@/assets/images/scene3dyoga.png"),
        patientText: "How does yoga reduce blood pressure?",
        patientSpeech: "How does yoga reduce blood pressure?",
        doctorLines: [
          "Yoga reduces stress, balances the nervous system, slows heart rate and breathing, and improves blood vessel relaxation.",
          "It also improves sleep and helps manage weight, diabetes, and cholesterol — all linked to hypertension.",
        ],
        doctorSpeech: "Yoga reduces stress, balances the nervous system, slows heart rate and breathing, and improves blood vessel relaxation. It also improves sleep and helps manage weight, diabetes, and cholesterol.",
        decorImage: require("@/assets/images/yoga.png"),
      },
      {
        id: "exercise-yoga-scene4",
        patientImage: require("@/assets/images/scene4pyoga.png"),
        doctorImage: require("@/assets/images/scene4dyoga.png"),
        patientText: "Is yoga safe for someone like me?",
        patientSpeech: "Is yoga safe for someone like me?",
        doctorLines: [
          "Yes, it is generally safe when done correctly. Start slowly, avoid forceful or fast practices, and do not hold your breath too long.",
          "Learn from a trained instructor. Continue your medicines and take medical advice before starting.",
        ],
        doctorSpeech: "Yes, it is generally safe when done correctly. Start slowly, avoid forceful or fast practices, and do not hold your breath too long. Learn from a trained instructor.",
      },
      {
        id: "exercise-yoga-scene5",
        patientImage: require("@/assets/images/scene5pyoga.png"),
        doctorImage: require("@/assets/images/scene5dyoga.png"),
        patientText: "What simple poses can I begin with?",
        patientSpeech: "What simple poses can I begin with?",
        doctorLines: [
          "Start with gentle poses:",
          "Shavasana (Corpse Pose) — Lie down comfortably and focus on breathing. It promotes deep relaxation.",
          "Sukhasana (Easy Sitting Pose) — Sit cross-legged with a straight spine. Good for breathing and meditation.",
          "Tadasana (Palm Tree Pose) — Stand straight with arms raised. Improves posture and circulation.",
        ],
        doctorSpeech: "Start with gentle poses like Shavasana, Sukhasana, and Tadasana. These promote relaxation, breathing, and good posture.",
      },
      {
        id: "exercise-yoga-scene6",
        patientImage: require("@/assets/images/scene6pyoga.png"),
        doctorImage: require("@/assets/images/scene1dyoga.png"),
        patientText: "Are there poses I should avoid?",
        patientSpeech: "Are there poses I should avoid?",
        doctorLines: [
          "Yes. Avoid head-down poses like headstand, fast breathing exercises, breath holding, and very strenuous or forceful yoga.",
          "These can temporarily increase blood pressure.",
        ],
        doctorSpeech: "Yes. Avoid head-down poses like headstand, fast breathing exercises, breath holding, and very strenuous or forceful yoga. These can temporarily increase blood pressure.",
      },
      {
        id: "exercise-yoga-scene7",
        patientImage: require("@/assets/images/scene1pyoga.png"),
        doctorImage: require("@/assets/images/scene2dyoga.png"),
        patientText: "How long should I practice daily?",
        patientSpeech: "How long should I practice daily?",
        doctorLines: [
          "Start with 10–15 minutes a day. Gradually increase to about 30 minutes.",
          "Regular daily practice is more important than long occasional sessions. Morning on an empty stomach is ideal, but evening is also fine.",
        ],
        doctorSpeech: "Start with 10 to 15 minutes a day. Gradually increase to about 30 minutes. Regular daily practice is more important than long occasional sessions.",
      },
      {
        id: "exercise-yoga-scene8",
        patientImage: require("@/assets/images/scene2pyoga.png"),
        doctorImage: require("@/assets/images/scene3dyoga.png"),
        patientText: "What if I feel dizzy while doing yoga?",
        patientSpeech: "What if I feel dizzy while doing yoga?",
        doctorLines: [
          "Stop immediately. Sit or lie down in Shavasana and breathe slowly.",
          "Avoid sudden movements and overstraining. If dizziness happens often, consult your doctor.",
        ],
        doctorSpeech: "Stop immediately. Sit or lie down in Shavasana and breathe slowly. Avoid sudden movements and overstraining. If dizziness happens often, consult your doctor.",
      },
      {
        id: "exercise-yoga-scene9",
        patientImage: require("@/assets/images/scene3pyoga.png"),
        doctorImage: require("@/assets/images/scene4dyoga.png"),
        patientText: "Can elderly people with high BP practice yoga?",
        patientSpeech: "Can elderly people with high BP practice yoga?",
        doctorLines: [
          "Yes, but they should do gentle and modified practices.",
          "Avoid strenuous poses and forceful breathing. Practice under guidance and according to physical capacity.",
        ],
        doctorSpeech: "Yes, but they should do gentle and modified practices. Avoid strenuous poses and forceful breathing. Practice under guidance and according to physical capacity.",
      },
      {
        id: "exercise-yoga-scene10",
        patientImage: require("@/assets/images/scene4pyoga.png"),
        doctorImage: require("@/assets/images/scene5dyoga.png"),
        patientText: "Can yoga replace my blood pressure medicines?",
        patientSpeech: "Can yoga replace my blood pressure medicines?",
        doctorLines: [
          "No. Yoga is supportive therapy. Never stop your medicines on your own.",
        ],
        doctorSpeech: "No. Yoga is supportive therapy. Never stop your medicines on your own.",
      },
      {
        id: "exercise-yoga-scene11",
        patientImage: require("@/assets/images/scene5pyoga.png"),
        doctorImage: require("@/assets/images/scene1dyoga.png"),
        patientText: "If my BP improves, can I reduce my medicines?",
        patientSpeech: "If my BP improves, can I reduce my medicines?",
        doctorLines: [
          "Only if your doctor decides after regular monitoring. Never reduce or stop medicines without medical advice.",
        ],
        doctorSpeech: "Only if your doctor decides after regular monitoring. Never reduce or stop medicines without medical advice.",
      },
      {
        id: "exercise-yoga-scene12",
        patientImage: require("@/assets/images/scene6pyoga.png"),
        doctorImage: require("@/assets/images/scene2dyoga.png"),
        patientText: "Can I do yoga right after taking my BP tablets?",
        patientSpeech: "Can I do yoga right after taking my BP tablets?",
        doctorLines: [
          "Yes, but practice gently and avoid strenuous activity if you feel light-headed.",
        ],
        doctorSpeech: "Yes, but practice gently and avoid strenuous activity if you feel light-headed.",
      },
      {
        id: "exercise-yoga-scene13",
        patientImage: require("@/assets/images/scene1pyoga.png"),
        doctorImage: require("@/assets/images/scene3dyoga.png"),
        patientText: "Should I practice on an empty stomach?",
        patientSpeech: "Should I practice on an empty stomach?",
        doctorLines: [
          "Yes, or at least 2–3 hours after a meal. Avoid heavy meals before practice.",
        ],
        doctorSpeech: "Yes, or at least 2 to 3 hours after a meal. Avoid heavy meals before practice.",
      },
      {
        id: "exercise-yoga-scene14",
        patientImage: require("@/assets/images/scene2pyoga.png"),
        doctorImage: require("@/assets/images/scene4dyoga.png"),
        patientText: "How long will it take to see improvement?",
        patientSpeech: "How long will it take to see improvement?",
        doctorLines: [
          "Some people see changes within a few weeks, while others take longer.",
          "Regular practice along with medicines and lifestyle changes leads to gradual improvement.",
        ],
        doctorSpeech: "Some people see changes within a few weeks, while others take longer. Regular practice along with medicines and lifestyle changes leads to gradual improvement.",
      },
      {
        id: "exercise-yoga-scene15",
        patientImage: require("@/assets/images/scene3pyoga.png"),
        doctorImage: require("@/assets/images/scene5dyoga.png"),
        patientText: "Can I practice at home?",
        patientSpeech: "Can I practice at home?",
        doctorLines: [
          "Yes, after learning correct techniques. Beginners should start under proper guidance.",
        ],
        doctorSpeech: "Yes, after learning correct techniques. Beginners should start under proper guidance.",
      },
      {
        id: "exercise-yoga-scene16",
        patientImage: require("@/assets/images/scene4pyoga.png"),
        doctorImage: require("@/assets/images/scene1dyoga.png"),
        patientText: "Do I need special equipment?",
        patientSpeech: "Do I need special equipment?",
        doctorLines: [
          "No. A simple mat and loose clothing are enough. Cushions or chairs may be used for support if needed.",
        ],
        doctorSpeech: "No. A simple mat and loose clothing are enough. Cushions or chairs may be used for support if needed.",
      },
    ],
  },
  {
    id: "exercise-taichi",
    title: "Tai Chi",
    backgroundImage: require("@/assets/images/ex.png"),
    scenes: [
      {
        id: "exercise-taichi-scene1",
        patientImage: require("@/assets/images/scene1ptai.png"),
        doctorImage: require("@/assets/images/scene1dmbp.png"),
        patientText: "Doctor, what is Tai Chi?",
        patientSpeech: "Doctor, what is Tai Chi?",
        doctorLines: [
          "Tai Chi is a gentle form of exercise that involves slow body movements, deep breathing, and mental focus. It is often called 'meditation in motion.'",
          "The movements are smooth and low-impact, which makes it especially suitable for older adults. It combines physical activity with relaxation, helping both the body and the mind.",
        ],
        doctorSpeech: "Tai Chi is a gentle form of exercise that involves slow body movements, deep breathing, and mental focus. It is often called meditation in motion. The movements are smooth and low-impact, especially suitable for older adults.",
      },
      {
        id: "exercise-taichi-scene2",
        patientImage: require("@/assets/images/scene2ptai.png"),
        doctorImage: require("@/assets/images/scene2dmbp.png"),
        patientText: "How do I actually do Tai Chi?",
        patientSpeech: "How do I actually do Tai Chi?",
        doctorLines: [
          "Tai Chi involves slow, deliberate movements combined with deep breathing and focused attention.",
          "Key principles: Maintain a relaxed, upright posture. Shift your weight slowly between legs. Keep joints soft, not locked. Coordinate deep belly breathing with movements.",
          "Start with 10–20 minutes daily and stay relaxed throughout.",
        ],
        doctorSpeech: "Tai Chi involves slow, deliberate movements combined with deep breathing and focused attention. Maintain a relaxed upright posture, shift your weight slowly, and coordinate breathing with movements.",
        decorImage: require("@/assets/images/tai.png"),
      },
      {
        id: "exercise-taichi-scene3",
        patientImage: require("@/assets/images/scene3ptai.png"),
        doctorImage: require("@/assets/images/scene3dmbp.png"),
        patientText: "Can Tai Chi help lower my blood pressure?",
        patientSpeech: "Can Tai Chi help lower my blood pressure?",
        doctorLines: [
          "Tai Chi may help lower blood pressure, but the scientific evidence is still limited. Some studies show reductions in BP compared to doing nothing.",
          "However, when compared to regular exercise, the results are usually similar — not necessarily better.",
        ],
        doctorSpeech: "Tai Chi may help lower blood pressure, but the scientific evidence is still limited. It helps, but is not proven to be superior to other exercises.",
      },
      {
        id: "exercise-taichi-scene4",
        patientImage: require("@/assets/images/scene4ptai.png"),
        doctorImage: require("@/assets/images/scene4dmbp.png"),
        patientText: "How does Tai Chi work to control blood pressure?",
        patientSpeech: "How does Tai Chi work to control blood pressure?",
        doctorLines: [
          "Tai Chi works through gentle exercise and relaxation. The slow movements and deep breathing improve circulation, strengthen muscles, and reduce stress.",
          "Over time, this can improve heart and blood vessel function, which helps in controlling blood pressure.",
        ],
        doctorSpeech: "Tai Chi works through gentle exercise and relaxation. The slow movements and deep breathing improve circulation, strengthen muscles, and reduce stress.",
      },
      {
        id: "exercise-taichi-scene5",
        patientImage: require("@/assets/images/scene5ptai.png"),
        doctorImage: require("@/assets/images/scene5dmbp.png"),
        patientText: "Is Tai Chi safe for elderly people with hypertension?",
        patientSpeech: "Is Tai Chi safe for elderly people with hypertension?",
        doctorLines: [
          "Yes, it is very suitable for elderly individuals. It is low-impact and does not strain the joints or heart excessively.",
          "Since movements are slow and controlled, it is safer than high-intensity workouts.",
        ],
        doctorSpeech: "Yes, it is very suitable for elderly individuals. It is low-impact and since movements are slow and controlled, it is safer than high-intensity workouts.",
      },
      {
        id: "exercise-taichi-scene6",
        patientImage: require("@/assets/images/scene1ptai.png"),
        doctorImage: require("@/assets/images/scene1dmbp.png"),
        patientText: "How often should I practice?",
        patientSpeech: "How often should I practice?",
        doctorLines: [
          "Most studies suggest practicing 2–3 times per week, with each session lasting about 1 hour.",
          "Some people also practice at home on additional days. Consistency over weeks or months is important for benefits.",
        ],
        doctorSpeech: "Most studies suggest practicing 2 to 3 times per week, with each session lasting about 1 hour. Consistency over weeks or months is important for benefits.",
      },
      {
        id: "exercise-taichi-scene7",
        patientImage: require("@/assets/images/scene2ptai.png"),
        doctorImage: require("@/assets/images/scene2dmbp.png"),
        patientText: "How long will it take to see improvement?",
        patientSpeech: "How long will it take to see improvement?",
        doctorLines: [
          "It varies from person to person. Some notice improvements within a few weeks, while others may take longer.",
          "Blood pressure improvements usually appear gradually with regular practice.",
        ],
        doctorSpeech: "It varies from person to person. Some notice improvements within a few weeks. Blood pressure improvements usually appear gradually with regular practice.",
      },
      {
        id: "exercise-taichi-scene8",
        patientImage: require("@/assets/images/scene3ptai.png"),
        doctorImage: require("@/assets/images/scene3dmbp.png"),
        patientText: "Is Tai Chi better than other exercises for BP control?",
        patientSpeech: "Is Tai Chi better than other exercises for BP control?",
        doctorLines: [
          "Not necessarily. Studies show Tai Chi works similarly to aerobic or resistance exercises.",
          "It is helpful, but not proven to be better than other regular physical activities.",
        ],
        doctorSpeech: "Not necessarily. Studies show Tai Chi works similarly to aerobic or resistance exercises. It is helpful, but not proven to be better than other physical activities.",
      },
      {
        id: "exercise-taichi-scene9",
        patientImage: require("@/assets/images/scene4ptai.png"),
        doctorImage: require("@/assets/images/scene4dmbp.png"),
        patientText: "Can Tai Chi replace my BP medicines?",
        patientSpeech: "Can Tai Chi replace my BP medicines?",
        doctorLines: [
          "No. Tai Chi is a supportive lifestyle practice. It should never replace prescribed medicines.",
          "Continue your treatment, diet control, and regular doctor follow-ups.",
        ],
        doctorSpeech: "No. Tai Chi is a supportive lifestyle practice. It should never replace prescribed medicines. Continue your treatment, diet control, and regular doctor follow-ups.",
      },
      {
        id: "exercise-taichi-scene10",
        patientImage: require("@/assets/images/scene5ptai.png"),
        doctorImage: require("@/assets/images/scene5dmbp.png"),
        patientText: "What makes Tai Chi different from other exercises?",
        patientSpeech: "What makes Tai Chi different from other exercises?",
        doctorLines: [
          "Tai Chi combines three elements: Slow physical movement, Deep breathing, and Mental relaxation.",
          "This mind-body combination provides both physical and emotional benefits, unlike purely physical workouts.",
        ],
        doctorSpeech: "Tai Chi combines slow physical movement, deep breathing, and mental relaxation. This mind-body combination provides both physical and emotional benefits.",
      },
      {
        id: "exercise-taichi-scene11",
        patientImage: require("@/assets/images/scene1ptai.png"),
        doctorImage: require("@/assets/images/scene1dmbp.png"),
        patientText: "Are the benefits scientifically proven?",
        patientSpeech: "Are the benefits scientifically proven?",
        doctorLines: [
          "The evidence is promising but not yet conclusive. Only a limited number of clinical studies exist.",
          "Researchers recommend more high-quality trials before making strong conclusions about its blood pressure-lowering effects.",
        ],
        doctorSpeech: "The evidence is promising but not yet conclusive. Only a limited number of clinical studies exist, and researchers recommend more high-quality trials.",
      },
    ],
  },

  // Add more topics here as scenes are created
];

export function getTopicById(id: string): HealthTopic | undefined {
  return healthTopics.find((t) => t.id === id);
}