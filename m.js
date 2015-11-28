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
	
	IMPORTANT:
	Multiple modules can share the same path
	(in that case they also share the same
	proto object).
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
							//<--- validate
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
					
					NOTE:
					A new instance is needed the first time 
					a property method is called. We need a
					new (unique) instance to store property 
					method values.
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
	if (typeof ref[module.name] === 'undefined'){
		protoObj[module.name] = function(){
			var inst = this;
			
			/*
			Check if a new instance should be created
			
			NOTE:
			A new instance is needed the first time 
			an action method is called and no property
			method was called before it.  We need a
			new (unique) instance to store property 
			method values. We need a new instance for every
			action method call.
			*/
			if (typeof this.m.args === 'undefined'){
				inst = Object.create(this);
				inst.m.args = {};
			}
			
			//<---Handle shorthand (validate and set shorthand, just use property methods)
			 
			/*
			NOTE:
			We don't pass arguments from shorthand, 
			we instead use inst.argName() as setter
			or getter. That is, we use the property 
			method, since a property method is defined
			for all shorthand params as well.
			*/

			return module.func(inst);

			/*
			NOTE:						
			Possible return values:
		  -	No return value (undefined), 	
		  -	Custom return value, e.g.:
			module.func = function(param){
				//do stuff
				return true;
			}
		  -	For method chaining: return inst e.g.:
			module.func = function(param){
				//do stuff
				return param; //param === inst
			}
			
			IMPORTANT:
			Do not do action method chaining if any 
			of the actions (module.func) change the
			value of a property via property method
			(especially async code).
			Note that for objects & arrays, changes
			are made even via reference, e.g.
				var a = { foo : "bar" }
				b = a
				b.foo = "foobar"
				//will result in
				a.foo === "foobar"
			To avoid this, cloned values of the actual
			method property values should be passed 
			to the action method. That way it would
			only alter it's own copy of each value.
			Yet (deep) copying arrays and even more so
			objects is difficult as well as resource
			intensive, so it's not implemented for now.
			*/
		}
		
		//Set reference on to protoObj
		ref[module.name] = protoObj[module.name];
	}
	else{ 
		//Action method clash
		throw new Error('Invalid module name.');
	}
};