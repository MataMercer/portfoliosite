import { Timestamp } from 'firebase/firestore/lite';

export interface IProjectEntry {
  id?: string;
  title: string;
  completionStatus: 'inProgress' | 'onHold' | 'completed';
  introDescription: string;
  description: string;
  repoLink: string;
  demoLink: string;
  tags: { [name: string]: true };
  pictureUrls: string[];
  updatedAt: Timestamp;
}
