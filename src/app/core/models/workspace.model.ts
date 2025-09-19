export interface WorkspaceOwner {
  _id: string;
  name: string;
  email: string;
  role?: 'Editor' | 'Viewer' | 'N/A';
}

export interface Workspace {
  _id: string;
  name: string;
  description: string;
  createdBy: WorkspaceOwner;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
