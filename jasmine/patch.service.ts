import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class PatchService {

  private _isPatchHabilitado: boolean;
  private _isNovosPatchesStatupExecuted = false;
  private _lastPatches: PatchDisponivel[] = [];
  private novosPatchesSubject = new Subject<PatchDisponivel[]>();
  erroComunicacaoSubject = new Subject<any>();

  constructor(private http: HttpClient) { }

  isPatchHabilitado(): Observable<boolean> {
    const url = `${API}/patch/is-habilitado`;
    const subject = new Subject<boolean>();
    this.http.get<IsPatchServiceHabilitado>(url).subscribe(resp => {
      this._isPatchHabilitado = resp.isHabilitado;
      subject.next(resp.isHabilitado);
    });
    return subject.asObservable();
  }

  isPatchHabilitadoAsync(): boolean {
    return this._isPatchHabilitado;
  }

  getNovosPatchesObservable(): Observable<PatchDisponivel[]> {
    return this.novosPatchesSubject.asObservable();
  }

  getNovosPatches(): Observable<PatchDisponivel[]> {
    const url = `${API}/patch/versoes-disponiveis`;
    this._isNovosPatchesStatupExecuted = true;
    this.http.get<PatchDisponivel[]>(url).subscribe(patches => {
      this._lastPatches = patches;
      this.novosPatchesSubject.next(patches);
    });
    return this.getNovosPatchesObservable();
  }

  isNovosPatchesStatupExecuted(): boolean {
    return this._isNovosPatchesStatupExecuted;
  }

  getLastPatches(): PatchDisponivel[] {
    return this._lastPatches;
  }

  iniciarDowload(): Observable<void> {
    const url = `${API}/patch/download-versoes-disponiveis`;
    return this.http.post<void>(url, {});
  }

  isDownloadComplete(): Observable<IsDownloadPatchesCompleto> {
    const url = `${API}/patch/is-download-completo`;
    return this.http.get<IsDownloadPatchesCompleto>(url);
  }

  getErroComunicacaoObservable(): Observable<any> {
    return this.erroComunicacaoSubject.asObservable();
  }

  notificarErroComunicacao() {
    this.erroComunicacaoSubject.next();
  }

}

export class IsPatchServiceHabilitado {
  isHabilitado: boolean;
}

export class IsDownloadPatchesCompleto {
  isCompleto: boolean;
}

export class PatchDisponivel {
  Id: string;
  ImpactoAtualizacao: string;
  TempoEstimadoAtualizacao: string;
  Versao: string;
}
