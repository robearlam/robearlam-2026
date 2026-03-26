import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { VideosPageContent } from "@/components/videos/videos-page-content";
import { VideosGridClient } from "@/components/videos/videos-grid-client";
import type { VideoEntry } from "@/lib/videos/types";

const videos: VideoEntry[] = [
  { title: "Newest Video", videoId: "new123", date: "2026-03-20" },
  { title: "Second Video", videoId: "sec123", date: "2025-11-14" },
  { title: "Third Video", videoId: "third123", date: "2025-07-02" },
];

const [featuredVideo, ...nonFeaturedVideos] = videos;

describe("videos page content", () => {
  it("renders the newest video as featured and the rest in the supporting grid", () => {
    render(
      <VideosPageContent
        featuredVideo={featuredVideo}
        initialVideos={nonFeaturedVideos}
        initialHasMore={false}
      />
    );

    expect(screen.getByTestId("featured-video-card")).toBeInTheDocument();
    expect(screen.getByText("Newest Video")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "More Videos" })).toBeInTheDocument();
    expect(screen.getAllByTestId("video-card")).toHaveLength(2);
  });

  it("does not render the supporting grid for a single video", () => {
    render(
      <VideosPageContent
        featuredVideo={featuredVideo}
        initialVideos={[]}
        initialHasMore={false}
      />
    );

    expect(screen.getByTestId("featured-video-card")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: "More Videos" })).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("video-card")).toHaveLength(0);
  });

  it("renders an accessible empty state when no videos are available", () => {
    render(
      <VideosPageContent
        featuredVideo={undefined}
        initialVideos={[]}
        initialHasMore={false}
      />
    );

    expect(screen.getByText("No videos available yet. Check back soon for new uploads.")).toBeInTheDocument();
  });

  it("derives iframe titles from the video titles", () => {
    render(
      <VideosPageContent
        featuredVideo={featuredVideo}
        initialVideos={[]}
        initialHasMore={false}
      />
    );

    expect(screen.getByTitle("Newest Video")).toBeInTheDocument();
  });
});

describe("VideosGridClient", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      constructor(public callback: IntersectionObserverCallback) {}
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders initial videos from props", () => {
    render(<VideosGridClient initialVideos={nonFeaturedVideos} initialHasMore={false} />);

    expect(screen.getByText("Second Video")).toBeInTheDocument();
    expect(screen.getByText("Third Video")).toBeInTheDocument();
    expect(screen.getAllByTestId("video-card")).toHaveLength(2);
  });

  it("shows end-of-list message when initialHasMore is false", () => {
    render(<VideosGridClient initialVideos={nonFeaturedVideos} initialHasMore={false} />);

    expect(screen.getByText("You have reached the end of the video feed.")).toBeInTheDocument();
  });

  it("does not show end-of-list message when initialHasMore is true", () => {
    render(<VideosGridClient initialVideos={nonFeaturedVideos} initialHasMore={true} />);

    expect(screen.queryByText("You have reached the end of the video feed.")).not.toBeInTheDocument();
  });

  it("returns null when no videos are provided", () => {
    const { container } = render(<VideosGridClient initialVideos={[]} initialHasMore={false} />);

    expect(container.firstChild).toBeNull();
  });

  it("appends new batch after a successful fetch", async () => {
    const additionalVideo: VideoEntry = { title: "Fourth Video", videoId: "fourth123", date: "2025-01-01" };
    const fetchResponse = {
      ok: true,
      json: async () => ({ videos: [additionalVideo], total: 3, hasMore: false }),
    };
    const fetchMock = vi.fn().mockResolvedValue(fetchResponse);
    vi.stubGlobal("fetch", fetchMock);

    let observerCallback: IntersectionObserverCallback | undefined;
    vi.stubGlobal("IntersectionObserver", class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
    });

    render(<VideosGridClient initialVideos={nonFeaturedVideos} initialHasMore={true} />);

    // Trigger intersection
    observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);

    await waitFor(() => {
      expect(screen.getByText("Fourth Video")).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/api/videos");
  });

  it("does not trigger duplicate fetches on rapid intersection events", async () => {
    // A fetch that never resolves keeps isLoading=true so the in-flight guard can be exercised
    const fetchMock = vi.fn().mockImplementation(() => new Promise<Response>(() => {}));
    vi.stubGlobal("fetch", fetchMock);

    let observerCallback: IntersectionObserverCallback | undefined;
    vi.stubGlobal("IntersectionObserver", class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
    });

    render(<VideosGridClient initialVideos={nonFeaturedVideos} initialHasMore={true} />);

    // Trigger first intersection and let React process the state update (setIsLoading true)
    await act(async () => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    // observerCallback now refers to the new observer created after re-render (isLoading=true in closure)
    // Second intersection should be blocked by the in-flight guard
    await act(async () => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
