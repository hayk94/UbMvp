// NOTE: This file must be loaded in the hubspot and when building the server in meteor comment the whole code

// HERE BEGINS THE STANDALONE LIBRARY, this can be put in another file
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.DDP = factory();
  }
}(this, function() {

  "use strict";

  var uniqueId = (function() {
    var i = 0;
    return function() {
      return (i++).toString();
    };
  })();

  var INIT_DDP_MESSAGE = "{\"server_id\":\"0\"}";
  // After hitting the plateau, it'll try to reconnect
  // every 16.5 seconds
  var RECONNECT_ATTEMPTS_BEFORE_PLATEAU = 10;
  var TIMER_INCREMENT = 300;
  var DEFAULT_PING_INTERVAL = 10000;
  var DDP_SERVER_MESSAGES = [
    "added", "changed", "connected", "error", "failed",
    "nosub", "ready", "removed", "result", "updated",
    "ping", "pong"
  ];
  var DDP_VERSION = "1";

  var DDP = function(options) {
    // Configuration
    this._endpoint = options.endpoint;
    this._SocketConstructor = options.SocketConstructor;
    this._autoreconnect = !options.do_not_autoreconnect;
    this._ping_interval = options._ping_interval || DEFAULT_PING_INTERVAL;
    this._socketInterceptFunction = options.socketInterceptFunction;
    // Subscriptions callbacks
    this._onReadyCallbacks = {};
    this._onStopCallbacks = {};
    this._onErrorCallbacks = {};
    // Methods callbacks
    this._onResultCallbacks = {};
    this._onUpdatedCallbacks = {};
    this._events = {};
    this._queue = [];
    // Setup
    this.readyState = -1;
    this._reconnect_count = 0;
    this._reconnect_incremental_timer = 0;
    // Init
    if (!options.do_not_autoconnect) {
      this.connect();
    }
  };
  DDP.prototype.constructor = DDP;

  DDP.prototype.connect = function() {
    this.readyState = 0;
    this._socket = new this._SocketConstructor(this._endpoint);
    this._socket.onopen = this._on_socket_open.bind(this);
    this._socket.onmessage = this._on_socket_message.bind(this);
    this._socket.onerror = this._on_socket_error.bind(this);
    this._socket.onclose = this._on_socket_close.bind(this);
  };

  DDP.prototype.method = function(name, params, onResult, onUpdated) {
    var id = uniqueId();
    this._onResultCallbacks[id] = onResult;
    this._onUpdatedCallbacks[id] = onUpdated;
    this._send({
      msg: "method",
      id: id,
      method: name,
      params: params
    });
    return id;
  };

  DDP.prototype.sub = function(name, params, onReady, onStop, onError) {
    var id = uniqueId();
    this._onReadyCallbacks[id] = onReady;
    this._onStopCallbacks[id] = onStop;
    this._onErrorCallbacks[id] = onError;
    this._send({
      msg: "sub",
      id: id,
      name: name,
      params: params
    });
    return id;
  };

  DDP.prototype.unsub = function(id) {
    this._send({
      msg: "unsub",
      id: id
    });
    return id;
  };

  DDP.prototype.on = function(name, handler) {
    this._events[name] = this._events[name] || [];
    this._events[name].push(handler);
  };

  DDP.prototype.off = function(name, handler) {
    if (!this._events[name]) {
      return;
    }
    var index = this._events[name].indexOf(handler);
    if (index !== -1) {
      this._events[name].splice(index, 1);
    }
  };

  DDP.prototype._emit = function(name /* , arguments */ ) {
    if (!this._events[name]) {
      return;
    }
    var args = arguments;
    var self = this;
    this._events[name].forEach(function(handler) {
      handler.apply(self, Array.prototype.slice.call(args, 1));
    });
  };

  DDP.prototype._send = function(object) {
    if (this.readyState !== 1 && object.msg !== "connect") {
      this._queue.push(object);
      return;
    }
    var message;
    if (typeof EJSON === "undefined") {
      message = JSON.stringify(object);
    } else {
      message = EJSON.stringify(object);
    }
    if (this._socketInterceptFunction) {
      this._socketInterceptFunction({
        type: "socket_message_sent",
        message: message,
        timestamp: Date.now()
      });
    }
    this._socket.send(message);
  };

  DDP.prototype._try_reconnect = function() {
    if (this._reconnect_count < RECONNECT_ATTEMPTS_BEFORE_PLATEAU) {
      setTimeout(this.connect.bind(this), this._reconnect_incremental_timer);
      this._reconnect_count += 1;
      this._reconnect_incremental_timer += TIMER_INCREMENT * this._reconnect_count;
    } else {
      setTimeout(this.connect.bind(this), this._reconnect_incremental_timer);
    }
  };

  DDP.prototype._on_result = function(data) {
    if (this._onResultCallbacks[data.id]) {
      this._onResultCallbacks[data.id](data.error, data.result);
      delete this._onResultCallbacks[data.id];
      if (data.error) {
        delete this._onUpdatedCallbacks[data.id];
      }
    } else {
      if (data.error) {
        delete this._onUpdatedCallbacks[data.id];
        throw data.error;
      }
    }
  };
  DDP.prototype._on_updated = function(data) {
    var self = this;
    data.methods.forEach(function(id) {
      if (self._onUpdatedCallbacks[id]) {
        self._onUpdatedCallbacks[id]();
        delete self._onUpdatedCallbacks[id];
      }
    });
  };
  DDP.prototype._on_nosub = function(data) {
    if (data.error) {
      if (!this._onErrorCallbacks[data.id]) {
        delete this._onReadyCallbacks[data.id];
        delete this._onStopCallbacks[data.id];
        throw new Error(data.error);
      }
      this._onErrorCallbacks[data.id](data.error);
      delete this._onReadyCallbacks[data.id];
      delete this._onStopCallbacks[data.id];
      delete this._onErrorCallbacks[data.id];
      return;
    }
    if (this._onStopCallbacks[data.id]) {
      this._onStopCallbacks[data.id]();
    }
    delete this._onReadyCallbacks[data.id];
    delete this._onStopCallbacks[data.id];
    delete this._onErrorCallbacks[data.id];
  };
  DDP.prototype._on_ready = function(data) {
    var self = this;
    data.subs.forEach(function(id) {
      if (self._onReadyCallbacks[id]) {
        self._onReadyCallbacks[id]();
        delete self._onReadyCallbacks[id];
      }
    });
  };

  DDP.prototype._on_error = function(data) {
    this._emit("error", data);
  };
  DDP.prototype._on_connected = function(data) {
    var self = this;
    var firstCon = self._reconnect_count === 0;
    var eventName = firstCon ? "connected" : "reconnected";
    self.readyState = 1;
    self._reconnect_count = 0;
    self._reconnect_incremental_timer = 0;
    self.sessionId = data.session;
    var length = self._queue.length;
    for (var i = 0; i < length; i++) {
      self._send(self._queue.shift());
    }
    self._emit(eventName, data);
    // Set up keepalive ping-s
    self._ping_interval_handle = setInterval(function() {
      var id = uniqueId();
      self._send({
        msg: "ping",
        id: id
      });
    }, self._ping_interval);
  };
  DDP.prototype._on_failed = function(data) {
    this.readyState = 4;
    this._emit("failed", data);
  };
  DDP.prototype._on_added = function(data) {
    this._emit("added", data);
  };
  DDP.prototype._on_removed = function(data) {
    this._emit("removed", data);
  };
  DDP.prototype._on_changed = function(data) {
    this._emit("changed", data);
  };
  DDP.prototype._on_ping = function(data) {
    this._send({
      msg: "pong",
      id: data.id
    });
  };
  DDP.prototype._on_pong = function(data) {
    // For now, do nothing.
    // In the future we might want to log latency or so.
  };

  DDP.prototype._on_socket_close = function() {
    if (this._socketInterceptFunction) {
      this._socketInterceptFunction({
        type: "socket_close",
        timestamp: Date.now()
      });
    }
    clearInterval(this._ping_interval_handle);
    this.readyState = 4;
    this._emit("socket_close");
    if (this._autoreconnect) {
      this._try_reconnect();
    }
  };
  DDP.prototype._on_socket_error = function(e) {
    if (this._socketInterceptFunction) {
      this._socketInterceptFunction({
        type: "socket_error",
        error: JSON.stringify(e),
        timestamp: Date.now()
      });
    }
    clearInterval(this._ping_interval_handle);
    this.readyState = 4;
    this._emit("socket_error", e);
  };
  DDP.prototype._on_socket_open = function() {
    if (this._socketInterceptFunction) {
      this._socketInterceptFunction({
        type: "socket_open",
        timestamp: Date.now()
      });
    }
    this._send({
      msg: "connect",
      version: DDP_VERSION,
      support: [DDP_VERSION]
    });
  };
  DDP.prototype._on_socket_message = function(message) {
    if (this._socketInterceptFunction) {
      this._socketInterceptFunction({
        type: "socket_message_received",
        message: message.data,
        timestamp: Date.now()
      });
    }
    var data;
    if (message.data === INIT_DDP_MESSAGE) {
      return;
    }
    try {
      if (typeof EJSON === "undefined") {
        data = JSON.parse(message.data);
      } else {
        data = EJSON.parse(message.data);
      }
      if (DDP_SERVER_MESSAGES.indexOf(data.msg) === -1) {
        throw new Error();
      }
    } catch (e) {
      console.warn("Non DDP message received:");
      console.warn(message.data);
      return;
    }
    this["_on_" + data.msg](data);
  };

  return DDP;

}));

// HERE ENDS THE STANDALONE LIBRARY, this can be put in another file



var options = {
  endpoint: "wss://ubmvp-92911.onmodulus.net/websocket", // NOTE: it is ws not http or wss not https Need to resear more about the websockets
  SocketConstructor: WebSocket
};
var ddp = new DDP(options);

ddp.on("connected", function() {
  console.log("Connected");
});

jQuery(document).ready(function($) {
  // Stuff to do as soon as the DOM is ready. Use $() w/o colliding with other libs
  var clientIp = undefined; //headers.getClientIP(); // no need for this anymore get this from the server

  var clientConnId = ddp.sessionId; //Meteor.connection._lastSessionId;

  var visitedOne = (window.location.href).toString();
  console.log("visitedOne", visitedOne);
  $(document).on('click', '*', function(event) {
    console.log(ddp);

    event.stopPropagation();
    console.log("all click!");
    //  console.log($(this));
    console.log($(event.target).text());
    var clickedOne = $(event.target).text();



    //  updateDB
    ddp.method("updateDB", [{
      clientIp, clientConnId, clickedOne
    }], function(err, res) {
      if (err) throw err;
      console.log("Success on my part click!");
    });
  }); //onClick


  // GETTING THE HUBSPOT USER TOKEN aka UTK
  var hs_tries = 0,
    readCookie = function(key) {
      return (document.cookie.match('(^|; )' + key + '=([^;]*)') || 0)[2] ||
        null;
    }

  window.utk = readCookie("hubspotutk");

  // Poll for cookie value
  // Maximum of 5 seconds (50*100 == 5000ms)
  function get_utk() {
    if (!utk && hs_tries < 100) {
      hs_tries++;
      console.log("Polling for HS cookie try: " + hs_tries);
      setTimeout(function() {
        get_utk();
      }, 50);
    } else {
      // hs_get(utk);
      console.log(window.utk);
      UTK = window.utk;
      console.log("UTK", UTK);

    }
  }

  function get_connId() {
    if (!ddp.sessionId && hs_tries < 100) {
      hs_tries++;
      console.log("Polling for ddp sessionId: " + hs_tries);
      setTimeout(function() {
        get_connId();
      }, 50);
    } else {
      clientConnId = ddp.sessionId;
      console.log("ddp.sessionId = ", ddp.sessionId);
      console.log("clientConnId = ", clientConnId);



    }
  }
  get_utk();
  get_connId();


  console.log("ddp.sessionId = ", ddp.sessionId);

  //Let's call the methods after making sure everything is there
  function callInitialMethods() {
    console.log("EVERYTHIN WE NEED IS clientConnId ", clientConnId,
      " AND utk ", UTK);
    if (clientConnId) {
      //  getHubspotInfo
      ddp.method("getHubspotInfo", [{
        clientIp, clientConnId, UTK
      }], function(err, res) {
        if (err) throw err;
        console.log("Success on my part getHubspotInfo");
      });

      //  updateHistory
      ddp.method("updateHistory", [{
        clientIp, clientConnId, visitedOne
      }], function(err, res) {
        if (err) throw err;
        console.log("UPDATE HISTORY clientIp", clientIp, "clientConnId",
          clientConnId, "visitedOne", visitedOne);
        console.log("Success on my part history");
      });
    } else {
      setTimeout(function() {
        callInitialMethods();
      }, 50);
    }
  } //callInitialMethods

  callInitialMethods();

}); //documentReady

// var myLoginParams = { ... };
//   ddp.method("login", [myLoginParams], function (err, res) {
//       if (err) throw err;
//       console.log("Logged in!");
//   });

//////////////////////// EXAMPLE HUBSPOT API URL ////////////////////////
// random contact id 3036763
//url: 'https://api.hubapi.com/contacts/v1/lists/recently_updated/contacts/recent?hapikey=bdc95f4b-0d9f-4db5-a8ff-9ecb2d235063'
//get by utk url: https://api.hubapi.com/contacts/v1/contact/utk/37782b7ceb743281d6d2872e9ebfd3be/profile?hapikey=bdc95f4b-0d9f-4db5-a8ff-9ecb2d235063
//////////////////////// EXAMPLE HUBSPOT API URL ////////////////////////
