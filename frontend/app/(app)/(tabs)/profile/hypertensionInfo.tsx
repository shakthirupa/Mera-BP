import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HypertensionInfo() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/bh.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hypertension FAQs</Text>
          <View style={{ width: 24 }} />
        </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <QASection
          question="What is blood pressure?"
          answer="Blood pressure (BP) is a pressure exerted by flowing blood on the walls of our arteries. It is important because it is the driving force for blood to travel around the body to deliver oxygen and nutrients to the organs of the body.

• Systolic Blood Pressure (upper BP reading) is a result of Cardiac Activity (Active Cardiac Pumping).
• Diastolic pressure (lower BP reading) indicates pressure maintained in arteries even as heart relaxes between beats.
• The generally accepted level for normal blood pressure is < 130 mm Hg for systolic, and < 85 mm Hg diastolic."
        />

        <QASection
          question="Does blood pressure of an individual remain constant, does it vary?"
          answer="Blood pressure never remains constant, it varies from beat to beat. Blood pressure variation can be normal or abnormal.

Such variation can be physiological such as during sleep, food (post-meals), physical activity and exercise, stress, etc. or pathological states due to disease conditions (of kidney, heart, endocrine system).

Blood pressure may also be affected by changes in posture, advancing age (due to sub-optimal autonomic responses), or by volume of blood in circulation (such as in dehydration)."
        />

        <QASection
          question="What is hypertension (high blood pressure)?"
          answer="Blood pressures of more than the normal is considered as being indicative of hypertension. If there are persistent readings more than normal, consult a physician (practitioner) of modern medicine for management."
        />

        <QASection
          question="Who all can develop/manifest hypertension?"
          answer="Anyone can develop/manifest hypertension. Individuals more than 30 of years of age should have themselves screened for it, once every 3-6 months. Also, with other risk factors (to be discussed such as lifestyle changes (stress and physical inactivity) even younger people can be affected by hypertension."
        />

        <QASection
          question="What causes hypertension?"
          answer="There is no single cause of hypertension. All the following can contribute to hypertension:

• Advancing Age (> 30 years)
• Obesity
• Lifestyle factors:
  - Physical inactivity and sedentary lifestyle
  - Stress
  - Excessive consumption of salt and fatty food
• Substance abuse:
  - Tobacco products
  - Alcohol
  - Potentially habit-forming drugs
• Family history of hypertension
• Disease such as atherosclerosis, kidney, cardiovascular and endocrine (hormonal) disease/disorders."
        />

        <QASection
          question="How does hypertension affect my body?"
          answer="High blood pressure causes incremental damage to the blood vessels in your heart, brain, kidneys and eyes, with a potential of life threatening events involving:

• Heart (heart attacks/myocardial infarction, angina and heart failure)
• Brain (stroke and paralysis)
• Kidneys (chronic renal failure)
• Loss of vision"
        />

        <QASection
          question="Is hypertension preventable and treatable?"
          answer="Yes, by taking precautions to positively modify the non-genetic factors."
        />

        <QASection
          question="How treat hypertension?"
          answer="• Individuals with high risk must visit a nearby health facility for early as well as periodic screening of hypertension.
• Early diagnosis and treatment by registered medical practitioner.
• Periodic measurements and monitoring of blood pressure (once in 2-3 weeks).
• Following a healthy lifestyle with adequate sleep, exercise, meditation, and work-life balance.
• Life-Style changes reduce the blood pressure maximally by 5-10%
• Treatment should always be initiated/modified only by a registered medical practitioner"
        />

        <QASection
          question="Can high blood pressure be cured without medication?"
          answer="It is rare for hypertension to disappear by itself. It can be managed through adoption of healthy lifestyle and dietary modifications alone.

Taking medications as prescribed by your doctor will help you manage your blood pressure more easily while delaying/preventing complications.

However, if treatment is discontinued without medical advice, high blood pressure usually returns quickly."
        />

        <QASection
          question="Can I receive treatment from other systems of medicine?"
          answer="• If there is evidence of organ damage or a past life threatening event, it is preferable to receive treatment from practitioners of modern medicine.
• Moderate to severe hypertension should be managed through modern medicine with additional help from other systems.
• Mild hypertension may be managed by traditional systems of medicine but with close monitoring of blood pressure."
        />

        <QASection
          question="I do not take excess salt; how can I reduce it further?"
          answer="What we generally look at is only visible salt in diet. Additionally, the following may be avoided:

a) Added table salt in chapati dough, rice, salad and curd
b) Salted snacks
c) Bakery items that use baking soda
d) Pickles and chutneys
e) Processed and Ultra-processed food"
        />

        <QASection
          question="Can I stop medications for hypertension once my blood pressure in under control?"
          answer="Never make this mistake, blood pressure is perceived to be controlled because of regular use of medication and lifestyle modification. You need to consult your treating physician before stopping any medication on your own."
        />

        <QASection
          question="Can hypertension be prevented?"
          answer="Genetic factors cannot be modified, however, all acquired factors are modifiable:

1. Adequate sound sleep
2. Regular aerobic exercise
3. Meditation for mental peace
4. Maintenance of Work-life balance
5. To be as close to nature as possible
6. Completely avoidance of trans-fat
7. Reduction of fat, sugar and salt in diet
8. Reduction of simple/refined carbohydrate
9. Avoiding tobacco, alcohol, drugs
10. Avoid processed/ultra-processed food"
        />

        <QASection
          question="What are symptoms of hypertension?"
          answer="Hypertension does not have any specific symptoms, that is why it is often called a silent killer. People with the following non-specific symptoms may get their BP checked:

a) Unexplained tiredness
b) Unexplained heaviness in the chest
c) Unexplained breathlessness
d) Recurrent headaches
e) Recurrent epistaxis
f) History of unexplained sub-conjunctival bleeding"
        />

        <QASection
          question="How frequently should I visit a physician?"
          answer="A visit to one's clinician once in 3 months is sufficient. However, one must visit the clinician immediately if there are any of the following symptoms:

a) Breathlessness
b) Chest heaviness or tightness
c) Giddiness
d) Severe headache
e) Visual problems
f) Epistaxis"
        />

        <QASection
          question="Can hypertension occur in children?"
          answer="Unfortunately, hypertension is affecting children increasingly because of obesity, sedentary life style and poor dietary habits (eating of processed and fast food)."
        />

        <QASection
          question="Can I take low sodium salt (LoNa Salt)?"
          answer="Best would be to decrease the intake of any salt as LoNa salt has potassium chloride, which has its own problems and is best avoided, because a number of drugs used for hypertension can affect potassium."
        />

        <QASection
          question="What is hypertensive crisis?"
          answer="Hypertensive crisis is a serious increase in blood pressure, associated with damage to vital organs and requires immediate attention in hospital. Following symptoms should serve as a red-flag:

a) Severe persistent headache
b) Weakness in any part of the body
c) Chest pain/tightness or heaviness
d) Breathlessness on rest
e) Swelling of feet
f) Epistaxis
g) Bleeding in eyes
h) Blurring of vision"
        />

        <QASection
          question="How intake of alcohol affects the BP?"
          answer="Regular intake of alcohol can worsen your hypertension. Intake of alcohol by a hypertensive can cause a drop in blood pressure acutely leading to giddiness and fainting."
        />

        <QASection
          question="Do medicines increase BP?"
          answer="Yes, some common medicines are known to increase BP. These include pain killers, drugs in cough syrups, some proprietary cough and cold medicines and steroids."
        />

        <QASection
          question="Does HTN or its medicines cause sexual dysfunction?"
          answer="Some of the medicines used to treat hypertension can cause erectile and sexual dysfunction among males, please consult your physician, if you face such a problem."
        />

        <QASection
          question="How to check BP at home?"
          answer="It is best not to check blood pressure at home. Blood pressure should be checked at most once a month. It is best checked by your physician. Frequent checking of BP at home makes one always think about his blood pressure, something that can actually worsen the blood pressure.

If one wants to have one, buy good quality electronic apparatus. Have it checked when ever you visit your doctor, but do not check your BP too frequently."
        />

        <QASection
          question="What is primary (essential) and secondary HTN?"
          answer="When ever there is no single curable cause found for hypertension, it is called primary. 95 per cent of all hypertensives have primary or essential hypertension."
        />

        <QASection
          question="What is the effect of tea, coffee on BP?"
          answer="Tea and specially coffee can increase the blood pressure of some individuals. It is best for hypertensives to minimize the intake of tea and avoid coffee altogether."
        />

        <QASection
          question="What is relationship between sleep and HTN?"
          answer="Restful sleep is important for hypertensives. To get restful sleep, it is best to avoid stimulants (tea, coffee and cola drinks after 2-3 PM in the afternoon). Alcohol can also affect the quality of sleep."
        />
      </ScrollView>
    </ImageBackground>
  );
}

function QASection({ question, answer }: { question: string; answer: string}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.qaCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.qaHeader}>
        <Text style={styles.question}>{question}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#64748B"
        />
      </View>
      {expanded && <Text style={styles.answer}>{answer}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  header:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginTop: 40, paddingVertical: 14 },
  headerTitle:      { fontSize: 20, fontWeight: "600", color: "#0F172A" },
  qaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  qaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  answer: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748B",
    lineHeight: 22,
    marginTop: 12,
  },
});
