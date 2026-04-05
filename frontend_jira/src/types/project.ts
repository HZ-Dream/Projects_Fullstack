import type { User } from "./auth";

export interface Project {
  id: number;
  name: string;
  creator: User;
}