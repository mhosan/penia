import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppStateService, GalleryItem } from '../../services/app-state.service';
import { HISTORY_PARAGRAPHS } from '../../services/app-state.service';

@Component({
  selector: 'app-layout-newspaper',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './layout-newspaper.html',
  styleUrl: './layout-newspaper.css',
})
export class LayoutNewspaper {
  state = inject(AppStateService);
  historyParagraphs = HISTORY_PARAGRAPHS;
  today = new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  showGalleryModal = signal<boolean>(false);
  selectedGalleryItem = signal<GalleryItem | null>(null);

  openGalleryModal(item: GalleryItem) {
    this.selectedGalleryItem.set(item);
    this.showGalleryModal.set(true);
  }

  closeGalleryModal() {
    this.showGalleryModal.set(false);
  }

  handleContactSubmit(event: Event) {
    event.preventDefault();
    alert('¡Su correspondencia fue enviada a la administración de la Peña!');
    (event.target as HTMLFormElement).reset();
  }
}
