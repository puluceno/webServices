describe('Testando o restaurante...', function() {
	it("Deve retornar os itens do cardápio", function() {
		var cardapio = restaurante.listarCardapio();
		expect(cardapio.length).toBe(3);
		expect(cardapio[1].nome).toBe('X-Salada');
	});
	it("Deve fazer pedidos informando a mesa, quantidade e o item", function() {
		var cardapio = restaurante.listarCardapio();
		restaurante.fazerPedido({mesa: 2, item: cardapio[1], quantidade: 2});
		restaurante.fazerPedido({mesa: 2, item: cardapio[2], quantidade: 1});
		expect(restaurante.visualizarPedidos().length).toBe(2);
	});
	it("Deve consultar o total da conta informando a mesa, retornando o total da conta", function() {
		var total = restaurante.totalContaMesa(2);
		expect(total).toBe(32.59);
	});
	it("Deve fechar a conta informando a mesa, retornando o total da conta e apagando todos os pedidos feitos", function() {
		var total = restaurante.fecharMesa(2);
		expect(restaurante.visualizarPedidos().length).toBe(0);
	});
});