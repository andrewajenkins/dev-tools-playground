import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService, Project } from '../services/project.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  error = '';
  
  // INTENTIONAL FLAW: Dynamic button ID for testing self-healing capabilities
  addProjectButtonId = '';

  columnDefs: ColDef[] = [
    { field: 'projectName', headerName: 'Project Name', sortable: true, filter: true, flex: 1 },
    { 
      field: 'status', 
      headerName: 'Status', 
      sortable: true, 
      filter: true,
      cellRenderer: (params: any) => {
        const status = params.value;
        const cssClass = status.toLowerCase().replace(/\s+/g, '-');
        return `<span class="status-badge status-${cssClass}">${status}</span>`;
      }
    },
    { field: 'lead', headerName: 'Lead', sortable: true, filter: true, flex: 1 },
    { 
      field: 'lastUpdated', 
      headerName: 'Last Updated', 
      sortable: true, 
      filter: true,
      cellRenderer: (params: any) => {
        return new Date(params.value).toLocaleDateString();
      }
    }
  ];

  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
  };

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {
    // INTENTIONAL FLAW: Generate random button ID on each load
    this.addProjectButtonId = `add-project-btn-${Math.floor(Math.random() * 10000)}`;
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = '';

    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load projects. Please try again.';
        this.loading = false;
      }
    });
  }

  onAddProject(): void {
    this.router.navigate(['/add-project']);
  }

  onRefresh(): void {
    this.loadProjects();
  }
} 