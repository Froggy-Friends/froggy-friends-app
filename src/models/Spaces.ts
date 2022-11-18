export interface ScheduledSpace {
  id: string;
  title: string;
  state: string;
  scheduledStart: string;
  space: Space;
}

export interface Times {
  pst: string;
  est: string;
  gmt: string;
}

export interface Host {
  name: string;
  avatar: string;
  twitterUrl: string;
  twitterHandle: string;
}

export interface Space {
  name: string;
  bannerUrl: string;
  host: Host;
  times: Times;
}

export interface SpacesCalendar {
  monday: Space[];
  tuesday: Space[];
  wednesday: Space[];
  thursday: Space[];
  friday: Space[];
  saturday: Space[];
  sunday: Space[];
}