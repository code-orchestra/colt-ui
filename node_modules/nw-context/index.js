var __window = null,
    __document = null;

exports.set = function(opts) {
  opts = opts || {};

  if ('window' in opts)   __window = opts.window;
  if ('document' in opts) __document = opts.document;
}

Object.defineProperty(exports, 'window', {
  get: function() { return __window; }
});

Object.defineProperty(exports, 'document', {
  get: function() { return __document; }
});
