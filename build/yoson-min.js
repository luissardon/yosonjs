/*! FrontendLabs comunity | yOSONJS v0.0.13-alpha | (c) 2014, 2014 FrontendLabs comunity */
if("undefined"==typeof yOSON)var yOSON={};yOSON.Components={},yOSON.Log=function(){try{console.log.apply(console,arguments)}catch(a){try{opera.postError.apply(opera,arguments)}catch(b){alert(Array.prototype.join.call(arguments)," ")}}},function(){var a=function(){this.callbacks={succeededs:[],faileds:[]},this.status="pending"};a.prototype.eachCallBackList=function(a,b){for(var c=0;c<a.length;c++)b.call(this,a[c])},a.prototype.done=function(){this.status="done",this.eachCallBackList(this.callbacks.succeededs,function(a){a.call(this)})},a.prototype.then=function(a,b){var c=this.callbacks,d={pending:function(){c.succeededs.push(a),"function"==typeof b&&c.faileds.push(b)},done:function(){"function"==typeof a&&a.call(this)},fail:function(){b.call(this)}};return d[this.status](),this},a.prototype.fail=function(a){this.status="fail",this.eachCallBackList(this.callbacks.faileds,function(b){b.call(this,a)})},yOSON.Components.SinglePromise=a;var b=function(a){this.url=a,this.status="request",this.message="",this.events={}};b.prototype.getStatus=function(){return this.status},b.prototype.request=function(a){var b=this;"undefined"!=typeof a&&(b.events=a),b.onRequest();var c=b.createNewScript(b.url);b.requestIE(c,function(){c.onload=function(){b.onReadyRequest()},c.onerror=function(){b.onErrorRequest()}}),document.getElementsByTagName("head")[0].appendChild(c)},b.prototype.createNewScript=function(a){var b=document.createElement("script");return b.type="text/javascript",b.src=a,b},b.prototype.onRequest=function(){this.requestCallBackEvent("onRequest")},b.prototype.onReadyRequest=function(){this.status="ready",this.requestCallBackEvent("onReady")},b.prototype.onErrorRequest=function(){this.status="error",this.requestCallBackEvent("onError")},b.prototype.requestCallBackEvent=function(a){var b=this.events[a];"function"==typeof b&&b.call(this)},b.prototype.requestIE=function(a,b){var c=this;a.readyState?a.onreadystatechange=function(){("loaded"==a.readyState||"complete"==a.readyState)&&(a.onreadystatechange=null,c.onReadyRequest())}:b.call(c)},yOSON.Components.Dependency=b;var c=function(){this.data={},this.loaded={},this.config={staticHost:yOSON.statHost||"",versionUrl:yOSON.statVers||""}};c.prototype.setStaticHost=function(a){this.config.staticHost=a},c.prototype.getStaticHost=function(){return this.config.staticHost},c.prototype.setVersionUrl=function(a){this.config.versionUrl=a},c.prototype.getVersionUrl=function(){var a="";return""!==this.config.versionUrl&&(a=this.config.versionUrl),a},c.prototype.transformUrl=function(a){var b="",c=/((http?|https):\/\/)(www)?([\w-]+\.\w+)+(\/[\w-]+)+\.\w+/g;return b=c.test(a)?a:this.config.staticHost+a+this.getVersionUrl()},c.prototype.generateId=function(a){return-1!=a.indexOf("//")?a.split("//")[1].split("?")[0].replace(/[/.:]/g,"_"):a.split("?")[0].replace(/[/.:]/g,"_")},c.prototype.addScript=function(c){var d=this.generateId(c),e=new a;return this.alreadyInCollection(d)?this.data[d].promiseEntity:(this.data[d]=new b(c),this.data[d].request({onReady:function(){e.done()},onError:function(){e.fail()}}),this.data[d].promiseEntity=e,e)},c.prototype.ready=function(a,b,c){var d=0,e=this,f=function(g){if(d<g.length){var h=e.transformUrl(g[d]);e.addScript(h).then(function(){d++,f(a)},c)}else b.apply(e)};f(a)},c.prototype.avaliable=function(a,b,c){var d=this,e=d.generateId(a),f=d.getDependency(a);if(this.alreadyLoaded(e))return!0;var g=setInterval(function(){"ready"==f.getStatus()&&(d.loaded[e]=!0,clearInterval(g),b.apply(d)),"error"==f.getStatus()&&(b=null,clearInterval(g),c.call(this))},500)},c.prototype.getDependency=function(a){var b=this.generateId(a);return this.data[b]},c.prototype.alreadyInCollection=function(a){return this.data[a]},c.prototype.alreadyLoaded=function(a){return"undefined"!=typeof this.loaded[a]},yOSON.Components.DependencyManager=c;var d=function(a){this.entityBridge=a,this.moduleInstance="",this.status="stop"};d.prototype.create=function(a){this.moduleDefinition=a},d.prototype.generateModularDefinition=function(a,b){return"function"==typeof b?function(){try{return b.apply(this,arguments)}catch(c){yOSON.Log(a+"(): "+c.message)}}:b},d.prototype.start=function(a){var b=this.dealParamaterOfModule(a),c=this.moduleDefinition(this.entityBridge);for(var d in c){var e=c[d];c[d]=this.generateModularDefinition(d,e)}this.moduleInstance=c,this.runInitMethodOfModule(b)},d.prototype.dealParamaterOfModule=function(a){var b={};return"undefined"!=typeof a&&(b=a),b},d.prototype.runInitMethodOfModule=function(a){var b=this.moduleInstance;"function"==typeof b.init&&(this.setStatusModule("run"),b.init(a))},d.prototype.setStatusModule=function(a){this.status=a},d.prototype.getStatusModule=function(){return this.status},yOSON.Components.Modular=d;var e=function(){this.modules={}};e.prototype.updateStatus=function(a,b){this.modules[a]=b},e.prototype.eachModules=function(a){for(var b in this.modules){var c=this.modules[b];a.call(this,c)}},e.prototype.getTotalModulesByStatus=function(a){var b=0;return this.eachModules(function(c){c===a&&b++}),b},e.prototype.getTotalModulesRunning=function(){return this.getTotalModulesByStatus("run")},e.prototype.getTotalModulesToStart=function(){return this.getTotalModulesByStatus("toStart")+this.getTotalModulesRunning()};var f=function(){this.modules={},this.runningModules={},this.entityBridge={},this.alreadyAllModulesBeRunning=!1,this.syncModules=[],this.objMonitor=new e};f.prototype.addMethodToBrigde=function(a,b){this.entityBridge[a]=b},f.prototype.addModule=function(a,b){var c=this.modules;this.getModule(a)||(c[a]=new d(this.entityBridge),c[a].create(b))},f.prototype.getModule=function(a){return this.modules[a]},f.prototype.runModule=function(a,b){var c=this.getModule(a);this.getModule(a)&&(c.setStatusModule("start"),this.dataModule(a,b),this.runQueueModules())},f.prototype.syncModule=function(a){var b=this,c=b.getModule(a);b.objMonitor.updateStatus(a,"toStart"),b.syncModules.push(a)},f.prototype.dataModule=function(a,b){return"undefined"!=typeof b&&(this.modules[a].data=b),this.modules[a].data},f.prototype.runQueueModules=function(){var a=this,b=0,c=function(d){if(d.length>b){var e=d[b];a.whenModuleHaveStatus(e,"start",function(b,c){a.objMonitor.updateStatus(b,"run");var d=a.dataModule(b);c.start(d)}),a.whenModuleHaveStatus(e,"run",function(){b++,c(d)})}};c(a.syncModules)},f.prototype.whenModuleHaveStatus=function(a,b,c){var d=this.getModule(a),e=setInterval(function(){d.getStatusModule()===b&&(c.call(this,a,d),clearInterval(e))},20)},f.prototype.allModulesRunning=function(a,b){var c=this,d=c.objMonitor;if(this.alreadyAllModulesBeRunning)b.call(c);else var e=setInterval(function(){d.getTotalModulesToStart()>0?d.getTotalModulesToStart()===d.getTotalModulesRunning()?(b.call(c),this.alreadyAllModulesBeRunning=!0,clearInterval(e)):a.call(c):(b.call(c),this.alreadyAllModulesBeRunning=!0,clearInterval(e))},200)},yOSON.Components.ModularManager=f;var g=function(){this.events={}};g.prototype.subscribe=function(a,b,c){var d=this;this.finderEvents(a,function(){},function(a){d.addEvent(a,b,c)})},g.prototype.publish=function(a,b){var c=this;this.finderEvents([a],function(a,d){var e=d.instanceOrigin,f=d.functionSelf,g=c.validateArguments(b);f.apply(e,g)},function(){})},g.prototype.validateArguments=function(a){var b=[];return"undefined"!=typeof a&&(b=a),b},g.prototype.stopSubscribe=function(a){var b=this;this.finderEvents(a,function(a,c){b.removeEvent(a)},function(){})},g.prototype.addEvent=function(a,b,c){var d={};return d.instanceOrigin=c,d.functionSelf=b,this.events[a]=d,this},g.prototype.removeEvent=function(a){delete this.events[a]},g.prototype.eventAlreadyRegistered=function(a){var b=!1;return this.getEvent(a)&&(b=!0),b},g.prototype.getEvent=function(a){return this.events[a]},g.prototype.finderEvents=function(a,b,c){for(var d=this,e=0;e<a.length;e++)d.eachFindEvent(a[e],b,c)},g.prototype.eachFindEvent=function(a,b,c){var d=this;if(d.eventAlreadyRegistered(a)){var e=d.getEvent(a);b.call(d,a,e)}else c.call(d,a)},yOSON.Components.Comunicator=g;var h=function(a){this.modules=a.modules,this.modules.allModules=function(){},this.modules.byDefault=function(){},this.controllers={byDefault:function(){}},this.actions={byDefault:function(){}}};h.prototype.appendMethod=function(a,b,c){"function"!=typeof a[b]&&(a[b]=c)},h.prototype.overrideModuleLevel=function(a,b){this.appendMethod(b,"allControllers",function(){}),this.modules[a]=b,this.modules=this.modules},h.prototype.setControllers=function(a){this.controllers=this.modules[a].controllers},h.prototype.overrideControllerLevel=function(a,b){this.appendMethod(b,"allActions",function(){}),this.controllers[a]=b},h.prototype.setActions=function(a){this.actions=this.controllers[a].actions},h.prototype.getLevel=function(a){return this[a]},h.prototype.getNodeByLevel=function(a,b){return this[a][b]},h.prototype.getDefaultMethodInLevel=function(a){this[a].byDefault()};var i=function(a){this.objSchema=new h(a)};i.prototype.init=function(a,b,c){var d=this.checkLevelName(a),e=this.checkLevelName(b),f=this.checkLevelName(c),g=this.objSchema;this.runModuleLevel(d,function(a){a.allControllers(),this.runControllerLevel(e,function(a){a.allActions(),this.runActionLevel(f,function(a){a()})})})},i.prototype.checkLevelName=function(a){var b="";return"undefined"!=typeof a&&(b=a),b},i.prototype.runModuleLevel=function(a,b){var c=this.objSchema,d=c.getLevel("modules");if(d.allModules(),d[a]){var e=d[a];c.overrideModuleLevel(a,e),c.setControllers(a),b.call(this,e)}else c.getDefaultMethodInLevel("modules")},i.prototype.runControllerLevel=function(a,b){var c=this.objSchema,d=c.getLevel("controllers");if(d[a]){var e=d[a];c.setActions(a),b.call(this,e)}else c.getDefaultMethodInLevel("controllers")},i.prototype.runActionLevel=function(a,b){var c=this.objSchema,d=c.getLevel("actions");if(d[a]){var e=d[a];b.call(this,e)}else c.getDefaultMethodInLevel("actions")},yOSON.Components.Loader=i;var j=new yOSON.Components.ModularManager,k=new yOSON.Components.DependencyManager,l=new yOSON.Components.Comunicator,m={},n={};return yOSON.AppCore=function(){j.addMethodToBrigde("events",function(a,b,c){l.subscribe(a,b,c)}),j.addMethodToBrigde("trigger",function(){var a={},b=[].slice.call(arguments,0),c=b[0],d=[];b.length>1&&(d=b.slice(1)),n[c]=function(a,b){return{init:function(){l.publish(a,b)}}}(c,d),j.allModulesRunning(function(){a[c]=d},function(){for(var b in a)l.publish(b,a[b]);n[c].init()})});var a=function(a,b){m[a]=b},b=function(a){var b=[];return m[a]&&(b=m[a]),b};return{getStatusModule:function(a){var b=j.getModule(a);return b.getStatusModule()},whenModule:function(a,b,c){j.whenModuleHaveStatus(a,b,function(){c.call(this)})},addModule:function(b,c,d){a(b,d),j.addModule(b,c)},runModule:function(a,c){var d=b(a),e=j.getModule(a);e?(j.syncModule(a),k.ready(d,function(){j.runModule(a,c)},function(){yOSON.Log("Error in Load Module "+a)})):yOSON.Log("Error: the module "+a+" don't exists")},setStaticHost:function(a){k.setStaticHost(a)},setVersionUrl:function(a){k.setVersionUrl(a)}}}(),yOSON}();
//# sourceMappingURL=yoson.min.map