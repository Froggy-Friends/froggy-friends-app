export type SpaceDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Space {
  host: string;
  hostAvatar: string;
  twitter: string;
  name: string;
  day: SpaceDay;
  timePST: string;
  timeEST: string;
  timeBST: string;
  timeAEST: string;
}