import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppStateService, Course, Registration } from '../../services/app-state.service';

@Component({
  selector: 'app-layout-gallerywalk',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './layout-gallerywalk.html',
  styleUrl: './layout-gallerywalk.css',
})
export class LayoutGallerywalk {
  state = inject(AppStateService);

  currentRoom = signal<number>(1);
  showInscripcionModal = signal<boolean>(false);
  selectedCourse = signal<Course | null>(null);
  inscripcionName = signal<string>('');
  inscripcionEmail = signal<string>('');
  inscripcionPhone = signal<string>('');

  rooms = [
    { id: 1, name: 'Sala I', title: 'Recepción e Historia', icon: '🏛️' },
    { id: 2, name: 'Sala II', title: 'Memorial de Maestros', icon: '🖼️' },
    { id: 3, name: 'Sala III', title: 'Salón de Exposición', icon: '🎨' },
    { id: 4, name: 'Sala IV', title: 'Cátedras y Talleres', icon: '📚' },
    { id: 5, name: 'Sala V', title: 'Informes y Salida', icon: '📋' },
  ];

  changeRoom(roomId: number) {
    if (roomId >= 1 && roomId <= this.rooms.length) {
      this.currentRoom.set(roomId);
    }
  }

  openInscripcionModal(course: Course) {
    this.selectedCourse.set(course);
    this.inscripcionName.set('');
    this.inscripcionEmail.set('');
    this.inscripcionPhone.set('');
    this.showInscripcionModal.set(true);
  }

  closeInscripcionModal() {
    this.showInscripcionModal.set(false);
  }

  submitInscripcion() {
    const course = this.selectedCourse();
    if (!course) return;
    const reg: Registration = {
      id: `reg-${Date.now()}`,
      name: this.inscripcionName(),
      email: this.inscripcionEmail(),
      phone: this.inscripcionPhone(),
      courseId: course.id,
      date: new Date().toISOString().split('T')[0]
    };
    this.state.addRegistration(reg);
    alert(`¡Inscripción al taller "${course.title}" realizada con éxito!`);
    this.closeInscripcionModal();
  }

  getTeacherName(teacherId: string): string {
    return this.state.appData().teachers.find(t => t.id === teacherId)?.name ?? 'A designar';
  }
}
