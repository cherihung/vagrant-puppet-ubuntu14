/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "7db813ac6833a70fa600"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(2);
	__webpack_require__(6);
	__webpack_require__(8);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(13);
	riot.mount('app');
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.2.4, @license MIT, (c) 2015 Muut Inc. + contributors */

	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.2.4', settings: {} },
	  //// be aware, internal usage

	  // counter to give a unique id to all the Tag instances
	  __uid = 0,

	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',

	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_FUNCTION = 'function',
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:opt(ion|group)|tbody|col|t[rhd])$/,
	  RESERVED_WORDS_BLACKLIST = ['_item', '_id', 'update', 'root', 'mount', 'unmount', 'mixin', 'isMounted', 'isLoop', 'tags', 'parent', 'opts', 'trigger', 'on', 'off', 'one'],

	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0,

	  // Array.isArray for IE8 is in the polyfills
	  isArray = Array.isArray

	riot.observable = function(el) {

	  el = el || {}

	  var callbacks = {},
	      _id = 0

	  el.on = function(events, fn) {
	    if (isFunction(fn)) {
	      if (typeof fn.id === T_UNDEF) fn._id = _id++

	      events.replace(/\S+/g, function(name, pos) {
	        (callbacks[name] = callbacks[name] || []).push(fn)
	        fn.typed = pos > 0
	      })
	    }
	    return el
	  }

	  el.off = function(events, fn) {
	    if (events == '*') callbacks = {}
	    else {
	      events.replace(/\S+/g, function(name) {
	        if (fn) {
	          var arr = callbacks[name]
	          for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
	            if (cb._id == fn._id) arr.splice(i--, 1)
	          }
	        } else {
	          callbacks[name] = []
	        }
	      })
	    }
	    return el
	  }

	  // only single event supported
	  el.one = function(name, fn) {
	    function on() {
	      el.off(name, on)
	      fn.apply(el, arguments)
	    }
	    return el.on(name, on)
	  }

	  el.trigger = function(name) {
	    var args = [].slice.call(arguments, 1),
	        fns = callbacks[name] || []

	    for (var i = 0, fn; (fn = fns[i]); ++i) {
	      if (!fn.busy) {
	        fn.busy = 1
	        fn.apply(el, fn.typed ? [name].concat(args) : args)
	        if (fns[i] !== fn) { i-- }
	        fn.busy = 0
	      }
	    }

	    if (callbacks.all && name != 'all') {
	      el.trigger.apply(el, ['all', name].concat(args))
	    }

	    return el
	  }

	  return el

	}
	riot.mixin = (function() {
	  var mixins = {}

	  return function(name, mixin) {
	    if (!mixin) return mixins[name]
	    mixins[name] = mixin
	  }

	})()

	;(function(riot, evt, win) {

	  // browsers only
	  if (!win) return

	  var loc = win.location,
	      fns = riot.observable(),
	      started = false,
	      current

	  function hash() {
	    return loc.href.split('#')[1] || ''   // why not loc.hash.splice(1) ?
	  }

	  function parser(path) {
	    return path.split('/')
	  }

	  function emit(path) {
	    if (path.type) path = hash()

	    if (path != current) {
	      fns.trigger.apply(null, ['H'].concat(parser(path)))
	      current = path
	    }
	  }

	  var r = riot.route = function(arg) {
	    // string
	    if (arg[0]) {
	      loc.hash = arg
	      emit(arg)

	    // function
	    } else {
	      fns.on('H', arg)
	    }
	  }

	  r.exec = function(fn) {
	    fn.apply(null, parser(hash()))
	  }

	  r.parser = function(fn) {
	    parser = fn
	  }

	  r.stop = function () {
	    if (started) {
	      if (win.removeEventListener) win.removeEventListener(evt, emit, false) //@IE8 - the if()
	      else win.detachEvent('on' + evt, emit) //@IE8
	      fns.off('*')
	      started = false
	    }
	  }

	  r.start = function () {
	    if (!started) {
	      if (win.addEventListener) win.addEventListener(evt, emit, false) //@IE8 - the if()
	      else win.attachEvent('on' + evt, emit) //IE8
	      started = true
	    }
	  }

	  // autostart the router
	  r.start()

	})(riot, 'hashchange', window)
	/*

	//// How it works?


	Three ways:

	1. Expressions: tmpl('{ value }', data).
	   Returns the result of evaluated expression as a raw object.

	2. Templates: tmpl('Hi { name } { surname }', data).
	   Returns a string with evaluated expressions.

	3. Filters: tmpl('{ show: !done, highlight: active }', data).
	   Returns a space separated list of trueish keys (mainly
	   used for setting html classes), e.g. "show highlight".


	// Template examples

	tmpl('{ title || "Untitled" }', data)
	tmpl('Results are { results ? "ready" : "loading" }', data)
	tmpl('Today is { new Date() }', data)
	tmpl('{ message.length > 140 && "Message is too long" }', data)
	tmpl('This item got { Math.round(rating) } stars', data)
	tmpl('<h1>{ title }</h1>{ body }', data)


	// Falsy expressions in templates

	In templates (as opposed to single expressions) all falsy values
	except zero (undefined/null/false) will default to empty string:

	tmpl('{ undefined } - { false } - { null } - { 0 }', {})
	// will return: " - - - 0"

	*/


	var brackets = (function(orig) {

	  var cachedBrackets,
	      r,
	      b,
	      re = /[{}]/g

	  return function(x) {

	    // make sure we use the current setting
	    var s = riot.settings.brackets || orig

	    // recreate cached vars if needed
	    if (cachedBrackets !== s) {
	      cachedBrackets = s
	      b = s.split(' ')
	      r = b.map(function (e) { return e.replace(/(?=.)/g, '\\') })
	    }

	    // if regexp given, rewrite it with current brackets (only if differ from default)
	    return x instanceof RegExp ? (
	        s === orig ? x :
	        new RegExp(x.source.replace(re, function(b) { return r[~~(b === '}')] }), x.global ? 'g' : '')
	      ) :
	      // else, get specific bracket
	      b[x]
	  }
	})('{ }')


	var tmpl = (function() {

	  var cache = {},
	      OGLOB = '"in d?d:' + (window ? 'window).' : 'global).'),
	      reVars =
	      /(['"\/])(?:[^\\]*?|\\.|.)*?\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function\s*\()|([A-Za-z_$]\w*)/g

	  // build a template (or get it from cache), render with data
	  return function(str, data) {
	    return str && (cache[str] || (cache[str] = tmpl(str)))(data)
	  }


	  // create a template instance

	  function tmpl(s, p) {

	    if (s.indexOf(brackets(0)) < 0) {
	      // return raw text
	      s = s.replace(/\n|\r\n?/g, '\n')
	      return function () { return s }
	    }

	    // temporarily convert \{ and \} to a non-character
	    s = s
	      .replace(brackets(/\\{/g), '\uFFF0')
	      .replace(brackets(/\\}/g), '\uFFF1')

	    // split string to expression and non-expresion parts
	    p = split(s, extract(s, brackets(/{/), brackets(/}/)))

	    // is it a single expression or a template? i.e. {x} or <b>{x}</b>
	    s = (p.length === 2 && !p[0]) ?

	      // if expression, evaluate it
	      expr(p[1]) :

	      // if template, evaluate all expressions in it
	      '[' + p.map(function(s, i) {

	        // is it an expression or a string (every second part is an expression)
	        return i % 2 ?

	          // evaluate the expressions
	          expr(s, true) :

	          // process string parts of the template:
	          '"' + s

	            // preserve new lines
	            .replace(/\n|\r\n?/g, '\\n')

	            // escape quotes
	            .replace(/"/g, '\\"') +

	          '"'

	      }).join(',') + '].join("")'

	    return new Function('d', 'return ' + s
	      // bring escaped { and } back
	      .replace(/\uFFF0/g, brackets(0))
	      .replace(/\uFFF1/g, brackets(1)) + ';')

	  }


	  // parse { ... } expression

	  function expr(s, n) {
	    s = s

	      // convert new lines to spaces
	      .replace(/\n|\r\n?/g, ' ')

	      // trim whitespace, brackets, strip comments
	      .replace(brackets(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '')

	    // is it an object literal? i.e. { key : value }
	    return /^\s*[\w- "']+ *:/.test(s) ?

	      // if object literal, return trueish keys
	      // e.g.: { show: isOpen(), done: item.done } -> "show done"
	      '[' +

	          // extract key:val pairs, ignoring any nested objects
	          extract(s,

	              // name part: name:, "name":, 'name':, name :
	              /["' ]*[\w- ]+["' ]*:/,

	              // expression part: everything upto a comma followed by a name (see above) or end of line
	              /,(?=["' ]*[\w- ]+["' ]*:)|}|$/
	              ).map(function(pair) {

	                // get key, val parts
	                return pair.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function(_, k, v) {

	                  // wrap all conditional parts to ignore errors
	                  return v.replace(/[^&|=!><]+/g, wrap) + '?"' + k + '":"",'

	                })

	              }).join('') +

	        '].join(" ").trim()' :

	      // if js expression, evaluate as javascript
	      wrap(s, n)

	  }


	  // execute js w/o breaking on errors or undefined vars

	  function wrap(s, nonull) {
	    s = s.trim()
	    return !s ? '' : '(function(v){try{v=' +

	      // prefix vars (name => data.name)
	      s.replace(reVars, function(s, _, v) { return v ? '(("' + v + OGLOB + v + ')' : s }) +

	      // default to empty string for falsy values except zero
	      '}catch(e){}return ' + (nonull === true ? '!v&&v!==0?"":v' : 'v') + '}).call(d)'
	  }


	  // split string by an array of substrings

	  function split(str, substrings) {
	    var parts = []
	    substrings.map(function(sub, i) {

	      // push matched expression and part before it
	      i = str.indexOf(sub)
	      parts.push(str.slice(0, i), sub)
	      str = str.slice(i + sub.length)
	    })
	    if (str) parts.push(str)

	    // push the remaining part
	    return parts
	  }


	  // match strings between opening and closing regexp, skipping any inner/nested matches

	  function extract(str, open, close) {

	    var start,
	        level = 0,
	        matches = [],
	        re = new RegExp('(' + open.source + ')|(' + close.source + ')', 'g')

	    str.replace(re, function(_, open, close, pos) {

	      // if outer inner bracket, mark position
	      if (!level && open) start = pos

	      // in(de)crease bracket level
	      level += open ? 1 : -1

	      // if outer closing bracket, grab the match
	      if (!level && close != null) matches.push(str.slice(start, pos + close.length))

	    })

	    return matches
	  }

	})()

	/*
	  lib/browser/tag/mkdom.js

	  Includes hacks needed for the Internet Explorer version 9 and bellow

	*/
	// http://kangax.github.io/compat-table/es5/#ie8
	// http://codeplanet.io/dropping-ie8/

	var mkdom = (function (checkIE) {

	  var rootEls = {
	        'tr': 'tbody',
	        'th': 'tr',
	        'td': 'tr',
	        'tbody': 'table',
	        'col': 'colgroup'
	      },
	      GENERIC = 'div'

	  checkIE = checkIE && checkIE < 10

	  // creates any dom element in a div, table, or colgroup container
	  function _mkdom(html) {

	    var match = html && html.match(/^\s*<([-\w]+)/),
	        tagName = match && match[1].toLowerCase(),
	        rootTag = rootEls[tagName] || GENERIC,
	        el = mkEl(rootTag)

	    el.stub = true

	    if (checkIE && tagName && (match = tagName.match(SPECIAL_TAGS_REGEX)))
	      ie9elem(el, html, tagName, !!match[1])
	    else
	      el.innerHTML = html

	    return el
	  }

	  // creates tr, th, td, option, optgroup element for IE8-9
	  /* istanbul ignore next */
	  function ie9elem(el, html, tagName, select) {

	    var div = mkEl(GENERIC),
	        tag = select ? 'select>' : 'table>',
	        child

	    div.innerHTML = '<' + tag + html + '</' + tag

	    child = div.getElementsByTagName(tagName)[0]
	    if (child)
	      el.appendChild(child)

	  }
	  // end ie9elem()

	  return _mkdom

	})(IE_VERSION)

	// { key, i in items} -> { key, i, items }
	function loopKeys(expr) {
	  var b0 = brackets(0),
	      els = expr.trim().slice(b0.length).match(/^\s*(\S+?)\s*(?:,\s*(\S+))?\s+in\s+(.+)$/)
	  return els ? { key: els[1], pos: els[2], val: b0 + els[3] } : { val: expr }
	}

	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}


	/* Beware: heavy stuff */
	function _each(dom, parent, expr) {

	  remAttr(dom, 'each')

	  var tagName = getTagName(dom),
	      template = dom.outerHTML,
	      hasImpl = !!tagImpl[tagName],
	      impl = tagImpl[tagName] || {
	        tmpl: template
	      },
	      root = dom.parentNode,
	      placeholder = document.createComment('riot placeholder'),
	      tags = [],
	      child = getTag(dom),
	      checksum

	  root.insertBefore(placeholder, dom)

	  expr = loopKeys(expr)

	  // clean template code
	  parent
	    .one('premount', function () {
	      if (root.stub) root = parent.root
	      // remove the original DOM node
	      dom.parentNode.removeChild(dom)
	    })
	    .on('update', function () {
	      var items = tmpl(expr.val, parent)

	      // object loop. any changes cause full redraw
	      if (!isArray(items)) {

	        checksum = items ? JSON.stringify(items) : ''

	        items = !items ? [] :
	          Object.keys(items).map(function (key) {
	            return mkitem(expr, key, items[key])
	          })
	      }

	      var frag = document.createDocumentFragment(),
	          i = tags.length,
	          j = items.length

	      // unmount leftover items
	      while (i > j) {
	        tags[--i].unmount()
	        tags.splice(i, 1)
	      }

	      for (i = 0; i < j; ++i) {
	        var _item = !checksum && !!expr.key ? mkitem(expr, items[i], i) : items[i]

	        if (!tags[i]) {
	          // mount new
	          (tags[i] = new Tag(impl, {
	              parent: parent,
	              isLoop: true,
	              hasImpl: hasImpl,
	              root: SPECIAL_TAGS_REGEX.test(tagName) ? root : dom.cloneNode(),
	              item: _item
	            }, dom.innerHTML)
	          ).mount()

	          frag.appendChild(tags[i].root)
	        } else
	          tags[i].update(_item)

	        tags[i]._item = _item

	      }

	      root.insertBefore(frag, placeholder)

	      if (child) parent.tags[tagName] = tags

	    }).one('updated', function() {
	      var keys = Object.keys(parent)// only set new values
	      walk(root, function(node) {
	        // only set element node and not isLoop
	        if (node.nodeType == 1 && !node.isLoop && !node._looped) {
	          node._visited = false // reset _visited for loop node
	          node._looped = true // avoid set multiple each
	          setNamed(node, parent, keys)
	        }
	      })
	    })

	}


	function parseNamedElements(root, tag, childTags) {

	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop || (dom.parentNode && dom.parentNode.isLoop || dom.getAttribute('each')) ? 1 : 0

	      // custom child tag
	      var child = getTag(dom)

	      if (child && !dom.isLoop) {
	        childTags.push(initChildTag(child, dom, tag))
	      }

	      if (!dom.isLoop)
	        setNamed(dom, tag, [])
	    }

	  })

	}

	function parseExpressions(root, tag, expressions) {

	  function addExpr(dom, val, extra) {
	    if (val.indexOf(brackets(0)) >= 0) {
	      var expr = { dom: dom, expr: val }
	      expressions.push(extend(expr, extra))
	    }
	  }

	  walk(root, function(dom) {
	    var type = dom.nodeType

	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return

	    /* element */

	    // loop
	    var attr = dom.getAttribute('each')

	    if (attr) { _each(dom, tag, attr); return false }

	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]

	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }

	    })

	    // skip custom tags
	    if (getTag(dom)) return false

	  })

	}
	function Tag(impl, conf, innerHTML) {

	  var self = riot.observable(this),
	      opts = inherit(conf.opts) || {},
	      dom = mkdom(impl.tmpl),
	      parent = conf.parent,
	      isLoop = conf.isLoop,
	      hasImpl = conf.hasImpl,
	      item = cleanUpData(conf.item),
	      expressions = [],
	      childTags = [],
	      root = conf.root,
	      fn = impl.fn,
	      tagName = root.tagName.toLowerCase(),
	      attr = {},
	      propsInSyncWithParent = []

	  if (fn && root._tag) {
	    root._tag.unmount(true)
	  }

	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop

	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this

	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  this._id = __uid++

	  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)

	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (brackets(/{.*}/).test(val)) attr[el.name] = val
	  })

	  if (dom.innerHTML && !/^(select|optgroup|table|tbody|tr|col(?:group)?)$/.test(tagName))
	    // replace all the yield tags with the tag inner html
	    dom.innerHTML = replaceYield(dom.innerHTML, innerHTML)

	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self

	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      opts[el.name] = tmpl(el.value, ctx)
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[name] = tmpl(attr[name], ctx)
	    })
	  }

	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF)
	        self[key] = data[key]
	    }
	  }

	  function inheritFromParent () {
	    if (!self.parent || !isLoop) return
	    each(Object.keys(self.parent), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !~RESERVED_WORDS_BLACKLIST.indexOf(k) && ~propsInSyncWithParent.indexOf(k)
	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = self.parent[k]
	      }
	    })
	  }

	  this.update = function(data) {
	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent
	    inheritFromParent()
	    // normalize the tag properties in case an item object was initially passed
	    if (data && typeof item === T_OBJECT) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)
	    self.trigger('updated')
	  }

	  this.mixin = function() {
	    each(arguments, function(mix) {
	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
	      each(Object.keys(mix), function(key) {
	        // bind methods to self
	        if (key != 'init')
	          self[key] = isFunction(mix[key]) ? mix[key].bind(self) : mix[key]
	      })
	      // init method will be called automatically
	      if (mix.init) mix.init.bind(self)()
	    })
	  }

	  this.mount = function() {

	    updateOpts()

	    // initialiation
	    if (fn) fn.call(self, opts)

	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)

	    // mount the child tags
	    toggle(true)

	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs || hasImpl) {
	      walkAttributes(impl.attrs, function (k, v) { root.setAttribute(k, v) })
	      parseExpressions(self.root, self, expressions)
	    }

	    if (!self.parent || isLoop) self.update(item)

	    // internal use only, fixes #403
	    self.trigger('premount')

	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      self.root = root = dom.firstChild

	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) self.root = root = parent.root
	    }
	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  }


	  this.unmount = function(keepRootTag) {
	    var el = root,
	        p = el.parentNode,
	        ptag

	    if (p) {

	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._id == self._id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }

	      else
	        while (el.firstChild) el.removeChild(el.firstChild)

	      if (!keepRootTag)
	        p.removeChild(el)
	      else
	        // the riot-tag attribute isn't needed anymore, remove it
	        p.removeAttribute('riot-tag')
	    }


	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    // somehow ie8 does not like `delete root._tag`
	    root._tag = null

	  }

	  function toggle(isMount) {

	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

	    // listen/unlisten parent (events flow one way from parent to children)
	    if (parent) {
	      var evt = isMount ? 'on' : 'off'

	      // the loop tags will be always in sync with the parent automatically
	      if (isLoop)
	        parent[evt]('unmount', self.unmount)
	      else
	        parent[evt]('update', self.update)[evt]('unmount', self.unmount)
	    }
	  }

	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)


	}

	function setEventHandler(name, handler, dom, tag) {

	  dom[name] = function(e) {

	    var item = tag._item,
	        ptag = tag.parent,
	        el

	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag.parent
	      }

	    // cross browser event fix
	    e = e || window.event

	    // ignore error on some browsers
	    try {
	      e.currentTarget = dom
	      if (!e.target) e.target = e.srcElement
	      if (!e.which) e.which = e.charCode || e.keyCode
	    } catch (ignored) { /**/ }

	    e.item = item

	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }

	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }

	  }

	}

	// used by if- attribute
	function insertTo(root, node, before) {
	  if (root) {
	    root.insertBefore(before, node)
	    root.removeChild(node)
	  }
	}

	function update(expressions, tag) {

	  each(expressions, function(expr, i) {

	    var dom = expr.dom,
	        attrName = expr.attr,
	        value = tmpl(expr.expr, tag),
	        parent = expr.dom.parentNode

	    if (expr.bool)
	      value = value ? attrName : false
	    else if (value == null)
	      value = ''

	    // leave out riot- prefixes from strings inside textarea
	    // fix #815: any value -> string
	    if (parent && parent.tagName == 'TEXTAREA') value = ('' + value).replace(/riot-/g, '')

	    // no change
	    if (expr.value === value) return
	    expr.value = value

	    // text node
	    if (!attrName) {
	      dom.nodeValue = '' + value    // #815 related
	      return
	    }

	    // remove original attribute
	    remAttr(dom, attrName)
	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)

	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	          add = function() { insertTo(stub.parentNode, stub, dom) },
	          remove = function() { insertTo(dom.parentNode, dom, stub) }

	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted) el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        else
	        // otherwise we need to wait the updated event
	          (tag.parent || tag).one('updated', remove)

	        dom.inStub = true
	      }
	    // show / hide
	    } else if (/^(show|hide)$/.test(attrName)) {
	      if (attrName == 'hide') value = !value
	      dom.style.display = value ? '' : 'none'

	    // field value
	    } else if (attrName == 'value') {
	      dom.value = value

	    // <img src="{ expr }">
	    } else if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	      if (value)
	        dom.setAttribute(attrName.slice(RIOT_PREFIX.length), value)

	    } else {
	      if (expr.bool) {
	        dom[attrName] = value
	        if (!value) return
	      }

	      if (typeof value !== T_OBJECT) dom.setAttribute(attrName, value)

	    }

	  })

	}
	function each(els, fn) {
	  for (var i = 0, len = (els || []).length, el; i < len; i++) {
	    el = els[i]
	    // return false -> remove current item during loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}

	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}

	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}

	function getTag(dom) {
	  return dom.tagName && tagImpl[dom.getAttribute(RIOT_TAG) || dom.tagName.toLowerCase()]
	}

	function initChildTag(child, dom, parent) {
	  var tag = new Tag(child, { root: dom, parent: parent }, dom.innerHTML),
	      tagName = getTagName(dom),
	      ptag = getImmediateCustomParentTag(parent),
	      cachedTag

	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag

	  cachedTag = ptag.tags[tagName]

	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      ptag.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!~ptag.tags[tagName].indexOf(tag))
	      ptag.tags[tagName].push(tag)
	  } else {
	    ptag.tags[tagName] = tag
	  }

	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  dom.innerHTML = ''

	  return tag
	}

	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}

	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = dom.getAttribute('name'),
	    tagName = namedTag && namedTag.indexOf(brackets(0)) < 0 ? namedTag : child ? child.name : dom.tagName.toLowerCase()

	  return tagName
	}

	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if ((obj = args[i])) {
	      for (var key in obj) {      // eslint-disable-line guard-for-in
	        src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}

	// with this function we avoid that the current Tag methods get overridden
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION)) return data

	  var o = {}
	  for (var key in data) {
	    if (!~RESERVED_WORDS_BLACKLIST.indexOf(key))
	      o[key] = data[key]
	  }
	  return o
	}

	function walk(dom, fn) {
	  if (dom) {
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild

	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}

	// minimize risk: only zero or one _space_ between attr & value
	function walkAttributes(html, fn) {
	  var m,
	      re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g

	  while ((m = re.exec(html))) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}

	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}

	function mkEl(name) {
	  return document.createElement(name)
	}

	function replaceYield(tmpl, innerHTML) {
	  return tmpl.replace(/<(yield)\/?>(<\/\1>)?/gi, innerHTML || '')
	}

	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}

	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}

	function inherit(parent) {
	  function Child() {}
	  Child.prototype = parent
	  return new Child()
	}

	function setNamed(dom, parent, keys) {
	  if (dom._visited) return
	  var p,
	      v = dom.getAttribute('id') || dom.getAttribute('name')

	  if (v) {
	    if (keys.indexOf(v) < 0) {
	      p = parent[v]
	      if (!p)
	        parent[v] = dom
	      else if (isArray(p))
	        p.push(dom)
	      else
	        parent[v] = [p, dom]
	    }
	    dom._visited = true
	  }
	}

	// faster String startsWith alternative
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}

	/*
	 Virtual dom is an array of custom tags on the document.
	 Updates and unmounts propagate downwards from parent to children.
	*/

	var virtualDom = [],
	    tagImpl = {},
	    styleNode

	function injectStyle(css) {

	  if (riot.render) return // skip injection on the server

	  if (!styleNode) {
	    styleNode = mkEl('style')
	    styleNode.setAttribute('type', 'text/css')
	  }

	  var head = document.head || document.getElementsByTagName('head')[0]

	  if (styleNode.styleSheet)
	    styleNode.styleSheet.cssText += css
	  else
	    styleNode.innerHTML += css

	  if (!styleNode._rendered)
	    if (styleNode.styleSheet) {
	      document.body.appendChild(styleNode)
	    } else {
	      var rs = $('style[type=riot]')
	      if (rs) {
	        rs.parentNode.insertBefore(styleNode, rs)
	        rs.parentNode.removeChild(rs)
	      } else head.appendChild(styleNode)

	    }

	  styleNode._rendered = true

	}

	function mountTo(root, tagName, opts) {
	  var tag = tagImpl[tagName],
	      // cache the inner HTML to fix #855
	      innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

	  // clear the inner html
	  root.innerHTML = ''

	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

	  if (tag && tag.mount) {
	    tag.mount()
	    virtualDom.push(tag)
	    return tag.on('unmount', function() {
	      virtualDom.splice(virtualDom.indexOf(tag), 1)
	    })
	  }

	}

	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else injectStyle(css)
	  }
	  tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}

	riot.mount = function(selector, tagName, opts) {

	  var els,
	      allTags,
	      tags = []

	  // helper functions

	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      list += ', *[' + RIOT_TAG + '="' + e.trim() + '"]'
	    })
	    return list
	  }

	  function selectAllTags() {
	    var keys = Object.keys(tagImpl)
	    return keys + addRiotTags(keys)
	  }

	  function pushTags(root) {
	    var last
	    if (root.tagName) {
	      if (tagName && (!(last = root.getAttribute(RIOT_TAG)) || last != tagName))
	        root.setAttribute(RIOT_TAG, tagName)

	      var tag = mountTo(root,
	        tagName || root.getAttribute(RIOT_TAG) || root.tagName.toLowerCase(), opts)

	      if (tag) tags.push(tag)
	    }
	    else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }

	  // ----- mount code -----

	  if (typeof tagName === T_OBJECT) {
	    opts = tagName
	    tagName = 0
	  }

	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(','))

	    els = $$(selector)
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector

	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }

	  if (els.tagName)
	    pushTags(els)
	  else
	    each(els, pushTags)

	  return tags
	}

	// update everything
	riot.update = function() {
	  return each(virtualDom, function(tag) {
	    tag.update()
	  })
	}

	// @deprecated
	riot.mountTo = riot.mount

	  // share methods for other riot parts, e.g. compiler
	  riot.util = { brackets: brackets, tmpl: tmpl }

	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if (true)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return (window.riot = riot) }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot

	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(3, function() {
				var newContent = __webpack_require__(3);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	exports.push([module.id, "@import url(http://fonts.googleapis.com/css?family=Roboto:500,400italic,700italic,300,700,500italic,300italic,400);", ""]);
	exports.push([module.id, "\r\nhtml {\r\n  box-sizing: border-box;\r\n}\r\n*, *:before, *:after {\r\n  box-sizing: inherit;\r\n}\r\n\r\nbody {\r\n  position:absolute;\r\n  top:0;\r\n  left:0;\r\n  right:0;\r\n  bottom:0;\r\n  color: #333;\r\n  margin: 0;\r\n  overflow:hidden;\r\n}\r\n\r\nh1,h2,h3,h4,h5,h6{\r\n  font-family:'Roboto';\r\n  padding: .25rem 0 .25rem .75rem;\r\n  margin: .75rem 0 1rem 0;\r\n  border-bottom:1px solid silver;\r\n}\r\np{\r\n  padding-left:0.75rem;\r\n}\r\ncode, .code{\r\n  display:inline-block;\r\n  background:black;\r\n  color:#00ff00;\r\n  padding:0.75rem;\r\n  margin:0.25rem 1rem 0.25rem 1rem;\r\n  border-radius:0.5rem;\r\n}\r\nblog-collection{\r\n    opacity:0;\r\n  transition: all 1s linear;\r\n}\r\n.fadeIn{\r\n  opacity:1;\r\n}\r\napp{\r\n  position:absolute;\r\n  top:0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n\r\n}\r\napp pages {\r\n  position: absolute;\r\n  top:3rem;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n}\r\napp topmenu{\r\n  position: absolute;\r\n  top:0;\r\n  right: 0;\r\n  height: 3rem;\r\n  left: 0;\r\n  margin:0 auto;\r\n  padding:0.35rem 1rem;\r\n  max-width:64rem;\r\n  background: linear-gradient(to bottom, #a90329 0%,#8f0222 44%,#6d0019 100%);\r\n  z-index:2;\r\n}", ""]);

/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(7);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(7, function() {
				var newContent = __webpack_require__(7);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	exports.push([module.id, ".cell {\r\n\tposition:relative;\r\n \tdisplay:inline-block;\r\n  \tmargin:0;\r\n  \tpadding:0 0.25rem;\r\n}\r\n.cell:first-child{\r\n\tpadding-left:0;\r\n}\r\n.cell:last-child{\r\n\tpadding-right:0;\r\n}\r\n.col1-1{width:100%;}\r\n.col1-2,.col2-4{width:50%;}\r\n.col1-3{width:33.3333%;}\r\n.col2-3{width:66.6667%;}\r\n.col1-4{width:25%;}\r\n.col3-4{width:75%;}\r\n.col1-5{width:20%;}\r\n.col2-5{width:40%;}\r\n.col3-5{width:60%;}\r\n.col4-5{width:80%;}\r\n\r\n@media only screen and (max-device-width: 1024px)  {\r\n.tablet-col1-1{width:100%;}\r\n.tablet-col1-2,.tablet-col2-4{width:50%;}\r\n.tablet-col1-3{width:33.3333%;}\r\n.tablet-col2-3{width:66.6667%;}\r\n.tablet-col1-4{width:25%;}\r\n.tablet-col3-4{width:75%;}\r\n.tablet-col1-5{width:20%;}\r\n.tablet-col2-5{width:40%;}\r\n.tablet-col3-5{width:60%;}\r\n.tablet-col4-5{width:80%;}\r\n}\r\n@media only screen and (max-device-width: 767px)  {\r\n.phone-col1-1{width:100%;}\r\n.phone-col1-2,.phone-col2-4{width:50%;}\r\n.phone-col1-3{width:33.3333%;}\r\n.phone-col2-3{width:66.6667%;}\r\n.phone-col1-4{width:25%;}\r\n.phone-col3-4{width:75%;}\r\n.phone-col1-5{width:20%;}\r\n.phone-col2-5{width:40%;}\r\n.phone-col3-5{width:60%;}\r\n.phone-col4-5{width:80%;}\r\n}", ""]);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(9)(__webpack_require__(10));

/***/ },
/* 9 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(src) {
		if (typeof execScript === "function")
			execScript(src);
		else
			eval.call(null, src);
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "/*!\n * Modernizr v2.8.3\n * www.modernizr.com\n *\n * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton\n * Available under the BSD and MIT licenses: www.modernizr.com/license/\n */\n\n/*\n * Modernizr tests which native CSS3 and HTML5 features are available in\n * the current UA and makes the results available to you in two ways:\n * as properties on a global Modernizr object, and as classes on the\n * <html> element. This information allows you to progressively enhance\n * your pages with a granular level of control over the experience.\n *\n * Modernizr has an optional (not included) conditional resource loader\n * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).\n * To get a build that includes Modernizr.load(), as well as choosing\n * which tests to include, go to www.modernizr.com/download/\n *\n * Authors        Faruk Ates, Paul Irish, Alex Sexton\n * Contributors   Ryan Seddon, Ben Alman\n */\n\nwindow.Modernizr = (function( window, document, undefined ) {\n\n    var version = '2.8.3',\n\n    Modernizr = {},\n\n    /*>>cssclasses*/\n    // option for enabling the HTML classes to be added\n    enableClasses = true,\n    /*>>cssclasses*/\n\n    docElement = document.documentElement,\n\n    /**\n     * Create our \"modernizr\" element that we do most feature tests on.\n     */\n    mod = 'modernizr',\n    modElem = document.createElement(mod),\n    mStyle = modElem.style,\n\n    /**\n     * Create the input element for various Web Forms feature tests.\n     */\n    inputElem /*>>inputelem*/ = document.createElement('input') /*>>inputelem*/ ,\n\n    /*>>smile*/\n    smile = ':)',\n    /*>>smile*/\n\n    toString = {}.toString,\n\n    // TODO :: make the prefixes more granular\n    /*>>prefixes*/\n    // List of property values to set for css tests. See ticket #21\n    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),\n    /*>>prefixes*/\n\n    /*>>domprefixes*/\n    // Following spec is to expose vendor-specific style properties as:\n    //   elem.style.WebkitBorderRadius\n    // and the following would be incorrect:\n    //   elem.style.webkitBorderRadius\n\n    // Webkit ghosts their properties in lowercase but Opera & Moz do not.\n    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+\n    //   erik.eae.net/archives/2008/03/10/21.48.10/\n\n    // More here: github.com/Modernizr/Modernizr/issues/issue/21\n    omPrefixes = 'Webkit Moz O ms',\n\n    cssomPrefixes = omPrefixes.split(' '),\n\n    domPrefixes = omPrefixes.toLowerCase().split(' '),\n    /*>>domprefixes*/\n\n    /*>>ns*/\n    ns = {'svg': 'http://www.w3.org/2000/svg'},\n    /*>>ns*/\n\n    tests = {},\n    inputs = {},\n    attrs = {},\n\n    classes = [],\n\n    slice = classes.slice,\n\n    featureName, // used in testing loop\n\n\n    /*>>teststyles*/\n    // Inject element with style element and some CSS rules\n    injectElementWithStyles = function( rule, callback, nodes, testnames ) {\n\n      var style, ret, node, docOverflow,\n          div = document.createElement('div'),\n          // After page load injecting a fake body doesn't work so check if body exists\n          body = document.body,\n          // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.\n          fakeBody = body || document.createElement('body');\n\n      if ( parseInt(nodes, 10) ) {\n          // In order not to give false positives we create a node for each test\n          // This also allows the method to scale for unspecified uses\n          while ( nodes-- ) {\n              node = document.createElement('div');\n              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);\n              div.appendChild(node);\n          }\n      }\n\n      // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed\n      // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element\n      // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.\n      // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx\n      // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277\n      style = ['&#173;','<style id=\"s', mod, '\">', rule, '</style>'].join('');\n      div.id = mod;\n      // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.\n      // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270\n      (body ? div : fakeBody).innerHTML += style;\n      fakeBody.appendChild(div);\n      if ( !body ) {\n          //avoid crashing IE8, if background image is used\n          fakeBody.style.background = '';\n          //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible\n          fakeBody.style.overflow = 'hidden';\n          docOverflow = docElement.style.overflow;\n          docElement.style.overflow = 'hidden';\n          docElement.appendChild(fakeBody);\n      }\n\n      ret = callback(div, rule);\n      // If this is done after page load we don't want to remove the body so check if body exists\n      if ( !body ) {\n          fakeBody.parentNode.removeChild(fakeBody);\n          docElement.style.overflow = docOverflow;\n      } else {\n          div.parentNode.removeChild(div);\n      }\n\n      return !!ret;\n\n    },\n    /*>>teststyles*/\n\n    /*>>mq*/\n    // adapted from matchMedia polyfill\n    // by Scott Jehl and Paul Irish\n    // gist.github.com/786768\n    testMediaQuery = function( mq ) {\n\n      var matchMedia = window.matchMedia || window.msMatchMedia;\n      if ( matchMedia ) {\n        return matchMedia(mq) && matchMedia(mq).matches || false;\n      }\n\n      var bool;\n\n      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {\n        bool = (window.getComputedStyle ?\n                  getComputedStyle(node, null) :\n                  node.currentStyle)['position'] == 'absolute';\n      });\n\n      return bool;\n\n     },\n     /*>>mq*/\n\n\n    /*>>hasevent*/\n    //\n    // isEventSupported determines if a given element supports the given event\n    // kangax.github.com/iseventsupported/\n    //\n    // The following results are known incorrects:\n    //   Modernizr.hasEvent(\"webkitTransitionEnd\", elem) // false negative\n    //   Modernizr.hasEvent(\"textInput\") // in Webkit. github.com/Modernizr/Modernizr/issues/333\n    //   ...\n    isEventSupported = (function() {\n\n      var TAGNAMES = {\n        'select': 'input', 'change': 'input',\n        'submit': 'form', 'reset': 'form',\n        'error': 'img', 'load': 'img', 'abort': 'img'\n      };\n\n      function isEventSupported( eventName, element ) {\n\n        element = element || document.createElement(TAGNAMES[eventName] || 'div');\n        eventName = 'on' + eventName;\n\n        // When using `setAttribute`, IE skips \"unload\", WebKit skips \"unload\" and \"resize\", whereas `in` \"catches\" those\n        var isSupported = eventName in element;\n\n        if ( !isSupported ) {\n          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element\n          if ( !element.setAttribute ) {\n            element = document.createElement('div');\n          }\n          if ( element.setAttribute && element.removeAttribute ) {\n            element.setAttribute(eventName, '');\n            isSupported = is(element[eventName], 'function');\n\n            // If property was created, \"remove it\" (by setting value to `undefined`)\n            if ( !is(element[eventName], 'undefined') ) {\n              element[eventName] = undefined;\n            }\n            element.removeAttribute(eventName);\n          }\n        }\n\n        element = null;\n        return isSupported;\n      }\n      return isEventSupported;\n    })(),\n    /*>>hasevent*/\n\n    // TODO :: Add flag for hasownprop ? didn't last time\n\n    // hasOwnProperty shim by kangax needed for Safari 2.0 support\n    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;\n\n    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {\n      hasOwnProp = function (object, property) {\n        return _hasOwnProperty.call(object, property);\n      };\n    }\n    else {\n      hasOwnProp = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */\n        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));\n      };\n    }\n\n    // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js\n    // es5.github.com/#x15.3.4.5\n\n    if (!Function.prototype.bind) {\n      Function.prototype.bind = function bind(that) {\n\n        var target = this;\n\n        if (typeof target != \"function\") {\n            throw new TypeError();\n        }\n\n        var args = slice.call(arguments, 1),\n            bound = function () {\n\n            if (this instanceof bound) {\n\n              var F = function(){};\n              F.prototype = target.prototype;\n              var self = new F();\n\n              var result = target.apply(\n                  self,\n                  args.concat(slice.call(arguments))\n              );\n              if (Object(result) === result) {\n                  return result;\n              }\n              return self;\n\n            } else {\n\n              return target.apply(\n                  that,\n                  args.concat(slice.call(arguments))\n              );\n\n            }\n\n        };\n\n        return bound;\n      };\n    }\n\n    /**\n     * setCss applies given styles to the Modernizr DOM node.\n     */\n    function setCss( str ) {\n        mStyle.cssText = str;\n    }\n\n    /**\n     * setCssAll extrapolates all vendor-specific css strings.\n     */\n    function setCssAll( str1, str2 ) {\n        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));\n    }\n\n    /**\n     * is returns a boolean for if typeof obj is exactly type.\n     */\n    function is( obj, type ) {\n        return typeof obj === type;\n    }\n\n    /**\n     * contains returns a boolean for if substr is found within str.\n     */\n    function contains( str, substr ) {\n        return !!~('' + str).indexOf(substr);\n    }\n\n    /*>>testprop*/\n\n    // testProps is a generic CSS / DOM property test.\n\n    // In testing support for a given CSS property, it's legit to test:\n    //    `elem.style[styleName] !== undefined`\n    // If the property is supported it will return an empty string,\n    // if unsupported it will return undefined.\n\n    // We'll take advantage of this quick test and skip setting a style\n    // on our modernizr element, but instead just testing undefined vs\n    // empty string.\n\n    // Because the testing of the CSS property names (with \"-\", as\n    // opposed to the camelCase DOM properties) is non-portable and\n    // non-standard but works in WebKit and IE (but not Gecko or Opera),\n    // we explicitly reject properties with dashes so that authors\n    // developing in WebKit or IE first don't end up with\n    // browser-specific content by accident.\n\n    function testProps( props, prefixed ) {\n        for ( var i in props ) {\n            var prop = props[i];\n            if ( !contains(prop, \"-\") && mStyle[prop] !== undefined ) {\n                return prefixed == 'pfx' ? prop : true;\n            }\n        }\n        return false;\n    }\n    /*>>testprop*/\n\n    // TODO :: add testDOMProps\n    /**\n     * testDOMProps is a generic DOM property test; if a browser supports\n     *   a certain property, it won't return undefined for it.\n     */\n    function testDOMProps( props, obj, elem ) {\n        for ( var i in props ) {\n            var item = obj[props[i]];\n            if ( item !== undefined) {\n\n                // return the property name as a string\n                if (elem === false) return props[i];\n\n                // let's bind a function\n                if (is(item, 'function')){\n                  // default to autobind unless override\n                  return item.bind(elem || obj);\n                }\n\n                // return the unbound function or obj or value\n                return item;\n            }\n        }\n        return false;\n    }\n\n    /*>>testallprops*/\n    /**\n     * testPropsAll tests a list of DOM properties we want to check against.\n     *   We specify literally ALL possible (known and/or likely) properties on\n     *   the element including the non-vendor prefixed one, for forward-\n     *   compatibility.\n     */\n    function testPropsAll( prop, prefixed, elem ) {\n\n        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),\n            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');\n\n        // did they call .prefixed('boxSizing') or are we just testing a prop?\n        if(is(prefixed, \"string\") || is(prefixed, \"undefined\")) {\n          return testProps(props, prefixed);\n\n        // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])\n        } else {\n          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');\n          return testDOMProps(props, prefixed, elem);\n        }\n    }\n    /*>>testallprops*/\n\n\n    /**\n     * Tests\n     * -----\n     */\n\n    // The *new* flexbox\n    // dev.w3.org/csswg/css3-flexbox\n\n    tests['flexbox'] = function() {\n      return testPropsAll('flexWrap');\n    };\n\n    // The *old* flexbox\n    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/\n\n    tests['flexboxlegacy'] = function() {\n        return testPropsAll('boxDirection');\n    };\n\n    // On the S60 and BB Storm, getContext exists, but always returns undefined\n    // so we actually have to call getContext() to verify\n    // github.com/Modernizr/Modernizr/issues/issue/97/\n\n    tests['canvas'] = function() {\n        var elem = document.createElement('canvas');\n        return !!(elem.getContext && elem.getContext('2d'));\n    };\n\n    tests['canvastext'] = function() {\n        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));\n    };\n\n    // webk.it/70117 is tracking a legit WebGL feature detect proposal\n\n    // We do a soft detect which may false positive in order to avoid\n    // an expensive context creation: bugzil.la/732441\n\n    tests['webgl'] = function() {\n        return !!window.WebGLRenderingContext;\n    };\n\n    /*\n     * The Modernizr.touch test only indicates if the browser supports\n     *    touch events, which does not necessarily reflect a touchscreen\n     *    device, as evidenced by tablets running Windows 7 or, alas,\n     *    the Palm Pre / WebOS (touch) phones.\n     *\n     * Additionally, Chrome (desktop) used to lie about its support on this,\n     *    but that has since been rectified: crbug.com/36415\n     *\n     * We also test for Firefox 4 Multitouch Support.\n     *\n     * For more info, see: modernizr.github.com/Modernizr/touch.html\n     */\n\n    tests['touch'] = function() {\n        var bool;\n\n        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {\n          bool = true;\n        } else {\n          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {\n            bool = node.offsetTop === 9;\n          });\n        }\n\n        return bool;\n    };\n\n\n    // geolocation is often considered a trivial feature detect...\n    // Turns out, it's quite tricky to get right:\n    //\n    // Using !!navigator.geolocation does two things we don't want. It:\n    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513\n    //   2. Disables page caching in WebKit: webk.it/43956\n    //\n    // Meanwhile, in Firefox < 8, an about:config setting could expose\n    // a false positive that would throw an exception: bugzil.la/688158\n\n    tests['geolocation'] = function() {\n        return 'geolocation' in navigator;\n    };\n\n\n    tests['postmessage'] = function() {\n      return !!window.postMessage;\n    };\n\n\n    // Chrome incognito mode used to throw an exception when using openDatabase\n    // It doesn't anymore.\n    tests['websqldatabase'] = function() {\n      return !!window.openDatabase;\n    };\n\n    // Vendors had inconsistent prefixing with the experimental Indexed DB:\n    // - Webkit's implementation is accessible through webkitIndexedDB\n    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB\n    // For speed, we don't test the legacy (and beta-only) indexedDB\n    tests['indexedDB'] = function() {\n      return !!testPropsAll(\"indexedDB\", window);\n    };\n\n    // documentMode logic from YUI to filter out IE8 Compat Mode\n    //   which false positives.\n    tests['hashchange'] = function() {\n      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);\n    };\n\n    // Per 1.6:\n    // This used to be Modernizr.historymanagement but the longer\n    // name has been deprecated in favor of a shorter and property-matching one.\n    // The old API is still available in 1.6, but as of 2.0 will throw a warning,\n    // and in the first release thereafter disappear entirely.\n    tests['history'] = function() {\n      return !!(window.history && history.pushState);\n    };\n\n    tests['draganddrop'] = function() {\n        var div = document.createElement('div');\n        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);\n    };\n\n    // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10\n    // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.\n    // FF10 still uses prefixes, so check for it until then.\n    // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/\n    tests['websockets'] = function() {\n        return 'WebSocket' in window || 'MozWebSocket' in window;\n    };\n\n\n    // css-tricks.com/rgba-browser-support/\n    tests['rgba'] = function() {\n        // Set an rgba() color and check the returned value\n\n        setCss('background-color:rgba(150,255,150,.5)');\n\n        return contains(mStyle.backgroundColor, 'rgba');\n    };\n\n    tests['hsla'] = function() {\n        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,\n        //   except IE9 who retains it as hsla\n\n        setCss('background-color:hsla(120,40%,100%,.5)');\n\n        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');\n    };\n\n    tests['multiplebgs'] = function() {\n        // Setting multiple images AND a color on the background shorthand property\n        //  and then querying the style.background property value for the number of\n        //  occurrences of \"url(\" is a reliable method for detecting ACTUAL support for this!\n\n        setCss('background:url(https://),url(https://),red url(https://)');\n\n        // If the UA supports multiple backgrounds, there should be three occurrences\n        //   of the string \"url(\" in the return value for elemStyle.background\n\n        return (/(url\\s*\\(.*?){3}/).test(mStyle.background);\n    };\n\n\n\n    // this will false positive in Opera Mini\n    //   github.com/Modernizr/Modernizr/issues/396\n\n    tests['backgroundsize'] = function() {\n        return testPropsAll('backgroundSize');\n    };\n\n    tests['borderimage'] = function() {\n        return testPropsAll('borderImage');\n    };\n\n\n    // Super comprehensive table about all the unique implementations of\n    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance\n\n    tests['borderradius'] = function() {\n        return testPropsAll('borderRadius');\n    };\n\n    // WebOS unfortunately false positives on this test.\n    tests['boxshadow'] = function() {\n        return testPropsAll('boxShadow');\n    };\n\n    // FF3.0 will false positive on this test\n    tests['textshadow'] = function() {\n        return document.createElement('div').style.textShadow === '';\n    };\n\n\n    tests['opacity'] = function() {\n        // Browsers that actually have CSS Opacity implemented have done so\n        //  according to spec, which means their return values are within the\n        //  range of [0.0,1.0] - including the leading zero.\n\n        setCssAll('opacity:.55');\n\n        // The non-literal . in this regex is intentional:\n        //   German Chrome returns this value as 0,55\n        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632\n        return (/^0.55$/).test(mStyle.opacity);\n    };\n\n\n    // Note, Android < 4 will pass this test, but can only animate\n    //   a single property at a time\n    //   goo.gl/v3V4Gp\n    tests['cssanimations'] = function() {\n        return testPropsAll('animationName');\n    };\n\n\n    tests['csscolumns'] = function() {\n        return testPropsAll('columnCount');\n    };\n\n\n    tests['cssgradients'] = function() {\n        /**\n         * For CSS Gradients syntax, please see:\n         * webkit.org/blog/175/introducing-css-gradients/\n         * developer.mozilla.org/en/CSS/-moz-linear-gradient\n         * developer.mozilla.org/en/CSS/-moz-radial-gradient\n         * dev.w3.org/csswg/css3-images/#gradients-\n         */\n\n        var str1 = 'background-image:',\n            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',\n            str3 = 'linear-gradient(left top,#9f9, white);';\n\n        setCss(\n             // legacy webkit syntax (FIXME: remove when syntax not in use anymore)\n              (str1 + '-webkit- '.split(' ').join(str2 + str1) +\n             // standard syntax             // trailing 'background-image:'\n              prefixes.join(str3 + str1)).slice(0, -str1.length)\n        );\n\n        return contains(mStyle.backgroundImage, 'gradient');\n    };\n\n\n    tests['cssreflections'] = function() {\n        return testPropsAll('boxReflect');\n    };\n\n\n    tests['csstransforms'] = function() {\n        return !!testPropsAll('transform');\n    };\n\n\n    tests['csstransforms3d'] = function() {\n\n        var ret = !!testPropsAll('perspective');\n\n        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.\n        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in\n        //   some conditions. As a result, Webkit typically recognizes the syntax but\n        //   will sometimes throw a false positive, thus we must do a more thorough check:\n        if ( ret && 'webkitPerspective' in docElement.style ) {\n\n          // Webkit allows this media query to succeed only if the feature is enabled.\n          // `@media (transform-3d),(-webkit-transform-3d){ ... }`\n          injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {\n            ret = node.offsetLeft === 9 && node.offsetHeight === 3;\n          });\n        }\n        return ret;\n    };\n\n\n    tests['csstransitions'] = function() {\n        return testPropsAll('transition');\n    };\n\n\n    /*>>fontface*/\n    // @font-face detection routine by Diego Perini\n    // javascript.nwbox.com/CSSSupport/\n\n    // false positives:\n    //   WebOS github.com/Modernizr/Modernizr/issues/342\n    //   WP7   github.com/Modernizr/Modernizr/issues/538\n    tests['fontface'] = function() {\n        var bool;\n\n        injectElementWithStyles('@font-face {font-family:\"font\";src:url(\"https://\")}', function( node, rule ) {\n          var style = document.getElementById('smodernizr'),\n              sheet = style.sheet || style.styleSheet,\n              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';\n\n          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;\n        });\n\n        return bool;\n    };\n    /*>>fontface*/\n\n    // CSS generated content detection\n    tests['generatedcontent'] = function() {\n        var bool;\n\n        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:\"',smile,'\";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {\n          bool = node.offsetHeight >= 3;\n        });\n\n        return bool;\n    };\n\n\n\n    // These tests evaluate support of the video/audio elements, as well as\n    // testing what types of content they support.\n    //\n    // We're using the Boolean constructor here, so that we can extend the value\n    // e.g.  Modernizr.video     // true\n    //       Modernizr.video.ogg // 'probably'\n    //\n    // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845\n    //                     thx to NielsLeenheer and zcorpan\n\n    // Note: in some older browsers, \"no\" was a return value instead of empty string.\n    //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2\n    //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5\n\n    tests['video'] = function() {\n        var elem = document.createElement('video'),\n            bool = false;\n\n        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224\n        try {\n            if ( bool = !!elem.canPlayType ) {\n                bool      = new Boolean(bool);\n                bool.ogg  = elem.canPlayType('video/ogg; codecs=\"theora\"')      .replace(/^no$/,'');\n\n                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546\n                bool.h264 = elem.canPlayType('video/mp4; codecs=\"avc1.42E01E\"') .replace(/^no$/,'');\n\n                bool.webm = elem.canPlayType('video/webm; codecs=\"vp8, vorbis\"').replace(/^no$/,'');\n            }\n\n        } catch(e) { }\n\n        return bool;\n    };\n\n    tests['audio'] = function() {\n        var elem = document.createElement('audio'),\n            bool = false;\n\n        try {\n            if ( bool = !!elem.canPlayType ) {\n                bool      = new Boolean(bool);\n                bool.ogg  = elem.canPlayType('audio/ogg; codecs=\"vorbis\"').replace(/^no$/,'');\n                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');\n\n                // Mimetypes accepted:\n                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements\n                //   bit.ly/iphoneoscodecs\n                bool.wav  = elem.canPlayType('audio/wav; codecs=\"1\"')     .replace(/^no$/,'');\n                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||\n                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');\n            }\n        } catch(e) { }\n\n        return bool;\n    };\n\n\n    // In FF4, if disabled, window.localStorage should === null.\n\n    // Normally, we could not test that directly and need to do a\n    //   `('localStorage' in window) && ` test first because otherwise Firefox will\n    //   throw bugzil.la/365772 if cookies are disabled\n\n    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem\n    // will throw the exception:\n    //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.\n    // Peculiarly, getItem and removeItem calls do not throw.\n\n    // Because we are forced to try/catch this, we'll go aggressive.\n\n    // Just FWIW: IE8 Compat mode supports these features completely:\n    //   www.quirksmode.org/dom/html5.html\n    // But IE8 doesn't support either with local files\n\n    tests['localstorage'] = function() {\n        try {\n            localStorage.setItem(mod, mod);\n            localStorage.removeItem(mod);\n            return true;\n        } catch(e) {\n            return false;\n        }\n    };\n\n    tests['sessionstorage'] = function() {\n        try {\n            sessionStorage.setItem(mod, mod);\n            sessionStorage.removeItem(mod);\n            return true;\n        } catch(e) {\n            return false;\n        }\n    };\n\n\n    tests['webworkers'] = function() {\n        return !!window.Worker;\n    };\n\n\n    tests['applicationcache'] = function() {\n        return !!window.applicationCache;\n    };\n\n\n    // Thanks to Erik Dahlstrom\n    tests['svg'] = function() {\n        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;\n    };\n\n    // specifically for SVG inline in HTML, not within XHTML\n    // test page: paulirish.com/demo/inline-svg\n    tests['inlinesvg'] = function() {\n      var div = document.createElement('div');\n      div.innerHTML = '<svg/>';\n      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;\n    };\n\n    // SVG SMIL animation\n    tests['smil'] = function() {\n        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));\n    };\n\n    // This test is only for clip paths in SVG proper, not clip paths on HTML content\n    // demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg\n\n    // However read the comments to dig into applying SVG clippaths to HTML content here:\n    //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491\n    tests['svgclippaths'] = function() {\n        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));\n    };\n\n    /*>>webforms*/\n    // input features and input types go directly onto the ret object, bypassing the tests loop.\n    // Hold this guy to execute in a moment.\n    function webforms() {\n        /*>>input*/\n        // Run through HTML5's new input attributes to see if the UA understands any.\n        // We're using f which is the <input> element created early on\n        // Mike Taylr has created a comprehensive resource for testing these attributes\n        //   when applied to all input types:\n        //   miketaylr.com/code/input-type-attr.html\n        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary\n\n        // Only input placeholder is tested while textarea's placeholder is not.\n        // Currently Safari 4 and Opera 11 have support only for the input placeholder\n        // Both tests are available in feature-detects/forms-placeholder.js\n        Modernizr['input'] = (function( props ) {\n            for ( var i = 0, len = props.length; i < len; i++ ) {\n                attrs[ props[i] ] = !!(props[i] in inputElem);\n            }\n            if (attrs.list){\n              // safari false positive's on datalist: webk.it/74252\n              // see also github.com/Modernizr/Modernizr/issues/146\n              attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);\n            }\n            return attrs;\n        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));\n        /*>>input*/\n\n        /*>>inputtypes*/\n        // Run through HTML5's new input types to see if the UA understands any.\n        //   This is put behind the tests runloop because it doesn't return a\n        //   true/false like all the other tests; instead, it returns an object\n        //   containing each input type with its corresponding true/false value\n\n        // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/\n        Modernizr['inputtypes'] = (function(props) {\n\n            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {\n\n                inputElem.setAttribute('type', inputElemType = props[i]);\n                bool = inputElem.type !== 'text';\n\n                // We first check to see if the type we give it sticks..\n                // If the type does, we feed it a textual value, which shouldn't be valid.\n                // If the value doesn't stick, we know there's input sanitization which infers a custom UI\n                if ( bool ) {\n\n                    inputElem.value         = smile;\n                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';\n\n                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {\n\n                      docElement.appendChild(inputElem);\n                      defaultView = document.defaultView;\n\n                      // Safari 2-4 allows the smiley as a value, despite making a slider\n                      bool =  defaultView.getComputedStyle &&\n                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&\n                              // Mobile android web browser has false positive, so must\n                              // check the height to see if the widget is actually there.\n                              (inputElem.offsetHeight !== 0);\n\n                      docElement.removeChild(inputElem);\n\n                    } else if ( /^(search|tel)$/.test(inputElemType) ){\n                      // Spec doesn't define any special parsing or detectable UI\n                      //   behaviors so we pass these through as true\n\n                      // Interestingly, opera fails the earlier test, so it doesn't\n                      //  even make it here.\n\n                    } else if ( /^(url|email)$/.test(inputElemType) ) {\n                      // Real url and email support comes with prebaked validation.\n                      bool = inputElem.checkValidity && inputElem.checkValidity() === false;\n\n                    } else {\n                      // If the upgraded input compontent rejects the :) text, we got a winner\n                      bool = inputElem.value != smile;\n                    }\n                }\n\n                inputs[ props[i] ] = !!bool;\n            }\n            return inputs;\n        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));\n        /*>>inputtypes*/\n    }\n    /*>>webforms*/\n\n\n    // End of test definitions\n    // -----------------------\n\n\n\n    // Run through all tests and detect their support in the current UA.\n    // todo: hypothetically we could be doing an array of tests and use a basic loop here.\n    for ( var feature in tests ) {\n        if ( hasOwnProp(tests, feature) ) {\n            // run the test, throw the return value into the Modernizr,\n            //   then based on that boolean, define an appropriate className\n            //   and push it into an array of classes we'll join later.\n            featureName  = feature.toLowerCase();\n            Modernizr[featureName] = tests[feature]();\n\n            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);\n        }\n    }\n\n    /*>>webforms*/\n    // input tests need to run.\n    Modernizr.input || webforms();\n    /*>>webforms*/\n\n\n    /**\n     * addTest allows the user to define their own feature tests\n     * the result will be added onto the Modernizr object,\n     * as well as an appropriate className set on the html element\n     *\n     * @param feature - String naming the feature\n     * @param test - Function returning true if feature is supported, false if not\n     */\n     Modernizr.addTest = function ( feature, test ) {\n       if ( typeof feature == 'object' ) {\n         for ( var key in feature ) {\n           if ( hasOwnProp( feature, key ) ) {\n             Modernizr.addTest( key, feature[ key ] );\n           }\n         }\n       } else {\n\n         feature = feature.toLowerCase();\n\n         if ( Modernizr[feature] !== undefined ) {\n           // we're going to quit if you're trying to overwrite an existing test\n           // if we were to allow it, we'd do this:\n           //   var re = new RegExp(\"\\\\b(no-)?\" + feature + \"\\\\b\");\n           //   docElement.className = docElement.className.replace( re, '' );\n           // but, no rly, stuff 'em.\n           return Modernizr;\n         }\n\n         test = typeof test == 'function' ? test() : test;\n\n         if (typeof enableClasses !== \"undefined\" && enableClasses) {\n           docElement.className += ' ' + (test ? '' : 'no-') + feature;\n         }\n         Modernizr[feature] = test;\n\n       }\n\n       return Modernizr; // allow chaining.\n     };\n\n\n    // Reset modElem.cssText to nothing to reduce memory footprint.\n    setCss('');\n    modElem = inputElem = null;\n\n    /*>>shiv*/\n    /**\n     * @preserve HTML5 Shiv prev3.7.1 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed\n     */\n    ;(function(window, document) {\n        /*jshint evil:true */\n        /** version */\n        var version = '3.7.0';\n\n        /** Preset options */\n        var options = window.html5 || {};\n\n        /** Used to skip problem elements */\n        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;\n\n        /** Not all elements can be cloned in IE **/\n        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;\n\n        /** Detect whether the browser supports default html5 styles */\n        var supportsHtml5Styles;\n\n        /** Name of the expando, to work with multiple documents or to re-shiv one document */\n        var expando = '_html5shiv';\n\n        /** The id for the the documents expando */\n        var expanID = 0;\n\n        /** Cached data for each document */\n        var expandoData = {};\n\n        /** Detect whether the browser supports unknown elements */\n        var supportsUnknownElements;\n\n        (function() {\n          try {\n            var a = document.createElement('a');\n            a.innerHTML = '<xyz></xyz>';\n            //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles\n            supportsHtml5Styles = ('hidden' in a);\n\n            supportsUnknownElements = a.childNodes.length == 1 || (function() {\n              // assign a false positive if unable to shiv\n              (document.createElement)('a');\n              var frag = document.createDocumentFragment();\n              return (\n                typeof frag.cloneNode == 'undefined' ||\n                typeof frag.createDocumentFragment == 'undefined' ||\n                typeof frag.createElement == 'undefined'\n              );\n            }());\n          } catch(e) {\n            // assign a false positive if detection fails => unable to shiv\n            supportsHtml5Styles = true;\n            supportsUnknownElements = true;\n          }\n\n        }());\n\n        /*--------------------------------------------------------------------------*/\n\n        /**\n         * Creates a style sheet with the given CSS text and adds it to the document.\n         * @private\n         * @param {Document} ownerDocument The document.\n         * @param {String} cssText The CSS text.\n         * @returns {StyleSheet} The style element.\n         */\n        function addStyleSheet(ownerDocument, cssText) {\n          var p = ownerDocument.createElement('p'),\n          parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;\n\n          p.innerHTML = 'x<style>' + cssText + '</style>';\n          return parent.insertBefore(p.lastChild, parent.firstChild);\n        }\n\n        /**\n         * Returns the value of `html5.elements` as an array.\n         * @private\n         * @returns {Array} An array of shived element node names.\n         */\n        function getElements() {\n          var elements = html5.elements;\n          return typeof elements == 'string' ? elements.split(' ') : elements;\n        }\n\n        /**\n         * Returns the data associated to the given document\n         * @private\n         * @param {Document} ownerDocument The document.\n         * @returns {Object} An object of data.\n         */\n        function getExpandoData(ownerDocument) {\n          var data = expandoData[ownerDocument[expando]];\n          if (!data) {\n            data = {};\n            expanID++;\n            ownerDocument[expando] = expanID;\n            expandoData[expanID] = data;\n          }\n          return data;\n        }\n\n        /**\n         * returns a shived element for the given nodeName and document\n         * @memberOf html5\n         * @param {String} nodeName name of the element\n         * @param {Document} ownerDocument The context document.\n         * @returns {Object} The shived element.\n         */\n        function createElement(nodeName, ownerDocument, data){\n          if (!ownerDocument) {\n            ownerDocument = document;\n          }\n          if(supportsUnknownElements){\n            return ownerDocument.createElement(nodeName);\n          }\n          if (!data) {\n            data = getExpandoData(ownerDocument);\n          }\n          var node;\n\n          if (data.cache[nodeName]) {\n            node = data.cache[nodeName].cloneNode();\n          } else if (saveClones.test(nodeName)) {\n            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();\n          } else {\n            node = data.createElem(nodeName);\n          }\n\n          // Avoid adding some elements to fragments in IE < 9 because\n          // * Attributes like `name` or `type` cannot be set/changed once an element\n          //   is inserted into a document/fragment\n          // * Link elements with `src` attributes that are inaccessible, as with\n          //   a 403 response, will cause the tab/window to crash\n          // * Script elements appended to fragments will execute when their `src`\n          //   or `text` property is set\n          return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;\n        }\n\n        /**\n         * returns a shived DocumentFragment for the given document\n         * @memberOf html5\n         * @param {Document} ownerDocument The context document.\n         * @returns {Object} The shived DocumentFragment.\n         */\n        function createDocumentFragment(ownerDocument, data){\n          if (!ownerDocument) {\n            ownerDocument = document;\n          }\n          if(supportsUnknownElements){\n            return ownerDocument.createDocumentFragment();\n          }\n          data = data || getExpandoData(ownerDocument);\n          var clone = data.frag.cloneNode(),\n          i = 0,\n          elems = getElements(),\n          l = elems.length;\n          for(;i<l;i++){\n            clone.createElement(elems[i]);\n          }\n          return clone;\n        }\n\n        /**\n         * Shivs the `createElement` and `createDocumentFragment` methods of the document.\n         * @private\n         * @param {Document|DocumentFragment} ownerDocument The document.\n         * @param {Object} data of the document.\n         */\n        function shivMethods(ownerDocument, data) {\n          if (!data.cache) {\n            data.cache = {};\n            data.createElem = ownerDocument.createElement;\n            data.createFrag = ownerDocument.createDocumentFragment;\n            data.frag = data.createFrag();\n          }\n\n\n          ownerDocument.createElement = function(nodeName) {\n            //abort shiv\n            if (!html5.shivMethods) {\n              return data.createElem(nodeName);\n            }\n            return createElement(nodeName, ownerDocument, data);\n          };\n\n          ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +\n                                                          'var n=f.cloneNode(),c=n.createElement;' +\n                                                          'h.shivMethods&&(' +\n                                                          // unroll the `createElement` calls\n                                                          getElements().join().replace(/[\\w\\-]+/g, function(nodeName) {\n            data.createElem(nodeName);\n            data.frag.createElement(nodeName);\n            return 'c(\"' + nodeName + '\")';\n          }) +\n            ');return n}'\n                                                         )(html5, data.frag);\n        }\n\n        /*--------------------------------------------------------------------------*/\n\n        /**\n         * Shivs the given document.\n         * @memberOf html5\n         * @param {Document} ownerDocument The document to shiv.\n         * @returns {Document} The shived document.\n         */\n        function shivDocument(ownerDocument) {\n          if (!ownerDocument) {\n            ownerDocument = document;\n          }\n          var data = getExpandoData(ownerDocument);\n\n          if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {\n            data.hasCSS = !!addStyleSheet(ownerDocument,\n                                          // corrects block display not defined in IE6/7/8/9\n                                          'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +\n                                            // adds styling not present in IE6/7/8/9\n                                            'mark{background:#FF0;color:#000}' +\n                                            // hides non-rendered elements\n                                            'template{display:none}'\n                                         );\n          }\n          if (!supportsUnknownElements) {\n            shivMethods(ownerDocument, data);\n          }\n          return ownerDocument;\n        }\n\n        /*--------------------------------------------------------------------------*/\n\n        /**\n         * The `html5` object is exposed so that more elements can be shived and\n         * existing shiving can be detected on iframes.\n         * @type Object\n         * @example\n         *\n         * // options can be changed before the script is included\n         * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };\n         */\n        var html5 = {\n\n          /**\n           * An array or space separated string of node names of the elements to shiv.\n           * @memberOf html5\n           * @type Array|String\n           */\n          'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',\n\n          /**\n           * current version of html5shiv\n           */\n          'version': version,\n\n          /**\n           * A flag to indicate that the HTML5 style sheet should be inserted.\n           * @memberOf html5\n           * @type Boolean\n           */\n          'shivCSS': (options.shivCSS !== false),\n\n          /**\n           * Is equal to true if a browser supports creating unknown/HTML5 elements\n           * @memberOf html5\n           * @type boolean\n           */\n          'supportsUnknownElements': supportsUnknownElements,\n\n          /**\n           * A flag to indicate that the document's `createElement` and `createDocumentFragment`\n           * methods should be overwritten.\n           * @memberOf html5\n           * @type Boolean\n           */\n          'shivMethods': (options.shivMethods !== false),\n\n          /**\n           * A string to describe the type of `html5` object (\"default\" or \"default print\").\n           * @memberOf html5\n           * @type String\n           */\n          'type': 'default',\n\n          // shivs the document according to the specified `html5` object options\n          'shivDocument': shivDocument,\n\n          //creates a shived element\n          createElement: createElement,\n\n          //creates a shived documentFragment\n          createDocumentFragment: createDocumentFragment\n        };\n\n        /*--------------------------------------------------------------------------*/\n\n        // expose html5\n        window.html5 = html5;\n\n        // shiv the document\n        shivDocument(document);\n\n    }(this, document));\n    /*>>shiv*/\n\n    // Assign private properties to the return object with prefix\n    Modernizr._version      = version;\n\n    // expose these for the plugin API. Look in the source for how to join() them against your input\n    /*>>prefixes*/\n    Modernizr._prefixes     = prefixes;\n    /*>>prefixes*/\n    /*>>domprefixes*/\n    Modernizr._domPrefixes  = domPrefixes;\n    Modernizr._cssomPrefixes  = cssomPrefixes;\n    /*>>domprefixes*/\n\n    /*>>mq*/\n    // Modernizr.mq tests a given media query, live against the current state of the window\n    // A few important notes:\n    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false\n    //   * A max-width or orientation query will be evaluated against the current state, which may change later.\n    //   * You must specify values. Eg. If you are testing support for the min-width media query use:\n    //       Modernizr.mq('(min-width:0)')\n    // usage:\n    // Modernizr.mq('only screen and (max-width:768)')\n    Modernizr.mq            = testMediaQuery;\n    /*>>mq*/\n\n    /*>>hasevent*/\n    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on\n    // Modernizr.hasEvent('gesturestart', elem)\n    Modernizr.hasEvent      = isEventSupported;\n    /*>>hasevent*/\n\n    /*>>testprop*/\n    // Modernizr.testProp() investigates whether a given style property is recognized\n    // Note that the property names must be provided in the camelCase variant.\n    // Modernizr.testProp('pointerEvents')\n    Modernizr.testProp      = function(prop){\n        return testProps([prop]);\n    };\n    /*>>testprop*/\n\n    /*>>testallprops*/\n    // Modernizr.testAllProps() investigates whether a given style property,\n    //   or any of its vendor-prefixed variants, is recognized\n    // Note that the property names must be provided in the camelCase variant.\n    // Modernizr.testAllProps('boxSizing')\n    Modernizr.testAllProps  = testPropsAll;\n    /*>>testallprops*/\n\n\n    /*>>teststyles*/\n    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards\n    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })\n    Modernizr.testStyles    = injectElementWithStyles;\n    /*>>teststyles*/\n\n\n    /*>>prefixed*/\n    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input\n    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'\n\n    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.\n    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:\n    //\n    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');\n\n    // If you're trying to ascertain which transition end event to bind to, you might do something like...\n    //\n    //     var transEndEventNames = {\n    //       'WebkitTransition' : 'webkitTransitionEnd',\n    //       'MozTransition'    : 'transitionend',\n    //       'OTransition'      : 'oTransitionEnd',\n    //       'msTransition'     : 'MSTransitionEnd',\n    //       'transition'       : 'transitionend'\n    //     },\n    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];\n\n    Modernizr.prefixed      = function(prop, obj, elem){\n      if(!obj) {\n        return testPropsAll(prop, 'pfx');\n      } else {\n        // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'\n        return testPropsAll(prop, obj, elem);\n      }\n    };\n    /*>>prefixed*/\n\n\n    /*>>cssclasses*/\n    // Remove \"no-js\" class from <html> element, if it exists:\n    docElement.className = docElement.className.replace(/(^|\\s)no-js(\\s|$)/, '$1$2') +\n\n                            // Add the new classes to the <html> element.\n                            (enableClasses ? ' js ' + classes.join(' ') : '');\n    /*>>cssclasses*/\n\n    return Modernizr;\n\n})(this, this.document);\n"

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {/*
	jQuery Credit Card Validator 1.0

	Copyright 2012-2015 Pawel Decowski

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software
	is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included
	in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
	THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
	IN THE SOFTWARE.
	 */

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	;(function () {
		'use strict';

		function validateCreditCard(input) {
			var __indexOf = [].indexOf || function (item) {
				for (var i = 0, l = this.length; i < l; i++) {
					if (i in this && this[i] === item) return i;
				}return -1;
			};
			var bind, card, card_type, card_types, get_card_type, is_valid_length, is_valid_luhn, normalize, validate, validate_number, _i, _len, _ref;
			card_types = [{
				name: 'amex',
				icon: 'images/amex.png',
				pattern: /^3[47]/,
				valid_length: [15]
			}, {
				name: 'diners_club',
				icon: 'images/diners_club.png',
				pattern: /^30[0-5]/,
				valid_length: [14]
			}, {
				name: 'diners_club',
				icon: 'images/diners_club.png',
				pattern: /^36/,
				valid_length: [14]
			}, {
				name: 'jcb',
				icon: 'images/jcb.png',
				pattern: /^35(2[89]|[3-8][0-9])/,
				valid_length: [16]
			}, {
				name: 'laser',
				pattern: /^(6304|670[69]|6771)/,
				valid_length: [16, 17, 18, 19]
			}, {
				name: 'visa_electron',
				pattern: /^(4026|417500|4508|4844|491(3|7))/,
				valid_length: [16]
			}, {
				name: 'visa',
				icon: 'images/visa.png',
				pattern: /^4/,
				valid_length: [16]
			}, {
				name: 'mastercard',
				icon: 'images/mastercard.png',
				pattern: /^5[1-5]/,
				valid_length: [16]
			}, {
				name: 'maestro',
				pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
				valid_length: [12, 13, 14, 15, 16, 17, 18, 19]
			}, {
				name: 'discover',
				icon: 'images/discover.png',
				pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
				valid_length: [16]
			}];

			var options = {};

			if (options.accept == null) {
				options.accept = (function () {
					var _i, _len, _results;
					_results = [];
					for (_i = 0, _len = card_types.length; _i < _len; _i++) {
						card = card_types[_i];
						_results.push(card.name);
					}
					return _results;
				})();
			}
			_ref = options.accept;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				card_type = _ref[_i];
				if (__indexOf.call((function () {
					var _j, _len1, _results;
					_results = [];
					for (_j = 0, _len1 = card_types.length; _j < _len1; _j++) {
						card = card_types[_j];
						_results.push(card.name);
					}
					return _results;
				})(), card_type) < 0) {
					throw "Credit card type '" + card_type + "' is not supported";
				}
			}

			get_card_type = function (number) {
				var _j, _len1, _ref1;
				_ref1 = (function () {
					var _k, _len1, _ref1, _results;
					_results = [];
					for (_k = 0, _len1 = card_types.length; _k < _len1; _k++) {
						card = card_types[_k];
						if ((_ref1 = card.name, __indexOf.call(options.accept, _ref1) >= 0)) {
							_results.push(card);
						}
					}
					return _results;
				})();
				for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
					card_type = _ref1[_j];
					if (number.match(card_type.pattern)) {
						return card_type;
					}
				}
				return null;
			};

			is_valid_luhn = function (number) {
				var digit, n, sum, _j, _len1, _ref1;
				sum = 0;
				_ref1 = number.split('').reverse();
				for (n = _j = 0, _len1 = _ref1.length; _j < _len1; n = ++_j) {
					digit = _ref1[n];
					digit = +digit;
					if (n % 2) {
						digit *= 2;
						if (digit < 10) {
							sum += digit;
						} else {
							sum += digit - 9;
						}
					} else {
						sum += digit;
					}
				}
				return sum % 10 === 0;
			};

			is_valid_length = function (number, card_type) {
				var _ref1;
				return (_ref1 = number.length, __indexOf.call(card_type.valid_length, _ref1) >= 0);
			};

			validate_number = (function (_this) {
				return function (number) {
					var length_valid, luhn_valid;
					card_type = get_card_type(number);
					luhn_valid = false;
					length_valid = false;
					if (card_type != null) {
						luhn_valid = is_valid_luhn(number);
						length_valid = is_valid_length(number, card_type);
					}
					return {
						card_type: card_type,
						valid: luhn_valid && length_valid,
						luhn_valid: luhn_valid,
						length_valid: length_valid
					};
				};
			})(this);

			normalize = function (number) {
				return number.replace(/[ -]/g, '');
			};

			validate = (function (_this) {
				return function () {
					return validate_number(normalize(input));
				};
			})(this);

			return validate(input);
		};

		riot.mixin('rg.creditcard', {
			creditcard: {
				validate: validateCreditCard
			}
		});

		if (!window.rg) window.rg = {};
		window.rg.creditcard = {
			validate: validateCreditCard
		};
	})();
	;
	(function () {
		var map = {
			initialize: function initialize() {
				map.trigger('initialize');
			}
		};

		riot.observable(map);
		if (!window.rg) window.rg = {};
		window.rg.map = map;
	})();(function () {
		// Polyfills
		Array.prototype.find = Array.prototype.find || (Array.prototype.find = function (r) {
			if (null === this) throw new TypeError("Array.prototype.find called on null or undefined");if ("function" != typeof r) throw new TypeError("predicate must be a function");for (var t, n = Object(this), e = n.length >>> 0, o = arguments[1], i = 0; e > i; i++) if ((t = n[i], r.call(o, t, i, n))) return t;return void 0;
		});

		var _states = [];

		var router = {
			add: function add(state) {
				if (!state || !state.name) {
					throw 'Please specify a state name';
					return;
				}
				var _state = findStateByName(state);
				if (_state) _state = state;else _states.push(state);
				router.trigger('add', _state);
				return this;
			},

			remove: function remove(name) {
				var _state = undefined;
				_states = _states.filter(function (state) {
					if (state.name != name) return state;else _state = state;
				});
				router.trigger('remove', _state);
				return this;
			},

			go: function go(name, popped) {
				if (!router.active || !name) return;
				// Match the state in the list of states, if no state available throw error
				var _state = findStateByName(name);
				if (!_state) {
					throw 'State \'' + name + '\' has not been configured';
					return;
				}

				// Merge the state options with the parent states
				var names = name.split('.'); // ["about", "more", "all"]
				names = names.map(function (name, i) {
					if (i > 0) {
						return names.slice(0, i).join('.') + '.' + name;
					} else {
						return name;
					}
				});
				names.forEach(function (name, i) {
					if (i < names.length) {
						var _parent = findStateByName(name);
						_state = _extends({}, _parent, _state);
					}
				});

				// Resolve the resolve function
				if (typeof _state.resolve == 'function') {
					var promise = _state.resolve();
					if (typeof promise.then == 'function') promise.then(function () {
						return changeState(_state, popped);
					});
				} else {
					changeState(_state, popped);
				}
				return this;
			},

			start: function start() {
				router.active = true;
				if (window.location.hash) {
					var _state = findStateByUrl(window.location.hash.replace('#!/', ''));
					if (_state) router.go(_state.name);
				}
				window.addEventListener('popstate', handlePop);
				router.trigger('start');
				return this;
			},

			stop: function stop() {
				router.active = false;
				window.removeEventListener('popstate', handlePop);
				router.trigger('stop');
				return this;
			},

			current: undefined,
			active: false
		};

		function findStateByName(name) {
			return _states.find(function (state) {
				return state.name == name;
			});
		}

		function findStateByUrl(url) {
			return _states.find(function (state) {
				return state.url == url;
			});
		}

		function handlePop(e) {
			if (e.state) router.go(e.state, true);
		}

		function changeState(state, popped) {
			// If supported
			if (typeof history.pushState != 'undefined' && state.history != false) {
				// New state
				if (!history.state || history.state.name != state.name && !popped) {
					var url = state.hasOwnProperty('url') ? '#!/' + state.url : null;
					history.pushState(state.name, null, url);
				}
			}
			var prevState = router.current;
			router.current = state;
			router.trigger('go', state, prevState);
		}

		riot.observable(router);
		riot.mixin('rg.router', {
			init: function init() {
				var _this3 = this;

				this.router.on('go', function () {
					return _this3.update();
				});
			},
			router: router
		});

		if (!window.rg) window.rg = {};
		window.rg.router = router;
	})();
	riot.tag('rg-alert', '<div each="{ opts.alerts }" class="alert { type }" onclick="{ onclick }"> <a class="close" aria-label="Close" onclick="{ parent.remove }" if="{ dismissable != false }"> <span aria-hidden="true">&times;</span> </a> <div class="body"> { msg } </div> </div>', 'rg-alert, [riot-tag="rg-alert"]{ font-size: 0.9em; position: relative; top: 0; right: 0; left: 0; width: 100%; } rg-alert .alert, [riot-tag="rg-alert"] .alert{ position: relative; margin-bottom: 15px; } rg-alert .body, [riot-tag="rg-alert"] .body{ padding: 15px 35px 15px 15px; } rg-alert .close, [riot-tag="rg-alert"] .close{ position: absolute; top: 50%; right: 20px; line-height: 12px; margin-top: -6px; font-size: 18px; border: 0; background-color: transparent; color: rgba(0, 0, 0, 0.5); cursor: pointer; outline: none; } rg-alert .danger, [riot-tag="rg-alert"] .danger{ color: #8f1d2e; background-color: #ffced8; } rg-alert .information, [riot-tag="rg-alert"] .information{ color: #31708f; background-color: #d9edf7; } rg-alert .success, [riot-tag="rg-alert"] .success{ color: #2d8f40; background-color: #ccf7d4; } rg-alert .warning, [riot-tag="rg-alert"] .warning{ color: #c06329; background-color: #f7dfd0; }', function (opts) {
		var _this = this;

		this.on('update', function () {
			opts.alerts.forEach(function (alert) {
				alert.id = Math.random().toString(36).substr(2, 8);
				if (!alert.timer && alert.timeout) {
					alert.startTimer = function () {
						alert.timer = window.setTimeout(function () {
							opts.alerts.splice(opts.alerts.indexOf(alert), 1);
							if (alert.onclose) alert.onclose();
							_this.update();
						}, alert.timeout);
					};
					alert.startTimer();
				}
			});
		});

		this.remove = function (e) {
			e.stopPropagation();
			if (e.item.onclose) e.item.onclose();
			window.clearTimeout(e.item.timer);
			opts.alerts.splice(opts.alerts.indexOf(e.item), 1);
		};
	});

	riot.tag('rg-autocomplete', '<div class="container { open: opened }" riot-style="width: { width }"> <input type="{ opts.type || \'text\' }" name="textbox" placeholder="{ opts.placeholder }" onkeydown="{ handleKeys }" oninput="{ filterItems }" onfocus="{ filterItems }"> <div class="dropdown { open: opened }" show="{ opened }"> <div class="list"> <ul> <li each="{ filteredItems }" onclick="{ parent.select }" class="item { active: active }"> { text } </li> </ul> </div> </div> </div>', 'rg-autocomplete .container, [riot-tag="rg-autocomplete"] .container{ position: relative; display: inline-block; cursor: pointer; } rg-autocomplete .container.open, [riot-tag="rg-autocomplete"] .container.open{ -webkit-box-shadow: 0 2px 10px -4px #444; -moz-box-shadow: 0 2px 10px -4px #444; box-shadow: 0 2px 10px -4px #444; } rg-autocomplete input, [riot-tag="rg-autocomplete"] input{ font-size: 1em; padding: 10px; border: 1px solid #D3D3D3; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; outline: none; } rg-autocomplete .container.open input, [riot-tag="rg-autocomplete"] .container.open input{ } rg-autocomplete .dropdown, [riot-tag="rg-autocomplete"] .dropdown{ position: relative; background-color: white; border: 1px solid #D3D3D3; border-top: 0; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; overflow-y: auto; overflow-x: hidden; } rg-autocomplete .dropdown.open, [riot-tag="rg-autocomplete"] .dropdown.open{ -webkit-box-shadow: 0 2px 10px -4px #444; -moz-box-shadow: 0 2px 10px -4px #444; box-shadow: 0 2px 10px -4px #444; } rg-autocomplete ul, [riot-tag="rg-autocomplete"] ul,rg-autocomplete li, [riot-tag="rg-autocomplete"] li{ list-style: none; padding: 0; margin: 0; } rg-autocomplete li, [riot-tag="rg-autocomplete"] li{ padding: 10px; border-top: 1px solid #E8E8E8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } rg-autocomplete li:first-child, [riot-tag="rg-autocomplete"] li:first-child{ border-top: 0; } rg-autocomplete li:hover, [riot-tag="rg-autocomplete"] li:hover{ background-color: #f3f3f3; } rg-autocomplete li.active, [riot-tag="rg-autocomplete"] li.active,rg-autocomplete li:hover.active, [riot-tag="rg-autocomplete"] li:hover.active{ background-color: #ededed; }', function (opts) {
		var _this = this;

		this.opened = true;
		this.textbox.value = opts.value || '';

		this.filterItems = function () {
			_this.filteredItems = opts.items.filter(function (item) {
				item.active = false;
				if (_this.textbox.value.length == 0 || item.text.toString().toLowerCase().indexOf(_this.textbox.value.toString().toLowerCase()) > -1) {
					return true;
				}
			});
			if (_this.filteredItems.length > 0) {
				_this.opened = true;
			}
			if (opts.onfilter) {
				opts.onfilter();
			}
			_this.update();
		};

		this.handleKeys = function (e) {
			var length = _this.filteredItems.length;
			if (length > 0 && [13, 38, 40].indexOf(e.keyCode) > -1) {
				_this.opened = true;
				e.preventDefault();
				// Get the currently selected item
				var activeIndex = null;
				for (var i = 0; i < length; i++) {
					var item = _this.filteredItems[i];
					if (item.active) {
						activeIndex = i;
						break;
					}
				}

				// We're leaving this item
				if (activeIndex != null) _this.filteredItems[activeIndex].active = false;

				if (e.keyCode == 38) {
					// Move the active state to the next item lower down the index
					if (activeIndex == null || activeIndex == 0) _this.filteredItems[length - 1].active = true;else _this.filteredItems[activeIndex - 1].active = true;
				} else if (e.keyCode == 40) {
					// Move the active state to the next item higher up the index
					if (activeIndex == null || activeIndex == length - 1) _this.filteredItems[0].active = true;else _this.filteredItems[activeIndex + 1].active = true;
				} else if (e.keyCode == 13 && activeIndex != null) _this.select({ item: _this.filteredItems[activeIndex] });
			}
			return true;
		};

		this.select = function (item) {
			item = item.item;
			if (opts.onselect) opts.onselect(item);
			_this.textbox.value = item.text;
			_this.opened = false;
		};

		this.closeDropdown = function (e) {
			if (!_this.root.contains(e.target)) {
				if (opts.onclose && _this.opened) opts.onclose();
				_this.opened = false;
				_this.update();
			}
		};

		this.on('mount', function () {
			document.addEventListener('click', _this.closeDropdown);
			document.addEventListener('focus', _this.closeDropdown, true);
			_this.width = _this.textbox.getBoundingClientRect().width + 'px';
			var dd = _this.root.querySelector('.dropdown');
			dd.style.width = _this.width;
			dd.style.position = 'absolute';
			_this.opened = opts.opened;
			_this.update();
		});

		this.on('unmount', function () {
			document.removeEventListener('click', _this.closeDropdown);
			document.removeEventListener('focus', _this.closeDropdown, true);
		});
	});

	riot.tag('rg-behold', '<div class="controls"> <input type="range" class="ranger" name="diff" value="0" min="0" max="1" step="0.01" oninput="{ updateDiff }" onchange="{ updateDiff }"> </div> <div class="images"> <div class="image"> <img class="image-2" riot-src="{ opts.image2 }"> </div> <div class="image fallback"> <img class="image-1" riot-src="{ opts.image1 }"> </div> </div>', 'rg-behold .controls, [riot-tag="rg-behold"] .controls{ padding: 10px; background-color: #ededed; border: 1px solid #d3d3d3; margin-bottom: 20px; text-align: center; } rg-behold .ranger, [riot-tag="rg-behold"] .ranger{ width: 90%; max-width: 300px; } rg-behold .images, [riot-tag="rg-behold"] .images{ position: relative; } rg-behold .image, [riot-tag="rg-behold"] .image{ position: absolute; width: 100%; text-align: center; } rg-behold .image img, [riot-tag="rg-behold"] .image img{ max-width: 90%; }', function (opts) {
		var _this = this;

		opts.mode = opts.mode || 'fade';

		var image1, image2, fallback;

		this.on('mount', function () {
			image1 = _this.root.querySelector('.image-1');
			image2 = _this.root.querySelector('.image-2');
			fallback = typeof image1.style.webkitClipPath == 'undefined';
			if (opts.mode == 'fade') {
				_this.root.querySelector('.controls').style.direction = 'rtl';
				_this.diff.value = 1;
			}
			_this.updateDiff();
		});

		this.updateDiff = function (e) {
			if (opts.mode == 'fade') {
				image1.style.opacity = _this.diff.value;
			} else if (opts.mode == 'swipe') {
				if (!fallback) {
					image1.style.clipPath = image1.style.webkitClipPath = 'inset(0 0 0 ' + (image1.clientWidth * _this.diff.value - 1) + 'px)';
				} else {
					var fallbackImg = _this.root.querySelector('.fallback');
					fallbackImg.style.clip = 'rect(auto, auto, auto, ' + fallbackImg.clientWidth * _this.diff.value + 'px)';
				}
			}
		};
	});

	riot.tag('rg-bubble', '<div class="context"> <div class="bubble { visible: visible }"> { text } </div> <div class="content" onmouseover="{ showBubble }" onmouseout="{ hideBubble }" onclick="{ toggleBubble }"> <yield></yield> </div> </div>', 'rg-bubble .context, [riot-tag="rg-bubble"] .context,rg-bubble .content, [riot-tag="rg-bubble"] .content{ display: inline-block; position: relative; } rg-bubble .bubble, [riot-tag="rg-bubble"] .bubble{ position: absolute; display: block; top: -27px; left: 50%; -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0); padding: 5px 10px; background-color: rgba(0, 0, 0, 0.8); color: white; text-align: center; font-size: 12px; line-height: 1; white-space: nowrap; opacity: 0; transition: opacity 0.1s, top 0.1s; } rg-bubble .visible, [riot-tag="rg-bubble"] .visible{ top: -30px; opacity: 1; } rg-bubble .bubble:after, [riot-tag="rg-bubble"] .bubble:after{ content: \'\'; position: absolute; display: block; bottom: -10px; left: 50%; -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0); width: 0; height: 0; border: 5px solid rgba(0, 0, 0, 0); border-top-color: rgba(0, 0, 0, 0.9); }', function (opts) {
		var _this = this;

		this.text = opts.text;
		this.visible = false;
		this.showBubble = function () {
			clearTimeout(_this.timer);
			_this.visible = true;
		};
		this.hideBubble = function () {
			_this.timer = setTimeout(function () {
				_this.visible = false;
				_this.update();
			}, 1000);
		};
		this.toggleBubble = function () {
			_this.visible = !_this.visible;
		};
	});

	riot.tag('rg-code', '<div class="editor"></div>', 'rg-code .editor, [riot-tag="rg-code"] .editor{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; }', function (opts) {
		var _this = this;

		this.on('mount', function () {
			var editor = ace.edit(_this.root.querySelector('.editor'));
			if (opts.theme) editor.setTheme('ace/theme/' + opts.theme);
			if (opts.mode) editor.getSession().setMode('ace/mode/' + opts.mode);
			editor.getSession().setTabSize(opts.tabsize || 2);
			if (opts.softtabs == "true") editor.getSession().setUseSoftTabs(true);
			if (opts.wordwrap == "true") editor.getSession().setUseWrapMode(true);
			if (opts.readonly == "true") editor.setReadOnly(true);

			editor.getSession().on('change', function (e) {
				if (opts.onchange) opts.onchange(editor.getValue());
			});

			if (opts.src) {
				(function () {
					var oReq = new XMLHttpRequest();
					oReq.onload = function () {
						editor.setValue(oReq.responseText, -1);
						_this.update();
					};
					oReq.open('get', opts.src, true);
					oReq.send();
				})();
			} else {
				editor.setValue(opts.code);
			}
		});
	});

	riot.tag('rg-context-menu-item', '<div class="item { inactive: opts.inactive }" onclick="{ selectItem }"> <yield></yield> </div>', function (opts) {
		var _this = this;

		this.selectItem = function () {
			if (!opts.inactive) {
				if (opts.onselect) opts.onselect(opts);

				_this.parent.opts.menu.opened = false;
				_this.parent.update();
			}
		};
	});

	riot.tag('rg-context-menu', '<div class="dropdown" show="{ opts.menu.opened }"> <div class="list"> <div each="{ opts.menu.items }" class="item { inactive: inactive }" onclick="{ selectItem }"> <rg-raw if="{ content && !text }" content="{ content }"></rg-raw> <span if="{ text }">{ text }</span> </div> <yield></yield> </div> </div>', 'rg-context-menu .dropdown, [riot-tag="rg-context-menu"] .dropdown{ position: absolute; background-color: white; border: 1px solid #D3D3D3; border-top: 0; text-align: left; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; -webkit-box-shadow: 0 2px 10px -4px #444; -moz-box-shadow: 0 2px 10px -4px #444; box-shadow: 0 2px 10px -4px #444; z-index: 1; } rg-context-menu .item, [riot-tag="rg-context-menu"] .item{ cursor: pointer; padding: 10px; border-top: 1px solid #E8E8E8; background-color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } rg-context-menu .item:hover, [riot-tag="rg-context-menu"] .item:hover{ background-color: #f3f3f3; } rg-context-menu .item.inactive, [riot-tag="rg-context-menu"] .item.inactive{ color: #8a8a8a; font-style: italic; } rg-context-menu .item.inactive:hover, [riot-tag="rg-context-menu"] .item.inactive:hover{ background-color: #fff; }', function (opts) {
		var _this2 = this;

		opts.menu = opts.menu || {};

		var handleClickOutside = function handleClickOutside(e) {
			if (!_this2.root.contains(e.target)) {
				if (opts.menu.onclose && opts.menu.opened) opts.menu.onclose(e);
				opts.menu.opened = false;
				_this2.update();
			}
		};

		var openMenu = function openMenu(e) {
			e.preventDefault();
			if (opts.menu.onopen) opts.menu.onopen(e);
			opts.menu.opened = true;
			// Need to update the page with the
			// rendered element to work with it
			_this2.update();

			var x = e.pageX;
			var y = e.pageY;
			var dd = _this2.root.querySelector('.dropdown');
			var ddRect = dd.getBoundingClientRect();
			// Handle horizontal boundary
			if (x > window.innerWidth + window.scrollX - ddRect.width) // Its too close to the edge!
				x = window.innerWidth + window.scrollX - ddRect.width;

			dd.style.left = x + 'px';

			// Handle vertical boundary
			if (y > window.innerHeight + window.scrollY - ddRect.height) // Its too close to the edge!
				y = window.innerHeight + window.scrollY - ddRect.height;

			dd.style.top = y + 'px';
			_this2.update();
		};

		this.on('mount', function () {
			document.addEventListener('click', handleClickOutside);
			var targets = document.querySelectorAll('[rg-context-menu]');
			for (var i = 0, target; target = targets[i]; i++) {
				if (target.attributes['rg-context-menu'].value == opts.id) target.addEventListener('contextmenu', openMenu);else target.addEventListener('contextmenu', _this.closeMenu);
			}
		});

		this.on('unmount', function () {
			document.removeEventListener('click', handleClickOutside);
			var targets = document.querySelectorAll('[rg-context-menu]');
			for (var i = 0, target; target = targets[i]; i++) {
				if (target.attributes['rg-context-menu'].value == opts.id) target.removeEventListener('contextmenu', openMenu);else target.removeEventListener('contextmenu', _this.closeMenu);
			}
		});

		this.closeMenu = function () {
			opts.menu.opened = false;
			_this2.update();
		};

		this.selectItem = function (e) {
			if (!e.item.inactive) {
				if (e.item.onselect) e.item.onselect(e.item);

				opts.menu.opened = false;
			}
		};
	});

	riot.tag('rg-credit-card', '<input type="text" name="cardNo" class="field card-no { icon } { valid: validationResult.valid == true }" oninput="{ validate }" placeholder="{ opts.placeholder || \'Card no.\' }">', 'rg-credit-card .field, [riot-tag="rg-credit-card"] .field{ font-size: 1em; padding: 10px 60px 10px 10px; border: 1px solid #D3D3D3; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; outline: none; background-repeat: no-repeat; background-position: right center; background-size: 60px; } rg-credit-card .field.valid, [riot-tag="rg-credit-card"] .field.valid{ border-color: #3fc380; } rg-credit-card .field.invalid, [riot-tag="rg-credit-card"] .field.invalid{ border-color: #c33f3f; } rg-credit-card .amex, [riot-tag="rg-credit-card"] .amex{ background-image: url(img/amex.png); } rg-credit-card .diners_club, [riot-tag="rg-credit-card"] .diners_club{ background-image: url(img/diners_club.png); } rg-credit-card .discover, [riot-tag="rg-credit-card"] .discover{ background-image: url(img/discover.png); } rg-credit-card .jcb, [riot-tag="rg-credit-card"] .jcb{ background-image: url(img/jcb.png); } rg-credit-card .mastercard, [riot-tag="rg-credit-card"] .mastercard{ background-image: url(img/mastercard.png); } rg-credit-card .visa, [riot-tag="rg-credit-card"] .visa{ background-image: url(img/visa.png); }', function (opts) {
		var _this = this;

		this.on('mount', function () {
			_this.mixin('rg.creditcard');
			_this.cardNo.value = opts.cardno || '';
			_this.validate();
			_this.update();
		});

		this.validate = function () {
			_this.validationResult = _this.creditcard.validate(_this.cardNo.value);
			_this.icon = _this.validationResult.valid ? _this.validationResult.card_type.name : '';
		};
	});

	riot.tag('rg-datepicker', '{ opts.months} <div class="container { open: opened }"> <input type="text" onclick="{ show }" value="{ date.format(opts.format || \'LL\') }" readonly> <div class="calendar" show="{ opened }"> <div class="grid grid-row" if="{ opts.years != \'false\' }"> <div class="selector" onclick="{ prevYear }">&lsaquo;</div> <span class="year">{ date.format(\'YYYY\') }</span> <div class="selector" onclick="{ nextYear }">&rsaquo;</div> </div> <div class="grid grid-row" if="{ opts.years == \'false\' }"> <span class="year fill">{ date.format(\'YYYY\') }</span> </div> <div class="grid grid-row" if="{ opts.months != \'false\' }"> <div class="selector" onclick="{ prevMonth }">&lsaquo;</div> <span class="month">{ date.format(\'MMMM\') }</span> <div class="selector" onclick="{ nextMonth }">&rsaquo;</div> </div> <div class="grid grid-row" if="{ opts.months == \'false\' }"> <span class="month fill">{ date.format(\'MMMM\') }</span> </div> <div class="grid grid-row"> <span class="day-name" each="{ day in dayNames }">{ day }</span> </div> <div class="grid grid-wrap"> <div each="{ day in days }" onclick="{ changeDate }" class="date { in: day.inMonth, selected: day.selected, today: day.today }"> { day.date.format(\'DD\') } </div> </div> <div class="grid grid-row"> <a class="shortcut" onclick="{ setToday }">Today</a> </div> </div> </div>', 'rg-datepicker .container, [riot-tag="rg-datepicker"] .container{ position: relative; display: inline-block; cursor: pointer; } rg-datepicker input, [riot-tag="rg-datepicker"] input{ font-size: 1em; padding: 10px; border: 1px solid #D3D3D3; cursor: pointer; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; outline: none; } rg-datepicker .calendar, [riot-tag="rg-datepicker"] .calendar{ position: absolute; text-align: center; background-color: white; border: 1px solid #D3D3D3; padding: 5px; width: 330px; margin-top: 10px; left: 50%; -webkit-transform: translateX(-50%); -moz-transform: translateX(-50%); -ms-transform: translateX(-50%); -o-transform: translateX(-50%); transform: translateX(-50%); -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; -webkit-box-shadow: 0 2px 10px -4px #444; -moz-box-shadow: 0 2px 10px -4px #444; box-shadow: 0 2px 10px -4px #444; } rg-datepicker .grid, [riot-tag="rg-datepicker"] .grid{ display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-align-items: center; -ms-flex-align: center; align-items: center; } rg-datepicker .grid-wrap, [riot-tag="rg-datepicker"] .grid-wrap{ width: 100%; -webkit-flex-wrap: wrap; -ms-flex-wrap: wrap; flex-wrap: wrap; } rg-datepicker .grid-row, [riot-tag="rg-datepicker"] .grid-row{ height: 35px; } rg-datepicker .selector, [riot-tag="rg-datepicker"] .selector{ font-size: 2em; font-weight: 100; padding: 0; -webkit-flex: 0 0 15%; -ms-flex: 0 0 15%; flex: 0 0 15%; } rg-datepicker .year, [riot-tag="rg-datepicker"] .year,rg-datepicker .month, [riot-tag="rg-datepicker"] .month{ text-transform: uppercase; font-weight: normal; -webkit-flex: 0 0 70%; -ms-flex: 0 0 70%; flex: 0 0 70%; } rg-datepicker .fill, [riot-tag="rg-datepicker"] .fill{ -webkit-flex: 0 0 100%; -ms-flex: 0 0 100%; flex: 0 0 100%; } rg-datepicker .day-name, [riot-tag="rg-datepicker"] .day-name{ font-weight: bold; -webkit-flex: 0 0 14.28%; -ms-flex: 0 0 14.28%; flex: 0 0 14.28%; } rg-datepicker .date, [riot-tag="rg-datepicker"] .date{ -webkit-flex: 0 0 14.28%; -ms-flex: 0 0 14.28%; flex: 0 0 14.28%; padding: 10px; border-radius: 100%; box-sizing: border-box; font-size: 0.8em; font-weight: normal; border: 2px solid transparent; color: #cacaca; } rg-datepicker .date:hover, [riot-tag="rg-datepicker"] .date:hover{ background-color: #f3f3f3; } rg-datepicker .date.in, [riot-tag="rg-datepicker"] .date.in{ color: inherit; } rg-datepicker .today, [riot-tag="rg-datepicker"] .today{ border-color: #ededed; } rg-datepicker .selected, [riot-tag="rg-datepicker"] .selected,rg-datepicker .selected:hover, [riot-tag="rg-datepicker"] .selected:hover{ background-color: #ededed; border-color: #dedede; } rg-datepicker .shortcut, [riot-tag="rg-datepicker"] .shortcut{ -webkit-flex: 0 0 100%; -ms-flex: 0 0 100%; flex: 0 0 100%; color: #6495ed; }', function (opts) {
		var _this = this;

		this.date = moment(opts.date || new Date());

		var handleClickOutside = function handleClickOutside(e) {
			if (!_this.root.contains(e.target) && _this.opened) {
				if (opts.onclose) opts.onclose(_this.date);
				_this.opened = false;
				_this.update();
			}
		};

		var buildCalendar = function buildCalendar() {
			var cursor = moment(_this.date);
			var end = moment(cursor);

			// Set cursor to start of the month and start of the week
			cursor.startOf('month');
			cursor.day(0);
			// end of month and end of week
			end.endOf('month');
			end.day(6);

			_this.dayNames = [];
			_this.days = [];

			while (cursor.isBefore(end)) {
				if (_this.dayNames.length < 7) _this.dayNames.push(cursor.format('dd'));

				_this.days.push({
					date: moment(cursor),
					selected: _this.date.isSame(cursor, 'day'),
					today: moment().isSame(cursor, 'day'),
					inMonth: _this.date.isSame(cursor, 'month')
				});

				cursor = cursor.add(1, 'days');
			}
			_this.opts.date = _this.date.toDate();
			_this.update();
		};

		this.on('mount', function () {
			document.addEventListener('click', handleClickOutside);
		});

		this.on('unmount', function () {
			document.removeEventListener('click', handleClickOutside);
		});

		// Handle the clicks on dates
		this.changeDate = function (e) {
			_this.date = e.item.day.date;
			if (opts.onselect) opts.onselect(_this.date);
			buildCalendar();
		};

		// Handle today shortcur
		this.setToday = function () {
			_this.date = opts.date = moment();
			if (opts.onselect) opts.onselect(_this.date);
			buildCalendar();
		};

		// Handle the previous year change
		this.prevYear = function () {
			_this.date.subtract(1, 'year');
			buildCalendar();
		};

		// Handle the next month change
		this.nextYear = function () {
			_this.date.add(1, 'year');
			buildCalendar();
		};

		// Handle the previous month change
		this.prevMonth = function () {
			_this.date.subtract(1, 'month');
			buildCalendar();
		};

		// Handle the next month change
		this.nextMonth = function () {
			_this.date.add(1, 'month');
			buildCalendar();
		};

		// Show/hide the datepicker
		this.show = function () {
			if (opts.onopen) opts.onopen();
			buildCalendar();
			_this.opened = true;
		};
	});

	riot.tag('rg-ga', '', function (opts) {
		(function (i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
				(i[r].q = i[r].q || []).push(arguments);
			}, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
		})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

		ga('create', opts.property, 'auto');
		ga('send', 'pageview');
	});

	riot.tag('rg-include', '{{ responseText }}', function (opts) {
		var _this = this;

		var oReq = new XMLHttpRequest();
		oReq.onload = function () {
			if (opts.unsafe) _this.root.innerHTML = oReq.responseText;else _this.responseText = oReq.responseText;

			_this.update();
		};
		oReq.open("get", opts.src, opts.async || true);
		oReq.send();
	});

	riot.tag('rg-loading', '<div class="overlay"></div> <div class="loading"> <div> <yield></yield> </div> <div if="{ opts.spinner == \'true\' }"> <svg width="80px" height="80px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-default"> <rect x="0" y="0" width="80" height="80" fill="none" class="bk"></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(0 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(45 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.0625s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(90 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.125s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(135 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.1875s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(180 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.25s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(225 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.3125s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(270 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.375s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(315 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.4375s" repeatCount="indefinite"></animate></rect> </svg> </div> </div>', 'rg-loading .overlay, [riot-tag="rg-loading"] .overlay{ position: absolute; width: 100%; height: 100%; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0, 0, 0, 0.8); z-index: 200; } rg-loading .loading, [riot-tag="rg-loading"] .loading{ position: absolute; width: 95%; max-width: 420px; top: 50%; left: 50%; -webkit-transform: translate3d(-50%, -50%, 0); -moz-transform: translate3d(-50%, -50%, 0); -ms-transform: translate3d(-50%, -50%, 0); -o-transform: translate3d(-50%, -50%, 0); transform: translate3d(-50%, -50%, 0); background-color: transparent; color: #fff; text-align: center; z-index: 201; }', function (opts) {});

	riot.tag('rg-map', '<div class="rg-map"></div>', 'rg-map .rg-map, [riot-tag="rg-map"] .rg-map{ margin: 0; padding: 0; width: 100%; height: 100%; } rg-map .rg-map img, [riot-tag="rg-map"] .rg-map img{ max-width: inherit; }', function (opts) {
		var _this = this;

		var defaultOptions = {
			center: { lat: 53.806, lng: -1.535 },
			zoom: 5
		};
		var mapOptions = opts.map || defaultOptions;

		rg.map.on('initialize', function () {
			var map = new google.maps.Map(_this.root.querySelector('.rg-map'), mapOptions);
		});

		(function () {
			if (!document.getElementById('gmap_script')) {
				var script = document.createElement('script');
				script.setAttribute('id', 'gmap_script');
				script.type = 'text/javascript';
				script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=rg.map.initialize';
				document.body.appendChild(script);
			}
		})();
	});

	riot.tag('rg-markdown', '<div class="markdown"></div>', function (opts) {
		var _this = this;

		var reader = new commonmark.Parser();
		var writer = new commonmark.HtmlRenderer();

		var markItDown = function markItDown(content) {
			var parsed = reader.parse(content);
			_this.root.innerHTML = writer.render(parsed);
		};

		if (opts.src) {
			var oReq = new XMLHttpRequest();
			oReq.onload = function () {
				markItDown(oReq.responseText);
				_this.update();
			};
			oReq.open('get', opts.src, opts.async || true);
			oReq.send();
		} else {
			markItDown(opts.content);
		}
	});

	riot.tag('rg-modal', '<div class="overlay { expanded: opts.modal.visible, ghost: opts.modal.ghost }" onclick="{ close }"></div> <div class="modal { ghost: opts.modal.ghost }" if="{ opts.modal.visible }"> <header class="header"> <button if="{ opts.modal.close != false }" type="button" class="close" aria-label="Close" onclick="{ close }"> <span aria-hidden="true">&times;</span> </button> <h3 class="heading">{ opts.modal.heading }</h3> </header> <div class="body"> <yield></yield> </div> <footer class="footer"> <button class="button" each="{ opts.modal.buttons }" type="button" onclick="{ action }" riot-style="{ style }"> { text } </button> <div class="clear"></div> </footer> </div>', 'rg-modal .overlay, [riot-tag="rg-modal"] .overlay,rg-modal .overlay.ghost, [riot-tag="rg-modal"] .overlay.ghost{ position: fixed; top: 0; left: -100%; right: 0; bottom: 0; width: 100%; height: 100%; background-color: transparent; cursor: pointer; -webkit-transition: background-color 0.8s ease, left 0s 0.8s; -moz-transition: background-color 0.8s ease, left 0s 0.8s; -ms-transition: background-color 0.8s ease, left 0s 0.8s; -o-transition: background-color 0.8s ease, left 0s 0.8s; transition: background-color 0.8s ease, left 0s 0.8s; z-index: 50; } rg-modal .overlay.expanded, [riot-tag="rg-modal"] .overlay.expanded,rg-modal .overlay.ghost.expanded, [riot-tag="rg-modal"] .overlay.ghost.expanded{ left: 0; background-color: rgba(0, 0, 0, 0.8); -webkit-transition: background-color 0.8s ease, left 0s; -moz-transition: background-color 0.8s ease, left 0s; -ms-transition: background-color 0.8s ease, left 0s; -o-transition: background-color 0.8s ease, left 0s; transition: background-color 0.8s ease, left 0s; } rg-modal .modal, [riot-tag="rg-modal"] .modal,rg-modal .modal.ghost, [riot-tag="rg-modal"] .modal.ghost{ position: fixed; width: 95%; max-width: 500px; font-size: 1.1em; top: 50%; left: 50%; -webkit-transform: translate3d(-50%, -75%, 0); -moz-transform: translate3d(-50%, -75%, 0); -ms-transform: translate3d(-50%, -75%, 0); -o-transform: translate3d(-50%, -75%, 0); transform: translate3d(-50%, -75%, 0); background-color: white; color: #252519; z-index: 101; } rg-modal .modal.ghost, [riot-tag="rg-modal"] .modal.ghost{ background-color: transparent; color: white; } rg-modal .header, [riot-tag="rg-modal"] .header{ position: relative; text-align: center; } rg-modal .heading, [riot-tag="rg-modal"] .heading{ padding: 20px 20px 0 20px; margin: 0; font-size: 1.2em; } rg-modal .modal.ghost .heading, [riot-tag="rg-modal"] .modal.ghost .heading{ color: white; } rg-modal .close, [riot-tag="rg-modal"] .close{ position: absolute; top: 5px; right: 5px; padding: 0; height: 25px; width: 25px; line-height: 25px; font-size: 25px; border: 0; background-color: transparent; color: #ef424d; cursor: pointer; outline: none; } rg-modal .modal.ghost .close, [riot-tag="rg-modal"] .modal.ghost .close{ color: white; } rg-modal .body, [riot-tag="rg-modal"] .body{ padding: 20px; } rg-modal .footer, [riot-tag="rg-modal"] .footer{ padding: 0 20px 20px 20px; } rg-modal .button, [riot-tag="rg-modal"] .button{ float: right; padding: 10px; margin: 0 5px 0 0; border: none; font-size: 0.9em; text-transform: uppercase; cursor: pointer; outline: none; background-color: white; } rg-modal .modal.ghost .button, [riot-tag="rg-modal"] .modal.ghost .button{ color: white; background-color: transparent; } rg-modal .clear, [riot-tag="rg-modal"] .clear{ clear: both; }', function (opts) {
		this.close = function (e) {
			opts.modal.visible = false;
			if (opts.modal.onclose) opts.modal.onclose(e);
		};
	});

	riot.tag('rg-phone-sim', '<div class="emulator"> <iframe class="screen" riot-src="{ opts.src }"></iframe> </div>', 'rg-phone-sim .emulator, [riot-tag="rg-phone-sim"] .emulator{ position: relative; width: 365px; height: 792px; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAW0AAAMYCAMAAAA3r0ZLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRFMDk6+vr6KTM0lJucMz4/PklKJS8wLTg5Qk1OxsjILzo7gomJ2NvbdH5/ho2O9fb2KzY3ztHRPEdIOkVGZWxtjJSVOEJDkpeYWGRluL2+KTQ1vcHBoaWlPUZHcnp6nKKjOkRF1NfXqa2tp62tZnBxanV2VmFiZ29wVl1eaXJzbXR04uTktbq7QElK1tnZipKTi5CRTlZXpKioo6mqXmlqUVlaOEFCSVFSUFxdISssT1tcTlpbJC4vIiwtTVlaJjAxIy0uTFhZS1dYJzEyKDIzSlZXPUhJOURFO0ZHSVVWKzU2P0pLKjQ1OENEND0+QEtMLDY3SFRVN0JDQ05PLTc4ND9ANUBBQUxNNkFCR1NUMTo7RE9QLjg5N0BBR1JTRlJTLzk6RVFSMjs8RVBRRlFSNj9AMzw9SFNUMj0+IissMTs8MDo7SVRVRFBRMDs8MTw9IiwsMz0+Mjw9SlVWQ09QLjk6NT4/S1ZXND4/JC4uQU1OIy0tQk5PTFdYTVhZQExNTllaJS8vJzIyP0tMLzg5LDc4KDMzNT9AKjU1N0FCNkBBJjAwIywtMDs7Mj09NkFBJjExLjk5LDc3N0JCNUBAKjU2MTw8LDU2Ljc4OUNEKDEyQU1NPEhIPEhJO0dHOkZGND8/Qk5ORFBQQ09PLTY3OUREPkpKPkpLPUlJT1pbP0tLJTAwPUlKJzAxKjM07u/vKTIzsbW2YGprtLm50tXWPkhJo6endn+A3d/f6uvreoOEg4yN2tvc/Pz8n6am8/T0VFtcm6CgJS4v4OLi5ufnYGdncnt8dHp7gYaHJC0uu8DAjJGRQkxNxMfHKzQ1YGtsS1NUaXN0bnh5yMzMyszMy83Oy8/PdoCAKDIy7O3tT1dYuLu70NTUbXd46Onq6erreoCA2dzc8PHx8vPz5OXlnaSkn6Wmqq6ucHZ2t7y8o6eoeoSEkJaWm5+gW2ZnZG5vqa+wOEFB09bWtru7qrCwcXd4t7u83eDgzM7O7/DwNT4+7e7uwMPDwcPEeH5/////70wnUQAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAA+NSURBVHja7N13nBTlGcDxEQI5AmJQBAkcnqhEDIhoWMt5iogmQbOaYNrqYrJh16gplmTVkILJpYCmF+DSE1JIcjRR7L333ntPYjQxvTl55tnr7N7t7uw+vDP3+/0x3G3hs5+vr++8M7s7eH75Xb5x+rOjN017aeq+tO++U1+atmn0s9M3Xl6BoFfm466ZOPROhIt259CJ19RS++7LdgW133a97O7aaI/a+VE0y+jRnUeF1p6wqfvvaz6+YVjT0jMyJ3rkeSdmzljaNKzh+OZuoE0TQmmvv67zLzrwmMY8wkXLNx5zYCfTdeur1p6wdeegblgKar8tbegc4lv/rirtjTMLT99/UVMKzgFLNS3avwA2c2Pl2n8tPHV1QxLJMks2rC6g/alC7ScvKozrhhyIFZRrKIzvi56sRHt94b/RIsZ1xeN7UYFuffna4/UJB68Er4rGHax648vUfmqkPnxBBrmqyixQv5FPlaP9Dz2eWdIEW9U1LdFjnQsG1n5ETz4dyowdavY+VE9XPTKQ9phddPfICjvk6lt3lruM6V97j132l26BK3S3BJAv79Gf9jN3BY85HKsadHhAedebSmtf+ofgEcOQqknDAsyLLi2pPTq4/0icatSRAefoUto7Bvc2oFSzGgLQHYtr3xTct5DVSA1XJgsD0puKaa99s9wzlwPImh5WzhXTl/5TRHt7uaN5GUI1bVmzqL64ufZfgkF/GD417rCA9e99tf8VzCPHoVPzjhPXaVv10d5bblzCyZE6nDIJ5pKde2u/Egz487Cp1zHlHr20h8otp50ETT2WgaeL7dCe2vcF/uOQqUsrA9z7emgHQ3thdEZLLpeL0kHYwq7BrdqjAv2ofEAnlU0EZaPjvTTgHdWlvXeEhnYu0VkuUoN7707tbW6X35oiciyc6C4yZxmaxPf2bTq0z5VfTo/IC8/20M5GZnAHy5JzO7Tvj85bCKlEzyIzdQdvLNxf0L4wmMQjMgnmemlHZubOBcQXqvb0CO0jk720o3OmIdhPTlft4FTrth5ju55tK8bbq/YG+emUiLzqTC/t6Lz1cYoYbwi0r47QisTz0j2w0xE6ngxWJVeLdrD+WxCZVx3J9ba0QNeAnj9T/twuOi87GcF9pLSdKM8U7Q2rV6+O0jcQMoXJJB2t96tzorzB99Y2NzfPjdQL9zLJZDJynw2YK85rvZ1ku9Cjuq+4xXknb4Js+XxU/WsQ5wnec7LlDcn6d544P+ddLFu+zlT/Vorzxd5k2fIJqfq3TJwney/Lls+RGBwniPPL3g6y5aOWBstWcd7BmypbLjhS/1LiPNWTTTMWBik02mijTWijTWijjTbFVTuZTqSTRW8OUzqJdpGyxT89mU2ELYv25kO4+LvnyUT4kmj3LV38YzjpGmin3dReIm2pF9BlU+LmMDmnrdBbUntQje0trj2o5m2FPlBiTWKQQm9R7cG03nZAexCFNtpoE9poE9poo01oo01oo01oo4021VT7MxIUBik02mijTeG1D5agMEih0UYbbUIbbUIbbbQJbbQJbbQJbbTRplppf1qCwiCFRhtttCm89lwJCoMUGm200Sa00Sa00Uab0Eab0Eab0EY73tqnS1AYpNBoo402hdc+VILCIIVGG220CW20CW200Sa00Sa00aYC9GkSFAYpNNpoo01oR0v7bRIUBik02mijTWijTWijjTahjTah7bL2hyUoDFJotNFGm9BGm0ppv0OCwiCFRhtttAlttAlttNEmtOOhfbwEhUEKjTbaaBPaaBPaLmi/T4LCIIVGG220CW20CW200ab6aS+UoDBIodFGG21CG21C2wXt4yQoDFJotNFGm9BGm9BGe7BpL5KgMEih0UYbbUIbbULbBe0PSFAYpNBoo402oY02oY32YNP+oASFQQqNNtpoE9poE9poDzbtj0hQGKTQaKONNqGNNpXS/qkEhUEKfYwEhUEKjTbaaBPaaBPaaA827Y9LUBik0GijjTahHS3tn0lQGKTQCyQoDFJotNFGm9BGm9BGG22qn/anJCgMUmi00Uabwmv/RILCIIVukKAwSKHRRhttQhttQhtttKl+2p+UoDBIodFGG20Kr/09CQqDFPo9EhQGKTTaaKNNaKNNaKONNtVP+7MSFAYpNNpoo03htY+UoDBIodFGG21CG21CG220Ce14aH9egsIghUYb7bhq/1qCwiCFPlyCwiCFRhtttAlttAlttNEmtNGmSrV/KUFhkEL/QoLCIIUeJkFhkEKjjTbahDbahDbaaBPaaFOl2r+VoDBIoX8lQWGQQh8mQWGQQqONNtqENtqENtpoE9poE9oua/9AgsIghf6+BIVBCr2tBIVBCo022mgT2mgT2mijTWijTWi7rP1DCQqDFPqtEhQGKTTaaKNNaKNNaKONNqGNNqHtsvaPJCgMUujtJCgMUmi00Uab0Eab0EYbbUIbbUIbbSpAv0WCwiCFRhtttAlttAlttNEmtNEmtF3W/rkEhUEKvVKCwiCFfrsEhUEKjTbaaBPaaBPaaKNNaKNNaLusPU6CwiCFfqcEhUEKjTbaaBPaaBPaaKNNaMdD+1sSFAYpNNqW2kslKAxSaLQttd8rQWGQQqONNtqENtqENtpoU/20vyZBYZBCo22pvUyCwiCFRttS+90SFAYpNNpoo01oo01oo4021U/72xIUBik02pbaX5KgMEih0UY7rtrvkqAwSKHRRhttQhttQhtttKl+2j+WoDBIoc+QoDBIodFGG20Kr/0aCQqDFBpttNEmtNEmtNFGm+qnfYoEhUEKjTbaaBPa0dL+kASFQQqNNtpoE9poE9ouaH9VgsIghUbbUvtUCQqDFBpttNEmtKOl/TEJCoMUGm200Sa00aZS2t+VoDBIodG21D5RgsIghUYbbbQJbbSplPZHJSgMUmi00Uab0EabSml/RYLCIIVG21L7JAkKgxQabbTRJrTRplLar5OgMEih0UYbbUIbbULbBe33S1AYpNBoo402oY02oY32YNP+hASFQQqNNtpoE9rR0v6GBIVBCo22pfaxEhQGKTTaaKNNaKNNaKM92LRfK0FhkEKjjTbahDbaVEr7aAkKgxQabbTRJrTRJrTRRpvqp/0FCQqDFBpttOOq/U0JCoMUGm1L7aMkKAxSaLTRRpvQRpvQRhttQjse2q+XoDBIodFGG21CO1ra8yUoDFJotNFGm9BGm9BGG21CG22qVPs7EhQGKTTaltpflqAwSKHRRjuu2kdIUBik0GijjTahjTahjTbahDbaVKn2GyQoDFJotNFGm8JrD5GgMEih0UYbbUIbbUIbbbQJbbQJbbSpAP1FCQqDFBpttNGm8NrzJCgMUmi00Uab0Eab0EYbbUIbbUIbbULbXvtzEhQGKTTaaMdV+xAJCoMUGm200Sa00Sa00Uab0Eab0Eab0EY73tpfl6AwSKHRttQ+SILCIIVGG220CW20CW200Sa00Sa00Sa00UabaqV9tgSFQQqNtqX2byQoDFLo4RIUBik02mijTWijTWijjTahjTahjTZFVTuVymQyqRTa9S6TzGcTnaWz+VwK7TqVyyc2L5tMoV376SOZTpQom4uO9lmS+9b5RH+lo+Ct0FHQTiYGKptCu0a7xj5zSDqdzmbTfSeWZCS0D5AiM7DT+Vyme3rJJLMRGt4K7bp2D9B8psjOs8f9GbRD7h67MUst9TLdD8mhHQq7a3bO9zNP5CIxebuvnS5v1HYvEHNoh56z8wPuAHPuz92ua+crmB+6uFNoV3depKLJuPPRabSr2kNWuOfrfHwe7eon7WTF/y9k0K52HslW/pQ02tUu/ira6SVdXnW7rJ2sav2cdnhwu6ydrnge0aN4hwe3w9q5Knd4eXcHt8Pa2SoXcxl3lyXuaqeqRss7u+Z2VztZ1azdY3C7qn2m5OhEUtUJvbSrU4lCO6kd4gRT3tVVibPamaonknDPHZzayTDj09WJW6HnSK69sHyY92HSjp7mVmgXtbNh9nRZR3eTzmqHGp55R9+gRBvtsDu6pKNLQLTRRjt687aj2kfJppW9ZN1rFeflau6adhzX2606hzTKdgXHknXvWHFu9GbJ9mjOk9S9o8V5lje2MJ84VRzPAS4X57HeaNmucXMJGKvz22vEebQ3RbbzXHtpMXzvZp44T/Huka1zl82N4fuSB4nzPd7jsnXubeAYvud+gDg/7vnjHFxwx+/zJMFye5zv+bvLn/Nde3Gx+6zUfFHeXbQnLV68+AHnXl3cPgf4gChPEu1R8qd7372O22dczxLlUaLt/1l+aHV0cMfl89utYvxvP9B+QX66zbnXF6/vJtwmxrur9vnyk4MX84/V927O1mk70H7mHMm9qSRO3ylrDYifUW3/CvlxjefqXBKH70uuEeEr/IL2pJaWFhe/DVLVd4Gd/P7eASI8qUP76YT8stzBF1nF99ydvKzAcvFNPN2h7d8sv7l44bRUxddwcPPLe8PF92a/U3uM/NayymnuKF+fZFXAO6ZL23/C0cEdj2vvBEP7Cb9be2KLozN3HK4rFczaLRN7aPuvOros8WJwzbRgQfKq31N7ROC/xs1Xu/n1ALNRuh7gkID23l7a/p5y05xjPfeHd9Sudblijsi+6PfWvjApNzr7z3pG+DquB4nrjG36aPu/d3gu8aJ7jeI1Aetefl9t/wVXF91dy+piAzzt9vW3dan9N39z7cdODdYlrS6/9shdW741WI+c+lgRbf/5FlePcfpMKtH5dxOC45qW5/1i2v7I4L42j2pVWwA60i+u7Y8N7l2HUo1aF3CO9Utpb7VbcP8QnGp3WLPbViW1/Uv2gbum2Ptc4pfW9v/ZGDxmHlahmxdANt7r96ft/0+521vhCrf0a1fs//r9a/u3zjhZumoFYmFOjlwVIM641R9I239ldvDIxcsxq7rliwPC2a/4A2v7D14bPPbkNmaTKmeRNvW79kG/HG3fn6wPP5PhXdXAPlP1JheDLartX6lPOPlsZu+KZ+z2At2Vfvna/pjdTtCYTiqcRApsV6z3K9H2/fGF553Txvgue1y3nVNAG18KtaS2P2Ja4akntDN/lzVft3d4vXGEX7m27+81q+P5N7atQrPfVrXd2GE1a69+RPvTlr3lHft11NJ+BFNKiQnkiPaWTqY7/tivZ//avn/+7P26ahl+yJD5q1a0sufUPWLrilXzhxwyvKUbaPb5A2gOpC3z956N+9HANe05YkDLgbWlh0fOQLPfZox8uBzIsrSlC6Zcj3gJ6eunXFCmYrnaQWtHTLph7EONresQlta1Nj409oZJI9ZWIPh/AQYA2whzWlA9R/cAAAAASUVORK5CYII=\'); background-repeat: no-repeat; background-position: center; background-size: cover; } rg-phone-sim .screen, [riot-tag="rg-phone-sim"] .screen{ position: absolute; top: 105px; left: 22px; background-color: white; width: 320px; height: 568px; border: 0; }', function (opts) {});

	riot.tag('rg-placeholdit', '<img riot-src="https://placeholdit.imgix.net/~text?bg={ background }&txtclr={ color }&txt={ text }&txtsize={ textSize }&w={ width }&h={ height }&fm={ format }">', function (opts) {
		this.width = opts.width || 450;
		this.height = opts.height || 250;
		this.background = opts['background-color'] || 'f01e52';
		this.color = opts.color || 'fff';
		this.text = opts.text || this.width + ' x ' + this.height;
		this.textSize = opts['font-size'] || '30';
		this.format = opts.format || 'png';
	});

	riot.tag('rg-raw', '<span></span>', function (opts) {
		this.on('mount', function () {
			this.root.innerHTML = opts.content;
		});
	});

	riot.tag('rg-select', '<div class="container { open: opened }" riot-style="width: { width }"> <input type="text" class="field { open: opened}" onkeydown="{ handleKeys }" onclick="{ toggle }" value="{ fieldText || opts.placeholder }" readonly> <div class="dropdown" show="{ opened }"> <div class="filter"> <input type="text" name="filter" class="filter-box" placeholder="{ opts[\'filter-placeholder\'] || \'Filter\' }" onkeydown="{ handleKeys }" oninput="{ filterItems }"> </div> <div class="list"> <ul> <li each="{ filteredItems }" onclick="{ parent.select }" class="item { selected: selected, disabled: disabled, active: active }"> { text } </li> </ul> </div> </div> </div>', 'rg-select .container, [riot-tag="rg-select"] .container{ position: relative; display: inline-block; cursor: pointer; } rg-select .container.open, [riot-tag="rg-select"] .container.open{ -webkit-box-shadow: 0 2px 10px -4px #444; -moz-box-shadow: 0 2px 10px -4px #444; box-shadow: 0 2px 10px -4px #444; } rg-select .field, [riot-tag="rg-select"] .field{ width: 100%; padding: 10px; background-color: white; border: 1px solid #D3D3D3; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 1em; line-height: normal; outline: 0; } rg-select .down-arrow, [riot-tag="rg-select"] .down-arrow{ float: right; } rg-select .dropdown, [riot-tag="rg-select"] .dropdown{ position: relative; width: 100%; background-color: white; border: 1px solid #D3D3D3; border-top: 0; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; } rg-select .container.open .dropdown, [riot-tag="rg-select"] .container.open .dropdown{ -webkit-box-shadow: 0 2px 10px -4px #444; -moz-box-shadow: 0 2px 10px -4px #444; box-shadow: 0 2px 10px -4px #444; } rg-select .filter-box, [riot-tag="rg-select"] .filter-box{ -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; width: 100%; padding: 10px; font-size: 0.9rem; border: 0; outline: none; color: #555; } rg-select ul, [riot-tag="rg-select"] ul,rg-select li, [riot-tag="rg-select"] li{ list-style: none; padding: 0; margin: 0; } rg-select li, [riot-tag="rg-select"] li{ padding: 10px; border-top: 1px solid #E8E8E8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } rg-select .selected, [riot-tag="rg-select"] .selected{ font-weight: bold; background-color: #f8f8f8; } rg-select li:hover, [riot-tag="rg-select"] li:hover{ background-color: #f3f3f3; } rg-select li.active, [riot-tag="rg-select"] li.active,rg-select li:hover.active, [riot-tag="rg-select"] li:hover.active{ background-color: #ededed; }', function (opts) {
		var _this = this;

		this.opened = true;

		var handleClickOutside = function handleClickOutside(e) {
			if (!_this.root.contains(e.target)) {
				if (opts.onclose && _this.opened) opts.onclose();
				_this.opened = false;
				_this.update();
			}
		};

		this.handleKeys = function (e) {
			if (e.keyCode == 13 && !_this.opened) {
				_this.toggle();
				return true;
			}
			var length = _this.filteredItems.length;
			if (length > 0 && [13, 38, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
				// Get the currently selected item
				var activeIndex = null;
				for (var i = 0; i < length; i++) {
					var item = _this.filteredItems[i];
					if (item.active) {
						activeIndex = i;
						break;
					}
				}

				// We're leaving this item
				if (activeIndex != null) _this.filteredItems[activeIndex].active = false;

				if (e.keyCode == 38) {
					// Move the active state to the next item lower down the index
					if (activeIndex == null || activeIndex == 0) _this.filteredItems[length - 1].active = true;else _this.filteredItems[activeIndex - 1].active = true;
				} else if (e.keyCode == 40) {
					// Move the active state to the next item higher up the index
					if (activeIndex == null || activeIndex == length - 1) _this.filteredItems[0].active = true;else _this.filteredItems[activeIndex + 1].active = true;
				} else if (e.keyCode == 13 && activeIndex != null) {
					_this.select({ item: _this.filteredItems[activeIndex] });
				}
			}
			return true;
		};

		this.toggle = function () {
			_this.opened = !_this.opened;
			if (opts.onopen && _this.opened) opts.onopen();else if (opts.onclose && !_this.opened) opts.onclose();
		};

		this.filterItems = function () {
			_this.filteredItems = opts.options.filter(function (item) {
				item.active = false;
				var filterField = item[opts['filter-on'] || 'text'];
				if (_this.filter.value.length == 0 || filterField.toString().toLowerCase().indexOf(_this.filter.value.toString().toLowerCase()) > -1) return true;
			});
			if (opts.onfilter) opts.onfilter();
			_this.update();
		};

		this.select = function (item) {
			item = item.item;
			opts.options.forEach(function (item) {
				return item.selected = false;
			});
			item.selected = true;
			if (opts.onselect) opts.onselect(item);
			_this.fieldText = item.text;
			_this.opened = false;
		};

		this.on('mount', function () {
			// Filter items
			_this.filterItems();

			// Give each dropdown item an index and select one if applicable
			opts.options.forEach(function (item, i) {
				item.index = i;
				if (item.selected) _this.select({ item: item });
			});

			// Setup listeners and style component given content
			document.addEventListener('click', handleClickOutside);
			var dd = _this.root.querySelector('.dropdown');
			_this.width = dd.getBoundingClientRect().width + 20 + 'px';
			dd.style.position = 'absolute';

			// Set open state
			_this.opened = opts.opened;

			_this.update();
		});

		this.on('unmount', function () {
			return document.removeEventListener('click', handleClickOutside);
		});
	});

	riot.tag('rg-sidemenu', '<div class="overlay { expanded: opts.sidemenu.expanded }" onclick="{ close }"></div> <div class="sidemenu { expanded: opts.sidemenu.expanded }"> <h4 class="header">{ opts.sidemenu.header }</h4> <ul class="items"> <li class="item { active: active }" each="{ opts.sidemenu.items }" onclick="{ selected }"> { text } </li> </ul> <div class="body"> <yield></yield> </div> </div>', 'rg-sidemenu .overlay, [riot-tag="rg-sidemenu"] .overlay{ position: fixed; top: 0; left: -100%; right: 0; bottom: 0; width: 100%; height: 100%; background-color: transparent; cursor: pointer; -webkit-transition: background-color 0.8s ease, left 0s 0.8s; -moz-transition: background-color 0.8s ease, left 0s 0.8s; -ms-transition: background-color 0.8s ease, left 0s 0.8s; -o-transition: background-color 0.8s ease, left 0s 0.8s; transition: background-color 0.8s ease, left 0s 0.8s; z-index: 50; } rg-sidemenu .overlay.expanded, [riot-tag="rg-sidemenu"] .overlay.expanded{ left: 0; background-color: rgba(0, 0, 0, 0.8); -webkit-transition: background-color 0.8s ease, left 0s; -moz-transition: background-color 0.8s ease, left 0s; -ms-transition: background-color 0.8s ease, left 0s; -o-transition: background-color 0.8s ease, left 0s; transition: background-color 0.8s ease, left 0s; } rg-sidemenu .sidemenu, [riot-tag="rg-sidemenu"] .sidemenu{ position: fixed; top: 0; left: 0; height: 100%; width: 260px; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; background-color: black; color: white; -webkit-transform: translate3d(-100%, 0, 0); -moz-transform: translate3d(-100%, 0, 0); -ms-transform: translate3d(-100%, 0, 0); -o-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0); -webkit-transition: -webkit-transform 0.5s ease; -moz-transition: -moz-transform 0.5s ease; -ms-transition: -ms-transform 0.5s ease; -o-transition: -o-transform 0.5s ease; transition: transform 0.5s ease; z-index: 51; } rg-sidemenu .sidemenu.expanded, [riot-tag="rg-sidemenu"] .sidemenu.expanded{ -webkit-transform: translate3d(0, 0, 0); -moz-transform: translate3d(0, 0, 0); -ms-transform: translate3d(0, 0, 0); -o-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); } rg-sidemenu .header, [riot-tag="rg-sidemenu"] .header{ padding: 1.2rem; margin: 0; text-align: center; color: white; } rg-sidemenu .items, [riot-tag="rg-sidemenu"] .items{ padding: 0; margin: 0; list-style: none; } rg-sidemenu .item, [riot-tag="rg-sidemenu"] .item{ padding: 1rem 0.5rem; box-sizing: border-box; border-top: 1px solid #1a1a1a; color: white; } rg-sidemenu .item:last-child, [riot-tag="rg-sidemenu"] .item:last-child{ border-bottom: 1px solid #1a1a1a; } rg-sidemenu .item:hover, [riot-tag="rg-sidemenu"] .item:hover{ cursor: pointer; background-color: #2a2a2a; } rg-sidemenu .item.active, [riot-tag="rg-sidemenu"] .item.active{ cursor: pointer; background-color: #444; }', function (opts) {
		this.close = function () {
			return opts.sidemenu.expanded = false;
		};

		this.selected = function (item) {
			item = item.item;
			opts.sidemenu.items.forEach(function (item) {
				return item.active = false;
			});
			item.active = true;
			if (item.action) item.action(item);
		};
	});

	riot.tag('rg-tab-heading', '<yield></yield>', 'rg-tab-heading, [riot-tag="rg-tab-heading"]{ display: none; }', function (opts) {});

	riot.tag('rg-tab', '<div show="{ active }" class="tab"> <yield></yield> </div>', '.tab { padding: 10px; }', function (opts) {
		this.active = opts.active;
		this.disabled = opts.disabled;
	});

	riot.tag('rg-tabs', '<div class="tabs"> <div class="headers"> <div each="{ tab in tabs }" class="header { active: tab.active, disabled: tab.disabled }" onclick="{ activate }"> <h4 class="heading" if="{ tab.opts.heading && !tab.heading }">{ tab.opts.heading }</h4> <div class="heading" if="{ tab.heading }"> <rg-raw content="{ tab.heading }"></rg-raw> </div> </div> </div> <yield></yield> </div>', 'rg-tabs .tabs, [riot-tag="rg-tabs"] .tabs{ background-color: white; } rg-tabs .headers, [riot-tag="rg-tabs"] .headers{ display: -webkit-flex; display: -ms-flexbox; display: flex; } rg-tabs .header, [riot-tag="rg-tabs"] .header{ -webkit-flex: 1; -ms-flex: 1; flex: 1; box-sizing: border-box; text-align: center; cursor: pointer; box-shadow: 0 -1px 0 0 #404040 inset; } rg-tabs .heading, [riot-tag="rg-tabs"] .heading{ padding: 10px; margin: 0; } rg-tabs .header.active, [riot-tag="rg-tabs"] .header.active{ background-color: #404040; } rg-tabs .header.active .heading, [riot-tag="rg-tabs"] .header.active .heading{ color: white; } rg-tabs .header.disabled .heading, [riot-tag="rg-tabs"] .header.disabled .heading{ color: #888; }', function (opts) {
		var _this = this;

		this.onopen = opts.onopen;
		this.tabs = this.tags['rg-tab'];
		var deselectTabs = function deselectTabs() {
			return _this.tabs.forEach(function (tab) {
				return tab.active = false;
			});
		};

		// If more than one tab set to active honor the first one
		this.on('mount', function () {
			var activeTab = false;
			_this.tabs.forEach(function (tab, i) {
				// Give each tab an index
				tab.index = i;

				var tabHeading = tab.tags['rg-tab-heading'];
				if (tabHeading) {
					if (Object.prototype.toString.call(tabHeading) !== '[object Array]') tab.heading = tabHeading.root.innerHTML;
				}

				if (activeTab) tab.active = false;
				if (tab.active) activeTab = true;
			});
			_this.update();
		});

		// Deactivate all tabs and active selected one
		this.activate = function (e) {
			var tab = e.item.tab;
			if (!tab.disabled) {
				deselectTabs();
				if (_this.onopen) _this.onopen(tab);
				tab.active = true;
			}
		};
	});

	riot.tag('rg-tags', '<div class="container"> <span class="tags"> <span class="tag" each="{ opts.tags }" onclick="{ parent.removeTag }"> { text } <span class="close">&times;</span> </span> </span> <div class="input-container { open: opened }"> <input type="{ opts.type || \'text\' }" name="textbox" placeholder="{ opts.placeholder }" onkeydown="{ handleKeys }" oninput="{ filterItems }" onfocus="{ filterItems }"> <div class="dropdown { open: opened }" show="{ opened }"> <div class="list"> <ul> <li each="{ filteredItems }" onclick="{ parent.select }" class="item { active: active }"> { text } </li> </ul> </div> </div> </div> </div>', 'rg-tags .container, [riot-tag="rg-tags"] .container{ width: 100%; border: 1px solid #D3D3D3; background: white; text-align: left; padding: 0; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; } rg-tags .input-container, [riot-tag="rg-tags"] .input-container{ position: absolute; display: inline-block; cursor: pointer; } rg-tags input, [riot-tag="rg-tags"] input{ width: 100%; font-size: 1em; padding: 10px; border: 0; background-color: transparent; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; outline: none; } rg-tags .dropdown, [riot-tag="rg-tags"] .dropdown{ position: absolute; width: 100%; background-color: white; border: 1px solid #D3D3D3; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; overflow-y: auto; overflow-x: hidden; } rg-tags .dropdown.open, [riot-tag="rg-tags"] .dropdown.open{ -webkit-box-shadow: 0 2px 10px -4px #444; -moz-box-shadow: 0 2px 10px -4px #444; box-shadow: 0 2px 10px -4px #444; } rg-tags ul, [riot-tag="rg-tags"] ul,rg-tags li, [riot-tag="rg-tags"] li{ list-style: none; padding: 0; margin: 0; } rg-tags li, [riot-tag="rg-tags"] li{ padding: 10px; border-top: 1px solid #E8E8E8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } rg-tags li:first-child, [riot-tag="rg-tags"] li:first-child{ border-top: 0; } rg-tags li:hover, [riot-tag="rg-tags"] li:hover{ background-color: #f3f3f3; } rg-tags li.active, [riot-tag="rg-tags"] li.active,rg-tags li:hover.active, [riot-tag="rg-tags"] li:hover.active{ background-color: #ededed; } rg-tags .tags, [riot-tag="rg-tags"] .tags{ display: inline-block; max-width: 70%; white-space: nowrap; overflow-y: hidden; overflow-x: auto; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } rg-tags .tag, [riot-tag="rg-tags"] .tag{ position: relative; display: inline-block; padding: 5px 20px 5px 5px; margin: 4px 5px; background-color: #444; color: #fff; cursor: pointer; } rg-tags .tag:hover, [riot-tag="rg-tags"] .tag:hover,rg-tags .tag:active, [riot-tag="rg-tags"] .tag:active{ background-color: #666; } rg-tags .close, [riot-tag="rg-tags"] .close{ position: absolute; right: 5px; top: 5px; color: rgba(255,255,255,0.7); }', function (opts) {
		var _this = this;

		this.opened = true;
		this.textbox.value = opts.value || '';
		opts.items = opts.items || [];
		opts.tags = opts.tags || [];
		opts.tags.forEach(function (tag, i) {
			return tag.index = i;
		});

		this.filterItems = function () {
			_this.filteredItems = opts.items.filter(function (item) {
				item.active = false;
				if (_this.textbox.value.length == 0 || item.text.toString().toLowerCase().indexOf(_this.textbox.value.toString().toLowerCase()) > -1) return true;
			});
			_this.opened = _this.filteredItems.length > 0;
			if (opts.onfilter) opts.onfilter();
			_this.update();
		};

		this.handleKeys = function (e) {
			var length = _this.filteredItems.length;
			if (length > 0 && [13, 38, 40].indexOf(e.keyCode) > -1) {
				_this.opened = true;
				e.preventDefault();
				// Get the currently selected item
				var activeIndex = null;
				for (var i = 0; i < length; i++) {
					var item = _this.filteredItems[i];
					if (item.active) {
						activeIndex = i;
						break;
					}
				}

				// We're leaving this item
				if (activeIndex != null) _this.filteredItems[activeIndex].active = false;

				if (e.keyCode == 38) {
					// Move the active state to the next item lower down the index
					if (activeIndex == null || activeIndex == 0) _this.filteredItems[length - 1].active = true;else _this.filteredItems[activeIndex - 1].active = true;
				} else if (e.keyCode == 40) {
					// Move the active state to the next item higher up the index
					if (activeIndex == null || activeIndex == length - 1) _this.filteredItems[0].active = true;else _this.filteredItems[activeIndex + 1].active = true;
				} else if (e.keyCode == 13 && activeIndex != null) {
					_this.select({ item: _this.filteredItems[activeIndex] });
				}
			}
			if (e.keyCode == 13) {
				_this.addTag();
			} else if (e.keyCode == 8 && _this.textbox.value == '' && opts.tags.length > 0) {
				var tag = opts.tags.pop();
				_this.textbox.value = tag.text;
			}
			return true;
		};

		this.addTag = function (item) {
			var tag = item || { text: _this.textbox.value };
			if (tag.text.length > 0) {
				tag.index = opts.tags.length;
				opts.tags.push(tag);
				_this.textbox.value = '';
				_this.filteredItems = opts.items;
				_this.opened = false;
			}
			_this.update();
		};

		this.removeTag = function (e) {
			opts.tags.splice(opts.tags.indexOf(e.item), 1);
			_this.opened = false;
		};

		this.select = function (item) {
			item = item.item;
			if (opts.onselect) opts.onselect(item);
			_this.addTag(item);
		};

		this.closeDropdown = function (e) {
			if (!_this.root.contains(e.target)) {
				if (opts.onclose && _this.opened) opts.onclose();
				_this.opened = false;
				_this.update();
			}
		};

		this.on('mount', function () {
			document.addEventListener('click', _this.closeDropdown);
			document.addEventListener('focus', _this.closeDropdown, true);
			_this.opened = opts.opened;
			_this.update();
		});

		this.on('unmount', function () {
			document.removeEventListener('click', _this.closeDropdown);
			document.removeEventListener('focus', _this.closeDropdown, true);
		});

		this.on('update', function () {
			var containerWidth = _this.root.querySelector('.container').getBoundingClientRect().width;
			var tagList = _this.root.querySelector('.tags');
			var tagListWidth = tagList.getBoundingClientRect().width;
			tagList.scrollLeft = Number.MAX_VALUE;

			var inputContainer = _this.root.querySelector('.input-container');
			inputContainer.style.width = containerWidth - tagListWidth + 'px';
			_this.root.querySelector('.container').style.height = inputContainer.getBoundingClientRect().height + 'px';
		});
	});

	riot.tag('rg-timepicker', '<rg-select placeholder="Select a time" filter-placeholder="Filter times" options="{ times }" onopen="{ opts.onopen }" onclose="{ opts.onclose }" onselect="{ opts.onselect }"> </rg-select>', function (opts) {
		opts.time = opts.time || 'now';
		if (opts.time == 'now') opts.time = new Date();
		if (opts.min) opts.min = opts.min.split(':');
		if (opts.max) opts.max = opts.max.split(':');
		var step = parseInt(opts.step) || 1;
		this.times = [];

		for (var i = 0; i < 1440; i++) {
			if (i % step == 0) {
				var d = new Date(0);
				d.setHours(opts.time.getHours());
				d.setMinutes(opts.time.getMinutes());
				d = new Date(d.getTime() + i * 60000);
				// Check min range
				if (opts.min) {
					if (d.getHours() < opts.min[0]) continue;
					if (d.getHours() == opts.min[0] && d.getMinutes() < opts.min[1]) continue;
				}
				// Check max range
				if (opts.max) {
					if (d.getHours() > opts.max[0]) continue;
					if (d.getHours() == opts.max[0] && d.getMinutes() > opts.max[1]) continue;
				}
				var t = {
					hours: d.getHours(),
					minutes: d.getMinutes()
				};
				var m = t.minutes;
				if (m < 10) m = '0' + m;
				if (opts.ampm) {
					// 12h
					var ampm = 'am';
					var h = t.hours;
					if (h >= 12) {
						ampm = 'pm';
						h = h - 12;
					}
					if (h == 0) h = 12;
					t.text = h + ':' + m + ' ' + ampm;
					t.period = ampm;
				} else {
					// 24h
					var h = t.hours;
					if (h < 10) h = '0' + h;
					t.text = h + ':' + m;
				}
				this.times.push(t);
			}
		}
	});

	riot.tag('rg-toast', '<div class="toasts { opts.position }" if="{ opts.toasts.length > 0 }"> <div class="toast" each="{ opts.toasts }" onclick="{ parent.toastClicked }"> { text } </div> </div>', 'rg-toast .toasts, [riot-tag="rg-toast"] .toasts{ position: fixed; width: 250px; max-height: 100%; overflow-y: auto; background-color: transparent; z-index: 101; } rg-toast .toasts.topleft, [riot-tag="rg-toast"] .toasts.topleft{ top: 0; left: 0; } rg-toast .toasts.topright, [riot-tag="rg-toast"] .toasts.topright{ top: 0; right: 0; } rg-toast .toasts.bottomleft, [riot-tag="rg-toast"] .toasts.bottomleft{ bottom: 0; left: 0; } rg-toast .toasts.bottomright, [riot-tag="rg-toast"] .toasts.bottomright{ bottom: 0; right: 0; } rg-toast .toast, [riot-tag="rg-toast"] .toast{ padding: 20px; margin: 20px; background-color: rgba(0, 0, 0, 0.8); color: white; font-size: 13px; cursor: pointer; }', function (opts) {
		var _this = this;

		if (!opts.position) opts.position = 'topright';

		this.toastClicked = function (e) {
			if (e.item.onclick) e.item.onclick(e);
			if (e.item.onclose) e.item.onclose();
			window.clearTimeout(e.item.timer);
			opts.toasts.splice(opts.toasts.indexOf(e.item), 1);
		};

		this.on('update', function () {
			opts.toasts.forEach(function (toast) {
				toast.id = Math.random().toString(36).substr(2, 8);
				if (!toast.timer && !toast.sticky) {
					toast.startTimer = function () {
						toast.timer = window.setTimeout(function () {
							opts.toasts.splice(opts.toasts.indexOf(toast), 1);
							if (toast.onclose) toast.onclose();
							_this.update();
						}, toast.timeout || 6000);
					};
					toast.startTimer();
				}
			});
		});
	});

	riot.tag('rg-toggle', '<div class="wrapper"> <label class="toggle"> <input type="checkbox" __checked="{ opts.toggle.checked }" onclick="{ toggle }"> <div class="track"> <div class="handle"></div> </div> </label> </div>', 'rg-toggle .wrapper, [riot-tag="rg-toggle"] .wrapper{ width: 60px; height: 20px; margin: 0 auto; display: block; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } rg-toggle .toggle, [riot-tag="rg-toggle"] .toggle{ position: absolute; cursor: pointer; } rg-toggle input[type=checkbox], [riot-tag="rg-toggle"] input[type=checkbox]{ display: none; } rg-toggle .track, [riot-tag="rg-toggle"] .track{ position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 60px; height: 20px; padding: 2px; background-color: #b6c0c7; -webkit-transition: background-color 0.1s linear; transition: background-color 0.1s linear; box-sizing: border-box; } rg-toggle input[type=checkbox]:checked + .track, [riot-tag="rg-toggle"] input[type=checkbox]:checked + .track{ background-color: #2db2c8; } rg-toggle .handle, [riot-tag="rg-toggle"] .handle{ position: relative; left: 0; width: 50%; height: 100%; background-color: white; -webkit-transition: transform 0.1s linear; transition: transform 0.1s linear; } rg-toggle input[type=checkbox]:checked + .track .handle, [riot-tag="rg-toggle"] input[type=checkbox]:checked + .track .handle{ -webkit-transform: translate3d(100%, 0, 0); transform: translate3d(100%, 0, 0); }', function (opts) {
		opts.toggle = opts.toggle ? opts.toggle : {};

		this.toggle = function (e) {
			opts.toggle.checked = !opts.toggle.checked;
			if (opts.toggle.ontoggle) opts.toggle.ontoggle(e);
		};
	});

	riot.tag('rg-unsplash', '<img riot-src="https://unsplash.it/{ grayscale }{ width }/{ height }/?{ options }">', function (opts) {
		this.width = opts.width || 450;
		this.height = opts.height || 250;
		this.options = '';
		if (opts.greyscale || opts.grayscale) this.grayscale = 'g/';
		if (opts.random) this.options += 'random&';
		if (opts.blur) this.options += 'blur&';
		if (opts.image) this.options += 'image=' + opts.image + '&';
		if (opts.gravity) this.options += 'gravity=' + opts.gravity;
	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Riot Bootstrap (http://cognitom.github.io/riot-bootstrap/)
	 * Copyright 2015 Tsutomu Kawamura.
	 * Licensed under MIT
	 */
	;(function(window) {

	var riot = (!window || !window.riot) ? __webpack_require__(1) : window.riot;

	riot.tag('btn-group', '<yield></yield>', 'btn-group , [riot-tag="btn-group"] { position: relative; display: inline-block; vertical-align: middle; } btn-group btn, [riot-tag="btn-group"] btn{ position: relative; float: left; } btn-group btn + btn, [riot-tag="btn-group"] btn + btn{ margin-left: -1px; } btn-group btn[toggle]:not(:first-child) > *, [riot-tag="btn-group"] btn[toggle]:not(:first-child) > *{ padding-right: 8px; padding-left: 8px; } btn-group > btn:hover, [riot-tag="btn-group"] > btn:hover,btn-group > btn:focus, [riot-tag="btn-group"] > btn:focus,btn-group > btn:active, [riot-tag="btn-group"] > btn:active{ z-index: 2; } btn-group > btn:not(:first-child):not(:last-child):not([toggle]) > *, [riot-tag="btn-group"] > btn:not(:first-child):not(:last-child):not([toggle]) > *{ border-radius: 0; } btn-group > btn:first-child, [riot-tag="btn-group"] > btn:first-child{ margin-left: 0; } btn-group > btn:first-child:not(:last-child):not([toggle]) > *, [riot-tag="btn-group"] > btn:first-child:not(:last-child):not([toggle]) > *{ border-top-right-radius: 0; border-bottom-right-radius: 0; } btn-group > btn:last-child:not(:first-child) > *, [riot-tag="btn-group"] > btn:last-child:not(:first-child) > *,btn-group > btn:not(:first-child)[toggle] > *, [riot-tag="btn-group"] > btn:not(:first-child)[toggle] > *{ border-top-left-radius: 0; border-bottom-left-radius: 0; }', function(opts) {
	    this.mixin('parentScope')
	  
	});

	riot.tag('btn', '<button type="button" __disabled="{ disabled }" data-option="{ opts.option }" data-size="{ opts.size }" onclick="{ push }" ><yield></yield></button>', 'btn button, [riot-tag="btn"] button{ display: inline-block; padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: normal; line-height: 1.42857143; text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; background-image: none; border: 1px solid transparent; border-radius: 4px; } btn button:focus, [riot-tag="btn"] button:focus{ outline: thin dotted; outline: 5px auto -webkit-focus-ring-color; outline-offset: -2px; } btn button:hover, [riot-tag="btn"] button:hover,btn button:focus, [riot-tag="btn"] button:focus{ color: #333; text-decoration: none; } btn button:active, [riot-tag="btn"] button:active{ background-image: none; outline: 0; box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125); } btn button[disabled], [riot-tag="btn"] button[disabled]{ pointer-events: none; cursor: not-allowed; box-shadow: none; opacity: .65; } btn button, [riot-tag="btn"] button{ color: #333; background-color: #fff; border-color: #ccc } btn button:hover, [riot-tag="btn"] button:hover,btn button:focus, [riot-tag="btn"] button:focus,btn button:active, [riot-tag="btn"] button:active{ color: #333; background-color: #e6e6e6; border-color: #adadad } btn button[data-option="primary"], [riot-tag="btn"] button[data-option="primary"]{ color: #fff; background-color: #337ab7; border-color: #2e6da4 } btn button[data-option="primary"]:hover, [riot-tag="btn"] button[data-option="primary"]:hover,btn button[data-option="primary"]:focus, [riot-tag="btn"] button[data-option="primary"]:focus,btn button[data-option="primary"]:active, [riot-tag="btn"] button[data-option="primary"]:active{ color: #fff; background-color: #286090; border-color: #204d74 } btn button[data-option="success"], [riot-tag="btn"] button[data-option="success"]{ color: #fff; background-color: #5cb85c; border-color: #4cae4c } btn button[data-option="success"]:hover, [riot-tag="btn"] button[data-option="success"]:hover,btn button[data-option="success"]:focus, [riot-tag="btn"] button[data-option="success"]:focus,btn button[data-option="success"]:active, [riot-tag="btn"] button[data-option="success"]:active{ color: #fff; background-color: #449d44; border-color: #398439 } btn button[data-option="info"], [riot-tag="btn"] button[data-option="info"]{ color: #fff; background-color: #5bc0de; border-color: #46b8da } btn button[data-option="info"]:hover, [riot-tag="btn"] button[data-option="info"]:hover,btn button[data-option="info"]:focus, [riot-tag="btn"] button[data-option="info"]:focus,btn button[data-option="info"]:active, [riot-tag="btn"] button[data-option="info"]:active{ color: #fff; background-color: #31b0d5; border-color: #269abc } btn button[data-option="warning"], [riot-tag="btn"] button[data-option="warning"]{ color: #fff; background-color: #f0ad4e; border-color: #f0ad4e } btn button[data-option="warning"]:hover, [riot-tag="btn"] button[data-option="warning"]:hover,btn button[data-option="warning"]:focus, [riot-tag="btn"] button[data-option="warning"]:focus,btn button[data-option="warning"]:active, [riot-tag="btn"] button[data-option="warning"]:active{ color: #fff; background-color: #ec971f; border-color: #d58512 } btn button[data-option="danger"], [riot-tag="btn"] button[data-option="danger"]{ color: #fff; background-color: #d9534f; border-color: #d43f3a } btn button[data-option="danger"]:hover, [riot-tag="btn"] button[data-option="danger"]:hover,btn button[data-option="danger"]:focus, [riot-tag="btn"] button[data-option="danger"]:focus,btn button[data-option="danger"]:active, [riot-tag="btn"] button[data-option="danger"]:active{ color: #fff; background-color: #c9302c; border-color: #ac2925 } btn button[data-option="link"], [riot-tag="btn"] button[data-option="link"]{ font-weight: normal; color: #337ab7; border-radius: 0; background-color: transparent; border-color: transparent; box-shadow: none; } btn button[data-option="link"]:hover, [riot-tag="btn"] button[data-option="link"]:hover,btn button[data-option="link"]:focus, [riot-tag="btn"] button[data-option="link"]:focus{ color: #23527c; text-decoration: underline; } btn button[data-size="lg"], [riot-tag="btn"] button[data-size="lg"]{ padding: 10px 16px; font-size: 18px; line-height: 1.3333333; border-radius: 6px; } btn button[data-size="sm"], [riot-tag="btn"] button[data-size="sm"]{ padding: 5px 10px; font-size: 12px; line-height: 1.5; border-radius: 3px; } btn button[data-size="xs"], [riot-tag="btn"] button[data-size="xs"]{ padding: 1px 5px; font-size: 12px; line-height: 1.5; border-radius: 3px; }', function(opts) {
	    this.disabled = undefined

	    this.culculateProperties = function(e) {
	      this.disabled =
	        opts.hasOwnProperty('__disabled') ? opts.__disabled === true :
	        opts.hasOwnProperty('disabled') ? opts.disabled === '' || opts.disabled === 'disabled':
	        false
	    }.bind(this);
	    this.push = function(e) {
	      if (this.disabled) return
	      if (this.parent && opts.toggle) this.parent.trigger('inner-btn-toggle')
	      if (opts.href) {
	        e.preventUpdate = true
	        location.href = opts.href
	        return
	      }
	      if (opts.onpush){
	        e.preventUpdate = true
	        opts.onpush(e)
	        this.updateCaller(opts.onpush)
	      }
	    }.bind(this);

	    this.on('update', this.culculateProperties)
	    this.mixin('parentScope')
	  
	});

	riot.tag('caret', '', 'caret , [riot-tag="caret"] { display: inline-block; width: 0; height: 0; margin-left: 2px; vertical-align: middle; border-top: 4px dashed; border-right: 4px solid transparent; border-left: 4px solid transparent; }', function(opts) {
	  

	});

	riot.tag('input-img', '<img riot-src="{ image }" width="{ width }" height="{ height }"> <input if="{ name }" name="{ name }" type="hidden" value="{ self.image }">', 'input-img { position: relative; display: inline-block; vertical-align: middle; padding: 4px; line-height: 1em; border: 1px solid #ccc; border-radius: 5px; overflow: hidden; } input-img.highlight { box-shadow: 0 0 5px #419bf9; } input-img > img { display: block; border-radius: 3px; }', function(opts) {
	    var self = this
	    self.image  = opts.value || opts.placeholder || ''
	    self.width  = opts.width || 100
	    self.height = opts.height || 100
	    self.name   = opts.name || ''

	    this.processFiles = function(e) {
	      e.stopPropagation()
	      e.preventDefault()
	      self.dehightlight()

	      var file = e.dataTransfer.files[0]
	      var reader = new FileReader()
	      if (file.type.match('image.*')) {
	        reader.onload = function(e2) {
	          self.image = e2.target.result
	          self.update()
	          if (self.image.length > 32768)
	            console.log('In IE8, data URIs cannot be larger than 32,768 characters.')
	          self.trigger('change')
	        }
	        reader.readAsDataURL(file)
	      }
	    }.bind(this);

	    this.highlight = function(e) {
	      e.stopPropagation()
	      e.preventDefault()
	      self.root.setAttribute('class', 'highlight')
	    }.bind(this);

	    this.dehightlight = function() {
	      self.root.removeAttribute('class')
	    }.bind(this);

	    if (isDroppable()) {
	      self.on('mount', function() {
	        self.root.addEventListener('drop', self.processFiles, false)
	        self.root.addEventListener('dragover', self.highlight, false)
	        self.root.addEventListener('dragenter', self.highlight, false)
	        self.root.addEventListener('dragleave', self.dehightlight, false)
	      })
	    }

	    self.on('update', function() {
	      self.root.value = self.image
	    })

	    self.on('change', function() {
	      if (opts.onchange){
	        opts.onchange()
	        self.updateCaller(opts.onchange)
	      }
	    })

	    function isDroppable() {
	      return window.File && window.FileReader && window.FileList && window.Blob
	    }

	    this.mixin('parentScope')
	  
	});

	riot.tag('menu-divider', '', 'menu-divider , [riot-tag="menu-divider"] { display: block; height: 1px; margin: 9px 0; overflow: hidden; background-color: #e5e5e5; }', function(opts) {
	  

	});

	riot.tag('menu-header', '<yield></yield>', 'menu-header , [riot-tag="menu-header"] { display: block; padding: 3px 20px; font-size: 12px; line-height: 1.42857143; color: #777; white-space: nowrap; }', function(opts) {
	    this.mixin('parentScope')
	  
	});

	riot.tag('menu-item', '<yield></yield>', 'menu-item { display: block; padding: 3px 20px; clear: both; font-weight: normal; line-height: 1.42857143; color: #333; white-space: nowrap; cursor: pointer; } menu-item:hover, menu-item:focus { color: #262626; text-decoration: none; background-color: #f5f5f5; }', function(opts) {

	    this.click = function(e) {
	      var menu = this.parent
	      if (!menu.select) menu = menu.parent // if inner roop
	      menu.select(opts.value || this.root.innerText)
	    }.bind(this);
	    this.addEventListners = function(e) {
	      this.root.addEventListener('touchstart', this.click, false)
	      this.root.addEventListener('click', this.click, false)
	    }.bind(this);
	    this.removeEventListners = function(e) {
	      this.root.removeEventListener('touchstart', this.click)
	      this.root.removeEventListener('click', this.click)
	    }.bind(this);

	    this.one('mount', this.addEventListners)
	    this.one('unmount', this.removeEventListners)
	    this.mixin('parentScope')
	  
	});

	riot.tag('menu', '<yield></yield>', 'menu , [riot-tag="menu"] { position: absolute; top: 100%; left: 0; z-index: 1000; display: none; float: left; min-width: 160px; padding: 5px 0; margin: 2px 0 0; font-size: 14px; text-align: left; list-style: none; background-color: #fff; background-clip: padding-box; border: 1px solid #ccc; border: 1px solid rgba(0, 0, 0, .15); border-radius: 4px; box-shadow: 0 6px 12px rgba(0, 0, 0, .175); }', function(opts) {
	    var opened = false

	    this.open = function(e) {
	      if (!opened) {
	        opened = true
	        this.root.style.display = 'block'
	        setTimeout(this.addEventListners, 1)
	      }
	    }.bind(this);
	    this.close = function(e) {
	      opened = false
	      this.root.style.display = 'none'
	      this.removeEventListners()
	    }.bind(this);
	    this.select = function(value) {
	      if (opts.onselect) {
	        opts.onselect(value)
	        this.updateCaller(opts.onselect)
	      }
	    }.bind(this);
	    this.addEventListners = function(e) {
	      document.addEventListener('touchstart', this.close, false)
	      document.addEventListener('click', this.close, false)
	    }.bind(this);
	    this.removeEventListners = function(e) {
	      document.removeEventListener('touchstart', this.close)
	      document.removeEventListener('click', this.close)
	    }.bind(this);

	    if (this.parent) this.parent.on('inner-btn-toggle', this.open)
	    this.mixin('parentScope')
	  
	});

	riot.tag('radio-group', '<yield></yield>', 'radio-group , [riot-tag="radio-group"] { position: relative; display: inline-block; vertical-align: middle; } radio-group radio, [riot-tag="radio-group"] radio{ position: relative; float: left; } radio-group radio + radio, [riot-tag="radio-group"] radio + radio{ margin-left: -1px; } radio-group radio[toggle]:not(:first-child) > *, [riot-tag="radio-group"] radio[toggle]:not(:first-child) > *{ padding-right: 8px; padding-left: 8px; } radio-group > radio:hover, [riot-tag="radio-group"] > radio:hover,radio-group > radio:focus, [riot-tag="radio-group"] > radio:focus,radio-group > radio:active, [riot-tag="radio-group"] > radio:active{ z-index: 2; } radio-group > radio:not(:first-child):not(:last-child):not([toggle]) > *, [riot-tag="radio-group"] > radio:not(:first-child):not(:last-child):not([toggle]) > *{ border-radius: 0; } radio-group > radio:first-child, [riot-tag="radio-group"] > radio:first-child{ margin-left: 0; } radio-group > radio:first-child:not(:last-child):not([toggle]) > *, [riot-tag="radio-group"] > radio:first-child:not(:last-child):not([toggle]) > *{ border-top-right-radius: 0; border-bottom-right-radius: 0; } radio-group > radio:last-child:not(:first-child) > *, [riot-tag="radio-group"] > radio:last-child:not(:first-child) > *,radio-group > radio:not(:first-child)[toggle] > *, [riot-tag="radio-group"] > radio:not(:first-child)[toggle] > *{ border-top-left-radius: 0; border-bottom-left-radius: 0; }', function(opts) {
	    this.value = opts.value

	    this.set = function(value) {
	      this.value = value
	      this.root.value = value
	      this.trigger('change', value)
	      if (opts.onchange){
	        opts.onchange(value)
	        this.updateCaller(opts.onchange)
	      }
	    }.bind(this);
	    
	    this.mixin('parentScope')
	  
	});

	riot.tag('radio', '<button type="button" __disabled="{ opts.disabled }" data-selected="{ selected ? \'yes\' : \'no\' }" data-size="{ opts.size }" onclick="{ click }" ><input type="radio" __checked="{ selected }" onclick="{ click }"> <yield></yield></button>', 'radio button, [riot-tag="radio"] button{ display: inline-block; padding: 6px 12px; margin-bottom: 0; font-size: 14px; font-weight: normal; line-height: 1.42857143; text-align: center; white-space: nowrap; vertical-align: middle; cursor: pointer; background-image: none; border: 1px solid transparent; border-radius: 4px; } radio button:focus, [riot-tag="radio"] button:focus{ outline: thin dotted; outline: 5px auto -webkit-focus-ring-color; outline-offset: -2px; } radio button:hover, [riot-tag="radio"] button:hover,radio button:focus, [riot-tag="radio"] button:focus{ color: #333; text-decoration: none; } radio button:active, [riot-tag="radio"] button:active{ background-image: none; outline: 0; box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125); } radio button[disabled], [riot-tag="radio"] button[disabled]{ pointer-events: none; cursor: not-allowed; box-shadow: none; opacity: .65; } radio button, [riot-tag="radio"] button{ color: #333; background-color: #fff; border-color: #ccc } radio button:hover, [riot-tag="radio"] button:hover,radio button:focus, [riot-tag="radio"] button:focus,radio button:active, [riot-tag="radio"] button:active,radio button[data-selected="yes"], [riot-tag="radio"] button[data-selected="yes"]{ color: #333; background-color: #e6e6e6; border-color: #adadad } radio button[data-size="lg"], [riot-tag="radio"] button[data-size="lg"]{ padding: 10px 16px; font-size: 18px; line-height: 1.3333333; border-radius: 6px; } radio button[data-size="sm"], [riot-tag="radio"] button[data-size="sm"]{ padding: 5px 10px; font-size: 12px; line-height: 1.5; border-radius: 3px; } radio button[data-size="xs"], [riot-tag="radio"] button[data-size="xs"]{ padding: 1px 5px; font-size: 12px; line-height: 1.5; border-radius: 3px; }', function(opts) {
	    this.selected = (opts.value == this.parent.value)

	    this.check = function() {
	      this.selected = (opts.value == this.parent.value)
	      this.update()
	    }.bind(this);

	    this.click = function(e) {
	      if (this.selected) return
	      if (this.parent && this.parent.set) this.parent.set(opts.value || this.root.innerText)
	      else this.selected = true
	    }.bind(this);

	    this.parent.on('change', this.check)
	  
	});

	/*!
	 * Parent Scope mixin
	 * A part of Riot Bootstrap
	 * http://cognitom.github.io/riot-bootstrap/
	 */
	riot.mixin('parentScope', {
	  // initialize mixin
	  init: function() {
	    this._ownPropKeys = []
	    this._ownOptsKeys = []
	    for (var k in this) this._ownPropKeys[k] = true
	    for (var k in this.opts) this._ownOptsKeys[k] = true

	    this.on('update', function() {
	      for (var k in this.parent)
	        if (!this._ownPropKeys[k]) this[k] = this.parent[k]
	      for (var k in this.parent.opts)
	        if (!this._ownOptsKeys[k]) this.opts[k] = this.parent.opts[k]
	    })
	  },

	  // update the tag object who calls me
	  updateCaller: function(f) {
	    var keys = []
	    for (var k in this.parent._ownPropKeys || this.parent) keys.push(k)
	    for (var i = 0; i < keys.length; i++)
	      if (this.parent[keys[i]] === f) {
	        this.parent.update()
	        return
	      }
	    if (this.parent.updateCaller) this.parent.updateCaller(f)
	  }
	})


	})(typeof window != 'undefined' ? window : undefined)

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {
	__webpack_require__(14);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(20);

	riot.tag('app', '<app-dispatcher name="dispatcher"></app-dispatcher> <app-router name="router"></app-router> <topmenu> <btn-group> <btn onpush="{switchpage}" route="blogs">Blogs</btn> <btn onpush="{switchpage}" route="albums">Albums</btn> <btn-group> </topmenu> <stores> <blog-store name="blogs"></blog-store> <album-store name="blogs" ></album-store> </stores>', function(opts) {
			this.switchpage = function(e){
				var routeTarget = e.target.parentNode.getAttribute('route');
				riot.route(routeTarget);
			}
			this.includePages = function(){
				var initialPages = document.getElementsByTagName('pages')[0].cloneNode(true);
				this.root.appendChild(initialPages);
				document.getElementsByTagName('pages')[0].parentNode.removeChild(document.getElementsByTagName('pages')[0]);
			}
			this.registerWithRouter = function(){
				this.includePages();
				document.addEventListener('router-hello', function(e){
					//If no hash is given, mount the first page.
					if (!window.location.hash){
						//Route to the first page.
						var firstPage = this.root.getElementsByTagName('PAGES')[0].children[0].tagName.toLowerCase();
						riot.route(firstPage);
					}else{
						riot.route.exec(e.detail.router.router);
					}


				});

				var helloRouter = new CustomEvent('hello-router');
				document.dispatchEvent(helloRouter);

			}.bind(this);

			this.on('mount', function(){
				//Register with router.
				setTimeout(this.registerWithRouter, 1)


			});
		
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {__webpack_require__(15);
	var BlogPost = __webpack_require__(17);
	riot.tag('blog-store', '<base-remote-json-collection name="collection" modeltype="{BlogPost}" baseurl="http://jsonplaceholder.typicode.com/posts"></base-remote-json-collection>', function(opts) {
		var self = this;

			//Listen to event
			self.on('blog-store-init', function(){

				//Trigger event on json-collection.
				self.tags.collection.trigger('init', {}, function(coll){

					//Trigger on dispatcher, and let the app now something wonderful has happend.
				 	window.app.dispatcher.trigger('blog-store-changed', coll);
				});
			});

			//Register with the dispatcher.
			self.registerWithDispatcher = function(e){

			   //Register
				window.app.dispatcher.addStore(self);
				self.dispatcher = window.app.dispatcher;

				//Remove possible eventlistener.
				document.removeEventListener('dispatcher-ready', self.registerWithDispatcher);
		   }


			this.on('mount', function(){
				//Set the modeltype for the collection.
				self.tags.collection.modelType = BlogPost;

				//Check if dispatcher is ready.
				if (window.app.dispatcher) {

				  //If appDispatcher is ready then register
				  self.registerWithDispatcher();
				} else {

				  //AppDispatcher not ready yet, register event and wait for it to be ready.
				  document.addEventListener('dispatcher-ready', self.registerWithDispatcher);
				}
			});

			//Listen for a collection change on the remote collection.
			this.tags.collection.on('collection-changed', function(e){
				window.app.dispatcher.trigger('blog-store-changed', e.detail.collection);
			});
		
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {__webpack_require__(16);
	riot.tag('base-remote-json-collection', '<base-ajax-json name="ajaxElement" query="{query}" onsuccess="{_success}" onerror="{_fail}" type="{type}" baseurl="{baseurl}"></base-ajax-json>', function(opts) {
	    /* global opts */
	    'use strict';
	        var self = this;
	            self._currentPage = 0;
	            self.success = opts.success;
	            self.fail = opts.fail;
	            self.baseurl = opts.baseurl || '';
	            self.responseWrapper = opts.responsewrapper || null;
	            self.responseItemWrapper = opts.ersponseitemwrapper || null;
	            self.idproperty = opts.idproperty || 'id';
	            self.decodeResult = opts.decodeResult || null;
	            self.collection = {};
	            self._collection = [];
	            self.modelType = opts.modelType || null;
	            self.paging = opts.paging ||  function(){
	                return {page:self._currentPage++};
	            };

	            self.collection = [];

	        /** Fetch a collection by ajax and store the collection.
	         *
	         * */
	        self.query = {
	            //userId:1
	        };

	        self._success = function(response){
	            console.log('successful');
	            response = response.detail || response; //IF it is the custom event we receive then set it to detail, otherwise it is the response.
	            var newitems = {};

	            var unwrappedItem;
	            var unwrappedResponse = self.responseWrapper ? response[self.responseWrapper] : response;

	            unwrappedResponse.forEach(function(item){
	                //If a itemwrapper property is supplied then get the inner object.
	                unwrappedItem = self.responseItemWrapper ? item[self.responseItemWrapper] : item;
	                if (self.modelType) {
	                    unwrappedItem = new self.modelType(unwrappedItem)
	                }

	                //Check if it laready is in the collection. this is only to be able to emit a change event.
	                if (self.collection[unwrappedItem[self.idproperty]]){
	                    //Update item in the collection.
	                    console.log('update item');
	                }else{
	                    //New item for the collection.
	                    console.log('add item');
	                    self._collection.push(unwrappedItem);
	                    newitems[unwrappedItem[self.idproperty]] = unwrappedItem;
	                }
	                self.collection[unwrappedItem[self.idproperty]] = unwrappedItem;

	            });

	            //Did we get asuplied callback?
	            self.trigger('collection-changed', {detail:{collection:self._collection, newItems: newitems}});
	            // if (self.success){
	            //     self.success(self._collection,newitems);
	            // }

	        };

	        self._fail = function(status,response){
	            console.log('failed');
	            self.fail(status, response);
	        };

	        self.on('init', function(options,callback){
	           options = {
	                onerror: self._fail,
	                type: opts.type || 'GET',
	                baseurl : self.baseurl
	            };
	            //If there already is a collection, return that. The user at least gets something old to watch before the new will appear.
	            if (self.collection.length) callback(self.collection);
	            self.tags.ajaxElement.trigger('get', options);
	        });

	        self.on('next-page', function(){
	            //should fetch the next page, based on where we are now, from the server.
	            console.log('not implemented');
	        });

	        self.on('re-init', function(){
	            //should reload from "page0"
	            //still keeping track of last page.
	            console.log('not implemented');
	        });

	        self.on('add-item', function(newItem, callback){
	            //Make a ajax post.
	            //Add it to the collection.
	            //Respond to the
	            var options = {
	                onsuccess: function(response){
	                    self.trigger('item-added', response);
	                },
	                onerror: self._fail,
	                type: opts.type || 'POST',
	                baseurl : self.baseurl,
	                query: newItem
	            };
	            self.tags.ajaxElement.trigger('post', options);
	        });

	        self.on('delete-item', function(newItem, callback){
	            //Make a ajax delete.
	            //Add it to the collection.
	            //Respond to the
	            var options = {
	                onsuccess: callback,
	                onerror: self._fail,
	                type: opts.type || 'DELETE',
	                baseurl : self.baseurl,
	                query: newItem
	            };
	            self.tags.ajaxElement.trigger('delete', options);
	        });

	        self.on('update-item', function(newItem, callback){
	            //Make a ajax delete.
	            //Add it to the collection.
	            //Respond to the
	            var options = {
	                onsuccess: callback,
	                onerror: self._fail,
	                type: opts.type || 'PUT',
	                baseurl : self.baseurl,
	                query: newItem
	            };
	            self.tags.ajaxElement.trigger('put', options);
	        });

	        self.on('fetch-item', function(itemId, callback){
	            //First check the local collection if the value is already present.
	            //If so return that.
	            //Otherwise fetch it from remote end.
	            if (self.collection[itemId]){
	                callback(self.collection[itemId]);
	                return;
	            }

	            var options = {
	                onsuccess: callback,
	                onerror: self._fail,
	                type: opts.type || 'PUT',
	                baseurl : self.baseurl,
	                query: newItem
	            };
	            self.tags.ajaxElement.trigger('put', options);
	        });
	    
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {riot.tag('base-ajax-json', '', function(opts) {
	    'use strict';
	        var self = this;
	        self._onsuccess = opts.onsuccess;

	        //"Listen" for observable event.
	        // this.on('go', function(payload, onsuccess, onerror){
	        //     self.go(payload, onsuccess, onerror);
	        // });

	        /** Creates a querystring from object.
	         * @return {string}     a encoded uri string.
	         */
	        self.createQueryString = function(){
	            var _queryString = '';
	            console.log('create querystring');
	            if (!self.query) {return _queryString;}
	            for (var property in self.query){
	                _queryString += (_queryString.length ? '&' : '') + property + '=' + encodeURIComponent(self.query[property]);
	            }
	            console.log(_queryString);
	            return _queryString;
	        };


	        self.on('get',function(options) {
	            self._makerequest(options);
	        });

	        self.on('post', function(options) {
	            self._makerequest(options);
	        });
	        self.on('put', function(options) {
	            self._makerequest(options);
	        });
	        self.on('delete', function(options) {
	            self._makerequest(options);
	        });
	        self._makerequest = function(options){
	            var xhr = new XMLHttpRequest();

	            var querystring = self.createQueryString();
	            var requestUrl = querystring.length > 0  ? options.baseurl + (options.baseurl.indexOf('?') > 0 ? '' : '?') + querystring : options.baseurl;
	            //var requestUrl = self.baseurl + '?' + querystring;
	            xhr.onreadystatechange = function() {
	                if(xhr.readyState === 4 ) {
	                    if  (xhr.status === 200 ) {
	                        //Callback registered with tag.
	                        self._onsuccess(JSON.parse(xhr.response));
	                        //Callback supplied by options.
	                        if (options.onsuccess) {options.onsuccess(JSON.parse(xhr.response));}


	                    } else {
	                        options.onerror(xhr.status, xhr.response);
	                    }

	                }
	            };

	            xhr.open(options.type.toUpperCase(), requestUrl, true);

	            if (options.type==='GET'){
	                xhr.send(null);
	            } else if (options.type === 'POST'){
	                xhr.setRequestHeader('Content-Type', 'application/json');
	                xhr.send(JSON.stringify(self.query));
	            }
	        };
	    
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    var BlogPost = function BlogPost(opts) {
	        if (!opts) opts = {};
	        this.id = opts.id || null;
	        this.title = opts.title || null;
	        this.body = opts.body || null;
	        this.userId = opts.userId || null;
	        this.getUser = function (callback) {
	            if (!this.userId) return;
	            var xhr = new XMLHttpRequest();

	            var requestUrl = 'http://jsonplaceholder.typicode.com/users/' + this.userId;
	            //var requestUrl = self.baseurl + '?' + querystring;
	            xhr.onreadystatechange = function () {
	                if (xhr.readyState === 4) {
	                    if (xhr.status === 200) {
	                        //Callback registered with tag.
	                        callback(JSON.parse(xhr.response));
	                    } else {
	                        console.log('error: ', xhr.status, xhr.response);
	                    }
	                }
	            };

	            xhr.open("GET", requestUrl, true);
	            xhr.send(null);
	            // if (options.type==='GET'){
	            //     xhr.send(null);
	            // } else if (options.type === 'POST'){
	            //     xhr.setRequestHeader('Content-Type', 'application/json');
	            //     xhr.send(JSON.stringify(self.query));
	            // }
	        };
	    };
	    return BlogPost;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {__webpack_require__(15);
	riot.tag('album-store', '<base-remote-json-collection name="albumscollection" baseurl="http://jsonplaceholder.typicode.com/albums"></base-remote-json-collection>', function(opts) {
			var self = this;

			self.on('album-store-init', function(){
				self.tags.albumscollection.trigger('init', {}, function(coll){
					window.app.dispatcher.trigger('album-store-changed', coll);
				});
			});

			//Register with the dispatcher.
			self.registerWithDispatcher = function(){

			   //Register
				window.app.dispatcher.addStore(self);
				self.dispatcher = window.app.dispatcher;

				//Remove possible eventlistener.
				document.removeEventListener('dispatcher-ready', self.registerWithDispatcher);
		   }

			this.on('mount', function(){
				self.coll = self.tags.albumscollection;

				//Check if dispatcher is ready.
				if (window.app.dispatcher) {

				  //If appDispatcher is ready then register
				  self.registerWithDispatcher();
				} else {

				  //AppDispatcher not ready yet, register event and wait for it to be ready.
				  document.addEventListener('dispatcher-ready', self.registerWithDispatcher);
				}
			});

			//Listen for a collection change on the remote collection.
			this.tags.albumscollection.on('collection-changed', function(e){
				window.app.dispatcher.trigger('album-store-changed', e.detail.collection);
			});
		
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {
	riot.tag('app-dispatcher', '', function(opts) {
	  'use strict';
	    var self = this;


	    self.on('mount', function(){

	      var RiotControl = {
	        _stores: [],
	        addStore: function(store) {
	          this._stores.push(store);
	        }
	      };

	      ['on','one','off','trigger'].forEach(function(api){
	        RiotControl[api] = function() {
	          var args = [].slice.call(arguments);
	          this._stores.forEach(function(el){
	            el[api].apply(null, args);
	          });
	        };
	      });

	      //If there is no app object.
	      if (!window.app){
	        window.app = {};
	      }

	      //Register the dispatcher with the app.
	      window.app.dispatcher = RiotControl;

	      //Emit event so everyone can start working.
	      var readyEvent = new Event('dispatcher-ready');
	      document.dispatchEvent(readyEvent);


	    });




	  
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {
	riot.tag('app-router', '', function(opts) {
			var self = this;
			self.switchPage = function(page){

					//Require the tag.
					__webpack_require__(21)("./" + page + '/' + page);

					//Mount and reference the tag.
					var currentTag = riot.mount(page);
					window.app.currentTag = currentTag[0];

					//Fade in the tag.
					window.app.currentTag.root.style.display='';
					setTimeout(function(){
						window.app.currentTag.root.style.opacity = '1';
					},1);

			}
			self.router =  function(collection){

				//If there is a tag animate out and unmount.
				if(window.app.currentTag){

					//Fade out current page
					window.app.currentTag.root.style.transition = 'all 200ms linear';
					window.app.currentTag.root.style.opacity = '0';

					//Wait as long as the above transition, then unmount.
					setTimeout(function(){
						window.app.currentTag.root.style.display='none';
						window.app.currentTag.unmount(true);
						self.switchPage(collection);
					},200);

				}else{

					//Initial load, display the page requested.
					self.switchPage(collection);
				}
			};


			self.on('mount', function(){

				//Add a function to handle the routes.
				riot.route(function(collection, id, action) {
					self.router(collection, id, action);
				});

				//Listen and reply if anyone is interested in my existance.
				document.addEventListener('hello-router', function(){
					var routerHello = new CustomEvent('router-hello', {detail:{router: self}});
					document.dispatchEvent(routerHello);
				});

			});
		
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./albums/albums": 22,
		"./albums/albums.css": 23,
		"./albums/albums.tag": 22,
		"./blogs/blogs": 31,
		"./blogs/blogs.css": 32,
		"./blogs/blogs.tag": 31,
		"./start/start": 37,
		"./start/start.css": 38,
		"./start/start.tag": 37
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 21;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {__webpack_require__(23);
	__webpack_require__(25);
	__webpack_require__(28);

	riot.tag('albums', '<h1>Albums</h1> <loading-spinner if="{!albums.length}"></loading-spinner> <album-listitem each="{album in albums}" album="{album}"></album-listitem>', function(opts) {
			var self = this;
			var active = opts.active;
			self.albums = [];

			self.updateView = function(coll){
				self.albums = coll;
				self.update();
			}

			self.registerEvents = function(){
				setTimeout(function(){
					window.app.dispatcher.on('album-store-changed',self.updateView);
					window.app.dispatcher.trigger('album-store-init',self.updateView);
				}, 1);
			};

			self.on('mount', function(){
				//Check if dispatcher is ready.
				if (window.app.dispatcher) {
				  //If appDispatcher is ready then register
				  self.registerEvents();
				} else {
				  //AppDispatcher not ready yet, register event and wait for it to be ready.
				  document.addEventListener('dispatcher-ready', self.registerEvents);
				}

				//self.store = self.tags.albums;
			});
		
	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(24);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(24, function() {
				var newContent = __webpack_require__(24);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	exports.push([module.id, "albums{\r\n\tdisplay:block;\r\n\tposition:absolute;\r\n\ttop:0;\r\n\tright:0;\r\n\tbottom:0;\r\n\tleft:0;\r\n\tmax-width:64rem;\r\n\tmargin:0 auto;\r\n\toverflow-x:hidden;\r\n\toverflow-y:auto;\r\n\tbackground:#dedede;\r\n\tbox-shadow:0px 0px 24px #ddd;\r\n}", ""]);

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {
	__webpack_require__(26);

	riot.tag('album-listitem', '<h3>{album.title} : {album.userId}</h3>', function(opts) {
		var self = this;
		album = opts.album;

			this.on('mount', function(){
			});
			this.on('unmount', function(){

			});

		
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(27);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(27, function() {
				var newContent = __webpack_require__(27);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	exports.push([module.id, "album-listitem {\r\n\tdisplay:block;\r\n\tposition:relative;\r\n}\r\n", ""]);

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {__webpack_require__(29);
	riot.tag('loading-spinner', '<div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div>', function(opts) {

	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(30);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(30, function() {
				var newContent = __webpack_require__(30);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	exports.push([module.id, "loading-spinner .spinner {\r\n  margin: 100px auto 0;\r\n  width: 70px;\r\n  text-align: center;\r\n}\r\n\r\nloading-spinner .spinner > div {\r\n  width: 18px;\r\n  height: 18px;\r\n  background-color: rgba(255,255,255,0.8);\r\n  border-radius: 100%;\r\n  display: inline-block;\r\n  -webkit-animation: bouncedelay 1.4s infinite ease-in-out;\r\n  animation: bouncedelay 1.4s infinite ease-in-out;\r\n  /* Prevent first frame from flickering when animation starts */\r\n  -webkit-animation-fill-mode: both;\r\n  animation-fill-mode: both;\r\n}\r\n\r\nloading-spinner .spinner .bounce1 {\r\n  -webkit-animation-delay: -0.32s;\r\n  animation-delay: -0.32s;\r\n}\r\n\r\nloading-spinner .spinner .bounce2 {\r\n  -webkit-animation-delay: -0.16s;\r\n  animation-delay: -0.16s;\r\n}\r\n\r\n@-webkit-keyframes bouncedelay {\r\n  0%, 80%, 100% { -webkit-transform: scale(0.0) }\r\n  40% { -webkit-transform: scale(1.0) }\r\n}\r\n\r\n@keyframes bouncedelay {\r\n  0%, 80%, 100% {\r\n    transform: scale(0.0);\r\n    -webkit-transform: scale(0.0);\r\n  } 40% {\r\n    transform: scale(1.0);\r\n    -webkit-transform: scale(1.0);\r\n  }\r\n}", ""]);

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {__webpack_require__(32);
	__webpack_require__(34);
	__webpack_require__(28);
	riot.tag('blogs', '<h1>Blog posts</h1> <loading-spinner if="{!blogs.length}"></loading-spinner> <blog-listitem each="{post in blogs}" post="{post}"></blog-listitem>', function(opts) {
			var self = this;
			self.blogs = [];

			self.updateView = function(coll){
				self.blogs = coll;
				self.update();
			}

			self.registerEvents = function(){
				setTimeout(function(){
					 	window.app.dispatcher.on('blog-store-changed',self.updateView);
						window.app.dispatcher.trigger('blog-store-init');
				}, 1);
			};

			self.on('mount', function(){
				//Check if dispatcher is ready.
				if (window.app.dispatcher) {
				  //If appDispatcher is ready then register
				  self.registerEvents();
				} else {
				  //AppDispatcher not ready yet, register event and wait for it to be ready.
				  document.addEventListener('dispatcher-ready', self.registerEvents);
				}
			});


		
	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(33);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(33, function() {
				var newContent = __webpack_require__(33);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	exports.push([module.id, "blogs{\r\n\tdisplay:block;\r\n\tposition:absolute;\r\n\ttop:0;\r\n\tright:0;\r\n\tbottom:0;\r\n\tleft:0;\r\n\tmax-width:64rem;\r\n\tmargin:0 auto;\r\n\toverflow-x:hidden;\r\n\toverflow-y:auto;\r\n\t\tbackground:#dedede;\r\n\tbox-shadow:0px 0px 24px #ddd;\r\n}", ""]);

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {
	__webpack_require__(35);

	riot.tag('blog-listitem', '<h4>{post.title}</h4> <p>{post.body}</p> <b onclick="{loadUser}" style="float:right;">[...]</b>', function(opts) {
		var self = this;
			post = opts.post;
			this.loadUser = function(e,detail){
				post.getUser(function(user){
					console.log(user);
				});
			}
			this.on('mount', function(){
			});
			this.on('unmount', function(){

			});

		
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(36);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(36, function() {
				var newContent = __webpack_require__(36);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	exports.push([module.id, "blog-listitem {\r\n\tdisplay:inline-block;\r\n\tposition:relative;\r\n\tmax-width:18rem;\r\n\tmargin:1rem auto;\r\n}\r\n", ""]);

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {__webpack_require__(38);

	riot.tag('start', '<div>start page</div> <btn onpush="{switchpage}" route="blogs">Blogs</btn> <btn onpush="{switchpage}" route="albums">Albums</btn>', function(opts) {
			var self = this;
			self.switchpage = function(e){
				var routeTarget = e.target.parentNode.getAttribute('route');
				riot.route(routeTarget);
			}
			self.on('mount', function(){

			});

		
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(39);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(39, function() {
				var newContent = __webpack_require__(39);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	exports.push([module.id, "basic-page {\r\n\tdisplay:block;\r\n\tposition:absolute;\r\n\ttop:0;\r\n\tright:0;\r\n\tbottom:0;\r\n\tleft:0;\r\n}", ""]);

/***/ }
/******/ ]);