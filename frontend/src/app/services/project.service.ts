import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id: string;
  projectName: string;
  status: string;
  lead: string;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects/`);
  }

  createProject(project: { projectName: string; status: string; lead: string }): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects/create/`, project);
  }
} 