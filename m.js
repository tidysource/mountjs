'use strict';

var m = {};

m.module = function(module){
	/*
	Validate module
	---------------
	*/
	//<--- add validation
	
	/*
	Build reference to specified path
	---------------------------------
	
	Reference (var ref) is used to store the
	reference under path of the module, e.g.:
	module.path = 'foo.bar' ---> m.foo.bar
	var ref === m.foo.bar
	*/
	
	var ref = m;
	var path = module.path.split('.');
		//validate path
		if (path.indexOf('m') !== -1){
			throw new Error('Invalid path.');
		}
	
	for (var i=0;i<path.length;++i){
		var prop = path[i];
							
		if (typeof ref[prop] === 'undefined'){
			ref[prop] = {};
		}
		
		ref = ref[prop];
	}
	
	/*
	Create or append to existing proto object
	-----------------------------------------
	
	The proto object holds all the property methods
	and action method, since those are shared by all
	instances.
	It's stored under .m at module.path
	*/
	if (typeof ref.m === 'object'){
		/*
		NOTE: 
		ref.m might be there due to ref.m being 
		a method or due to it already having 
		methods. That and clearer namespace use 
		is why we use ref.m.protoObj
		*/
		if(typeof ref.m.protoObj !== 'object'){
			ref.m.protoObj = {};
		}
	}
	else{ //typeof ref.m === 'undefined'
		ref.m = { protoObj : {} };
	}
	var protoObj = ref.m.protoObj;

	/*
	Set property methods
	--------------------
	
	Whatever parameter the module needs are set via 
	property methods.
	
	Property methods are functions that set parameter
	values for our action function, e.g.:
	m.param1().param2.doSomething();
	*/
	
	/*
	Set action method
	-----------------
	
	Whatever the module does is the action function.
	Action method is a function that performs the action
	it calls the function supplied via module.func, e.g.:
	m.param1().param2.doSomething(); <--- doSomething()
	*/
};