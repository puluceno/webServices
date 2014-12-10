var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());
app.use(express.static('src/'));

var shoppingCart = [];

app.get('/cart', function(req, res) {
	res.set({ 'content-type': 'application/json; charset=utf-8' });
	res.json(shoppingCart);
	console.log("Shopping cart: "+shoppingCart);
	console.log('Returning cart with orders...')
});

app.post('/cart', function(req, res) {
	var cartOrder = req.body;
	shoppingCart.push(cartOrder);
	console.log("Shopping cart: "+shoppingCart);
	res.json(shoppingCart);
	console.log('Returning cart with orders...')
});

app.post('/clearCart',function(req,res){
	shoppingCart = [];
	res.json(shoppingCart);
	console.log("Cart empty.");
});

app.post('/mesas/fechar', function(req, res) {
	var pedidos = req.body;
	//todo excluir
	return pedidos;
});

app.listen(3412);
console.log('Listening port 3412...')