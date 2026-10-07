import React, { useEffect, useMemo, useState } from "react";

/* =========================================================
   OPENSENIOR CARE
   Agentic AI Elderly Care Demonstration
   Single-file React prototype
   ========================================================= */

const AGENTS = {
  router: {
    name: "Agent Router",
    icon: "🧠",
    color: "#7c3aed",
    description:
      "Understands the request and selects the appropriate specialist.",
  },
  health: {
    name: "Health Assistance Agent",
    icon: "💊",
    color: "#0ea5e9",
    description:
      "Handles medication-related assistance using user-provided information.",
  },
  emergency: {
    name: "Emergency Agent",
    icon: "🚨",
    color: "#ef4444",
    description:
      "Recognizes predefined urgent situations and escalates them.",
  },
  routine: {
    name: "Routine Agent",
    icon: "📅",
    color: "#10b981",
    description:
      "Handles daily routines, reminders and routine assistance.",
  },
  care: {
    name: "Care Coordination Agent",
    icon: "🤝",
    color: "#f59e0b",
    description:
      "Coordinates alerts and prepares recommended human action.",
  },
};

const initialAlerts = [
  {
    id: 1,
    type: "routine",
    title: "Morning routine completed",
    message: "Mrs. Asha Mehta completed her morning routine.",
    priority: "LOW",
    time: "08:42",
    source: "Routine Agent",
    status: "Resolved",
  },
];

const initialTrace = [
  {
    id: 1,
    agent: "router",
    text: "Agent Router ready",
    status: "completed",
    time: "System",
  },
  {
    id: 2,
    agent: "care",
    text: "Care Coordination waiting",
    status: "idle",
    time: "System",
  },
];

const scenarios = {
  medicine: {
    title: "Medication Assistance",
    subtitle:
      "Senior reported that evening medication has not been taken.",
    input: "I haven't taken my evening medicine.",
    route: ["router", "health", "care"],
    alert: {
      type: "medicine",
      title: "Medication assistance requested",
      message:
        "Mrs. Asha Mehta reported that her evening medication has not been taken.",
      priority: "HIGH",
      source: "Health Assistance Agent",
      action:
        "Contact the senior and verify medication status. Follow the prescribed care plan.",
    },
  },

  emergency: {
    title: "Emergency Assistance",
    subtitle: "Senior requested urgent assistance.",
    input: "I need emergency help.",
    route: ["router", "emergency", "care"],
    alert: {
      type: "emergency",
      title: "Emergency assistance requested",
      message:
        "Mrs. Asha Mehta has requested urgent assistance through the Senior Companion.",
      priority: "CRITICAL",
      source: "Emergency Agent",
      action:
        "Immediately contact the designated caregiver and follow the emergency response plan.",
    },
  },

  routine: {
    title: "Routine Assistance",
    subtitle: "Senior needs help with a daily routine.",
    input: "I need help with my evening routine.",
    route: ["router", "routine", "care"],
    alert: {
      type: "routine",
      title: "Routine assistance requested",
      message:
        "Mrs. Asha Mehta requested assistance with her evening routine.",
      priority: "MEDIUM",
      source: "Routine Agent",
      action:
        "Review the routine and contact the senior if assistance is required.",
    },
  },
};

/* =========================================================
   GLOBAL CSS
   ========================================================= */

const CSS = `
* {
  box-sizing: border-box;
}

:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  color: #172033;
  background: #f4f7fb;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

body {
  margin: 0;
  min-width: 320px;
  background:
    radial-gradient(circle at 80% 0%, rgba(124,58,237,.08), transparent 25%),
    radial-gradient(circle at 10% 20%, rgba(14,165,233,.06), transparent 25%),
    #f4f7fb;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.app {
  min-height: 100vh;
}

/* ---------- SHELL ---------- */

.shell {
  min-height: 100vh;
  display: flex;
}

.sidebar {
  width: 260px;
  min-height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background:
    linear-gradient(180deg, #111827 0%, #172033 55%, #111827 100%);
  color: white;
  padding: 25px 18px;
  z-index: 20;
  box-shadow: 8px 0 30px rgba(15,23,42,.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 10px 30px;
}

.brandLogo {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  font-size: 21px;
  background: linear-gradient(135deg,#7c3aed,#2563eb);
  box-shadow: 0 10px 25px rgba(124,58,237,.35);
}

.brandTitle {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -.3px;
}

.brandSub {
  color: #9ca3af;
  font-size: 11px;
  margin-top: 3px;
}

.navLabel {
  color: #6b7280;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
  padding: 12px 12px 8px;
}

.navButton {
  width: 100%;
  border: 0;
  color: #cbd5e1;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px;
  border-radius: 11px;
  margin-bottom: 4px;
  text-align: left;
  transition: .2s;
}

.navButton:hover,
.navButton.active {
  color: white;
  background: rgba(255,255,255,.09);
}

.navIcon {
  width: 26px;
  text-align: center;
  font-size: 17px;
}

.sidebarBottom {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 22px;
}

.systemMini {
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.05);
  border-radius: 15px;
  padding: 14px;
}

.systemMiniTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.systemMiniTitle {
  font-size: 11px;
  color: #9ca3af;
}

.online {
  color: #34d399;
  font-size: 11px;
  font-weight: 700;
}

.onlineDot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  margin-right: 5px;
  box-shadow: 0 0 10px #34d399;
}

/* ---------- MAIN ---------- */

.main {
  margin-left: 260px;
  width: calc(100% - 260px);
  min-height: 100vh;
}

.topbar {
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 34px;
  background: rgba(255,255,255,.78);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid #e7ebf2;
  position: sticky;
  top: 0;
  z-index: 15;
}

.topTitle {
  font-weight: 800;
  font-size: 14px;
}

.topSub {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 3px;
}

.topActions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.viewToggle {
  display: flex;
  padding: 4px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  border-radius: 10px;
}

.viewToggle button {
  border: 0;
  padding: 8px 13px;
  border-radius: 7px;
  background: transparent;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.viewToggle button.active {
  background: white;
  color: #172033;
  box-shadow: 0 2px 8px rgba(15,23,42,.08);
}

.page {
  padding: 30px 34px 50px;
  max-width: 1500px;
  margin: auto;
}

/* ---------- HERO ---------- */

.hero {
  border-radius: 24px;
  padding: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 85% 20%, rgba(255,255,255,.16), transparent 24%),
    linear-gradient(135deg,#172033,#253451 55%,#4c3a7e);
  box-shadow: 0 20px 50px rgba(30,41,59,.16);
}

.hero::after {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 50%;
  right: -90px;
  bottom: -150px;
}

.heroContent {
  position: relative;
  z-index: 2;
  max-width: 780px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 99px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.12);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.hero h1 {
  font-size: clamp(27px,4vw,44px);
  line-height: 1.05;
  margin: 17px 0 12px;
  letter-spacing: -1.6px;
}

.hero p {
  margin: 0;
  color: #dbe5f3;
  max-width: 690px;
  line-height: 1.65;
  font-size: 14px;
}

.heroActions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.primaryBtn,
.secondaryBtn,
.dangerBtn,
.demoBtn {
  border: 0;
  border-radius: 11px;
  padding: 11px 16px;
  font-weight: 800;
  font-size: 12px;
  transition: .2s;
}

.primaryBtn {
  background: white;
  color: #172033;
}

.primaryBtn:hover,
.secondaryBtn:hover,
.dangerBtn:hover,
.demoBtn:hover {
  transform: translateY(-2px);
}

.secondaryBtn {
  background: rgba(255,255,255,.1);
  color: white;
  border: 1px solid rgba(255,255,255,.15);
}

.dangerBtn {
  background: #ef4444;
  color: white;
}

.demoBtn {
  background: #172033;
  color: white;
}

.demoBtn.red {
  background: #dc2626;
}

.demoBtn.blue {
  background: #2563eb;
}

.demoBtn.green {
  background: #059669;
}

/* ---------- METRICS ---------- */

.metrics {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 15px;
  margin: 20px 0;
}

.metric {
  background: white;
  border: 1px solid #e7ebf2;
  border-radius: 17px;
  padding: 18px;
  box-shadow: 0 5px 18px rgba(15,23,42,.035);
}

.metricTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metricLabel {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

.metricIcon {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #f1f5f9;
}

.metricValue {
  font-size: 27px;
  font-weight: 900;
  margin-top: 10px;
  letter-spacing: -1px;
}

.metricTrend {
  color: #10b981;
  font-size: 10px;
  margin-top: 3px;
}

/* ---------- GRID ---------- */

.sectionTitle {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 27px 0 13px;
}

.sectionTitle h2 {
  margin: 0;
  font-size: 17px;
  letter-spacing: -.4px;
}

.sectionTitle p {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 11px;
}

.grid2 {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 18px;
}

.grid3 {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 15px;
}

.card {
  background: white;
  border: 1px solid #e7ebf2;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 5px 18px rgba(15,23,42,.035);
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.cardTitle {
  font-size: 14px;
  font-weight: 850;
}

.cardSub {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
  line-height: 1.5;
}

.badge {
  padding: 5px 8px;
  border-radius: 99px;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .5px;
}

.badge.green {
  background: #dcfce7;
  color: #15803d;
}

.badge.blue {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge.red {
  background: #fee2e2;
  color: #b91c1c;
}

.badge.yellow {
  background: #fef3c7;
  color: #b45309;
}

.badge.gray {
  background: #f1f5f9;
  color: #64748b;
}

/* ---------- SENIOR VIEW ---------- */

.seniorHero {
  display: grid;
  grid-template-columns: 1.4fr .6fr;
  gap: 18px;
}

.welcomeBox {
  min-height: 235px;
  border-radius: 22px;
  padding: 27px;
  color: white;
  background:
    radial-gradient(circle at 90% 20%, rgba(255,255,255,.18), transparent 25%),
    linear-gradient(135deg,#0f766e,#155e75);
  position: relative;
  overflow: hidden;
}

.welcomeBox h1 {
  margin: 12px 0 8px;
  font-size: 31px;
  letter-spacing: -1px;
}

.welcomeBox p {
  margin: 0;
  color: #d5f5f0;
  line-height: 1.6;
  font-size: 13px;
}

.profileBubble {
  position: absolute;
  right: 30px;
  bottom: -35px;
  width: 155px;
  height: 155px;
  border-radius: 50%;
  background: rgba(255,255,255,.09);
  display: grid;
  place-items: center;
  font-size: 72px;
}

.statusCard {
  min-height: 235px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.statusBig {
  display: flex;
  align-items: center;
  gap: 13px;
}

.statusAvatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #ede9fe;
  font-size: 24px;
}

.statusName {
  font-weight: 850;
  font-size: 14px;
}

.statusRole {
  color: #94a3b8;
  font-size: 10px;
  margin-top: 3px;
}

.statusLine {
  height: 1px;
  background: #eef2f7;
  margin: 17px 0;
}

.statusItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  font-size: 11px;
}

.statusItem span:first-child {
  color: #64748b;
}

.actionGrid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 13px;
}

.actionCard {
  border: 1px solid #e7ebf2;
  background: white;
  border-radius: 17px;
  padding: 17px;
  text-align: left;
  transition: .2s;
}

.actionCard:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(15,23,42,.08);
}

.actionIcon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 20px;
  margin-bottom: 13px;
}

.actionCard h3 {
  margin: 0;
  font-size: 13px;
}

.actionCard p {
  margin: 5px 0 0;
  color: #94a3b8;
  font-size: 10px;
  line-height: 1.5;
}

.messageBox {
  background: white;
  border: 1px solid #e7ebf2;
  border-radius: 18px;
  padding: 18px;
  margin-top: 18px;
  box-shadow: 0 5px 18px rgba(15,23,42,.035);
}

.messageBox small {
  color: #7c3aed;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1px;
}

.messageBox h3 {
  margin: 5px 0 12px;
  font-size: 15px;
}

.messageRow {
  display: flex;
  gap: 9px;
}

.messageInput {
  flex: 1;
  min-width: 0;
  border: 1px solid #dfe5ee;
  border-radius: 11px;
  padding: 12px 13px;
  outline: none;
  background: #f8fafc;
  font-size: 12px;
}

.messageInput:focus {
  border-color: #7c3aed;
  background: white;
}

.sendBtn {
  border: 0;
  border-radius: 11px;
  padding: 0 17px;
  background: #172033;
  color: white;
  font-weight: 800;
  font-size: 11px;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 10px;
}

.suggestion {
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  color: #64748b;
  border-radius: 99px;
  padding: 6px 9px;
  font-size: 9px;
  font-weight: 700;
}

/* ---------- MEDICATION ---------- */

.medicationCard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  background: linear-gradient(135deg,#f0fdfa,#f8fafc);
  border: 1px solid #ccfbf1;
  border-radius: 17px;
  padding: 17px;
}

.medIcon {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: #ccfbf1;
  display: grid;
  place-items: center;
  font-size: 22px;
}

.medInfo {
  flex: 1;
}

.medInfo h3 {
  margin: 0;
  font-size: 13px;
}

.medInfo p {
  margin: 4px 0 0;
  font-size: 10px;
  color: #64748b;
}

.medActions {
  display: flex;
  gap: 7px;
}

.smallBtn {
  border: 0;
  border-radius: 9px;
  padding: 9px 11px;
  font-size: 10px;
  font-weight: 800;
}

.smallBtn.take {
  background: #059669;
  color: white;
}

.smallBtn.help {
  background: #fee2e2;
  color: #b91c1c;
}

/* ---------- AGENT NETWORK ---------- */

.agentNetwork {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  gap: 10px;
  align-items: stretch;
}

.agentNode {
  position: relative;
  padding: 16px 12px;
  border: 1px solid #e7ebf2;
  background: white;
  border-radius: 15px;
  text-align: center;
  transition: .3s;
}

.agentNode.active {
  transform: translateY(-4px);
  border-color: #7c3aed;
  box-shadow: 0 12px 28px rgba(124,58,237,.14);
}

.agentNode.running {
  animation: pulseAgent 1s infinite alternate;
}

@keyframes pulseAgent {
  from { box-shadow: 0 0 0 rgba(124,58,237,0); }
  to { box-shadow: 0 0 24px rgba(124,58,237,.22); }
}

.agentNodeIcon {
  width: 42px;
  height: 42px;
  margin: auto;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: #f1f5f9;
  font-size: 21px;
}

.agentNodeName {
  font-weight: 850;
  font-size: 10px;
  margin-top: 10px;
}

.agentNodeStatus {
  font-size: 8px;
  color: #94a3b8;
  margin-top: 4px;
}

.flowArrow {
  position: absolute;
  right: -18px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  color: #cbd5e1;
  font-size: 18px;
}

/* ---------- TRACE ---------- */

.trace {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.traceItem {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #edf1f6;
}

.traceIcon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: white;
}

.traceText {
  flex: 1;
}

.traceTitle {
  font-size: 11px;
  font-weight: 800;
}

.traceTime {
  font-size: 9px;
  color: #94a3b8;
  margin-top: 3px;
}

.traceStatus {
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
}

.traceStatus.completed {
  color: #059669;
}

.traceStatus.running {
  color: #7c3aed;
}

.traceStatus.waiting {
  color: #f59e0b;
}

/* ---------- ALERTS ---------- */

.alertList {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.alert {
  border: 1px solid #e7ebf2;
  border-left: 4px solid #94a3b8;
  background: white;
  border-radius: 14px;
  padding: 14px;
  transition: .2s;
}

.alert:hover {
  box-shadow: 0 9px 25px rgba(15,23,42,.06);
}

.alert.HIGH {
  border-left-color: #f59e0b;
}

.alert.CRITICAL {
  border-left-color: #ef4444;
}

.alert.MEDIUM {
  border-left-color: #3b82f6;
}

.alert.LOW {
  border-left-color: #10b981;
}

.alertTop {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.alertTitle {
  font-size: 12px;
  font-weight: 850;
}

.alertMessage {
  color: #64748b;
  font-size: 10px;
  line-height: 1.55;
  margin-top: 6px;
}

.alertMeta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 10px;
}

.meta {
  background: #f8fafc;
  color: #64748b;
  padding: 5px 7px;
  border-radius: 6px;
  font-size: 8px;
  font-weight: 700;
}

.alertButtons {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.resolveBtn,
.detailBtn {
  border: 0;
  border-radius: 8px;
  padding: 7px 9px;
  font-size: 9px;
  font-weight: 800;
}

.resolveBtn {
  background: #dcfce7;
  color: #15803d;
}

.detailBtn {
  background: #f1f5f9;
  color: #475569;
}

/* ---------- DEMO CONTROL ---------- */

.demoPanel {
  background:
    linear-gradient(135deg,#111827,#1e293b);
  color: white;
  border-radius: 20px;
  padding: 21px;
}

.demoPanel h3 {
  margin: 0;
  font-size: 15px;
}

.demoPanel p {
  margin: 5px 0 17px;
  color: #94a3b8;
  font-size: 10px;
}

.demoButtons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.demoStatus {
  margin-top: 16px;
  padding: 11px;
  border-radius: 10px;
  background: rgba(255,255,255,.06);
  color: #cbd5e1;
  font-size: 10px;
}

/* ---------- EXPLAINABILITY ---------- */

.explainGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
}

.explainItem {
  border: 1px solid #edf1f6;
  border-radius: 13px;
  padding: 14px;
}

.explainItem strong {
  font-size: 11px;
}

.explainItem p {
  color: #64748b;
  font-size: 10px;
  line-height: 1.55;
  margin: 5px 0 0;
}

/* ---------- ARCHITECTURE ---------- */

.architecture {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 16px 5px;
}

.archBox {
  border: 1px solid #e7ebf2;
  background: #f8fafc;
  padding: 13px 15px;
  border-radius: 12px;
  text-align: center;
  min-width: 120px;
}

.archBox strong {
  display: block;
  font-size: 10px;
}

.archBox span {
  display: block;
  font-size: 8px;
  color: #94a3b8;
  margin-top: 4px;
}

.archArrow {
  color: #94a3b8;
  font-size: 16px;
}

/* ---------- PRIVACY ---------- */

.privacyGrid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 11px;
}

.privacyItem {
  background: #f8fafc;
  border: 1px solid #edf1f6;
  border-radius: 13px;
  padding: 14px;
}

.privacyItem strong {
  font-size: 11px;
}

.privacyItem p {
  color: #64748b;
  font-size: 9px;
  line-height: 1.5;
  margin: 5px 0 0;
}

/* ---------- MODAL ---------- */

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.55);
  backdrop-filter: blur(5px);
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal {
  width: min(560px,100%);
  max-height: 90vh;
  overflow: auto;
  background: white;
  border-radius: 20px;
  padding: 23px;
  box-shadow: 0 30px 80px rgba(15,23,42,.25);
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modalClose {
  border: 0;
  background: #f1f5f9;
  width: 31px;
  height: 31px;
  border-radius: 9px;
  font-weight: 900;
}

.modal h2 {
  margin: 0;
  font-size: 18px;
}

.modalSub {
  color: #94a3b8;
  font-size: 10px;
  margin-top: 4px;
}

.modalSection {
  margin-top: 20px;
}

.modalSection h4 {
  margin: 0 0 7px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: #94a3b8;
}

.modalSection p {
  margin: 0;
  color: #475569;
  font-size: 11px;
  line-height: 1.6;
}

.humanBox {
  margin-top: 15px;
  padding: 13px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 11px;
}

.humanBox strong {
  font-size: 10px;
  color: #c2410c;
}

.humanBox p {
  margin-top: 4px;
  font-size: 10px;
  color: #7c2d12;
}

/* ---------- TOAST ---------- */

.toast {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 200;
  background: #111827;
  color: white;
  padding: 13px 16px;
  border-radius: 12px;
  box-shadow: 0 15px 40px rgba(15,23,42,.25);
  font-size: 11px;
  font-weight: 700;
  animation: toastIn .25s ease;
}

@keyframes toastIn {
  from {
    transform: translateY(12px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ---------- EMPTY ---------- */

.empty {
  padding: 30px;
  text-align: center;
  color: #94a3b8;
  font-size: 11px;
}

/* ---------- FOOTER ---------- */

.footer {
  text-align: center;
  padding: 25px 0 5px;
  color: #94a3b8;
  font-size: 9px;
}

.footer strong {
  color: #64748b;
}

/* ---------- RESPONSIVE ---------- */

@media(max-width:1050px) {
  .metrics {
    grid-template-columns: repeat(2,1fr);
  }

  .grid2,
  .seniorHero {
    grid-template-columns: 1fr;
  }

  .agentNetwork {
    grid-template-columns: repeat(3,1fr);
  }

  .agentNode:nth-child(3) .flowArrow {
    display: none;
  }
}

@media(max-width:780px) {
  .sidebar {
    width: 70px;
    padding: 18px 9px;
  }

  .brandTitle,
  .brandSub,
  .navLabel,
  .navText,
  .sidebarBottom {
    display: none;
  }

  .brand {
    justify-content: center;
    padding: 0 0 25px;
  }

  .navButton {
    justify-content: center;
    padding: 12px 4px;
  }

  .main {
    margin-left: 70px;
    width: calc(100% - 70px);
  }

  .topbar {
    padding: 0 18px;
  }

  .page {
    padding: 20px 15px 40px;
  }

  .actionGrid,
  .grid3,
  .privacyGrid,
  .explainGrid {
    grid-template-columns: 1fr;
  }

  .agentNetwork {
    grid-template-columns: repeat(2,1fr);
  }

  .agentNode .flowArrow {
    display: none;
  }

  .hero {
    padding: 23px;
  }

  .messageRow {
    flex-direction: column;
  }

  .sendBtn {
    padding: 11px;
  }
}

@media(max-width:520px) {
  .metrics {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .metric {
    padding: 13px;
  }

  .metricValue {
    font-size: 21px;
  }

  .topSub {
    display: none;
  }

  .viewToggle button {
    padding: 7px 8px;
    font-size: 10px;
  }

  .hero h1 {
    font-size: 26px;
  }

  .medicationCard {
    align-items: flex-start;
    flex-direction: column;
  }

  .medActions {
    width: 100%;
  }

  .smallBtn {
    flex: 1;
  }
}
`;

/* =========================================================
   APP
   ========================================================= */

   function App() {
  const [view, setView] = useState("dashboard");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [trace, setTrace] = useState(initialTrace);
  const [activeAgent, setActiveAgent] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [toast, setToast] = useState("");
  const [message, setMessage] = useState("");
  const [demoRunning, setDemoRunning] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2800);
  };

  const addTrace = (agent, text, status = "completed") => {
    setTrace((old) => [
      {
        id: Date.now() + Math.random(),
        agent,
        text,
        status,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...old,
    ].slice(0, 8));
  };

  const createAlert = (type) => {
    const scenarioData = scenarios[type] || scenarios.routine;

    const newAlert = {
      id: Date.now(),
      ...scenarioData.alert,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Open",
    };

    setAlerts((old) => [newAlert, ...old]);

    showToast(
      type === "emergency"
        ? "Critical alert created and escalated"
        : "Caregiver alert created"
    );

    return newAlert;
  };

  const runScenario = async (type) => {
    if (demoRunning) return;

    setDemoRunning(true);
    setScenario(type);

    const data = scenarios[type];

    setTrace([]);
    setActiveAgent(null);

    for (let i = 0; i < data.route.length; i++) {
      const agent = data.route[i];

      setActiveAgent(agent);

      addTrace(
        agent,
        `${AGENTS[agent].name} is processing the request`,
        "running"
      );

      await new Promise((resolve) => setTimeout(resolve, 1200));

      addTrace(
        agent,
        `${AGENTS[agent].name} completed its task`,
        "completed"
      );
    }

    setActiveAgent(null);

    createAlert(type);

    addTrace(
      "care",
      "Alert prepared for human caregiver intervention",
      "completed"
    );

    setDemoRunning(false);
  };

  const resolveAlert = (id) => {
    setAlerts((old) =>
      old.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              status: "Resolved",
            }
          : alert
      )
    );

    showToast("Alert marked as resolved");
  };

  const resetDemo = () => {
    setAlerts(initialAlerts);
    setTrace(initialTrace);
    setActiveAgent(null);
    setScenario(null);
    setDemoRunning(false);
    showToast("Demo environment reset");
  };

  const handleMessage = () => {
    const text = message.toLowerCase();

    let type = "routine";

    if (
      text.includes("emergency") ||
      text.includes("urgent") ||
      text.includes("danger") ||
      text.includes("help now")
    ) {
      type = "emergency";
    } else if (
      text.includes("medicine") ||
      text.includes("medication") ||
      text.includes("tablet") ||
      text.includes("pill")
    ) {
      type = "medicine";
    }

    setView("dashboard");
    runScenario(type);
    setMessage("");
  };

  const openAlerts = useMemo(
    () => alerts.filter((a) => a.status === "Open").length,
    [alerts]
  );

  const criticalAlerts = useMemo(
    () =>
      alerts.filter(
        (a) =>
          a.status === "Open" &&
          (a.priority === "CRITICAL" || a.priority === "HIGH")
      ).length,
    [alerts]
  );

  return (
    <div className="app">
      <div className="shell">

        <Sidebar view={view} setView={setView} />

        <main className="main">

          <Topbar view={view} setView={setView} />

          {view === "senior" ? (
            <SeniorView
              message={message}
              setMessage={setMessage}
              handleMessage={handleMessage}
              runScenario={runScenario}
              createAlert={createAlert}
              showToast={showToast}
              activity={
                scenario
                  ? scenarios[scenario].subtitle
                  : "Everything looks good. Your care companion is ready."
              }
            />
          ) : (
            <Dashboard
              alerts={alerts}
              openAlerts={openAlerts}
              criticalAlerts={criticalAlerts}
              trace={trace}
              activeAgent={activeAgent}
              scenario={scenario}
              demoRunning={demoRunning}
              runScenario={runScenario}
              resolveAlert={resolveAlert}
              resetDemo={resetDemo}
              selectedAlert={selectedAlert}
              setSelectedAlert={setSelectedAlert}
            />
          )}

        </main>
      </div>

      {selectedAlert && (
        <AlertModal
          alert={selectedAlert}
          close={() => setSelectedAlert(null)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* =========================================================
   SIDEBAR
   ========================================================= */

function Sidebar({ view, setView }) {
  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brandLogo">✦</div>

        <div>
          <div className="brandTitle">OpenSenior Care</div>
          <div className="brandSub">Agentic Care Platform</div>
        </div>
      </div>

      <div className="navLabel">MAIN</div>

      <button
        className={`navButton ${view === "dashboard" ? "active" : ""}`}
        onClick={() => setView("dashboard")}
      >
        <span className="navIcon">▦</span>
        <span className="navText">Caregiver Dashboard</span>
      </button>

      <button
        className={`navButton ${view === "senior" ? "active" : ""}`}
        onClick={() => setView("senior")}
      >
        <span className="navIcon">👵</span>
        <span className="navText">Senior Companion</span>
      </button>

      <div className="navLabel">SYSTEM</div>

      <button className="navButton">
        <span className="navIcon">◈</span>
        <span className="navText">Agent Network</span>
      </button>

      <button className="navButton">
        <span className="navIcon">🔐</span>
        <span className="navText">Privacy Center</span>
      </button>

      <div className="sidebarBottom">
        <div className="systemMini">

          <div className="systemMiniTop">
            <span className="systemMiniTitle">
              SYSTEM STATUS
            </span>

            <span className="online">
              <span className="onlineDot" />
              Online
            </span>
          </div>

        </div>
      </div>

    </aside>
  );
}

/* =========================================================
   TOPBAR
   ========================================================= */

function Topbar({ view, setView }) {
  return (
    <header className="topbar">

      <div>
        <div className="topTitle">
          {view === "senior"
            ? "Senior Companion"
            : "Care Operations Center"}
        </div>

        <div className="topSub">
          Agentic AI powered elderly-care coordination
        </div>
      </div>

      <div className="topActions">

        <div className="viewToggle">

          <button
            className={view === "dashboard" ? "active" : ""}
            onClick={() => setView("dashboard")}
          >
            Caregiver
          </button>

          <button
            className={view === "senior" ? "active" : ""}
            onClick={() => setView("senior")}
          >
            Senior
          </button>

        </div>

      </div>

    </header>
  );
}
/* =========================================================
   SENIOR VIEW
   ========================================================= */

function SeniorView({
  message,
  setMessage,
  handleMessage,
  runScenario,
  createAlert,
  showToast,
  activity,
}) {
  return (
    <div className="page">

      <div className="seniorHero">

        <div className="welcomeBox">

          <div className="eyebrow">
            ✦ AI CARE COMPANION
          </div>

          <h1>Hello, Mrs. Asha 👋</h1>

          <p>
            Your care companion is here to help you with medication,
            emergencies, daily routines, and connecting with your caregiver.
          </p>

          <div className="heroActions">

            <button
              className="primaryBtn"
              onClick={() => runScenario("emergency")}
            >
              🚨 I Need Help
            </button>

            <button
              className="secondaryBtn"
              onClick={() => runScenario("medicine")}
            >
              💊 Medication Help
            </button>

          </div>

          <div className="profileBubble">
            👵
          </div>

        </div>

        <div className="card statusCard">

          <div>

            <div className="statusBig">

              <div className="statusAvatar">
                👵
              </div>

              <div>
                <div className="statusName">
                  Asha Mehta
                </div>

                <div className="statusRole">
                  Senior User
                </div>
              </div>

            </div>

            <div className="statusLine" />

            <div className="statusItem">
              <span>Caregiver</span>
              <strong>Rahul Mehta</strong>
            </div>

            <div className="statusItem">
              <span>Connection</span>
              <span className="badge green">
                ● Connected
              </span>
            </div>

            <div className="statusItem">
              <span>AI Companion</span>
              <span className="badge purple">
                Active
              </span>
            </div>

          </div>

          <div className="statusItem">
            <span>Current activity</span>
            <strong>{activity}</strong>
          </div>

        </div>

      </div>

      <div className="sectionTitle">
        <div>
          <h2>How can I help you?</h2>
          <p>
            Choose an action or tell your AI companion what you need.
          </p>
        </div>
      </div>

      <div className="actionGrid">

        <button
          className="actionCard"
          onClick={() => runScenario("medicine")}
        >
          <div
            className="actionIcon"
            style={{
              background: "#dbeafe",
            }}
          >
            💊
          </div>

          <h3>Medication Help</h3>

          <p>
            Get assistance when you have forgotten or need help with
            your medication.
          </p>
        </button>

        <button
          className="actionCard"
          onClick={() => runScenario("emergency")}
        >
          <div
            className="actionIcon"
            style={{
              background: "#fee2e2",
            }}
          >
            🚨
          </div>

          <h3>Emergency</h3>

          <p>
            Quickly notify the care network when urgent assistance
            is required.
          </p>
        </button>

        <button
          className="actionCard"
          onClick={() => runScenario("routine")}
        >
          <div
            className="actionIcon"
            style={{
              background: "#dcfce7",
            }}
          >
            📅
          </div>

          <h3>Daily Routine</h3>

          <p>
            Get help with reminders and everyday activities.
          </p>
        </button>

      </div>

      <div className="messageBox">

        <small>AI COMPANION</small>

        <h3>Tell me what you need</h3>

        <div className="messageRow">

          <input
            className="messageInput"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleMessage();
              }
            }}
            placeholder="Example: I haven't taken my medicine..."
          />

          <button
            className="sendBtn"
            onClick={handleMessage}
          >
            Send →
          </button>

        </div>

        <div className="suggestions">

          <button
            className="suggestion"
            onClick={() =>
              setMessage("I haven't taken my medicine.")
            }
          >
            💊 Medication
          </button>

          <button
            className="suggestion"
            onClick={() =>
              setMessage("I need emergency help.")
            }
          >
            🚨 Emergency
          </button>

          <button
            className="suggestion"
            onClick={() =>
              setMessage("I need help with my routine.")
            }
          >
            📅 Routine
          </button>

        </div>

      </div>

      <div className="sectionTitle">

        <div>
          <h2>Today's medication</h2>

          <p>
            Medication information is displayed for demonstration.
          </p>
        </div>

        <span className="badge green">
          On Schedule
        </span>

      </div>

      <div className="medicationCard">

        <div className="medIcon">
          💊
        </div>

        <div className="medInfo">

          <h3>
            Evening Medication
          </h3>

          <p>
            Scheduled for 8:00 PM · As prescribed by your doctor
          </p>

        </div>

        <div className="medActions">

          <button
            className="smallBtn take"
            onClick={() =>
              showToast("Medication marked as taken")
            }
          >
            ✓ Taken
          </button>

          <button
            className="smallBtn help"
            onClick={() => runScenario("medicine")}
          >
            Need Help
          </button>

        </div>

      </div>

      <div className="sectionTitle">

        <div>
          <h2>Care network</h2>

          <p>
            Your AI agents coordinate with human caregivers.
          </p>
        </div>

      </div>

      <div className="card">

        <div className="agentNetwork">

          {Object.entries(AGENTS).map(
            ([key, agent], index, array) => (
              <div
                className="agentNode"
                key={key}
              >

                <div
                  className="agentNodeIcon"
                  style={{
                    background: `${agent.color}15`,
                  }}
                >
                  {agent.icon}
                </div>

                <div className="agentNodeName">
                  {agent.name}
                </div>

                <div className="agentNodeStatus">
                  Available
                </div>

                {index < array.length - 1 && (
                  <div className="flowArrow">
                    →
                  </div>
                )}

              </div>
            )
          )}

        </div>

      </div>

      <div className="footer">
        <strong>OpenSenior Care</strong> ·
        Human-centered Agentic AI for elderly care
      </div>

    </div>
  );
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard({
  alerts,
  openAlerts,
  criticalAlerts,
  trace,
  activeAgent,
  scenario,
  demoRunning,
  runScenario,
  resolveAlert,
  resetDemo,
  selectedAlert,
  setSelectedAlert,
}) {
  return (
    <div className="page">

      <div className="hero">

        <div className="heroContent">

          <div className="eyebrow">
            ✦ DECENTRACK 2.0 · LIVE DEMO
          </div>

          <h1>
            Intelligent care,
            <br />
            coordinated by agents.
          </h1>

          <p>
            OpenSenior Care uses specialized AI agents to understand
            senior requests, route them to the right assistance,
            coordinate care, and notify human caregivers when action
            is required.
          </p>

          <div className="heroActions">

            <button
              className="primaryBtn"
              onClick={() => runScenario("emergency")}
            >
              ▶ Run Emergency Demo
            </button>

            <button
              className="secondaryBtn"
              onClick={() => runScenario("medicine")}
            >
              Run Medication Demo
            </button>

          </div>

        </div>

      </div>

      <div className="metrics">

        <Metric
          label="Open Alerts"
          value={openAlerts}
          icon="🔔"
          trend="Requires attention"
        />

        <Metric
          label="Priority Alerts"
          value={criticalAlerts}
          icon="🚨"
          trend="High / Critical"
        />

        <Metric
          label="Active Agents"
          value={activeAgent ? 1 : 4}
          icon="🧠"
          trend="Agent network"
        />

        <Metric
          label="System Status"
          value="Online"
          icon="●"
          trend="All services operational"
        />

      </div>

      <DemoControl
        runScenario={runScenario}
        resetDemo={resetDemo}
        demoRunning={demoRunning}
        scenario={scenario}
      />

      <div className="sectionTitle">

        <div>
          <h2>Agent Network</h2>

          <p>
            Specialized agents collaborate to process each request.
          </p>
        </div>

        <span className="badge blue">
          MULTI-AGENT
        </span>

      </div>

      <div className="card">

        <AgentNetwork
          activeAgent={activeAgent}
          scenario={scenario}
          demoRunning={demoRunning}
        />

      </div>

      <div className="sectionTitle">

        <div>
          <h2>Execution Trace</h2>

          <p>
            Transparent view of how the request moves through agents.
          </p>
        </div>

      </div>

      <div className="grid2">

        <Trace
          trace={trace}
          activeAgent={activeAgent}
        />

        <AlertList
          alerts={alerts}
          resolveAlert={resolveAlert}
          setSelectedAlert={setSelectedAlert}
        />

      </div>

      <div className="sectionTitle">

        <div>
          <h2>Explainability & Human Oversight</h2>

          <p>
            AI assists the care process while humans remain in control.
          </p>
        </div>

      </div>

      <Explainability />

      <div className="sectionTitle">

        <div>
          <h2>System Architecture</h2>

          <p>
            From senior interaction to caregiver action.
          </p>
        </div>

      </div>

      <Architecture />

      <div className="sectionTitle">

        <div>
          <h2>Privacy & Safety</h2>

          <p>
            Designed around responsible AI principles.
          </p>
        </div>

      </div>

      <Privacy />

      <div className="footer">
        <strong>OpenSenior Care</strong> ·
        Decentrack 2.0 · Agentic AI Elderly Care
      </div>

    </div>
  );
}

/* =========================================================
   METRIC
   ========================================================= */

function Metric({
  label,
  value,
  icon,
  trend,
}) {
  return (
    <div className="metric">

      <div className="metricTop">

        <span className="metricLabel">
          {label}
        </span>

        <span className="metricIcon">
          {icon}
        </span>

      </div>

      <div className="metricValue">
        {value}
      </div>

      <div className="metricTrend">
        {trend}
      </div>

    </div>
  );
}

/* =========================================================
   AGENT NETWORK
   ========================================================= */

function AgentNetwork({
  activeAgent,
  scenario,
  demoRunning,
}) {
  let activeRoute = [];

  if (scenario && scenarios[scenario]) {
    activeRoute = scenarios[scenario].route;
  }

  return (
    <div className="agentNetwork">

      {Object.entries(AGENTS).map(
        ([key, agent], index, array) => {

          const isActive =
            activeAgent === key ||
            activeRoute.includes(key);

          return (
            <div
              className={`agentNode ${
                isActive ? "active" : ""
              } ${
                activeAgent === key && demoRunning
                  ? "running"
                  : ""
              }`}
              key={key}
            >

              <div
                className="agentNodeIcon"
                style={{
                  background: `${agent.color}15`,
                }}
              >
                {agent.icon}
              </div>

              <div className="agentNodeName">
                {agent.name}
              </div>

              <div className="agentNodeStatus">

                {activeAgent === key && demoRunning
                  ? "Processing..."
                  : activeRoute.includes(key)
                  ? "In route"
                  : "Standby"}

              </div>

              {index < array.length - 1 && (
                <div className="flowArrow">
                  →
                </div>
              )}

            </div>
          );
        }
      )}

    </div>
  );
}

/* =========================================================
   TRACE
   ========================================================= */

function Trace({
  trace,
  activeAgent,
}) {
  return (
    <div className="card">

      <div className="cardHeader">

        <div>
          <div className="cardTitle">
            Agent Execution
          </div>

          <div className="cardSub">
            Live decision and coordination trace
          </div>
        </div>

        <span className="badge purple">
          LIVE
        </span>

      </div>

      <div className="trace">

        {trace.length === 0 ? (
          <div className="empty">
            Waiting for a demo execution...
          </div>
        ) : (
          trace.map((item) => (

            <div
              className="traceItem"
              key={item.id}
            >

              <div className="traceIcon">
                {AGENTS[item.agent]?.icon || "⚙️"}
              </div>

              <div className="traceText">

                <div className="traceTitle">
                  {item.text}
                </div>

                <div className="traceTime">
                  {item.time}
                </div>

              </div>

              <div
                className={`traceStatus ${
                  item.status === "running"
                    ? "running"
                    : item.status === "completed"
                    ? "completed"
                    : "waiting"
                }`}
              >
                {item.status}
              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}
/* =========================================================
   DEMO CONTROL
   ========================================================= */

function DemoControl({
  runScenario,
  resetDemo,
  demoRunning,
  scenario,
}) {
  return (
    <div className="demoControl">

      <div className="demoInfo">

        <div className="demoIcon">
          ⚡
        </div>

        <div>
          <h3>Live Agentic AI Demo</h3>

          <p>
            Trigger a real-time care scenario and watch the
            multi-agent workflow execute.
          </p>
        </div>

      </div>

      <div className="demoButtons">

        <button
          className="demoBtn emergency"
          onClick={() => runScenario("emergency")}
          disabled={demoRunning}
        >
          🚨 Emergency
        </button>

        <button
          className="demoBtn medicine"
          onClick={() => runScenario("medicine")}
          disabled={demoRunning}
        >
          💊 Medication
        </button>

        <button
          className="demoBtn routine"
          onClick={() => runScenario("routine")}
          disabled={demoRunning}
        >
          📅 Routine
        </button>

        <button
          className="demoBtn reset"
          onClick={resetDemo}
          disabled={demoRunning}
        >
          ↻ Reset
        </button>

      </div>

      {scenario && (
        <div className="scenarioStatus">

          <span>
            Current scenario:
          </span>

          <strong>
            {scenario === "emergency"
              ? "🚨 Emergency"
              : scenario === "medicine"
              ? "💊 Medication"
              : "📅 Routine"}
          </strong>

          {demoRunning && (
            <span className="processing">
              Processing agents...
            </span>
          )}

        </div>
      )}

    </div>
  );
}

/* =========================================================
   ALERT LIST
   ========================================================= */

function AlertList({
  alerts,
  resolveAlert,
  setSelectedAlert,
}) {
  return (
    <div className="card">

      <div className="cardHeader">

        <div>
          <div className="cardTitle">
            Caregiver Alerts
          </div>

          <div className="cardSub">
            Alerts requiring human attention
          </div>
        </div>

        <span className="badge red">
          {alerts.filter((a) => !a.resolved).length} Open
        </span>

      </div>

      <div className="alerts">

        {alerts.length === 0 ? (
          <div className="empty">
            No alerts available.
          </div>
        ) : (

          alerts.map((alert) => (

            <div
              className={`alert ${
                alert.resolved ? "resolved" : ""
              }`}
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
            >

              <div
                className="alertIcon"
                style={{
                  background:
                    alert.level === "critical"
                      ? "#fee2e2"
                      : alert.level === "high"
                      ? "#fff7ed"
                      : "#fef3c7",
                }}
              >
                {alert.icon || "🔔"}
              </div>

              <div className="alertContent">

                <div className="alertTop">

                  <strong>
                    {alert.title}
                  </strong>

                  <span
                    className={`severity ${
                      alert.level
                    }`}
                  >
                    {alert.level}
                  </span>

                </div>

                <p>
                  {alert.description}
                </p>

                <div className="alertMeta">

                  <span>
                    {alert.time}
                  </span>

                  <span>
                    Source: {alert.source}
                  </span>

                </div>

              </div>

              {!alert.resolved && (

                <button
                  className="resolveBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    resolveAlert(alert.id);
                  }}
                >
                  Resolve
                </button>

              )}

            </div>

          ))

        )}

      </div>

    </div>
  );
}

/* =========================================================
   ALERT MODAL
   ========================================================= */

function AlertModal({
  alert,
  onClose,
  resolveAlert,
}) {
  if (!alert) return null;

  return (
    <div
      className="modalOverlay"
      onClick={onClose}
    >

      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="modalHeader">

          <div>

            <span
              className={`severity ${
                alert.level
              }`}
            >
              {alert.level}
            </span>

            <h2>
              {alert.title}
            </h2>

          </div>

          <button
            className="closeBtn"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <div className="modalBody">

          <p>
            {alert.description}
          </p>

          <div className="modalGrid">

            <div className="modalInfo">

              <span>Detected</span>

              <strong>
                {alert.time}
              </strong>

            </div>

            <div className="modalInfo">

              <span>Source Agent</span>

              <strong>
                {alert.source}
              </strong>

            </div>

            <div className="modalInfo">

              <span>Recommended Action</span>

              <strong>
                {alert.action}
              </strong>

            </div>

            <div className="modalInfo">

              <span>Status</span>

              <strong>
                {alert.resolved
                  ? "Resolved"
                  : "Requires Attention"}
              </strong>

            </div>

          </div>

          {!alert.resolved && (

            <div className="modalActions">

              <button
                className="primaryBtn"
                onClick={() => {
                  resolveAlert(alert.id);
                  onClose();
                }}
              >
                ✓ Mark as Resolved
              </button>

              <button
                className="secondaryBtn"
                onClick={onClose}
              >
                Close
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   EXPLAINABILITY
   ========================================================= */

function Explainability() {
  const items = [
    {
      icon: "🔎",
      title: "Intent Detection",
      text:
        "The system identifies what the senior needs from the request.",
    },
    {
      icon: "🧠",
      title: "Agent Routing",
      text:
        "The Router Agent selects the specialized agent required for the task.",
    },
    {
      icon: "🤝",
      title: "Care Coordination",
      text:
        "The Care Coordination Agent connects AI assistance with human caregivers.",
    },
    {
      icon: "👤",
      title: "Human Oversight",
      text:
        "Important situations are escalated instead of allowing AI to act alone.",
    },
  ];

  return (
    <div className="explainGrid">

      {items.map((item) => (

        <div
          className="explainCard"
          key={item.title}
        >

          <div className="explainIcon">
            {item.icon}
          </div>

          <h3>
            {item.title}
          </h3>

          <p>
            {item.text}
          </p>

        </div>

      ))}

    </div>
  );
}

/* =========================================================
   ARCHITECTURE
   ========================================================= */

function Architecture() {
  return (
    <div className="architecture card">

      <div className="architectureStep">

        <div className="architectureIcon">
          👵
        </div>

        <div>
          <strong>Senior User</strong>

          <span>
            Voice / text / emergency interaction
          </span>
        </div>

      </div>

      <div className="architectureArrow">
        →
      </div>

      <div className="architectureStep">

        <div className="architectureIcon">
          🧠
        </div>

        <div>
          <strong>Agent Router</strong>

          <span>
            Understands intent and selects the agent
          </span>
        </div>

      </div>

      <div className="architectureArrow">
        →
      </div>

      <div className="architectureStep">

        <div className="architectureIcon">
          🤖
        </div>

        <div>
          <strong>Specialized Agents</strong>

          <span>
            Health · Emergency · Routine · Care
          </span>
        </div>

      </div>

      <div className="architectureArrow">
        →
      </div>

      <div className="architectureStep">

        <div className="architectureIcon">
          👨‍👩‍👧
        </div>

        <div>
          <strong>Caregiver</strong>

          <span>
            Human receives alert and takes action
          </span>
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   PRIVACY
   ========================================================= */

function Privacy() {
  const items = [
    {
      icon: "🔐",
      title: "Privacy First",
      text:
        "Only necessary care information is considered in the demonstration.",
    },
    {
      icon: "👤",
      title: "Human in the Loop",
      text:
        "Critical decisions are escalated to designated human caregivers.",
    },
    {
      icon: "🛡️",
      title: "Responsible AI",
      text:
        "The system is designed as an assistive care platform, not a replacement for medical professionals.",
    },
    {
      icon: "📋",
      title: "Transparent Actions",
      text:
        "Agent decisions and execution steps are visible through the trace.",
    },
  ];

  return (
    <div className="privacyGrid">

      {items.map((item) => (

        <div
          className="privacyCard"
          key={item.title}
        >

          <div className="privacyIcon">
            {item.icon}
          </div>

          <div>

            <h3>
              {item.title}
            </h3>

            <p>
              {item.text}
            </p>

          </div>

        </div>

      ))}

    </div>
  );
}

/* =========================================================
   EXPORT APP
   ========================================================= */

export default App;