import { Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Exemplo de uso:
  <input class="form-control" type="text" placeholder="Pesquisar..." autofocus
    appPesquisavel (onPesquisar)="getClientes($event)"
  >
  getClientes(pesquisa?: string) {
    ...
  }
 */
@Directive({
  selector: '[appPesquisavel]'
})
export class PesquisavelDirective implements OnInit, OnDestroy {

  private subscription: Subscription;

  @Output()
  onPesquisar = new EventEmitter<any>();

  constructor(private el: ElementRef) { }
  
  ngOnInit(): void {
    this.subscription = fromEvent<KeyboardEvent>(this.el.nativeElement, 'keyup').pipe(
      map<KeyboardEvent, string>(kbEvent => kbEvent.currentTarget['value']),
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe(pesquisa => this.onPesquisar.emit(pesquisa));
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
