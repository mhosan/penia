import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LayoutAdmin } from '../layout-admin/layout-admin';
import { AppStateService, Course, GalleryItem, Registration } from '../../services/app-state.service';
import { HISTORY_PARAGRAPHS } from '../../services/app-state.service';

@Component({
  selector: 'app-layout-classic',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LayoutAdmin],
  templateUrl: './layout-classic.html',
  styleUrl: './layout-classic.css',
})

export class LayoutClassic implements OnInit {
  state = inject(AppStateService); //inyecta servicio de estado global para acceder a datos y funciones compartidas

  //el componente usa signals para manejar su eestado interno, como el filtro de la galería, la búsqueda, 
  // y el estado del menú móvil. Estas señales actualizan la interfaz automaticamente cuando cambian.
  galleryFilter = signal<string>('all'); 
  gallerySearch = signal<string>('');
  mobileMenuOpen = signal<boolean>(false);

  showGalleryModal = signal<boolean>(false);
  selectedGalleryItem = signal<GalleryItem | null>(null);

  showInscripcionModal = signal<boolean>(false);
  selectedCourse = signal<Course | null>(null);
  inscripcionForm = signal<{ name: string; email: string; phone: string }>({
    name: '', email: '', phone: ''
  });

  
  historyParagraphs = HISTORY_PARAGRAPHS;

  galleryCategories = ['all', 'Pintura', 'Escultura', 'Cerámica', 'Dibujo', 'Conciertos', 'Talleres'];

  filteredGallery = computed(() => {
    const items = this.state.appData().gallery;
    const filter = this.galleryFilter();
    const search = this.gallerySearch().toLowerCase();
    return items
      .filter(item => filter === 'all' || item.category === filter)
      .filter(item => !search || item.title.toLowerCase().includes(search) || item.artist.toLowerCase().includes(search));
  });

  ngOnInit() {}

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  updateInscripcionField(field: string, value: any) {
    const current = this.inscripcionForm();
    this.inscripcionForm.set({ ...current, [field]: value });
  }

  navigate(view: string) {
    this.state.setClassicView(view);
    this.mobileMenuOpen.set(false);
  }

  openGalleryModal(item: GalleryItem) {
    this.selectedGalleryItem.set(item);
    this.showGalleryModal.set(true);
  }

  closeGalleryModal() {
    this.showGalleryModal.set(false);
    this.selectedGalleryItem.set(null);
  }

  openInscripcionModal(course: Course) {
    this.selectedCourse.set(course);
    this.inscripcionForm.set({ name: '', email: '', phone: '' });
    this.showInscripcionModal.set(true);
  }

  closeInscripcionModal() {
    this.showInscripcionModal.set(false);
    this.selectedCourse.set(null);
  }

  submitInscripcion() {
    const form = this.inscripcionForm();
    const course = this.selectedCourse();
    if (!course || !form.name || !form.email || !form.phone) return;

    const reg: Registration = {
      id: `reg-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      courseId: course.id,
      date: new Date().toISOString().split('T')[0]
    };

    this.state.addRegistration(reg);
    alert(`¡Inscripción al taller "${course.title}" realizada con éxito!`);
    this.closeInscripcionModal();
  }

  getTeacherName(teacherId: string): string {
    const teacher = this.state.appData().teachers.find(t => t.id === teacherId);
    return teacher?.name ?? 'A designar';
  }

  handleContactSubmit(event: Event) {
    event.preventDefault();
    alert('¡Mensaje despachado con éxito a la administración de la Peña!');
    (event.target as HTMLFormElement).reset();
  }
}
