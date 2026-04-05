import type { User } from "./auth";
import type { Project } from "./project";

export interface Task {
  id: number;
  title: string;
  status: string;

  project: Project;
  assignees: User[];
  creator: User;
}