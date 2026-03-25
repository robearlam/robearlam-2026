import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { SpeakingEngagement, SpeakingEngagementsByYear } from "@/lib/speaking/types";

const SPEAKING_DATA_ROOT = path.join(process.cwd(), "data", "speaking");

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return false;
  // Reject clearly invalid dates like 2026-13-01
  const d = new Date(parsed);
  const [y, m, day] = value.split("-").map(Number) as [number, number, number];
  return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === m && d.getUTCDate() === day;
}

function toDateString(value: unknown): string | null {
  if (isNonEmptyString(value)) {
    const trimmed = value.trim();
    return isValidDateString(trimmed) ? trimmed : null;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return null;
}

export function normalizeSpeakingEngagement(
  frontmatter: Record<string, unknown>
): SpeakingEngagement | null {
  const name = frontmatter.name;
  const sessionName = frontmatter.sessionName;
  const location = frontmatter.location;

  if (!isNonEmptyString(name) || !isNonEmptyString(sessionName) || !isNonEmptyString(location)) {
    return null;
  }

  const start = toDateString(frontmatter.start);
  if (!start) {
    return null;
  }

  const result: SpeakingEngagement = {
    name: name.trim(),
    sessionName: sessionName.trim(),
    location: location.trim(),
    start,
  };

  if (frontmatter.end !== undefined && frontmatter.end !== null) {
    const end = toDateString(frontmatter.end);
    if (!end) return null;
    if (end < start) return null;
    result.end = end;
  }

  if (frontmatter.slides !== undefined && frontmatter.slides !== null) {
    if (!isNonEmptyString(frontmatter.slides)) return null;
    result.slides = frontmatter.slides.trim();
  }

  if (frontmatter.recording !== undefined && frontmatter.recording !== null) {
    if (!isNonEmptyString(frontmatter.recording)) return null;
    result.recording = frontmatter.recording.trim();
  }

  return result;
}

export function partitionEngagements(
  engagements: SpeakingEngagement[],
  today: string
): { upcoming: SpeakingEngagement[]; past: SpeakingEngagement[] } {
  const upcoming: SpeakingEngagement[] = [];
  const past: SpeakingEngagement[] = [];

  for (const engagement of engagements) {
    if (engagement.start >= today) {
      upcoming.push(engagement);
    } else {
      past.push(engagement);
    }
  }

  return { upcoming, past };
}

export function sortUpcoming(engagements: SpeakingEngagement[]): SpeakingEngagement[] {
  return [...engagements].sort((a, b) => a.start.localeCompare(b.start));
}

export function sortPastByYear(engagements: SpeakingEngagement[]): SpeakingEngagementsByYear[] {
  const sorted = [...engagements].sort((a, b) => b.start.localeCompare(a.start));

  const yearMap = new Map<string, SpeakingEngagement[]>();
  for (const engagement of sorted) {
    const year = engagement.start.slice(0, 4);
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(engagement);
  }

  return [...yearMap.entries()]
    .sort(([yearA], [yearB]) => yearB.localeCompare(yearA))
    .map(([year, yearEngagements]) => ({ year, engagements: yearEngagements }));
}

async function getMarkdownFilesRecursively(directoryPath: string): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(directoryPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return getMarkdownFilesRecursively(fullPath);
      }
      if (entry.isFile() && fullPath.endsWith(".md")) {
        return [fullPath];
      }
      return [];
    })
  );

  return nested.flat();
}

export async function getAllEngagements(): Promise<SpeakingEngagement[]> {
  const files = await getMarkdownFilesRecursively(SPEAKING_DATA_ROOT);

  const results = await Promise.all(
    files.map(async (filePath) => {
      const source = await fs.readFile(filePath, "utf8");
      const parsed = matter(source);
      const engagement = normalizeSpeakingEngagement(parsed.data);
      if (!engagement) {
        console.warn(`Invalid speaking engagement in file: ${filePath}`);
        return null;
      }
      return engagement;
    })
  );

  return results.filter((e): e is SpeakingEngagement => e !== null);
}
