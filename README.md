# Unsubscribe de Observables em Angular

  
 A ideia da lib é facilitar o Unsubscribe de Obsevables, Atráves das funções reativas do RXJS e Callbacks de eventos oferecidos pelos Components do Angular.
 
**Requisitos**
- Requisito >= RxJS 6.0.0 (part of Angular 6)
  

**Com Funciona?**  

O próprio Angular oferece um Observable quando um Component é destruído (deixado se ser exibido em tela), e com isso é possível monitorar a ação fora do método ngOnDestroy.

Com este Observable é possível utilizá-lo com funções reativas do próprio RXJS. 
Por exemplo a função takeUntil, que espera o próximo evento de um Observable passado como parâmetro, para se alto desinscrever do Observer que está escutando.

É necessário que seu Component sempre implemente a interface OnDestroy, para garantir a existencia do metod ngOnDestroy.
  

## Exemplo
```

@Component({
	selector: 'foo',
	templateUrl: './foo.component.html'
})
export class FooComponent implements OnInit, OnDestroy {

	constructor(private service: HttpClientService) {
	}

	ngOnInit() {
		this.service.list()
			// o parâmetro this é a referencia da class do
			// component para ser possível monitorar a 
			// ação do destroy
			.pipe(takeUntil(componentDestroyed(this))) // é retorndo um observable para a função takeUntil
			.subscribe();
	}

	ngOnDestroy() {}
}