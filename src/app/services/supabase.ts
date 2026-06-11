import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  getSocios() {
    return this.supabase
    .from('socios')
    .select('*')
    .order('apellido', { ascending: false });
  }

  crearSocio(socio: { nombre: string; apellido: string }) {
    return this.supabase
    .from('socios')
    .insert(socio);
  }

  eliminarSocio(id: number) {
    return this.supabase
    .from('socios')
    .delete().eq('id', id);
  }

  actualizarSocio(id: number, socio: { nombre: string; apellido: string }) {
    return this.supabase
    .from('socios')
    .update(socio)
    .eq('id', id);
  }


  
}
