import { Component, OnInit } from '@angular/core';
import { Workspace } from '../../../../core/models/workspace.model';
import { WorkspaceService } from '../../workspace.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.scss'],
})
export class WorkspaceListComponent implements OnInit {
  workspaces: Workspace[] = [];
  isLoading = true;
  error: string | null = null;

  viewMode: 'my' | 'all' = 'my';

  currentPage = 1;
  totalPages = 0;
  totalItems = 0;
  limit = 6;

  sortOrder = 'asc';

  constructor(
    private workspaceService: WorkspaceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((urlSegments) => {
      this.viewMode = urlSegments[0]?.path === 'all' ? 'all' : 'my';
      this.fetchWorkspaces(1);
    });
  }

  fetchWorkspaces(page: number): void {
    this.isLoading = true;
    this.error = null;

    const request$ =
      this.viewMode === 'my'
        ? this.workspaceService.getMyWorkspaces(
            page,
            this.limit,
            this.sortOrder
          )
        : this.workspaceService.getAllWorkspaces(
            page,
            this.limit,
            this.sortOrder
          );

    request$.subscribe({
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
    this.fetchWorkspaces(1);
  }
}
