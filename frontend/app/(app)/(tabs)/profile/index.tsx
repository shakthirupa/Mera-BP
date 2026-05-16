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

function HeartRateInsights({ data }: { data: Observation[] }) {
  const values = data.map(d => d.y);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const max = Math.max(...values);
  const min = Math.min(...values);

  // ── Primary: is the average in a healthy range? ───────────────
  let status: string, message: string, icon: string, color: string;

  if (avg < 40) {
    status = "Critically Low";
    message = "Your average heart rate is critically low. Please seek immediate medical attention.";
    icon = "alert-circle"; color = "#DC2626";
  } else if (avg < 60) {
    status = "Low (Bradycardia)";
    message = "Your average resting heart rate is below 60 bpm. This may be normal for athletes, but consult your doctor if you experience dizziness or fatigue.";
    icon = "alert-circle"; color = "#F59E0B";
  } else if (avg <= 100) {
    status = "Normal";
    message = "Your average resting heart rate is within the healthy range of 60–100 bpm.";
    icon = "checkmark-circle"; color = "#10B981";
  } else if (avg <= 120) {
    status = "Elevated (Tachycardia)";
    message = "Your average heart rate is above 100 bpm. Occasional elevation can occur with activity or stress, but a consistently high resting rate warrants a doctor's review.";
    icon = "warning"; color = "#F59E0B";
  } else {
    status = "High — Consult Doctor";
    message = "Your average heart rate is significantly elevated. Please consult your doctor promptly.";
    icon = "alert-circle"; color = "#DC2626";
  }

  // ── Secondary: trend (only meaningful with 3+ readings) ──────
  let trendNote = "";
  if (values.length >= 3) {
    const firstHalf  = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const avgFirst   = firstHalf.reduce((a, b) => a + b, 0)  / firstHalf.length;
    const avgSecond  = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const diff = avgSecond - avgFirst;
    if (diff > 5)       trendNote = " Your readings show an upward trend — monitor closely.";
    else if (diff < -5) trendNote = " Your readings show a downward trend.";
    else                trendNote = " Your readings are stable.";
  }

  return (
    <View style={[styles.insightCard, { borderLeftColor: color }]}>
      <View style={styles.insightHeader}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={[styles.insightTitle, { color }]}>{status}</Text>
      </View>
      <Text style={styles.insightMessage}>{message}{trendNote}</Text>
      <View style={styles.insightStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>{avg} bpm</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Range</Text>
          <Text style={styles.statValue}>
            {values.length > 1 ? `${min}–${max} bpm` : `${avg} bpm`}
          </Text>
        </View>
      </View>
    </View>
  );
}

function BloodPressureInsights({ data }: { data: { systolic: Observation[], diastolic: Observation[] } }) {
  const sysValues = data.systolic.map(d => d.y);
  const diaValues = data.diastolic.map(d => d.y);

  const avgSys = Math.round(sysValues.reduce((a, b) => a + b, 0) / sysValues.length);
  const avgDia = Math.round(diaValues.reduce((a, b) => a + b, 0) / diaValues.length);

  // ── Primary: AHA/ACC 2017 + hypotension thresholds ──────────
  let status: string, message: string, icon: string, color: string;

  if (avgSys < 70 || avgDia < 40) {
    status = "Critically Low BP";
    message = "Your blood pressure is critically low. This can reduce blood flow to vital organs. Seek immediate medical attention.";
    icon = "alert-circle"; color = "#DC2626";
  } else if (avgSys < 90 || avgDia < 60) {
    status = "Low BP (Hypotension)";
    message = "Your blood pressure is below the normal range. Hypotension can cause dizziness, fainting, and fatigue. Stay hydrated, avoid prolonged standing, and consult your doctor if symptoms persist.";
    icon = "warning"; color = "#F59E0B";
  } else if (avgSys > 180 || avgDia > 120) {
    status = "Hypertensive Crisis";
    message = "Your blood pressure is at a dangerous level. Seek emergency medical care immediately if you have symptoms such as chest pain, shortness of breath, or vision changes.";
    icon = "alert-circle"; color = "#DC2626";
  } else if (avgSys < 120 && avgDia < 80) {
    status = "Normal";
    message = "Your blood pressure is within the healthy range. Continue maintaining a balanced diet, regular exercise, and a healthy weight.";
    icon = "checkmark-circle"; color = "#10B981";
  } else if (avgSys < 130 && avgDia < 80) {
    status = "Elevated";
    message = "Your blood pressure is elevated. Without lifestyle changes, elevated BP is likely to develop into hypertension. Focus on reducing sodium intake, increasing physical activity, and managing stress.";
    icon = "warning"; color = "#F59E0B";
  } else if ((avgSys >= 130 && avgSys <= 139) || (avgDia >= 80 && avgDia <= 89)) {
    status = "Stage 1 Hypertension";
    message = "You have Stage 1 hypertension. Your doctor may recommend lifestyle changes and, in some cases, medication. Monitor your BP regularly and reduce sodium, alcohol, and stress.";
    icon = "alert-circle"; color = "#EF4444";
  } else {
    status = "Stage 2 Hypertension";
    message = "You have Stage 2 hypertension. A combination of medications and lifestyle changes is typically recommended. Please consult your doctor as soon as possible.";
    icon = "alert-circle"; color = "#DC2626";
  }

  // ── Pulse pressure ────────────────────────────────────────────
  const pulsePressure = avgSys - avgDia;
  let ppNote = "";
  if (pulsePressure > 60) {
    ppNote = " Your pulse pressure is elevated (> 60 mmHg), which may indicate arterial stiffness — discuss this with your doctor.";
  }

  // ── Trend (3+ readings) ───────────────────────────────────────
  let trendNote = "";
  if (sysValues.length >= 3) {
    const mid      = Math.floor(sysValues.length / 2);
    const avgSysFirst  = sysValues.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
    const avgSysSecond = sysValues.slice(mid).reduce((a, b) => a + b, 0)  / (sysValues.length - mid);
    const diff = avgSysSecond - avgSysFirst;
    if (diff > 5)       trendNote = " Systolic pressure shows an upward trend — monitor closely.";
    else if (diff < -5) trendNote = " Systolic pressure shows a downward trend — keep it up.";
    else                trendNote = " Your readings are stable.";
  }

  return (
    <View style={[styles.insightCard, { borderLeftColor: color }]}>
      <View style={styles.insightHeader}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={[styles.insightTitle, { color }]}>{status}</Text>
      </View>
      <Text style={styles.insightMessage}>{message}{ppNote}{trendNote}</Text>
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
  insightStats:       { flexDirection: "row", gap: 20 },
  statItem:           { flex: 1 },
  statLabel:          { fontSize: 12, color: "#9CA3AF", marginBottom: 4 },
  statValue:          { fontSize: 16, fontWeight: "600", color: "#1F2937" },

  placeholderContainer:{ height: GRAPH_HEIGHT + 40, alignItems: "center", justifyContent: "center", backgroundColor: "#F9FAFB", borderRadius: 12, marginTop: 10 },
  placeholderText:    { fontSize: 14, color: "#6B7280", marginTop: 12, textAlign: "center" },
});
