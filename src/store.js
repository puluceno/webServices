var app = angular.module('store', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider.when('/books', {templateUrl:'books.html', controller:'StoreCtrl'});
	$routeProvider.when('/status', {templateUrl:'status.html', controller:'StoreCtrl'});
	$routeProvider.when('/checkout', {templateUrl:'checkout.html', controller:'StoreCtrl'});
	$routeProvider.otherwise({ redirectTo: '/books' })
});

app.controller('StoreCtrl', function($scope, $http, $routeParams, $location) {

	$scope.active = '/books';
	//$scope.$apply();

	var store = function(){
		var books = [];
		var cart = [];

		var _listBooks = function(){
			return books;
		};

		var _createOrder = function(userCart){
			var placeOrder=angular.copy($scope.order);
			placeOrder.bookList = userCart;
			placeOrder.payment["amount"]=store.totalCartValue().toFixed(2);

			for(var i=0;i<placeOrder.bookList.length;i++){
				delete placeOrder.bookList[i].links;
			}

			console.log(placeOrder);

			$http.post("http://puluceno.com/project/rest/orders",placeOrder).success(function(response){
				console.log("success");
				console.log(response);
				$scope.orderPlaced = response;
				alert("Order placed.");
				store.clearCart();
				$scope.active = '/books';
				$location.path('/books');
			});
		};

		var _viewCart = function(){
			var userCart = [];
			for(var i=0; i<cart.length; i++) {
					userCart.push(cart[i]);
			}
			return userCart;
		};

		var _cancelOrder = function(order){
			console.log(order);
			for(var i=0;i<order.links.length;i++){
				if(order.links[i].rel=='cancel'){
					console.log(order.links[i]);
					$http.delete(order.links[i].href,{}).success(function(response){
						console.log(response);
						store.doLogin();
					});
				}
			}
		};

		var _checkOrderStatus = function(res){
			for(var i=0;i<res.links.length;i++){
				if(links[i].rel='status'){
					$http.get(links[i].href).success(function(response){
						console.log(response);
						return status;
					});
				}
			}
			return status;
		}

		var _clearCart = function(){
			cart = [];
			$http.post('/clearCart');
		}

		var _totalCartValue = function(){
			var total = 0;
			for(var i=0; i<cart.length; i++){
				total += cart[i].price;
			}
			return total;
		};

		var _addToCart = function(cartOrder){
			console.log("Added "+cartOrder.title+" to cart.");
			$http.post('/cart',cartOrder).success(function(response){
				cart = response;
				delete $scope.cartOrder;
			});
		};

		var _setBooks = function(bookList){
			books = bookList;
		}

		var _setCart = function(shoppingCart){
			cart = shoppingCart;
		}

		var _orderNow = function(book){
			for(var i =0; i<book.links.length; i++){
				if(book.links[i].rel=="order"){

				}
			}
		}

		var _getDescription = function(link){
			var linkz = angular.copy(link);
				if(linkz.rel=="description"){
					$http.get(linkz.href).success(function(response){
						return response.description;
					});
				}	
		}

		var _doLogin = function(){
			var userLogin = angular.copy($scope.login);
			$http.get('http://puluceno.com/project/rest/customers/'+userLogin).success(
				function(response){
					console.log(response);
					for(var i=0;i<response.links.length;i++){
						if(response.links[i].rel=="orders"){
							$http.get(response.links[i].href).success(function(response){
								$scope["userOrders"]=response;
							});
						}
					}
				});
		}

		var _getUserOrders = function(){
			console.log($scope.userOrders);
			return $scope.userOrders;
		}

		return{
			listBooks: _listBooks,
			createOrder: _createOrder,
			viewCart: _viewCart,
			cancelOrder: _cancelOrder,
			totalCartValue: _totalCartValue,
			addToCart: _addToCart,
			setBooks: _setBooks,
			setCart: _setCart,
			clearCart: _clearCart,
			orderNow: _orderNow,
			getDescription: _getDescription,
			checkOrderStatus: _checkOrderStatus,
			doLogin: _doLogin,
			getUserOrders: _getUserOrders
		}

	}();	


	$scope.loading = true;
	$scope.store = store;

	var loadBooks = function(){
		$scope.loading = true;
		$http.get('http://puluceno.com/project/rest/books').success(function(books) {
			store.setBooks(books);
			$scope.loading = false;
		}); 
	};

	var loadCart = function(){
		$http.get('/cart').success(function(response) {
			store.setCart(response);
		});
	};

	loadBooks();
	loadCart();
});