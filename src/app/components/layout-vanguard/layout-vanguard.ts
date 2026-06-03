import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppStateService } from '../../services/app-state.service';
import { HISTORY_PARAGRAPHS } from '../../services/app-state.service';

@Component({
  selector: 'app-layout-vanguard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './layout-vanguard.html',
  styleUrl: './layout-vanguard.css',
})
export class LayoutVanguard {
  state = inject(AppStateService);
  historyParagraphs = HISTORY_PARAGRAPHS;
  activeSection = signal<string>('hero');

  radarItems = [
    { label: 'Pintura', value: 90, color: '#f97316' },
    { label: 'Escultura', value: 75, color: '#7c3aed' },
    { label: 'Cerámica', value: 80, color: '#c2410c' },
    { label: 'Dibujo', value: 85, color: '#0ea5e9' },
  ];

  scrollToSection(sectionId: string) {
    this.activeSection.set(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }
}
