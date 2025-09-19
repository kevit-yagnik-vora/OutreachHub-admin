import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Workspace,
  PaginatedResponse,
  WorkspaceOwner,
} from '../../core/models/workspace.model';

export interface WorkspaceDetailResponse {
  workspace: Workspace;
  users: WorkspaceOwner[];
}
@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private apiUrl = `${environment.apiUrl}/workspace`;

  constructor(private http: HttpClient) {}
  getMyWorkspaces(
    page: number,
    limit: number,
    order: string
  ): Observable<PaginatedResponse<Workspace>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('order', order);

    const data = this.http.get<PaginatedResponse<Workspace>>(
      `${this.apiUrl}/my`,
      {
        params,
      }
    );
    return data;
  }

  getAllWorkspaces(
    page: number,
    limit: number,
    order: string
  ): Observable<PaginatedResponse<Workspace>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (order) {
      params = params.set('order', order);
    }
    return this.http.get<PaginatedResponse<Workspace>>(`${this.apiUrl}/all`, {
      params,
    });
  }

  createWorkspace(data: {
    name: string;
    description?: string;
  }): Observable<Workspace> {
    return this.http.post<Workspace>(`${this.apiUrl}/createWorkspace`, data);
  }

  addUserToWorkspace(
    workspaceId: string,
    data: { email: string; role: string; name?: string; phoneNumber?: string }
  ): Observable<any> {
    const url = `${this.apiUrl}/${workspaceId}/users`;
    return this.http.post(url, data);
  }

  getWorkspaceById(id: string): Observable<WorkspaceDetailResponse> {
    return this.http.get<WorkspaceDetailResponse>(`${this.apiUrl}/${id}`);
  }

  updateWorkspace(
    id: string,
    data: { name?: string; description?: string }
  ): Observable<Workspace> {
    return this.http.put<Workspace>(`${this.apiUrl}/${id}`, data);
  }

  removeUserFromWorkspace(
    workspaceId: string,
    userId: string
  ): Observable<any> {
    const url = `${this.apiUrl}/${workspaceId}/users/${userId}`;
    return this.http.delete(url);
  }

  updateUserRole(
    workspaceId: string,
    userId: string,
    role: string
  ): Observable<any> {
    const url = `${this.apiUrl}/${workspaceId}/users/${userId}`;
    return this.http.patch(url, { role });
  }
}
