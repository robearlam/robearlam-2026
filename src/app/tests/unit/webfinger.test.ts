import { describe, it, expect } from "vitest";
import { GET } from "@/app/.well-known/webfinger/route";

describe("WebFinger Route Handler", () => {
  it("returns content type application/jrd+json", () => {
    const response = GET();
    expect(response.headers.get("Content-Type")).toBe(
      "application/jrd+json; charset=utf-8",
    );
  });

  it("returns the expected payload structure", async () => {
    const response = GET();
    const body = await response.json();

    expect(body.subject).toBe("acct:RobEarlam@mastodon.social");

    expect(body.aliases).toEqual([
      "https://mastodon.social/@RobEarlam",
      "https://mastodon.social/users/RobEarlam",
    ]);

    expect(body.links).toHaveLength(3);

    expect(body.links[0]).toEqual({
      rel: "http://webfinger.net/rel/profile-page",
      type: "text/html",
      href: "https://mastodon.social/@RobEarlam",
    });

    expect(body.links[1]).toEqual({
      rel: "self",
      type: "application/activity+json",
      href: "https://mastodon.social/users/RobEarlam",
    });

    expect(body.links[2]).toEqual({
      rel: "http://ostatus.org/schema/1.0/subscribe",
      template: "https://mastodon.social/authorize_interaction?uri={uri}",
    });
  });

  it("returns identical response with and without query parameters", async () => {
    const responseWithout = GET();
    const bodyWithout = await responseWithout.json();

    const responseWith = GET();
    const bodyWith = await responseWith.json();

    expect(bodyWith).toEqual(bodyWithout);
  });
});
