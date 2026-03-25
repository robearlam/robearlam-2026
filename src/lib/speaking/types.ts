export type SpeakingEngagement = {
  name: string;
  sessionName: string;
  location: string;
  start: string;
  end?: string;
  slides?: string;
  recording?: string;
};

export type SpeakingEngagementsByYear = {
  year: string;
  engagements: SpeakingEngagement[];
};
