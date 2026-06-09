import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { AppData } from './app-state.service';

/**********************************************************************
 * Servicio de persistencia abstracto.
 * 
 * Proporciona una interfaz unificada para cargar y guardar datos,
 * permitiendo cambiar entre localStorage y una API sin modificar el
 * resto de la aplicación.
 * Actualmente usa localStorage, pero puede migrar a HTTP fácilmente.
 * 
 **********************************************************************/
@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  // URL del backend (descomentar y configurar cuando se migre a API)
  private apiUrl = '/api/app-data';

  constructor(private http: HttpClient) {}

  /********************************************************************
   * 
   * Carga los datos de persistencia (localStorage o API).
   * @returns Promesa que resuelve a AppData | null
   * 
   *******************************************************************/
  async load(): Promise<AppData | null> {
    try {
      // Descomentar para usar API backend:
      // return await firstValueFrom(this.http.get<AppData>(this.apiUrl));

      // Actualmente usa localStorage
      const dataStr = localStorage.getItem('penia-app-data');
      return dataStr ? JSON.parse(dataStr) : null;
    } catch (e) {
      console.error('Error al cargar datos de persistencia', e);
      return null;
    }
  }

  /**********************************************************************
   * 
   * Guarda los datos en persistencia (localStorage o API).
   * @param data Datos a guardar
   * 
   **********************************************************************/
  async save(data: AppData): Promise<void> {
    try {
      // Descomentar para usar API backend:
      // await firstValueFrom(this.http.put(this.apiUrl, data));

      // Actualmente usa localStorage
      localStorage.setItem('penia-app-data', JSON.stringify(data));
    } catch (e) {
      console.error('Error al guardar datos en persistencia', e);
    }
  }

  /**********************************************************************
   * 
   * Limpia los datos de persistencia (para logout, reset, etc).
   * 
   **********************************************************************/
  async clear(): Promise<void> {
    try {
      // Descomentar para usar API backend:
      // await firstValueFrom(this.http.delete(this.apiUrl));

      // Actualmente usa localStorage
      localStorage.removeItem('penia-app-data');
    } catch (e) {
      console.error('Error al limpiar datos de persistencia', e);
    }
  }
}
