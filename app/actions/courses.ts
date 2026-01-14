'use server';

import { courses } from '@/data/content';

export type CourseSummary = {
  id: string;
  title: string;
  level: string;
  description: string;
  unitCount: number;
};

export async function getCoursesList(): Promise<CourseSummary[]> {
  // Return only metadata, not the heavy content
  return courses.map(c => ({
    id: c.id,
    title: c.title,
    level: c.level,
    description: c.description,
    unitCount: c.chapters.length,
  }));
}
