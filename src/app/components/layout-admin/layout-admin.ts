import { Component, inject, signal, computed, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService, OrganizationProfile, Authority, Course, Teacher, GalleryItem } from '../../services/app-state.service';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './layout-admin.html',
  styleUrl: './layout-admin.css',
})
export class LayoutAdmin implements OnInit, AfterViewInit {
  state = inject(AppStateService);

  // Tabs
  activeTab = computed(() => this.state.currentAdminTab());

  // Profile form
  profileForm = signal<OrganizationProfile>({ ...this.state.appData().profile });
  profileSaved = signal<boolean>(false);

  // Socios slider
  sociosCount = signal<number>(this.state.appData().stats.activeMembers);
  income = computed(() => this.sociosCount() * this.state.sociosTrimestralFee);
  incomePercent = computed(() => Math.min((this.income() / 1000000) * 100, 100));
  incomeDashoffset = computed(() => {
    const circ = 2 * Math.PI * 35;
    return circ - (this.incomePercent() / 100) * circ;
  });

  // Modals
  showCourseDrawer = signal<boolean>(false);
  showTeacherDrawer = signal<boolean>(false);
  editingCourse = signal<Course | null>(null);
  editingTeacher = signal<Teacher | null>(null);

  courseForm = signal<Course>({ id: '', title: '', teacherId: '', schedule: '', duration: '', description: '', price: '', category: 'Pintura', studentsCount: 0 });
  teacherForm = signal<Teacher>({ id: '', name: '', specialty: '', bio: '', experience: '' });

  ngOnInit() {
    this.profileForm.set({ ...this.state.appData().profile });
    this.sociosCount.set(this.state.appData().stats.activeMembers);
  }

  ngAfterViewInit() {}

  setTab(tab: string) {
    this.state.setAdminTab(tab);
    if (tab === 'profile') {
      this.profileForm.set({ ...this.state.appData().profile });
    }
  }

  updateSociosCount(value: number) {
    this.sociosCount.set(value);
    this.state.updateActiveMembers(value);
  }

  // Form update helpers
  updateProfileField(field: string, value: any) {
    const current = this.profileForm();
    this.profileForm.set({ ...current, [field]: value });
  }

  updateCourseField(field: string, value: any) {
    const current = this.courseForm();
    this.courseForm.set({ ...current, [field]: value });
  }

  updateTeacherField(field: string, value: any) {
    const current = this.teacherForm();
    this.teacherForm.set({ ...current, [field]: value });
  }

  saveProfile(event: Event) {
    event.preventDefault();
    this.state.updateProfile({ ...this.profileForm() });
    this.profileSaved.set(true);
    setTimeout(() => this.profileSaved.set(false), 3000);
  }

  // Autoridades
  addAuthority() {
    const role = prompt('Nuevo Cargo:');
    if (!role) return;
    const name = prompt('Nombre completo:');
    if (!name) return;
    const specialty = prompt('Especialidad/Formación:');
    if (!specialty) return;
    this.state.addAuthority({ role, name, specialty });
  }

  editAuthority(index: number, auth: Authority) {
    const role = prompt('Editar Cargo:', auth.role);
    if (role === null) return;
    const name = prompt('Editar Nombre:', auth.name);
    if (name === null) return;
    const specialty = prompt('Editar Especialidad:', auth.specialty);
    if (specialty === null) return;
    this.state.editAuthority(index, { role, name, specialty });
  }

  deleteAuthority(index: number, auth: Authority) {
    if (confirm(`¿Eliminar a ${auth.name} de la Comisión Directiva?`)) {
      this.state.deleteAuthority(index);
    }
  }

  // Cursos
  openCourseDrawer(course?: Course) {
    if (course) {
      this.courseForm.set({ ...course });
      this.editingCourse.set(course);
    } else {
      this.courseForm.set({ id: `cur-${Date.now()}`, title: '', teacherId: '', schedule: '', duration: '', description: '', price: '', category: 'Pintura', studentsCount: 0 });
      this.editingCourse.set(null);
    }
    this.showCourseDrawer.set(true);
  }

  closeCourseDrawer() { this.showCourseDrawer.set(false); }

  saveCourse(event: Event) {
    event.preventDefault();
    this.state.saveCourse({ ...this.courseForm() });
    this.closeCourseDrawer();
  }

  deleteCourse(id: string) {
    const course = this.state.appData().courses.find(c => c.id === id);
    if (course && confirm(`¿Eliminar el curso "${course.title}"?`)) {
      this.state.deleteCourse(id);
    }
  }

  // Docentes
  openTeacherDrawer(teacher?: Teacher) {
    if (teacher) {
      this.teacherForm.set({ ...teacher });
      this.editingTeacher.set(teacher);
    } else {
      this.teacherForm.set({ id: `doc-${Date.now()}`, name: '', specialty: '', bio: '', experience: '' });
      this.editingTeacher.set(null);
    }
    this.showTeacherDrawer.set(true);
  }

  closeTeacherDrawer() { this.showTeacherDrawer.set(false); }

  saveTeacher(event: Event) {
    event.preventDefault();
    this.state.saveTeacher({ ...this.teacherForm() });
    this.closeTeacherDrawer();
  }

  deleteTeacher(id: string) {
    const teacher = this.state.appData().teachers.find(t => t.id === id);
    if (teacher && confirm(`¿Eliminar al docente "${teacher.name}"?`)) {
      this.state.deleteTeacher(id);
    }
  }

  getTeacherName(teacherId: string): string {
    return this.state.appData().teachers.find(t => t.id === teacherId)?.name ?? 'A designar';
  }



  // Backup
  exportBackup() {
    const dataStr = JSON.stringify(this.state.appData(), null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `penia-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importBackup(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        this.state.importBackup(data);
        alert('¡Base de datos restaurada exitosamente!');
      } catch {
        alert('Error: el archivo no es un JSON válido de la Peña.');
      }
    };
    reader.readAsText(file);
  }

  // Generar datos del gráfico SVG de visitas
  getVisitsChartPath(): string {
    const data = this.state.appData().stats.monthlyVisits;
    const width = 500, height = 160, padding = 30;
    const maxVal = Math.max(...data) * 1.1;
    const points = data.map((val, i) => {
      const x = padding + (i * (width - 2 * padding) / (data.length - 1));
      const y = height - padding - (val * (height - 2 * padding) / maxVal);
      return { x, y };
    });
    return points.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  }

  getVisitsAreaPath(): string {
    const path = this.getVisitsChartPath();
    const data = this.state.appData().stats.monthlyVisits;
    const width = 500, height = 160, padding = 30;
    const lastX = padding + ((data.length - 1) * (width - 2 * padding) / (data.length - 1));
    return `${path} L ${lastX} ${height - padding} L ${padding} ${height - padding} Z`;
  }
}
