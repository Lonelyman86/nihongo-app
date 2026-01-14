'use server';

import { courses } from '@/data/content';

export type CourseSummary = {
  id: string;
  title: string;
  level: string;
  description: string;
  unitCount: number;
  chapters: {
    id: string;
    title: string;
    description: string;
    content: { kind?: string }[];
  }[];
};

export async function getCoursesList(): Promise<CourseSummary[]> {
  // Return metadata + lightweight chapter info for roadmap
  return courses.map(c => ({
    id: c.id,
    title: c.title,
    level: c.level,
    description: c.description,
    unitCount: c.chapters.length,
    chapters: c.chapters.map(ch => ({
        id: ch.id,
        title: ch.title,
        description: ch.description,
        content: ch.content.map(i => ({ kind: i.kind })) // Only need kind for tags
    }))
  }));
}
