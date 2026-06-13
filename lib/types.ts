import type { GradeScale } from "./grades";

export interface Profile {
  id: string;
  display_name: string | null;
  role: "user" | "owner";
  created_at: string;
}

export interface Boulder {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  location_label: string;
  primary_scale: GradeScale;
  consensus_v_grade: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface BoulderPhoto {
  id: string;
  boulder_id: string;
  storage_path: string;
  user_id: string;
  is_thumbnail: boolean;
  created_at: string;
}

export interface DifficultyRating {
  id: string;
  boulder_id: string;
  user_id: string;
  scale: GradeScale;
  grade_label: string;
  v_equivalent: number;
  created_at: string;
}

export interface Comment {
  id: string;
  boulder_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: Pick<Profile, "display_name"> | null;
}

export interface BoulderWithMeta extends Boulder {
  boulder_photos: BoulderPhoto[];
  difficulty_ratings: DifficultyRating[];
  comments: Comment[];
  distance_km?: number;
}
