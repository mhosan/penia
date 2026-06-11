import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import type { AppData } from './app-state.service';

/**********************************************************************
 * Servicio de persistencia abstracto.
 * 
 * Proporciona una interfaz unificada para cargar y guardar datos,
 * permitiendo cambiar entre localStorage y una API sin modificar el
 * resto de la aplicación.
 * Actualmente usa localStorage, pero puede migrar a HTTP fácilmente.
 * 
 * Usa una tabla 'app_data' con una sola fila (id=1) que almacena
 * todo el estado de la aplicación como JSONB.
 * 
 **********************************************************************/
@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  // URL del backend (descomentar y configurar cuando se migre a API)
  // private apiUrl = '/api/app-data';
  private supabase: SupabaseClient;
  private readonly ROW_ID = 1;
  private readonly TABLE = 'app_data';

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  /********************************************************************
   * 
   * Carga los datos de persistencia (localStorage o API).
   * @returns Promesa que resuelve a AppData | null
   * 
   *******************************************************************/
  async load(): Promise<AppData | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.TABLE)
        .select('data')
        .eq('id', this.ROW_ID)
        .single();

      if (error) {
        // PGRST116 = fila no encontrada, no es un error real
        if (error.code === 'PGRST116') return null;
        console.error('Error al cargar datos de Supabase', error);
        return null;
      }

      return data?.data ?? null;
    } catch (e) {
      console.error('Error inesperado al cargar datos', e);
      return null;
    }
  }

  /**********************************************************************
   * 
   * Guarda los datos en Supabase (upsert sobre la fila id=1).
   * @param data Datos a guardar
   * 
   **********************************************************************/
  async save(data: AppData): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(this.TABLE)
        .upsert({ id: this.ROW_ID, data });

      if (error) {
        console.error('Error al guardar datos en Supabase', error);
      }
    } catch (e) {
      console.error('Error inesperado al guardar datos', e);
    }
  }

  /**********************************************************************
   * Limpia los datos eliminando la fila de Supabase.
   **********************************************************************/
  async clear(): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(this.TABLE)
        .delete()
        .eq('id', this.ROW_ID);

      if (error) {
        console.error('Error al limpiar datos en Supabase', error);
      }
    } catch (e) {
      console.error('Error inesperado al limpiar datos', e);
    }
  }
}
