const WEBFINGER_PAYLOAD = {
  subject: "acct:RobEarlam@mastodon.social",
  aliases: [
    "https://mastodon.social/@RobEarlam",
    "https://mastodon.social/users/RobEarlam",
  ],
  links: [
    {
      rel: "http://webfinger.net/rel/profile-page",
      type: "text/html",
      href: "https://mastodon.social/@RobEarlam",
    },
    {
      rel: "self",
      type: "application/activity+json",
      href: "https://mastodon.social/users/RobEarlam",
    },
    {
      rel: "http://ostatus.org/schema/1.0/subscribe",
      template: "https://mastodon.social/authorize_interaction?uri={uri}",
    },
  ],
};

export function GET(): Response {
  return new Response(JSON.stringify(WEBFINGER_PAYLOAD), {
    headers: { "Content-Type": "application/jrd+json; charset=utf-8" },
  });
}
