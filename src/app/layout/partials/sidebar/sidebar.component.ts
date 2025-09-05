import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;

  @Output() linkClicked = new EventEmitter<void>();

  isWorkspaceMenuOpen = false;

  onLinkClicked(): void {
    this.linkClicked.emit();
  }

  toggleWorkspaceMenu(): void {
    this.isWorkspaceMenuOpen = !this.isWorkspaceMenuOpen;
  }
}
