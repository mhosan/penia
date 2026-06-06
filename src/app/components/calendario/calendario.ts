import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Evento {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  speaker: string;
  description: string;
}

const EVENTOS_DATA: Evento[] = [
  { id: 'evt-1', title: 'Apertura del Salón de Otoño', category: 'Pintura', date: '2026-05-10', time: '19:00 hs', location: 'Salón Ambrosio Aliverti', speaker: 'Junta de Artistas de la Peña', description: 'Gran exposición colectiva anual donde nuestros socios exponen sus óleos, acuarelas y grabados inspirados en la estación otoñal. Se servirá un vino de honor en la inauguración.' },
  { id: 'evt-2', title: 'Charla de Restauración Artística', category: 'Charlas', date: '2026-05-15', time: '18:00 hs', location: 'Salón Multiuso de la Peña', speaker: 'Dra. Dolores López Rosales', description: 'Una conferencia magistral sobre la preservación de pinturas al óleo antiguas y el rescate de patrimonio cultural histórico en la Provincia de Buenos Aires.' },
  { id: 'evt-3', title: 'Concierto de Cámara: Clásicos Platenses', category: 'Conciertos', date: '2026-05-22', time: '20:00 hs', location: 'Auditorio Principal de la Sede', speaker: 'Quinteto de Vientos de la UNLP', description: 'Presentación musical en vivo interpretando composiciones clásicas locales y nacionales en conmemoración de la música de cámara del siglo XX.' },
  { id: 'evt-4', title: 'Café Literario y Lectura de Poesía', category: 'Literatura', date: '2026-05-28', time: '19:00 hs', location: 'Galería de los Socios', speaker: 'Dra. Silvina Palermo (Presidente)', description: 'Un encuentro ameno y participativo para compartir poemas, escritos y relatos breves junto a una infusión caliente en nuestra galería central.' },
  { id: 'evt-5', title: 'Salón de Grabado: Homenaje a Cleto Ciocchini', category: 'Pintura', date: '2026-06-05', time: '19:30 hs', location: 'Sala de Exposiciones 1', speaker: 'Prof. Amelia San Martín', description: 'Exhibición especial dedicada a la obra del maestro grabador Cleto Ciocchini, histórico integrante de la Peña que plasmó la vida costera bonaerense.' },
  { id: 'evt-6', title: 'Demostración de Torno Alfarero en Vivo', category: 'Cerámica', date: '2026-06-12', time: '17:00 hs', location: 'Taller de Alfarería y Escultura', speaker: 'Lic. Valeria Rosales', description: 'Clase abierta e interactiva donde se mostrarán técnicas de centrado, modelado veloz en torno y la composición de piezas cerámicas tradicionales.' },
  { id: 'evt-7', title: 'Acto Central: 90° Aniversario de la Peña', category: 'Especiales', date: '2026-06-20', time: '18:00 hs', location: 'Edificio Central de la Peña', speaker: 'Comisión Directiva', description: 'Celebración por las casi nueve décadas de fomento y difusión cultural en La Plata. Palabras de la Presidente, recorrido histórico especial y brindis.' },
  { id: 'evt-8', title: 'Seminario de Acuarela al Aire Libre', category: 'Talleres', date: '2026-06-26', time: '14:00 hs', location: 'Paseo del Bosque de La Plata', speaker: 'Prof. Carlos Aliverti', description: 'Taller práctico intensivo para pintar paisajes naturales con acuarelas aprovechando las luces de la tarde platense.' },
];

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario {
  selectedMonth = signal<number>(new Date().getMonth());
  selectedYear = signal<number>(new Date().getFullYear());
  currentFilter = signal<string>('all');
  selectedEvent = signal<Evento | null>(null);
  showModal = signal<boolean>(false);

  today = new Date();

  monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  weekdays = ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'];
  categories = ['all','Pintura','Escultura','Cerámica','Conciertos','Literatura','Talleres','Especiales','Charlas'];

  monthDisplay = computed(() => `${this.monthNames[this.selectedMonth()]} ${this.selectedYear()}`);

  calendarDays = computed(() => {
    const year = this.selectedYear();
    const month = this.selectedMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: Array<{day: number; isCurrentMonth: boolean; isToday: boolean; events: Evento[]}> = [];

    for (let i = startOffset; i > 0; i--) {
      days.push({ day: prevMonthDays - i + 1, isCurrentMonth: false, isToday: false, events: [] });
    }
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isToday = year === this.today.getFullYear() && month === this.today.getMonth() && d === this.today.getDate();
      const filter = this.currentFilter();
      const events = EVENTOS_DATA.filter(e => e.date === dateStr && (filter === 'all' || e.category === filter));
      days.push({ day: d, isCurrentMonth: true, isToday, events });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, isCurrentMonth: false, isToday: false, events: [] });
    }
    return days;
  });

  monthlyEvents = computed(() => {
    const year = this.selectedYear();
    const month = this.selectedMonth();
    const filter = this.currentFilter();
    return EVENTOS_DATA
      .filter(e => {
        const parts = e.date.split('-');
        return parseInt(parts[0]) === year && parseInt(parts[1]) - 1 === month && (filter === 'all' || e.category === filter);
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  prevMonth() {
    if (this.selectedMonth() === 0) { this.selectedMonth.set(11); this.selectedYear.update(y => y - 1); }
    else this.selectedMonth.update(m => m - 1);
  }

  nextMonth() {
    if (this.selectedMonth() === 11) { this.selectedMonth.set(0); this.selectedYear.update(y => y + 1); }
    else this.selectedMonth.update(m => m + 1);
  }

  openModal(event: Evento) {
    this.selectedEvent.set(event);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedEvent.set(null);
  }

  formatDate(dateStr: string): string {
    const parts = dateStr.split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]))
      .toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatShortDate(dateStr: string): string {
    const parts = dateStr.split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]))
      .toLocaleDateString('es-AR', { month: 'short', day: 'numeric' });
  }

  getCatClass(category: string): string {
    const map: Record<string,string> = {
      'Pintura': 'event-painting', 'Escultura': 'event-sculpture',
      'Cerámica': 'event-ceramics', 'Conciertos': 'event-music',
      'Literatura': 'event-literature', 'Talleres': 'event-special',
      'Especiales': 'event-special', 'Charlas': 'event-special'
    };
    return map[category] ?? 'event-special';
  }
}
