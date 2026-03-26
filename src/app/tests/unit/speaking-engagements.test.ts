import { describe, expect, it } from "vitest";
import {
  getAllEngagements,
  getUpcomingEngagements,
  normalizeSpeakingEngagement,
  partitionEngagements,
  sortUpcoming,
  sortPastByYear,
} from "@/lib/speaking/engagements";
import type { SpeakingEngagement } from "@/lib/speaking/types";

// ─── normalizeSpeakingEngagement ───────────────────────────────────────────────

describe("normalizeSpeakingEngagement", () => {
  it("returns null when name is missing", () => {
    expect(
      normalizeSpeakingEngagement({ sessionName: "Talk", location: "Online", start: "2026-01-01" })
    ).toBeNull();
  });

  it("returns null when sessionName is missing", () => {
    expect(
      normalizeSpeakingEngagement({ name: "Conf", location: "Online", start: "2026-01-01" })
    ).toBeNull();
  });

  it("returns null when location is missing", () => {
    expect(
      normalizeSpeakingEngagement({ name: "Conf", sessionName: "Talk", start: "2026-01-01" })
    ).toBeNull();
  });

  it("returns null when start is missing", () => {
    expect(
      normalizeSpeakingEngagement({ name: "Conf", sessionName: "Talk", location: "Online" })
    ).toBeNull();
  });

  it("returns null for an invalid start date string", () => {
    expect(
      normalizeSpeakingEngagement({
        name: "Conf",
        sessionName: "Talk",
        location: "Online",
        start: "not-a-date",
      })
    ).toBeNull();
  });

  it("returns null for a start date with an invalid month (2026-13-01)", () => {
    expect(
      normalizeSpeakingEngagement({
        name: "Conf",
        sessionName: "Talk",
        location: "Online",
        start: "2026-13-01",
      })
    ).toBeNull();
  });

  it("returns null when end is earlier than start", () => {
    expect(
      normalizeSpeakingEngagement({
        name: "Conf",
        sessionName: "Talk",
        location: "Online",
        start: "2026-06-10",
        end: "2026-06-09",
      })
    ).toBeNull();
  });

  it("returns a valid object when all required fields are provided and optional fields are absent", () => {
    const result = normalizeSpeakingEngagement({
      name: "Conf",
      sessionName: "Talk",
      location: "London, UK",
      start: "2026-06-10",
    });
    expect(result).not.toBeNull();
    expect(result?.name).toBe("Conf");
    expect(result?.sessionName).toBe("Talk");
    expect(result?.location).toBe("London, UK");
    expect(result?.start).toBe("2026-06-10");
    expect(result?.end).toBeUndefined();
    expect(result?.slides).toBeUndefined();
    expect(result?.recording).toBeUndefined();
  });

  it("returns a valid object when all fields including optional ones are provided", () => {
    const result = normalizeSpeakingEngagement({
      name: "React Summit",
      sessionName: "Building Next.js Apps",
      location: "Amsterdam",
      start: "2026-06-18",
      end: "2026-06-19",
      slides: "https://example.com/slides",
      recording: "https://example.com/video",
    });
    expect(result).not.toBeNull();
    expect(result?.end).toBe("2026-06-19");
    expect(result?.slides).toBe("https://example.com/slides");
    expect(result?.recording).toBe("https://example.com/video");
  });

  it("accepts Date objects from gray-matter YAML parsing", () => {
    const result = normalizeSpeakingEngagement({
      name: "Conf",
      sessionName: "Talk",
      location: "Online",
      start: new Date("2026-06-10T00:00:00Z"),
    });
    expect(result).not.toBeNull();
    expect(result?.start).toBe("2026-06-10");
  });
});

// ─── partitionEngagements ──────────────────────────────────────────────────────

describe("partitionEngagements", () => {
  const engagements: SpeakingEngagement[] = [
    { name: "A", sessionName: "S", location: "L", start: "2026-01-01" },
    { name: "B", sessionName: "S", location: "L", start: "2025-01-01" },
    { name: "C", sessionName: "S", location: "L", start: "2025-06-15" },
  ];

  it("places future engagements in upcoming and past ones in past", () => {
    const { upcoming, past } = partitionEngagements(engagements, "2025-12-31");
    expect(upcoming.map((e) => e.name)).toEqual(["A"]);
    expect(past.map((e) => e.name)).toEqual(["B", "C"]);
  });

  it("treats start date equal to today as upcoming", () => {
    const { upcoming } = partitionEngagements(engagements, "2026-01-01");
    expect(upcoming.map((e) => e.name)).toContain("A");
  });
});

// ─── sortUpcoming ──────────────────────────────────────────────────────────────

describe("sortUpcoming", () => {
  it("sorts engagements ascending by start date", () => {
    const input: SpeakingEngagement[] = [
      { name: "B", sessionName: "S", location: "L", start: "2026-06-01" },
      { name: "A", sessionName: "S", location: "L", start: "2026-04-01" },
      { name: "C", sessionName: "S", location: "L", start: "2026-08-01" },
    ];
    const sorted = sortUpcoming(input);
    expect(sorted.map((e) => e.name)).toEqual(["A", "B", "C"]);
  });

  it("preserves source-list order for engagements with identical start dates", () => {
    const input: SpeakingEngagement[] = [
      { name: "B", sessionName: "S", location: "L", start: "2026-06-01" },
      { name: "A", sessionName: "S", location: "L", start: "2026-06-01" },
    ];
    const sorted = sortUpcoming(input);
    expect(sorted.map((e) => e.name)).toEqual(["B", "A"]);
  });
});

// ─── sortPastByYear ────────────────────────────────────────────────────────────

describe("sortPastByYear", () => {
  it("returns year groups sorted descending by year", () => {
    const input: SpeakingEngagement[] = [
      { name: "A", sessionName: "S", location: "L", start: "2024-06-01" },
      { name: "B", sessionName: "S", location: "L", start: "2025-03-01" },
      { name: "C", sessionName: "S", location: "L", start: "2025-10-01" },
    ];
    const groups = sortPastByYear(input);
    expect(groups.map((g) => g.year)).toEqual(["2025", "2024"]);
  });

  it("sorts engagements within each year group descending by start date", () => {
    const input: SpeakingEngagement[] = [
      { name: "A", sessionName: "S", location: "L", start: "2025-03-01" },
      { name: "B", sessionName: "S", location: "L", start: "2025-10-01" },
    ];
    const groups = sortPastByYear(input);
    const group2025 = groups.find((g) => g.year === "2025");
    expect(group2025?.engagements.map((e) => e.name)).toEqual(["B", "A"]);
  });
});

// ─── getUpcomingEngagements ────────────────────────────────────────────────────

describe("getUpcomingEngagements (file-backed integration)", () => {
  it("returns empty array when asOf date is far in the future", async () => {
    const result = await getUpcomingEngagements(new Date("2099-12-31T00:00:00Z"));
    expect(result).toHaveLength(0);
  });

  it("returns all engagements when asOf date is far in the past, sorted ascending by start", async () => {
    const all = await getAllEngagements();
    const result = await getUpcomingEngagements(new Date("2000-01-01T00:00:00Z"));
    expect(result).toHaveLength(all.length);
    if (result.length > 1) {
      expect(result[0]!.start <= result[1]!.start).toBe(true);
    }
  });
});
