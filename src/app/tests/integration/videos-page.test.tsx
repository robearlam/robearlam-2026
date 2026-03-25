import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VideosPageContent } from "@/components/videos/videos-page-content";
import type { VideoEntry } from "@/lib/videos/types";

const videos: VideoEntry[] = [
  { title: "Newest Video", videoId: "new123", date: "2026-03-20" },
  { title: "Second Video", videoId: "sec123", date: "2025-11-14" },
  { title: "Third Video", videoId: "third123", date: "2025-07-02" },
];

describe("videos page content", () => {
  it("renders the newest video as featured and the rest in the supporting grid", () => {
    render(<VideosPageContent videos={videos} />);

    expect(screen.getByTestId("featured-video-card")).toBeInTheDocument();
    expect(screen.getByText("Newest Video")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "More Videos" })).toBeInTheDocument();
    expect(screen.getAllByTestId("video-card")).toHaveLength(2);
  });

  it("does not render the supporting grid for a single video", () => {
    render(<VideosPageContent videos={[videos[0]]} />);

    expect(screen.getByTestId("featured-video-card")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: "More Videos" })).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("video-card")).toHaveLength(0);
  });

  it("renders an accessible empty state when no videos are available", () => {
    render(<VideosPageContent videos={[]} />);

    expect(screen.getByText("No videos available yet. Check back soon for new uploads.")).toBeInTheDocument();
  });

  it("derives iframe titles from the video titles", () => {
    render(<VideosPageContent videos={[videos[0]]} />);

    expect(screen.getByTitle("Newest Video")).toBeInTheDocument();
  });
});
