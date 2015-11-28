'use strict';

var m = {};

m.module = function(module){
	/*
	Validate module
	---------------
	*/
	//<--- add validation & conform module params
	
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
	
	Property methods are set on module.path under 
	.m.protoObj and under module.path.paramName by
	reference
	*/
	for (var i=0;i<module.param.length;++i){
		var param = module.param[i];
		
		//<---check if default value conforms (if not try to conform it)
		
		//Check for property method clash
		if (typeof ref[param.name] === 'undefined'){
			//No clash - set property method
			(function(param){
			protoObj[param.name] = function(val){
				if (typeof val === 'undefined'){
					//Return value
					
					//If undefined return default value
					if (typeof this.m.args[param.name] === 'undefined'
					 && typeof param.auto !== 'undefined'){
						return param.auto;
					}
					else{
						return this.m.args[param.name];
					}
				}
				else{
					//Set value
					
					//Validate value to be set
					if (typeof param.type !== 'undefined'){
						for (var j=0;j<param.type.length;++j){
							
						}
					}

					//Conform value 
					if (typeof param.conform === 'string'){
						//<--- check if val can be conformed to conform value
					}
					
					//Set value;
					var inst = this;
					
					/*
					Check if a new instance should be created
					
					Note:
					A new instance is needed the first time 
					a property method is called.
					*/
					if (typeof this.m.args === 'undefined'){
						inst = Object.create(this);
						inst.m.args = {};
					}
					
					inst.m.args[param.name] = val;
					
					return inst;					
				}
			};
			
			//Set reference on to protoObj
			ref[param.name] = protoObj[param.name];
			})(param);
		}
		else 
		if (JSON.stringify(param)
		!== JSON.stringify(protoObj[param.name].m)){
			//Property method is already defined and differs
			throw new Error('Incompatible param.');
		}
		//else do nothing, same property method already set
	}
	
	/*
	Set action method
	-----------------
	
	Whatever the module does is the action function.
	Action method is a function that performs the action
	it calls the function supplied via module.func, e.g.:
	m.param1().param2.doSomething(); <--- doSomething()
	*/
};