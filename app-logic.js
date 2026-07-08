export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const deriveCognitiveScore = (label, confidence) => {
  const normalizedConfidence = Number.isFinite(confidence)
    ? clamp(confidence, 0, 1)
    : 0;
  const upperLabel = String(label || "").toUpperCase();

  if (upperLabel === "POSITIVE") {
    return Math.round(clamp(50 + normalizedConfidence * 50, 0, 100));
  }

  if (upperLabel === "NEGATIVE") {
    return Math.round(clamp(50 - normalizedConfidence * 50, 0, 100));
  }

  return 50;
};

export const deriveFlowState = (label, confidence) => {
  const upperLabel = String(label || "").toUpperCase();
  const normalizedConfidence = Number.isFinite(confidence)
    ? clamp(confidence, 0, 1)
    : 0;

  if (upperLabel === "POSITIVE" && normalizedConfidence >= 0.75) {
    return { key: "flow", label: "High Resilience / Flow", short: "Flow" };
  }

  if (upperLabel === "NEGATIVE" && normalizedConfidence >= 0.75) {
    return { key: "stress", label: "Elevated Stress", short: "Stress" };
  }

  return {
    key: "baseline",
    label: "Balanced Executive Function",
    short: "Baseline",
  };
};

export const deriveStressState = (score) => {
  const normalizedScore = Number.isFinite(score) ? clamp(score, 10, 100) : 10;

  if (normalizedScore <= 45) {
    return {
      label: "Optimal Autonomic Regulation",
      state: "optimal",
      emoji: "🟢",
    };
  }

  if (normalizedScore <= 75) {
    return { label: "Moderate Arousal", state: "moderate", emoji: "🟡" };
  }

  return { label: "High Vocal Tension", state: "high", emoji: "🚨" };
};

export const deriveIntervention = ({
  sentimentLabel,
  confidence,
  stressScore,
}) => {
  const normalizedConfidence = Number.isFinite(confidence)
    ? clamp(confidence, 0, 1)
    : 0;
  const normalizedStress = Number.isFinite(stressScore)
    ? clamp(stressScore, 10, 100)
    : 10;
  const upperLabel = String(sentimentLabel || "").toUpperCase();

  if (
    upperLabel === "POSITIVE" &&
    normalizedConfidence >= 0.75 &&
    normalizedStress <= 45
  ) {
    return "Deep work recommendation";
  }

  if (
    upperLabel === "POSITIVE" &&
    normalizedConfidence >= 0.75 &&
    normalizedStress > 45
  ) {
    return "Recovery breathing before continuing work";
  }

  if (upperLabel === "NEGATIVE" && normalizedStress > 45) {
    return "Physiological Sigh";
  }

  if (upperLabel === "NEGATIVE" && normalizedStress <= 45) {
    return "Goal-setting exercise";
  }

  return "A brief reset and one clear next action";
};
