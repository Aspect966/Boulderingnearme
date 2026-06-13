export type GradeScale =
  | "v_scale"
  | "font"
  | "british"
  | "japanese"
  | "yds_boulder";

export interface GradeOption {
  label: string;
  vEquivalent: number;
}

export interface GradeScaleDefinition {
  id: GradeScale;
  name: string;
  shortName: string;
  grades: GradeOption[];
}

const vScaleGrades: GradeOption[] = Array.from({ length: 18 }, (_, i) => ({
  label: `V${i}`,
  vEquivalent: i,
}));

export const GRADE_SCALES: GradeScaleDefinition[] = [
  {
    id: "v_scale",
    name: "V-Scale (Hueco)",
    shortName: "V",
    grades: vScaleGrades,
  },
  {
    id: "font",
    name: "Fontainebleau",
    shortName: "Font",
    grades: [
      { label: "3", vEquivalent: 0 },
      { label: "4", vEquivalent: 1 },
      { label: "4+", vEquivalent: 2 },
      { label: "5", vEquivalent: 3 },
      { label: "5+", vEquivalent: 4 },
      { label: "6A", vEquivalent: 5 },
      { label: "6A+", vEquivalent: 6 },
      { label: "6B", vEquivalent: 7 },
      { label: "6B+", vEquivalent: 8 },
      { label: "6C", vEquivalent: 9 },
      { label: "6C+", vEquivalent: 10 },
      { label: "7A", vEquivalent: 11 },
      { label: "7A+", vEquivalent: 12 },
      { label: "7B", vEquivalent: 13 },
      { label: "7B+", vEquivalent: 14 },
      { label: "7C", vEquivalent: 15 },
      { label: "7C+", vEquivalent: 16 },
      { label: "8A", vEquivalent: 17 },
    ],
  },
  {
    id: "british",
    name: "British Technical",
    shortName: "UK",
    grades: [
      { label: "4a", vEquivalent: 1 },
      { label: "4b", vEquivalent: 2 },
      { label: "4c", vEquivalent: 3 },
      { label: "5a", vEquivalent: 4 },
      { label: "5b", vEquivalent: 5 },
      { label: "5c", vEquivalent: 6 },
      { label: "6a", vEquivalent: 7 },
      { label: "6a+", vEquivalent: 8 },
      { label: "6b", vEquivalent: 9 },
      { label: "6b+", vEquivalent: 10 },
      { label: "6c", vEquivalent: 11 },
      { label: "6c+", vEquivalent: 12 },
      { label: "7a", vEquivalent: 13 },
      { label: "7a+", vEquivalent: 14 },
      { label: "7b", vEquivalent: 15 },
      { label: "7b+", vEquivalent: 16 },
      { label: "7c", vEquivalent: 17 },
    ],
  },
  {
    id: "japanese",
    name: "Japanese (Kyū/Dan)",
    shortName: "JP",
    grades: [
      { label: "7 Kyū", vEquivalent: 0 },
      { label: "6 Kyū", vEquivalent: 1 },
      { label: "5 Kyū", vEquivalent: 2 },
      { label: "4 Kyū", vEquivalent: 3 },
      { label: "3 Kyū", vEquivalent: 4 },
      { label: "2 Kyū", vEquivalent: 5 },
      { label: "1 Kyū", vEquivalent: 6 },
      { label: "1 Dan", vEquivalent: 8 },
      { label: "2 Dan", vEquivalent: 10 },
      { label: "3 Dan", vEquivalent: 12 },
      { label: "4 Dan", vEquivalent: 14 },
      { label: "5 Dan", vEquivalent: 16 },
    ],
  },
  {
    id: "yds_boulder",
    name: "YDS (Boulder)",
    shortName: "YDS",
    grades: [
      { label: "V0", vEquivalent: 0 },
      { label: "V1", vEquivalent: 1 },
      { label: "V2", vEquivalent: 2 },
      { label: "V3", vEquivalent: 3 },
      { label: "V4", vEquivalent: 4 },
      { label: "V5", vEquivalent: 5 },
      { label: "V6", vEquivalent: 6 },
      { label: "V7", vEquivalent: 7 },
      { label: "V8", vEquivalent: 8 },
      { label: "V9", vEquivalent: 9 },
      { label: "V10", vEquivalent: 10 },
      { label: "V11", vEquivalent: 11 },
      { label: "V12", vEquivalent: 12 },
      { label: "V13", vEquivalent: 13 },
      { label: "V14", vEquivalent: 14 },
      { label: "V15", vEquivalent: 15 },
      { label: "V16", vEquivalent: 16 },
      { label: "V17", vEquivalent: 17 },
    ],
  },
];

export const DEFAULT_SCALE: GradeScale = "v_scale";

export function getScaleDefinition(scale: GradeScale): GradeScaleDefinition {
  return GRADE_SCALES.find((s) => s.id === scale) ?? GRADE_SCALES[0];
}

export function getGradeOption(
  scale: GradeScale,
  label: string
): GradeOption | undefined {
  return getScaleDefinition(scale).grades.find((g) => g.label === label);
}

export function vToGradeLabel(v: number, scale: GradeScale = DEFAULT_SCALE): string {
  const grades = getScaleDefinition(scale).grades;
  let closest = grades[0];
  let minDiff = Infinity;

  for (const grade of grades) {
    const diff = Math.abs(grade.vEquivalent - v);
    if (diff < minDiff) {
      minDiff = diff;
      closest = grade;
    }
  }

  return closest.label;
}

export function formatConsensusGrade(
  vGrade: number | null,
  scale: GradeScale = DEFAULT_SCALE
): string {
  if (vGrade === null) return "Unrated";
  return vToGradeLabel(vGrade, scale);
}

/** Client-side preview of consensus calculation (DB trigger is source of truth). */
export function calculateConsensusGrade(grades: number[]): number | null {
  if (grades.length === 0) return null;
  if (grades.length === 1) return grades[0];
  if (grades.length === 2) {
    return Math.round((grades[0] + grades[1]) / 2);
  }

  const sorted = [...grades].sort((a, b) => a - b);
  const q1 = percentile(sorted, 0.25);
  const q3 = percentile(sorted, 0.75);
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;

  const filtered = grades.filter((g) => g >= lower && g <= upper);
  const values = filtered.length > 0 ? filtered : grades;
  const avg = values.reduce((sum, g) => sum + g, 0) / values.length;

  return Math.round(avg);
}

function percentile(sorted: number[], p: number): number {
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}
