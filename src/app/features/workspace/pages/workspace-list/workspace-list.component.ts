import { Component, OnInit } from '@angular/core';
import { Workspace } from '../../../../core/models/workspace.model';
import { WorkspaceService } from '../../workspace.service';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss'],
})
export class WorkspaceListComponent implements OnInit {
  workspaces: Workspace[] = [];
  isLoading = true;
  error: string | null = null;

  // Pagination state
  currentPage = 1;
  totalPages = 0;
  totalItems = 0;
  limit = 6; // You can adjust this to match your API's default or preference

  sortOrder = 'asc'; // Default sort order

  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    this.fetchWorkspaces(this.currentPage);
  }

  fetchWorkspaces(page: number): void {
    this.isLoading = true;
    this.error = null;
    // Pass the current sortOrder to the service
    this.workspaceService
      .getWorkspaces(page, this.limit, this.sortOrder)
      .subscribe({
        next: (response) => {
          this.workspaces = response.data;
          this.currentPage = response.page;
          this.totalPages = response.totalPages;
          this.totalItems = response.total;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load workspaces. Please try again later.';
          this.isLoading = false;
          console.error(err);
        },
      });
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchWorkspaces(page);
    }
  }

  getPagesArray(): number[] {
    return new Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOrder = selectElement.value;

    // Fetch data from the first page with the new sorting
    this.fetchWorkspaces(1);
  }
}
