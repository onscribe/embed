// Globals
var onscribe = {};

(function() {

	var user = false;
	// servers
	var DEBUG = window.DEBUG || ( (window.location.hostname == "localhost") ? true : false );
	if( DEBUG ){
		var url = "/";
		var cdn = "/";
	} else {
		var url = "//onscri.be/";
		var cdn = "//cdn.onscri.be/";
	}

	// add stylesheet
	var styles = document.createElement("link");
	styles.type = "text/css";
	styles.rel = "stylesheet";
	styles.href = cdn + "assets/css/client.css";
	document.getElementsByTagName("head")[0].appendChild( styles );

	// initialize when the DOM is loaded
	var loadedStates = ["complete", "interactive"];
	if( loadedStates .indexOf( document.readyState ) > -1 ) {
		init();
	} else {
		window.onload = init;
	}

	function init(){
		// pickup all the links to
		var links = document.querySelectorAll(".onscribe");
		// exit now if there are no links
		if( !links.length ) return;
		// get onscribe user
		user = findUser();
		// convert nodelist to a regular array
		links = Array.prototype.slice.call(links);
		//
		links.forEach(function( el ){
			renderProviders( el );
		});
	}

	function renderProviders( el ){
		// check the product id
		var product = el.getAttribute("data-product");
		// skip if there's no product id
		if( typeof product == "undefined" ) return;
		// variables
		var data = {};
		var email = (user) ? user.email : false;
		data.product = product;
		data.email = email;

		//
		if( email ){
			checkUser(function( valid ){
				//console.log("valid", valid);
				if( valid ){
					// already purchased - don't display anything?
					return;
				} else {
					getProductDetails( product, function( response ){
						if( !response ) return;
						data.providers = response.providers;
						renderButtons( el, data);
					});
				}
			});
		} else {
			// make an ajax request to get product details
			getProductDetails( product, function( response ){
				if( !response ) return;
				data.providers = response.providers;
				renderButtons( el, data);
			});
		}

	}

	function findUser(){
		// variables
		var data = false;
		var verified = false;
		var global = false;
		var cached = false;
		// first check in the query
		verified = query("onscribe_user");
		// then check the global namespace
		if( !verified ) global = window["onscribe_user"] || false;
		// then check in the localStorage (if available)
		if( !verified && !global && window.localStorage ) cached = window.localStorage.getItem("onscribe_user");
		//
		data = verified || global || cached || false;
		// check if we found a user
		if ( !data || typeof data == "undefined") return;
		// parse user data
		// - if global var, check if it's already an object
		if( global && typeof data == "object" ){
			// encode...
			global = onscribe.register(global);
		} else {
			// assume type of string from here on?
			data = atob( data );
			try{
				data = JSON.parse( data );
			} catch( e ) {
				// what to do now?
				//console.log( e );
				data = false;
			}
		}
		// save back to localStorage
		if( !cached ){
			var cache = verified || global;
			window.localStorage.setItem("onscribe_user", cache);
		}

		return data;
	};

	function checkUser( callback ){
		// prerequisite
		if( !user || !callback ) return false;
		if( !user.email || !user.code ) return callback( false );
		//
		var query = "email="+ user.email +"&client=js";
		//
		ajax( url + "order/verify/"+ user.code +"?"+ query, function( response ){
			// stop if there is no real product
			var verified = ( response.order ) ? true : false;
			callback( verified );
		});
	};

	function getProductDetails( product, callback ){
		ajax( url + "api/product/"+product+"/info", function( response ){
			// stop if there is no real product
			//console.log( response );
			callback( response );
		});
	};

	function renderButtons( el, data){
		// clean up data
		var buttons = [];

		for(var i in data.providers){
			// consider deleted providers
			var type = data.providers[i].type || data.providers[i]; // assume if type not available that it's a sting...
			if( typeof type == "undefined" ) continue;
			buttons.push({
				provider: type,
				product: data.product,
				email: data.email || false
			});
		}

		for(var j in buttons){
			var button = createButton( buttons[j], el );
			el.appendChild( button );
		}
	}

	function createButton( data, el ){
		var a = document.createElement("a");
		a.href = url + "use/"+ data.provider +"/"+ data.product + ( (data.email) ? "?email="+ data.email : "");
		a.className = "btn";
		var buttonClass = "";
		var buttonIcon = "";
		switch( data.provider ){
			case "paypal":
				buttonClass = "btn-pp";
				buttonIcon = ",";
			break;
			case "google":
				buttonClass = "btn-gw";
				buttonIcon = "/";
			break;
			case "facebook":
				buttonClass = "btn-fb";
				buttonIcon = "!";
			break;
		}
		a.className = a.className +" "+ buttonClass;
		var i = document.createElement("i");
		i.setAttribute("aria-hidden", "true");
		i.setAttribute("data-providers", buttonIcon);
		a.appendChild( i );
		// add text if using the appropriate class
		var long_text = new RegExp('long-text').test(' ' + el.className + ' ');
		var short_text = new RegExp('short-text').test(' ' + el.className + ' ');
		if( long_text || short_text ){
			var span = document.createElement("span");
			var default_prompt = ( long_text ) ? "Pay with" : "Pay Now";
			var prompt = el.getAttribute("data-prompt");
			var text = ( prompt === null ) ? default_prompt : prompt;
			if(long_text) text += " "+ ucwords( data.provider ); // first character uppercase
			span.innerHTML = text;
			a.appendChild( span );
		}
		// return the node
		return a;

	};

	/*
	Onscribe = function (){

		this.init();

		return this;
	}

	Onscribe.prototype = {
		state : {
			auth : false,
			deps: false,
			socket: false
		},
		// defaults
		options : {
			log : false,
			auth : true,
			key : false,
			secret : false
		},
		init : function(){
			var self = this;
			this.token = false;

			this.promise = new Promise();
			//this.promise.add( this.sockets );

			// this does nothing??
			this.status("initialized");

		}
		*/

// Public methods
window.onscribe.register = function( data ){
	// register user credentials with the service
	if( typeof data != "object" ) return  false;
	var user = btoa( JSON.stringify( data ) );
	// save to localStorage and global var
	window.localStorage.setItem("onscribe_user", user );
	window.onscribe_user = user;
	return user;
}

// Helpers (not available in the global namespace)
// - grouping callbacks
function Promise (obj) {
	var args = null;
	var callbacks = [];
	var resolved = false;

	this.add = function(callback) {
		if (resolved) {
			callback.apply(obj, args);
		} else {
			callbacks.push(callback);
		}
	},

	this.resolve = function() {
		if (!resolved) {
			args = arguments;
			resolved = true;

			var callback;
			while (callback = callbacks.shift()) {
				callback.apply(obj, arguments);
			}

			callbacks = null;
		}
	}
};


// - create an ajax request
function ajax( url, callback ){

	//console.log( url );

	var req = new XMLHttpRequest();
	var self = this;

	req.open("GET",url,true);
	req.send(null);
	req.onerror = function(){
		console.log("there was an error with your request");
	};
	req.onload = function(e){
		// graceful parsing
		try{
			var response = JSON.parse(e.target.responseText);
			callback.call(self, response);
		} catch( e ){
			if( DEBUG ) console.log( e );
			callback.call(self, false);
		}
	}

}

// - cookies...
var Cookie = {
	get : function(name) {
		var i,key,value,cookies=document.cookie.split(";");
		for (i=0;i<cookies.length;i++){
			key=cookies[i].substr(0,cookies[i].indexOf("="));
			value=cookies[i].substr(cookies[i].indexOf("=")+1);
			key=key.replace(/^\s+|\s+$/g,"");
			if (key==name){
				return unescape(value);
			}
		}
	},

	set : function(name,val,expiry){
		var date = new Date( ( new Date() ).getTime() + parseInt(expiry) );
		var value=escape(val) + ((expiry==null) ? "" : "; expires="+date.toUTCString());
		document.cookie=name + "=" + value;
	},

	check : function( name ){
		var cookie=this.get( name );
		if (cookie!=null && cookie!=""){
			return true;
		} else {
			return false;
		}
	}

};

// lookup query params
function query(name) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (i=0; i < vars.length; i++) {
		var target = vars[i].split("=");
		if (target[0] == name) {
			return decodeURIComponent( target[1] );
		}
	}
	return false;
}

// Source: http://phpjs.org/functions/ucwords/
function ucwords(str) {
	return (str + '')
		.replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
			return $1.toUpperCase();
		});
}

// create a new instance of the lib in the global namespace
//this.onscribe = new Onscribe();

}).call(this);
