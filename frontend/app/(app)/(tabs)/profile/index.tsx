import { API } from "@/src/constants/api";
import TabBar from "@/src/components/TabBar";
import { useAuth } from "@/src/providers/AuthContext";
import { getProfile } from "@/src/services/api";
import { getAccessToken } from "@/src/services/tokenStorage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Svg, { Circle, Line, Polyline } from "react-native-svg";



interface Observation {
  x: number;
  y: number;
  date: string;
}

const CHART_POINT_COUNT = 6;

/** Oldest → newest (left → right on graph), max 6 most recent readings. */
function prepareChartSeries(
  raw: { effectiveDateTime: string; value1: number; value2?: number }[]
): { effectiveDateTime: string; value1: number; value2?: number }[] {
  return [...raw]
    .sort(
      (a, b) =>
        new Date(a.effectiveDateTime).getTime() -
        new Date(b.effectiveDateTime).getTime()
    )
    .slice(-CHART_POINT_COUNT);
}

function toObservationPoints(
  series: { effectiveDateTime: string; value1: number; value2?: number }[],
  pickY: (obs: (typeof series)[0]) => number
): Observation[] {
  return series.map((obs, index) => ({
    x: index + 1,
    y: pickY(obs),
    date: obs.effectiveDateTime.split("T")[0],
  }));
}

/* ===================== MAIN SCREEN ===================== */

export default function ProfileAllInOneScreen() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [heartRateData, setHeartRateData] = useState<Observation[]>([]);
  const [bpData, setBpData] = useState<{ systolic: Observation[], diastolic: Observation[] }>({ systolic: [], diastolic: [] });

  const activeTab = pathname.includes("main")
    ? "Learn"
    : pathname.includes("chatbot")
    ? "Chatbot"
    : pathname.includes("profile")
    ? "Profile"
    : "Profile";

  useFocusEffect(
    useCallback(() => {
      getProfile().then(setUser).catch(() => {});
      loadHealthData();
    }, [])
  );

  const loadHealthData = async () => {
    try {
      const token = await getAccessToken();

      const hrRes = await fetch(`${API.OBSERVATIONS}?code=HEART_RATE`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (hrRes.ok) {
        const hrData = await hrRes.json();
        const series = prepareChartSeries(hrData);
        setHeartRateData(toObservationPoints(series, (obs) => obs.value1));
      }

      const bpRes = await fetch(`${API.OBSERVATIONS}?code=BLOOD_PRESSURE`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (bpRes.ok) {
        const bpRaw = await bpRes.json();
        const series = prepareChartSeries(bpRaw);
        setBpData({
          systolic: toObservationPoints(series, (obs) => obs.value1),
          diastolic: toObservationPoints(series, (obs) => obs.value2 ?? 0),
        });
      }
    } catch (error) {
      console.error("Failed to load health data:", error);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/bb.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>

          {/* User Info */}
          <TouchableOpacity style={styles.userCard} onPress={() => router.push('/profile/profiledetails')}>
            <View style={{ justifyContent: "center", gap: 2 }}>
              <Text style={styles.hello}>{user?.name}</Text>
              {user?.authProvider === "PHONE"
                ? <Text style={styles.sub}>{user?.phone}</Text>
                : <Text style={styles.sub}>{user?.email}</Text>
              }
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() ?? "?"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Heart Rate */}
          <TouchableOpacity onPress={() => router.push({ pathname: '/profile/healthHistory', params: { metricKey: "HEART_RATE" } })}>
            {heartRateData.length >= 1 ? (
              <GraphSingle
                title="Heart Rate (bpm)"
                icon="heart"
                color="#EF4444"
                yDomain={calculateYDomain(heartRateData)}
                data={heartRateData}
              />
            ) : (
              <GraphPlaceholder
                title="Heart Rate (bpm)"
                icon="heart"
                message="Add your first reading to see your graph"
              />
            )}
          </TouchableOpacity>

          {heartRateData.length >= 1 && <HeartRateInsights data={heartRateData} />}

          {/* Blood Pressure */}
          <TouchableOpacity onPress={() => router.push({ pathname: '/profile/healthHistory', params: { metricKey: "BLOOD_PRESSURE" } })}>
            {bpData.systolic.length >= 1 ? (
              <GraphMulti
                title="Blood Pressure (mmHg)"
                icon="blood-bag"
                yDomain={calculateYDomain([...bpData.systolic, ...bpData.diastolic])}
                datasets={[
                  { color: "#EF4444", data: bpData.systolic },
                  { color: "#2563EB", data: bpData.diastolic },
                ]}
              />
            ) : (
              <GraphPlaceholder
                title="Blood Pressure (mmHg)"
                icon="blood-bag"
                message="Add your first reading to see your graph"
              />
            )}
          </TouchableOpacity>

          {bpData.systolic.length >= 1 && <BloodPressureInsights data={bpData} />}

          {/* Action Buttons */}
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/profile/upload')}>
            <Ionicons name="flask-outline" size={20} color="#2563EB" />
            <Text style={styles.actionText}>Lab Results</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/profile/medication')}>
            <Ionicons name="medical-outline" size={20} color="#2563EB" />
            <Text style={styles.actionText}>Medications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/profile/hypertensionInfo')}>
            <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
            <Text style={styles.actionText}>Hypertension FAQs</Text>
          </TouchableOpacity>

        </ScrollView>

        <TabBar activeTab={activeTab} />
      </View>
    </ImageBackground>
  );
}

/* ===================== INSIGHTS ===================== */

type Pattern = "consistently_low" | "consistently_high" | "volatile" | "improving" | "worsening" | "normal";

function classifyHRPattern(values: number[]): Pattern {
  const isLow  = (v: number) => v < 60;
  const isHigh = (v: number) => v > 100;
  const isNorm = (v: number) => v >= 60 && v <= 100;
  const n = values.length;

  if (n === 1) {
    if (isLow(values[0]))  return "consistently_low";
    if (isHigh(values[0])) return "consistently_high";
    return "normal";
  }

  const lowCount  = values.filter(isLow).length;
  const highCount = values.filter(isHigh).length;
  const normCount = values.filter(isNorm).length;

  let reversals = 0;
  for (let i = 1; i < n - 1; i++) {
    const prev = values[i - 1], curr = values[i], next = values[i + 1];
    if ((curr > prev && curr > next) || (curr < prev && curr < next)) reversals++;
  }
  const swing = Math.max(...values) - Math.min(...values);

  if (reversals >= 2 && swing > 30) return "volatile";
  if (lowCount  >= Math.ceil(n * 0.7)) return "consistently_low";
  if (highCount >= Math.ceil(n * 0.7)) return "consistently_high";

  if (n >= 3) {
    const mid  = Math.floor(n / 2);
    const avg1 = values.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
    const avg2 = values.slice(mid).reduce((a, b) => a + b, 0) / (n - mid);
    if (avg2 - avg1 >  8) return "worsening";
    if (avg1 - avg2 >  8) return "improving";
  }

  if (normCount >= Math.ceil(n * 0.7)) return "normal";
  return "volatile";
}

function classifyBPPattern(sysValues: number[]): Pattern {
  const isLow  = (v: number) => v < 90;
  const isHigh = (v: number) => v >= 130;
  const isNorm = (v: number) => v >= 90 && v < 130;
  const n = sysValues.length;

  if (n === 1) {
    if (isLow(sysValues[0]))  return "consistently_low";
    if (isHigh(sysValues[0])) return "consistently_high";
    return "normal";
  }

  const lowCount  = sysValues.filter(isLow).length;
  const highCount = sysValues.filter(isHigh).length;
  const normCount = sysValues.filter(isNorm).length;

  let reversals = 0;
  for (let i = 1; i < n - 1; i++) {
    const prev = sysValues[i - 1], curr = sysValues[i], next = sysValues[i + 1];
    if ((curr > prev && curr > next) || (curr < prev && curr < next)) reversals++;
  }
  const swing = Math.max(...sysValues) - Math.min(...sysValues);

  if (reversals >= 2 && swing > 40) return "volatile";
  if (lowCount  >= Math.ceil(n * 0.7)) return "consistently_low";
  if (highCount >= Math.ceil(n * 0.7)) return "consistently_high";

  if (n >= 3) {
    const mid  = Math.floor(n / 2);
    const avg1 = sysValues.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
    const avg2 = sysValues.slice(mid).reduce((a, b) => a + b, 0) / (n - mid);
    if (avg2 - avg1 > 10) return "worsening";
    if (avg1 - avg2 > 10) return "improving";
  }

  if (normCount >= Math.ceil(n * 0.7)) return "normal";
  return "volatile";
}

function HeartRateInsights({ data }: { data: Observation[] }) {
  const values  = data.map(d => d.y);
  const avg     = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const max     = Math.max(...values);
  const min     = Math.min(...values);
  const pattern = classifyHRPattern(values);

  const INFO: Record<Pattern, { status: string; message: string; icon: string; color: string }> = {
    consistently_low: {
      status:  "Consistently Low (Bradycardia)",
      message: "Your heart rate has been consistently below 60 bpm across your readings. While this can be normal for trained athletes, persistent bradycardia in others may cause dizziness, fatigue, or fainting. If you are not an athlete, please consult your doctor.",
      icon: "arrow-down-circle", color: "#F59E0B",
    },
    consistently_high: {
      status:  "Consistently Elevated (Tachycardia)",
      message: "Your heart rate has been consistently above 100 bpm across your readings. A persistently high resting heart rate can strain the heart over time and may indicate stress, dehydration, thyroid issues, or other conditions. Please consult your doctor.",
      icon: "arrow-up-circle", color: "#EF4444",
    },
    volatile: {
      status:  "Highly Inconsistent — See a Doctor",
      message: "Your heart rate is swinging significantly between readings — alternating between high and low values. This kind of irregularity can indicate an arrhythmia or other cardiac condition. Please consult a doctor as soon as possible.",
      icon: "alert-circle", color: "#DC2626",
    },
    worsening: {
      status:  "Trending Upward",
      message: "Your recent heart rate readings are higher than your earlier ones. This upward trend may reflect increasing stress, reduced fitness, or an underlying condition. Monitor closely and consult your doctor if it continues.",
      icon: "trending-up", color: "#F59E0B",
    },
    improving: {
      status:  "Trending Downward",
      message: "Your heart rate has been coming down over your recent readings. If you were previously elevated, this is a positive sign. Continue your current lifestyle habits and keep monitoring.",
      icon: "trending-down", color: "#10B981",
    },
    normal: {
      status:  "Normal",
      message: "Your heart rate readings are consistently within the healthy resting range of 60-100 bpm. Keep up your current lifestyle — regular exercise, good sleep, and stress management all contribute to a healthy heart rate.",
      icon: "checkmark-circle", color: "#10B981",
    },
  };

  const { status, message, icon, color } = INFO[pattern];

  return (
    <View style={[styles.insightCard, { borderLeftWidth: 4, borderLeftColor: color }]}>
      <View style={styles.insightHeader}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={[styles.insightTitle, { color }]}>{status}</Text>
      </View>
      <Text style={styles.insightMessage}>{message}</Text>
      <View style={styles.insightStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>{avg} bpm</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Lowest</Text>
          <Text style={styles.statValue}>{min} bpm</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Highest</Text>
          <Text style={styles.statValue}>{max} bpm</Text>
        </View>
      </View>
    </View>
  );
}

function BloodPressureInsights({ data }: { data: { systolic: Observation[]; diastolic: Observation[] } }) {
  const sysValues = data.systolic.map(d => d.y);
  const diaValues = data.diastolic.map(d => d.y);
  const avgSys = Math.round(sysValues.reduce((a, b) => a + b, 0) / sysValues.length);
  const avgDia = Math.round(diaValues.reduce((a, b) => a + b, 0) / diaValues.length);
  const pulsePressure = avgSys - avgDia;
  const pattern = classifyBPPattern(sysValues);

  const INFO: Record<Pattern, { status: string; message: string; icon: string; color: string }> = {
    consistently_low: {
      status:  "Consistently Low BP (Hypotension)",
      message: "Your blood pressure has been consistently low across your readings. Chronic hypotension can cause dizziness, fainting, and reduced blood flow to organs. Stay well hydrated, avoid prolonged standing, and consult your doctor if you have symptoms.",
      icon: "arrow-down-circle", color: "#F59E0B",
    },
    consistently_high: {
      status:  "Consistently High BP (Hypertension)",
      message: "Your blood pressure has been consistently elevated across your readings. Sustained high BP significantly increases the risk of heart disease, stroke, and kidney damage. Please consult your doctor — lifestyle changes and/or medication may be needed.",
      icon: "arrow-up-circle", color: "#EF4444",
    },
    volatile: {
      status:  "Highly Inconsistent BP — See a Doctor",
      message: "Your blood pressure is fluctuating significantly between readings — swinging from high to low or vice versa. This level of variability is not normal and can indicate white-coat hypertension, medication issues, or an underlying cardiovascular condition. Please consult your doctor promptly.",
      icon: "alert-circle", color: "#DC2626",
    },
    worsening: {
      status:  "BP Trending Upward",
      message: "Your recent blood pressure readings are higher than your earlier ones. This upward trend is a warning sign. Reduce sodium intake, manage stress, and consult your doctor before it progresses further.",
      icon: "trending-up", color: "#F59E0B",
    },
    improving: {
      status:  "BP Trending Downward",
      message: "Your blood pressure has been coming down over your recent readings. This is a positive trend — your lifestyle changes or medication appear to be working. Keep it up and continue monitoring regularly.",
      icon: "trending-down", color: "#10B981",
    },
    normal: {
      status:  "Normal BP",
      message: "Your blood pressure readings are consistently within the healthy range. Maintain a balanced diet low in sodium, stay physically active, manage stress, and keep monitoring regularly to stay on track.",
      icon: "checkmark-circle", color: "#10B981",
    },
  };

  const { status, message, icon, color } = INFO[pattern];

  return (
    <View style={[styles.insightCard, { borderLeftWidth: 4, borderLeftColor: color }]}>
      <View style={styles.insightHeader}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={[styles.insightTitle, { color }]}>{status}</Text>
      </View>
      <Text style={styles.insightMessage}>{message}</Text>
      {pulsePressure > 60 && (
        <View style={styles.ppWarning}>
          <Ionicons name="information-circle-outline" size={14} color="#6B7280" />
          <Text style={styles.ppWarningText}>Pulse pressure is elevated ({pulsePressure} mmHg) — may indicate arterial stiffness. Discuss with your doctor.</Text>
        </View>
      )}
      <View style={styles.insightStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg Systolic</Text>
          <Text style={styles.statValue}>{avgSys} mmHg</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg Diastolic</Text>
          <Text style={styles.statValue}>{avgDia} mmHg</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Pulse Pressure</Text>
          <Text style={styles.statValue}>{pulsePressure} mmHg</Text>
        </View>
      </View>
    </View>
  );
}

/* ===================== GRAPH COMPONENTS ===================== */

function calculateYDomain(data: Observation[]) {
  if (!data || data.length === 0) return [0, 100];
  const values = data.map(d => d.y);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.2 || 10;
  const min = Math.floor((minValue - padding) / 10) * 10;
  const max = Math.ceil((maxValue + padding) / 10) * 10;
  return [Math.max(0, min), max];
}

function GraphPlaceholder({ title, icon, message }: { title: string; icon: any; message: string }) {
  return (
    <View style={styles.graphCard}>
      <View style={styles.graphHeader}>
        <MaterialCommunityIcons name={icon} size={18} color="#2563EB" />
        <Text style={styles.graphTitle}>{title}</Text>
      </View>
      <View style={styles.placeholderContainer}>
        <Ionicons name="analytics-outline" size={48} color="#9CA3AF" />
        <Text style={styles.placeholderText}>{message}</Text>
      </View>
    </View>
  );
}

const GRAPH_HEIGHT = 120;
const LEFT_PADDING = 25;

function GraphSingle({ title, icon, color, data, yDomain }: { title: string; icon: string; color: string; data: Observation[]; yDomain: number[] }) {
  return (
    <GraphBase title={title} icon={icon} yDomain={yDomain}>
      <View style={styles.graphViewport}>
        <GraphLines datasets={[{ color, data }]} yDomain={yDomain} />
      </View>
    </GraphBase>
  );
}

function GraphMulti({ title, icon, datasets, yDomain }: { title: string; icon: string; datasets: { color: string; data: Observation[] }[]; yDomain: number[] }) {
  return (
    <GraphBase title={title} icon={icon} yDomain={yDomain}>
      <View style={styles.graphViewport}>
        <GraphLines datasets={datasets} yDomain={yDomain} />
        <View style={styles.legend}>
          {datasets.map((dataset, index) => {
            const labels: Record<string, string> = {
              "#EF4444": "Systolic",
              "#2563EB": "Diastolic",
            };
            return (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: dataset.color }]} />
                <Text style={styles.legendText}>{labels[dataset.color] ?? ""}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </GraphBase>
  );
}

function GraphBase({ title, icon, yDomain, children }: { title: string; icon: string; yDomain: number[]; children: React.ReactNode }) {
  const [minY, maxY] = yDomain;
  const yStep = (maxY - minY) / 4;
  const yLabels: number[] = [];
  for (let i = 0; i <= 4; i++) yLabels.push(Math.round(minY + i * yStep));

  return (
    <View style={styles.graphCard}>
      <View style={styles.graphHeader}>
        <MaterialCommunityIcons name={icon as any} size={18} color="#2563EB" />
        <Text style={styles.graphTitle}>{title}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.yAxis}>
          {yLabels.reverse().map((label, index) => (
            <Text key={index} style={[styles.yLabel, { top: (index / 4) * GRAPH_HEIGHT + 5 }]}>
              {label}
            </Text>
          ))}
        </View>
        {children}
      </View>
    </View>
  );
}

function GraphLines({ datasets, yDomain }: { datasets: { color: string; data: Observation[] }[]; yDomain: number[] }) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [minY, maxY] = yDomain;
  const dataLength = datasets[0].data.length;

  // Fit all points within the container — no scrolling needed
  const pointGap = dataLength <= 1 ? 0 : (containerWidth - LEFT_PADDING - 20) / (dataLength - 1);
  const graphWidth = containerWidth > 0 ? containerWidth : 300;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
  };

  const normaliseY = (y: number) => {
    if (maxY === minY) return GRAPH_HEIGHT / 2 + 10;
    return GRAPH_HEIGHT - ((y - minY) / (maxY - minY)) * GRAPH_HEIGHT + 10;
  };

  if (containerWidth === 0) {
    return <View style={{ flex: 1 }} onLayout={e => setContainerWidth(e.nativeEvent.layout.width)} />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
      <Svg width={graphWidth} height={GRAPH_HEIGHT + 20}>
        {/* Horizontal grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Line
            key={i}
            x1={0} y1={(i / 4) * GRAPH_HEIGHT + 10}
            x2={graphWidth} y2={(i / 4) * GRAPH_HEIGHT + 10}
            stroke={i === 0 || i === 4 ? "#9CA3AF" : "#E5E7EB"}
            strokeWidth="1"
          />
        ))}

        {/* Vertical grid lines */}
        {datasets[0].data.map((_, i) => (
          <Line
            key={i}
            x1={i * pointGap + LEFT_PADDING} y1={10}
            x2={i * pointGap + LEFT_PADDING} y2={GRAPH_HEIGHT + 10}
            stroke="#F3F4F6" strokeWidth="1"
          />
        ))}

        {/* Lines + Points */}
        {datasets.map((set, setIndex) => {
          const coords = set.data.map((p, i) => ({
            cx: dataLength === 1 ? graphWidth / 2 : i * pointGap + LEFT_PADDING,
            cy: normaliseY(p.y),
          }));

          return (
            <React.Fragment key={setIndex}>
              {coords.length >= 2 && (
                <Polyline
                  points={coords.map(c => `${c.cx},${c.cy}`).join(" ")}
                  fill="none"
                  stroke={set.color}
                  strokeWidth="2"
                />
              )}
              {coords.map((c, i) => (
                <Circle key={i} cx={c.cx} cy={c.cy} r="4" fill={set.color} />
              ))}
            </React.Fragment>
          );
        })}
      </Svg>

      {/* X axis labels */}
      <View style={[styles.xAxis, { width: graphWidth }]}>
        {datasets[0].data.map((point, index) => (
          <Text key={index} style={[styles.xLabel, {
            left: dataLength === 1 ? graphWidth / 2 : index * pointGap + LEFT_PADDING
          }]}>
            {point.date ? formatDate(point.date) : ""}
          </Text>
        ))}
      </View>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  backgroundImage:    { flex: 1 },
  mainContainer:      { flex: 1 },
  container:          { flex: 1, backgroundColor: "transparent", paddingHorizontal: 20 },
  header:             { alignItems: "center", marginTop: 40, paddingVertical: 14 },
  headerTitle:        { fontSize: 20, fontWeight: "700", textAlign: "center" },

  userCard:           { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16, marginVertical: 16, flexDirection: "row", justifyContent: "space-between", borderWidth: 1, borderColor: "#E5E7EB" },
  hello:              { fontSize: 18, fontWeight: "700" },
  sub:                { color: "#6a6e75" },
  avatar:             { width: 60, height: 60, borderRadius: 30, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center" },
  avatarText:         { color: "#FFF", fontWeight: "700", fontSize: 20 },

  graphCard:          { backgroundColor: "#ffffff", borderRadius: 20, padding: 14, marginBottom: 16, overflow: "hidden", borderWidth: 1, borderColor: "#E5E7EB" },
  graphHeader:        { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  graphTitle:         { fontWeight: "600" },
  graphViewport:      { flex: 1, paddingRight: 10, backgroundColor: "#fff" },

  yAxis:              { width: 35, height: GRAPH_HEIGHT + 20, position: "relative", justifyContent: "space-between" },
  yLabel:             { fontSize: 10, color: "#6B7280", position: "absolute", right: 8 },
  xAxis:              { position: "relative", height: 20, marginTop: 5 },
  xLabel:             { fontSize: 10, color: "#6B7280", position: "absolute", transform: [{ translateX: -20 }], width: 40, textAlign: "center" },

  legend:             { flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 8 },
  legendItem:         { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot:          { width: 8, height: 8, borderRadius: 4 },
  legendText:         { fontSize: 12, color: "#6B7280", fontWeight: "500" },

  actionBtn:          { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 20, alignItems: "center", marginBottom: 12, flexDirection: "row", gap: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  actionText:         { color: "#2563EB", fontWeight: "600", fontSize: 16 },

  insightCard:        { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 16, borderLeftWidth: 0, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  insightHeader:      { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  insightTitle:       { fontSize: 16, fontWeight: "700" },
  insightMessage:     { fontSize: 14, color: "#4B5563", lineHeight: 20, marginBottom: 12 },
  ppWarning:          { flexDirection: "row", alignItems: "flex-start", gap: 6, backgroundColor: "#F3F4F6", borderRadius: 8, padding: 8, marginBottom: 12 },
  ppWarningText:      { fontSize: 12, color: "#6B7280", flex: 1, lineHeight: 17 },
  insightStats:       { flexDirection: "row", gap: 20 },
  statItem:           { flex: 1 },
  statLabel:          { fontSize: 12, color: "#9CA3AF", marginBottom: 4 },
  statValue:          { fontSize: 16, fontWeight: "600", color: "#1F2937" },

  placeholderContainer:{ height: GRAPH_HEIGHT + 40, alignItems: "center", justifyContent: "center", backgroundColor: "#F9FAFB", borderRadius: 12, marginTop: 10 },
  placeholderText:    { fontSize: 14, color: "#6B7280", marginTop: 12, textAlign: "center" },
});
