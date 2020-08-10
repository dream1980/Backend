(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (Buffer){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this,require("buffer").Buffer)
},{"base64-js":1,"buffer":3,"ieee754":4}],4:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],6:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],7:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":5,"./encode":6}],8:[function(require,module,exports){
var FortanixSdkmsRestApi = require('./src/index.js');
var btoa = require('btoa');

var defaultClient = FortanixSdkmsRestApi.ApiClient.instance;
defaultClient.basePath="https://sdkms.fortanix.com"
var basicAuth = defaultClient.authentications['basicAuth'];
basicAuth.username = "" // AppID
basicAuth.password = "" // App Secret


var encryptionCallback = function(error, data, response) {
  if (error) {
    console.error("Error: " + JSON.stringify(response));
  } else {
    console.log('Data encrypted successfuly. result: ' + JSON.stringify(data));
  }
};

var createKeyCallback = function(error, data, response) {
  if (error) {
    console.error("Error: " + JSON.stringify(response));
  } else {
    console.log('Key created successfuly. KeyId: ' + data["kid"]);
    var encryptApi = new FortanixSdkmsRestApi.EncryptionAndDecryptionApi()
    var plaindata = btoa("Plain Data")
    var encryptRequest = FortanixSdkmsRestApi.EncryptRequest.constructFromObject({"alg" :"AES", "plain": plaindata, "mode": "CBC"})
    encryptApi.encrypt(data["kid"], encryptRequest, encryptionCallback)
  }
};

var authCallback = function(error, data, response) {
  if (error) {
    console.error("Error: " + JSON.stringify(response));
  } else {
    console.log('Auth successful. result: ' + JSON.stringify(data));
    var bearerAuth = defaultClient.authentications['bearerToken'];
    bearerAuth.apiKeyPrefix = "Bearer"
	bearerAuth.apiKey = data["access_token"]
	var soApi = new FortanixSdkmsRestApi.SecurityObjectsApi()
	var soRequest = FortanixSdkmsRestApi.SobjectRequest.constructFromObject({"name": "test-aes-key", "key_size": 128, "obj_type": "AES"})
	soApi.generateSecurityObject(soRequest, createKeyCallback);
  }
};

var authApi = new FortanixSdkmsRestApi.AuthenticationApi()
authApi.authorize(authCallback);

},{"./src/index.js":33,"btoa":9}],9:[function(require,module,exports){
(function (Buffer){
(function () {
  "use strict";

  function btoa(str) {
    var buffer;

    if (str instanceof Buffer) {
      buffer = str;
    } else {
      buffer = Buffer.from(str.toString(), 'binary');
    }

    return buffer.toString('base64');
  }

  module.exports = btoa;
}());

}).call(this,require("buffer").Buffer)
},{"buffer":3}],10:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],11:[function(require,module,exports){
/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = require('component-emitter');
var RequestBase = require('./request-base');
var isObject = require('./is-object');
var isFunction = require('./is-function');
var ResponseBase = require('./response-base');
var shouldRetry = require('./should-retry');

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only verison of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
      status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if(this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (typeof pass === 'object' && pass !== null) { // pass is optional and can substitute for options
    options = pass;
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    }
  }

  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
      
    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
    break;  
  }
  return this;
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  // console.log(this._retries, this._maxRetries)
  if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */

Request.prototype._appendQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if (isFunction(this._sort)) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._appendQueryString();

  return this._end();
};

Request.prototype._end = function() {
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  }
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;

    if (this.header.hasOwnProperty(field))
      xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn){
  var req = request('DELETE', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"./is-function":12,"./is-object":13,"./request-base":14,"./response-base":15,"./should-retry":16,"component-emitter":10}],12:[function(require,module,exports){
/**
 * Check if `fn` is a function.
 *
 * @param {Function} fn
 * @return {Boolean}
 * @api private
 */
var isObject = require('./is-object');

function isFunction(fn) {
  var tag = isObject(fn) ? Object.prototype.toString.call(fn) : '';
  return tag === '[object Function]';
}

module.exports = isFunction;

},{"./is-object":13}],13:[function(require,module,exports){
/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;

},{}],14:[function(require,module,exports){
/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = require('./is-object');

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, read, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for(var option in options) {
    switch(option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count){
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  return this;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function() {
  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

RequestBase.prototype.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
}

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(on){
  // This is browser-only functionality. Node side is no-op.
  if(on==undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};


/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};


/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout, errno){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
}

},{"./is-object":13}],15:[function(require,module,exports){

/**
 * Module dependencies.
 */

var utils = require('./utils');

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field){
    return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
};

},{"./utils":17}],16:[function(require,module,exports){
var ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'EADDRINFO',
  'ESOCKETTIMEDOUT'
];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
module.exports = function shouldRetry(err, res) {
  if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
  if (res && res.status && res.status >= 500) return true;
  // Superagent timeout
  if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
  if (err && 'crossDomain' in err) return true;
  return false;
};

},{}],17:[function(require,module,exports){

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, shouldStripCookie){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  if (shouldStripCookie) {
    delete header['cookie'];
  }
  return header;
};
},{}],18:[function(require,module,exports){
(function (Buffer){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['superagent', 'querystring'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('superagent'), require('querystring'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ApiClient = factory(root.superagent, root.querystring);
  }
}(this, function(superagent, querystring) {
  'use strict';

  /**
   * @module ApiClient
   * @version 1.0.0-20181004
   */

  /**
   * Manages low level client-server communications, parameter marshalling, etc. There should not be any need for an
   * application to use this class directly - the *Api and model classes provide the public API for the service. The
   * contents of this file should be regarded as internal but are documented for completeness.
   * @alias module:ApiClient
   * @class
   */
  var exports = function() {
    /**
     * The base URL against which to resolve every API call's (relative) path.
     * @type {String}
     * @default https://apps.smartkey.io
     */
    this.basePath = 'https://apps.smartkey.io'.replace(/\/+$/, '');

    /**
     * The authentication methods to be included for all API calls.
     * @type {Array.<String>}
     */
    this.authentications = {
      'basicAuth': {type: 'basic'},
      'bearerToken': {type: 'apiKey', 'in': 'header', name: 'Authorization'}
    };
    /**
     * The default HTTP headers to be included for all API calls.
     * @type {Array.<String>}
     * @default {}
     */
    this.defaultHeaders = {};

    /**
     * The default HTTP timeout for all API calls.
     * @type {Number}
     * @default 60000
     */
    this.timeout = 60000;

    /**
     * If set to false an additional timestamp parameter is added to all API GET calls to
     * prevent browser caching
     * @type {Boolean}
     * @default true
     */
    this.cache = true;

    /**
     * If set to true, the client will save the cookies from each server
     * response, and return them in the next request.
     * @default false
     */
    this.enableCookies = false;

    /*
     * Used to save and return cookies in a node.js (non-browser) setting,
     * if this.enableCookies is set to true.
     */
    if (typeof window === 'undefined') {
      this.agent = new superagent.agent();
    }

    /*
     * Allow user to override superagent agent
     */
    this.requestAgent = null;
  };

  /**
   * Returns a string representation for an actual parameter.
   * @param param The actual parameter.
   * @returns {String} The string representation of <code>param</code>.
   */
  exports.prototype.paramToString = function(param) {
    if (param == undefined || param == null) {
      return '';
    }
    if (param instanceof Date) {
      return param.toJSON();
    }
    return param.toString();
  };

  /**
   * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
   * NOTE: query parameters are not handled here.
   * @param {String} path The path to append to the base URL.
   * @param {Object} pathParams The parameter values to append.
   * @returns {String} The encoded path with parameter values substituted.
   */
  exports.prototype.buildUrl = function(path, pathParams) {
    if (!path.match(/^\//)) {
      path = '/' + path;
    }
    var url = this.basePath + path;
    var _this = this;
    url = url.replace(/\{([\w-]+)\}/g, function(fullMatch, key) {
      var value;
      if (pathParams.hasOwnProperty(key)) {
        value = _this.paramToString(pathParams[key]);
      } else {
        value = fullMatch;
      }
      return encodeURIComponent(value);
    });
    return url;
  };

  /**
   * Checks whether the given content type represents JSON.<br>
   * JSON content type examples:<br>
   * <ul>
   * <li>application/json</li>
   * <li>application/json; charset=UTF8</li>
   * <li>APPLICATION/JSON</li>
   * </ul>
   * @param {String} contentType The MIME content type to check.
   * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
   */
  exports.prototype.isJsonMime = function(contentType) {
    return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i));
  };

  /**
   * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
   * @param {Array.<String>} contentTypes
   * @returns {String} The chosen content type, preferring JSON.
   */
  exports.prototype.jsonPreferredMime = function(contentTypes) {
    for (var i = 0; i < contentTypes.length; i++) {
      if (this.isJsonMime(contentTypes[i])) {
        return contentTypes[i];
      }
    }
    return contentTypes[0];
  };

  /**
   * Checks whether the given parameter value represents file-like content.
   * @param param The parameter to check.
   * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
   */
  exports.prototype.isFileParam = function(param) {
    // fs.ReadStream in Node.js and Electron (but not in runtime like browserify)
    if (typeof require === 'function') {
      var fs;
      try {
        fs = require('fs');
      } catch (err) {}
      if (fs && fs.ReadStream && param instanceof fs.ReadStream) {
        return true;
      }
    }
    // Buffer in Node.js
    if (typeof Buffer === 'function' && param instanceof Buffer) {
      return true;
    }
    // Blob in browser
    if (typeof Blob === 'function' && param instanceof Blob) {
      return true;
    }
    // File in browser (it seems File object is also instance of Blob, but keep this for safe)
    if (typeof File === 'function' && param instanceof File) {
      return true;
    }
    return false;
  };

  /**
   * Normalizes parameter values:
   * <ul>
   * <li>remove nils</li>
   * <li>keep files and arrays</li>
   * <li>format to string with `paramToString` for other cases</li>
   * </ul>
   * @param {Object.<String, Object>} params The parameters as object properties.
   * @returns {Object.<String, Object>} normalized parameters.
   */
  exports.prototype.normalizeParams = function(params) {
    var newParams = {};
    for (var key in params) {
      if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
        var value = params[key];
        if (this.isFileParam(value) || Array.isArray(value)) {
          newParams[key] = value;
        } else {
          newParams[key] = this.paramToString(value);
        }
      }
    }
    return newParams;
  };

  /**
   * Enumeration of collection format separator strategies.
   * @enum {String}
   * @readonly
   */
  exports.CollectionFormatEnum = {
    /**
     * Comma-separated values. Value: <code>csv</code>
     * @const
     */
    CSV: ',',
    /**
     * Space-separated values. Value: <code>ssv</code>
     * @const
     */
    SSV: ' ',
    /**
     * Tab-separated values. Value: <code>tsv</code>
     * @const
     */
    TSV: '\t',
    /**
     * Pipe(|)-separated values. Value: <code>pipes</code>
     * @const
     */
    PIPES: '|',
    /**
     * Native array. Value: <code>multi</code>
     * @const
     */
    MULTI: 'multi'
  };

  /**
   * Builds a string representation of an array-type actual parameter, according to the given collection format.
   * @param {Array} param An array parameter.
   * @param {module:ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
   * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
   * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
   */
  exports.prototype.buildCollectionParam = function buildCollectionParam(param, collectionFormat) {
    if (param == null) {
      return null;
    }
    switch (collectionFormat) {
      case 'csv':
        return param.map(this.paramToString).join(',');
      case 'ssv':
        return param.map(this.paramToString).join(' ');
      case 'tsv':
        return param.map(this.paramToString).join('\t');
      case 'pipes':
        return param.map(this.paramToString).join('|');
      case 'multi':
        // return the array directly as SuperAgent will handle it as expected
        return param.map(this.paramToString);
      default:
        throw new Error('Unknown collection format: ' + collectionFormat);
    }
  };

  /**
   * Applies authentication headers to the request.
   * @param {Object} request The request object created by a <code>superagent()</code> call.
   * @param {Array.<String>} authNames An array of authentication method names.
   */
  exports.prototype.applyAuthToRequest = function(request, authNames) {
    var _this = this;
    authNames.forEach(function(authName) {
      var auth = _this.authentications[authName];
      switch (auth.type) {
        case 'basic':
          if (auth.username || auth.password) {
            request.auth(auth.username || '', auth.password || '');
          }
          break;
        case 'apiKey':
          if (auth.apiKey) {
            var data = {};
            if (auth.apiKeyPrefix) {
              data[auth.name] = auth.apiKeyPrefix + ' ' + auth.apiKey;
            } else {
              data[auth.name] = auth.apiKey;
            }
            if (auth['in'] === 'header') {
              request.set(data);
            } else {
              request.query(data);
            }
          }
          break;
        case 'oauth2':
          if (auth.accessToken) {
            request.set({'Authorization': 'Bearer ' + auth.accessToken});
          }
          break;
        default:
          throw new Error('Unknown authentication type: ' + auth.type);
      }
    });
  };

  /**
   * Deserializes an HTTP response body into a value of the specified type.
   * @param {Object} response A SuperAgent response object.
   * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
   * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
   * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
   * all properties on <code>data<code> will be converted to this type.
   * @returns A value of the specified type.
   */
  exports.prototype.deserialize = function deserialize(response, returnType) {
    if (response == null || returnType == null || response.status == 204) {
      return null;
    }
    // Rely on SuperAgent for parsing response body.
    // See http://visionmedia.github.io/superagent/#parsing-response-bodies
    var data = response.body;
    if (data == null || (typeof data === 'object' && typeof data.length === 'undefined' && !Object.keys(data).length)) {
      // SuperAgent does not always produce a body; use the unparsed response as a fallback
      data = response.text;
    }
    return exports.convertToType(data, returnType);
  };

  /**
   * Callback function to receive the result of the operation.
   * @callback module:ApiClient~callApiCallback
   * @param {String} error Error message, if any.
   * @param data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Invokes the REST service using the supplied settings and parameters.
   * @param {String} path The base URL to invoke.
   * @param {String} httpMethod The HTTP method to use.
   * @param {Object.<String, String>} pathParams A map of path parameters and their values.
   * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
   * @param {Object.<String, Object>} collectionQueryParams A map of collection query parameters and their values.
   * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
   * @param {Object.<String, Object>} formParams A map of form parameters and their values.
   * @param {Object} bodyParam The value to pass as the request body.
   * @param {Array.<String>} authNames An array of authentication type names.
   * @param {Array.<String>} contentTypes An array of request MIME types.
   * @param {Array.<String>} accepts An array of acceptable response MIME types.
   * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
   * constructor for a complex type.
   * @param {module:ApiClient~callApiCallback} callback The callback function.
   * @returns {Object} The SuperAgent request object.
   */
  exports.prototype.callApi = function callApi(path, httpMethod, pathParams,
      queryParams, collectionQueryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts,
      returnType, callback) {

    var _this = this;
    var url = this.buildUrl(path, pathParams);
    var request = superagent(httpMethod, url);

    // apply authentications
    this.applyAuthToRequest(request, authNames);

    // set collection query parameters
    for (var key in collectionQueryParams) {
      if (collectionQueryParams.hasOwnProperty(key)) {
        var param = collectionQueryParams[key];
        if (param.collectionFormat === 'csv') {
          // SuperAgent normally percent-encodes all reserved characters in a query parameter. However,
          // commas are used as delimiters for the 'csv' collectionFormat so they must not be encoded. We
          // must therefore construct and encode 'csv' collection query parameters manually.
          if (param.value != null) {
            var value = param.value.map(this.paramToString).map(encodeURIComponent).join(',');
            request.query(encodeURIComponent(key) + "=" + value);
          }
        } else {
          // All other collection query parameters should be treated as ordinary query parameters.
          queryParams[key] = this.buildCollectionParam(param.value, param.collectionFormat);
        }
      }
    }

    // set query parameters
    if (httpMethod.toUpperCase() === 'GET' && this.cache === false) {
        queryParams['_'] = new Date().getTime();
    }
    request.query(this.normalizeParams(queryParams));

    // set header parameters
    request.set(this.defaultHeaders).set(this.normalizeParams(headerParams));


    // set requestAgent if it is set by user
    if (this.requestAgent) {
      request.agent(this.requestAgent);
    }

    // set request timeout
    request.timeout(this.timeout);

    var contentType = this.jsonPreferredMime(contentTypes);
    if (contentType) {
      // Issue with superagent and multipart/form-data (https://github.com/visionmedia/superagent/issues/746)
      if(contentType != 'multipart/form-data') {
        request.type(contentType);
      }
    } else if (!request.header['Content-Type']) {
      request.type('application/json');
    }

    if (contentType === 'application/x-www-form-urlencoded') {
      request.send(querystring.stringify(this.normalizeParams(formParams)));
    } else if (contentType == 'multipart/form-data') {
      var _formParams = this.normalizeParams(formParams);
      for (var key in _formParams) {
        if (_formParams.hasOwnProperty(key)) {
          if (this.isFileParam(_formParams[key])) {
            // file field
            request.attach(key, _formParams[key]);
          } else {
            request.field(key, _formParams[key]);
          }
        }
      }
    } else if (bodyParam) {
      request.send(bodyParam);
    }

    var accept = this.jsonPreferredMime(accepts);
    if (accept) {
      request.accept(accept);
    }

    if (returnType === 'Blob') {
      request.responseType('blob');
    } else if (returnType === 'String') {
      request.responseType('string');
    }

    // Attach previously saved cookies, if enabled
    if (this.enableCookies){
      if (typeof window === 'undefined') {
        this.agent.attachCookies(request);
      }
      else {
        request.withCredentials();
      }
    }


    request.end(function(error, response) {
      if (callback) {
        var data = null;
        if (!error) {
          try {
            data = _this.deserialize(response, returnType);
            if (_this.enableCookies && typeof window === 'undefined'){
              _this.agent.saveCookies(response);
            }
          } catch (err) {
            error = err;
          }
        }
        callback(error, data, response);
      }
    });

    return request;
  };

  /**
   * Parses an ISO-8601 string representation of a date value.
   * @param {String} str The date value as a string.
   * @returns {Date} The parsed date object.
   */
  exports.parseDate = function(str) {
    return new Date(str.replace(/T/i, ' '));
  };

  /**
   * Converts a value to the specified type.
   * @param {(String|Object)} data The data to convert, as a string or object.
   * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
   * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
   * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
   * all properties on <code>data<code> will be converted to this type.
   * @returns An instance of the specified type or null or undefined if data is null or undefined.
   */
  exports.convertToType = function(data, type) {
    if (data === null || data === undefined)
      return data

    switch (type) {
      case 'Boolean':
        return Boolean(data);
      case 'Integer':
        return parseInt(data, 10);
      case 'Number':
        return parseFloat(data);
      case 'String':
        return String(data);
      case 'Date':
        return this.parseDate(String(data));
      case 'Blob':
      	return data;
      default:
        if (type === Object) {
          // generic object, return directly
          return data;
        } else if (typeof type === 'function') {
          // for model type like: User
          return type.constructFromObject(data);
        } else if (Array.isArray(type)) {
          // for array type like: ['String']
          var itemType = type[0];
          return data.map(function(item) {
            return exports.convertToType(item, itemType);
          });
        } else if (typeof type === 'object') {
          // for plain object type like: {'String': 'Integer'}
          var keyType, valueType;
          for (var k in type) {
            if (type.hasOwnProperty(k)) {
              keyType = k;
              valueType = type[k];
              break;
            }
          }
          var result = {};
          for (var k in data) {
            if (data.hasOwnProperty(k)) {
              var key = exports.convertToType(k, keyType);
              var value = exports.convertToType(data[k], valueType);
              result[key] = value;
            }
          }
          return result;
        } else {
          // for unknown type, return the data directly
          return data;
        }
    }
  };

  /**
   * Constructs a new map or array model from REST data.
   * @param data {Object|Array} The REST data.
   * @param obj {Object|Array} The target object or array.
   */
  exports.constructFromObject = function(data, obj, itemType) {
    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        if (data.hasOwnProperty(i))
          obj[i] = exports.convertToType(data[i], itemType);
      }
    } else {
      for (var k in data) {
        if (data.hasOwnProperty(k))
          obj[k] = exports.convertToType(data[k], itemType);
      }
    }
  };

  /**
   * The default API client implementation.
   * @type {module:ApiClient}
   */
  exports.instance = new exports();

  return exports;
}));

}).call(this,require("buffer").Buffer)
},{"buffer":3,"fs":2,"querystring":7,"superagent":11}],19:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Account', 'model/AccountRequest', 'model/Error'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Account'), require('../model/AccountRequest'), require('../model/Error'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AccountsApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.Account, root.FortanixSdkmsRestApi.AccountRequest, root.FortanixSdkmsRestApi.Error);
  }
}(this, function(ApiClient, Account, AccountRequest, Error) {
  'use strict';

  /**
   * Accounts service.
   * @module api/AccountsApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new AccountsApi. 
   * @alias module:api/AccountsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the createAccount operation.
     * @callback module:api/AccountsApi~createAccountCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Account} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a new account
     * Create a new account with the specified properties.
     * @param {module:model/AccountRequest} body Properties to assign to Account.
     * @param {module:api/AccountsApi~createAccountCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Account}
     */
    this.createAccount = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling createAccount");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Account;

      return this.apiClient.callApi(
        '/sys/v1/accounts', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteAccount operation.
     * @callback module:api/AccountsApi~deleteAccountCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete account
     * Remove an account from SDKMS.
     * @param {String} accountId Account Identifier
     * @param {module:api/AccountsApi~deleteAccountCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteAccount = function(accountId, callback) {
      var postBody = null;

      // verify the required parameter 'accountId' is set
      if (accountId === undefined || accountId === null) {
        throw new Error("Missing the required parameter 'accountId' when calling deleteAccount");
      }


      var pathParams = {
        'account-id': accountId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/accounts/{account-id}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getAccount operation.
     * @callback module:api/AccountsApi~getAccountCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Account} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a specific account
     * Look up an account by account ID.
     * @param {String} accountId Account Identifier
     * @param {module:api/AccountsApi~getAccountCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Account}
     */
    this.getAccount = function(accountId, callback) {
      var postBody = null;

      // verify the required parameter 'accountId' is set
      if (accountId === undefined || accountId === null) {
        throw new Error("Missing the required parameter 'accountId' when calling getAccount");
      }


      var pathParams = {
        'account-id': accountId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Account;

      return this.apiClient.callApi(
        '/sys/v1/accounts/{account-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getAccounts operation.
     * @callback module:api/AccountsApi~getAccountsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Account>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all accounts
     * Get detailed information on all accounts the current user has access to.
     * @param {module:api/AccountsApi~getAccountsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Account>}
     */
    this.getAccounts = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = [Account];

      return this.apiClient.callApi(
        '/sys/v1/accounts', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateAccount operation.
     * @callback module:api/AccountsApi~updateAccountCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Account} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update account
     * Update the properties of an account. Only certain properties may be changed with this API. 
     * @param {String} accountId Account Identifier
     * @param {module:model/AccountRequest} body Properties to assign to Account.
     * @param {module:api/AccountsApi~updateAccountCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Account}
     */
    this.updateAccount = function(accountId, body, callback) {
      var postBody = body;

      // verify the required parameter 'accountId' is set
      if (accountId === undefined || accountId === null) {
        throw new Error("Missing the required parameter 'accountId' when calling updateAccount");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling updateAccount");
      }


      var pathParams = {
        'account-id': accountId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Account;

      return this.apiClient.callApi(
        '/sys/v1/accounts/{account-id}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/Account":36,"../model/AccountRequest":37,"../model/Error":108}],20:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/ApprovableResult', 'model/ApprovalRequest', 'model/ApprovalRequestRequest', 'model/Error'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/ApprovableResult'), require('../model/ApprovalRequest'), require('../model/ApprovalRequestRequest'), require('../model/Error'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ApprovalRequestsApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.ApprovableResult, root.FortanixSdkmsRestApi.ApprovalRequest, root.FortanixSdkmsRestApi.ApprovalRequestRequest, root.FortanixSdkmsRestApi.Error);
  }
}(this, function(ApiClient, ApprovableResult, ApprovalRequest, ApprovalRequestRequest, Error) {
  'use strict';

  /**
   * ApprovalRequests service.
   * @module api/ApprovalRequestsApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new ApprovalRequestsApi. 
   * @alias module:api/ApprovalRequestsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the approve operation.
     * @callback module:api/ApprovalRequestsApi~approveCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Approve a request.
     * @param {String} requestId Approval Request Identifier
     * @param {module:api/ApprovalRequestsApi~approveCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.approve = function(requestId, callback) {
      var postBody = null;

      // verify the required parameter 'requestId' is set
      if (requestId === undefined || requestId === null) {
        throw new Error("Missing the required parameter 'requestId' when calling approve");
      }


      var pathParams = {
        'request-id': requestId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/approval_requests/{request-id}/approve', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the createApprovalRequest operation.
     * @callback module:api/ApprovalRequestsApi~createApprovalRequestCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ApprovalRequest} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create approval request
     * @param {module:model/ApprovalRequestRequest} body Request to create an approval request.
     * @param {module:api/ApprovalRequestsApi~createApprovalRequestCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ApprovalRequest}
     */
    this.createApprovalRequest = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling createApprovalRequest");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = ApprovalRequest;

      return this.apiClient.callApi(
        '/sys/v1/approval_requests', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteApprovalRequest operation.
     * @callback module:api/ApprovalRequestsApi~deleteApprovalRequestCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete an approval request.
     * @param {String} requestId Approval Request Identifier
     * @param {module:api/ApprovalRequestsApi~deleteApprovalRequestCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteApprovalRequest = function(requestId, callback) {
      var postBody = null;

      // verify the required parameter 'requestId' is set
      if (requestId === undefined || requestId === null) {
        throw new Error("Missing the required parameter 'requestId' when calling deleteApprovalRequest");
      }


      var pathParams = {
        'request-id': requestId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/approval_requests/{request-id}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deny operation.
     * @callback module:api/ApprovalRequestsApi~denyCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Deny a request.
     * @param {String} requestId Approval Request Identifier
     * @param {module:api/ApprovalRequestsApi~denyCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deny = function(requestId, callback) {
      var postBody = null;

      // verify the required parameter 'requestId' is set
      if (requestId === undefined || requestId === null) {
        throw new Error("Missing the required parameter 'requestId' when calling deny");
      }


      var pathParams = {
        'request-id': requestId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/approval_requests/{request-id}/deny', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getApprovalRequest operation.
     * @callback module:api/ApprovalRequestsApi~getApprovalRequestCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ApprovalRequest} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get an approval request.
     * Get the details and status of a particular approval request.
     * @param {String} requestId Approval Request Identifier
     * @param {module:api/ApprovalRequestsApi~getApprovalRequestCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ApprovalRequest}
     */
    this.getApprovalRequest = function(requestId, callback) {
      var postBody = null;

      // verify the required parameter 'requestId' is set
      if (requestId === undefined || requestId === null) {
        throw new Error("Missing the required parameter 'requestId' when calling getApprovalRequest");
      }


      var pathParams = {
        'request-id': requestId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = ApprovalRequest;

      return this.apiClient.callApi(
        '/sys/v1/approval_requests/{request-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getApprovalRequests operation.
     * @callback module:api/ApprovalRequestsApi~getApprovalRequestsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/ApprovalRequest>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all approval requests
     * @param {Object} opts Optional parameters
     * @param {String} opts.requester Only retrieve approval requests with the specified requester ID
     * @param {String} opts.reviewer Only retrieve approval requests with the specified reviewer ID
     * @param {String} opts.subject Only retrieve approval requests with the specified subject ID
     * @param {module:model/String} opts.status Only retrieve approval requests with the specified approval status
     * @param {module:api/ApprovalRequestsApi~getApprovalRequestsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/ApprovalRequest>}
     */
    this.getApprovalRequests = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'requester': opts['requester'],
        'reviewer': opts['reviewer'],
        'subject': opts['subject'],
        'status': opts['status'],
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = [ApprovalRequest];

      return this.apiClient.callApi(
        '/sys/v1/approval_requests', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getResult operation.
     * @callback module:api/ApprovalRequestsApi~getResultCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ApprovableResult} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get the result for an approved or failed request.
     * @param {String} requestId Approval Request Identifier
     * @param {module:api/ApprovalRequestsApi~getResultCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ApprovableResult}
     */
    this.getResult = function(requestId, callback) {
      var postBody = null;

      // verify the required parameter 'requestId' is set
      if (requestId === undefined || requestId === null) {
        throw new Error("Missing the required parameter 'requestId' when calling getResult");
      }


      var pathParams = {
        'request-id': requestId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = ApprovableResult;

      return this.apiClient.callApi(
        '/sys/v1/approval_requests/{request-id}/result', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/ApprovableResult":46,"../model/ApprovalRequest":47,"../model/ApprovalRequestRequest":48,"../model/Error":108}],21:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/App', 'model/AppCredentialResponse', 'model/AppRequest', 'model/Error'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/App'), require('../model/AppCredentialResponse'), require('../model/AppRequest'), require('../model/Error'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AppsApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.App, root.FortanixSdkmsRestApi.AppCredentialResponse, root.FortanixSdkmsRestApi.AppRequest, root.FortanixSdkmsRestApi.Error);
  }
}(this, function(ApiClient, App, AppCredentialResponse, AppRequest, Error) {
  'use strict';

  /**
   * Apps service.
   * @module api/AppsApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new AppsApi. 
   * @alias module:api/AppsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the createApp operation.
     * @callback module:api/AppsApi~createAppCallback
     * @param {String} error Error message, if any.
     * @param {module:model/App} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a new application
     * Create a new application with the specified properties.
     * @param {module:model/AppRequest} body Properties of application to create
     * @param {module:api/AppsApi~createAppCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/App}
     */
    this.createApp = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling createApp");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = App;

      return this.apiClient.callApi(
        '/sys/v1/apps', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteApp operation.
     * @callback module:api/AppsApi~deleteAppCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete application
     * Remove an application from SDKMS.
     * @param {String} appId Application Identifier
     * @param {module:api/AppsApi~deleteAppCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteApp = function(appId, callback) {
      var postBody = null;

      // verify the required parameter 'appId' is set
      if (appId === undefined || appId === null) {
        throw new Error("Missing the required parameter 'appId' when calling deleteApp");
      }


      var pathParams = {
        'app-id': appId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/apps/{app-id}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getApp operation.
     * @callback module:api/AppsApi~getAppCallback
     * @param {String} error Error message, if any.
     * @param {module:model/App} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a specific application
     * Look up an application by application ID.
     * @param {String} appId Application Identifier
     * @param {module:api/AppsApi~getAppCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/App}
     */
    this.getApp = function(appId, callback) {
      var postBody = null;

      // verify the required parameter 'appId' is set
      if (appId === undefined || appId === null) {
        throw new Error("Missing the required parameter 'appId' when calling getApp");
      }


      var pathParams = {
        'app-id': appId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = App;

      return this.apiClient.callApi(
        '/sys/v1/apps/{app-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getApps operation.
     * @callback module:api/AppsApi~getAppsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/App>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all applications
     * Get details of all applications the current user has access to.
     * @param {Object} opts Optional parameters
     * @param {String} opts.groupId Only retrieve applications in the specified group.
     * @param {String} opts.sort This specifies the property (&#x60;app_id&#x60; only, for now) and order (ascending or descending) with which to sort the apps. By default, apps are sorted by &#x60;app_id&#x60; in ascending order. The syntax is \&quot;&lt;property&gt;:[asc|desc]\&quot; (e.g. \&quot;app_id:desc\&quot;) or just \&quot;&lt;property&gt;\&quot; (ascending order by default). 
     * @param {String} opts.start If provided, this must be a value of the property specified in &#x60;sort&#x60;. Returned apps will begin just above or just below this value (for asc/desc order resp.). 
     * @param {Number} opts.limit Maximum number of apps to return. If not provided, the limit is 100.
     * @param {Number} opts.offset Number of apps past &#x60;start&#x60; to skip.
     * @param {module:api/AppsApi~getAppsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/App>}
     */
    this.getApps = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'group_id': opts['groupId'],
        'sort': opts['sort'],
        'start': opts['start'],
        'limit': opts['limit'],
        'offset': opts['offset'],
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = [App];

      return this.apiClient.callApi(
        '/sys/v1/apps', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getCredential operation.
     * @callback module:api/AppsApi~getCredentialCallback
     * @param {String} error Error message, if any.
     * @param {module:model/AppCredentialResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a specific application&#39;s credential
     * Retrieve the authentication credential (API key or certificate) for a particular application. Only users who are an administrator of at least one of the application&#39;s groups can retrieve the credential.
     * @param {String} appId Application Identifier
     * @param {module:api/AppsApi~getCredentialCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/AppCredentialResponse}
     */
    this.getCredential = function(appId, callback) {
      var postBody = null;

      // verify the required parameter 'appId' is set
      if (appId === undefined || appId === null) {
        throw new Error("Missing the required parameter 'appId' when calling getCredential");
      }


      var pathParams = {
        'app-id': appId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = AppCredentialResponse;

      return this.apiClient.callApi(
        '/sys/v1/apps/{app-id}/credential', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the regenerateApiKey operation.
     * @callback module:api/AppsApi~regenerateApiKeyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/App} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Regenerate API key
     * Create a new API key for an application. An application may only have one valid API key at a time, so performing this action will invalidate all old API keys. This does not invalidate existing sessions, so any applications with an existing open session will be able to continue operating with their old session until those sessions expire. 
     * @param {String} appId Application Identifier
     * @param {module:api/AppsApi~regenerateApiKeyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/App}
     */
    this.regenerateApiKey = function(appId, callback) {
      var postBody = null;

      // verify the required parameter 'appId' is set
      if (appId === undefined || appId === null) {
        throw new Error("Missing the required parameter 'appId' when calling regenerateApiKey");
      }


      var pathParams = {
        'app-id': appId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = App;

      return this.apiClient.callApi(
        '/sys/v1/apps/{app-id}/reset_secret', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateApp operation.
     * @callback module:api/AppsApi~updateAppCallback
     * @param {String} error Error message, if any.
     * @param {module:model/App} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update an application
     * Change an application&#39;s properties, such as name, description, or group membership.
     * @param {String} appId Application Identifier
     * @param {module:model/AppRequest} body Properties of application to create
     * @param {module:api/AppsApi~updateAppCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/App}
     */
    this.updateApp = function(appId, body, callback) {
      var postBody = body;

      // verify the required parameter 'appId' is set
      if (appId === undefined || appId === null) {
        throw new Error("Missing the required parameter 'appId' when calling updateApp");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling updateApp");
      }


      var pathParams = {
        'app-id': appId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = App;

      return this.apiClient.callApi(
        '/sys/v1/apps/{app-id}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/App":41,"../model/AppCredentialResponse":44,"../model/AppRequest":45,"../model/Error":108}],22:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AuthResponse', 'model/Error', 'model/SelectAccountRequest', 'model/SelectAccountResponse', 'model/VersionResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/AuthResponse'), require('../model/Error'), require('../model/SelectAccountRequest'), require('../model/SelectAccountResponse'), require('../model/VersionResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AuthenticationApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AuthResponse, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.SelectAccountRequest, root.FortanixSdkmsRestApi.SelectAccountResponse, root.FortanixSdkmsRestApi.VersionResponse);
  }
}(this, function(ApiClient, AuthResponse, Error, SelectAccountRequest, SelectAccountResponse, VersionResponse) {
  'use strict';

  /**
   * Authentication service.
   * @module api/AuthenticationApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new AuthenticationApi. 
   * @alias module:api/AuthenticationApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the authorize operation.
     * @callback module:api/AuthenticationApi~authorizeCallback
     * @param {String} error Error message, if any.
     * @param {module:model/AuthResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a session for a user or an app
     * Authenticate a user or an app to SDKMS to begin a session. The caller needs to provide a basic authentication token to authenticate to SDKMS. The response body contains a bearer authentication token which needs to be provided by subsequent calls for the duration of the session. 
     * @param {module:api/AuthenticationApi~authorizeCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/AuthResponse}
     */
    this.authorize = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['basicAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = AuthResponse;

      return this.apiClient.callApi(
        '/sys/v1/session/auth', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the checkHealth operation.
     * @callback module:api/AuthenticationApi~checkHealthCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Check whether the server is handling requests
     * Returns a 200-class status code if the server is handling requests, or a 500-class status code if the server is having problems. 
     * @param {module:api/AuthenticationApi~checkHealthCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.checkHealth = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/health', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getServerVersion operation.
     * @callback module:api/AuthenticationApi~getServerVersionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/VersionResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get SDKMS version information
     * Returns information about the  SDKMS server version and the client API version that it supports. 
     * @param {module:api/AuthenticationApi~getServerVersionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/VersionResponse}
     */
    this.getServerVersion = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = VersionResponse;

      return this.apiClient.callApi(
        '/sys/v1/version', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the selectAccount operation.
     * @callback module:api/AuthenticationApi~selectAccountCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SelectAccountResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Select a user&#39;s account to work on
     * Select one of user&#39;s account to proceed. This is applicable when a user is associated with more than one account. The caller needs to provide a bearer token for the session in the request body. 
     * @param {module:model/SelectAccountRequest} body Select Account Request
     * @param {module:api/AuthenticationApi~selectAccountCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SelectAccountResponse}
     */
    this.selectAccount = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling selectAccount");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = SelectAccountResponse;

      return this.apiClient.callApi(
        '/sys/v1/session/select_account', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the terminate operation.
     * @callback module:api/AuthenticationApi~terminateCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Terminate a session
     * Terminate an authenticated session. After this call, the provided bearer authentication token will be invalidated and cannot be used to make any further API calls. 
     * @param {module:api/AuthenticationApi~terminateCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.terminate = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/session/terminate', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the unlock2F operation.
     * @callback module:api/AuthenticationApi~unlock2FCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Unlock two factor configuration
     * Re-authenticate to unlock two factor configuration. Two factor configuration must be unlocked to enable or disable two factor authentication, add or remove two factor devices, or regenerate recovery codes. The caller needs to provide a bearer token for the session in the request body. 
     * @param {module:api/AuthenticationApi~unlock2FCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.unlock2F = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/session/config_2fa/auth', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/AuthResponse":54,"../model/Error":108,"../model/SelectAccountRequest":156,"../model/SelectAccountResponse":157,"../model/VersionResponse":197}],23:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestRequest', 'model/DigestResponse', 'model/Error', 'model/MacGenerateRequest', 'model/MacGenerateRequestEx', 'model/MacGenerateResponse', 'model/MacVerifyRequest', 'model/MacVerifyRequestEx', 'model/MacVerifyResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/DigestRequest'), require('../model/DigestResponse'), require('../model/Error'), require('../model/MacGenerateRequest'), require('../model/MacGenerateRequestEx'), require('../model/MacGenerateResponse'), require('../model/MacVerifyRequest'), require('../model/MacVerifyRequestEx'), require('../model/MacVerifyResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DigestApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestRequest, root.FortanixSdkmsRestApi.DigestResponse, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.MacGenerateRequest, root.FortanixSdkmsRestApi.MacGenerateRequestEx, root.FortanixSdkmsRestApi.MacGenerateResponse, root.FortanixSdkmsRestApi.MacVerifyRequest, root.FortanixSdkmsRestApi.MacVerifyRequestEx, root.FortanixSdkmsRestApi.MacVerifyResponse);
  }
}(this, function(ApiClient, DigestRequest, DigestResponse, Error, MacGenerateRequest, MacGenerateRequestEx, MacGenerateResponse, MacVerifyRequest, MacVerifyRequestEx, MacVerifyResponse) {
  'use strict';

  /**
   * Digest service.
   * @module api/DigestApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new DigestApi. 
   * @alias module:api/DigestApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the computeDigest operation.
     * @callback module:api/DigestApi~computeDigestCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DigestResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Compute a message digest of data
     * This returns the digest of data provided in request body using the algorithm specified in request body. Maximum size of request body supported is 512KB. 
     * @param {module:model/DigestRequest} body Digest request
     * @param {module:api/DigestApi~computeDigestCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DigestResponse}
     */
    this.computeDigest = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling computeDigest");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = DigestResponse;

      return this.apiClient.callApi(
        '/crypto/v1/digest', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the computeMac operation.
     * @callback module:api/DigestApi~computeMacCallback
     * @param {String} error Error message, if any.
     * @param {module:model/MacGenerateResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Compute MAC using a key
     * Compute a cryptographic Message Authentication Code on a message using a symmetric key. The key must have the MACGenerate operation enabled. Asymmetric keys may not be used to generate MACs. They can be used with the sign and verify operations. 
     * @param {String} keyId kid of security object
     * @param {module:model/MacGenerateRequest} body MAC generation request
     * @param {module:api/DigestApi~computeMacCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/MacGenerateResponse}
     */
    this.computeMac = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling computeMac");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling computeMac");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = MacGenerateResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/mac', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the computeMacEx operation.
     * @callback module:api/DigestApi~computeMacExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/MacGenerateResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Compute MAC using a key
     * Compute a cryptographic Message Authentication Code on a message using a symmetric key. The key must have the MACGenerate operation enabled. Asymmetric keys may not be used to generate MACs. They can be used with the sign and verify operations. 
     * @param {module:model/MacGenerateRequestEx} body MAC generation request
     * @param {module:api/DigestApi~computeMacExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/MacGenerateResponse}
     */
    this.computeMacEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling computeMacEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = MacGenerateResponse;

      return this.apiClient.callApi(
        '/crypto/v1/mac', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the verifyMac operation.
     * @callback module:api/DigestApi~verifyMacCallback
     * @param {String} error Error message, if any.
     * @param {module:model/MacVerifyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Verify MAC using a key
     * The data to be MACed, the algorithm, and a pre-computed MAC are provided in the request body, and the key id is provided in the URL. SDKMS computes the MAC of the data and compares it with the specified MAC, and returns the outcome of the MAC verification in the response body. Maximum size of request body supported is 512KB. Supported digest algorithms are - SHA1, SHA256, SHA384, and SHA512.             
     * @param {String} keyId kid of security object
     * @param {module:model/MacVerifyRequest} body MAC Verify request
     * @param {module:api/DigestApi~verifyMacCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/MacVerifyResponse}
     */
    this.verifyMac = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling verifyMac");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling verifyMac");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = MacVerifyResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/macverify', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the verifyMacEx operation.
     * @callback module:api/DigestApi~verifyMacExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/MacVerifyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Verify MAC using a key
     * The data to be MACed, the algorithm, and a pre-computed MAC are provided in the request body, and the key id is provided in the URL. SDKMS computes the MAC of the data and compares it with the specified MAC, and returns the outcome of the MAC verification in the response body. Maximum size of request body supported is 512KB. Supported digest algorithms are - SHA1, SHA256, SHA384, and SHA512. 
     * @param {module:model/MacVerifyRequestEx} body MAC Verify request
     * @param {module:api/DigestApi~verifyMacExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/MacVerifyResponse}
     */
    this.verifyMacEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling verifyMacEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = MacVerifyResponse;

      return this.apiClient.callApi(
        '/crypto/v1/macverify', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/DigestRequest":92,"../model/DigestResponse":93,"../model/Error":108,"../model/MacGenerateRequest":121,"../model/MacGenerateRequestEx":122,"../model/MacGenerateResponse":123,"../model/MacVerifyRequest":124,"../model/MacVerifyRequestEx":125,"../model/MacVerifyResponse":126}],24:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/BatchDecryptRequest', 'model/BatchDecryptResponse', 'model/BatchEncryptRequest', 'model/BatchEncryptResponse', 'model/DecryptFinalRequest', 'model/DecryptFinalRequestEx', 'model/DecryptFinalResponse', 'model/DecryptInitRequest', 'model/DecryptInitRequestEx', 'model/DecryptInitResponse', 'model/DecryptRequest', 'model/DecryptRequestEx', 'model/DecryptResponse', 'model/DecryptUpdateRequest', 'model/DecryptUpdateRequestEx', 'model/DecryptUpdateResponse', 'model/EncryptFinalRequest', 'model/EncryptFinalRequestEx', 'model/EncryptFinalResponse', 'model/EncryptInitRequest', 'model/EncryptInitRequestEx', 'model/EncryptInitResponse', 'model/EncryptRequest', 'model/EncryptRequestEx', 'model/EncryptResponse', 'model/EncryptUpdateRequest', 'model/EncryptUpdateRequestEx', 'model/EncryptUpdateResponse', 'model/Error'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/BatchDecryptRequest'), require('../model/BatchDecryptResponse'), require('../model/BatchEncryptRequest'), require('../model/BatchEncryptResponse'), require('../model/DecryptFinalRequest'), require('../model/DecryptFinalRequestEx'), require('../model/DecryptFinalResponse'), require('../model/DecryptInitRequest'), require('../model/DecryptInitRequestEx'), require('../model/DecryptInitResponse'), require('../model/DecryptRequest'), require('../model/DecryptRequestEx'), require('../model/DecryptResponse'), require('../model/DecryptUpdateRequest'), require('../model/DecryptUpdateRequestEx'), require('../model/DecryptUpdateResponse'), require('../model/EncryptFinalRequest'), require('../model/EncryptFinalRequestEx'), require('../model/EncryptFinalResponse'), require('../model/EncryptInitRequest'), require('../model/EncryptInitRequestEx'), require('../model/EncryptInitResponse'), require('../model/EncryptRequest'), require('../model/EncryptRequestEx'), require('../model/EncryptResponse'), require('../model/EncryptUpdateRequest'), require('../model/EncryptUpdateRequestEx'), require('../model/EncryptUpdateResponse'), require('../model/Error'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptionAndDecryptionApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.BatchDecryptRequest, root.FortanixSdkmsRestApi.BatchDecryptResponse, root.FortanixSdkmsRestApi.BatchEncryptRequest, root.FortanixSdkmsRestApi.BatchEncryptResponse, root.FortanixSdkmsRestApi.DecryptFinalRequest, root.FortanixSdkmsRestApi.DecryptFinalRequestEx, root.FortanixSdkmsRestApi.DecryptFinalResponse, root.FortanixSdkmsRestApi.DecryptInitRequest, root.FortanixSdkmsRestApi.DecryptInitRequestEx, root.FortanixSdkmsRestApi.DecryptInitResponse, root.FortanixSdkmsRestApi.DecryptRequest, root.FortanixSdkmsRestApi.DecryptRequestEx, root.FortanixSdkmsRestApi.DecryptResponse, root.FortanixSdkmsRestApi.DecryptUpdateRequest, root.FortanixSdkmsRestApi.DecryptUpdateRequestEx, root.FortanixSdkmsRestApi.DecryptUpdateResponse, root.FortanixSdkmsRestApi.EncryptFinalRequest, root.FortanixSdkmsRestApi.EncryptFinalRequestEx, root.FortanixSdkmsRestApi.EncryptFinalResponse, root.FortanixSdkmsRestApi.EncryptInitRequest, root.FortanixSdkmsRestApi.EncryptInitRequestEx, root.FortanixSdkmsRestApi.EncryptInitResponse, root.FortanixSdkmsRestApi.EncryptRequest, root.FortanixSdkmsRestApi.EncryptRequestEx, root.FortanixSdkmsRestApi.EncryptResponse, root.FortanixSdkmsRestApi.EncryptUpdateRequest, root.FortanixSdkmsRestApi.EncryptUpdateRequestEx, root.FortanixSdkmsRestApi.EncryptUpdateResponse, root.FortanixSdkmsRestApi.Error);
  }
}(this, function(ApiClient, BatchDecryptRequest, BatchDecryptResponse, BatchEncryptRequest, BatchEncryptResponse, DecryptFinalRequest, DecryptFinalRequestEx, DecryptFinalResponse, DecryptInitRequest, DecryptInitRequestEx, DecryptInitResponse, DecryptRequest, DecryptRequestEx, DecryptResponse, DecryptUpdateRequest, DecryptUpdateRequestEx, DecryptUpdateResponse, EncryptFinalRequest, EncryptFinalRequestEx, EncryptFinalResponse, EncryptInitRequest, EncryptInitRequestEx, EncryptInitResponse, EncryptRequest, EncryptRequestEx, EncryptResponse, EncryptUpdateRequest, EncryptUpdateRequestEx, EncryptUpdateResponse, Error) {
  'use strict';

  /**
   * EncryptionAndDecryption service.
   * @module api/EncryptionAndDecryptionApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new EncryptionAndDecryptionApi. 
   * @alias module:api/EncryptionAndDecryptionApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the batchDecrypt operation.
     * @callback module:api/EncryptionAndDecryptionApi~batchDecryptCallback
     * @param {String} error Error message, if any.
     * @param {module:model/BatchDecryptResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Batch decrypt with one or more keys
     * The data to be decrypted and the key ids to be used are provided in the request body. The decrypted plain text is returned in the response body. The ordering of the body matches the ordering of the request. An individual status code is returned for each batch item. Maximum size of the entire batch request is 512 KB. 
     * @param {module:model/BatchDecryptRequest} body Batch decryption request
     * @param {module:api/EncryptionAndDecryptionApi~batchDecryptCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/BatchDecryptResponse}
     */
    this.batchDecrypt = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling batchDecrypt");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = BatchDecryptResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/batch/decrypt', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the batchEncrypt operation.
     * @callback module:api/EncryptionAndDecryptionApi~batchEncryptCallback
     * @param {String} error Error message, if any.
     * @param {module:model/BatchEncryptResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Batch encrypt with one or more keys
     * The data to be encrypted and the key ids to be used are provided in the request body. The encrypted cipher text is returned in the response body. The ordering of the body matches the ordering of the request. An individual status code is returned for each batch item. Maximum size of the entire batch request is 512 KB. 
     * @param {module:model/BatchEncryptRequest} body Batch Encryption request
     * @param {module:api/EncryptionAndDecryptionApi~batchEncryptCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/BatchEncryptResponse}
     */
    this.batchEncrypt = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling batchEncrypt");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = BatchEncryptResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/batch/encrypt', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the decrypt operation.
     * @callback module:api/EncryptionAndDecryptionApi~decryptCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DecryptResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Decrypt data
     * Decrypt data using a symmetric or asymmetric key. For symmetric ciphers, mode (specifying the block cipher mode) is a required field. &lt;br&gt; For GCM and CCM modes, tag_len is a required field. &lt;br&gt; iv is required for symmetric ciphers and unused for asymmetric ciphers. It must contain the initialization value used when the object was encrypted. &lt;br&gt; Objects of type opaque, EC, or HMAC may not be used for encryption or decryption. &lt;br&gt; 
     * @param {String} keyId kid of security object
     * @param {module:model/DecryptRequest} body Decryption request
     * @param {module:api/EncryptionAndDecryptionApi~decryptCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DecryptResponse}
     */
    this.decrypt = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling decrypt");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling decrypt");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = DecryptResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/decrypt', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the decryptEx operation.
     * @callback module:api/EncryptionAndDecryptionApi~decryptExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DecryptResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Decrypt data
     * Decrypt data using a symmetric or asymmetric key. For symmetric ciphers, mode (specifying the block cipher mode) is a required field. &lt;br&gt; For GCM and CCM modes, tag_len is a required field. &lt;br&gt; iv is required for symmetric ciphers and unused for asymmetric ciphers. It must contain the initialization value used when the object was encrypted. &lt;br&gt; Objects of type opaque, EC, or HMAC may not be used for encryption or decryption. &lt;br&gt; 
     * @param {module:model/DecryptRequestEx} body Decryption request
     * @param {module:api/EncryptionAndDecryptionApi~decryptExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DecryptResponse}
     */
    this.decryptEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling decryptEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = DecryptResponse;

      return this.apiClient.callApi(
        '/crypto/v1/decrypt', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the decryptFinal operation.
     * @callback module:api/EncryptionAndDecryptionApi~decryptFinalCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DecryptFinalResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Conclude multi-part decryption
     * Conclude a multi-part decryption operation. See &#x60;decrypt/init&#x60; for details. 
     * @param {String} keyId kid of security object
     * @param {module:model/DecryptFinalRequest} body Finish multi-part decryption
     * @param {module:api/EncryptionAndDecryptionApi~decryptFinalCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DecryptFinalResponse}
     */
    this.decryptFinal = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling decryptFinal");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling decryptFinal");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = DecryptFinalResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/decrypt/final', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the decryptFinalEx operation.
     * @callback module:api/EncryptionAndDecryptionApi~decryptFinalExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DecryptFinalResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Conclude multi-part decryption
     * Conclude a multi-part decryption operation. See &#x60;decrypt/init&#x60; for details. 
     * @param {module:model/DecryptFinalRequestEx} body Finish multi-part decryption
     * @param {module:api/EncryptionAndDecryptionApi~decryptFinalExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DecryptFinalResponse}
     */
    this.decryptFinalEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling decryptFinalEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = DecryptFinalResponse;

      return this.apiClient.callApi(
        '/crypto/v1/decrypt/final', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the decryptInit operation.
     * @callback module:api/EncryptionAndDecryptionApi~decryptInitCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DecryptInitResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Begin multi-part decryption
     * This API is used when decrypting more data than the client wishes to submit in a single request. It supports only symmetric ciphers and only conventional (not AEAD) modes of operation. To perform multi-part decryption, the client makes one request to the &#x60;init&#x60; resource, zero or more requests to the &#x60;update&#x60; resource, followed by one request to the &#x60;final&#x60; resource. The response to init and update requests includes a &#x60;state&#x60; field. The &#x60;state&#x60; is an opaque data blob that must be supplied unmodified by the client with the subsequent request. 
     * @param {String} keyId kid of security object
     * @param {module:model/DecryptInitRequest} body Multi-part decryption initialization request
     * @param {module:api/EncryptionAndDecryptionApi~decryptInitCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DecryptInitResponse}
     */
    this.decryptInit = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling decryptInit");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling decryptInit");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = DecryptInitResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/decrypt/init', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the decryptInitEx operation.
     * @callback module:api/EncryptionAndDecryptionApi~decryptInitExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DecryptInitResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Begin multi-part decryption
     * This API is used when decrypting more data than the client wishes to submit in a single request. It supports only symmetric ciphers and only conventional (not AEAD) modes of operation. To perform multi-part decryption, the client makes one request to the &#x60;init&#x60; resource, zero or more requests to the &#x60;update&#x60; resource, followed by one request to the &#x60;final&#x60; resource. The response to init and update requests includes a &#x60;state&#x60; field. The &#x60;state&#x60; is an opaque data blob that must be supplied unmodified by the client with the subsequent request. 
     * @param {module:model/DecryptInitRequestEx} body Multi-part decryption initialization request
     * @param {module:api/EncryptionAndDecryptionApi~decryptInitExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DecryptInitResponse}
     */
    this.decryptInitEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling decryptInitEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = DecryptInitResponse;

      return this.apiClient.callApi(
        '/crypto/v1/decrypt/init', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the decryptUpdate operation.
     * @callback module:api/EncryptionAndDecryptionApi~decryptUpdateCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DecryptUpdateResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Continue multi-part decryption
     * Continue a multi-part decryption operation. See &#x60;decrypt/init&#x60; for details. 
     * @param {String} keyId kid of security object
     * @param {module:model/DecryptUpdateRequest} body Multi-part decryption
     * @param {module:api/EncryptionAndDecryptionApi~decryptUpdateCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DecryptUpdateResponse}
     */
    this.decryptUpdate = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling decryptUpdate");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling decryptUpdate");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = DecryptUpdateResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/decrypt/update', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the decryptUpdateEx operation.
     * @callback module:api/EncryptionAndDecryptionApi~decryptUpdateExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DecryptUpdateResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Continue multi-part decryption
     * Continue a multi-part decryption operation. See &#x60;decrypt/init&#x60; for details. 
     * @param {module:model/DecryptUpdateRequestEx} body Multi-part decryption
     * @param {module:api/EncryptionAndDecryptionApi~decryptUpdateExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DecryptUpdateResponse}
     */
    this.decryptUpdateEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling decryptUpdateEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = DecryptUpdateResponse;

      return this.apiClient.callApi(
        '/crypto/v1/decrypt/update', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the encrypt operation.
     * @callback module:api/EncryptionAndDecryptionApi~encryptCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EncryptResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Encrypt data
     * Encrypt data using a symmetric or asymmetric key. &lt;br&gt; For symmetric ciphers, mode (specifying the block cipher mode) is a required field. &lt;br&gt; For GCM and CCM modes, tag_len is a required field. &lt;br&gt; iv is optional for symmetric ciphers and unused for asymmetric ciphers. If provided, it will be used as the cipher initialization value. Length of iv must match the initialization value size for the cipher and mode. If not provided, SDKMS will create a random iv of the correct length for the cipher and mode and return this value in the response. &lt;br&gt; Objects of type Opaque, EC, or HMAC may not be used for encryption or decryption. &lt;br&gt; 
     * @param {String} keyId kid of security object
     * @param {module:model/EncryptRequest} body Encryption request
     * @param {module:api/EncryptionAndDecryptionApi~encryptCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EncryptResponse}
     */
    this.encrypt = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling encrypt");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling encrypt");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = EncryptResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/encrypt', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the encryptEx operation.
     * @callback module:api/EncryptionAndDecryptionApi~encryptExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EncryptResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Encrypt data
     * Encrypt data using a symmetric or asymmetric key. &lt;br&gt; For symmetric ciphers, mode (specifying the block cipher mode) is a required field. &lt;br&gt; For GCM and CCM modes, tag_len is a required field. &lt;br&gt; iv is optional for symmetric ciphers and unused for asymmetric ciphers. If provided, it will be used as the cipher initialization value. Length of iv must match the initialization value size for the cipher and mode. If not provided, SDKMS will create a random iv of the correct length for the cipher and mode and return this value in the response. &lt;br&gt; Objects of type Opaque, EC, or HMAC may not be used for encryption or decryption. &lt;br&gt; 
     * @param {module:model/EncryptRequestEx} body Encryption request
     * @param {module:api/EncryptionAndDecryptionApi~encryptExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EncryptResponse}
     */
    this.encryptEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling encryptEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = EncryptResponse;

      return this.apiClient.callApi(
        '/crypto/v1/encrypt', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the encryptFinal operation.
     * @callback module:api/EncryptionAndDecryptionApi~encryptFinalCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EncryptFinalResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Conclude multi-part encryption
     * Conclude a multi-part encryption operation. See &#x60;encrypt/init&#x60; for details. 
     * @param {String} keyId kid of security object
     * @param {module:model/EncryptFinalRequest} body Finish multi-part encryption
     * @param {module:api/EncryptionAndDecryptionApi~encryptFinalCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EncryptFinalResponse}
     */
    this.encryptFinal = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling encryptFinal");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling encryptFinal");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = EncryptFinalResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/encrypt/final', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the encryptFinalEx operation.
     * @callback module:api/EncryptionAndDecryptionApi~encryptFinalExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EncryptFinalResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Conclude multi-part encryption
     * Conclude a multi-part encryption operation. See &#x60;encrypt/init&#x60; for details. 
     * @param {module:model/EncryptFinalRequestEx} body Finish multi-part encryption
     * @param {module:api/EncryptionAndDecryptionApi~encryptFinalExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EncryptFinalResponse}
     */
    this.encryptFinalEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling encryptFinalEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = EncryptFinalResponse;

      return this.apiClient.callApi(
        '/crypto/v1/encrypt/final', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the encryptInit operation.
     * @callback module:api/EncryptionAndDecryptionApi~encryptInitCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EncryptInitResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Begin multi-part encryption
     * This API is used when encrypting more data than the client wishes to submit in a single request. It supports only symmetric ciphers and only conventional (not AEAD) modes of operation. To perform multi-part encryption, the client makes one request to the &#x60;init&#x60; resource, zero or more requests to the &#x60;update&#x60; resource, followed by one request to the &#x60;final&#x60; resource. The response to init and update requests includes a &#x60;state&#x60; field. The &#x60;state&#x60; is an opaque data blob that must be supplied unmodified by the client with the subsequent request. 
     * @param {String} keyId kid of security object
     * @param {module:model/EncryptInitRequest} body Multi-part encryption initialization request
     * @param {module:api/EncryptionAndDecryptionApi~encryptInitCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EncryptInitResponse}
     */
    this.encryptInit = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling encryptInit");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling encryptInit");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = EncryptInitResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/encrypt/init', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the encryptInitEx operation.
     * @callback module:api/EncryptionAndDecryptionApi~encryptInitExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EncryptInitResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Begin multi-part encryption
     * This API is used when encrypting more data than the client wishes to submit in a single request. It supports only symmetric ciphers and only conventional (not AEAD) modes of operation. To perform multi-part encryption, the client makes one request to the &#x60;init&#x60; resource, zero or more requests to the &#x60;update&#x60; resource, followed by one request to the &#x60;final&#x60; resource. The response to init and update requests includes a &#x60;state&#x60; field. The &#x60;state&#x60; is an opaque data blob that must be supplied unmodified by the client with the subsequent request. 
     * @param {module:model/EncryptInitRequestEx} body Multi-part encryption initialization request
     * @param {module:api/EncryptionAndDecryptionApi~encryptInitExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EncryptInitResponse}
     */
    this.encryptInitEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling encryptInitEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = EncryptInitResponse;

      return this.apiClient.callApi(
        '/crypto/v1/encrypt/init', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the encryptUpdate operation.
     * @callback module:api/EncryptionAndDecryptionApi~encryptUpdateCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EncryptUpdateResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Continue multi-part encryption
     * Continue a multi-part encryption operation. See &#x60;encrypt/init&#x60; for details. 
     * @param {String} keyId kid of security object
     * @param {module:model/EncryptUpdateRequest} body Multi-part encryption
     * @param {module:api/EncryptionAndDecryptionApi~encryptUpdateCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EncryptUpdateResponse}
     */
    this.encryptUpdate = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling encryptUpdate");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling encryptUpdate");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = EncryptUpdateResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/encrypt/update', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the encryptUpdateEx operation.
     * @callback module:api/EncryptionAndDecryptionApi~encryptUpdateExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/EncryptUpdateResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Continue multi-part encryption
     * Continue a multi-part encryption operation. See &#x60;encrypt/init&#x60; for details. 
     * @param {module:model/EncryptUpdateRequestEx} body Multi-part encryption
     * @param {module:api/EncryptionAndDecryptionApi~encryptUpdateExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/EncryptUpdateResponse}
     */
    this.encryptUpdateEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling encryptUpdateEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = EncryptUpdateResponse;

      return this.apiClient.callApi(
        '/crypto/v1/encrypt/update', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/BatchDecryptRequest":56,"../model/BatchDecryptResponse":58,"../model/BatchEncryptRequest":60,"../model/BatchEncryptResponse":62,"../model/DecryptFinalRequest":76,"../model/DecryptFinalRequestEx":77,"../model/DecryptFinalResponse":78,"../model/DecryptInitRequest":79,"../model/DecryptInitRequestEx":80,"../model/DecryptInitResponse":81,"../model/DecryptRequest":82,"../model/DecryptRequestEx":83,"../model/DecryptResponse":84,"../model/DecryptUpdateRequest":85,"../model/DecryptUpdateRequestEx":86,"../model/DecryptUpdateResponse":87,"../model/EncryptFinalRequest":95,"../model/EncryptFinalRequestEx":96,"../model/EncryptFinalResponse":97,"../model/EncryptInitRequest":98,"../model/EncryptInitRequestEx":99,"../model/EncryptInitResponse":100,"../model/EncryptRequest":101,"../model/EncryptRequestEx":102,"../model/EncryptResponse":103,"../model/EncryptUpdateRequest":104,"../model/EncryptUpdateRequestEx":105,"../model/EncryptUpdateResponse":106,"../model/Error":108}],25:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Error', 'model/Group', 'model/GroupRequest'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Error'), require('../model/Group'), require('../model/GroupRequest'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.GroupsApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.Group, root.FortanixSdkmsRestApi.GroupRequest);
  }
}(this, function(ApiClient, Error, Group, GroupRequest) {
  'use strict';

  /**
   * Groups service.
   * @module api/GroupsApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new GroupsApi. 
   * @alias module:api/GroupsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the createGroup operation.
     * @callback module:api/GroupsApi~createGroupCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Group} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create new group
     * Create a new group with the specified properties.
     * @param {module:model/GroupRequest} body Name of group
     * @param {module:api/GroupsApi~createGroupCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Group}
     */
    this.createGroup = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling createGroup");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Group;

      return this.apiClient.callApi(
        '/sys/v1/groups', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteGroup operation.
     * @callback module:api/GroupsApi~deleteGroupCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete group
     * Remove a group from SDKMS.
     * @param {String} groupId Group Identifier
     * @param {module:api/GroupsApi~deleteGroupCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteGroup = function(groupId, callback) {
      var postBody = null;

      // verify the required parameter 'groupId' is set
      if (groupId === undefined || groupId === null) {
        throw new Error("Missing the required parameter 'groupId' when calling deleteGroup");
      }


      var pathParams = {
        'group-id': groupId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/groups/{group-id}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getGroup operation.
     * @callback module:api/GroupsApi~getGroupCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Group} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a specific group
     * Look up a specific group by group ID.
     * @param {String} groupId Group Identifier
     * @param {module:api/GroupsApi~getGroupCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Group}
     */
    this.getGroup = function(groupId, callback) {
      var postBody = null;

      // verify the required parameter 'groupId' is set
      if (groupId === undefined || groupId === null) {
        throw new Error("Missing the required parameter 'groupId' when calling getGroup");
      }


      var pathParams = {
        'group-id': groupId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Group;

      return this.apiClient.callApi(
        '/sys/v1/groups/{group-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getGroups operation.
     * @callback module:api/GroupsApi~getGroupsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Group>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all groups
     * Get detailed information about all groups the authenticated User or authenticated Application belongs to.
     * @param {module:api/GroupsApi~getGroupsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Group>}
     */
    this.getGroups = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = [Group];

      return this.apiClient.callApi(
        '/sys/v1/groups', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateGroup operation.
     * @callback module:api/GroupsApi~updateGroupCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Group} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update group
     * Change a group&#39;s properties.
     * @param {String} groupId Group Identifier
     * @param {module:model/GroupRequest} body Name of group
     * @param {module:api/GroupsApi~updateGroupCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Group}
     */
    this.updateGroup = function(groupId, body, callback) {
      var postBody = body;

      // verify the required parameter 'groupId' is set
      if (groupId === undefined || groupId === null) {
        throw new Error("Missing the required parameter 'groupId' when calling updateGroup");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling updateGroup");
      }


      var pathParams = {
        'group-id': groupId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Group;

      return this.apiClient.callApi(
        '/sys/v1/groups/{group-id}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/Error":108,"../model/Group":111,"../model/GroupRequest":112}],26:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AuditLogResponse', 'model/Error'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/AuditLogResponse'), require('../model/Error'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.LogsApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AuditLogResponse, root.FortanixSdkmsRestApi.Error);
  }
}(this, function(ApiClient, AuditLogResponse, Error) {
  'use strict';

  /**
   * Logs service.
   * @module api/LogsApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new LogsApi. 
   * @alias module:api/LogsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the getAuditLogs operation.
     * @callback module:api/LogsApi~getAuditLogsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/AuditLogResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get audit logs
     * Get audit log entries matching the requested filters.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.size Maximum number of entries to return
     * @param {Number} opts.from For pagination, starting offset
     * @param {module:model/String} opts.actionType Event action type
     * @param {module:model/String} opts.actorType Event actor type
     * @param {String} opts.actorId Actor (User or App) Identifier
     * @param {String} opts.objectId Object (User or App) Identifier for event
     * @param {module:model/String} opts.severity Event severity type
     * @param {Number} opts.rangeFrom Starting time for search , this is EPOCH value
     * @param {Number} opts.rangeTo Ending time for search , this is EPOCH value
     * @param {module:api/LogsApi~getAuditLogsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/AuditLogResponse}
     */
    this.getAuditLogs = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'size': opts['size'],
        'from': opts['from'],
        'action_type': opts['actionType'],
        'actor_type': opts['actorType'],
        'actor_id': opts['actorId'],
        'object_id': opts['objectId'],
        'severity': opts['severity'],
        'range_from': opts['rangeFrom'],
        'range_to': opts['rangeTo'],
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = AuditLogResponse;

      return this.apiClient.callApi(
        '/sys/v1/logs', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/AuditLogResponse":51,"../model/Error":108}],27:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/App', 'model/Error', 'model/Plugin', 'model/PluginInvokeRequest', 'model/PluginInvokeResponse', 'model/PluginRequest'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/App'), require('../model/Error'), require('../model/Plugin'), require('../model/PluginInvokeRequest'), require('../model/PluginInvokeResponse'), require('../model/PluginRequest'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.PluginsApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.App, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.Plugin, root.FortanixSdkmsRestApi.PluginInvokeRequest, root.FortanixSdkmsRestApi.PluginInvokeResponse, root.FortanixSdkmsRestApi.PluginRequest);
  }
}(this, function(ApiClient, App, Error, Plugin, PluginInvokeRequest, PluginInvokeResponse, PluginRequest) {
  'use strict';

  /**
   * Plugins service.
   * @module api/PluginsApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new PluginsApi. 
   * @alias module:api/PluginsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the createPlugin operation.
     * @callback module:api/PluginsApi~createPluginCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Plugin} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a new plugin
     * Create a new plugin with the specified properties.
     * @param {module:model/PluginRequest} body Properties of plugin to create
     * @param {module:api/PluginsApi~createPluginCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Plugin}
     */
    this.createPlugin = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling createPlugin");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Plugin;

      return this.apiClient.callApi(
        '/sys/v1/plugins', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deletePlugin operation.
     * @callback module:api/PluginsApi~deletePluginCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete plugin
     * Remove a plugin from SDKMS.
     * @param {String} pluginId Plugin Identifier
     * @param {module:api/PluginsApi~deletePluginCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deletePlugin = function(pluginId, callback) {
      var postBody = null;

      // verify the required parameter 'pluginId' is set
      if (pluginId === undefined || pluginId === null) {
        throw new Error("Missing the required parameter 'pluginId' when calling deletePlugin");
      }


      var pathParams = {
        'plugin-id': pluginId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/plugins/{plugin-id}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getPlugin operation.
     * @callback module:api/PluginsApi~getPluginCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Plugin} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a specific plugin
     * Look up plugin by plugin ID.
     * @param {String} pluginId Plugin Identifier
     * @param {module:api/PluginsApi~getPluginCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Plugin}
     */
    this.getPlugin = function(pluginId, callback) {
      var postBody = null;

      // verify the required parameter 'pluginId' is set
      if (pluginId === undefined || pluginId === null) {
        throw new Error("Missing the required parameter 'pluginId' when calling getPlugin");
      }


      var pathParams = {
        'plugin-id': pluginId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = Plugin;

      return this.apiClient.callApi(
        '/sys/v1/plugins/{plugin-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getPlugins operation.
     * @callback module:api/PluginsApi~getPluginsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Plugin>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all plugins
     * Get details of all plugins the current user has access to.
     * @param {Object} opts Optional parameters
     * @param {String} opts.groupId Only retrieve plugins in the specified group.
     * @param {String} opts.sort This specifies the property (&#x60;plugin_id&#x60; only, for now) and order (ascending or descending) with which to sort the apps. By default, plugins are sorted by &#x60;plugin_id&#x60; in ascending order. The syntax is \&quot;&lt;property&gt;:[asc|desc]\&quot; (e.g. \&quot;plugin_id:desc\&quot;) or just \&quot;&lt;property&gt;\&quot; (ascending order by default). 
     * @param {String} opts.start If provided, this must be a value of the property specified in &#x60;sort&#x60;. Returned apps will begin just above or just below this value (for asc/desc order resp.). 
     * @param {Number} opts.limit Maximum number of apps to return. If not provided, the limit is 100.
     * @param {Number} opts.offset Number of apps past &#x60;start&#x60; to skip.
     * @param {module:api/PluginsApi~getPluginsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Plugin>}
     */
    this.getPlugins = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'group_id': opts['groupId'],
        'sort': opts['sort'],
        'start': opts['start'],
        'limit': opts['limit'],
        'offset': opts['offset'],
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = [Plugin];

      return this.apiClient.callApi(
        '/sys/v1/plugins', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the invokePlugin operation.
     * @callback module:api/PluginsApi~invokePluginCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PluginInvokeResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Invoke a plugin
     * Invokes a plugin execution with the provided request body as input to the plugin.
     * @param {String} pluginId Plugin Identifier
     * @param {module:model/PluginInvokeRequest} body Object to be passed to plugin as input
     * @param {module:api/PluginsApi~invokePluginCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PluginInvokeResponse}
     */
    this.invokePlugin = function(pluginId, body, callback) {
      var postBody = body;

      // verify the required parameter 'pluginId' is set
      if (pluginId === undefined || pluginId === null) {
        throw new Error("Missing the required parameter 'pluginId' when calling invokePlugin");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling invokePlugin");
      }


      var pathParams = {
        'plugin-id': pluginId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = PluginInvokeResponse;

      return this.apiClient.callApi(
        '/sys/v1/plugins/{plugin-id}', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the sysV1PluginsInvokePluginIdGet operation.
     * @callback module:api/PluginsApi~sysV1PluginsInvokePluginIdGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PluginInvokeResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Invoke a plugin using GET.
     * Invokes a plugin with empty input.
     * @param {String} pluginId Plugin Identifier
     * @param {module:api/PluginsApi~sysV1PluginsInvokePluginIdGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PluginInvokeResponse}
     */
    this.sysV1PluginsInvokePluginIdGet = function(pluginId, callback) {
      var postBody = null;

      // verify the required parameter 'pluginId' is set
      if (pluginId === undefined || pluginId === null) {
        throw new Error("Missing the required parameter 'pluginId' when calling sysV1PluginsInvokePluginIdGet");
      }


      var pathParams = {
        'plugin-id': pluginId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = PluginInvokeResponse;

      return this.apiClient.callApi(
        '/sys/v1/plugins/invoke/{plugin-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updatePlugin operation.
     * @callback module:api/PluginsApi~updatePluginCallback
     * @param {String} error Error message, if any.
     * @param {module:model/App} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update a plugin
     * Change a plugin&#39;s properties, such as name, description, code, or group membership.
     * @param {String} pluginId Plugin Identifier
     * @param {module:model/PluginRequest} body Properties of plugin to create
     * @param {module:api/PluginsApi~updatePluginCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/App}
     */
    this.updatePlugin = function(pluginId, body, callback) {
      var postBody = body;

      // verify the required parameter 'pluginId' is set
      if (pluginId === undefined || pluginId === null) {
        throw new Error("Missing the required parameter 'pluginId' when calling updatePlugin");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling updatePlugin");
      }


      var pathParams = {
        'plugin-id': pluginId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = App;

      return this.apiClient.callApi(
        '/sys/v1/plugins/{plugin-id}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/App":41,"../model/Error":108,"../model/Plugin":137,"../model/PluginInvokeRequest":138,"../model/PluginInvokeResponse":139,"../model/PluginRequest":140}],28:[function(require,module,exports){


/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AgreeKeyRequest', 'model/DeriveKeyRequest', 'model/DeriveKeyRequestEx', 'model/DigestResponse', 'model/Error', 'model/KeyObject', 'model/ObjectDigestRequest', 'model/PersistTransientKeyRequest', 'model/SobjectDescriptor', 'model/SobjectRequest'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/AgreeKeyRequest'), require('../model/DeriveKeyRequest'), require('../model/DeriveKeyRequestEx'), require('../model/DigestResponse'), require('../model/Error'), require('../model/KeyObject'), require('../model/ObjectDigestRequest'), require('../model/PersistTransientKeyRequest'), require('../model/SobjectDescriptor'), require('../model/SobjectRequest'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SecurityObjectsApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AgreeKeyRequest, root.FortanixSdkmsRestApi.DeriveKeyRequest, root.FortanixSdkmsRestApi.DeriveKeyRequestEx, root.FortanixSdkmsRestApi.DigestResponse, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.KeyObject, root.FortanixSdkmsRestApi.ObjectDigestRequest, root.FortanixSdkmsRestApi.PersistTransientKeyRequest, root.FortanixSdkmsRestApi.SobjectDescriptor, root.FortanixSdkmsRestApi.SobjectRequest);
  }
}(this, function(ApiClient, AgreeKeyRequest, DeriveKeyRequest, DeriveKeyRequestEx, DigestResponse, Error, KeyObject, ObjectDigestRequest, PersistTransientKeyRequest, SobjectDescriptor, SobjectRequest) {
  'use strict';

  /**
   * SecurityObjects service.
   * @module api/SecurityObjectsApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new SecurityObjectsApi. 
   * @alias module:api/SecurityObjectsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the agreeKey operation.
     * @callback module:api/SecurityObjectsApi~agreeKeyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Agree on a key from two other keys
     * This does a cryptographic key agreement operation between a public and private key. Both keys must have been generated from the same parameters (e.g. the same elliptic curve). Both keys must allow the AGREEKEY operation. The request body contains the requested properties for the new key as well as the mechanism (e.g. Diffie-Hellman) to be used to produce the key material for the new key. The output of this API should not be used directly as a cryptographic key. The target object type should be HMAC or Secret, and a key derivation procedure should be used to derive the actual key material. 
     * @param {module:model/AgreeKeyRequest} body Template of the agreed-upon security object
     * @param {module:api/SecurityObjectsApi~agreeKeyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.agreeKey = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling agreeKey");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/agree', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deletePrivateKey operation.
     * @callback module:api/SecurityObjectsApi~deletePrivateKeyCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Remove / Destroy private half of the asymmetric key
     * Removes the private portion of an asymmetric key from SDKMS. After this operation is performed, operations that require the private key, such as encryption and generating signatures, may no longer be performed. 
     * @param {String} keyId kid of security object
     * @param {module:api/SecurityObjectsApi~deletePrivateKeyCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deletePrivateKey = function(keyId, callback) {
      var postBody = null;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling deletePrivateKey");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/private', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~deleteSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete a security object
     * Delete a specified security object.
     * @param {String} keyId kid of security object
     * @param {module:api/SecurityObjectsApi~deleteSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteSecurityObject = function(keyId, callback) {
      var postBody = null;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling deleteSecurityObject");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deriveKey operation.
     * @callback module:api/SecurityObjectsApi~deriveKeyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Derive a key from another key
     * This derives a key from an existing key and returns the properties of the new key. The request body contains the requested properties for the new as well as the mechanism to be used to produce the key material for the new key. 
     * @param {String} keyId kid of security object
     * @param {module:model/DeriveKeyRequest} body Name of security object
     * @param {module:api/SecurityObjectsApi~deriveKeyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.deriveKey = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling deriveKey");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling deriveKey");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/derive', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deriveKeyEx operation.
     * @callback module:api/SecurityObjectsApi~deriveKeyExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Derive a key from another key
     * This derives a key from an existing key and returns the properties of the new key. The request body contains the requested properties for the new as well as the mechanism to be used to produce the key material for the new key. 
     * @param {module:model/DeriveKeyRequestEx} body Name of security object
     * @param {module:api/SecurityObjectsApi~deriveKeyExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.deriveKeyEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling deriveKeyEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/derive', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the generateSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~generateSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Generate a new security object
     * Generate a new security object (such as an RSA key pair or an AES key) of the requested size or elliptic curve. &lt;br&gt; By default, all key operations except for Export that are implemented for that type of key will be enabled. These may be overridden by requesting specific operations in the key creation request. &lt;br&gt; Objects of type Opaque may not be generated with this API. They must be imported via the importSecurityObject API. 
     * @param {module:model/SobjectRequest} body Request to create, update, or import security object
     * @param {module:api/SecurityObjectsApi~generateSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.generateSecurityObject = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling generateSecurityObject");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~getSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a specific security object
     * Get the details of a particular security object. The query parameter &#x60;?view&#x3D;value&#x60; may be used to get the value of an opaque object or certificate directly as raw bytes. 
     * @param {String} keyId kid of security object
     * @param {module:api/SecurityObjectsApi~getSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.getSecurityObject = function(keyId, callback) {
      var postBody = null;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling getSecurityObject");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSecurityObjectDigest operation.
     * @callback module:api/SecurityObjectsApi~getSecurityObjectDigestCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DigestResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Retrieve the digest (hash) of the value of an exportable security object
     * @param {module:model/ObjectDigestRequest} body Object digest request
     * @param {module:api/SecurityObjectsApi~getSecurityObjectDigestCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DigestResponse}
     */
    this.getSecurityObjectDigest = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling getSecurityObjectDigest");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = DigestResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/digest', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSecurityObjectValue operation.
     * @callback module:api/SecurityObjectsApi~getSecurityObjectValueCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Retrieve the value of an exportable security object
     * Get the details and value of a particular exportable security object. 
     * @param {String} keyId kid of security object
     * @param {module:api/SecurityObjectsApi~getSecurityObjectValueCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.getSecurityObjectValue = function(keyId, callback) {
      var postBody = null;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling getSecurityObjectValue");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/export', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSecurityObjectValueEx operation.
     * @callback module:api/SecurityObjectsApi~getSecurityObjectValueExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Retrieve the value of an exportable security object
     * Get the details and value of a particular exportable security object. 
     * @param {module:model/SobjectDescriptor} body Request to export a security object
     * @param {module:api/SecurityObjectsApi~getSecurityObjectValueExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.getSecurityObjectValueEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling getSecurityObjectValueEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/export', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSecurityObjects operation.
     * @callback module:api/SecurityObjectsApi~getSecurityObjectsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/KeyObject>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all security objects
     * Return detailed information about the security objects stored in Fortanix SDKMS. 
     * @param {Object} opts Optional parameters
     * @param {String} opts.name Only retrieve the security object with this name.
     * @param {String} opts.groupId Only retrieve security objects in the specified group.
     * @param {String} opts.creator Only retrieve security objects created by the user or application with the specified id.
     * @param {String} opts.sort This specifies the property (&#x60;kid&#x60; or &#x60;name&#x60;) and order (ascending or descending) with which to sort the security objects. By default, security objects are sorted by &#x60;kid&#x60; in ascending order. The syntax is \&quot;&lt;property&gt;:[asc|desc]\&quot; (e.g. \&quot;kid:desc\&quot;) or just \&quot;&lt;property&gt;\&quot; (ascending order by default). 
     * @param {String} opts.start If provided, this must be a value of the property specified in &#x60;sort&#x60;. Returned security objects will begin just above or just below this value (for asc/desc order resp.). 
     * @param {Number} opts.limit Maximum number of security objects to return. If not provided, the limit is 100.
     * @param {Number} opts.offset Number of security objects past &#x60;start&#x60; to skip.
     * @param {module:api/SecurityObjectsApi~getSecurityObjectsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/KeyObject>}
     */
    this.getSecurityObjects = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'name': opts['name'],
        'group_id': opts['groupId'],
        'creator': opts['creator'],
        'sort': opts['sort'],
        'start': opts['start'],
        'limit': opts['limit'],
        'offset': opts['offset'],
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = [KeyObject];

      return this.apiClient.callApi(
        '/crypto/v1/keys', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the importSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~importSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Import a security object
     * Import a security object into SDKMS. &lt;br&gt; By default, all key operations except that are implemented for that type of key will be enabled. These may be overridden by requesting specific operations in the key import request. &lt;br&gt; For symmetric and asymmetric keys, value is base64-encoding of the key material in DER format. 
     * @param {module:model/SobjectRequest} body Request to create, update, or import security object
     * @param {module:api/SecurityObjectsApi~importSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.importSecurityObject = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling importSecurityObject");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys', 'PUT',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the persistSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~persistSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Persist a transient key.
     * This API copies a transient key into a persisted security object in SDKMS. If the transient key&#39;s origin is \&quot;FortanixHSM\&quot;, the origin of the persisted key will be \&quot;Transient\&quot;. If the transient key&#39;s origin is \&quot;External\&quot;, the origin of the persisted key will be \&quot;External\&quot;. 
     * @param {module:model/PersistTransientKeyRequest} body Persist transient key request
     * @param {module:api/SecurityObjectsApi~persistSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.persistSecurityObject = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling persistSecurityObject");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/persist', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateSecurityObject operation.
     * @callback module:api/SecurityObjectsApi~updateSecurityObjectCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update a security object
     * Update the properties of a security object. 
     * @param {String} keyId kid of security object
     * @param {module:model/SobjectRequest} body Request to create, update, or import security object
     * @param {module:api/SecurityObjectsApi~updateSecurityObjectCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.updateSecurityObject = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling updateSecurityObject");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling updateSecurityObject");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/AgreeKeyRequest":40,"../model/DeriveKeyRequest":89,"../model/DeriveKeyRequestEx":90,"../model/DigestResponse":93,"../model/Error":108,"../model/KeyObject":116,"../model/ObjectDigestRequest":131,"../model/PersistTransientKeyRequest":136,"../model/SobjectDescriptor":164,"../model/SobjectRequest":165}],29:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/BatchSignRequest', 'model/BatchSignResponse', 'model/BatchVerifyRequest', 'model/BatchVerifyResponse', 'model/Error', 'model/SignRequest', 'model/SignRequestEx', 'model/SignResponse', 'model/VerifyRequest', 'model/VerifyRequestEx', 'model/VerifyResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/BatchSignRequest'), require('../model/BatchSignResponse'), require('../model/BatchVerifyRequest'), require('../model/BatchVerifyResponse'), require('../model/Error'), require('../model/SignRequest'), require('../model/SignRequestEx'), require('../model/SignResponse'), require('../model/VerifyRequest'), require('../model/VerifyRequestEx'), require('../model/VerifyResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SignAndVerifyApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.BatchSignRequest, root.FortanixSdkmsRestApi.BatchSignResponse, root.FortanixSdkmsRestApi.BatchVerifyRequest, root.FortanixSdkmsRestApi.BatchVerifyResponse, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.SignRequest, root.FortanixSdkmsRestApi.SignRequestEx, root.FortanixSdkmsRestApi.SignResponse, root.FortanixSdkmsRestApi.VerifyRequest, root.FortanixSdkmsRestApi.VerifyRequestEx, root.FortanixSdkmsRestApi.VerifyResponse);
  }
}(this, function(ApiClient, BatchSignRequest, BatchSignResponse, BatchVerifyRequest, BatchVerifyResponse, Error, SignRequest, SignRequestEx, SignResponse, VerifyRequest, VerifyRequestEx, VerifyResponse) {
  'use strict';

  /**
   * SignAndVerify service.
   * @module api/SignAndVerifyApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new SignAndVerifyApi. 
   * @alias module:api/SignAndVerifyApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the batchSign operation.
     * @callback module:api/SignAndVerifyApi~batchSignCallback
     * @param {String} error Error message, if any.
     * @param {module:model/BatchSignResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Batch sign with one or more private keys
     * The data to be signed and the key ids to be used are provided in the request body. The signature is returned in the response body. The ordering of the body matches the ordering of the request. An individual status code is returned for each batch item. Maximum size of the entire batch request is 512 KB. 
     * @param {module:model/BatchSignRequest} body Batch Sign request
     * @param {module:api/SignAndVerifyApi~batchSignCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/BatchSignResponse}
     */
    this.batchSign = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling batchSign");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = BatchSignResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/batch/sign', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the batchVerify operation.
     * @callback module:api/SignAndVerifyApi~batchVerifyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/BatchVerifyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Batch verify with one or more private keys
     * The signature to be verified and the key ids to be used are provided in the request body. The result (true of false) returned in the response body. The ordering of the body matches the ordering of the request. An individual status code is returned for each batch item. Maximum size of the entire batch request is 512 KB. 
     * @param {module:model/BatchVerifyRequest} body Batch Verify request
     * @param {module:api/SignAndVerifyApi~batchVerifyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/BatchVerifyResponse}
     */
    this.batchVerify = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling batchVerify");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = BatchVerifyResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/batch/verify', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the sign operation.
     * @callback module:api/SignAndVerifyApi~signCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SignResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Sign with a private key
     * Sign data with a private key. The signing key must be an asymmetric key with the private part present. The sign operation must be enabled for this key. Symmetric keys  may not be used to sign data. They can be used with the computeMac and verifyMac methods. &lt;br&gt; The data must be hashed with a SHA-1 or SHA-2 family hash algorithm. 
     * @param {String} keyId kid of security object
     * @param {module:model/SignRequest} body Signature request
     * @param {module:api/SignAndVerifyApi~signCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SignResponse}
     */
    this.sign = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling sign");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling sign");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = SignResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/sign', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the signEx operation.
     * @callback module:api/SignAndVerifyApi~signExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SignResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Sign with a private key
     * Sign data with a private key. The signing key must be an asymmetric key with the private part present. The sign operation must be enabled for this key. Symmetric keys  may not be used to sign data. They can be used with the computeMac and verifyMac methods. &lt;br&gt; The data must be hashed with a SHA-1 or SHA-2 family hash algorithm. 
     * @param {module:model/SignRequestEx} body Signature request
     * @param {module:api/SignAndVerifyApi~signExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SignResponse}
     */
    this.signEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling signEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = SignResponse;

      return this.apiClient.callApi(
        '/crypto/v1/sign', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the verify operation.
     * @callback module:api/SignAndVerifyApi~verifyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/VerifyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Verify a signature with a key
     * Verify a signature with a public key. The verifying key must be an asymmetric key with the verify operation enabled. Symmetric keys may not be used to verify data. They can be used with the computeMac and verifyMac operations. &lt;br&gt; The signature must have been created with a SHA-1 or SHA-2 family hash algorithm. 
     * @param {String} keyId kid of security object
     * @param {module:model/VerifyRequest} body Verification request
     * @param {module:api/SignAndVerifyApi~verifyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/VerifyResponse}
     */
    this.verify = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling verify");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling verify");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = VerifyResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/verify', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the verifyEx operation.
     * @callback module:api/SignAndVerifyApi~verifyExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/VerifyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Verify a signature with a key
     * Verify a signature with a public key. The verifying key must be an asymmetric key with the verify operation enabled. Symmetric keys may not be used to verify data. They can be used with the computeMac and verifyMac operations. &lt;br&gt; The signature must have been created with a SHA-1 or SHA-2 family hash algorithm. 
     * @param {module:model/VerifyRequestEx} body Verification request
     * @param {module:api/SignAndVerifyApi~verifyExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/VerifyResponse}
     */
    this.verifyEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling verifyEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = VerifyResponse;

      return this.apiClient.callApi(
        '/crypto/v1/verify', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/BatchSignRequest":64,"../model/BatchSignResponse":65,"../model/BatchVerifyRequest":67,"../model/BatchVerifyResponse":68,"../model/Error":108,"../model/SignRequest":159,"../model/SignRequestEx":160,"../model/SignResponse":161,"../model/VerifyRequest":194,"../model/VerifyRequestEx":195,"../model/VerifyResponse":196}],30:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Error', 'model/MfaChallenge', 'model/RecoveryCodes'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Error'), require('../model/MfaChallenge'), require('../model/RecoveryCodes'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.TwoFactorAuthenticationApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.MfaChallenge, root.FortanixSdkmsRestApi.RecoveryCodes);
  }
}(this, function(ApiClient, Error, MfaChallenge, RecoveryCodes) {
  'use strict';

  /**
   * TwoFactorAuthentication service.
   * @module api/TwoFactorAuthenticationApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new TwoFactorAuthenticationApi. 
   * @alias module:api/TwoFactorAuthenticationApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the authorizeRecoveryCode operation.
     * @callback module:api/TwoFactorAuthenticationApi~authorizeRecoveryCodeCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Use a backup recovery code to complete authentication
     * Complete two factor authentication with a backup recovery code. The caller needs to provide a bearer token for the session in the request body. Each recovery code may only be used once, so users should update their two factor configuration after using this API. 
     * @param {module:api/TwoFactorAuthenticationApi~authorizeRecoveryCodeCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.authorizeRecoveryCode = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/session/auth/2fa/recovery_code', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the authorizeU2F operation.
     * @callback module:api/TwoFactorAuthenticationApi~authorizeU2FCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Use a U2F key to complete authentication
     * Complete two factor authentication with a U2F authentication token to authenticate to SDKMS. The response body contains a bearer authentication token which needs to be provided by subsequent calls for the duration of the session. 
     * @param {module:api/TwoFactorAuthenticationApi~authorizeU2FCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.authorizeU2F = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['basicAuth'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/session/auth/2fa/u2f', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the generateRecoveryCodes operation.
     * @callback module:api/TwoFactorAuthenticationApi~generateRecoveryCodesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/RecoveryCodes} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Generate backup recovery codes for the current user
     * Generate backup recovery codes that may be used to complete complete two factor authentication. The caller needs to provide a bearer token for the session in the request body. Two factor configuration must be unlocked to use this API. 
     * @param {module:api/TwoFactorAuthenticationApi~generateRecoveryCodesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/RecoveryCodes}
     */
    this.generateRecoveryCodes = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = RecoveryCodes;

      return this.apiClient.callApi(
        '/sys/v1/users/generate_recovery_code', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the generateU2FChallenge operation.
     * @callback module:api/TwoFactorAuthenticationApi~generateU2FChallengeCallback
     * @param {String} error Error message, if any.
     * @param {module:model/MfaChallenge} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Generate a new challenge for registering a U2F devices
     * Generate a new challenge that may be used to register U2F devices. The caller needs to provide a bearer token for the session in the request body. 
     * @param {module:api/TwoFactorAuthenticationApi~generateU2FChallengeCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/MfaChallenge}
     */
    this.generateU2FChallenge = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = MfaChallenge;

      return this.apiClient.callApi(
        '/sys/v1/session/config_2fa/new_challenge', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the lock2F operation.
     * @callback module:api/TwoFactorAuthenticationApi~lock2FCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Lock two factor configuration
     * Lock two factor configuration after completing two factor reconfiguration. The caller needs to provide a bearer token for the session in the request body. If this API is not called, two factor configuration will be locked automatically after ten minutes. 
     * @param {module:api/TwoFactorAuthenticationApi~lock2FCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.lock2F = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/session/config_2fa/terminate', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/Error":108,"../model/MfaChallenge":127,"../model/RecoveryCodes":144}],31:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/ConfirmEmailRequest', 'model/ConfirmEmailResponse', 'model/Error', 'model/ForgotPasswordRequest', 'model/PasswordChangeRequest', 'model/PasswordResetRequest', 'model/ProcessInviteRequest', 'model/SignupRequest', 'model/User', 'model/UserAccountMap', 'model/UserRequest', 'model/ValidateTokenRequest', 'model/ValidateTokenResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/ConfirmEmailRequest'), require('../model/ConfirmEmailResponse'), require('../model/Error'), require('../model/ForgotPasswordRequest'), require('../model/PasswordChangeRequest'), require('../model/PasswordResetRequest'), require('../model/ProcessInviteRequest'), require('../model/SignupRequest'), require('../model/User'), require('../model/UserAccountMap'), require('../model/UserRequest'), require('../model/ValidateTokenRequest'), require('../model/ValidateTokenResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.UsersApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.ConfirmEmailRequest, root.FortanixSdkmsRestApi.ConfirmEmailResponse, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.ForgotPasswordRequest, root.FortanixSdkmsRestApi.PasswordChangeRequest, root.FortanixSdkmsRestApi.PasswordResetRequest, root.FortanixSdkmsRestApi.ProcessInviteRequest, root.FortanixSdkmsRestApi.SignupRequest, root.FortanixSdkmsRestApi.User, root.FortanixSdkmsRestApi.UserAccountMap, root.FortanixSdkmsRestApi.UserRequest, root.FortanixSdkmsRestApi.ValidateTokenRequest, root.FortanixSdkmsRestApi.ValidateTokenResponse);
  }
}(this, function(ApiClient, ConfirmEmailRequest, ConfirmEmailResponse, Error, ForgotPasswordRequest, PasswordChangeRequest, PasswordResetRequest, ProcessInviteRequest, SignupRequest, User, UserAccountMap, UserRequest, ValidateTokenRequest, ValidateTokenResponse) {
  'use strict';

  /**
   * Users service.
   * @module api/UsersApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new UsersApi. 
   * @alias module:api/UsersApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the changePassword operation.
     * @callback module:api/UsersApi~changePasswordCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Change user password
     * @param {module:model/PasswordChangeRequest} body Password change request
     * @param {module:api/UsersApi~changePasswordCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.changePassword = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling changePassword");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/users/change_password', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the confirmEmail operation.
     * @callback module:api/UsersApi~confirmEmailCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ConfirmEmailResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Confirms user&#39;s email address
     * @param {String} userId User Identifier
     * @param {module:model/ConfirmEmailRequest} body Validate user&#39;s email
     * @param {module:api/UsersApi~confirmEmailCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ConfirmEmailResponse}
     */
    this.confirmEmail = function(userId, body, callback) {
      var postBody = body;

      // verify the required parameter 'userId' is set
      if (userId === undefined || userId === null) {
        throw new Error("Missing the required parameter 'userId' when calling confirmEmail");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling confirmEmail");
      }


      var pathParams = {
        'user-id': userId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = ConfirmEmailResponse;

      return this.apiClient.callApi(
        '/sys/v1/users/{user-id}/confirm_email', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the createUser operation.
     * @callback module:api/UsersApi~createUserCallback
     * @param {String} error Error message, if any.
     * @param {module:model/User} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a new user
     * Signs up a new user.
     * @param {module:model/SignupRequest} body Email address of user
     * @param {module:api/UsersApi~createUserCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/User}
     */
    this.createUser = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling createUser");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = User;

      return this.apiClient.callApi(
        '/sys/v1/users', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteUser operation.
     * @callback module:api/UsersApi~deleteUserCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Removed user&#39;s association with an account
     * @param {String} userId User Identifier
     * @param {module:api/UsersApi~deleteUserCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteUser = function(userId, callback) {
      var postBody = null;

      // verify the required parameter 'userId' is set
      if (userId === undefined || userId === null) {
        throw new Error("Missing the required parameter 'userId' when calling deleteUser");
      }


      var pathParams = {
        'user-id': userId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/users/{user-id}/account', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteUserAccount operation.
     * @callback module:api/UsersApi~deleteUserAccountCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Completely delete a user profile from system
     * Completely deletes the currently logged in user from the system.
     * @param {module:api/UsersApi~deleteUserAccountCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteUserAccount = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/users', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the forgotPassword operation.
     * @callback module:api/UsersApi~forgotPasswordCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Initiate password reset sequence for a user
     * @param {module:model/ForgotPasswordRequest} body Initiate forgot password sequrence
     * @param {module:api/UsersApi~forgotPasswordCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.forgotPassword = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling forgotPassword");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/users/forgot_password', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getUser operation.
     * @callback module:api/UsersApi~getUserCallback
     * @param {String} error Error message, if any.
     * @param {module:model/User} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a specific user
     * @param {String} userId User Identifier
     * @param {module:api/UsersApi~getUserCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/User}
     */
    this.getUser = function(userId, callback) {
      var postBody = null;

      // verify the required parameter 'userId' is set
      if (userId === undefined || userId === null) {
        throw new Error("Missing the required parameter 'userId' when calling getUser");
      }


      var pathParams = {
        'user-id': userId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = User;

      return this.apiClient.callApi(
        '/sys/v1/users/{user-id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getUserAccount operation.
     * @callback module:api/UsersApi~getUserAccountCallback
     * @param {String} error Error message, if any.
     * @param {module:model/UserAccountMap} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get account information for the user
     * Obtain the current user&#39;s account information.
     * @param {module:api/UsersApi~getUserAccountCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/UserAccountMap}
     */
    this.getUserAccount = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = UserAccountMap;

      return this.apiClient.callApi(
        '/sys/v1/users/accounts', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getUsers operation.
     * @callback module:api/UsersApi~getUsersCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/User>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all users
     * @param {Object} opts Optional parameters
     * @param {String} opts.groupId Only retrieve users in the specified group.
     * @param {String} opts.sort This specifies the property (&#x60;user_id&#x60; only, for now) and order (ascending or descending) with which to sort the users. By default, users are sorted by &#x60;user_id&#x60; in ascending order. The syntax is \&quot;&lt;property&gt;:[asc|desc]\&quot; (e.g. \&quot;user_id:desc\&quot;) or just \&quot;&lt;property&gt;\&quot; (ascending order by default). 
     * @param {String} opts.start If provided, this must be a value of the property specified in &#x60;sort&#x60;. Returned users will begin just above or just below this value (for asc/desc order resp.). 
     * @param {Number} opts.limit Maximum number of users to return. If not provided, the limit is 100.
     * @param {Number} opts.offset Number of users past &#x60;start&#x60; to skip.
     * @param {module:api/UsersApi~getUsersCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/User>}
     */
    this.getUsers = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'group_id': opts['groupId'],
        'sort': opts['sort'],
        'start': opts['start'],
        'limit': opts['limit'],
        'offset': opts['offset'],
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = [User];

      return this.apiClient.callApi(
        '/sys/v1/users', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the inviteUser operation.
     * @callback module:api/UsersApi~inviteUserCallback
     * @param {String} error Error message, if any.
     * @param {module:model/User} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Invite a user
     * Invite an existing user or new user to join an existing account. Only user email is required for invite API 
     * @param {module:model/UserRequest} body Name of user
     * @param {module:api/UsersApi~inviteUserCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/User}
     */
    this.inviteUser = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling inviteUser");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = User;

      return this.apiClient.callApi(
        '/sys/v1/users/invite', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the processInvitations operation.
     * @callback module:api/UsersApi~processInvitationsCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Process a user&#39;s pending account invitations
     * Process a user&#39;s pending invitations. It does both accepts and rejects.
     * @param {module:model/ProcessInviteRequest} body Process account invitation (both accetps and rejects)
     * @param {module:api/UsersApi~processInvitationsCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.processInvitations = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling processInvitations");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/users/process_invite', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the resendConfirmEmail operation.
     * @callback module:api/UsersApi~resendConfirmEmailCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Resend email with link to confirm user&#39;s email address
     * @param {String} userId User Identifier
     * @param {module:api/UsersApi~resendConfirmEmailCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.resendConfirmEmail = function(userId, callback) {
      var postBody = null;

      // verify the required parameter 'userId' is set
      if (userId === undefined || userId === null) {
        throw new Error("Missing the required parameter 'userId' when calling resendConfirmEmail");
      }


      var pathParams = {
        'user-id': userId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/users/{user-id}/resend_confirm_email', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the resendInvitation operation.
     * @callback module:api/UsersApi~resendInvitationCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Resend invite to the user to join a specific account
     * @param {String} userId User Identifier
     * @param {module:api/UsersApi~resendInvitationCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.resendInvitation = function(userId, callback) {
      var postBody = null;

      // verify the required parameter 'userId' is set
      if (userId === undefined || userId === null) {
        throw new Error("Missing the required parameter 'userId' when calling resendInvitation");
      }


      var pathParams = {
        'user-id': userId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/users/{user-id}/resend_invite', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the resetPassword operation.
     * @callback module:api/UsersApi~resetPasswordCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Reset a user&#39;s password
     * Resetting a user&#39;s password. User must have a valid reset token from forgot password step.
     * @param {String} userId User Identifier
     * @param {module:model/PasswordResetRequest} body Reset password
     * @param {module:api/UsersApi~resetPasswordCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.resetPassword = function(userId, body, callback) {
      var postBody = body;

      // verify the required parameter 'userId' is set
      if (userId === undefined || userId === null) {
        throw new Error("Missing the required parameter 'userId' when calling resetPassword");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling resetPassword");
      }


      var pathParams = {
        'user-id': userId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/sys/v1/users/{user-id}/reset_password', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateUser operation.
     * @callback module:api/UsersApi~updateUserCallback
     * @param {String} error Error message, if any.
     * @param {module:model/User} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update user
     * Change a user&#39;s properties.
     * @param {String} userId User Identifier
     * @param {module:model/UserRequest} body Name of user
     * @param {module:api/UsersApi~updateUserCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/User}
     */
    this.updateUser = function(userId, body, callback) {
      var postBody = body;

      // verify the required parameter 'userId' is set
      if (userId === undefined || userId === null) {
        throw new Error("Missing the required parameter 'userId' when calling updateUser");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling updateUser");
      }


      var pathParams = {
        'user-id': userId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = User;

      return this.apiClient.callApi(
        '/sys/v1/users/{user-id}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the validatePasswordResetToken operation.
     * @callback module:api/UsersApi~validatePasswordResetTokenCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ValidateTokenResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Validates password reset token for the user
     * @param {String} userId User Identifier
     * @param {module:model/ValidateTokenRequest} body Validate token
     * @param {module:api/UsersApi~validatePasswordResetTokenCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ValidateTokenResponse}
     */
    this.validatePasswordResetToken = function(userId, body, callback) {
      var postBody = body;

      // verify the required parameter 'userId' is set
      if (userId === undefined || userId === null) {
        throw new Error("Missing the required parameter 'userId' when calling validatePasswordResetToken");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling validatePasswordResetToken");
      }


      var pathParams = {
        'user-id': userId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = ValidateTokenResponse;

      return this.apiClient.callApi(
        '/sys/v1/users/{user-id}/validate_token', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/ConfirmEmailRequest":72,"../model/ConfirmEmailResponse":73,"../model/Error":108,"../model/ForgotPasswordRequest":109,"../model/PasswordChangeRequest":134,"../model/PasswordResetRequest":135,"../model/ProcessInviteRequest":143,"../model/SignupRequest":163,"../model/User":184,"../model/UserAccountMap":186,"../model/UserRequest":189,"../model/ValidateTokenRequest":192,"../model/ValidateTokenResponse":193}],32:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Error', 'model/KeyObject', 'model/UnwrapKeyRequest', 'model/UnwrapKeyRequestEx', 'model/WrapKeyRequest', 'model/WrapKeyRequestEx', 'model/WrapKeyResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Error'), require('../model/KeyObject'), require('../model/UnwrapKeyRequest'), require('../model/UnwrapKeyRequestEx'), require('../model/WrapKeyRequest'), require('../model/WrapKeyRequestEx'), require('../model/WrapKeyResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.WrappingAndUnwrappingApi = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.Error, root.FortanixSdkmsRestApi.KeyObject, root.FortanixSdkmsRestApi.UnwrapKeyRequest, root.FortanixSdkmsRestApi.UnwrapKeyRequestEx, root.FortanixSdkmsRestApi.WrapKeyRequest, root.FortanixSdkmsRestApi.WrapKeyRequestEx, root.FortanixSdkmsRestApi.WrapKeyResponse);
  }
}(this, function(ApiClient, Error, KeyObject, UnwrapKeyRequest, UnwrapKeyRequestEx, WrapKeyRequest, WrapKeyRequestEx, WrapKeyResponse) {
  'use strict';

  /**
   * WrappingAndUnwrapping service.
   * @module api/WrappingAndUnwrappingApi
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new WrappingAndUnwrappingApi. 
   * @alias module:api/WrappingAndUnwrappingApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the unwrapKey operation.
     * @callback module:api/WrappingAndUnwrappingApi~unwrapKeyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Unwrap a security object with a key
     * Unwrap (decrypt) a wrapped key and import it into SDKMS. This allows securely importing into SDKMS security objects that were previously wrapped by SDKMS or another key management system. A new security object will be created in SDKMS with the unwrapped data. &lt;br&gt; The key-id parameter in the URL specifies the key that will be used to unwrap the other security object. This key must have the unwrapkey operation enabled. &lt;br&gt; The alg and mode parameters specify the encryption algorithm and cipher mode being used by the unwrapping key. The obj_type parameter specifies the object type of the security object being unwrapped. The size or elliptic curve of the object being unwrapped does not need to be specified. 
     * @param {String} keyId kid of security object
     * @param {module:model/UnwrapKeyRequest} body Unwrap key request
     * @param {module:api/WrappingAndUnwrappingApi~unwrapKeyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.unwrapKey = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling unwrapKey");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling unwrapKey");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/unwrapkey', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the unwrapKeyEx operation.
     * @callback module:api/WrappingAndUnwrappingApi~unwrapKeyExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/KeyObject} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Unwrap a security object with a key
     * Unwrap (decrypt) a wrapped key and import it into SDKMS. This allows securely importing into SDKMS security objects that were previously wrapped by SDKMS or another key management system. A new security object will be created in SDKMS with the unwrapped data. &lt;br&gt; The key-id parameter in the URL specifies the key that will be used to unwrap the other security object. This key must have the unwrapkey operation enabled. &lt;br&gt; The alg and mode parameters specify the encryption algorithm and cipher mode being used by the unwrapping key. The obj_type parameter specifies the object type of the security object being unwrapped. The size or elliptic curve of the object being unwrapped does not need to be specified. 
     * @param {module:model/UnwrapKeyRequestEx} body Unwrap key request
     * @param {module:api/WrappingAndUnwrappingApi~unwrapKeyExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/KeyObject}
     */
    this.unwrapKeyEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling unwrapKeyEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = KeyObject;

      return this.apiClient.callApi(
        '/crypto/v1/unwrapkey', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the wrapKey operation.
     * @callback module:api/WrappingAndUnwrappingApi~wrapKeyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/WrapKeyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Wrap a security object with a key 
     * Wrap (encrypt) an existing security object with a key. This allows keys to be securely exported from SDKMS so they can be later imported into SDKMS or another key management system. &lt;br&gt; The key-id parameter in the URL specifies the key that will be used to wrap the other security object. The security object being wrapped is specified inside of the request body. &lt;br&gt; The alg and mode parameters specify the encryption algorithm and cipher mode being used for the wrapping key. The algorithm of the key being wrapped is not provided to this API call. &lt;br&gt; The key being wrapped must have the export operation enabled. The wrapping key must have the wrapkey operation enabled. &lt;br&gt; The following wrapping operations are supported:   * Symmetric keys, HMAC keys, opaque objects, and secret objects may be wrapped with symmetric or asymmetric keys.   * Asymmetric keys may be wrapped with symmetric keys. Wrapping an asymmetric key with an asymmetric key is not supported.  When wrapping with an asymmetric key, the wrapped object size must fit as plaintext for the wrapping key size and algorithm. 
     * @param {String} keyId kid of security object
     * @param {module:model/WrapKeyRequest} body Wrap key request
     * @param {module:api/WrappingAndUnwrappingApi~wrapKeyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/WrapKeyResponse}
     */
    this.wrapKey = function(keyId, body, callback) {
      var postBody = body;

      // verify the required parameter 'keyId' is set
      if (keyId === undefined || keyId === null) {
        throw new Error("Missing the required parameter 'keyId' when calling wrapKey");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling wrapKey");
      }


      var pathParams = {
        'key-id': keyId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = WrapKeyResponse;

      return this.apiClient.callApi(
        '/crypto/v1/keys/{key-id}/wrapkey', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the wrapKeyEx operation.
     * @callback module:api/WrappingAndUnwrappingApi~wrapKeyExCallback
     * @param {String} error Error message, if any.
     * @param {module:model/WrapKeyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Wrap a security object with a key 
     * Wrap (encrypt) an existing security object with a key. This allows keys to be securely exported from SDKMS so they can be later imported into SDKMS or another key management system. &lt;br&gt; The key-id parameter in the URL specifies the key that will be used to wrap the other security object. The security object being wrapped is specified inside of the request body. &lt;br&gt; The alg and mode parameters specify the encryption algorithm and cipher mode being used for the wrapping key. The algorithm of the key being wrapped is not provided to this API call. &lt;br&gt; The key being wrapped must have the export operation enabled. The wrapping key must have the wrapkey operation enabled. &lt;br&gt; The following wrapping operations are supported:   * Symmetric keys, HMAC keys, opaque objects, and secret objects may be wrapped with symmetric or asymmetric keys.   * Asymmetric keys may be wrapped with symmetric keys. Wrapping an asymmetric key with an asymmetric key is not supported.  When wrapping with an asymmetric key, the wrapped object size must fit as plaintext for the wrapping key size and algorithm. 
     * @param {module:model/WrapKeyRequestEx} body Wrap key request
     * @param {module:api/WrappingAndUnwrappingApi~wrapKeyExCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/WrapKeyResponse}
     */
    this.wrapKeyEx = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling wrapKeyEx");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['bearerToken'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = WrapKeyResponse;

      return this.apiClient.callApi(
        '/crypto/v1/wrapkey', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":18,"../model/Error":108,"../model/KeyObject":116,"../model/UnwrapKeyRequest":182,"../model/UnwrapKeyRequestEx":183,"../model/WrapKeyRequest":198,"../model/WrapKeyRequestEx":199,"../model/WrapKeyResponse":200}],33:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/ADDecryptInput', 'model/ADEncryptInput', 'model/Account', 'model/AccountRequest', 'model/AccountState', 'model/AgreeKeyMechanism', 'model/AgreeKeyRequest', 'model/App', 'model/AppAuthType', 'model/AppCredential', 'model/AppCredentialResponse', 'model/AppRequest', 'model/ApprovableResult', 'model/ApprovalRequest', 'model/ApprovalRequestRequest', 'model/ApprovalStatus', 'model/ApprovalSubject', 'model/AuditLogResponse', 'model/AuthConfig', 'model/AuthConfigPassword', 'model/AuthResponse', 'model/AuthType', 'model/BatchDecryptRequest', 'model/BatchDecryptRequestInner', 'model/BatchDecryptResponse', 'model/BatchDecryptResponseInner', 'model/BatchEncryptRequest', 'model/BatchEncryptRequestInner', 'model/BatchEncryptResponse', 'model/BatchEncryptResponseInner', 'model/BatchSignRequest', 'model/BatchSignResponse', 'model/BatchSignResponseInner', 'model/BatchVerifyRequest', 'model/BatchVerifyResponse', 'model/BatchVerifyResponseInner', 'model/CaConfig', 'model/CipherMode', 'model/ConfirmEmailRequest', 'model/ConfirmEmailResponse', 'model/CreatorType', 'model/CryptMode', 'model/DecryptFinalRequest', 'model/DecryptFinalRequestEx', 'model/DecryptFinalResponse', 'model/DecryptInitRequest', 'model/DecryptInitRequestEx', 'model/DecryptInitResponse', 'model/DecryptRequest', 'model/DecryptRequestEx', 'model/DecryptResponse', 'model/DecryptUpdateRequest', 'model/DecryptUpdateRequestEx', 'model/DecryptUpdateResponse', 'model/DeriveKeyMechanism', 'model/DeriveKeyRequest', 'model/DeriveKeyRequestEx', 'model/DigestAlgorithm', 'model/DigestRequest', 'model/DigestResponse', 'model/EllipticCurve', 'model/EncryptFinalRequest', 'model/EncryptFinalRequestEx', 'model/EncryptFinalResponse', 'model/EncryptInitRequest', 'model/EncryptInitRequestEx', 'model/EncryptInitResponse', 'model/EncryptRequest', 'model/EncryptRequestEx', 'model/EncryptResponse', 'model/EncryptUpdateRequest', 'model/EncryptUpdateRequestEx', 'model/EncryptUpdateResponse', 'model/Entity', 'model/Error', 'model/ForgotPasswordRequest', 'model/GoogleServiceAccountKey', 'model/Group', 'model/GroupRequest', 'model/IVDecryptInput', 'model/IVEncryptInput', 'model/IVEncryptOutput', 'model/KeyObject', 'model/KeyOperations', 'model/Language', 'model/LoggingConfig', 'model/LoggingConfigRequest', 'model/MacGenerateRequest', 'model/MacGenerateRequestEx', 'model/MacGenerateResponse', 'model/MacVerifyRequest', 'model/MacVerifyRequestEx', 'model/MacVerifyResponse', 'model/MfaChallenge', 'model/Mgf', 'model/MgfMgf1', 'model/NotificationPref', 'model/ObjectDigestRequest', 'model/ObjectOrigin', 'model/ObjectType', 'model/PasswordChangeRequest', 'model/PasswordResetRequest', 'model/PersistTransientKeyRequest', 'model/Plugin', 'model/PluginInvokeRequest', 'model/PluginInvokeResponse', 'model/PluginRequest', 'model/PluginSource', 'model/PluginType', 'model/ProcessInviteRequest', 'model/RecoveryCodes', 'model/RsaEncryptionPadding', 'model/RsaEncryptionPaddingOAEP', 'model/RsaEncryptionPolicy', 'model/RsaEncryptionPolicyPadding', 'model/RsaEncryptionPolicyPaddingOAEP', 'model/RsaEncryptionPolicyPaddingOAEPMgf1', 'model/RsaOptions', 'model/RsaSignaturePadding', 'model/RsaSignaturePaddingPSS', 'model/RsaSignaturePolicy', 'model/RsaSignaturePolicyPadding', 'model/SelectAccountRequest', 'model/SelectAccountResponse', 'model/ServerMode', 'model/SignRequest', 'model/SignRequestEx', 'model/SignResponse', 'model/SignatureMode', 'model/SignupRequest', 'model/SobjectDescriptor', 'model/SobjectRequest', 'model/SplunkLoggingConfig', 'model/SplunkLoggingConfigRequest', 'model/StackdriverLoggingConfig', 'model/StackdriverLoggingConfigRequest', 'model/SubscriptionChangeRequest', 'model/SubscriptionType', 'model/TagDecryptInput', 'model/TagEncryptOutput', 'model/TagLenEncryptInput', 'model/TlsConfig', 'model/TlsMode', 'model/U2fAddDeviceRequest', 'model/U2fDelDeviceRequest', 'model/U2fDevice', 'model/U2fKey', 'model/U2fRenameDeviceRequest', 'model/UnwrapKeyRequest', 'model/UnwrapKeyRequestEx', 'model/User', 'model/UserAccountFlags', 'model/UserAccountMap', 'model/UserGroup', 'model/UserGroupFlags', 'model/UserRequest', 'model/UserState', 'model/Uuid', 'model/ValidateTokenRequest', 'model/ValidateTokenResponse', 'model/VerifyRequest', 'model/VerifyRequestEx', 'model/VerifyResponse', 'model/VersionResponse', 'model/WrapKeyRequest', 'model/WrapKeyRequestEx', 'model/WrapKeyResponse', 'api/AccountsApi', 'api/ApprovalRequestsApi', 'api/AppsApi', 'api/AuthenticationApi', 'api/DigestApi', 'api/EncryptionAndDecryptionApi', 'api/GroupsApi', 'api/LogsApi', 'api/PluginsApi', 'api/SecurityObjectsApi', 'api/SignAndVerifyApi', 'api/TwoFactorAuthenticationApi', 'api/UsersApi', 'api/WrappingAndUnwrappingApi'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('./ApiClient'), require('./model/ADDecryptInput'), require('./model/ADEncryptInput'), require('./model/Account'), require('./model/AccountRequest'), require('./model/AccountState'), require('./model/AgreeKeyMechanism'), require('./model/AgreeKeyRequest'), require('./model/App'), require('./model/AppAuthType'), require('./model/AppCredential'), require('./model/AppCredentialResponse'), require('./model/AppRequest'), require('./model/ApprovableResult'), require('./model/ApprovalRequest'), require('./model/ApprovalRequestRequest'), require('./model/ApprovalStatus'), require('./model/ApprovalSubject'), require('./model/AuditLogResponse'), require('./model/AuthConfig'), require('./model/AuthConfigPassword'), require('./model/AuthResponse'), require('./model/AuthType'), require('./model/BatchDecryptRequest'), require('./model/BatchDecryptRequestInner'), require('./model/BatchDecryptResponse'), require('./model/BatchDecryptResponseInner'), require('./model/BatchEncryptRequest'), require('./model/BatchEncryptRequestInner'), require('./model/BatchEncryptResponse'), require('./model/BatchEncryptResponseInner'), require('./model/BatchSignRequest'), require('./model/BatchSignResponse'), require('./model/BatchSignResponseInner'), require('./model/BatchVerifyRequest'), require('./model/BatchVerifyResponse'), require('./model/BatchVerifyResponseInner'), require('./model/CaConfig'), require('./model/CipherMode'), require('./model/ConfirmEmailRequest'), require('./model/ConfirmEmailResponse'), require('./model/CreatorType'), require('./model/CryptMode'), require('./model/DecryptFinalRequest'), require('./model/DecryptFinalRequestEx'), require('./model/DecryptFinalResponse'), require('./model/DecryptInitRequest'), require('./model/DecryptInitRequestEx'), require('./model/DecryptInitResponse'), require('./model/DecryptRequest'), require('./model/DecryptRequestEx'), require('./model/DecryptResponse'), require('./model/DecryptUpdateRequest'), require('./model/DecryptUpdateRequestEx'), require('./model/DecryptUpdateResponse'), require('./model/DeriveKeyMechanism'), require('./model/DeriveKeyRequest'), require('./model/DeriveKeyRequestEx'), require('./model/DigestAlgorithm'), require('./model/DigestRequest'), require('./model/DigestResponse'), require('./model/EllipticCurve'), require('./model/EncryptFinalRequest'), require('./model/EncryptFinalRequestEx'), require('./model/EncryptFinalResponse'), require('./model/EncryptInitRequest'), require('./model/EncryptInitRequestEx'), require('./model/EncryptInitResponse'), require('./model/EncryptRequest'), require('./model/EncryptRequestEx'), require('./model/EncryptResponse'), require('./model/EncryptUpdateRequest'), require('./model/EncryptUpdateRequestEx'), require('./model/EncryptUpdateResponse'), require('./model/Entity'), require('./model/Error'), require('./model/ForgotPasswordRequest'), require('./model/GoogleServiceAccountKey'), require('./model/Group'), require('./model/GroupRequest'), require('./model/IVDecryptInput'), require('./model/IVEncryptInput'), require('./model/IVEncryptOutput'), require('./model/KeyObject'), require('./model/KeyOperations'), require('./model/Language'), require('./model/LoggingConfig'), require('./model/LoggingConfigRequest'), require('./model/MacGenerateRequest'), require('./model/MacGenerateRequestEx'), require('./model/MacGenerateResponse'), require('./model/MacVerifyRequest'), require('./model/MacVerifyRequestEx'), require('./model/MacVerifyResponse'), require('./model/MfaChallenge'), require('./model/Mgf'), require('./model/MgfMgf1'), require('./model/NotificationPref'), require('./model/ObjectDigestRequest'), require('./model/ObjectOrigin'), require('./model/ObjectType'), require('./model/PasswordChangeRequest'), require('./model/PasswordResetRequest'), require('./model/PersistTransientKeyRequest'), require('./model/Plugin'), require('./model/PluginInvokeRequest'), require('./model/PluginInvokeResponse'), require('./model/PluginRequest'), require('./model/PluginSource'), require('./model/PluginType'), require('./model/ProcessInviteRequest'), require('./model/RecoveryCodes'), require('./model/RsaEncryptionPadding'), require('./model/RsaEncryptionPaddingOAEP'), require('./model/RsaEncryptionPolicy'), require('./model/RsaEncryptionPolicyPadding'), require('./model/RsaEncryptionPolicyPaddingOAEP'), require('./model/RsaEncryptionPolicyPaddingOAEPMgf1'), require('./model/RsaOptions'), require('./model/RsaSignaturePadding'), require('./model/RsaSignaturePaddingPSS'), require('./model/RsaSignaturePolicy'), require('./model/RsaSignaturePolicyPadding'), require('./model/SelectAccountRequest'), require('./model/SelectAccountResponse'), require('./model/ServerMode'), require('./model/SignRequest'), require('./model/SignRequestEx'), require('./model/SignResponse'), require('./model/SignatureMode'), require('./model/SignupRequest'), require('./model/SobjectDescriptor'), require('./model/SobjectRequest'), require('./model/SplunkLoggingConfig'), require('./model/SplunkLoggingConfigRequest'), require('./model/StackdriverLoggingConfig'), require('./model/StackdriverLoggingConfigRequest'), require('./model/SubscriptionChangeRequest'), require('./model/SubscriptionType'), require('./model/TagDecryptInput'), require('./model/TagEncryptOutput'), require('./model/TagLenEncryptInput'), require('./model/TlsConfig'), require('./model/TlsMode'), require('./model/U2fAddDeviceRequest'), require('./model/U2fDelDeviceRequest'), require('./model/U2fDevice'), require('./model/U2fKey'), require('./model/U2fRenameDeviceRequest'), require('./model/UnwrapKeyRequest'), require('./model/UnwrapKeyRequestEx'), require('./model/User'), require('./model/UserAccountFlags'), require('./model/UserAccountMap'), require('./model/UserGroup'), require('./model/UserGroupFlags'), require('./model/UserRequest'), require('./model/UserState'), require('./model/Uuid'), require('./model/ValidateTokenRequest'), require('./model/ValidateTokenResponse'), require('./model/VerifyRequest'), require('./model/VerifyRequestEx'), require('./model/VerifyResponse'), require('./model/VersionResponse'), require('./model/WrapKeyRequest'), require('./model/WrapKeyRequestEx'), require('./model/WrapKeyResponse'), require('./api/AccountsApi'), require('./api/ApprovalRequestsApi'), require('./api/AppsApi'), require('./api/AuthenticationApi'), require('./api/DigestApi'), require('./api/EncryptionAndDecryptionApi'), require('./api/GroupsApi'), require('./api/LogsApi'), require('./api/PluginsApi'), require('./api/SecurityObjectsApi'), require('./api/SignAndVerifyApi'), require('./api/TwoFactorAuthenticationApi'), require('./api/UsersApi'), require('./api/WrappingAndUnwrappingApi'));
  }
}(function(ApiClient, ADDecryptInput, ADEncryptInput, Account, AccountRequest, AccountState, AgreeKeyMechanism, AgreeKeyRequest, App, AppAuthType, AppCredential, AppCredentialResponse, AppRequest, ApprovableResult, ApprovalRequest, ApprovalRequestRequest, ApprovalStatus, ApprovalSubject, AuditLogResponse, AuthConfig, AuthConfigPassword, AuthResponse, AuthType, BatchDecryptRequest, BatchDecryptRequestInner, BatchDecryptResponse, BatchDecryptResponseInner, BatchEncryptRequest, BatchEncryptRequestInner, BatchEncryptResponse, BatchEncryptResponseInner, BatchSignRequest, BatchSignResponse, BatchSignResponseInner, BatchVerifyRequest, BatchVerifyResponse, BatchVerifyResponseInner, CaConfig, CipherMode, ConfirmEmailRequest, ConfirmEmailResponse, CreatorType, CryptMode, DecryptFinalRequest, DecryptFinalRequestEx, DecryptFinalResponse, DecryptInitRequest, DecryptInitRequestEx, DecryptInitResponse, DecryptRequest, DecryptRequestEx, DecryptResponse, DecryptUpdateRequest, DecryptUpdateRequestEx, DecryptUpdateResponse, DeriveKeyMechanism, DeriveKeyRequest, DeriveKeyRequestEx, DigestAlgorithm, DigestRequest, DigestResponse, EllipticCurve, EncryptFinalRequest, EncryptFinalRequestEx, EncryptFinalResponse, EncryptInitRequest, EncryptInitRequestEx, EncryptInitResponse, EncryptRequest, EncryptRequestEx, EncryptResponse, EncryptUpdateRequest, EncryptUpdateRequestEx, EncryptUpdateResponse, Entity, Error, ForgotPasswordRequest, GoogleServiceAccountKey, Group, GroupRequest, IVDecryptInput, IVEncryptInput, IVEncryptOutput, KeyObject, KeyOperations, Language, LoggingConfig, LoggingConfigRequest, MacGenerateRequest, MacGenerateRequestEx, MacGenerateResponse, MacVerifyRequest, MacVerifyRequestEx, MacVerifyResponse, MfaChallenge, Mgf, MgfMgf1, NotificationPref, ObjectDigestRequest, ObjectOrigin, ObjectType, PasswordChangeRequest, PasswordResetRequest, PersistTransientKeyRequest, Plugin, PluginInvokeRequest, PluginInvokeResponse, PluginRequest, PluginSource, PluginType, ProcessInviteRequest, RecoveryCodes, RsaEncryptionPadding, RsaEncryptionPaddingOAEP, RsaEncryptionPolicy, RsaEncryptionPolicyPadding, RsaEncryptionPolicyPaddingOAEP, RsaEncryptionPolicyPaddingOAEPMgf1, RsaOptions, RsaSignaturePadding, RsaSignaturePaddingPSS, RsaSignaturePolicy, RsaSignaturePolicyPadding, SelectAccountRequest, SelectAccountResponse, ServerMode, SignRequest, SignRequestEx, SignResponse, SignatureMode, SignupRequest, SobjectDescriptor, SobjectRequest, SplunkLoggingConfig, SplunkLoggingConfigRequest, StackdriverLoggingConfig, StackdriverLoggingConfigRequest, SubscriptionChangeRequest, SubscriptionType, TagDecryptInput, TagEncryptOutput, TagLenEncryptInput, TlsConfig, TlsMode, U2fAddDeviceRequest, U2fDelDeviceRequest, U2fDevice, U2fKey, U2fRenameDeviceRequest, UnwrapKeyRequest, UnwrapKeyRequestEx, User, UserAccountFlags, UserAccountMap, UserGroup, UserGroupFlags, UserRequest, UserState, Uuid, ValidateTokenRequest, ValidateTokenResponse, VerifyRequest, VerifyRequestEx, VerifyResponse, VersionResponse, WrapKeyRequest, WrapKeyRequestEx, WrapKeyResponse, AccountsApi, ApprovalRequestsApi, AppsApi, AuthenticationApi, DigestApi, EncryptionAndDecryptionApi, GroupsApi, LogsApi, PluginsApi, SecurityObjectsApi, SignAndVerifyApi, TwoFactorAuthenticationApi, UsersApi, WrappingAndUnwrappingApi) {
  'use strict';

  /**
   * This_is_a_set_of_REST_APIs_for_accessing_the_Fortanix_Self_Defending_Key_Management_System__This_includes_APIs_for_managing_accounts_and_for_performing_cryptographic_and_key_management_operations_.<br>
   * The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
   * <p>
   * An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
   * <pre>
   * var FortanixSdkmsRestApi = require('index'); // See note below*.
   * var xxxSvc = new FortanixSdkmsRestApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyyModel = new FortanixSdkmsRestApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
   * and put the application logic within the callback function.</em>
   * </p>
   * <p>
   * A non-AMD browser application (discouraged) might do something like this:
   * <pre>
   * var xxxSvc = new FortanixSdkmsRestApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyy = new FortanixSdkmsRestApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * </p>
   * @module index
   * @version 1.0.0-20181004
   */
  var exports = {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient: ApiClient,
    /**
     * The ADDecryptInput model constructor.
     * @property {module:model/ADDecryptInput}
     */
    ADDecryptInput: ADDecryptInput,
    /**
     * The ADEncryptInput model constructor.
     * @property {module:model/ADEncryptInput}
     */
    ADEncryptInput: ADEncryptInput,
    /**
     * The Account model constructor.
     * @property {module:model/Account}
     */
    Account: Account,
    /**
     * The AccountRequest model constructor.
     * @property {module:model/AccountRequest}
     */
    AccountRequest: AccountRequest,
    /**
     * The AccountState model constructor.
     * @property {module:model/AccountState}
     */
    AccountState: AccountState,
    /**
     * The AgreeKeyMechanism model constructor.
     * @property {module:model/AgreeKeyMechanism}
     */
    AgreeKeyMechanism: AgreeKeyMechanism,
    /**
     * The AgreeKeyRequest model constructor.
     * @property {module:model/AgreeKeyRequest}
     */
    AgreeKeyRequest: AgreeKeyRequest,
    /**
     * The App model constructor.
     * @property {module:model/App}
     */
    App: App,
    /**
     * The AppAuthType model constructor.
     * @property {module:model/AppAuthType}
     */
    AppAuthType: AppAuthType,
    /**
     * The AppCredential model constructor.
     * @property {module:model/AppCredential}
     */
    AppCredential: AppCredential,
    /**
     * The AppCredentialResponse model constructor.
     * @property {module:model/AppCredentialResponse}
     */
    AppCredentialResponse: AppCredentialResponse,
    /**
     * The AppRequest model constructor.
     * @property {module:model/AppRequest}
     */
    AppRequest: AppRequest,
    /**
     * The ApprovableResult model constructor.
     * @property {module:model/ApprovableResult}
     */
    ApprovableResult: ApprovableResult,
    /**
     * The ApprovalRequest model constructor.
     * @property {module:model/ApprovalRequest}
     */
    ApprovalRequest: ApprovalRequest,
    /**
     * The ApprovalRequestRequest model constructor.
     * @property {module:model/ApprovalRequestRequest}
     */
    ApprovalRequestRequest: ApprovalRequestRequest,
    /**
     * The ApprovalStatus model constructor.
     * @property {module:model/ApprovalStatus}
     */
    ApprovalStatus: ApprovalStatus,
    /**
     * The ApprovalSubject model constructor.
     * @property {module:model/ApprovalSubject}
     */
    ApprovalSubject: ApprovalSubject,
    /**
     * The AuditLogResponse model constructor.
     * @property {module:model/AuditLogResponse}
     */
    AuditLogResponse: AuditLogResponse,
    /**
     * The AuthConfig model constructor.
     * @property {module:model/AuthConfig}
     */
    AuthConfig: AuthConfig,
    /**
     * The AuthConfigPassword model constructor.
     * @property {module:model/AuthConfigPassword}
     */
    AuthConfigPassword: AuthConfigPassword,
    /**
     * The AuthResponse model constructor.
     * @property {module:model/AuthResponse}
     */
    AuthResponse: AuthResponse,
    /**
     * The AuthType model constructor.
     * @property {module:model/AuthType}
     */
    AuthType: AuthType,
    /**
     * The BatchDecryptRequest model constructor.
     * @property {module:model/BatchDecryptRequest}
     */
    BatchDecryptRequest: BatchDecryptRequest,
    /**
     * The BatchDecryptRequestInner model constructor.
     * @property {module:model/BatchDecryptRequestInner}
     */
    BatchDecryptRequestInner: BatchDecryptRequestInner,
    /**
     * The BatchDecryptResponse model constructor.
     * @property {module:model/BatchDecryptResponse}
     */
    BatchDecryptResponse: BatchDecryptResponse,
    /**
     * The BatchDecryptResponseInner model constructor.
     * @property {module:model/BatchDecryptResponseInner}
     */
    BatchDecryptResponseInner: BatchDecryptResponseInner,
    /**
     * The BatchEncryptRequest model constructor.
     * @property {module:model/BatchEncryptRequest}
     */
    BatchEncryptRequest: BatchEncryptRequest,
    /**
     * The BatchEncryptRequestInner model constructor.
     * @property {module:model/BatchEncryptRequestInner}
     */
    BatchEncryptRequestInner: BatchEncryptRequestInner,
    /**
     * The BatchEncryptResponse model constructor.
     * @property {module:model/BatchEncryptResponse}
     */
    BatchEncryptResponse: BatchEncryptResponse,
    /**
     * The BatchEncryptResponseInner model constructor.
     * @property {module:model/BatchEncryptResponseInner}
     */
    BatchEncryptResponseInner: BatchEncryptResponseInner,
    /**
     * The BatchSignRequest model constructor.
     * @property {module:model/BatchSignRequest}
     */
    BatchSignRequest: BatchSignRequest,
    /**
     * The BatchSignResponse model constructor.
     * @property {module:model/BatchSignResponse}
     */
    BatchSignResponse: BatchSignResponse,
    /**
     * The BatchSignResponseInner model constructor.
     * @property {module:model/BatchSignResponseInner}
     */
    BatchSignResponseInner: BatchSignResponseInner,
    /**
     * The BatchVerifyRequest model constructor.
     * @property {module:model/BatchVerifyRequest}
     */
    BatchVerifyRequest: BatchVerifyRequest,
    /**
     * The BatchVerifyResponse model constructor.
     * @property {module:model/BatchVerifyResponse}
     */
    BatchVerifyResponse: BatchVerifyResponse,
    /**
     * The BatchVerifyResponseInner model constructor.
     * @property {module:model/BatchVerifyResponseInner}
     */
    BatchVerifyResponseInner: BatchVerifyResponseInner,
    /**
     * The CaConfig model constructor.
     * @property {module:model/CaConfig}
     */
    CaConfig: CaConfig,
    /**
     * The CipherMode model constructor.
     * @property {module:model/CipherMode}
     */
    CipherMode: CipherMode,
    /**
     * The ConfirmEmailRequest model constructor.
     * @property {module:model/ConfirmEmailRequest}
     */
    ConfirmEmailRequest: ConfirmEmailRequest,
    /**
     * The ConfirmEmailResponse model constructor.
     * @property {module:model/ConfirmEmailResponse}
     */
    ConfirmEmailResponse: ConfirmEmailResponse,
    /**
     * The CreatorType model constructor.
     * @property {module:model/CreatorType}
     */
    CreatorType: CreatorType,
    /**
     * The CryptMode model constructor.
     * @property {module:model/CryptMode}
     */
    CryptMode: CryptMode,
    /**
     * The DecryptFinalRequest model constructor.
     * @property {module:model/DecryptFinalRequest}
     */
    DecryptFinalRequest: DecryptFinalRequest,
    /**
     * The DecryptFinalRequestEx model constructor.
     * @property {module:model/DecryptFinalRequestEx}
     */
    DecryptFinalRequestEx: DecryptFinalRequestEx,
    /**
     * The DecryptFinalResponse model constructor.
     * @property {module:model/DecryptFinalResponse}
     */
    DecryptFinalResponse: DecryptFinalResponse,
    /**
     * The DecryptInitRequest model constructor.
     * @property {module:model/DecryptInitRequest}
     */
    DecryptInitRequest: DecryptInitRequest,
    /**
     * The DecryptInitRequestEx model constructor.
     * @property {module:model/DecryptInitRequestEx}
     */
    DecryptInitRequestEx: DecryptInitRequestEx,
    /**
     * The DecryptInitResponse model constructor.
     * @property {module:model/DecryptInitResponse}
     */
    DecryptInitResponse: DecryptInitResponse,
    /**
     * The DecryptRequest model constructor.
     * @property {module:model/DecryptRequest}
     */
    DecryptRequest: DecryptRequest,
    /**
     * The DecryptRequestEx model constructor.
     * @property {module:model/DecryptRequestEx}
     */
    DecryptRequestEx: DecryptRequestEx,
    /**
     * The DecryptResponse model constructor.
     * @property {module:model/DecryptResponse}
     */
    DecryptResponse: DecryptResponse,
    /**
     * The DecryptUpdateRequest model constructor.
     * @property {module:model/DecryptUpdateRequest}
     */
    DecryptUpdateRequest: DecryptUpdateRequest,
    /**
     * The DecryptUpdateRequestEx model constructor.
     * @property {module:model/DecryptUpdateRequestEx}
     */
    DecryptUpdateRequestEx: DecryptUpdateRequestEx,
    /**
     * The DecryptUpdateResponse model constructor.
     * @property {module:model/DecryptUpdateResponse}
     */
    DecryptUpdateResponse: DecryptUpdateResponse,
    /**
     * The DeriveKeyMechanism model constructor.
     * @property {module:model/DeriveKeyMechanism}
     */
    DeriveKeyMechanism: DeriveKeyMechanism,
    /**
     * The DeriveKeyRequest model constructor.
     * @property {module:model/DeriveKeyRequest}
     */
    DeriveKeyRequest: DeriveKeyRequest,
    /**
     * The DeriveKeyRequestEx model constructor.
     * @property {module:model/DeriveKeyRequestEx}
     */
    DeriveKeyRequestEx: DeriveKeyRequestEx,
    /**
     * The DigestAlgorithm model constructor.
     * @property {module:model/DigestAlgorithm}
     */
    DigestAlgorithm: DigestAlgorithm,
    /**
     * The DigestRequest model constructor.
     * @property {module:model/DigestRequest}
     */
    DigestRequest: DigestRequest,
    /**
     * The DigestResponse model constructor.
     * @property {module:model/DigestResponse}
     */
    DigestResponse: DigestResponse,
    /**
     * The EllipticCurve model constructor.
     * @property {module:model/EllipticCurve}
     */
    EllipticCurve: EllipticCurve,
    /**
     * The EncryptFinalRequest model constructor.
     * @property {module:model/EncryptFinalRequest}
     */
    EncryptFinalRequest: EncryptFinalRequest,
    /**
     * The EncryptFinalRequestEx model constructor.
     * @property {module:model/EncryptFinalRequestEx}
     */
    EncryptFinalRequestEx: EncryptFinalRequestEx,
    /**
     * The EncryptFinalResponse model constructor.
     * @property {module:model/EncryptFinalResponse}
     */
    EncryptFinalResponse: EncryptFinalResponse,
    /**
     * The EncryptInitRequest model constructor.
     * @property {module:model/EncryptInitRequest}
     */
    EncryptInitRequest: EncryptInitRequest,
    /**
     * The EncryptInitRequestEx model constructor.
     * @property {module:model/EncryptInitRequestEx}
     */
    EncryptInitRequestEx: EncryptInitRequestEx,
    /**
     * The EncryptInitResponse model constructor.
     * @property {module:model/EncryptInitResponse}
     */
    EncryptInitResponse: EncryptInitResponse,
    /**
     * The EncryptRequest model constructor.
     * @property {module:model/EncryptRequest}
     */
    EncryptRequest: EncryptRequest,
    /**
     * The EncryptRequestEx model constructor.
     * @property {module:model/EncryptRequestEx}
     */
    EncryptRequestEx: EncryptRequestEx,
    /**
     * The EncryptResponse model constructor.
     * @property {module:model/EncryptResponse}
     */
    EncryptResponse: EncryptResponse,
    /**
     * The EncryptUpdateRequest model constructor.
     * @property {module:model/EncryptUpdateRequest}
     */
    EncryptUpdateRequest: EncryptUpdateRequest,
    /**
     * The EncryptUpdateRequestEx model constructor.
     * @property {module:model/EncryptUpdateRequestEx}
     */
    EncryptUpdateRequestEx: EncryptUpdateRequestEx,
    /**
     * The EncryptUpdateResponse model constructor.
     * @property {module:model/EncryptUpdateResponse}
     */
    EncryptUpdateResponse: EncryptUpdateResponse,
    /**
     * The Entity model constructor.
     * @property {module:model/Entity}
     */
    Entity: Entity,
    /**
     * The Error model constructor.
     * @property {module:model/Error}
     */
    Error: Error,
    /**
     * The ForgotPasswordRequest model constructor.
     * @property {module:model/ForgotPasswordRequest}
     */
    ForgotPasswordRequest: ForgotPasswordRequest,
    /**
     * The GoogleServiceAccountKey model constructor.
     * @property {module:model/GoogleServiceAccountKey}
     */
    GoogleServiceAccountKey: GoogleServiceAccountKey,
    /**
     * The Group model constructor.
     * @property {module:model/Group}
     */
    Group: Group,
    /**
     * The GroupRequest model constructor.
     * @property {module:model/GroupRequest}
     */
    GroupRequest: GroupRequest,
    /**
     * The IVDecryptInput model constructor.
     * @property {module:model/IVDecryptInput}
     */
    IVDecryptInput: IVDecryptInput,
    /**
     * The IVEncryptInput model constructor.
     * @property {module:model/IVEncryptInput}
     */
    IVEncryptInput: IVEncryptInput,
    /**
     * The IVEncryptOutput model constructor.
     * @property {module:model/IVEncryptOutput}
     */
    IVEncryptOutput: IVEncryptOutput,
    /**
     * The KeyObject model constructor.
     * @property {module:model/KeyObject}
     */
    KeyObject: KeyObject,
    /**
     * The KeyOperations model constructor.
     * @property {module:model/KeyOperations}
     */
    KeyOperations: KeyOperations,
    /**
     * The Language model constructor.
     * @property {module:model/Language}
     */
    Language: Language,
    /**
     * The LoggingConfig model constructor.
     * @property {module:model/LoggingConfig}
     */
    LoggingConfig: LoggingConfig,
    /**
     * The LoggingConfigRequest model constructor.
     * @property {module:model/LoggingConfigRequest}
     */
    LoggingConfigRequest: LoggingConfigRequest,
    /**
     * The MacGenerateRequest model constructor.
     * @property {module:model/MacGenerateRequest}
     */
    MacGenerateRequest: MacGenerateRequest,
    /**
     * The MacGenerateRequestEx model constructor.
     * @property {module:model/MacGenerateRequestEx}
     */
    MacGenerateRequestEx: MacGenerateRequestEx,
    /**
     * The MacGenerateResponse model constructor.
     * @property {module:model/MacGenerateResponse}
     */
    MacGenerateResponse: MacGenerateResponse,
    /**
     * The MacVerifyRequest model constructor.
     * @property {module:model/MacVerifyRequest}
     */
    MacVerifyRequest: MacVerifyRequest,
    /**
     * The MacVerifyRequestEx model constructor.
     * @property {module:model/MacVerifyRequestEx}
     */
    MacVerifyRequestEx: MacVerifyRequestEx,
    /**
     * The MacVerifyResponse model constructor.
     * @property {module:model/MacVerifyResponse}
     */
    MacVerifyResponse: MacVerifyResponse,
    /**
     * The MfaChallenge model constructor.
     * @property {module:model/MfaChallenge}
     */
    MfaChallenge: MfaChallenge,
    /**
     * The Mgf model constructor.
     * @property {module:model/Mgf}
     */
    Mgf: Mgf,
    /**
     * The MgfMgf1 model constructor.
     * @property {module:model/MgfMgf1}
     */
    MgfMgf1: MgfMgf1,
    /**
     * The NotificationPref model constructor.
     * @property {module:model/NotificationPref}
     */
    NotificationPref: NotificationPref,
    /**
     * The ObjectDigestRequest model constructor.
     * @property {module:model/ObjectDigestRequest}
     */
    ObjectDigestRequest: ObjectDigestRequest,
    /**
     * The ObjectOrigin model constructor.
     * @property {module:model/ObjectOrigin}
     */
    ObjectOrigin: ObjectOrigin,
    /**
     * The ObjectType model constructor.
     * @property {module:model/ObjectType}
     */
    ObjectType: ObjectType,
    /**
     * The PasswordChangeRequest model constructor.
     * @property {module:model/PasswordChangeRequest}
     */
    PasswordChangeRequest: PasswordChangeRequest,
    /**
     * The PasswordResetRequest model constructor.
     * @property {module:model/PasswordResetRequest}
     */
    PasswordResetRequest: PasswordResetRequest,
    /**
     * The PersistTransientKeyRequest model constructor.
     * @property {module:model/PersistTransientKeyRequest}
     */
    PersistTransientKeyRequest: PersistTransientKeyRequest,
    /**
     * The Plugin model constructor.
     * @property {module:model/Plugin}
     */
    Plugin: Plugin,
    /**
     * The PluginInvokeRequest model constructor.
     * @property {module:model/PluginInvokeRequest}
     */
    PluginInvokeRequest: PluginInvokeRequest,
    /**
     * The PluginInvokeResponse model constructor.
     * @property {module:model/PluginInvokeResponse}
     */
    PluginInvokeResponse: PluginInvokeResponse,
    /**
     * The PluginRequest model constructor.
     * @property {module:model/PluginRequest}
     */
    PluginRequest: PluginRequest,
    /**
     * The PluginSource model constructor.
     * @property {module:model/PluginSource}
     */
    PluginSource: PluginSource,
    /**
     * The PluginType model constructor.
     * @property {module:model/PluginType}
     */
    PluginType: PluginType,
    /**
     * The ProcessInviteRequest model constructor.
     * @property {module:model/ProcessInviteRequest}
     */
    ProcessInviteRequest: ProcessInviteRequest,
    /**
     * The RecoveryCodes model constructor.
     * @property {module:model/RecoveryCodes}
     */
    RecoveryCodes: RecoveryCodes,
    /**
     * The RsaEncryptionPadding model constructor.
     * @property {module:model/RsaEncryptionPadding}
     */
    RsaEncryptionPadding: RsaEncryptionPadding,
    /**
     * The RsaEncryptionPaddingOAEP model constructor.
     * @property {module:model/RsaEncryptionPaddingOAEP}
     */
    RsaEncryptionPaddingOAEP: RsaEncryptionPaddingOAEP,
    /**
     * The RsaEncryptionPolicy model constructor.
     * @property {module:model/RsaEncryptionPolicy}
     */
    RsaEncryptionPolicy: RsaEncryptionPolicy,
    /**
     * The RsaEncryptionPolicyPadding model constructor.
     * @property {module:model/RsaEncryptionPolicyPadding}
     */
    RsaEncryptionPolicyPadding: RsaEncryptionPolicyPadding,
    /**
     * The RsaEncryptionPolicyPaddingOAEP model constructor.
     * @property {module:model/RsaEncryptionPolicyPaddingOAEP}
     */
    RsaEncryptionPolicyPaddingOAEP: RsaEncryptionPolicyPaddingOAEP,
    /**
     * The RsaEncryptionPolicyPaddingOAEPMgf1 model constructor.
     * @property {module:model/RsaEncryptionPolicyPaddingOAEPMgf1}
     */
    RsaEncryptionPolicyPaddingOAEPMgf1: RsaEncryptionPolicyPaddingOAEPMgf1,
    /**
     * The RsaOptions model constructor.
     * @property {module:model/RsaOptions}
     */
    RsaOptions: RsaOptions,
    /**
     * The RsaSignaturePadding model constructor.
     * @property {module:model/RsaSignaturePadding}
     */
    RsaSignaturePadding: RsaSignaturePadding,
    /**
     * The RsaSignaturePaddingPSS model constructor.
     * @property {module:model/RsaSignaturePaddingPSS}
     */
    RsaSignaturePaddingPSS: RsaSignaturePaddingPSS,
    /**
     * The RsaSignaturePolicy model constructor.
     * @property {module:model/RsaSignaturePolicy}
     */
    RsaSignaturePolicy: RsaSignaturePolicy,
    /**
     * The RsaSignaturePolicyPadding model constructor.
     * @property {module:model/RsaSignaturePolicyPadding}
     */
    RsaSignaturePolicyPadding: RsaSignaturePolicyPadding,
    /**
     * The SelectAccountRequest model constructor.
     * @property {module:model/SelectAccountRequest}
     */
    SelectAccountRequest: SelectAccountRequest,
    /**
     * The SelectAccountResponse model constructor.
     * @property {module:model/SelectAccountResponse}
     */
    SelectAccountResponse: SelectAccountResponse,
    /**
     * The ServerMode model constructor.
     * @property {module:model/ServerMode}
     */
    ServerMode: ServerMode,
    /**
     * The SignRequest model constructor.
     * @property {module:model/SignRequest}
     */
    SignRequest: SignRequest,
    /**
     * The SignRequestEx model constructor.
     * @property {module:model/SignRequestEx}
     */
    SignRequestEx: SignRequestEx,
    /**
     * The SignResponse model constructor.
     * @property {module:model/SignResponse}
     */
    SignResponse: SignResponse,
    /**
     * The SignatureMode model constructor.
     * @property {module:model/SignatureMode}
     */
    SignatureMode: SignatureMode,
    /**
     * The SignupRequest model constructor.
     * @property {module:model/SignupRequest}
     */
    SignupRequest: SignupRequest,
    /**
     * The SobjectDescriptor model constructor.
     * @property {module:model/SobjectDescriptor}
     */
    SobjectDescriptor: SobjectDescriptor,
    /**
     * The SobjectRequest model constructor.
     * @property {module:model/SobjectRequest}
     */
    SobjectRequest: SobjectRequest,
    /**
     * The SplunkLoggingConfig model constructor.
     * @property {module:model/SplunkLoggingConfig}
     */
    SplunkLoggingConfig: SplunkLoggingConfig,
    /**
     * The SplunkLoggingConfigRequest model constructor.
     * @property {module:model/SplunkLoggingConfigRequest}
     */
    SplunkLoggingConfigRequest: SplunkLoggingConfigRequest,
    /**
     * The StackdriverLoggingConfig model constructor.
     * @property {module:model/StackdriverLoggingConfig}
     */
    StackdriverLoggingConfig: StackdriverLoggingConfig,
    /**
     * The StackdriverLoggingConfigRequest model constructor.
     * @property {module:model/StackdriverLoggingConfigRequest}
     */
    StackdriverLoggingConfigRequest: StackdriverLoggingConfigRequest,
    /**
     * The SubscriptionChangeRequest model constructor.
     * @property {module:model/SubscriptionChangeRequest}
     */
    SubscriptionChangeRequest: SubscriptionChangeRequest,
    /**
     * The SubscriptionType model constructor.
     * @property {module:model/SubscriptionType}
     */
    SubscriptionType: SubscriptionType,
    /**
     * The TagDecryptInput model constructor.
     * @property {module:model/TagDecryptInput}
     */
    TagDecryptInput: TagDecryptInput,
    /**
     * The TagEncryptOutput model constructor.
     * @property {module:model/TagEncryptOutput}
     */
    TagEncryptOutput: TagEncryptOutput,
    /**
     * The TagLenEncryptInput model constructor.
     * @property {module:model/TagLenEncryptInput}
     */
    TagLenEncryptInput: TagLenEncryptInput,
    /**
     * The TlsConfig model constructor.
     * @property {module:model/TlsConfig}
     */
    TlsConfig: TlsConfig,
    /**
     * The TlsMode model constructor.
     * @property {module:model/TlsMode}
     */
    TlsMode: TlsMode,
    /**
     * The U2fAddDeviceRequest model constructor.
     * @property {module:model/U2fAddDeviceRequest}
     */
    U2fAddDeviceRequest: U2fAddDeviceRequest,
    /**
     * The U2fDelDeviceRequest model constructor.
     * @property {module:model/U2fDelDeviceRequest}
     */
    U2fDelDeviceRequest: U2fDelDeviceRequest,
    /**
     * The U2fDevice model constructor.
     * @property {module:model/U2fDevice}
     */
    U2fDevice: U2fDevice,
    /**
     * The U2fKey model constructor.
     * @property {module:model/U2fKey}
     */
    U2fKey: U2fKey,
    /**
     * The U2fRenameDeviceRequest model constructor.
     * @property {module:model/U2fRenameDeviceRequest}
     */
    U2fRenameDeviceRequest: U2fRenameDeviceRequest,
    /**
     * The UnwrapKeyRequest model constructor.
     * @property {module:model/UnwrapKeyRequest}
     */
    UnwrapKeyRequest: UnwrapKeyRequest,
    /**
     * The UnwrapKeyRequestEx model constructor.
     * @property {module:model/UnwrapKeyRequestEx}
     */
    UnwrapKeyRequestEx: UnwrapKeyRequestEx,
    /**
     * The User model constructor.
     * @property {module:model/User}
     */
    User: User,
    /**
     * The UserAccountFlags model constructor.
     * @property {module:model/UserAccountFlags}
     */
    UserAccountFlags: UserAccountFlags,
    /**
     * The UserAccountMap model constructor.
     * @property {module:model/UserAccountMap}
     */
    UserAccountMap: UserAccountMap,
    /**
     * The UserGroup model constructor.
     * @property {module:model/UserGroup}
     */
    UserGroup: UserGroup,
    /**
     * The UserGroupFlags model constructor.
     * @property {module:model/UserGroupFlags}
     */
    UserGroupFlags: UserGroupFlags,
    /**
     * The UserRequest model constructor.
     * @property {module:model/UserRequest}
     */
    UserRequest: UserRequest,
    /**
     * The UserState model constructor.
     * @property {module:model/UserState}
     */
    UserState: UserState,
    /**
     * The Uuid model constructor.
     * @property {module:model/Uuid}
     */
    Uuid: Uuid,
    /**
     * The ValidateTokenRequest model constructor.
     * @property {module:model/ValidateTokenRequest}
     */
    ValidateTokenRequest: ValidateTokenRequest,
    /**
     * The ValidateTokenResponse model constructor.
     * @property {module:model/ValidateTokenResponse}
     */
    ValidateTokenResponse: ValidateTokenResponse,
    /**
     * The VerifyRequest model constructor.
     * @property {module:model/VerifyRequest}
     */
    VerifyRequest: VerifyRequest,
    /**
     * The VerifyRequestEx model constructor.
     * @property {module:model/VerifyRequestEx}
     */
    VerifyRequestEx: VerifyRequestEx,
    /**
     * The VerifyResponse model constructor.
     * @property {module:model/VerifyResponse}
     */
    VerifyResponse: VerifyResponse,
    /**
     * The VersionResponse model constructor.
     * @property {module:model/VersionResponse}
     */
    VersionResponse: VersionResponse,
    /**
     * The WrapKeyRequest model constructor.
     * @property {module:model/WrapKeyRequest}
     */
    WrapKeyRequest: WrapKeyRequest,
    /**
     * The WrapKeyRequestEx model constructor.
     * @property {module:model/WrapKeyRequestEx}
     */
    WrapKeyRequestEx: WrapKeyRequestEx,
    /**
     * The WrapKeyResponse model constructor.
     * @property {module:model/WrapKeyResponse}
     */
    WrapKeyResponse: WrapKeyResponse,
    /**
     * The AccountsApi service constructor.
     * @property {module:api/AccountsApi}
     */
    AccountsApi: AccountsApi,
    /**
     * The ApprovalRequestsApi service constructor.
     * @property {module:api/ApprovalRequestsApi}
     */
    ApprovalRequestsApi: ApprovalRequestsApi,
    /**
     * The AppsApi service constructor.
     * @property {module:api/AppsApi}
     */
    AppsApi: AppsApi,
    /**
     * The AuthenticationApi service constructor.
     * @property {module:api/AuthenticationApi}
     */
    AuthenticationApi: AuthenticationApi,
    /**
     * The DigestApi service constructor.
     * @property {module:api/DigestApi}
     */
    DigestApi: DigestApi,
    /**
     * The EncryptionAndDecryptionApi service constructor.
     * @property {module:api/EncryptionAndDecryptionApi}
     */
    EncryptionAndDecryptionApi: EncryptionAndDecryptionApi,
    /**
     * The GroupsApi service constructor.
     * @property {module:api/GroupsApi}
     */
    GroupsApi: GroupsApi,
    /**
     * The LogsApi service constructor.
     * @property {module:api/LogsApi}
     */
    LogsApi: LogsApi,
    /**
     * The PluginsApi service constructor.
     * @property {module:api/PluginsApi}
     */
    PluginsApi: PluginsApi,
    /**
     * The SecurityObjectsApi service constructor.
     * @property {module:api/SecurityObjectsApi}
     */
    SecurityObjectsApi: SecurityObjectsApi,
    /**
     * The SignAndVerifyApi service constructor.
     * @property {module:api/SignAndVerifyApi}
     */
    SignAndVerifyApi: SignAndVerifyApi,
    /**
     * The TwoFactorAuthenticationApi service constructor.
     * @property {module:api/TwoFactorAuthenticationApi}
     */
    TwoFactorAuthenticationApi: TwoFactorAuthenticationApi,
    /**
     * The UsersApi service constructor.
     * @property {module:api/UsersApi}
     */
    UsersApi: UsersApi,
    /**
     * The WrappingAndUnwrappingApi service constructor.
     * @property {module:api/WrappingAndUnwrappingApi}
     */
    WrappingAndUnwrappingApi: WrappingAndUnwrappingApi
  };

  return exports;
}));

},{"./ApiClient":18,"./api/AccountsApi":19,"./api/ApprovalRequestsApi":20,"./api/AppsApi":21,"./api/AuthenticationApi":22,"./api/DigestApi":23,"./api/EncryptionAndDecryptionApi":24,"./api/GroupsApi":25,"./api/LogsApi":26,"./api/PluginsApi":27,"./api/SecurityObjectsApi":28,"./api/SignAndVerifyApi":29,"./api/TwoFactorAuthenticationApi":30,"./api/UsersApi":31,"./api/WrappingAndUnwrappingApi":32,"./model/ADDecryptInput":34,"./model/ADEncryptInput":35,"./model/Account":36,"./model/AccountRequest":37,"./model/AccountState":38,"./model/AgreeKeyMechanism":39,"./model/AgreeKeyRequest":40,"./model/App":41,"./model/AppAuthType":42,"./model/AppCredential":43,"./model/AppCredentialResponse":44,"./model/AppRequest":45,"./model/ApprovableResult":46,"./model/ApprovalRequest":47,"./model/ApprovalRequestRequest":48,"./model/ApprovalStatus":49,"./model/ApprovalSubject":50,"./model/AuditLogResponse":51,"./model/AuthConfig":52,"./model/AuthConfigPassword":53,"./model/AuthResponse":54,"./model/AuthType":55,"./model/BatchDecryptRequest":56,"./model/BatchDecryptRequestInner":57,"./model/BatchDecryptResponse":58,"./model/BatchDecryptResponseInner":59,"./model/BatchEncryptRequest":60,"./model/BatchEncryptRequestInner":61,"./model/BatchEncryptResponse":62,"./model/BatchEncryptResponseInner":63,"./model/BatchSignRequest":64,"./model/BatchSignResponse":65,"./model/BatchSignResponseInner":66,"./model/BatchVerifyRequest":67,"./model/BatchVerifyResponse":68,"./model/BatchVerifyResponseInner":69,"./model/CaConfig":70,"./model/CipherMode":71,"./model/ConfirmEmailRequest":72,"./model/ConfirmEmailResponse":73,"./model/CreatorType":74,"./model/CryptMode":75,"./model/DecryptFinalRequest":76,"./model/DecryptFinalRequestEx":77,"./model/DecryptFinalResponse":78,"./model/DecryptInitRequest":79,"./model/DecryptInitRequestEx":80,"./model/DecryptInitResponse":81,"./model/DecryptRequest":82,"./model/DecryptRequestEx":83,"./model/DecryptResponse":84,"./model/DecryptUpdateRequest":85,"./model/DecryptUpdateRequestEx":86,"./model/DecryptUpdateResponse":87,"./model/DeriveKeyMechanism":88,"./model/DeriveKeyRequest":89,"./model/DeriveKeyRequestEx":90,"./model/DigestAlgorithm":91,"./model/DigestRequest":92,"./model/DigestResponse":93,"./model/EllipticCurve":94,"./model/EncryptFinalRequest":95,"./model/EncryptFinalRequestEx":96,"./model/EncryptFinalResponse":97,"./model/EncryptInitRequest":98,"./model/EncryptInitRequestEx":99,"./model/EncryptInitResponse":100,"./model/EncryptRequest":101,"./model/EncryptRequestEx":102,"./model/EncryptResponse":103,"./model/EncryptUpdateRequest":104,"./model/EncryptUpdateRequestEx":105,"./model/EncryptUpdateResponse":106,"./model/Entity":107,"./model/Error":108,"./model/ForgotPasswordRequest":109,"./model/GoogleServiceAccountKey":110,"./model/Group":111,"./model/GroupRequest":112,"./model/IVDecryptInput":113,"./model/IVEncryptInput":114,"./model/IVEncryptOutput":115,"./model/KeyObject":116,"./model/KeyOperations":117,"./model/Language":118,"./model/LoggingConfig":119,"./model/LoggingConfigRequest":120,"./model/MacGenerateRequest":121,"./model/MacGenerateRequestEx":122,"./model/MacGenerateResponse":123,"./model/MacVerifyRequest":124,"./model/MacVerifyRequestEx":125,"./model/MacVerifyResponse":126,"./model/MfaChallenge":127,"./model/Mgf":128,"./model/MgfMgf1":129,"./model/NotificationPref":130,"./model/ObjectDigestRequest":131,"./model/ObjectOrigin":132,"./model/ObjectType":133,"./model/PasswordChangeRequest":134,"./model/PasswordResetRequest":135,"./model/PersistTransientKeyRequest":136,"./model/Plugin":137,"./model/PluginInvokeRequest":138,"./model/PluginInvokeResponse":139,"./model/PluginRequest":140,"./model/PluginSource":141,"./model/PluginType":142,"./model/ProcessInviteRequest":143,"./model/RecoveryCodes":144,"./model/RsaEncryptionPadding":145,"./model/RsaEncryptionPaddingOAEP":146,"./model/RsaEncryptionPolicy":147,"./model/RsaEncryptionPolicyPadding":148,"./model/RsaEncryptionPolicyPaddingOAEP":149,"./model/RsaEncryptionPolicyPaddingOAEPMgf1":150,"./model/RsaOptions":151,"./model/RsaSignaturePadding":152,"./model/RsaSignaturePaddingPSS":153,"./model/RsaSignaturePolicy":154,"./model/RsaSignaturePolicyPadding":155,"./model/SelectAccountRequest":156,"./model/SelectAccountResponse":157,"./model/ServerMode":158,"./model/SignRequest":159,"./model/SignRequestEx":160,"./model/SignResponse":161,"./model/SignatureMode":162,"./model/SignupRequest":163,"./model/SobjectDescriptor":164,"./model/SobjectRequest":165,"./model/SplunkLoggingConfig":166,"./model/SplunkLoggingConfigRequest":167,"./model/StackdriverLoggingConfig":168,"./model/StackdriverLoggingConfigRequest":169,"./model/SubscriptionChangeRequest":170,"./model/SubscriptionType":171,"./model/TagDecryptInput":172,"./model/TagEncryptOutput":173,"./model/TagLenEncryptInput":174,"./model/TlsConfig":175,"./model/TlsMode":176,"./model/U2fAddDeviceRequest":177,"./model/U2fDelDeviceRequest":178,"./model/U2fDevice":179,"./model/U2fKey":180,"./model/U2fRenameDeviceRequest":181,"./model/UnwrapKeyRequest":182,"./model/UnwrapKeyRequestEx":183,"./model/User":184,"./model/UserAccountFlags":185,"./model/UserAccountMap":186,"./model/UserGroup":187,"./model/UserGroupFlags":188,"./model/UserRequest":189,"./model/UserState":190,"./model/Uuid":191,"./model/ValidateTokenRequest":192,"./model/ValidateTokenResponse":193,"./model/VerifyRequest":194,"./model/VerifyRequestEx":195,"./model/VerifyResponse":196,"./model/VersionResponse":197,"./model/WrapKeyRequest":198,"./model/WrapKeyRequestEx":199,"./model/WrapKeyResponse":200}],34:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ADDecryptInput = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ADDecryptInput model module.
   * @module model/ADDecryptInput
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ADDecryptInput</code>.
   * The authenticated data used with this ciphertext and authentication tag. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers. 
   * @alias module:model/ADDecryptInput
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>ADDecryptInput</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ADDecryptInput} obj Optional instance to populate.
   * @return {module:model/ADDecryptInput} The populated <code>ADDecryptInput</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],35:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ADEncryptInput = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ADEncryptInput model module.
   * @module model/ADEncryptInput
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ADEncryptInput</code>.
   * For symmetric ciphers with cipher mode GCM or CCM, this optionally specifies the authenticated data used by the cipher. This field must not be provided with other cipher modes. 
   * @alias module:model/ADEncryptInput
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>ADEncryptInput</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ADEncryptInput} obj Optional instance to populate.
   * @return {module:model/ADEncryptInput} The populated <code>ADEncryptInput</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],36:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AccountState', 'model/AuthConfig', 'model/AuthType', 'model/LoggingConfig', 'model/NotificationPref', 'model/SubscriptionChangeRequest', 'model/SubscriptionType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./AccountState'), require('./AuthConfig'), require('./AuthType'), require('./LoggingConfig'), require('./NotificationPref'), require('./SubscriptionChangeRequest'), require('./SubscriptionType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.Account = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AccountState, root.FortanixSdkmsRestApi.AuthConfig, root.FortanixSdkmsRestApi.AuthType, root.FortanixSdkmsRestApi.LoggingConfig, root.FortanixSdkmsRestApi.NotificationPref, root.FortanixSdkmsRestApi.SubscriptionChangeRequest, root.FortanixSdkmsRestApi.SubscriptionType);
  }
}(this, function(ApiClient, AccountState, AuthConfig, AuthType, LoggingConfig, NotificationPref, SubscriptionChangeRequest, SubscriptionType) {
  'use strict';




  /**
   * The Account model module.
   * @module model/Account
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>Account</code>.
   * @alias module:model/Account
   * @class
   * @param name {String} Name of the account. Account names must be unique within an SDKMS instance.
   * @param acctId {String} Account ID uniquely identifying this account.
   * @param subscription {module:model/SubscriptionType} 
   * @param state {module:model/AccountState} 
   * @param authType {module:model/AuthType} 
   */
  var exports = function(name, acctId, subscription, state, authType) {
    var _this = this;

    _this['name'] = name;
    _this['acct_id'] = acctId;






    _this['subscription'] = subscription;
    _this['state'] = state;
    _this['auth_type'] = authType;






  };

  /**
   * Constructs a <code>Account</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Account} obj Optional instance to populate.
   * @return {module:model/Account} The populated <code>Account</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('acct_id')) {
        obj['acct_id'] = ApiClient.convertToType(data['acct_id'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('organization')) {
        obj['organization'] = ApiClient.convertToType(data['organization'], 'String');
      }
      if (data.hasOwnProperty('country')) {
        obj['country'] = ApiClient.convertToType(data['country'], 'String');
      }
      if (data.hasOwnProperty('phone')) {
        obj['phone'] = ApiClient.convertToType(data['phone'], 'String');
      }
      if (data.hasOwnProperty('notification_pref')) {
        obj['notification_pref'] = NotificationPref.constructFromObject(data['notification_pref']);
      }
      if (data.hasOwnProperty('auth_config')) {
        obj['auth_config'] = AuthConfig.constructFromObject(data['auth_config']);
      }
      if (data.hasOwnProperty('subscription')) {
        obj['subscription'] = SubscriptionType.constructFromObject(data['subscription']);
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = AccountState.constructFromObject(data['state']);
      }
      if (data.hasOwnProperty('auth_type')) {
        obj['auth_type'] = AuthType.constructFromObject(data['auth_type']);
      }
      if (data.hasOwnProperty('logging_configs')) {
        obj['logging_configs'] = ApiClient.convertToType(data['logging_configs'], {'String': LoggingConfig});
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('created_at')) {
        obj['created_at'] = ApiClient.convertToType(data['created_at'], 'String');
      }
      if (data.hasOwnProperty('initial_purchase_at')) {
        obj['initial_purchase_at'] = ApiClient.convertToType(data['initial_purchase_at'], 'String');
      }
      if (data.hasOwnProperty('pending_subscription_change_request')) {
        obj['pending_subscription_change_request'] = SubscriptionChangeRequest.constructFromObject(data['pending_subscription_change_request']);
      }
      if (data.hasOwnProperty('custom_metadata')) {
        obj['custom_metadata'] = ApiClient.convertToType(data['custom_metadata'], {'String': 'String'});
      }
    }
    return obj;
  }

  /**
   * Name of the account. Account names must be unique within an SDKMS instance.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Account ID uniquely identifying this account.
   * @member {String} acct_id
   */
  exports.prototype['acct_id'] = undefined;
  /**
   * Description of this account.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Organization (e.g. company name) that owns this account
   * @member {String} organization
   */
  exports.prototype['organization'] = undefined;
  /**
   * Main country associated with this account
   * @member {String} country
   */
  exports.prototype['country'] = undefined;
  /**
   * Contact phone number associated with this account
   * @member {String} phone
   */
  exports.prototype['phone'] = undefined;
  /**
   * @member {module:model/NotificationPref} notification_pref
   */
  exports.prototype['notification_pref'] = undefined;
  /**
   * @member {module:model/AuthConfig} auth_config
   */
  exports.prototype['auth_config'] = undefined;
  /**
   * @member {module:model/SubscriptionType} subscription
   */
  exports.prototype['subscription'] = undefined;
  /**
   * @member {module:model/AccountState} state
   */
  exports.prototype['state'] = undefined;
  /**
   * @member {module:model/AuthType} auth_type
   */
  exports.prototype['auth_type'] = undefined;
  /**
   * Map from UUIDs to LoggingConfig objects
   * @member {Object.<String, module:model/LoggingConfig>} logging_configs
   */
  exports.prototype['logging_configs'] = undefined;
  /**
   * Whether this account is enabled. This may only be changed by sysadmins.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * When this account was created.
   * @member {String} created_at
   */
  exports.prototype['created_at'] = undefined;
  /**
   * When this accout was upgraded a paid subscription.
   * @member {String} initial_purchase_at
   */
  exports.prototype['initial_purchase_at'] = undefined;
  /**
   * @member {module:model/SubscriptionChangeRequest} pending_subscription_change_request
   */
  exports.prototype['pending_subscription_change_request'] = undefined;
  /**
   * Sysadmin-defined metadata for this account. Stored as key-value pairs. This field is only visible to sysadmin users. 
   * @member {Object.<String, String>} custom_metadata
   */
  exports.prototype['custom_metadata'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./AccountState":38,"./AuthConfig":52,"./AuthType":55,"./LoggingConfig":119,"./NotificationPref":130,"./SubscriptionChangeRequest":170,"./SubscriptionType":171}],37:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AuthConfig', 'model/LoggingConfigRequest', 'model/NotificationPref', 'model/SubscriptionChangeRequest', 'model/SubscriptionType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./AuthConfig'), require('./LoggingConfigRequest'), require('./NotificationPref'), require('./SubscriptionChangeRequest'), require('./SubscriptionType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AccountRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AuthConfig, root.FortanixSdkmsRestApi.LoggingConfigRequest, root.FortanixSdkmsRestApi.NotificationPref, root.FortanixSdkmsRestApi.SubscriptionChangeRequest, root.FortanixSdkmsRestApi.SubscriptionType);
  }
}(this, function(ApiClient, AuthConfig, LoggingConfigRequest, NotificationPref, SubscriptionChangeRequest, SubscriptionType) {
  'use strict';




  /**
   * The AccountRequest model module.
   * @module model/AccountRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>AccountRequest</code>.
   * @alias module:model/AccountRequest
   * @class
   */
  var exports = function() {
    var _this = this;















  };

  /**
   * Constructs a <code>AccountRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AccountRequest} obj Optional instance to populate.
   * @return {module:model/AccountRequest} The populated <code>AccountRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('organization')) {
        obj['organization'] = ApiClient.convertToType(data['organization'], 'String');
      }
      if (data.hasOwnProperty('country')) {
        obj['country'] = ApiClient.convertToType(data['country'], 'String');
      }
      if (data.hasOwnProperty('phone')) {
        obj['phone'] = ApiClient.convertToType(data['phone'], 'String');
      }
      if (data.hasOwnProperty('notification_pref')) {
        obj['notification_pref'] = NotificationPref.constructFromObject(data['notification_pref']);
      }
      if (data.hasOwnProperty('auth_config')) {
        obj['auth_config'] = AuthConfig.constructFromObject(data['auth_config']);
      }
      if (data.hasOwnProperty('add_logging_configs')) {
        obj['add_logging_configs'] = ApiClient.convertToType(data['add_logging_configs'], [LoggingConfigRequest]);
      }
      if (data.hasOwnProperty('mod_logging_configs')) {
        obj['mod_logging_configs'] = ApiClient.convertToType(data['mod_logging_configs'], {'String': LoggingConfigRequest});
      }
      if (data.hasOwnProperty('del_logging_configs')) {
        obj['del_logging_configs'] = ApiClient.convertToType(data['del_logging_configs'], ['String']);
      }
      if (data.hasOwnProperty('pending_subscription_change_request')) {
        obj['pending_subscription_change_request'] = SubscriptionChangeRequest.constructFromObject(data['pending_subscription_change_request']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('subscription')) {
        obj['subscription'] = SubscriptionType.constructFromObject(data['subscription']);
      }
      if (data.hasOwnProperty('custom_metadata')) {
        obj['custom_metadata'] = ApiClient.convertToType(data['custom_metadata'], {'String': 'String'});
      }
    }
    return obj;
  }

  /**
   * Name of the account. Accounts must be unique within an SDKMS instance.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Account ID uniquely identifying this account.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Organization (e.g. company name) that owns this account
   * @member {String} organization
   */
  exports.prototype['organization'] = undefined;
  /**
   * Main country associated with this account
   * @member {String} country
   */
  exports.prototype['country'] = undefined;
  /**
   * Contact phone number associated with this account
   * @member {String} phone
   */
  exports.prototype['phone'] = undefined;
  /**
   * @member {module:model/NotificationPref} notification_pref
   */
  exports.prototype['notification_pref'] = undefined;
  /**
   * @member {module:model/AuthConfig} auth_config
   */
  exports.prototype['auth_config'] = undefined;
  /**
   * @member {Array.<module:model/LoggingConfigRequest>} add_logging_configs
   */
  exports.prototype['add_logging_configs'] = undefined;
  /**
   * Map from UUIDs to LoggingConfigRequest objects
   * @member {Object.<String, module:model/LoggingConfigRequest>} mod_logging_configs
   */
  exports.prototype['mod_logging_configs'] = undefined;
  /**
   * @member {Array.<String>} del_logging_configs
   */
  exports.prototype['del_logging_configs'] = undefined;
  /**
   * @member {module:model/SubscriptionChangeRequest} pending_subscription_change_request
   */
  exports.prototype['pending_subscription_change_request'] = undefined;
  /**
   * Whether this account is enabled. This may only be changed by sysadmins.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * @member {module:model/SubscriptionType} subscription
   */
  exports.prototype['subscription'] = undefined;
  /**
   * Sysadmin-defined metadata for this account. Stored as key-value pairs. This field may only be used by sysadmin users. 
   * @member {Object.<String, String>} custom_metadata
   */
  exports.prototype['custom_metadata'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./AuthConfig":52,"./LoggingConfigRequest":120,"./NotificationPref":130,"./SubscriptionChangeRequest":170,"./SubscriptionType":171}],38:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AccountState = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class AccountState.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "PendingConfirmation"
     * @const
     */
    "PendingConfirmation": "PendingConfirmation",
    /**
     * value: "Activated"
     * @const
     */
    "Activated": "Activated",
    /**
     * value: "Disabled"
     * @const
     */
    "Disabled": "Disabled"  };

  /**
   * Returns a <code>AccountState</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/AccountState} The enum <code>AccountState</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],39:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AgreeKeyMechanism = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class AgreeKeyMechanism.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "diffie_hellman"
     * @const
     */
    "hellman": "diffie_hellman"  };

  /**
   * Returns a <code>AgreeKeyMechanism</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/AgreeKeyMechanism} The enum <code>AgreeKeyMechanism</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],40:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AgreeKeyMechanism', 'model/KeyOperations', 'model/ObjectType', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./AgreeKeyMechanism'), require('./KeyOperations'), require('./ObjectType'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AgreeKeyRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AgreeKeyMechanism, root.FortanixSdkmsRestApi.KeyOperations, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, AgreeKeyMechanism, KeyOperations, ObjectType, SobjectDescriptor) {
  'use strict';




  /**
   * The AgreeKeyRequest model module.
   * @module model/AgreeKeyRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>AgreeKeyRequest</code>.
   * @alias module:model/AgreeKeyRequest
   * @class
   * @param privateKey {module:model/SobjectDescriptor} 
   * @param publicKey {module:model/SobjectDescriptor} 
   * @param name {String} Name of the agreed-upon key. Key names must be unique within an account. The name is ignored for transient keys and should be the empty string.
   * @param keySize {Number} Key size of the derived key in bits (not bytes).
   * @param keyType {module:model/ObjectType} 
   * @param mechanism {module:model/AgreeKeyMechanism} 
   */
  var exports = function(privateKey, publicKey, name, keySize, keyType, mechanism) {
    var _this = this;

    _this['private_key'] = privateKey;
    _this['public_key'] = publicKey;
    _this['name'] = name;

    _this['key_size'] = keySize;
    _this['key_type'] = keyType;
    _this['mechanism'] = mechanism;





  };

  /**
   * Constructs a <code>AgreeKeyRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AgreeKeyRequest} obj Optional instance to populate.
   * @return {module:model/AgreeKeyRequest} The populated <code>AgreeKeyRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('private_key')) {
        obj['private_key'] = SobjectDescriptor.constructFromObject(data['private_key']);
      }
      if (data.hasOwnProperty('public_key')) {
        obj['public_key'] = SobjectDescriptor.constructFromObject(data['public_key']);
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('key_size')) {
        obj['key_size'] = ApiClient.convertToType(data['key_size'], 'Number');
      }
      if (data.hasOwnProperty('key_type')) {
        obj['key_type'] = ObjectType.constructFromObject(data['key_type']);
      }
      if (data.hasOwnProperty('mechanism')) {
        obj['mechanism'] = AgreeKeyMechanism.constructFromObject(data['mechanism']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('key_ops')) {
        obj['key_ops'] = ApiClient.convertToType(data['key_ops'], [KeyOperations]);
      }
      if (data.hasOwnProperty('custom_metadata')) {
        obj['custom_metadata'] = ApiClient.convertToType(data['custom_metadata'], {'String': 'String'});
      }
      if (data.hasOwnProperty('transient')) {
        obj['transient'] = ApiClient.convertToType(data['transient'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} private_key
   */
  exports.prototype['private_key'] = undefined;
  /**
   * @member {module:model/SobjectDescriptor} public_key
   */
  exports.prototype['public_key'] = undefined;
  /**
   * Name of the agreed-upon key. Key names must be unique within an account. The name is ignored for transient keys and should be the empty string.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Group ID (not name) of the security group that this security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used. 
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * Key size of the derived key in bits (not bytes).
   * @member {Number} key_size
   */
  exports.prototype['key_size'] = undefined;
  /**
   * @member {module:model/ObjectType} key_type
   */
  exports.prototype['key_type'] = undefined;
  /**
   * @member {module:model/AgreeKeyMechanism} mechanism
   */
  exports.prototype['mechanism'] = undefined;
  /**
   * Whether the derived key should have cryptographic operations enabled.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * Description for the new key.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled. 
   * @member {Array.<module:model/KeyOperations>} key_ops
   */
  exports.prototype['key_ops'] = undefined;
  /**
   * User-defined metadata for this key. Stored as key-value pairs.
   * @member {Object.<String, String>} custom_metadata
   */
  exports.prototype['custom_metadata'] = undefined;
  /**
   * If this is true, SDKMS will derive a transient key.
   * @member {Boolean} transient
   */
  exports.prototype['transient'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./AgreeKeyMechanism":39,"./KeyOperations":117,"./ObjectType":133,"./SobjectDescriptor":164}],41:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AppAuthType', 'model/CreatorType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./AppAuthType'), require('./CreatorType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.App = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AppAuthType, root.FortanixSdkmsRestApi.CreatorType);
  }
}(this, function(ApiClient, AppAuthType, CreatorType) {
  'use strict';




  /**
   * The App model module.
   * @module model/App
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>App</code>.
   * @alias module:model/App
   * @class
   * @param name {String} Name of the application. Application names must be unique within an account.
   * @param appId {String} Application ID uniquely identifying this application.
   * @param authType {module:model/AppAuthType} 
   * @param acctId {String} The account ID of the account that this application belongs to.
   * @param groups {Array.<String>} An array of Security Group IDs. The application belongs to each Security Group in this array.
   * @param defaultGroup {String} The default group of this application. This is the group where security objects will be created by default by this application.
   * @param enabled {Boolean} Whether this application is enabled.
   * @param appType {String} The user-defined type of this application.
   * @param regions {Array.<String>} The list of regions this application may run in.
   * @param creator {module:model/CreatorType} 
   * @param createdAt {String} When this application was created.
   */
  var exports = function(name, appId, authType, acctId, groups, defaultGroup, enabled, appType, regions, creator, createdAt) {
    var _this = this;

    _this['name'] = name;
    _this['app_id'] = appId;
    _this['auth_type'] = authType;


    _this['acct_id'] = acctId;
    _this['groups'] = groups;
    _this['default_group'] = defaultGroup;
    _this['enabled'] = enabled;
    _this['app_type'] = appType;
    _this['regions'] = regions;
    _this['creator'] = creator;
    _this['created_at'] = createdAt;

  };

  /**
   * Constructs a <code>App</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/App} obj Optional instance to populate.
   * @return {module:model/App} The populated <code>App</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('app_id')) {
        obj['app_id'] = ApiClient.convertToType(data['app_id'], 'String');
      }
      if (data.hasOwnProperty('auth_type')) {
        obj['auth_type'] = AppAuthType.constructFromObject(data['auth_type']);
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('interface')) {
        obj['interface'] = ApiClient.convertToType(data['interface'], 'String');
      }
      if (data.hasOwnProperty('acct_id')) {
        obj['acct_id'] = ApiClient.convertToType(data['acct_id'], 'String');
      }
      if (data.hasOwnProperty('groups')) {
        obj['groups'] = ApiClient.convertToType(data['groups'], ['String']);
      }
      if (data.hasOwnProperty('default_group')) {
        obj['default_group'] = ApiClient.convertToType(data['default_group'], 'String');
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('app_type')) {
        obj['app_type'] = ApiClient.convertToType(data['app_type'], 'String');
      }
      if (data.hasOwnProperty('regions')) {
        obj['regions'] = ApiClient.convertToType(data['regions'], ['String']);
      }
      if (data.hasOwnProperty('creator')) {
        obj['creator'] = CreatorType.constructFromObject(data['creator']);
      }
      if (data.hasOwnProperty('created_at')) {
        obj['created_at'] = ApiClient.convertToType(data['created_at'], 'String');
      }
      if (data.hasOwnProperty('lastused_at')) {
        obj['lastused_at'] = ApiClient.convertToType(data['lastused_at'], 'String');
      }
    }
    return obj;
  }

  /**
   * Name of the application. Application names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Application ID uniquely identifying this application.
   * @member {String} app_id
   */
  exports.prototype['app_id'] = undefined;
  /**
   * @member {module:model/AppAuthType} auth_type
   */
  exports.prototype['auth_type'] = undefined;
  /**
   * Description of this application.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Interface used with this application (PKCS11, CNG, JCE, KMIP, etc.).
   * @member {String} interface
   */
  exports.prototype['interface'] = undefined;
  /**
   * The account ID of the account that this application belongs to.
   * @member {String} acct_id
   */
  exports.prototype['acct_id'] = undefined;
  /**
   * An array of Security Group IDs. The application belongs to each Security Group in this array.
   * @member {Array.<String>} groups
   */
  exports.prototype['groups'] = undefined;
  /**
   * The default group of this application. This is the group where security objects will be created by default by this application.
   * @member {String} default_group
   */
  exports.prototype['default_group'] = undefined;
  /**
   * Whether this application is enabled.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * The user-defined type of this application.
   * @member {String} app_type
   */
  exports.prototype['app_type'] = undefined;
  /**
   * The list of regions this application may run in.
   * @member {Array.<String>} regions
   */
  exports.prototype['regions'] = undefined;
  /**
   * @member {module:model/CreatorType} creator
   */
  exports.prototype['creator'] = undefined;
  /**
   * When this application was created.
   * @member {String} created_at
   */
  exports.prototype['created_at'] = undefined;
  /**
   * When this application was last used.
   * @member {String} lastused_at
   */
  exports.prototype['lastused_at'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./AppAuthType":42,"./CreatorType":74}],42:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AppAuthType = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class AppAuthType.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "Secret"
     * @const
     */
    "Secret": "Secret",
    /**
     * value: "Certificate"
     * @const
     */
    "Certificate": "Certificate"  };

  /**
   * Returns a <code>AppAuthType</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/AppAuthType} The enum <code>AppAuthType</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],43:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AppCredential = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The AppCredential model module.
   * @module model/AppCredential
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>AppCredential</code>.
   * Credential for an application.
   * @alias module:model/AppCredential
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>AppCredential</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AppCredential} obj Optional instance to populate.
   * @return {module:model/AppCredential} The populated <code>AppCredential</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('secret')) {
        obj['secret'] = ApiClient.convertToType(data['secret'], 'String');
      }
      if (data.hasOwnProperty('certificate')) {
        obj['certificate'] = ApiClient.convertToType(data['certificate'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} secret
   */
  exports.prototype['secret'] = undefined;
  /**
   * @member {String} certificate
   */
  exports.prototype['certificate'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],44:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AppCredential'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./AppCredential'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AppCredentialResponse = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AppCredential);
  }
}(this, function(ApiClient, AppCredential) {
  'use strict';




  /**
   * The AppCredentialResponse model module.
   * @module model/AppCredentialResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>AppCredentialResponse</code>.
   * @alias module:model/AppCredentialResponse
   * @class
   * @param appId {String} Uuid format string, example - a41152ed-c26e-4c6e-a8d1-8820e36972c3
   * @param credential {module:model/AppCredential} 
   */
  var exports = function(appId, credential) {
    var _this = this;

    _this['app_id'] = appId;
    _this['credential'] = credential;
  };

  /**
   * Constructs a <code>AppCredentialResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AppCredentialResponse} obj Optional instance to populate.
   * @return {module:model/AppCredentialResponse} The populated <code>AppCredentialResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('app_id')) {
        obj['app_id'] = ApiClient.convertToType(data['app_id'], 'String');
      }
      if (data.hasOwnProperty('credential')) {
        obj['credential'] = AppCredential.constructFromObject(data['credential']);
      }
    }
    return obj;
  }

  /**
   * Uuid format string, example - a41152ed-c26e-4c6e-a8d1-8820e36972c3
   * @member {String} app_id
   */
  exports.prototype['app_id'] = undefined;
  /**
   * @member {module:model/AppCredential} credential
   */
  exports.prototype['credential'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./AppCredential":43}],45:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AppCredential'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./AppCredential'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AppRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AppCredential);
  }
}(this, function(ApiClient, AppCredential) {
  'use strict';




  /**
   * The AppRequest model module.
   * @module model/AppRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>AppRequest</code>.
   * @alias module:model/AppRequest
   * @class
   * @param name {String} Name of this application. Application names must be unique within an account.
   * @param addGroups {Array.<String>} An array of Security Group IDs to add to this application.
   * @param defaultGroup {String} The default group of this application. This is the group where security objects will be created by default by this application.
   */
  var exports = function(name, addGroups, defaultGroup) {
    var _this = this;

    _this['name'] = name;

    _this['add_groups'] = addGroups;

    _this['default_group'] = defaultGroup;



  };

  /**
   * Constructs a <code>AppRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AppRequest} obj Optional instance to populate.
   * @return {module:model/AppRequest} The populated <code>AppRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('add_groups')) {
        obj['add_groups'] = ApiClient.convertToType(data['add_groups'], ['String']);
      }
      if (data.hasOwnProperty('del_groups')) {
        obj['del_groups'] = ApiClient.convertToType(data['del_groups'], ['String']);
      }
      if (data.hasOwnProperty('default_group')) {
        obj['default_group'] = ApiClient.convertToType(data['default_group'], 'String');
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('app_type')) {
        obj['app_type'] = ApiClient.convertToType(data['app_type'], 'String');
      }
      if (data.hasOwnProperty('credential')) {
        obj['credential'] = AppCredential.constructFromObject(data['credential']);
      }
    }
    return obj;
  }

  /**
   * Name of this application. Application names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Description of this application.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * An array of Security Group IDs to add to this application.
   * @member {Array.<String>} add_groups
   */
  exports.prototype['add_groups'] = undefined;
  /**
   * An array of security group IDs to remove from this application.
   * @member {Array.<String>} del_groups
   */
  exports.prototype['del_groups'] = undefined;
  /**
   * The default group of this application. This is the group where security objects will be created by default by this application.
   * @member {String} default_group
   */
  exports.prototype['default_group'] = undefined;
  /**
   * Whether this application is enabled
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * The user-defined type of this application.
   * @member {String} app_type
   */
  exports.prototype['app_type'] = undefined;
  /**
   * @member {module:model/AppCredential} credential
   */
  exports.prototype['credential'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./AppCredential":43}],46:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ApprovableResult = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ApprovableResult model module.
   * @module model/ApprovableResult
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ApprovableResult</code>.
   * @alias module:model/ApprovableResult
   * @class
   * @param status {Number} The HTTP status code for this partial request.
   * @param body {Object} 
   */
  var exports = function(status, body) {
    var _this = this;

    _this['status'] = status;
    _this['body'] = body;
  };

  /**
   * Constructs a <code>ApprovableResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ApprovableResult} obj Optional instance to populate.
   * @return {module:model/ApprovableResult} The populated <code>ApprovableResult</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'Number');
      }
      if (data.hasOwnProperty('body')) {
        obj['body'] = ApiClient.convertToType(data['body'], Object);
      }
    }
    return obj;
  }

  /**
   * The HTTP status code for this partial request.
   * @member {Number} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {Object} body
   */
  exports.prototype['body'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],47:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/ApprovalStatus', 'model/ApprovalSubject', 'model/Entity'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./ApprovalStatus'), require('./ApprovalSubject'), require('./Entity'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ApprovalRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.ApprovalStatus, root.FortanixSdkmsRestApi.ApprovalSubject, root.FortanixSdkmsRestApi.Entity);
  }
}(this, function(ApiClient, ApprovalStatus, ApprovalSubject, Entity) {
  'use strict';




  /**
   * The ApprovalRequest model module.
   * @module model/ApprovalRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ApprovalRequest</code>.
   * @alias module:model/ApprovalRequest
   * @class
   * @param requestId {String} UUID uniquely identifying this approval request.
   * @param requester {module:model/Entity} 
   * @param createdAt {String} When this approval request was created.
   * @param acctId {String} The account ID of the account that this approval request belongs to.
   * @param operation {String} Operation URL path, e.g. `/crypto/v1/keys`, `/crypto/v1/groups/<id>`.
   * @param method {String} Method for the operation: POST, PATCH, PUT, DELETE, or GET. Default is POST. 
   * @param body {Object} 
   * @param approvers {Array.<module:model/Entity>} 
   * @param denier {module:model/Entity} 
   * @param status {module:model/ApprovalStatus} 
   * @param reviewers {Array.<module:model/Entity>} 
   * @param subjects {Array.<module:model/ApprovalSubject>} 
   * @param expiry {String} When this approval request expires.
   */
  var exports = function(requestId, requester, createdAt, acctId, operation, method, body, approvers, denier, status, reviewers, subjects, expiry) {
    var _this = this;

    _this['request_id'] = requestId;
    _this['requester'] = requester;
    _this['created_at'] = createdAt;
    _this['acct_id'] = acctId;
    _this['operation'] = operation;
    _this['method'] = method;
    _this['body'] = body;
    _this['approvers'] = approvers;
    _this['denier'] = denier;
    _this['status'] = status;
    _this['reviewers'] = reviewers;
    _this['subjects'] = subjects;

    _this['expiry'] = expiry;
  };

  /**
   * Constructs a <code>ApprovalRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ApprovalRequest} obj Optional instance to populate.
   * @return {module:model/ApprovalRequest} The populated <code>ApprovalRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('request_id')) {
        obj['request_id'] = ApiClient.convertToType(data['request_id'], 'String');
      }
      if (data.hasOwnProperty('requester')) {
        obj['requester'] = Entity.constructFromObject(data['requester']);
      }
      if (data.hasOwnProperty('created_at')) {
        obj['created_at'] = ApiClient.convertToType(data['created_at'], 'String');
      }
      if (data.hasOwnProperty('acct_id')) {
        obj['acct_id'] = ApiClient.convertToType(data['acct_id'], 'String');
      }
      if (data.hasOwnProperty('operation')) {
        obj['operation'] = ApiClient.convertToType(data['operation'], 'String');
      }
      if (data.hasOwnProperty('method')) {
        obj['method'] = ApiClient.convertToType(data['method'], 'String');
      }
      if (data.hasOwnProperty('body')) {
        obj['body'] = ApiClient.convertToType(data['body'], Object);
      }
      if (data.hasOwnProperty('approvers')) {
        obj['approvers'] = ApiClient.convertToType(data['approvers'], [Entity]);
      }
      if (data.hasOwnProperty('denier')) {
        obj['denier'] = Entity.constructFromObject(data['denier']);
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApprovalStatus.constructFromObject(data['status']);
      }
      if (data.hasOwnProperty('reviewers')) {
        obj['reviewers'] = ApiClient.convertToType(data['reviewers'], [Entity]);
      }
      if (data.hasOwnProperty('subjects')) {
        obj['subjects'] = ApiClient.convertToType(data['subjects'], [ApprovalSubject]);
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('expiry')) {
        obj['expiry'] = ApiClient.convertToType(data['expiry'], 'String');
      }
    }
    return obj;
  }

  /**
   * UUID uniquely identifying this approval request.
   * @member {String} request_id
   */
  exports.prototype['request_id'] = undefined;
  /**
   * @member {module:model/Entity} requester
   */
  exports.prototype['requester'] = undefined;
  /**
   * When this approval request was created.
   * @member {String} created_at
   */
  exports.prototype['created_at'] = undefined;
  /**
   * The account ID of the account that this approval request belongs to.
   * @member {String} acct_id
   */
  exports.prototype['acct_id'] = undefined;
  /**
   * Operation URL path, e.g. `/crypto/v1/keys`, `/crypto/v1/groups/<id>`.
   * @member {String} operation
   */
  exports.prototype['operation'] = undefined;
  /**
   * Method for the operation: POST, PATCH, PUT, DELETE, or GET. Default is POST. 
   * @member {String} method
   */
  exports.prototype['method'] = undefined;
  /**
   * @member {Object} body
   */
  exports.prototype['body'] = undefined;
  /**
   * @member {Array.<module:model/Entity>} approvers
   */
  exports.prototype['approvers'] = undefined;
  /**
   * @member {module:model/Entity} denier
   */
  exports.prototype['denier'] = undefined;
  /**
   * @member {module:model/ApprovalStatus} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {Array.<module:model/Entity>} reviewers
   */
  exports.prototype['reviewers'] = undefined;
  /**
   * @member {Array.<module:model/ApprovalSubject>} subjects
   */
  exports.prototype['subjects'] = undefined;
  /**
   * Optional comment about the approval request for the reviewer.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * When this approval request expires.
   * @member {String} expiry
   */
  exports.prototype['expiry'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./ApprovalStatus":49,"./ApprovalSubject":50,"./Entity":107}],48:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ApprovalRequestRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ApprovalRequestRequest model module.
   * @module model/ApprovalRequestRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ApprovalRequestRequest</code>.
   * @alias module:model/ApprovalRequestRequest
   * @class
   * @param operation {String} Operation URL path, e.g. `/crypto/v1/keys`, `/crypto/v1/groups/<id>`.
   */
  var exports = function(operation) {
    var _this = this;

    _this['operation'] = operation;



  };

  /**
   * Constructs a <code>ApprovalRequestRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ApprovalRequestRequest} obj Optional instance to populate.
   * @return {module:model/ApprovalRequestRequest} The populated <code>ApprovalRequestRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('operation')) {
        obj['operation'] = ApiClient.convertToType(data['operation'], 'String');
      }
      if (data.hasOwnProperty('method')) {
        obj['method'] = ApiClient.convertToType(data['method'], 'String');
      }
      if (data.hasOwnProperty('body')) {
        obj['body'] = ApiClient.convertToType(data['body'], Object);
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
    }
    return obj;
  }

  /**
   * Operation URL path, e.g. `/crypto/v1/keys`, `/crypto/v1/groups/<id>`.
   * @member {String} operation
   */
  exports.prototype['operation'] = undefined;
  /**
   * Method for the operation: POST, PATCH, PUT, DELETE, or GET. Default is POST. 
   * @member {String} method
   */
  exports.prototype['method'] = undefined;
  /**
   * @member {Object} body
   */
  exports.prototype['body'] = undefined;
  /**
   * Optional comment about the approval request for the reviewer.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],49:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ApprovalStatus = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class ApprovalStatus.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "PENDING"
     * @const
     */
    "PENDING": "PENDING",
    /**
     * value: "APPROVED"
     * @const
     */
    "APPROVED": "APPROVED",
    /**
     * value: "DENIED"
     * @const
     */
    "DENIED": "DENIED",
    /**
     * value: "FAILED"
     * @const
     */
    "FAILED": "FAILED"  };

  /**
   * Returns a <code>ApprovalStatus</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/ApprovalStatus} The enum <code>ApprovalStatus</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],50:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ApprovalSubject = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ApprovalSubject model module.
   * @module model/ApprovalSubject
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ApprovalSubject</code>.
   * Identifies an object acted upon by an approval request.
   * @alias module:model/ApprovalSubject
   * @class
   */
  var exports = function() {
    var _this = this;





  };

  /**
   * Constructs a <code>ApprovalSubject</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ApprovalSubject} obj Optional instance to populate.
   * @return {module:model/ApprovalSubject} The populated <code>ApprovalSubject</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('group')) {
        obj['group'] = ApiClient.convertToType(data['group'], 'String');
      }
      if (data.hasOwnProperty('sobject')) {
        obj['sobject'] = ApiClient.convertToType(data['sobject'], 'String');
      }
      if (data.hasOwnProperty('app')) {
        obj['app'] = ApiClient.convertToType(data['app'], 'String');
      }
      if (data.hasOwnProperty('plugin')) {
        obj['plugin'] = ApiClient.convertToType(data['plugin'], 'String');
      }
    }
    return obj;
  }

  /**
   * The ID of the group being acted upon, if the subject is a group.
   * @member {String} group
   */
  exports.prototype['group'] = undefined;
  /**
   * The ID of the security object being acted upon, if the subject is a security object.
   * @member {String} sobject
   */
  exports.prototype['sobject'] = undefined;
  /**
   * The ID of the app being acted upon, if the subject is a app.
   * @member {String} app
   */
  exports.prototype['app'] = undefined;
  /**
   * The ID of the plugin being acted upon, if the subject is a app.
   * @member {String} plugin
   */
  exports.prototype['plugin'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],51:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AuditLogResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The AuditLogResponse model module.
   * @module model/AuditLogResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>AuditLogResponse</code>.
   * @alias module:model/AuditLogResponse
   * @class
   * @param actionType {String} Type of action performed.
   * @param actorType {String} Type of entity performing action.
   * @param message {String} Audit log message.
   * @param severity {String} Severity of audit log message.
   * @param time {String} Time that action occurred.
   * @param objectId {String} ID of object acted upon.
   * @param actorId {String} ID of entity performing action.
   * @param acctId {String} Account ID of the account this audit log applies to.
   * @param groupIds {Array.<String>} 
   */
  var exports = function(actionType, actorType, message, severity, time, objectId, actorId, acctId, groupIds) {
    var _this = this;

    _this['action_type'] = actionType;
    _this['actor_type'] = actorType;
    _this['message'] = message;
    _this['severity'] = severity;
    _this['time'] = time;
    _this['object_id'] = objectId;
    _this['actor_id'] = actorId;
    _this['acct_id'] = acctId;
    _this['group_ids'] = groupIds;
  };

  /**
   * Constructs a <code>AuditLogResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AuditLogResponse} obj Optional instance to populate.
   * @return {module:model/AuditLogResponse} The populated <code>AuditLogResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('action_type')) {
        obj['action_type'] = ApiClient.convertToType(data['action_type'], 'String');
      }
      if (data.hasOwnProperty('actor_type')) {
        obj['actor_type'] = ApiClient.convertToType(data['actor_type'], 'String');
      }
      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
      if (data.hasOwnProperty('severity')) {
        obj['severity'] = ApiClient.convertToType(data['severity'], 'String');
      }
      if (data.hasOwnProperty('time')) {
        obj['time'] = ApiClient.convertToType(data['time'], 'String');
      }
      if (data.hasOwnProperty('object_id')) {
        obj['object_id'] = ApiClient.convertToType(data['object_id'], 'String');
      }
      if (data.hasOwnProperty('actor_id')) {
        obj['actor_id'] = ApiClient.convertToType(data['actor_id'], 'String');
      }
      if (data.hasOwnProperty('acct_id')) {
        obj['acct_id'] = ApiClient.convertToType(data['acct_id'], 'String');
      }
      if (data.hasOwnProperty('group_ids')) {
        obj['group_ids'] = ApiClient.convertToType(data['group_ids'], ['String']);
      }
    }
    return obj;
  }

  /**
   * Type of action performed.
   * @member {String} action_type
   */
  exports.prototype['action_type'] = undefined;
  /**
   * Type of entity performing action.
   * @member {String} actor_type
   */
  exports.prototype['actor_type'] = undefined;
  /**
   * Audit log message.
   * @member {String} message
   */
  exports.prototype['message'] = undefined;
  /**
   * Severity of audit log message.
   * @member {String} severity
   */
  exports.prototype['severity'] = undefined;
  /**
   * Time that action occurred.
   * @member {String} time
   */
  exports.prototype['time'] = undefined;
  /**
   * ID of object acted upon.
   * @member {String} object_id
   */
  exports.prototype['object_id'] = undefined;
  /**
   * ID of entity performing action.
   * @member {String} actor_id
   */
  exports.prototype['actor_id'] = undefined;
  /**
   * Account ID of the account this audit log applies to.
   * @member {String} acct_id
   */
  exports.prototype['acct_id'] = undefined;
  /**
   * @member {Array.<String>} group_ids
   */
  exports.prototype['group_ids'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],52:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AuthConfigPassword'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./AuthConfigPassword'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AuthConfig = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.AuthConfigPassword);
  }
}(this, function(ApiClient, AuthConfigPassword) {
  'use strict';




  /**
   * The AuthConfig model module.
   * @module model/AuthConfig
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>AuthConfig</code>.
   * @alias module:model/AuthConfig
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>AuthConfig</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AuthConfig} obj Optional instance to populate.
   * @return {module:model/AuthConfig} The populated <code>AuthConfig</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('password')) {
        obj['password'] = AuthConfigPassword.constructFromObject(data['password']);
      }
      if (data.hasOwnProperty('saml')) {
        obj['saml'] = ApiClient.convertToType(data['saml'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/AuthConfigPassword} password
   */
  exports.prototype['password'] = undefined;
  /**
   * XML metadata for a SAML 2.0 Identity Provider (IdP).
   * @member {String} saml
   */
  exports.prototype['saml'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./AuthConfigPassword":53}],53:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AuthConfigPassword = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The AuthConfigPassword model module.
   * @module model/AuthConfigPassword
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>AuthConfigPassword</code>.
   * Configuration for password-based authentication.
   * @alias module:model/AuthConfigPassword
   * @class
   * @param require2fa {Boolean} Reserved for future use, must be false.
   * @param administratorsOnly {Boolean} Reserved for future use, must be false.
   */
  var exports = function(require2fa, administratorsOnly) {
    var _this = this;

    _this['require_2fa'] = require2fa;
    _this['administrators_only'] = administratorsOnly;
  };

  /**
   * Constructs a <code>AuthConfigPassword</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AuthConfigPassword} obj Optional instance to populate.
   * @return {module:model/AuthConfigPassword} The populated <code>AuthConfigPassword</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('require_2fa')) {
        obj['require_2fa'] = ApiClient.convertToType(data['require_2fa'], 'Boolean');
      }
      if (data.hasOwnProperty('administrators_only')) {
        obj['administrators_only'] = ApiClient.convertToType(data['administrators_only'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * Reserved for future use, must be false.
   * @member {Boolean} require_2fa
   */
  exports.prototype['require_2fa'] = undefined;
  /**
   * Reserved for future use, must be false.
   * @member {Boolean} administrators_only
   */
  exports.prototype['administrators_only'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],54:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AuthResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The AuthResponse model module.
   * @module model/AuthResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>AuthResponse</code>.
   * @alias module:model/AuthResponse
   * @class
   * @param expiresIn {Number} Number of seconds from token issuance that the token will expire.
   * @param accessToken {String} Bearer token to be used to authenticate to other APIs.
   * @param entityId {String} The UUID of the entity that was authorized. For users, this will be the user's UUID. For applications, this will be the application's UUID. 
   */
  var exports = function(expiresIn, accessToken, entityId) {
    var _this = this;

    _this['expires_in'] = expiresIn;
    _this['access_token'] = accessToken;
    _this['entity_id'] = entityId;
  };

  /**
   * Constructs a <code>AuthResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AuthResponse} obj Optional instance to populate.
   * @return {module:model/AuthResponse} The populated <code>AuthResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('expires_in')) {
        obj['expires_in'] = ApiClient.convertToType(data['expires_in'], 'Number');
      }
      if (data.hasOwnProperty('access_token')) {
        obj['access_token'] = ApiClient.convertToType(data['access_token'], 'String');
      }
      if (data.hasOwnProperty('entity_id')) {
        obj['entity_id'] = ApiClient.convertToType(data['entity_id'], 'String');
      }
    }
    return obj;
  }

  /**
   * Number of seconds from token issuance that the token will expire.
   * @member {Number} expires_in
   */
  exports.prototype['expires_in'] = undefined;
  /**
   * Bearer token to be used to authenticate to other APIs.
   * @member {String} access_token
   */
  exports.prototype['access_token'] = undefined;
  /**
   * The UUID of the entity that was authorized. For users, this will be the user's UUID. For applications, this will be the application's UUID. 
   * @member {String} entity_id
   */
  exports.prototype['entity_id'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],55:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.AuthType = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class AuthType.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "Fortanix"
     * @const
     */
    "Fortanix": "Fortanix",
    /**
     * value: "FortanixMFA"
     * @const
     */
    "FortanixMFA": "FortanixMFA",
    /**
     * value: "External"
     * @const
     */
    "External": "External"  };

  /**
   * Returns a <code>AuthType</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/AuthType} The enum <code>AuthType</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],56:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/BatchDecryptRequestInner'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./BatchDecryptRequestInner'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchDecryptRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.BatchDecryptRequestInner);
  }
}(this, function(ApiClient, BatchDecryptRequestInner) {
  'use strict';




  /**
   * The BatchDecryptRequest model module.
   * @module model/BatchDecryptRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchDecryptRequest</code>.
   * @alias module:model/BatchDecryptRequest
   * @class
   * @extends Array
   */
  var exports = function() {
    var _this = this;
    _this = new Array();
    Object.setPrototypeOf(_this, exports);

    return _this;
  };

  /**
   * Constructs a <code>BatchDecryptRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchDecryptRequest} obj Optional instance to populate.
   * @return {module:model/BatchDecryptRequest} The populated <code>BatchDecryptRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      ApiClient.constructFromObject(data, obj, 'BatchDecryptRequestInner');

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18,"./BatchDecryptRequestInner":57}],57:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DecryptRequest'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DecryptRequest'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchDecryptRequestInner = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DecryptRequest);
  }
}(this, function(ApiClient, DecryptRequest) {
  'use strict';




  /**
   * The BatchDecryptRequestInner model module.
   * @module model/BatchDecryptRequestInner
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchDecryptRequestInner</code>.
   * @alias module:model/BatchDecryptRequestInner
   * @class
   * @param kid {String} Key ID (not name or description) of the key to use to decrypt request. 
   * @param request {module:model/DecryptRequest} 
   */
  var exports = function(kid, request) {
    var _this = this;

    _this['kid'] = kid;
    _this['request'] = request;
  };

  /**
   * Constructs a <code>BatchDecryptRequestInner</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchDecryptRequestInner} obj Optional instance to populate.
   * @return {module:model/BatchDecryptRequestInner} The populated <code>BatchDecryptRequestInner</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('request')) {
        obj['request'] = DecryptRequest.constructFromObject(data['request']);
      }
    }
    return obj;
  }

  /**
   * Key ID (not name or description) of the key to use to decrypt request. 
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * @member {module:model/DecryptRequest} request
   */
  exports.prototype['request'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DecryptRequest":82}],58:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/BatchDecryptResponseInner'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./BatchDecryptResponseInner'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchDecryptResponse = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.BatchDecryptResponseInner);
  }
}(this, function(ApiClient, BatchDecryptResponseInner) {
  'use strict';




  /**
   * The BatchDecryptResponse model module.
   * @module model/BatchDecryptResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchDecryptResponse</code>.
   * @alias module:model/BatchDecryptResponse
   * @class
   * @extends Array
   */
  var exports = function() {
    var _this = this;
    _this = new Array();
    Object.setPrototypeOf(_this, exports);

    return _this;
  };

  /**
   * Constructs a <code>BatchDecryptResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchDecryptResponse} obj Optional instance to populate.
   * @return {module:model/BatchDecryptResponse} The populated <code>BatchDecryptResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      ApiClient.constructFromObject(data, obj, 'BatchDecryptResponseInner');

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18,"./BatchDecryptResponseInner":59}],59:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DecryptResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DecryptResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchDecryptResponseInner = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DecryptResponse);
  }
}(this, function(ApiClient, DecryptResponse) {
  'use strict';




  /**
   * The BatchDecryptResponseInner model module.
   * @module model/BatchDecryptResponseInner
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchDecryptResponseInner</code>.
   * @alias module:model/BatchDecryptResponseInner
   * @class
   * @param status {Number} The HTTP status code for this partial request.
   */
  var exports = function(status) {
    var _this = this;

    _this['status'] = status;


  };

  /**
   * Constructs a <code>BatchDecryptResponseInner</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchDecryptResponseInner} obj Optional instance to populate.
   * @return {module:model/BatchDecryptResponseInner} The populated <code>BatchDecryptResponseInner</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'Number');
      }
      if (data.hasOwnProperty('error')) {
        obj['error'] = ApiClient.convertToType(data['error'], 'String');
      }
      if (data.hasOwnProperty('body')) {
        obj['body'] = DecryptResponse.constructFromObject(data['body']);
      }
    }
    return obj;
  }

  /**
   * The HTTP status code for this partial request.
   * @member {Number} status
   */
  exports.prototype['status'] = undefined;
  /**
   * When the status property indicates an error, this contains the error message.
   * @member {String} error
   */
  exports.prototype['error'] = undefined;
  /**
   * @member {module:model/DecryptResponse} body
   */
  exports.prototype['body'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DecryptResponse":84}],60:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/BatchEncryptRequestInner'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./BatchEncryptRequestInner'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchEncryptRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.BatchEncryptRequestInner);
  }
}(this, function(ApiClient, BatchEncryptRequestInner) {
  'use strict';




  /**
   * The BatchEncryptRequest model module.
   * @module model/BatchEncryptRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchEncryptRequest</code>.
   * @alias module:model/BatchEncryptRequest
   * @class
   * @extends Array
   */
  var exports = function() {
    var _this = this;
    _this = new Array();
    Object.setPrototypeOf(_this, exports);

    return _this;
  };

  /**
   * Constructs a <code>BatchEncryptRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchEncryptRequest} obj Optional instance to populate.
   * @return {module:model/BatchEncryptRequest} The populated <code>BatchEncryptRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      ApiClient.constructFromObject(data, obj, 'BatchEncryptRequestInner');

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18,"./BatchEncryptRequestInner":61}],61:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/EncryptRequest'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./EncryptRequest'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchEncryptRequestInner = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.EncryptRequest);
  }
}(this, function(ApiClient, EncryptRequest) {
  'use strict';




  /**
   * The BatchEncryptRequestInner model module.
   * @module model/BatchEncryptRequestInner
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchEncryptRequestInner</code>.
   * @alias module:model/BatchEncryptRequestInner
   * @class
   * @param kid {String} Key ID (not name or description) of the key to use to encrypt request. 
   * @param request {module:model/EncryptRequest} 
   */
  var exports = function(kid, request) {
    var _this = this;

    _this['kid'] = kid;
    _this['request'] = request;
  };

  /**
   * Constructs a <code>BatchEncryptRequestInner</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchEncryptRequestInner} obj Optional instance to populate.
   * @return {module:model/BatchEncryptRequestInner} The populated <code>BatchEncryptRequestInner</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('request')) {
        obj['request'] = EncryptRequest.constructFromObject(data['request']);
      }
    }
    return obj;
  }

  /**
   * Key ID (not name or description) of the key to use to encrypt request. 
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * @member {module:model/EncryptRequest} request
   */
  exports.prototype['request'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./EncryptRequest":101}],62:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/BatchEncryptResponseInner'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./BatchEncryptResponseInner'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchEncryptResponse = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.BatchEncryptResponseInner);
  }
}(this, function(ApiClient, BatchEncryptResponseInner) {
  'use strict';




  /**
   * The BatchEncryptResponse model module.
   * @module model/BatchEncryptResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchEncryptResponse</code>.
   * @alias module:model/BatchEncryptResponse
   * @class
   * @extends Array
   */
  var exports = function() {
    var _this = this;
    _this = new Array();
    Object.setPrototypeOf(_this, exports);

    return _this;
  };

  /**
   * Constructs a <code>BatchEncryptResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchEncryptResponse} obj Optional instance to populate.
   * @return {module:model/BatchEncryptResponse} The populated <code>BatchEncryptResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      ApiClient.constructFromObject(data, obj, 'BatchEncryptResponseInner');

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18,"./BatchEncryptResponseInner":63}],63:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/EncryptResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./EncryptResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchEncryptResponseInner = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.EncryptResponse);
  }
}(this, function(ApiClient, EncryptResponse) {
  'use strict';




  /**
   * The BatchEncryptResponseInner model module.
   * @module model/BatchEncryptResponseInner
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchEncryptResponseInner</code>.
   * @alias module:model/BatchEncryptResponseInner
   * @class
   * @param status {Number} The HTTP status code for this partial request.
   */
  var exports = function(status) {
    var _this = this;

    _this['status'] = status;


  };

  /**
   * Constructs a <code>BatchEncryptResponseInner</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchEncryptResponseInner} obj Optional instance to populate.
   * @return {module:model/BatchEncryptResponseInner} The populated <code>BatchEncryptResponseInner</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'Number');
      }
      if (data.hasOwnProperty('error')) {
        obj['error'] = ApiClient.convertToType(data['error'], 'String');
      }
      if (data.hasOwnProperty('body')) {
        obj['body'] = EncryptResponse.constructFromObject(data['body']);
      }
    }
    return obj;
  }

  /**
   * The HTTP status code for this partial request.
   * @member {Number} status
   */
  exports.prototype['status'] = undefined;
  /**
   * When the status property indicates an error, this contains the error message.
   * @member {String} error
   */
  exports.prototype['error'] = undefined;
  /**
   * @member {module:model/EncryptResponse} body
   */
  exports.prototype['body'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./EncryptResponse":103}],64:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/SignRequestEx'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./SignRequestEx'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchSignRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.SignRequestEx);
  }
}(this, function(ApiClient, SignRequestEx) {
  'use strict';




  /**
   * The BatchSignRequest model module.
   * @module model/BatchSignRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchSignRequest</code>.
   * Array of Sign requests to be performed in batch 
   * @alias module:model/BatchSignRequest
   * @class
   * @extends Array
   */
  var exports = function() {
    var _this = this;
    _this = new Array();
    Object.setPrototypeOf(_this, exports);

    return _this;
  };

  /**
   * Constructs a <code>BatchSignRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchSignRequest} obj Optional instance to populate.
   * @return {module:model/BatchSignRequest} The populated <code>BatchSignRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      ApiClient.constructFromObject(data, obj, 'SignRequestEx');

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18,"./SignRequestEx":160}],65:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/BatchSignResponseInner'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./BatchSignResponseInner'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchSignResponse = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.BatchSignResponseInner);
  }
}(this, function(ApiClient, BatchSignResponseInner) {
  'use strict';




  /**
   * The BatchSignResponse model module.
   * @module model/BatchSignResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchSignResponse</code>.
   * @alias module:model/BatchSignResponse
   * @class
   * @extends Array
   */
  var exports = function() {
    var _this = this;
    _this = new Array();
    Object.setPrototypeOf(_this, exports);

    return _this;
  };

  /**
   * Constructs a <code>BatchSignResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchSignResponse} obj Optional instance to populate.
   * @return {module:model/BatchSignResponse} The populated <code>BatchSignResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      ApiClient.constructFromObject(data, obj, 'BatchSignResponseInner');

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18,"./BatchSignResponseInner":66}],66:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/SignResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./SignResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchSignResponseInner = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.SignResponse);
  }
}(this, function(ApiClient, SignResponse) {
  'use strict';




  /**
   * The BatchSignResponseInner model module.
   * @module model/BatchSignResponseInner
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchSignResponseInner</code>.
   * @alias module:model/BatchSignResponseInner
   * @class
   * @param status {Number} The HTTP status code for this partial request.
   */
  var exports = function(status) {
    var _this = this;

    _this['status'] = status;


  };

  /**
   * Constructs a <code>BatchSignResponseInner</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchSignResponseInner} obj Optional instance to populate.
   * @return {module:model/BatchSignResponseInner} The populated <code>BatchSignResponseInner</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'Number');
      }
      if (data.hasOwnProperty('error')) {
        obj['error'] = ApiClient.convertToType(data['error'], 'String');
      }
      if (data.hasOwnProperty('body')) {
        obj['body'] = SignResponse.constructFromObject(data['body']);
      }
    }
    return obj;
  }

  /**
   * The HTTP status code for this partial request.
   * @member {Number} status
   */
  exports.prototype['status'] = undefined;
  /**
   * When the status property indicates an error, this contains the error message.
   * @member {String} error
   */
  exports.prototype['error'] = undefined;
  /**
   * @member {module:model/SignResponse} body
   */
  exports.prototype['body'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./SignResponse":161}],67:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/VerifyRequestEx'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./VerifyRequestEx'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchVerifyRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.VerifyRequestEx);
  }
}(this, function(ApiClient, VerifyRequestEx) {
  'use strict';




  /**
   * The BatchVerifyRequest model module.
   * @module model/BatchVerifyRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchVerifyRequest</code>.
   * Array of Verify requests to be performed in batch 
   * @alias module:model/BatchVerifyRequest
   * @class
   * @extends Array
   */
  var exports = function() {
    var _this = this;
    _this = new Array();
    Object.setPrototypeOf(_this, exports);

    return _this;
  };

  /**
   * Constructs a <code>BatchVerifyRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchVerifyRequest} obj Optional instance to populate.
   * @return {module:model/BatchVerifyRequest} The populated <code>BatchVerifyRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      ApiClient.constructFromObject(data, obj, 'VerifyRequestEx');

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18,"./VerifyRequestEx":195}],68:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/BatchVerifyResponseInner'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./BatchVerifyResponseInner'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchVerifyResponse = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.BatchVerifyResponseInner);
  }
}(this, function(ApiClient, BatchVerifyResponseInner) {
  'use strict';




  /**
   * The BatchVerifyResponse model module.
   * @module model/BatchVerifyResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchVerifyResponse</code>.
   * @alias module:model/BatchVerifyResponse
   * @class
   * @extends Array
   */
  var exports = function() {
    var _this = this;
    _this = new Array();
    Object.setPrototypeOf(_this, exports);

    return _this;
  };

  /**
   * Constructs a <code>BatchVerifyResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchVerifyResponse} obj Optional instance to populate.
   * @return {module:model/BatchVerifyResponse} The populated <code>BatchVerifyResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      ApiClient.constructFromObject(data, obj, 'BatchVerifyResponseInner');

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18,"./BatchVerifyResponseInner":69}],69:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/VerifyResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./VerifyResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.BatchVerifyResponseInner = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.VerifyResponse);
  }
}(this, function(ApiClient, VerifyResponse) {
  'use strict';




  /**
   * The BatchVerifyResponseInner model module.
   * @module model/BatchVerifyResponseInner
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>BatchVerifyResponseInner</code>.
   * @alias module:model/BatchVerifyResponseInner
   * @class
   * @param status {Number} The HTTP status code for this partial request.
   */
  var exports = function(status) {
    var _this = this;

    _this['status'] = status;


  };

  /**
   * Constructs a <code>BatchVerifyResponseInner</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BatchVerifyResponseInner} obj Optional instance to populate.
   * @return {module:model/BatchVerifyResponseInner} The populated <code>BatchVerifyResponseInner</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'Number');
      }
      if (data.hasOwnProperty('error')) {
        obj['error'] = ApiClient.convertToType(data['error'], 'String');
      }
      if (data.hasOwnProperty('body')) {
        obj['body'] = VerifyResponse.constructFromObject(data['body']);
      }
    }
    return obj;
  }

  /**
   * The HTTP status code for this partial request.
   * @member {Number} status
   */
  exports.prototype['status'] = undefined;
  /**
   * When the status property indicates an error, this contains the error message.
   * @member {String} error
   */
  exports.prototype['error'] = undefined;
  /**
   * @member {module:model/VerifyResponse} body
   */
  exports.prototype['body'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./VerifyResponse":196}],70:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.CaConfig = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The CaConfig model module.
   * @module model/CaConfig
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>CaConfig</code>.
   * @alias module:model/CaConfig
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>CaConfig</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CaConfig} obj Optional instance to populate.
   * @return {module:model/CaConfig} The populated <code>CaConfig</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('ca_set')) {
        obj['ca_set'] = ApiClient.convertToType(data['ca_set'], 'String');
      }
      if (data.hasOwnProperty('pinned')) {
        obj['pinned'] = ApiClient.convertToType(data['pinned'], ['Blob']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/CaConfig.CaSetEnum} ca_set
   * @default 'global_roots'
   */
  exports.prototype['ca_set'] = 'global_roots';
  /**
   * @member {Array.<Blob>} pinned
   */
  exports.prototype['pinned'] = undefined;


  /**
   * Allowed values for the <code>ca_set</code> property.
   * @enum {String}
   * @readonly
   */
  exports.CaSetEnum = {
    /**
     * value: "global_roots"
     * @const
     */
    "roots": "global_roots"  };


  return exports;
}));



},{"../ApiClient":18}],71:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.CipherMode = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class CipherMode.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "ECB"
     * @const
     */
    "ECB": "ECB",
    /**
     * value: "CBC"
     * @const
     */
    "CBC": "CBC",
    /**
     * value: "CBCNOPAD"
     * @const
     */
    "CBCNOPAD": "CBCNOPAD",
    /**
     * value: "CFB"
     * @const
     */
    "CFB": "CFB",
    /**
     * value: "OFB"
     * @const
     */
    "OFB": "OFB",
    /**
     * value: "CTR"
     * @const
     */
    "CTR": "CTR",
    /**
     * value: "GCM"
     * @const
     */
    "GCM": "GCM",
    /**
     * value: "CCM"
     * @const
     */
    "CCM": "CCM"  };

  /**
   * Returns a <code>CipherMode</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/CipherMode} The enum <code>CipherMode</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],72:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ConfirmEmailRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ConfirmEmailRequest model module.
   * @module model/ConfirmEmailRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ConfirmEmailRequest</code>.
   * @alias module:model/ConfirmEmailRequest
   * @class
   * @param confirmToken {String} 
   */
  var exports = function(confirmToken) {
    var _this = this;

    _this['confirm_token'] = confirmToken;
  };

  /**
   * Constructs a <code>ConfirmEmailRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ConfirmEmailRequest} obj Optional instance to populate.
   * @return {module:model/ConfirmEmailRequest} The populated <code>ConfirmEmailRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('confirm_token')) {
        obj['confirm_token'] = ApiClient.convertToType(data['confirm_token'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} confirm_token
   */
  exports.prototype['confirm_token'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],73:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ConfirmEmailResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ConfirmEmailResponse model module.
   * @module model/ConfirmEmailResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ConfirmEmailResponse</code>.
   * @alias module:model/ConfirmEmailResponse
   * @class
   * @param userEmail {String} 
   */
  var exports = function(userEmail) {
    var _this = this;

    _this['user_email'] = userEmail;
  };

  /**
   * Constructs a <code>ConfirmEmailResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ConfirmEmailResponse} obj Optional instance to populate.
   * @return {module:model/ConfirmEmailResponse} The populated <code>ConfirmEmailResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user_email')) {
        obj['user_email'] = ApiClient.convertToType(data['user_email'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} user_email
   */
  exports.prototype['user_email'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],74:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.CreatorType = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The CreatorType model module.
   * @module model/CreatorType
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>CreatorType</code>.
   * What type of entity created another entity.
   * @alias module:model/CreatorType
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>CreatorType</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CreatorType} obj Optional instance to populate.
   * @return {module:model/CreatorType} The populated <code>CreatorType</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('app')) {
        obj['app'] = ApiClient.convertToType(data['app'], 'String');
      }
      if (data.hasOwnProperty('user')) {
        obj['user'] = ApiClient.convertToType(data['user'], 'String');
      }
    }
    return obj;
  }

  /**
   * The application ID of the application that created this entity, if this entity was created by an application.
   * @member {String} app
   */
  exports.prototype['app'] = undefined;
  /**
   * The user ID of the user who created this entity, if this entity was created by a user.
   * @member {String} user
   */
  exports.prototype['user'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],75:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.CryptMode = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class CryptMode.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "ECB"
     * @const
     */
    "ECB": "ECB",
    /**
     * value: "CBC"
     * @const
     */
    "CBC": "CBC",
    /**
     * value: "CBCNOPAD"
     * @const
     */
    "CBCNOPAD": "CBCNOPAD",
    /**
     * value: "CFB"
     * @const
     */
    "CFB": "CFB",
    /**
     * value: "CTR"
     * @const
     */
    "CTR": "CTR",
    /**
     * value: "OFB"
     * @const
     */
    "OFB": "OFB",
    /**
     * value: "GCM"
     * @const
     */
    "GCM": "GCM",
    /**
     * value: "CCM"
     * @const
     */
    "CCM": "CCM",
    /**
     * value: "PKCS1_V15"
     * @const
     */
    "PKCS1_V15": "PKCS1_V15",
    /**
     * value: "OAEP_MGF1_SHA1"
     * @const
     */
    "OAEP_MGF1_SHA1": "OAEP_MGF1_SHA1",
    /**
     * value: "OAEP_MGF1_SHA256"
     * @const
     */
    "OAEP_MGF1_SHA256": "OAEP_MGF1_SHA256",
    /**
     * value: "OAEP_MGF1_SHA384"
     * @const
     */
    "OAEP_MGF1_SHA384": "OAEP_MGF1_SHA384",
    /**
     * value: "OAEP_MGF1_SHA512"
     * @const
     */
    "OAEP_MGF1_SHA512": "OAEP_MGF1_SHA512"  };

  /**
   * Returns a <code>CryptMode</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/CryptMode} The enum <code>CryptMode</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],76:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptFinalRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The DecryptFinalRequest model module.
   * @module model/DecryptFinalRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptFinalRequest</code>.
   * all fields are required
   * @alias module:model/DecryptFinalRequest
   * @class
   * @param state {Blob} 
   */
  var exports = function(state) {
    var _this = this;

    _this['state'] = state;
  };

  /**
   * Constructs a <code>DecryptFinalRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptFinalRequest} obj Optional instance to populate.
   * @return {module:model/DecryptFinalRequest} The populated <code>DecryptFinalRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],77:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptFinalRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, SobjectDescriptor) {
  'use strict';




  /**
   * The DecryptFinalRequestEx model module.
   * @module model/DecryptFinalRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptFinalRequestEx</code>.
   * all fields are required
   * @alias module:model/DecryptFinalRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param state {Blob} 
   */
  var exports = function(key, state) {
    var _this = this;

    _this['key'] = key;
    _this['state'] = state;
  };

  /**
   * Constructs a <code>DecryptFinalRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptFinalRequestEx} obj Optional instance to populate.
   * @return {module:model/DecryptFinalRequestEx} The populated <code>DecryptFinalRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./SobjectDescriptor":164}],78:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptFinalResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The DecryptFinalResponse model module.
   * @module model/DecryptFinalResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptFinalResponse</code>.
   * @alias module:model/DecryptFinalResponse
   * @class
   * @param plain {Blob} Decrypted plaintext.
   */
  var exports = function(plain) {
    var _this = this;

    _this['plain'] = plain;
  };

  /**
   * Constructs a <code>DecryptFinalResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptFinalResponse} obj Optional instance to populate.
   * @return {module:model/DecryptFinalResponse} The populated <code>DecryptFinalResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('plain')) {
        obj['plain'] = ApiClient.convertToType(data['plain'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * Decrypted plaintext.
   * @member {Blob} plain
   */
  exports.prototype['plain'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],79:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CipherMode', 'model/ObjectType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CipherMode'), require('./ObjectType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptInitRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CipherMode, root.FortanixSdkmsRestApi.ObjectType);
  }
}(this, function(ApiClient, CipherMode, ObjectType) {
  'use strict';




  /**
   * The DecryptInitRequest model module.
   * @module model/DecryptInitRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptInitRequest</code>.
   * all fields are optional
   * @alias module:model/DecryptInitRequest
   * @class
   */
  var exports = function() {
    var _this = this;




  };

  /**
   * Constructs a <code>DecryptInitRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptInitRequest} obj Optional instance to populate.
   * @return {module:model/DecryptInitRequest} The populated <code>DecryptInitRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CipherMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * @member {module:model/CipherMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * The initialization value used to encrypt this ciphertext. This field is required for symmetric ciphers, and ignored for asymmetric ciphers. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CipherMode":71,"./ObjectType":133}],80:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CipherMode', 'model/ObjectType', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CipherMode'), require('./ObjectType'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptInitRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CipherMode, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, CipherMode, ObjectType, SobjectDescriptor) {
  'use strict';




  /**
   * The DecryptInitRequestEx model module.
   * @module model/DecryptInitRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptInitRequestEx</code>.
   * @alias module:model/DecryptInitRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   */
  var exports = function(key) {
    var _this = this;

    _this['key'] = key;



  };

  /**
   * Constructs a <code>DecryptInitRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptInitRequestEx} obj Optional instance to populate.
   * @return {module:model/DecryptInitRequestEx} The populated <code>DecryptInitRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CipherMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * @member {module:model/CipherMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * The initialization value used to encrypt this ciphertext. This field is required for symmetric ciphers, and ignored for asymmetric ciphers. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CipherMode":71,"./ObjectType":133,"./SobjectDescriptor":164}],81:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptInitResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The DecryptInitResponse model module.
   * @module model/DecryptInitResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptInitResponse</code>.
   * @alias module:model/DecryptInitResponse
   * @class
   * @param state {Blob} 
   */
  var exports = function(state) {
    var _this = this;


    _this['state'] = state;
  };

  /**
   * Constructs a <code>DecryptInitResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptInitResponse} obj Optional instance to populate.
   * @return {module:model/DecryptInitResponse} The populated <code>DecryptInitResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],82:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CryptMode', 'model/ObjectType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CryptMode'), require('./ObjectType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CryptMode, root.FortanixSdkmsRestApi.ObjectType);
  }
}(this, function(ApiClient, CryptMode, ObjectType) {
  'use strict';




  /**
   * The DecryptRequest model module.
   * @module model/DecryptRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptRequest</code>.
   * Mode and iv are required fields for symmetric key algorithms and ad and tag are required fields for GCM or CCM modes.
   * @alias module:model/DecryptRequest
   * @class
   * @param cipher {Blob} The ciphertext to decrypt.
   */
  var exports = function(cipher) {
    var _this = this;


    _this['cipher'] = cipher;




  };

  /**
   * Constructs a <code>DecryptRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptRequest} obj Optional instance to populate.
   * @return {module:model/DecryptRequest} The populated <code>DecryptRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('cipher')) {
        obj['cipher'] = ApiClient.convertToType(data['cipher'], 'Blob');
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CryptMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('ad')) {
        obj['ad'] = ApiClient.convertToType(data['ad'], 'Blob');
      }
      if (data.hasOwnProperty('tag')) {
        obj['tag'] = ApiClient.convertToType(data['tag'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * The ciphertext to decrypt.
   * @member {Blob} cipher
   */
  exports.prototype['cipher'] = undefined;
  /**
   * @member {module:model/CryptMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * The initialization value used to encrypt this ciphertext. This field is required for symmetric ciphers, and ignored for asymmetric ciphers. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * The authenticated data used with this ciphertext and authentication tag. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers. 
   * @member {Blob} ad
   */
  exports.prototype['ad'] = undefined;
  /**
   * The authentication tag used with this ciphertext and authenticated data. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers. 
   * @member {Blob} tag
   */
  exports.prototype['tag'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CryptMode":75,"./ObjectType":133}],83:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CryptMode', 'model/ObjectType', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CryptMode'), require('./ObjectType'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CryptMode, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, CryptMode, ObjectType, SobjectDescriptor) {
  'use strict';




  /**
   * The DecryptRequestEx model module.
   * @module model/DecryptRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptRequestEx</code>.
   * Mode and iv are required fields for symmetric key algorithms and ad and tag are required fields for GCM or CCM modes.
   * @alias module:model/DecryptRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param cipher {Blob} The ciphertext to decrypt.
   */
  var exports = function(key, cipher) {
    var _this = this;

    _this['key'] = key;

    _this['cipher'] = cipher;




  };

  /**
   * Constructs a <code>DecryptRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptRequestEx} obj Optional instance to populate.
   * @return {module:model/DecryptRequestEx} The populated <code>DecryptRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('cipher')) {
        obj['cipher'] = ApiClient.convertToType(data['cipher'], 'Blob');
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CryptMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('ad')) {
        obj['ad'] = ApiClient.convertToType(data['ad'], 'Blob');
      }
      if (data.hasOwnProperty('tag')) {
        obj['tag'] = ApiClient.convertToType(data['tag'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * The ciphertext to decrypt.
   * @member {Blob} cipher
   */
  exports.prototype['cipher'] = undefined;
  /**
   * @member {module:model/CryptMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * The initialization value used to encrypt this ciphertext. This field is required for symmetric ciphers, and ignored for asymmetric ciphers. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * The authenticated data used with this ciphertext and authentication tag. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers. 
   * @member {Blob} ad
   */
  exports.prototype['ad'] = undefined;
  /**
   * The authentication tag used with this ciphertext and authenticated data. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers. 
   * @member {Blob} tag
   */
  exports.prototype['tag'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CryptMode":75,"./ObjectType":133,"./SobjectDescriptor":164}],84:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The DecryptResponse model module.
   * @module model/DecryptResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptResponse</code>.
   * @alias module:model/DecryptResponse
   * @class
   * @param plain {Blob} The decrypted plaintext.
   */
  var exports = function(plain) {
    var _this = this;


    _this['plain'] = plain;
  };

  /**
   * Constructs a <code>DecryptResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptResponse} obj Optional instance to populate.
   * @return {module:model/DecryptResponse} The populated <code>DecryptResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('plain')) {
        obj['plain'] = ApiClient.convertToType(data['plain'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * The key ID of the key used to decrypt.
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * The decrypted plaintext.
   * @member {Blob} plain
   */
  exports.prototype['plain'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],85:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptUpdateRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The DecryptUpdateRequest model module.
   * @module model/DecryptUpdateRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptUpdateRequest</code>.
   * all fields are required
   * @alias module:model/DecryptUpdateRequest
   * @class
   * @param cipher {Blob} Ciphertext to decrypt.
   * @param state {Blob} 
   */
  var exports = function(cipher, state) {
    var _this = this;

    _this['cipher'] = cipher;
    _this['state'] = state;
  };

  /**
   * Constructs a <code>DecryptUpdateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptUpdateRequest} obj Optional instance to populate.
   * @return {module:model/DecryptUpdateRequest} The populated <code>DecryptUpdateRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('cipher')) {
        obj['cipher'] = ApiClient.convertToType(data['cipher'], 'Blob');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * Ciphertext to decrypt.
   * @member {Blob} cipher
   */
  exports.prototype['cipher'] = undefined;
  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],86:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptUpdateRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, SobjectDescriptor) {
  'use strict';




  /**
   * The DecryptUpdateRequestEx model module.
   * @module model/DecryptUpdateRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptUpdateRequestEx</code>.
   * all fields are required
   * @alias module:model/DecryptUpdateRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param cipher {Blob} Ciphertext to decrypt.
   * @param state {Blob} 
   */
  var exports = function(key, cipher, state) {
    var _this = this;

    _this['key'] = key;
    _this['cipher'] = cipher;
    _this['state'] = state;
  };

  /**
   * Constructs a <code>DecryptUpdateRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptUpdateRequestEx} obj Optional instance to populate.
   * @return {module:model/DecryptUpdateRequestEx} The populated <code>DecryptUpdateRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('cipher')) {
        obj['cipher'] = ApiClient.convertToType(data['cipher'], 'Blob');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * Ciphertext to decrypt.
   * @member {Blob} cipher
   */
  exports.prototype['cipher'] = undefined;
  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./SobjectDescriptor":164}],87:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DecryptUpdateResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The DecryptUpdateResponse model module.
   * @module model/DecryptUpdateResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DecryptUpdateResponse</code>.
   * @alias module:model/DecryptUpdateResponse
   * @class
   * @param plain {Blob} Decrypted plaintext.
   * @param state {Blob} 
   */
  var exports = function(plain, state) {
    var _this = this;

    _this['plain'] = plain;
    _this['state'] = state;
  };

  /**
   * Constructs a <code>DecryptUpdateResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DecryptUpdateResponse} obj Optional instance to populate.
   * @return {module:model/DecryptUpdateResponse} The populated <code>DecryptUpdateResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('plain')) {
        obj['plain'] = ApiClient.convertToType(data['plain'], 'Blob');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * Decrypted plaintext.
   * @member {Blob} plain
   */
  exports.prototype['plain'] = undefined;
  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],88:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/EncryptRequest'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./EncryptRequest'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DeriveKeyMechanism = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.EncryptRequest);
  }
}(this, function(ApiClient, EncryptRequest) {
  'use strict';




  /**
   * The DeriveKeyMechanism model module.
   * @module model/DeriveKeyMechanism
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DeriveKeyMechanism</code>.
   * Encodes the mechanism to be used when deriving a new key from an existing key. Exactly one mechanism should be supplied. Currently, the only supported mechanism is encrypting data to derive the new key. Other mechanisms may be added in the future. 
   * @alias module:model/DeriveKeyMechanism
   * @class
   */
  var exports = function() {
    var _this = this;


  };

  /**
   * Constructs a <code>DeriveKeyMechanism</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DeriveKeyMechanism} obj Optional instance to populate.
   * @return {module:model/DeriveKeyMechanism} The populated <code>DeriveKeyMechanism</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('encrypt_data')) {
        obj['encrypt_data'] = EncryptRequest.constructFromObject(data['encrypt_data']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/EncryptRequest} encrypt_data
   */
  exports.prototype['encrypt_data'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./EncryptRequest":101}],89:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DeriveKeyMechanism', 'model/KeyOperations', 'model/ObjectType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DeriveKeyMechanism'), require('./KeyOperations'), require('./ObjectType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DeriveKeyRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DeriveKeyMechanism, root.FortanixSdkmsRestApi.KeyOperations, root.FortanixSdkmsRestApi.ObjectType);
  }
}(this, function(ApiClient, DeriveKeyMechanism, KeyOperations, ObjectType) {
  'use strict';




  /**
   * The DeriveKeyRequest model module.
   * @module model/DeriveKeyRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DeriveKeyRequest</code>.
   * @alias module:model/DeriveKeyRequest
   * @class
   * @param name {String} Name of the derived key. Key names must be unique within an account.
   * @param keySize {Number} Key size of the derived key in bits (not bytes).
   * @param keyType {module:model/ObjectType} 
   * @param mechanism {module:model/DeriveKeyMechanism} 
   */
  var exports = function(name, keySize, keyType, mechanism) {
    var _this = this;

    _this['name'] = name;

    _this['key_size'] = keySize;
    _this['key_type'] = keyType;
    _this['mechanism'] = mechanism;




  };

  /**
   * Constructs a <code>DeriveKeyRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DeriveKeyRequest} obj Optional instance to populate.
   * @return {module:model/DeriveKeyRequest} The populated <code>DeriveKeyRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('key_size')) {
        obj['key_size'] = ApiClient.convertToType(data['key_size'], 'Number');
      }
      if (data.hasOwnProperty('key_type')) {
        obj['key_type'] = ObjectType.constructFromObject(data['key_type']);
      }
      if (data.hasOwnProperty('mechanism')) {
        obj['mechanism'] = DeriveKeyMechanism.constructFromObject(data['mechanism']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('key_ops')) {
        obj['key_ops'] = ApiClient.convertToType(data['key_ops'], [KeyOperations]);
      }
      if (data.hasOwnProperty('custom_metadata')) {
        obj['custom_metadata'] = ApiClient.convertToType(data['custom_metadata'], {'String': 'String'});
      }
    }
    return obj;
  }

  /**
   * Name of the derived key. Key names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Group ID (not name) of the security group that this security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used. 
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * Key size of the derived key in bits (not bytes).
   * @member {Number} key_size
   */
  exports.prototype['key_size'] = undefined;
  /**
   * @member {module:model/ObjectType} key_type
   */
  exports.prototype['key_type'] = undefined;
  /**
   * @member {module:model/DeriveKeyMechanism} mechanism
   */
  exports.prototype['mechanism'] = undefined;
  /**
   * Whether the derived key should have cryptographic operations enabled.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * Description for the new key.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled. 
   * @member {Array.<module:model/KeyOperations>} key_ops
   */
  exports.prototype['key_ops'] = undefined;
  /**
   * User-defined metadata for this key. Stored as key-value pairs.
   * @member {Object.<String, String>} custom_metadata
   */
  exports.prototype['custom_metadata'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DeriveKeyMechanism":88,"./KeyOperations":117,"./ObjectType":133}],90:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DeriveKeyMechanism', 'model/KeyOperations', 'model/ObjectType', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DeriveKeyMechanism'), require('./KeyOperations'), require('./ObjectType'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DeriveKeyRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DeriveKeyMechanism, root.FortanixSdkmsRestApi.KeyOperations, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, DeriveKeyMechanism, KeyOperations, ObjectType, SobjectDescriptor) {
  'use strict';




  /**
   * The DeriveKeyRequestEx model module.
   * @module model/DeriveKeyRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DeriveKeyRequestEx</code>.
   * @alias module:model/DeriveKeyRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param name {String} Name of the derived key. Key names must be unique within an account.
   * @param keySize {Number} Key size of the derived key in bits (not bytes).
   * @param keyType {module:model/ObjectType} 
   * @param mechanism {module:model/DeriveKeyMechanism} 
   */
  var exports = function(key, name, keySize, keyType, mechanism) {
    var _this = this;

    _this['key'] = key;
    _this['name'] = name;

    _this['key_size'] = keySize;
    _this['key_type'] = keyType;
    _this['mechanism'] = mechanism;





  };

  /**
   * Constructs a <code>DeriveKeyRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DeriveKeyRequestEx} obj Optional instance to populate.
   * @return {module:model/DeriveKeyRequestEx} The populated <code>DeriveKeyRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('key_size')) {
        obj['key_size'] = ApiClient.convertToType(data['key_size'], 'Number');
      }
      if (data.hasOwnProperty('key_type')) {
        obj['key_type'] = ObjectType.constructFromObject(data['key_type']);
      }
      if (data.hasOwnProperty('mechanism')) {
        obj['mechanism'] = DeriveKeyMechanism.constructFromObject(data['mechanism']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('key_ops')) {
        obj['key_ops'] = ApiClient.convertToType(data['key_ops'], [KeyOperations]);
      }
      if (data.hasOwnProperty('custom_metadata')) {
        obj['custom_metadata'] = ApiClient.convertToType(data['custom_metadata'], {'String': 'String'});
      }
      if (data.hasOwnProperty('transient')) {
        obj['transient'] = ApiClient.convertToType(data['transient'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * Name of the derived key. Key names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Group ID (not name) of the security group that this security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used. 
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * Key size of the derived key in bits (not bytes).
   * @member {Number} key_size
   */
  exports.prototype['key_size'] = undefined;
  /**
   * @member {module:model/ObjectType} key_type
   */
  exports.prototype['key_type'] = undefined;
  /**
   * @member {module:model/DeriveKeyMechanism} mechanism
   */
  exports.prototype['mechanism'] = undefined;
  /**
   * Whether the derived key should have cryptographic operations enabled.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * Description for the new key.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled. 
   * @member {Array.<module:model/KeyOperations>} key_ops
   */
  exports.prototype['key_ops'] = undefined;
  /**
   * User-defined metadata for this key. Stored as key-value pairs.
   * @member {Object.<String, String>} custom_metadata
   */
  exports.prototype['custom_metadata'] = undefined;
  /**
   * If this is true, SDKMS will derive a transient key.
   * @member {Boolean} transient
   */
  exports.prototype['transient'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DeriveKeyMechanism":88,"./KeyOperations":117,"./ObjectType":133,"./SobjectDescriptor":164}],91:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DigestAlgorithm = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class DigestAlgorithm.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "Ssl3"
     * @const
     */
    "Ssl3": "Ssl3",
    /**
     * value: "SHA1"
     * @const
     */
    "SHA1": "SHA1",
    /**
     * value: "SHA256"
     * @const
     */
    "SHA256": "SHA256",
    /**
     * value: "SHA384"
     * @const
     */
    "SHA384": "SHA384",
    /**
     * value: "SHA512"
     * @const
     */
    "SHA512": "SHA512"  };

  /**
   * Returns a <code>DigestAlgorithm</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/DigestAlgorithm} The enum <code>DigestAlgorithm</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],92:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DigestRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm);
  }
}(this, function(ApiClient, DigestAlgorithm) {
  'use strict';




  /**
   * The DigestRequest model module.
   * @module model/DigestRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DigestRequest</code>.
   * @alias module:model/DigestRequest
   * @class
   * @param alg {module:model/DigestAlgorithm} 
   * @param data {Blob} Data to be hashed.
   */
  var exports = function(alg, data) {
    var _this = this;

    _this['alg'] = alg;
    _this['data'] = data;
  };

  /**
   * Constructs a <code>DigestRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DigestRequest} obj Optional instance to populate.
   * @return {module:model/DigestRequest} The populated <code>DigestRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('alg')) {
        obj['alg'] = DigestAlgorithm.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/DigestAlgorithm} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * Data to be hashed.
   * @member {Blob} data
   */
  exports.prototype['data'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91}],93:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.DigestResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The DigestResponse model module.
   * @module model/DigestResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>DigestResponse</code>.
   * @alias module:model/DigestResponse
   * @class
   * @param digest {Blob} Hash of the data.
   */
  var exports = function(digest) {
    var _this = this;

    _this['digest'] = digest;
  };

  /**
   * Constructs a <code>DigestResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DigestResponse} obj Optional instance to populate.
   * @return {module:model/DigestResponse} The populated <code>DigestResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('digest')) {
        obj['digest'] = ApiClient.convertToType(data['digest'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * Hash of the data.
   * @member {Blob} digest
   */
  exports.prototype['digest'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],94:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EllipticCurve = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class EllipticCurve.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "SecP192K1"
     * @const
     */
    "SecP192K1": "SecP192K1",
    /**
     * value: "SecP224K1"
     * @const
     */
    "SecP224K1": "SecP224K1",
    /**
     * value: "SecP256K1"
     * @const
     */
    "SecP256K1": "SecP256K1",
    /**
     * value: "NistP192"
     * @const
     */
    "NistP192": "NistP192",
    /**
     * value: "NistP224"
     * @const
     */
    "NistP224": "NistP224",
    /**
     * value: "NistP256"
     * @const
     */
    "NistP256": "NistP256",
    /**
     * value: "NistP384"
     * @const
     */
    "NistP384": "NistP384",
    /**
     * value: "NistP521"
     * @const
     */
    "NistP521": "NistP521"  };

  /**
   * Returns a <code>EllipticCurve</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/EllipticCurve} The enum <code>EllipticCurve</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],95:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptFinalRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The EncryptFinalRequest model module.
   * @module model/EncryptFinalRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptFinalRequest</code>.
   * all fields are required
   * @alias module:model/EncryptFinalRequest
   * @class
   * @param state {Blob} 
   */
  var exports = function(state) {
    var _this = this;

    _this['state'] = state;
  };

  /**
   * Constructs a <code>EncryptFinalRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptFinalRequest} obj Optional instance to populate.
   * @return {module:model/EncryptFinalRequest} The populated <code>EncryptFinalRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],96:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptFinalRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, SobjectDescriptor) {
  'use strict';




  /**
   * The EncryptFinalRequestEx model module.
   * @module model/EncryptFinalRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptFinalRequestEx</code>.
   * all fields are required
   * @alias module:model/EncryptFinalRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param state {Blob} 
   */
  var exports = function(key, state) {
    var _this = this;

    _this['key'] = key;
    _this['state'] = state;
  };

  /**
   * Constructs a <code>EncryptFinalRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptFinalRequestEx} obj Optional instance to populate.
   * @return {module:model/EncryptFinalRequestEx} The populated <code>EncryptFinalRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./SobjectDescriptor":164}],97:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptFinalResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The EncryptFinalResponse model module.
   * @module model/EncryptFinalResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptFinalResponse</code>.
   * @alias module:model/EncryptFinalResponse
   * @class
   * @param cipher {Blob} Encrypted data.
   */
  var exports = function(cipher) {
    var _this = this;

    _this['cipher'] = cipher;
  };

  /**
   * Constructs a <code>EncryptFinalResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptFinalResponse} obj Optional instance to populate.
   * @return {module:model/EncryptFinalResponse} The populated <code>EncryptFinalResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('cipher')) {
        obj['cipher'] = ApiClient.convertToType(data['cipher'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * Encrypted data.
   * @member {Blob} cipher
   */
  exports.prototype['cipher'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],98:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CipherMode', 'model/ObjectType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CipherMode'), require('./ObjectType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptInitRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CipherMode, root.FortanixSdkmsRestApi.ObjectType);
  }
}(this, function(ApiClient, CipherMode, ObjectType) {
  'use strict';




  /**
   * The EncryptInitRequest model module.
   * @module model/EncryptInitRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptInitRequest</code>.
   * alg is required. mode is required for symmetric algorithms.
   * @alias module:model/EncryptInitRequest
   * @class
   * @param alg {module:model/ObjectType} 
   */
  var exports = function(alg) {
    var _this = this;

    _this['alg'] = alg;


  };

  /**
   * Constructs a <code>EncryptInitRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptInitRequest} obj Optional instance to populate.
   * @return {module:model/EncryptInitRequest} The populated <code>EncryptInitRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CipherMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * @member {module:model/CipherMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * For symmetric ciphers, this value will be used for the cipher initialization value. If not provided, SDKMS will generate a random iv and return it in the response. If provided, iv length must match the length required by the cipher and mode. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CipherMode":71,"./ObjectType":133}],99:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CipherMode', 'model/ObjectType', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CipherMode'), require('./ObjectType'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptInitRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CipherMode, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, CipherMode, ObjectType, SobjectDescriptor) {
  'use strict';




  /**
   * The EncryptInitRequestEx model module.
   * @module model/EncryptInitRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptInitRequestEx</code>.
   * alg is required. mode is required for symmetric algorithms.
   * @alias module:model/EncryptInitRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param alg {module:model/ObjectType} 
   */
  var exports = function(key, alg) {
    var _this = this;

    _this['key'] = key;
    _this['alg'] = alg;


  };

  /**
   * Constructs a <code>EncryptInitRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptInitRequestEx} obj Optional instance to populate.
   * @return {module:model/EncryptInitRequestEx} The populated <code>EncryptInitRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CipherMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * @member {module:model/CipherMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * For symmetric ciphers, this value will be used for the cipher initialization value. If not provided, SDKMS will generate a random iv and return it in the response. If provided, iv length must match the length required by the cipher and mode. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CipherMode":71,"./ObjectType":133,"./SobjectDescriptor":164}],100:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptInitResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The EncryptInitResponse model module.
   * @module model/EncryptInitResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptInitResponse</code>.
   * @alias module:model/EncryptInitResponse
   * @class
   * @param state {Blob} 
   */
  var exports = function(state) {
    var _this = this;



    _this['state'] = state;
  };

  /**
   * Constructs a <code>EncryptInitResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptInitResponse} obj Optional instance to populate.
   * @return {module:model/EncryptInitResponse} The populated <code>EncryptInitResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * The initialiation value used for symmetric encryption. Not returned for asymmetric ciphers.
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],101:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CryptMode', 'model/ObjectType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CryptMode'), require('./ObjectType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CryptMode, root.FortanixSdkmsRestApi.ObjectType);
  }
}(this, function(ApiClient, CryptMode, ObjectType) {
  'use strict';




  /**
   * The EncryptRequest model module.
   * @module model/EncryptRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptRequest</code>.
   * A request to encrypt data using a symmetric or asymmetric key.
   * @alias module:model/EncryptRequest
   * @class
   * @param alg {module:model/ObjectType} 
   * @param plain {Blob} The plaintext to encrypt.
   */
  var exports = function(alg, plain) {
    var _this = this;

    _this['alg'] = alg;
    _this['plain'] = plain;




  };

  /**
   * Constructs a <code>EncryptRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptRequest} obj Optional instance to populate.
   * @return {module:model/EncryptRequest} The populated <code>EncryptRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('plain')) {
        obj['plain'] = ApiClient.convertToType(data['plain'], 'Blob');
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CryptMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('ad')) {
        obj['ad'] = ApiClient.convertToType(data['ad'], 'Blob');
      }
      if (data.hasOwnProperty('tag_len')) {
        obj['tag_len'] = ApiClient.convertToType(data['tag_len'], 'Number');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * The plaintext to encrypt.
   * @member {Blob} plain
   */
  exports.prototype['plain'] = undefined;
  /**
   * @member {module:model/CryptMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * For symmetric ciphers, this value will be used for the cipher initialization value. If not provided, SDKMS will generate a random iv and return it in the response. If provided, iv length must match the length required by the cipher and mode. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, this optionally specifies the authenticated data used by the cipher. This field must not be provided with other cipher modes. 
   * @member {Blob} ad
   */
  exports.prototype['ad'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, this field specifies the length of the authentication tag to be produced. This field is specified in bits (not bytes). This field is required for symmetric ciphers with cipher mode GCM or CCM. It must not be specified for asymmetric ciphers and symmetric ciphers with other cipher modes.
   * @member {Number} tag_len
   */
  exports.prototype['tag_len'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CryptMode":75,"./ObjectType":133}],102:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CryptMode', 'model/ObjectType', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CryptMode'), require('./ObjectType'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CryptMode, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, CryptMode, ObjectType, SobjectDescriptor) {
  'use strict';




  /**
   * The EncryptRequestEx model module.
   * @module model/EncryptRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptRequestEx</code>.
   * A request to encrypt data using a symmetric or asymmetric key.
   * @alias module:model/EncryptRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param alg {module:model/ObjectType} 
   * @param plain {Blob} The plaintext to encrypt.
   */
  var exports = function(key, alg, plain) {
    var _this = this;

    _this['key'] = key;
    _this['alg'] = alg;
    _this['plain'] = plain;




  };

  /**
   * Constructs a <code>EncryptRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptRequestEx} obj Optional instance to populate.
   * @return {module:model/EncryptRequestEx} The populated <code>EncryptRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('plain')) {
        obj['plain'] = ApiClient.convertToType(data['plain'], 'Blob');
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CryptMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('ad')) {
        obj['ad'] = ApiClient.convertToType(data['ad'], 'Blob');
      }
      if (data.hasOwnProperty('tag_len')) {
        obj['tag_len'] = ApiClient.convertToType(data['tag_len'], 'Number');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * The plaintext to encrypt.
   * @member {Blob} plain
   */
  exports.prototype['plain'] = undefined;
  /**
   * @member {module:model/CryptMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * For symmetric ciphers, this value will be used for the cipher initialization value. If not provided, SDKMS will generate a random iv and return it in the response. If provided, iv length must match the length required by the cipher and mode. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, this optionally specifies the authenticated data used by the cipher. This field must not be provided with other cipher modes. 
   * @member {Blob} ad
   */
  exports.prototype['ad'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, this field specifies the length of the authentication tag to be produced. This field is specified in bits (not bytes). This field is required for symmetric ciphers with cipher mode GCM or CCM. It must not be specified for asymmetric ciphers and symmetric ciphers with other cipher modes.
   * @member {Number} tag_len
   */
  exports.prototype['tag_len'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CryptMode":75,"./ObjectType":133,"./SobjectDescriptor":164}],103:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The EncryptResponse model module.
   * @module model/EncryptResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptResponse</code>.
   * @alias module:model/EncryptResponse
   * @class
   * @param cipher {Blob} The encrypted data.
   */
  var exports = function(cipher) {
    var _this = this;


    _this['cipher'] = cipher;


  };

  /**
   * Constructs a <code>EncryptResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptResponse} obj Optional instance to populate.
   * @return {module:model/EncryptResponse} The populated <code>EncryptResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('cipher')) {
        obj['cipher'] = ApiClient.convertToType(data['cipher'], 'Blob');
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('tag')) {
        obj['tag'] = ApiClient.convertToType(data['tag'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * ID of the key used to perform encryption.
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * The encrypted data.
   * @member {Blob} cipher
   */
  exports.prototype['cipher'] = undefined;
  /**
   * The initialiation value used for symmetric encryption. Not returned for asymmetric ciphers.
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, the authentication tag produced by the cipher. Its length will match the tag length specified by the encryption request. 
   * @member {Blob} tag
   */
  exports.prototype['tag'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],104:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptUpdateRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The EncryptUpdateRequest model module.
   * @module model/EncryptUpdateRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptUpdateRequest</code>.
   * all fields are required
   * @alias module:model/EncryptUpdateRequest
   * @class
   * @param plain {Blob} Plaintext to encrypt.
   * @param state {Blob} 
   */
  var exports = function(plain, state) {
    var _this = this;

    _this['plain'] = plain;
    _this['state'] = state;
  };

  /**
   * Constructs a <code>EncryptUpdateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptUpdateRequest} obj Optional instance to populate.
   * @return {module:model/EncryptUpdateRequest} The populated <code>EncryptUpdateRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('plain')) {
        obj['plain'] = ApiClient.convertToType(data['plain'], 'Blob');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * Plaintext to encrypt.
   * @member {Blob} plain
   */
  exports.prototype['plain'] = undefined;
  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],105:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptUpdateRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, SobjectDescriptor) {
  'use strict';




  /**
   * The EncryptUpdateRequestEx model module.
   * @module model/EncryptUpdateRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptUpdateRequestEx</code>.
   * all fields are required
   * @alias module:model/EncryptUpdateRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param plain {Blob} Plaintext to encrypt.
   * @param state {Blob} 
   */
  var exports = function(key, plain, state) {
    var _this = this;

    _this['key'] = key;
    _this['plain'] = plain;
    _this['state'] = state;
  };

  /**
   * Constructs a <code>EncryptUpdateRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptUpdateRequestEx} obj Optional instance to populate.
   * @return {module:model/EncryptUpdateRequestEx} The populated <code>EncryptUpdateRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('plain')) {
        obj['plain'] = ApiClient.convertToType(data['plain'], 'Blob');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * Plaintext to encrypt.
   * @member {Blob} plain
   */
  exports.prototype['plain'] = undefined;
  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./SobjectDescriptor":164}],106:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.EncryptUpdateResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The EncryptUpdateResponse model module.
   * @module model/EncryptUpdateResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>EncryptUpdateResponse</code>.
   * @alias module:model/EncryptUpdateResponse
   * @class
   * @param cipher {Blob} Encrypted data.
   * @param state {Blob} 
   */
  var exports = function(cipher, state) {
    var _this = this;

    _this['cipher'] = cipher;
    _this['state'] = state;
  };

  /**
   * Constructs a <code>EncryptUpdateResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EncryptUpdateResponse} obj Optional instance to populate.
   * @return {module:model/EncryptUpdateResponse} The populated <code>EncryptUpdateResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('cipher')) {
        obj['cipher'] = ApiClient.convertToType(data['cipher'], 'Blob');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * Encrypted data.
   * @member {Blob} cipher
   */
  exports.prototype['cipher'] = undefined;
  /**
   * @member {Blob} state
   */
  exports.prototype['state'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],107:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.Entity = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Entity model module.
   * @module model/Entity
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>Entity</code>.
   * An app, user, or plugin ID.
   * @alias module:model/Entity
   * @class
   */
  var exports = function() {
    var _this = this;




  };

  /**
   * Constructs a <code>Entity</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Entity} obj Optional instance to populate.
   * @return {module:model/Entity} The populated <code>Entity</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('app')) {
        obj['app'] = ApiClient.convertToType(data['app'], 'String');
      }
      if (data.hasOwnProperty('user')) {
        obj['user'] = ApiClient.convertToType(data['user'], 'String');
      }
      if (data.hasOwnProperty('plugin')) {
        obj['plugin'] = ApiClient.convertToType(data['plugin'], 'String');
      }
    }
    return obj;
  }

  /**
   * The application ID of the application that created this entity, if this entity was created by an application.
   * @member {String} app
   */
  exports.prototype['app'] = undefined;
  /**
   * The user ID of the user who created this entity, if this entity was created by a user.
   * @member {String} user
   */
  exports.prototype['user'] = undefined;
  /**
   * The plugin ID of the user who created this entity, if this entity was created by a plugin.
   * @member {String} plugin
   */
  exports.prototype['plugin'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],108:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.Error = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Error model module.
   * @module model/Error
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>Error</code>.
   * @alias module:model/Error
   * @class
   */
  var exports = function() {
    var _this = this;


  };

  /**
   * Constructs a <code>Error</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Error} obj Optional instance to populate.
   * @return {module:model/Error} The populated <code>Error</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} message
   */
  exports.prototype['message'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],109:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ForgotPasswordRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ForgotPasswordRequest model module.
   * @module model/ForgotPasswordRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ForgotPasswordRequest</code>.
   * @alias module:model/ForgotPasswordRequest
   * @class
   * @param userEmail {String} 
   */
  var exports = function(userEmail) {
    var _this = this;

    _this['user_email'] = userEmail;
  };

  /**
   * Constructs a <code>ForgotPasswordRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ForgotPasswordRequest} obj Optional instance to populate.
   * @return {module:model/ForgotPasswordRequest} The populated <code>ForgotPasswordRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user_email')) {
        obj['user_email'] = ApiClient.convertToType(data['user_email'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} user_email
   */
  exports.prototype['user_email'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],110:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.GoogleServiceAccountKey = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The GoogleServiceAccountKey model module.
   * @module model/GoogleServiceAccountKey
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>GoogleServiceAccountKey</code>.
   * A Google service account key object. See https://cloud.google.com/video-intelligence/docs/common/auth.
   * @alias module:model/GoogleServiceAccountKey
   * @class
   * @param type {String} Must be \"service_account\"
   * @param projectId {String} 
   * @param privateKeyId {String} 
   * @param clientEmail {String} 
   */
  var exports = function(type, projectId, privateKeyId, clientEmail) {
    var _this = this;

    _this['type'] = type;
    _this['project_id'] = projectId;
    _this['private_key_id'] = privateKeyId;

    _this['client_email'] = clientEmail;
  };

  /**
   * Constructs a <code>GoogleServiceAccountKey</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/GoogleServiceAccountKey} obj Optional instance to populate.
   * @return {module:model/GoogleServiceAccountKey} The populated <code>GoogleServiceAccountKey</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('type')) {
        obj['type'] = ApiClient.convertToType(data['type'], 'String');
      }
      if (data.hasOwnProperty('project_id')) {
        obj['project_id'] = ApiClient.convertToType(data['project_id'], 'String');
      }
      if (data.hasOwnProperty('private_key_id')) {
        obj['private_key_id'] = ApiClient.convertToType(data['private_key_id'], 'String');
      }
      if (data.hasOwnProperty('private_key')) {
        obj['private_key'] = ApiClient.convertToType(data['private_key'], 'String');
      }
      if (data.hasOwnProperty('client_email')) {
        obj['client_email'] = ApiClient.convertToType(data['client_email'], 'String');
      }
    }
    return obj;
  }

  /**
   * Must be \"service_account\"
   * @member {String} type
   */
  exports.prototype['type'] = undefined;
  /**
   * @member {String} project_id
   */
  exports.prototype['project_id'] = undefined;
  /**
   * @member {String} private_key_id
   */
  exports.prototype['private_key_id'] = undefined;
  /**
   * @member {String} private_key
   */
  exports.prototype['private_key'] = undefined;
  /**
   * @member {String} client_email
   */
  exports.prototype['client_email'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],111:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CreatorType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CreatorType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.Group = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CreatorType);
  }
}(this, function(ApiClient, CreatorType) {
  'use strict';




  /**
   * The Group model module.
   * @module model/Group
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>Group</code>.
   * @alias module:model/Group
   * @class
   */
  var exports = function() {
    var _this = this;







  };

  /**
   * Constructs a <code>Group</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Group} obj Optional instance to populate.
   * @return {module:model/Group} The populated <code>Group</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('acct_id')) {
        obj['acct_id'] = ApiClient.convertToType(data['acct_id'], 'String');
      }
      if (data.hasOwnProperty('creator')) {
        obj['creator'] = CreatorType.constructFromObject(data['creator']);
      }
      if (data.hasOwnProperty('created_at')) {
        obj['created_at'] = ApiClient.convertToType(data['created_at'], 'String');
      }
    }
    return obj;
  }

  /**
   * Name of the group. Group names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Group ID uniquely identifying this group.
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * Description of the group.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Account ID of the account this Group belongs to.
   * @member {String} acct_id
   */
  exports.prototype['acct_id'] = undefined;
  /**
   * @member {module:model/CreatorType} creator
   */
  exports.prototype['creator'] = undefined;
  /**
   * When this group was created.
   * @member {String} created_at
   */
  exports.prototype['created_at'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CreatorType":74}],112:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.GroupRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The GroupRequest model module.
   * @module model/GroupRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>GroupRequest</code>.
   * @alias module:model/GroupRequest
   * @class
   * @param name {String} Name of the group. Group names must be unique within an account.
   */
  var exports = function(name) {
    var _this = this;

    _this['name'] = name;


  };

  /**
   * Constructs a <code>GroupRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/GroupRequest} obj Optional instance to populate.
   * @return {module:model/GroupRequest} The populated <code>GroupRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('acct_id')) {
        obj['acct_id'] = ApiClient.convertToType(data['acct_id'], 'String');
      }
    }
    return obj;
  }

  /**
   * Name of the group. Group names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Description of the group.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Account ID of the account the new group will belong to.
   * @member {String} acct_id
   */
  exports.prototype['acct_id'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],113:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.IVDecryptInput = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The IVDecryptInput model module.
   * @module model/IVDecryptInput
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>IVDecryptInput</code>.
   * The initialization value used to encrypt this ciphertext. This field is required for symmetric ciphers, and ignored for asymmetric ciphers. 
   * @alias module:model/IVDecryptInput
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>IVDecryptInput</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/IVDecryptInput} obj Optional instance to populate.
   * @return {module:model/IVDecryptInput} The populated <code>IVDecryptInput</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],114:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.IVEncryptInput = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The IVEncryptInput model module.
   * @module model/IVEncryptInput
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>IVEncryptInput</code>.
   * For symmetric ciphers, this value will be used for the cipher initialization value. If not provided, SDKMS will generate a random iv and return it in the response. If provided, iv length must match the length required by the cipher and mode. 
   * @alias module:model/IVEncryptInput
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>IVEncryptInput</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/IVEncryptInput} obj Optional instance to populate.
   * @return {module:model/IVEncryptInput} The populated <code>IVEncryptInput</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],115:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.IVEncryptOutput = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The IVEncryptOutput model module.
   * @module model/IVEncryptOutput
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>IVEncryptOutput</code>.
   * The initialiation value used for symmetric encryption. Not returned for asymmetric ciphers.
   * @alias module:model/IVEncryptOutput
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>IVEncryptOutput</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/IVEncryptOutput} obj Optional instance to populate.
   * @return {module:model/IVEncryptOutput} The populated <code>IVEncryptOutput</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],116:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CreatorType', 'model/EllipticCurve', 'model/KeyOperations', 'model/ObjectOrigin', 'model/ObjectType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CreatorType'), require('./EllipticCurve'), require('./KeyOperations'), require('./ObjectOrigin'), require('./ObjectType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.KeyObject = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CreatorType, root.FortanixSdkmsRestApi.EllipticCurve, root.FortanixSdkmsRestApi.KeyOperations, root.FortanixSdkmsRestApi.ObjectOrigin, root.FortanixSdkmsRestApi.ObjectType);
  }
}(this, function(ApiClient, CreatorType, EllipticCurve, KeyOperations, ObjectOrigin, ObjectType) {
  'use strict';




  /**
   * The KeyObject model module.
   * @module model/KeyObject
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>KeyObject</code>.
   * @alias module:model/KeyObject
   * @class
   * @param name {String} Name of the security object.
   * @param acctId {String} Account ID of the account this security object belongs to.
   * @param creator {module:model/CreatorType} 
   * @param objType {module:model/ObjectType} 
   * @param origin {module:model/ObjectOrigin} 
   * @param enabled {Boolean} Whether this security object has cryptographic operations enabled.
   * @param createdAt {String} When this security object was created.
   * @param lastusedAt {String} When this security object was last used.
   * @param neverExportable {Boolean} True if this key's operations have never contained EXPORT.
   */
  var exports = function(name, acctId, creator, objType, origin, enabled, createdAt, lastusedAt, neverExportable) {
    var _this = this;

    _this['name'] = name;



    _this['acct_id'] = acctId;

    _this['creator'] = creator;

    _this['obj_type'] = objType;


    _this['origin'] = origin;


    _this['enabled'] = enabled;
    _this['created_at'] = createdAt;
    _this['lastused_at'] = lastusedAt;

    _this['never_exportable'] = neverExportable;
  };

  /**
   * Constructs a <code>KeyObject</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/KeyObject} obj Optional instance to populate.
   * @return {module:model/KeyObject} The populated <code>KeyObject</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('key_size')) {
        obj['key_size'] = ApiClient.convertToType(data['key_size'], 'Number');
      }
      if (data.hasOwnProperty('elliptic_curve')) {
        obj['elliptic_curve'] = EllipticCurve.constructFromObject(data['elliptic_curve']);
      }
      if (data.hasOwnProperty('acct_id')) {
        obj['acct_id'] = ApiClient.convertToType(data['acct_id'], 'String');
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('creator')) {
        obj['creator'] = CreatorType.constructFromObject(data['creator']);
      }
      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('obj_type')) {
        obj['obj_type'] = ObjectType.constructFromObject(data['obj_type']);
      }
      if (data.hasOwnProperty('key_ops')) {
        obj['key_ops'] = ApiClient.convertToType(data['key_ops'], [KeyOperations]);
      }
      if (data.hasOwnProperty('custom_metadata')) {
        obj['custom_metadata'] = ApiClient.convertToType(data['custom_metadata'], {'String': 'String'});
      }
      if (data.hasOwnProperty('origin')) {
        obj['origin'] = ObjectOrigin.constructFromObject(data['origin']);
      }
      if (data.hasOwnProperty('pub_key')) {
        obj['pub_key'] = ApiClient.convertToType(data['pub_key'], 'Blob');
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'Blob');
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('created_at')) {
        obj['created_at'] = ApiClient.convertToType(data['created_at'], 'String');
      }
      if (data.hasOwnProperty('lastused_at')) {
        obj['lastused_at'] = ApiClient.convertToType(data['lastused_at'], 'String');
      }
      if (data.hasOwnProperty('transient_key')) {
        obj['transient_key'] = ApiClient.convertToType(data['transient_key'], 'String');
      }
      if (data.hasOwnProperty('never_exportable')) {
        obj['never_exportable'] = ApiClient.convertToType(data['never_exportable'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * Name of the security object.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Description of the security object.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * For objects which are not elliptic curves, this is the size in bits (not bytes) of the object. This field is not returned for elliptic curves. 
   * @member {Number} key_size
   */
  exports.prototype['key_size'] = undefined;
  /**
   * @member {module:model/EllipticCurve} elliptic_curve
   */
  exports.prototype['elliptic_curve'] = undefined;
  /**
   * Account ID of the account this security object belongs to.
   * @member {String} acct_id
   */
  exports.prototype['acct_id'] = undefined;
  /**
   * Group ID of the security group that this security object belongs to.
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * @member {module:model/CreatorType} creator
   */
  exports.prototype['creator'] = undefined;
  /**
   * Key ID uniquely identifying this security object.
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * @member {module:model/ObjectType} obj_type
   */
  exports.prototype['obj_type'] = undefined;
  /**
   * Array of key operations enabled for this security object. 
   * @member {Array.<module:model/KeyOperations>} key_ops
   */
  exports.prototype['key_ops'] = undefined;
  /**
   * User-defined metadata for this key. Stored as key-value pairs.
   * @member {Object.<String, String>} custom_metadata
   */
  exports.prototype['custom_metadata'] = undefined;
  /**
   * @member {module:model/ObjectOrigin} origin
   */
  exports.prototype['origin'] = undefined;
  /**
   * This field is returned only for asymmetric keys. It contains the public key.
   * @member {Blob} pub_key
   */
  exports.prototype['pub_key'] = undefined;
  /**
   * This field is returned only for opaque and secret objects. It contains the contents of the object.
   * @member {Blob} value
   */
  exports.prototype['value'] = undefined;
  /**
   * Whether this security object has cryptographic operations enabled.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * When this security object was created.
   * @member {String} created_at
   */
  exports.prototype['created_at'] = undefined;
  /**
   * When this security object was last used.
   * @member {String} lastused_at
   */
  exports.prototype['lastused_at'] = undefined;
  /**
   * Transient key blob.
   * @member {String} transient_key
   */
  exports.prototype['transient_key'] = undefined;
  /**
   * True if this key's operations have never contained EXPORT.
   * @member {Boolean} never_exportable
   */
  exports.prototype['never_exportable'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CreatorType":74,"./EllipticCurve":94,"./KeyOperations":117,"./ObjectOrigin":132,"./ObjectType":133}],117:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.KeyOperations = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class KeyOperations.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "SIGN"
     * @const
     */
    "SIGN": "SIGN",
    /**
     * value: "VERIFY"
     * @const
     */
    "VERIFY": "VERIFY",
    /**
     * value: "ENCRYPT"
     * @const
     */
    "ENCRYPT": "ENCRYPT",
    /**
     * value: "DECRYPT"
     * @const
     */
    "DECRYPT": "DECRYPT",
    /**
     * value: "WRAPKEY"
     * @const
     */
    "WRAPKEY": "WRAPKEY",
    /**
     * value: "UNWRAPKEY"
     * @const
     */
    "UNWRAPKEY": "UNWRAPKEY",
    /**
     * value: "DERIVEKEY"
     * @const
     */
    "DERIVEKEY": "DERIVEKEY",
    /**
     * value: "AGREEKEY"
     * @const
     */
    "AGREEKEY": "AGREEKEY",
    /**
     * value: "MACGENERATE"
     * @const
     */
    "MACGENERATE": "MACGENERATE",
    /**
     * value: "MACVERIFY"
     * @const
     */
    "MACVERIFY": "MACVERIFY",
    /**
     * value: "EXPORT"
     * @const
     */
    "EXPORT": "EXPORT",
    /**
     * value: "APPMANAGEABLE"
     * @const
     */
    "APPMANAGEABLE": "APPMANAGEABLE"  };

  /**
   * Returns a <code>KeyOperations</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/KeyOperations} The enum <code>KeyOperations</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],118:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.Language = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class Language.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "Lua"
     * @const
     */
    "Lua": "Lua"  };

  /**
   * Returns a <code>Language</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/Language} The enum <code>Language</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],119:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/SplunkLoggingConfig', 'model/StackdriverLoggingConfig'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./SplunkLoggingConfig'), require('./StackdriverLoggingConfig'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.LoggingConfig = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.SplunkLoggingConfig, root.FortanixSdkmsRestApi.StackdriverLoggingConfig);
  }
}(this, function(ApiClient, SplunkLoggingConfig, StackdriverLoggingConfig) {
  'use strict';




  /**
   * The LoggingConfig model module.
   * @module model/LoggingConfig
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>LoggingConfig</code>.
   * @alias module:model/LoggingConfig
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>LoggingConfig</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LoggingConfig} obj Optional instance to populate.
   * @return {module:model/LoggingConfig} The populated <code>LoggingConfig</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('splunk')) {
        obj['splunk'] = SplunkLoggingConfig.constructFromObject(data['splunk']);
      }
      if (data.hasOwnProperty('stackdriver')) {
        obj['stackdriver'] = StackdriverLoggingConfig.constructFromObject(data['stackdriver']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SplunkLoggingConfig} splunk
   */
  exports.prototype['splunk'] = undefined;
  /**
   * @member {module:model/StackdriverLoggingConfig} stackdriver
   */
  exports.prototype['stackdriver'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./SplunkLoggingConfig":166,"./StackdriverLoggingConfig":168}],120:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/SplunkLoggingConfigRequest', 'model/StackdriverLoggingConfigRequest'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./SplunkLoggingConfigRequest'), require('./StackdriverLoggingConfigRequest'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.LoggingConfigRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.SplunkLoggingConfigRequest, root.FortanixSdkmsRestApi.StackdriverLoggingConfigRequest);
  }
}(this, function(ApiClient, SplunkLoggingConfigRequest, StackdriverLoggingConfigRequest) {
  'use strict';




  /**
   * The LoggingConfigRequest model module.
   * @module model/LoggingConfigRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>LoggingConfigRequest</code>.
   * @alias module:model/LoggingConfigRequest
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>LoggingConfigRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LoggingConfigRequest} obj Optional instance to populate.
   * @return {module:model/LoggingConfigRequest} The populated <code>LoggingConfigRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('splunk')) {
        obj['splunk'] = SplunkLoggingConfigRequest.constructFromObject(data['splunk']);
      }
      if (data.hasOwnProperty('stackdriver')) {
        obj['stackdriver'] = StackdriverLoggingConfigRequest.constructFromObject(data['stackdriver']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SplunkLoggingConfigRequest} splunk
   */
  exports.prototype['splunk'] = undefined;
  /**
   * @member {module:model/StackdriverLoggingConfigRequest} stackdriver
   */
  exports.prototype['stackdriver'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./SplunkLoggingConfigRequest":167,"./StackdriverLoggingConfigRequest":169}],121:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.MacGenerateRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm);
  }
}(this, function(ApiClient, DigestAlgorithm) {
  'use strict';




  /**
   * The MacGenerateRequest model module.
   * @module model/MacGenerateRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>MacGenerateRequest</code>.
   * @alias module:model/MacGenerateRequest
   * @class
   * @param data {Blob} Data to compute the MAC of.
   */
  var exports = function(data) {
    var _this = this;


    _this['data'] = data;
  };

  /**
   * Constructs a <code>MacGenerateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MacGenerateRequest} obj Optional instance to populate.
   * @return {module:model/MacGenerateRequest} The populated <code>MacGenerateRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('alg')) {
        obj['alg'] = DigestAlgorithm.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/DigestAlgorithm} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * Data to compute the MAC of.
   * @member {Blob} data
   */
  exports.prototype['data'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91}],122:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.MacGenerateRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, DigestAlgorithm, SobjectDescriptor) {
  'use strict';




  /**
   * The MacGenerateRequestEx model module.
   * @module model/MacGenerateRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>MacGenerateRequestEx</code>.
   * @alias module:model/MacGenerateRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param data {Blob} Data to compute the MAC of.
   */
  var exports = function(key, data) {
    var _this = this;

    _this['key'] = key;

    _this['data'] = data;
  };

  /**
   * Constructs a <code>MacGenerateRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MacGenerateRequestEx} obj Optional instance to populate.
   * @return {module:model/MacGenerateRequestEx} The populated <code>MacGenerateRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('alg')) {
        obj['alg'] = DigestAlgorithm.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/DigestAlgorithm} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * Data to compute the MAC of.
   * @member {Blob} data
   */
  exports.prototype['data'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91,"./SobjectDescriptor":164}],123:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.MacGenerateResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The MacGenerateResponse model module.
   * @module model/MacGenerateResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>MacGenerateResponse</code>.
   * @alias module:model/MacGenerateResponse
   * @class
   * @param mac {Blob} The MAC generated for the input data (returned for CMAC operation).
   */
  var exports = function(mac) {
    var _this = this;



    _this['mac'] = mac;
  };

  /**
   * Constructs a <code>MacGenerateResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MacGenerateResponse} obj Optional instance to populate.
   * @return {module:model/MacGenerateResponse} The populated <code>MacGenerateResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('digest')) {
        obj['digest'] = ApiClient.convertToType(data['digest'], 'Blob');
      }
      if (data.hasOwnProperty('mac')) {
        obj['mac'] = ApiClient.convertToType(data['mac'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * Key ID of the key used to generate the MAC.
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * The MAC generated for the input data (returned for HMAC operation).
   * @member {Blob} digest
   */
  exports.prototype['digest'] = undefined;
  /**
   * The MAC generated for the input data (returned for CMAC operation).
   * @member {Blob} mac
   */
  exports.prototype['mac'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],124:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.MacVerifyRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm);
  }
}(this, function(ApiClient, DigestAlgorithm) {
  'use strict';




  /**
   * The MacVerifyRequest model module.
   * @module model/MacVerifyRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>MacVerifyRequest</code>.
   * @alias module:model/MacVerifyRequest
   * @class
   * @param alg {module:model/DigestAlgorithm} 
   * @param data {Blob} The data to verify the MAC of.
   */
  var exports = function(alg, data) {
    var _this = this;

    _this['alg'] = alg;
    _this['data'] = data;


  };

  /**
   * Constructs a <code>MacVerifyRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MacVerifyRequest} obj Optional instance to populate.
   * @return {module:model/MacVerifyRequest} The populated <code>MacVerifyRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('alg')) {
        obj['alg'] = DigestAlgorithm.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], 'Blob');
      }
      if (data.hasOwnProperty('digest')) {
        obj['digest'] = ApiClient.convertToType(data['digest'], 'Blob');
      }
      if (data.hasOwnProperty('mac')) {
        obj['mac'] = ApiClient.convertToType(data['mac'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/DigestAlgorithm} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * The data to verify the MAC of.
   * @member {Blob} data
   */
  exports.prototype['data'] = undefined;
  /**
   * The MAC previously computed for the input data. NOTE - this field is deprecated. Instead you should use mac field.
   * @member {Blob} digest
   */
  exports.prototype['digest'] = undefined;
  /**
   * The MAC previously computed for the input data.
   * @member {Blob} mac
   */
  exports.prototype['mac'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91}],125:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.MacVerifyRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, DigestAlgorithm, SobjectDescriptor) {
  'use strict';




  /**
   * The MacVerifyRequestEx model module.
   * @module model/MacVerifyRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>MacVerifyRequestEx</code>.
   * @alias module:model/MacVerifyRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param alg {module:model/DigestAlgorithm} 
   * @param data {Blob} The data to verify the MAC of.
   */
  var exports = function(key, alg, data) {
    var _this = this;

    _this['key'] = key;
    _this['alg'] = alg;
    _this['data'] = data;


  };

  /**
   * Constructs a <code>MacVerifyRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MacVerifyRequestEx} obj Optional instance to populate.
   * @return {module:model/MacVerifyRequestEx} The populated <code>MacVerifyRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('alg')) {
        obj['alg'] = DigestAlgorithm.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], 'Blob');
      }
      if (data.hasOwnProperty('digest')) {
        obj['digest'] = ApiClient.convertToType(data['digest'], 'Blob');
      }
      if (data.hasOwnProperty('mac')) {
        obj['mac'] = ApiClient.convertToType(data['mac'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/DigestAlgorithm} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * The data to verify the MAC of.
   * @member {Blob} data
   */
  exports.prototype['data'] = undefined;
  /**
   * The MAC previously computed for the input data. NOTE - this field is deprecated. Instead you should use mac field.
   * @member {Blob} digest
   */
  exports.prototype['digest'] = undefined;
  /**
   * The MAC previously computed for the input data.
   * @member {Blob} mac
   */
  exports.prototype['mac'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91,"./SobjectDescriptor":164}],126:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.MacVerifyResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The MacVerifyResponse model module.
   * @module model/MacVerifyResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>MacVerifyResponse</code>.
   * @alias module:model/MacVerifyResponse
   * @class
   * @param result {Boolean} True if the MAC successfully verified, and false if it did not.
   */
  var exports = function(result) {
    var _this = this;


    _this['result'] = result;
  };

  /**
   * Constructs a <code>MacVerifyResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MacVerifyResponse} obj Optional instance to populate.
   * @return {module:model/MacVerifyResponse} The populated <code>MacVerifyResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('result')) {
        obj['result'] = ApiClient.convertToType(data['result'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * Key ID of the key used to verify the MAC.
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * True if the MAC successfully verified, and false if it did not.
   * @member {Boolean} result
   */
  exports.prototype['result'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],127:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/U2fKey'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./U2fKey'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.MfaChallenge = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.U2fKey);
  }
}(this, function(ApiClient, U2fKey) {
  'use strict';




  /**
   * The MfaChallenge model module.
   * @module model/MfaChallenge
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>MfaChallenge</code>.
   * Challenge for registring or authenticating with a U2F two factor device.
   * @alias module:model/MfaChallenge
   * @class
   * @param u2fChallenge {String} 
   * @param u2fKeys {Array.<module:model/U2fKey>} 
   */
  var exports = function(u2fChallenge, u2fKeys) {
    var _this = this;

    _this['u2f_challenge'] = u2fChallenge;
    _this['u2f_keys'] = u2fKeys;
  };

  /**
   * Constructs a <code>MfaChallenge</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MfaChallenge} obj Optional instance to populate.
   * @return {module:model/MfaChallenge} The populated <code>MfaChallenge</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('u2f_challenge')) {
        obj['u2f_challenge'] = ApiClient.convertToType(data['u2f_challenge'], 'String');
      }
      if (data.hasOwnProperty('u2f_keys')) {
        obj['u2f_keys'] = ApiClient.convertToType(data['u2f_keys'], [U2fKey]);
      }
    }
    return obj;
  }

  /**
   * @member {String} u2f_challenge
   */
  exports.prototype['u2f_challenge'] = undefined;
  /**
   * @member {Array.<module:model/U2fKey>} u2f_keys
   */
  exports.prototype['u2f_keys'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./U2fKey":180}],128:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/MgfMgf1'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./MgfMgf1'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.Mgf = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.MgfMgf1);
  }
}(this, function(ApiClient, MgfMgf1) {
  'use strict';




  /**
   * The Mgf model module.
   * @module model/Mgf
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>Mgf</code>.
   * Specifies the Mask Generating Function (MGF) to use.
   * @alias module:model/Mgf
   * @class
   */
  var exports = function() {
    var _this = this;


  };

  /**
   * Constructs a <code>Mgf</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Mgf} obj Optional instance to populate.
   * @return {module:model/Mgf} The populated <code>Mgf</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('mgf1')) {
        obj['mgf1'] = MgfMgf1.constructFromObject(data['mgf1']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/MgfMgf1} mgf1
   */
  exports.prototype['mgf1'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./MgfMgf1":129}],129:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.MgfMgf1 = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm);
  }
}(this, function(ApiClient, DigestAlgorithm) {
  'use strict';




  /**
   * The MgfMgf1 model module.
   * @module model/MgfMgf1
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>MgfMgf1</code>.
   * Parameters for MGF1.
   * @alias module:model/MgfMgf1
   * @class
   * @param hash {module:model/DigestAlgorithm} 
   */
  var exports = function(hash) {
    var _this = this;

    _this['hash'] = hash;
  };

  /**
   * Constructs a <code>MgfMgf1</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MgfMgf1} obj Optional instance to populate.
   * @return {module:model/MgfMgf1} The populated <code>MgfMgf1</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('hash')) {
        obj['hash'] = DigestAlgorithm.constructFromObject(data['hash']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/DigestAlgorithm} hash
   */
  exports.prototype['hash'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91}],130:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.NotificationPref = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class NotificationPref.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "None"
     * @const
     */
    "None": "None",
    /**
     * value: "Email"
     * @const
     */
    "Email": "Email",
    /**
     * value: "Phone"
     * @const
     */
    "Phone": "Phone",
    /**
     * value: "Both"
     * @const
     */
    "Both": "Both"  };

  /**
   * Returns a <code>NotificationPref</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/NotificationPref} The enum <code>NotificationPref</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],131:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ObjectDigestRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, DigestAlgorithm, SobjectDescriptor) {
  'use strict';




  /**
   * The ObjectDigestRequest model module.
   * @module model/ObjectDigestRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ObjectDigestRequest</code>.
   * @alias module:model/ObjectDigestRequest
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param alg {module:model/DigestAlgorithm} 
   */
  var exports = function(key, alg) {
    var _this = this;

    _this['key'] = key;
    _this['alg'] = alg;
  };

  /**
   * Constructs a <code>ObjectDigestRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ObjectDigestRequest} obj Optional instance to populate.
   * @return {module:model/ObjectDigestRequest} The populated <code>ObjectDigestRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('alg')) {
        obj['alg'] = DigestAlgorithm.constructFromObject(data['alg']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/DigestAlgorithm} alg
   */
  exports.prototype['alg'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91,"./SobjectDescriptor":164}],132:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ObjectOrigin = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class ObjectOrigin.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "FortanixHSM"
     * @const
     */
    "FortanixHSM": "FortanixHSM",
    /**
     * value: "External"
     * @const
     */
    "External": "External"  };

  /**
   * Returns a <code>ObjectOrigin</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/ObjectOrigin} The enum <code>ObjectOrigin</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],133:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ObjectType = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class ObjectType.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "AES"
     * @const
     */
    "AES": "AES",
    /**
     * value: "DES"
     * @const
     */
    "DES": "DES",
    /**
     * value: "DES3"
     * @const
     */
    "DES3": "DES3",
    /**
     * value: "RSA"
     * @const
     */
    "RSA": "RSA",
    /**
     * value: "EC"
     * @const
     */
    "EC": "EC",
    /**
     * value: "OPAQUE"
     * @const
     */
    "OPAQUE": "OPAQUE",
    /**
     * value: "HMAC"
     * @const
     */
    "HMAC": "HMAC",
    /**
     * value: "SECRET"
     * @const
     */
    "SECRET": "SECRET",
    /**
     * value: "CERTIFICATE"
     * @const
     */
    "CERTIFICATE": "CERTIFICATE"  };

  /**
   * Returns a <code>ObjectType</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/ObjectType} The enum <code>ObjectType</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],134:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.PasswordChangeRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The PasswordChangeRequest model module.
   * @module model/PasswordChangeRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>PasswordChangeRequest</code>.
   * @alias module:model/PasswordChangeRequest
   * @class
   * @param currentPassword {String} 
   * @param newPassword {String} 
   */
  var exports = function(currentPassword, newPassword) {
    var _this = this;

    _this['current_password'] = currentPassword;
    _this['new_password'] = newPassword;
  };

  /**
   * Constructs a <code>PasswordChangeRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PasswordChangeRequest} obj Optional instance to populate.
   * @return {module:model/PasswordChangeRequest} The populated <code>PasswordChangeRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('current_password')) {
        obj['current_password'] = ApiClient.convertToType(data['current_password'], 'String');
      }
      if (data.hasOwnProperty('new_password')) {
        obj['new_password'] = ApiClient.convertToType(data['new_password'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} current_password
   */
  exports.prototype['current_password'] = undefined;
  /**
   * @member {String} new_password
   */
  exports.prototype['new_password'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],135:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.PasswordResetRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The PasswordResetRequest model module.
   * @module model/PasswordResetRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>PasswordResetRequest</code>.
   * @alias module:model/PasswordResetRequest
   * @class
   * @param resetToken {String} 
   * @param newPassword {String} 
   */
  var exports = function(resetToken, newPassword) {
    var _this = this;

    _this['reset_token'] = resetToken;
    _this['new_password'] = newPassword;
  };

  /**
   * Constructs a <code>PasswordResetRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PasswordResetRequest} obj Optional instance to populate.
   * @return {module:model/PasswordResetRequest} The populated <code>PasswordResetRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('reset_token')) {
        obj['reset_token'] = ApiClient.convertToType(data['reset_token'], 'String');
      }
      if (data.hasOwnProperty('new_password')) {
        obj['new_password'] = ApiClient.convertToType(data['new_password'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} reset_token
   */
  exports.prototype['reset_token'] = undefined;
  /**
   * @member {String} new_password
   */
  exports.prototype['new_password'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],136:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/KeyOperations'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./KeyOperations'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.PersistTransientKeyRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.KeyOperations);
  }
}(this, function(ApiClient, KeyOperations) {
  'use strict';




  /**
   * The PersistTransientKeyRequest model module.
   * @module model/PersistTransientKeyRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>PersistTransientKeyRequest</code>.
   * @alias module:model/PersistTransientKeyRequest
   * @class
   * @param name {String} Name of the persisted security object. Security object names must be unique within an account.
   * @param transientKey {String} Transient key blob.
   */
  var exports = function(name, transientKey) {
    var _this = this;

    _this['name'] = name;





    _this['transient_key'] = transientKey;
  };

  /**
   * Constructs a <code>PersistTransientKeyRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PersistTransientKeyRequest} obj Optional instance to populate.
   * @return {module:model/PersistTransientKeyRequest} The populated <code>PersistTransientKeyRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('custom_metadata')) {
        obj['custom_metadata'] = ApiClient.convertToType(data['custom_metadata'], {'String': 'String'});
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('key_ops')) {
        obj['key_ops'] = ApiClient.convertToType(data['key_ops'], [KeyOperations]);
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('transient_key')) {
        obj['transient_key'] = ApiClient.convertToType(data['transient_key'], 'String');
      }
    }
    return obj;
  }

  /**
   * Name of the persisted security object. Security object names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Description of the persisted security object.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * User-defined metadata for the persisted key. Stored as key-value pairs.
   * @member {Object.<String, String>} custom_metadata
   */
  exports.prototype['custom_metadata'] = undefined;
  /**
   * Whether the new security object should be enabled. Disabled security objects may not perform cryptographic operations. 
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled. 
   * @member {Array.<module:model/KeyOperations>} key_ops
   */
  exports.prototype['key_ops'] = undefined;
  /**
   * Group ID (not name) of the security group that the persisted security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used. 
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * Transient key blob.
   * @member {String} transient_key
   */
  exports.prototype['transient_key'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./KeyOperations":117}],137:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CreatorType', 'model/PluginSource', 'model/PluginType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CreatorType'), require('./PluginSource'), require('./PluginType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.Plugin = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CreatorType, root.FortanixSdkmsRestApi.PluginSource, root.FortanixSdkmsRestApi.PluginType);
  }
}(this, function(ApiClient, CreatorType, PluginSource, PluginType) {
  'use strict';




  /**
   * The Plugin model module.
   * @module model/Plugin
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>Plugin</code>.
   * @alias module:model/Plugin
   * @class
   * @param name {String} Name of the plugin. Plugin names must be unique within an account.
   * @param pluginId {String} Plugin ID uniquely identifying this plugin.
   * @param acctId {String} The account ID of the account that this plugin belongs to.
   * @param groups {Array.<String>} An array of security group IDs. The plugin belongs to each Security Group in this array.
   * @param defaultGroup {String} The default group of this plugin. This is the group where security objects will be created by default by this plugin.
   * @param source {module:model/PluginSource} 
   * @param enabled {Boolean} Whether this plugin is enabled.
   * @param pluginType {module:model/PluginType} 
   * @param regions {Array.<String>} The list of regions this plugin may run in.
   * @param creator {module:model/CreatorType} 
   * @param createdAt {String} When this plugin was created.
   * @param lastrunAt {String} When this plugin was last run.
   * @param lastupdatedAt {String} When this plugin was last updated.
   */
  var exports = function(name, pluginId, acctId, groups, defaultGroup, source, enabled, pluginType, regions, creator, createdAt, lastrunAt, lastupdatedAt) {
    var _this = this;

    _this['name'] = name;
    _this['plugin_id'] = pluginId;

    _this['acct_id'] = acctId;
    _this['groups'] = groups;
    _this['default_group'] = defaultGroup;
    _this['source'] = source;
    _this['enabled'] = enabled;
    _this['plugin_type'] = pluginType;
    _this['regions'] = regions;
    _this['creator'] = creator;
    _this['created_at'] = createdAt;
    _this['lastrun_at'] = lastrunAt;
    _this['lastupdated_at'] = lastupdatedAt;
  };

  /**
   * Constructs a <code>Plugin</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Plugin} obj Optional instance to populate.
   * @return {module:model/Plugin} The populated <code>Plugin</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('plugin_id')) {
        obj['plugin_id'] = ApiClient.convertToType(data['plugin_id'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('acct_id')) {
        obj['acct_id'] = ApiClient.convertToType(data['acct_id'], 'String');
      }
      if (data.hasOwnProperty('groups')) {
        obj['groups'] = ApiClient.convertToType(data['groups'], ['String']);
      }
      if (data.hasOwnProperty('default_group')) {
        obj['default_group'] = ApiClient.convertToType(data['default_group'], 'String');
      }
      if (data.hasOwnProperty('source')) {
        obj['source'] = PluginSource.constructFromObject(data['source']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('plugin_type')) {
        obj['plugin_type'] = PluginType.constructFromObject(data['plugin_type']);
      }
      if (data.hasOwnProperty('regions')) {
        obj['regions'] = ApiClient.convertToType(data['regions'], ['String']);
      }
      if (data.hasOwnProperty('creator')) {
        obj['creator'] = CreatorType.constructFromObject(data['creator']);
      }
      if (data.hasOwnProperty('created_at')) {
        obj['created_at'] = ApiClient.convertToType(data['created_at'], 'String');
      }
      if (data.hasOwnProperty('lastrun_at')) {
        obj['lastrun_at'] = ApiClient.convertToType(data['lastrun_at'], 'String');
      }
      if (data.hasOwnProperty('lastupdated_at')) {
        obj['lastupdated_at'] = ApiClient.convertToType(data['lastupdated_at'], 'String');
      }
    }
    return obj;
  }

  /**
   * Name of the plugin. Plugin names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Plugin ID uniquely identifying this plugin.
   * @member {String} plugin_id
   */
  exports.prototype['plugin_id'] = undefined;
  /**
   * Description of this plugin.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * The account ID of the account that this plugin belongs to.
   * @member {String} acct_id
   */
  exports.prototype['acct_id'] = undefined;
  /**
   * An array of security group IDs. The plugin belongs to each Security Group in this array.
   * @member {Array.<String>} groups
   */
  exports.prototype['groups'] = undefined;
  /**
   * The default group of this plugin. This is the group where security objects will be created by default by this plugin.
   * @member {String} default_group
   */
  exports.prototype['default_group'] = undefined;
  /**
   * @member {module:model/PluginSource} source
   */
  exports.prototype['source'] = undefined;
  /**
   * Whether this plugin is enabled.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * @member {module:model/PluginType} plugin_type
   */
  exports.prototype['plugin_type'] = undefined;
  /**
   * The list of regions this plugin may run in.
   * @member {Array.<String>} regions
   */
  exports.prototype['regions'] = undefined;
  /**
   * @member {module:model/CreatorType} creator
   */
  exports.prototype['creator'] = undefined;
  /**
   * When this plugin was created.
   * @member {String} created_at
   */
  exports.prototype['created_at'] = undefined;
  /**
   * When this plugin was last run.
   * @member {String} lastrun_at
   */
  exports.prototype['lastrun_at'] = undefined;
  /**
   * When this plugin was last updated.
   * @member {String} lastupdated_at
   */
  exports.prototype['lastupdated_at'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CreatorType":74,"./PluginSource":141,"./PluginType":142}],138:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.PluginInvokeRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The PluginInvokeRequest model module.
   * @module model/PluginInvokeRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>PluginInvokeRequest</code>.
   * @alias module:model/PluginInvokeRequest
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>PluginInvokeRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PluginInvokeRequest} obj Optional instance to populate.
   * @return {module:model/PluginInvokeRequest} The populated <code>PluginInvokeRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],139:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.PluginInvokeResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The PluginInvokeResponse model module.
   * @module model/PluginInvokeResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>PluginInvokeResponse</code>.
   * @alias module:model/PluginInvokeResponse
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>PluginInvokeResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PluginInvokeResponse} obj Optional instance to populate.
   * @return {module:model/PluginInvokeResponse} The populated <code>PluginInvokeResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],140:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/PluginSource', 'model/PluginType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./PluginSource'), require('./PluginType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.PluginRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.PluginSource, root.FortanixSdkmsRestApi.PluginType);
  }
}(this, function(ApiClient, PluginSource, PluginType) {
  'use strict';




  /**
   * The PluginRequest model module.
   * @module model/PluginRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>PluginRequest</code>.
   * @alias module:model/PluginRequest
   * @class
   * @param name {String} Name of the plugin. Plugin names must be unique within an account.
   * @param addGroups {Array.<String>} An array of Security Group IDs to add to this plugin.
   * @param defaultGroup {String} The default group of this plugin. This is the group where security objects will be created by default by this plugin.
   * @param source {module:model/PluginSource} 
   */
  var exports = function(name, addGroups, defaultGroup, source) {
    var _this = this;

    _this['name'] = name;

    _this['add_groups'] = addGroups;

    _this['default_group'] = defaultGroup;
    _this['source'] = source;


  };

  /**
   * Constructs a <code>PluginRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PluginRequest} obj Optional instance to populate.
   * @return {module:model/PluginRequest} The populated <code>PluginRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('add_groups')) {
        obj['add_groups'] = ApiClient.convertToType(data['add_groups'], ['String']);
      }
      if (data.hasOwnProperty('del_groups')) {
        obj['del_groups'] = ApiClient.convertToType(data['del_groups'], ['String']);
      }
      if (data.hasOwnProperty('default_group')) {
        obj['default_group'] = ApiClient.convertToType(data['default_group'], 'String');
      }
      if (data.hasOwnProperty('source')) {
        obj['source'] = PluginSource.constructFromObject(data['source']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('plugin_type')) {
        obj['plugin_type'] = PluginType.constructFromObject(data['plugin_type']);
      }
    }
    return obj;
  }

  /**
   * Name of the plugin. Plugin names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Description of this plugin.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * An array of Security Group IDs to add to this plugin.
   * @member {Array.<String>} add_groups
   */
  exports.prototype['add_groups'] = undefined;
  /**
   * An array of security group IDs to remove from this plugin.
   * @member {Array.<String>} del_groups
   */
  exports.prototype['del_groups'] = undefined;
  /**
   * The default group of this plugin. This is the group where security objects will be created by default by this plugin.
   * @member {String} default_group
   */
  exports.prototype['default_group'] = undefined;
  /**
   * @member {module:model/PluginSource} source
   */
  exports.prototype['source'] = undefined;
  /**
   * Whether this plugin is enabled.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * @member {module:model/PluginType} plugin_type
   */
  exports.prototype['plugin_type'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./PluginSource":141,"./PluginType":142}],141:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Language'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Language'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.PluginSource = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.Language);
  }
}(this, function(ApiClient, Language) {
  'use strict';




  /**
   * The PluginSource model module.
   * @module model/PluginSource
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>PluginSource</code>.
   * Plugin code that will be executed in SDKMS.
   * @alias module:model/PluginSource
   * @class
   * @param language {module:model/Language} 
   * @param code {String} 
   */
  var exports = function(language, code) {
    var _this = this;

    _this['language'] = language;
    _this['code'] = code;
  };

  /**
   * Constructs a <code>PluginSource</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PluginSource} obj Optional instance to populate.
   * @return {module:model/PluginSource} The populated <code>PluginSource</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('language')) {
        obj['language'] = Language.constructFromObject(data['language']);
      }
      if (data.hasOwnProperty('code')) {
        obj['code'] = ApiClient.convertToType(data['code'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/Language} language
   */
  exports.prototype['language'] = undefined;
  /**
   * @member {String} code
   */
  exports.prototype['code'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./Language":118}],142:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.PluginType = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class PluginType.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "Standard"
     * @const
     */
    "Standard": "Standard",
    /**
     * value: "Impersonating"
     * @const
     */
    "Impersonating": "Impersonating",
    /**
     * value: "CustomAlgorithm"
     * @const
     */
    "CustomAlgorithm": "CustomAlgorithm"  };

  /**
   * Returns a <code>PluginType</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/PluginType} The enum <code>PluginType</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],143:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ProcessInviteRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ProcessInviteRequest model module.
   * @module model/ProcessInviteRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ProcessInviteRequest</code>.
   * @alias module:model/ProcessInviteRequest
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>ProcessInviteRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProcessInviteRequest} obj Optional instance to populate.
   * @return {module:model/ProcessInviteRequest} The populated <code>ProcessInviteRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('accepts')) {
        obj['accepts'] = ApiClient.convertToType(data['accepts'], ['String']);
      }
      if (data.hasOwnProperty('rejects')) {
        obj['rejects'] = ApiClient.convertToType(data['rejects'], ['String']);
      }
    }
    return obj;
  }

  /**
   * @member {Array.<String>} accepts
   */
  exports.prototype['accepts'] = undefined;
  /**
   * @member {Array.<String>} rejects
   */
  exports.prototype['rejects'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],144:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RecoveryCodes = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The RecoveryCodes model module.
   * @module model/RecoveryCodes
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RecoveryCodes</code>.
   * Backup recovery codes for two factor authentication.
   * @alias module:model/RecoveryCodes
   * @class
   * @param recoveryCodes {Array.<String>} 
   */
  var exports = function(recoveryCodes) {
    var _this = this;

    _this['recovery_codes'] = recoveryCodes;
  };

  /**
   * Constructs a <code>RecoveryCodes</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RecoveryCodes} obj Optional instance to populate.
   * @return {module:model/RecoveryCodes} The populated <code>RecoveryCodes</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('recovery_codes')) {
        obj['recovery_codes'] = ApiClient.convertToType(data['recovery_codes'], ['String']);
      }
    }
    return obj;
  }

  /**
   * @member {Array.<String>} recovery_codes
   */
  exports.prototype['recovery_codes'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],145:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/RsaEncryptionPaddingOAEP'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./RsaEncryptionPaddingOAEP'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RsaEncryptionPadding = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.RsaEncryptionPaddingOAEP);
  }
}(this, function(ApiClient, RsaEncryptionPaddingOAEP) {
  'use strict';




  /**
   * The RsaEncryptionPadding model module.
   * @module model/RsaEncryptionPadding
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RsaEncryptionPadding</code>.
   * Type of padding to use for RSA encryption. The use of PKCS#1 v1.5 padding is strongly discouraged, because of its susceptibility to Bleichenbacher&#39;s attack. The padding specified must adhere to the key&#39;s encryption policy, see &#x60;RsaEncryptionPolicy&#x60;. If not specified, the default based on the key&#39;s policy will be used. 
   * @alias module:model/RsaEncryptionPadding
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>RsaEncryptionPadding</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RsaEncryptionPadding} obj Optional instance to populate.
   * @return {module:model/RsaEncryptionPadding} The populated <code>RsaEncryptionPadding</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('PKCS1_V15')) {
        obj['PKCS1_V15'] = ApiClient.convertToType(data['PKCS1_V15'], Object);
      }
      if (data.hasOwnProperty('OAEP')) {
        obj['OAEP'] = RsaEncryptionPaddingOAEP.constructFromObject(data['OAEP']);
      }
    }
    return obj;
  }

  /**
   * PKCS#1 v1.5 padding
   * @member {Object} PKCS1_V15
   */
  exports.prototype['PKCS1_V15'] = undefined;
  /**
   * @member {module:model/RsaEncryptionPaddingOAEP} OAEP
   */
  exports.prototype['OAEP'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./RsaEncryptionPaddingOAEP":146}],146:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Mgf'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Mgf'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RsaEncryptionPaddingOAEP = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.Mgf);
  }
}(this, function(ApiClient, Mgf) {
  'use strict';




  /**
   * The RsaEncryptionPaddingOAEP model module.
   * @module model/RsaEncryptionPaddingOAEP
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RsaEncryptionPaddingOAEP</code>.
   * Optimal Asymmetric Encryption Padding (PKCS#1 v2.1)
   * @alias module:model/RsaEncryptionPaddingOAEP
   * @class
   * @param mgf {module:model/Mgf} 
   */
  var exports = function(mgf) {
    var _this = this;

    _this['mgf'] = mgf;
  };

  /**
   * Constructs a <code>RsaEncryptionPaddingOAEP</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RsaEncryptionPaddingOAEP} obj Optional instance to populate.
   * @return {module:model/RsaEncryptionPaddingOAEP} The populated <code>RsaEncryptionPaddingOAEP</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('mgf')) {
        obj['mgf'] = Mgf.constructFromObject(data['mgf']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/Mgf} mgf
   */
  exports.prototype['mgf'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./Mgf":128}],147:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/RsaEncryptionPolicyPadding'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./RsaEncryptionPolicyPadding'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RsaEncryptionPolicy = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.RsaEncryptionPolicyPadding);
  }
}(this, function(ApiClient, RsaEncryptionPolicyPadding) {
  'use strict';




  /**
   * The RsaEncryptionPolicy model module.
   * @module model/RsaEncryptionPolicy
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RsaEncryptionPolicy</code>.
   * Constraints on RSA encryption parameters. In general, if a constraint is not specified, anything is allowed.
   * @alias module:model/RsaEncryptionPolicy
   * @class
   */
  var exports = function() {
    var _this = this;


  };

  /**
   * Constructs a <code>RsaEncryptionPolicy</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RsaEncryptionPolicy} obj Optional instance to populate.
   * @return {module:model/RsaEncryptionPolicy} The populated <code>RsaEncryptionPolicy</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('padding')) {
        obj['padding'] = RsaEncryptionPolicyPadding.constructFromObject(data['padding']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/RsaEncryptionPolicyPadding} padding
   */
  exports.prototype['padding'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./RsaEncryptionPolicyPadding":148}],148:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/RsaEncryptionPolicyPaddingOAEP'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./RsaEncryptionPolicyPaddingOAEP'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RsaEncryptionPolicyPadding = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.RsaEncryptionPolicyPaddingOAEP);
  }
}(this, function(ApiClient, RsaEncryptionPolicyPaddingOAEP) {
  'use strict';




  /**
   * The RsaEncryptionPolicyPadding model module.
   * @module model/RsaEncryptionPolicyPadding
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RsaEncryptionPolicyPadding</code>.
   * @alias module:model/RsaEncryptionPolicyPadding
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>RsaEncryptionPolicyPadding</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RsaEncryptionPolicyPadding} obj Optional instance to populate.
   * @return {module:model/RsaEncryptionPolicyPadding} The populated <code>RsaEncryptionPolicyPadding</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('PKCS1_V15')) {
        obj['PKCS1_V15'] = ApiClient.convertToType(data['PKCS1_V15'], Object);
      }
      if (data.hasOwnProperty('OAEP')) {
        obj['OAEP'] = RsaEncryptionPolicyPaddingOAEP.constructFromObject(data['OAEP']);
      }
    }
    return obj;
  }

  /**
   * @member {Object} PKCS1_V15
   */
  exports.prototype['PKCS1_V15'] = undefined;
  /**
   * @member {module:model/RsaEncryptionPolicyPaddingOAEP} OAEP
   */
  exports.prototype['OAEP'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./RsaEncryptionPolicyPaddingOAEP":149}],149:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/RsaEncryptionPolicyPaddingOAEPMgf1'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./RsaEncryptionPolicyPaddingOAEPMgf1'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RsaEncryptionPolicyPaddingOAEP = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.RsaEncryptionPolicyPaddingOAEPMgf1);
  }
}(this, function(ApiClient, RsaEncryptionPolicyPaddingOAEPMgf1) {
  'use strict';




  /**
   * The RsaEncryptionPolicyPaddingOAEP model module.
   * @module model/RsaEncryptionPolicyPaddingOAEP
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RsaEncryptionPolicyPaddingOAEP</code>.
   * @alias module:model/RsaEncryptionPolicyPaddingOAEP
   * @class
   */
  var exports = function() {
    var _this = this;


  };

  /**
   * Constructs a <code>RsaEncryptionPolicyPaddingOAEP</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RsaEncryptionPolicyPaddingOAEP} obj Optional instance to populate.
   * @return {module:model/RsaEncryptionPolicyPaddingOAEP} The populated <code>RsaEncryptionPolicyPaddingOAEP</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('mgf1')) {
        obj['mgf1'] = RsaEncryptionPolicyPaddingOAEPMgf1.constructFromObject(data['mgf1']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/RsaEncryptionPolicyPaddingOAEPMgf1} mgf1
   */
  exports.prototype['mgf1'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./RsaEncryptionPolicyPaddingOAEPMgf1":150}],150:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RsaEncryptionPolicyPaddingOAEPMgf1 = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm);
  }
}(this, function(ApiClient, DigestAlgorithm) {
  'use strict';




  /**
   * The RsaEncryptionPolicyPaddingOAEPMgf1 model module.
   * @module model/RsaEncryptionPolicyPaddingOAEPMgf1
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RsaEncryptionPolicyPaddingOAEPMgf1</code>.
   * @alias module:model/RsaEncryptionPolicyPaddingOAEPMgf1
   * @class
   */
  var exports = function() {
    var _this = this;


  };

  /**
   * Constructs a <code>RsaEncryptionPolicyPaddingOAEPMgf1</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RsaEncryptionPolicyPaddingOAEPMgf1} obj Optional instance to populate.
   * @return {module:model/RsaEncryptionPolicyPaddingOAEPMgf1} The populated <code>RsaEncryptionPolicyPaddingOAEPMgf1</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('hash')) {
        obj['hash'] = DigestAlgorithm.constructFromObject(data['hash']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/DigestAlgorithm} hash
   */
  exports.prototype['hash'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91}],151:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/RsaEncryptionPolicy', 'model/RsaSignaturePolicy'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./RsaEncryptionPolicy'), require('./RsaSignaturePolicy'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RsaOptions = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.RsaEncryptionPolicy, root.FortanixSdkmsRestApi.RsaSignaturePolicy);
  }
}(this, function(ApiClient, RsaEncryptionPolicy, RsaSignaturePolicy) {
  'use strict';




  /**
   * The RsaOptions model module.
   * @module model/RsaOptions
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RsaOptions</code>.
   * RSA-specific options.
   * @alias module:model/RsaOptions
   * @class
   * @param encryptionPolicy {Array.<module:model/RsaEncryptionPolicy>} Encryption policy for this RSA key. When doing an encryption or key wrapping operation, the policies are evaluated against the specified parameters one by one. If one matches, the operation is allowed. If none match, including if the policy list is empty, the operation is disallowed. Missing optional parameters will have their defaults specified according to the matched policy. The default for new keys is `[{\"padding\":{\"OAEP\":{}}]`. If (part of) a constraint is not specified, anything is allowed for that constraint. To impose no constraints, specify `[{}]`. 
   */
  var exports = function(encryptionPolicy) {
    var _this = this;



    _this['encryption_policy'] = encryptionPolicy;

  };

  /**
   * Constructs a <code>RsaOptions</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RsaOptions} obj Optional instance to populate.
   * @return {module:model/RsaOptions} The populated <code>RsaOptions</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key_size')) {
        obj['key_size'] = ApiClient.convertToType(data['key_size'], 'Number');
      }
      if (data.hasOwnProperty('public_exponent')) {
        obj['public_exponent'] = ApiClient.convertToType(data['public_exponent'], 'Number');
      }
      if (data.hasOwnProperty('encryption_policy')) {
        obj['encryption_policy'] = ApiClient.convertToType(data['encryption_policy'], [RsaEncryptionPolicy]);
      }
      if (data.hasOwnProperty('signature_policy')) {
        obj['signature_policy'] = ApiClient.convertToType(data['signature_policy'], [RsaSignaturePolicy]);
      }
    }
    return obj;
  }

  /**
   * Specify on Create only. Returned on Get. Size in bits (not bytes) of the RSA key.
   * @member {Number} key_size
   */
  exports.prototype['key_size'] = undefined;
  /**
   * Specify on Create only. Public exponent to use for generating the RSA key.
   * @member {Number} public_exponent
   */
  exports.prototype['public_exponent'] = undefined;
  /**
   * Encryption policy for this RSA key. When doing an encryption or key wrapping operation, the policies are evaluated against the specified parameters one by one. If one matches, the operation is allowed. If none match, including if the policy list is empty, the operation is disallowed. Missing optional parameters will have their defaults specified according to the matched policy. The default for new keys is `[{\"padding\":{\"OAEP\":{}}]`. If (part of) a constraint is not specified, anything is allowed for that constraint. To impose no constraints, specify `[{}]`. 
   * @member {Array.<module:model/RsaEncryptionPolicy>} encryption_policy
   */
  exports.prototype['encryption_policy'] = undefined;
  /**
   * Signature policy for this RSA key. When doing a signature operation, the policies are evaluated against the specified parameters one by one. If one matches, the operation is allowed. If none match, including if the policy list is empty, the operation is disallowed. Missing optional parameters will have their defaults specified according to the matched policy. The default for new keys is `[{}]` (no constraints). If (part of) a constraint is not specified, anything is allowed for that constraint. 
   * @member {Array.<module:model/RsaSignaturePolicy>} signature_policy
   */
  exports.prototype['signature_policy'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./RsaEncryptionPolicy":147,"./RsaSignaturePolicy":154}],152:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/RsaSignaturePaddingPSS'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./RsaSignaturePaddingPSS'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RsaSignaturePadding = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.RsaSignaturePaddingPSS);
  }
}(this, function(ApiClient, RsaSignaturePaddingPSS) {
  'use strict';




  /**
   * The RsaSignaturePadding model module.
   * @module model/RsaSignaturePadding
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RsaSignaturePadding</code>.
   * Type of padding to use for RSA signatures. The padding specified must adhere to the key&#39;s signature policy, see &#x60;RsaSignaturePolicy&#x60;. If not specified, the default based on the key&#39;s policy will be used. 
   * @alias module:model/RsaSignaturePadding
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>RsaSignaturePadding</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RsaSignaturePadding} obj Optional instance to populate.
   * @return {module:model/RsaSignaturePadding} The populated <code>RsaSignaturePadding</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('PKCS1_V15')) {
        obj['PKCS1_V15'] = ApiClient.convertToType(data['PKCS1_V15'], Object);
      }
      if (data.hasOwnProperty('PSS')) {
        obj['PSS'] = RsaSignaturePaddingPSS.constructFromObject(data['PSS']);
      }
    }
    return obj;
  }

  /**
   * PKCS#1 v1.5 padding
   * @member {Object} PKCS1_V15
   */
  exports.prototype['PKCS1_V15'] = undefined;
  /**
   * @member {module:model/RsaSignaturePaddingPSS} PSS
   */
  exports.prototype['PSS'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./RsaSignaturePaddingPSS":153}],153:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Mgf'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Mgf'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RsaSignaturePaddingPSS = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.Mgf);
  }
}(this, function(ApiClient, Mgf) {
  'use strict';




  /**
   * The RsaSignaturePaddingPSS model module.
   * @module model/RsaSignaturePaddingPSS
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RsaSignaturePaddingPSS</code>.
   * Probabilistic Signature Scheme (PKCS#1 v2.1)
   * @alias module:model/RsaSignaturePaddingPSS
   * @class
   * @param mgf {module:model/Mgf} 
   */
  var exports = function(mgf) {
    var _this = this;

    _this['mgf'] = mgf;
  };

  /**
   * Constructs a <code>RsaSignaturePaddingPSS</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RsaSignaturePaddingPSS} obj Optional instance to populate.
   * @return {module:model/RsaSignaturePaddingPSS} The populated <code>RsaSignaturePaddingPSS</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('mgf')) {
        obj['mgf'] = Mgf.constructFromObject(data['mgf']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/Mgf} mgf
   */
  exports.prototype['mgf'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./Mgf":128}],154:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/RsaSignaturePolicyPadding'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./RsaSignaturePolicyPadding'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RsaSignaturePolicy = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.RsaSignaturePolicyPadding);
  }
}(this, function(ApiClient, RsaSignaturePolicyPadding) {
  'use strict';




  /**
   * The RsaSignaturePolicy model module.
   * @module model/RsaSignaturePolicy
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RsaSignaturePolicy</code>.
   * Constraints on RSA signature parameters. In general, if a constraint is not specified, anything is allowed.
   * @alias module:model/RsaSignaturePolicy
   * @class
   */
  var exports = function() {
    var _this = this;


  };

  /**
   * Constructs a <code>RsaSignaturePolicy</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RsaSignaturePolicy} obj Optional instance to populate.
   * @return {module:model/RsaSignaturePolicy} The populated <code>RsaSignaturePolicy</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('padding')) {
        obj['padding'] = RsaSignaturePolicyPadding.constructFromObject(data['padding']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/RsaSignaturePolicyPadding} padding
   */
  exports.prototype['padding'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./RsaSignaturePolicyPadding":155}],155:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/RsaEncryptionPolicyPaddingOAEP'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./RsaEncryptionPolicyPaddingOAEP'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.RsaSignaturePolicyPadding = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.RsaEncryptionPolicyPaddingOAEP);
  }
}(this, function(ApiClient, RsaEncryptionPolicyPaddingOAEP) {
  'use strict';




  /**
   * The RsaSignaturePolicyPadding model module.
   * @module model/RsaSignaturePolicyPadding
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>RsaSignaturePolicyPadding</code>.
   * @alias module:model/RsaSignaturePolicyPadding
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>RsaSignaturePolicyPadding</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RsaSignaturePolicyPadding} obj Optional instance to populate.
   * @return {module:model/RsaSignaturePolicyPadding} The populated <code>RsaSignaturePolicyPadding</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('PKCS1_V15')) {
        obj['PKCS1_V15'] = ApiClient.convertToType(data['PKCS1_V15'], Object);
      }
      if (data.hasOwnProperty('PSS')) {
        obj['PSS'] = RsaEncryptionPolicyPaddingOAEP.constructFromObject(data['PSS']);
      }
    }
    return obj;
  }

  /**
   * @member {Object} PKCS1_V15
   */
  exports.prototype['PKCS1_V15'] = undefined;
  /**
   * @member {module:model/RsaEncryptionPolicyPaddingOAEP} PSS
   */
  exports.prototype['PSS'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./RsaEncryptionPolicyPaddingOAEP":149}],156:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SelectAccountRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The SelectAccountRequest model module.
   * @module model/SelectAccountRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SelectAccountRequest</code>.
   * @alias module:model/SelectAccountRequest
   * @class
   * @param acctId {String} Uuid format string, example - a41152ed-c26e-4c6e-a8d1-8820e36972c3
   */
  var exports = function(acctId) {
    var _this = this;

    _this['acct_id'] = acctId;
  };

  /**
   * Constructs a <code>SelectAccountRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SelectAccountRequest} obj Optional instance to populate.
   * @return {module:model/SelectAccountRequest} The populated <code>SelectAccountRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('acct_id')) {
        obj['acct_id'] = ApiClient.convertToType(data['acct_id'], 'String');
      }
    }
    return obj;
  }

  /**
   * Uuid format string, example - a41152ed-c26e-4c6e-a8d1-8820e36972c3
   * @member {String} acct_id
   */
  exports.prototype['acct_id'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],157:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SelectAccountResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The SelectAccountResponse model module.
   * @module model/SelectAccountResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SelectAccountResponse</code>.
   * @alias module:model/SelectAccountResponse
   * @class
   */
  var exports = function() {
    var _this = this;


  };

  /**
   * Constructs a <code>SelectAccountResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SelectAccountResponse} obj Optional instance to populate.
   * @return {module:model/SelectAccountResponse} The populated <code>SelectAccountResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('cookie')) {
        obj['cookie'] = ApiClient.convertToType(data['cookie'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} cookie
   */
  exports.prototype['cookie'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],158:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ServerMode = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class ServerMode.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "Software"
     * @const
     */
    "Software": "Software",
    /**
     * value: "Sgx"
     * @const
     */
    "Sgx": "Sgx"  };

  /**
   * Returns a <code>ServerMode</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/ServerMode} The enum <code>ServerMode</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],159:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm', 'model/SignatureMode'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'), require('./SignatureMode'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SignRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm, root.FortanixSdkmsRestApi.SignatureMode);
  }
}(this, function(ApiClient, DigestAlgorithm, SignatureMode) {
  'use strict';




  /**
   * The SignRequest model module.
   * @module model/SignRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SignRequest</code>.
   * @alias module:model/SignRequest
   * @class
   * @param hashAlg {module:model/DigestAlgorithm} 
   */
  var exports = function(hashAlg) {
    var _this = this;

    _this['hash_alg'] = hashAlg;



  };

  /**
   * Constructs a <code>SignRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SignRequest} obj Optional instance to populate.
   * @return {module:model/SignRequest} The populated <code>SignRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('hash_alg')) {
        obj['hash_alg'] = DigestAlgorithm.constructFromObject(data['hash_alg']);
      }
      if (data.hasOwnProperty('hash')) {
        obj['hash'] = ApiClient.convertToType(data['hash'], 'Blob');
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], 'Blob');
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = SignatureMode.constructFromObject(data['mode']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/DigestAlgorithm} hash_alg
   */
  exports.prototype['hash_alg'] = undefined;
  /**
   * Hash of the data to be signed. Exactly one of `hash` and `data` is required. 
   * @member {Blob} hash
   */
  exports.prototype['hash'] = undefined;
  /**
   * Data to be signed. Exactly one of `hash` and `data` is required. To reduce request size and avoid reaching the request size limit, prefer `hash`. 
   * @member {Blob} data
   */
  exports.prototype['data'] = undefined;
  /**
   * @member {module:model/SignatureMode} mode
   */
  exports.prototype['mode'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91,"./SignatureMode":162}],160:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm', 'model/SignatureMode', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'), require('./SignatureMode'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SignRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm, root.FortanixSdkmsRestApi.SignatureMode, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, DigestAlgorithm, SignatureMode, SobjectDescriptor) {
  'use strict';




  /**
   * The SignRequestEx model module.
   * @module model/SignRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SignRequestEx</code>.
   * @alias module:model/SignRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param hashAlg {module:model/DigestAlgorithm} 
   */
  var exports = function(key, hashAlg) {
    var _this = this;

    _this['key'] = key;
    _this['hash_alg'] = hashAlg;



  };

  /**
   * Constructs a <code>SignRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SignRequestEx} obj Optional instance to populate.
   * @return {module:model/SignRequestEx} The populated <code>SignRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('hash_alg')) {
        obj['hash_alg'] = DigestAlgorithm.constructFromObject(data['hash_alg']);
      }
      if (data.hasOwnProperty('hash')) {
        obj['hash'] = ApiClient.convertToType(data['hash'], 'Blob');
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], 'Blob');
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = SignatureMode.constructFromObject(data['mode']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/DigestAlgorithm} hash_alg
   */
  exports.prototype['hash_alg'] = undefined;
  /**
   * Hash of the data to be signed. Exactly one of `hash` and `data` is required. 
   * @member {Blob} hash
   */
  exports.prototype['hash'] = undefined;
  /**
   * Data to be signed. Exactly one of `hash` and `data` is required. To reduce request size and avoid reaching the request size limit, prefer `hash`. 
   * @member {Blob} data
   */
  exports.prototype['data'] = undefined;
  /**
   * @member {module:model/SignatureMode} mode
   */
  exports.prototype['mode'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91,"./SignatureMode":162,"./SobjectDescriptor":164}],161:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SignResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The SignResponse model module.
   * @module model/SignResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SignResponse</code>.
   * @alias module:model/SignResponse
   * @class
   * @param signature {Blob} Signature of the data's hash.
   */
  var exports = function(signature) {
    var _this = this;


    _this['signature'] = signature;
  };

  /**
   * Constructs a <code>SignResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SignResponse} obj Optional instance to populate.
   * @return {module:model/SignResponse} The populated <code>SignResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('signature')) {
        obj['signature'] = ApiClient.convertToType(data['signature'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * Key ID of the key used to sign this data.
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * Signature of the data's hash.
   * @member {Blob} signature
   */
  exports.prototype['signature'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],162:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/RsaSignaturePaddingPSS'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./RsaSignaturePaddingPSS'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SignatureMode = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.RsaSignaturePaddingPSS);
  }
}(this, function(ApiClient, RsaSignaturePaddingPSS) {
  'use strict';




  /**
   * The SignatureMode model module.
   * @module model/SignatureMode
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SignatureMode</code>.
   * Type of padding to use for RSA signatures. The padding specified must adhere to the key&#39;s signature policy, see &#x60;RsaSignaturePolicy&#x60;. If not specified, the default based on the key&#39;s policy will be used. 
   * @alias module:model/SignatureMode
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>SignatureMode</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SignatureMode} obj Optional instance to populate.
   * @return {module:model/SignatureMode} The populated <code>SignatureMode</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('PKCS1_V15')) {
        obj['PKCS1_V15'] = ApiClient.convertToType(data['PKCS1_V15'], Object);
      }
      if (data.hasOwnProperty('PSS')) {
        obj['PSS'] = RsaSignaturePaddingPSS.constructFromObject(data['PSS']);
      }
    }
    return obj;
  }

  /**
   * PKCS#1 v1.5 padding
   * @member {Object} PKCS1_V15
   */
  exports.prototype['PKCS1_V15'] = undefined;
  /**
   * @member {module:model/RsaSignaturePaddingPSS} PSS
   */
  exports.prototype['PSS'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./RsaSignaturePaddingPSS":153}],163:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SignupRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The SignupRequest model module.
   * @module model/SignupRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SignupRequest</code>.
   * @alias module:model/SignupRequest
   * @class
   * @param userEmail {String} User's email address.
   * @param userPassword {String} The password to assign to this user in SDKMS.
   * @param recaptchaResponse {String} 
   */
  var exports = function(userEmail, userPassword, recaptchaResponse) {
    var _this = this;

    _this['user_email'] = userEmail;
    _this['user_password'] = userPassword;


    _this['recaptcha_response'] = recaptchaResponse;
  };

  /**
   * Constructs a <code>SignupRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SignupRequest} obj Optional instance to populate.
   * @return {module:model/SignupRequest} The populated <code>SignupRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user_email')) {
        obj['user_email'] = ApiClient.convertToType(data['user_email'], 'String');
      }
      if (data.hasOwnProperty('user_password')) {
        obj['user_password'] = ApiClient.convertToType(data['user_password'], 'String');
      }
      if (data.hasOwnProperty('first_name')) {
        obj['first_name'] = ApiClient.convertToType(data['first_name'], 'String');
      }
      if (data.hasOwnProperty('last_name')) {
        obj['last_name'] = ApiClient.convertToType(data['last_name'], 'String');
      }
      if (data.hasOwnProperty('recaptcha_response')) {
        obj['recaptcha_response'] = ApiClient.convertToType(data['recaptcha_response'], 'String');
      }
    }
    return obj;
  }

  /**
   * User's email address.
   * @member {String} user_email
   */
  exports.prototype['user_email'] = undefined;
  /**
   * The password to assign to this user in SDKMS.
   * @member {String} user_password
   */
  exports.prototype['user_password'] = undefined;
  /**
   * @member {String} first_name
   */
  exports.prototype['first_name'] = undefined;
  /**
   * @member {String} last_name
   */
  exports.prototype['last_name'] = undefined;
  /**
   * @member {String} recaptcha_response
   */
  exports.prototype['recaptcha_response'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],164:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SobjectDescriptor = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The SobjectDescriptor model module.
   * @module model/SobjectDescriptor
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SobjectDescriptor</code>.
   * This uniquely identifies a persisted or transient sobject. Exactly one of &#x60;kid&#x60;, &#x60;name&#x60;, and &#x60;transient_key&#x60; must be present. 
   * @alias module:model/SobjectDescriptor
   * @class
   */
  var exports = function() {
    var _this = this;




  };

  /**
   * Constructs a <code>SobjectDescriptor</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SobjectDescriptor} obj Optional instance to populate.
   * @return {module:model/SobjectDescriptor} The populated <code>SobjectDescriptor</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('transient_key')) {
        obj['transient_key'] = ApiClient.convertToType(data['transient_key'], 'String');
      }
    }
    return obj;
  }

  /**
   * Key ID uniquely identifying this persisted security object.
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * Name of this persisted security object.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Transient key blob.
   * @member {String} transient_key
   */
  exports.prototype['transient_key'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],165:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/EllipticCurve', 'model/KeyOperations', 'model/ObjectType', 'model/RsaOptions'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./EllipticCurve'), require('./KeyOperations'), require('./ObjectType'), require('./RsaOptions'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SobjectRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.EllipticCurve, root.FortanixSdkmsRestApi.KeyOperations, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.RsaOptions);
  }
}(this, function(ApiClient, EllipticCurve, KeyOperations, ObjectType, RsaOptions) {
  'use strict';




  /**
   * The SobjectRequest model module.
   * @module model/SobjectRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SobjectRequest</code>.
   * @alias module:model/SobjectRequest
   * @class
   * @param name {String} Name of the security object to create or import. Security object names must be unique within an account.
   * @param objType {module:model/ObjectType} 
   */
  var exports = function(name, objType) {
    var _this = this;

    _this['name'] = name;






    _this['obj_type'] = objType;





  };

  /**
   * Constructs a <code>SobjectRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SobjectRequest} obj Optional instance to populate.
   * @return {module:model/SobjectRequest} The populated <code>SobjectRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('key_size')) {
        obj['key_size'] = ApiClient.convertToType(data['key_size'], 'Number');
      }
      if (data.hasOwnProperty('pub_exponent')) {
        obj['pub_exponent'] = ApiClient.convertToType(data['pub_exponent'], 'Number');
      }
      if (data.hasOwnProperty('elliptic_curve')) {
        obj['elliptic_curve'] = EllipticCurve.constructFromObject(data['elliptic_curve']);
      }
      if (data.hasOwnProperty('rsa')) {
        obj['rsa'] = RsaOptions.constructFromObject(data['rsa']);
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('obj_type')) {
        obj['obj_type'] = ObjectType.constructFromObject(data['obj_type']);
      }
      if (data.hasOwnProperty('key_ops')) {
        obj['key_ops'] = ApiClient.convertToType(data['key_ops'], [KeyOperations]);
      }
      if (data.hasOwnProperty('custom_metadata')) {
        obj['custom_metadata'] = ApiClient.convertToType(data['custom_metadata'], {'String': 'String'});
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'Blob');
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('transient')) {
        obj['transient'] = ApiClient.convertToType(data['transient'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * Name of the security object to create or import. Security object names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Description of the security object to create or import.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Size in bits (not bytes) of the security object to create or import. Required for symmetric keys. Deprecated for RSA keys, specify it in `RsaOptions` instead.
   * @member {Number} key_size
   */
  exports.prototype['key_size'] = undefined;
  /**
   * For RSA keys only. Deprecated. Specify in `RsaOptions` instead. Public exponent to use when generating an RSA key.
   * @member {Number} pub_exponent
   */
  exports.prototype['pub_exponent'] = undefined;
  /**
   * @member {module:model/EllipticCurve} elliptic_curve
   */
  exports.prototype['elliptic_curve'] = undefined;
  /**
   * @member {module:model/RsaOptions} rsa
   */
  exports.prototype['rsa'] = undefined;
  /**
   * Group ID (not name) of the security group that this security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used. 
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * @member {module:model/ObjectType} obj_type
   */
  exports.prototype['obj_type'] = undefined;
  /**
   * Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled. 
   * @member {Array.<module:model/KeyOperations>} key_ops
   */
  exports.prototype['key_ops'] = undefined;
  /**
   * User-defined metadata for this key. Stored as key-value pairs.
   * @member {Object.<String, String>} custom_metadata
   */
  exports.prototype['custom_metadata'] = undefined;
  /**
   * When importing a security object, this field contains the binary contents to import. When creating a security object, this field is unused. The value of an OPAQUE or CERTIFICATE object is always returned. For other objects, the value is returned only with `/crypto/v1/keys/export` API (if the object is exportable). 
   * @member {Blob} value
   */
  exports.prototype['value'] = undefined;
  /**
   * Whether the new security object should be enabled. Disabled security objects may not perform cryptographic operations. 
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * If this is true, SDKMS will create a transient key.
   * @member {Boolean} transient
   */
  exports.prototype['transient'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./EllipticCurve":94,"./KeyOperations":117,"./ObjectType":133,"./RsaOptions":151}],166:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/TlsConfig'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./TlsConfig'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SplunkLoggingConfig = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.TlsConfig);
  }
}(this, function(ApiClient, TlsConfig) {
  'use strict';




  /**
   * The SplunkLoggingConfig model module.
   * @module model/SplunkLoggingConfig
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SplunkLoggingConfig</code>.
   * @alias module:model/SplunkLoggingConfig
   * @class
   * @param host {String} 
   * @param port {Number} 
   * @param index {String} The Splunk index that will receive log items
   * @param tls {module:model/TlsConfig} 
   * @param enabled {Boolean} 
   */
  var exports = function(host, port, index, tls, enabled) {
    var _this = this;

    _this['host'] = host;
    _this['port'] = port;
    _this['index'] = index;
    _this['tls'] = tls;
    _this['enabled'] = enabled;
  };

  /**
   * Constructs a <code>SplunkLoggingConfig</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SplunkLoggingConfig} obj Optional instance to populate.
   * @return {module:model/SplunkLoggingConfig} The populated <code>SplunkLoggingConfig</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('host')) {
        obj['host'] = ApiClient.convertToType(data['host'], 'String');
      }
      if (data.hasOwnProperty('port')) {
        obj['port'] = ApiClient.convertToType(data['port'], 'Number');
      }
      if (data.hasOwnProperty('index')) {
        obj['index'] = ApiClient.convertToType(data['index'], 'String');
      }
      if (data.hasOwnProperty('tls')) {
        obj['tls'] = TlsConfig.constructFromObject(data['tls']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * @member {String} host
   */
  exports.prototype['host'] = undefined;
  /**
   * @member {Number} port
   */
  exports.prototype['port'] = undefined;
  /**
   * The Splunk index that will receive log items
   * @member {String} index
   */
  exports.prototype['index'] = undefined;
  /**
   * @member {module:model/TlsConfig} tls
   */
  exports.prototype['tls'] = undefined;
  /**
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./TlsConfig":175}],167:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/TlsConfig'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./TlsConfig'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SplunkLoggingConfigRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.TlsConfig);
  }
}(this, function(ApiClient, TlsConfig) {
  'use strict';




  /**
   * The SplunkLoggingConfigRequest model module.
   * @module model/SplunkLoggingConfigRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SplunkLoggingConfigRequest</code>.
   * @alias module:model/SplunkLoggingConfigRequest
   * @class
   */
  var exports = function() {
    var _this = this;







  };

  /**
   * Constructs a <code>SplunkLoggingConfigRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SplunkLoggingConfigRequest} obj Optional instance to populate.
   * @return {module:model/SplunkLoggingConfigRequest} The populated <code>SplunkLoggingConfigRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('host')) {
        obj['host'] = ApiClient.convertToType(data['host'], 'String');
      }
      if (data.hasOwnProperty('port')) {
        obj['port'] = ApiClient.convertToType(data['port'], 'Number');
      }
      if (data.hasOwnProperty('index')) {
        obj['index'] = ApiClient.convertToType(data['index'], 'String');
      }
      if (data.hasOwnProperty('token')) {
        obj['token'] = ApiClient.convertToType(data['token'], 'String');
      }
      if (data.hasOwnProperty('tls')) {
        obj['tls'] = TlsConfig.constructFromObject(data['tls']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * @member {String} host
   */
  exports.prototype['host'] = undefined;
  /**
   * @member {Number} port
   */
  exports.prototype['port'] = undefined;
  /**
   * The Splunk index that will receive log items
   * @member {String} index
   */
  exports.prototype['index'] = undefined;
  /**
   * The Splunk authentication token
   * @member {String} token
   */
  exports.prototype['token'] = undefined;
  /**
   * @member {module:model/TlsConfig} tls
   */
  exports.prototype['tls'] = undefined;
  /**
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./TlsConfig":175}],168:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/GoogleServiceAccountKey'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./GoogleServiceAccountKey'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.StackdriverLoggingConfig = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.GoogleServiceAccountKey);
  }
}(this, function(ApiClient, GoogleServiceAccountKey) {
  'use strict';




  /**
   * The StackdriverLoggingConfig model module.
   * @module model/StackdriverLoggingConfig
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>StackdriverLoggingConfig</code>.
   * @alias module:model/StackdriverLoggingConfig
   * @class
   * @param logId {String} The log ID that will recieve the log items (see https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry).
   * @param serviceAccountKey {module:model/GoogleServiceAccountKey} 
   * @param enabled {Boolean} 
   */
  var exports = function(logId, serviceAccountKey, enabled) {
    var _this = this;

    _this['log_id'] = logId;
    _this['service_account_key'] = serviceAccountKey;
    _this['enabled'] = enabled;
  };

  /**
   * Constructs a <code>StackdriverLoggingConfig</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/StackdriverLoggingConfig} obj Optional instance to populate.
   * @return {module:model/StackdriverLoggingConfig} The populated <code>StackdriverLoggingConfig</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('log_id')) {
        obj['log_id'] = ApiClient.convertToType(data['log_id'], 'String');
      }
      if (data.hasOwnProperty('service_account_key')) {
        obj['service_account_key'] = GoogleServiceAccountKey.constructFromObject(data['service_account_key']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * The log ID that will recieve the log items (see https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry).
   * @member {String} log_id
   */
  exports.prototype['log_id'] = undefined;
  /**
   * @member {module:model/GoogleServiceAccountKey} service_account_key
   */
  exports.prototype['service_account_key'] = undefined;
  /**
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./GoogleServiceAccountKey":110}],169:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/GoogleServiceAccountKey'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./GoogleServiceAccountKey'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.StackdriverLoggingConfigRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.GoogleServiceAccountKey);
  }
}(this, function(ApiClient, GoogleServiceAccountKey) {
  'use strict';




  /**
   * The StackdriverLoggingConfigRequest model module.
   * @module model/StackdriverLoggingConfigRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>StackdriverLoggingConfigRequest</code>.
   * @alias module:model/StackdriverLoggingConfigRequest
   * @class
   */
  var exports = function() {
    var _this = this;




  };

  /**
   * Constructs a <code>StackdriverLoggingConfigRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/StackdriverLoggingConfigRequest} obj Optional instance to populate.
   * @return {module:model/StackdriverLoggingConfigRequest} The populated <code>StackdriverLoggingConfigRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('log_id')) {
        obj['log_id'] = ApiClient.convertToType(data['log_id'], 'String');
      }
      if (data.hasOwnProperty('service_account_key')) {
        obj['service_account_key'] = GoogleServiceAccountKey.constructFromObject(data['service_account_key']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * The log ID that will recieve the log items (see https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry).
   * @member {String} log_id
   */
  exports.prototype['log_id'] = undefined;
  /**
   * @member {module:model/GoogleServiceAccountKey} service_account_key
   */
  exports.prototype['service_account_key'] = undefined;
  /**
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./GoogleServiceAccountKey":110}],170:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/SubscriptionType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./SubscriptionType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SubscriptionChangeRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.SubscriptionType);
  }
}(this, function(ApiClient, SubscriptionType) {
  'use strict';




  /**
   * The SubscriptionChangeRequest model module.
   * @module model/SubscriptionChangeRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SubscriptionChangeRequest</code>.
   * Describes a request to update subscription.
   * @alias module:model/SubscriptionChangeRequest
   * @class
   * @param subscription {module:model/SubscriptionType} 
   */
  var exports = function(subscription) {
    var _this = this;

    _this['subscription'] = subscription;


  };

  /**
   * Constructs a <code>SubscriptionChangeRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SubscriptionChangeRequest} obj Optional instance to populate.
   * @return {module:model/SubscriptionChangeRequest} The populated <code>SubscriptionChangeRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('subscription')) {
        obj['subscription'] = SubscriptionType.constructFromObject(data['subscription']);
      }
      if (data.hasOwnProperty('contact')) {
        obj['contact'] = ApiClient.convertToType(data['contact'], 'String');
      }
      if (data.hasOwnProperty('comment')) {
        obj['comment'] = ApiClient.convertToType(data['comment'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SubscriptionType} subscription
   */
  exports.prototype['subscription'] = undefined;
  /**
   * contact information, e.g. phone number
   * @member {String} contact
   */
  exports.prototype['contact'] = undefined;
  /**
   * additional comments
   * @member {String} comment
   */
  exports.prototype['comment'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./SubscriptionType":171}],171:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.SubscriptionType = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The SubscriptionType model module.
   * @module model/SubscriptionType
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>SubscriptionType</code>.
   * Type of Subscription.
   * @alias module:model/SubscriptionType
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>SubscriptionType</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SubscriptionType} obj Optional instance to populate.
   * @return {module:model/SubscriptionType} The populated <code>SubscriptionType</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],172:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.TagDecryptInput = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The TagDecryptInput model module.
   * @module model/TagDecryptInput
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>TagDecryptInput</code>.
   * The authentication tag used with this ciphertext and authenticated data. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers. 
   * @alias module:model/TagDecryptInput
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>TagDecryptInput</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TagDecryptInput} obj Optional instance to populate.
   * @return {module:model/TagDecryptInput} The populated <code>TagDecryptInput</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],173:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.TagEncryptOutput = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The TagEncryptOutput model module.
   * @module model/TagEncryptOutput
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>TagEncryptOutput</code>.
   * For symmetric ciphers with cipher mode GCM or CCM, the authentication tag produced by the cipher. Its length will match the tag length specified by the encryption request. 
   * @alias module:model/TagEncryptOutput
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>TagEncryptOutput</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TagEncryptOutput} obj Optional instance to populate.
   * @return {module:model/TagEncryptOutput} The populated <code>TagEncryptOutput</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],174:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.TagLenEncryptInput = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The TagLenEncryptInput model module.
   * @module model/TagLenEncryptInput
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>TagLenEncryptInput</code>.
   * For symmetric ciphers with cipher mode GCM or CCM, this field specifies the length of the authentication tag to be produced. This field is specified in bits (not bytes). This field is required for symmetric ciphers with cipher mode GCM or CCM. It must not be specified for asymmetric ciphers and symmetric ciphers with other cipher modes.
   * @alias module:model/TagLenEncryptInput
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>TagLenEncryptInput</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TagLenEncryptInput} obj Optional instance to populate.
   * @return {module:model/TagLenEncryptInput} The populated <code>TagLenEncryptInput</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],175:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CaConfig', 'model/TlsMode'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CaConfig'), require('./TlsMode'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.TlsConfig = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CaConfig, root.FortanixSdkmsRestApi.TlsMode);
  }
}(this, function(ApiClient, CaConfig, TlsMode) {
  'use strict';




  /**
   * The TlsConfig model module.
   * @module model/TlsConfig
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>TlsConfig</code>.
   * @alias module:model/TlsConfig
   * @class
   * @param mode {module:model/TlsMode} 
   */
  var exports = function(mode) {
    var _this = this;

    _this['mode'] = mode;


  };

  /**
   * Constructs a <code>TlsConfig</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TlsConfig} obj Optional instance to populate.
   * @return {module:model/TlsConfig} The populated <code>TlsConfig</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('mode')) {
        obj['mode'] = TlsMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('validate_hostname')) {
        obj['validate_hostname'] = ApiClient.convertToType(data['validate_hostname'], 'Boolean');
      }
      if (data.hasOwnProperty('ca')) {
        obj['ca'] = CaConfig.constructFromObject(data['ca']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/TlsMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * @member {Boolean} validate_hostname
   */
  exports.prototype['validate_hostname'] = undefined;
  /**
   * @member {module:model/CaConfig} ca
   */
  exports.prototype['ca'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CaConfig":70,"./TlsMode":176}],176:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.TlsMode = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class TlsMode.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "disabled"
     * @const
     */
    "disabled": "disabled",
    /**
     * value: "opportunistic"
     * @const
     */
    "opportunistic": "opportunistic",
    /**
     * value: "required"
     * @const
     */
    "required": "required"  };

  /**
   * Returns a <code>TlsMode</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/TlsMode} The enum <code>TlsMode</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],177:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.U2fAddDeviceRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The U2fAddDeviceRequest model module.
   * @module model/U2fAddDeviceRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>U2fAddDeviceRequest</code>.
   * Description of a U2F device to add for two factor authentication.
   * @alias module:model/U2fAddDeviceRequest
   * @class
   * @param name {String} 
   * @param registrationData {String} 
   * @param clientData {String} 
   * @param version {String} 
   */
  var exports = function(name, registrationData, clientData, version) {
    var _this = this;

    _this['name'] = name;
    _this['registrationData'] = registrationData;
    _this['clientData'] = clientData;
    _this['version'] = version;
  };

  /**
   * Constructs a <code>U2fAddDeviceRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/U2fAddDeviceRequest} obj Optional instance to populate.
   * @return {module:model/U2fAddDeviceRequest} The populated <code>U2fAddDeviceRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('registrationData')) {
        obj['registrationData'] = ApiClient.convertToType(data['registrationData'], 'String');
      }
      if (data.hasOwnProperty('clientData')) {
        obj['clientData'] = ApiClient.convertToType(data['clientData'], 'String');
      }
      if (data.hasOwnProperty('version')) {
        obj['version'] = ApiClient.convertToType(data['version'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * @member {String} registrationData
   */
  exports.prototype['registrationData'] = undefined;
  /**
   * @member {String} clientData
   */
  exports.prototype['clientData'] = undefined;
  /**
   * @member {String} version
   */
  exports.prototype['version'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],178:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.U2fDelDeviceRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The U2fDelDeviceRequest model module.
   * @module model/U2fDelDeviceRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>U2fDelDeviceRequest</code>.
   * Request to delete a U2F device.
   * @alias module:model/U2fDelDeviceRequest
   * @class
   * @param name {String} 
   */
  var exports = function(name) {
    var _this = this;

    _this['name'] = name;
  };

  /**
   * Constructs a <code>U2fDelDeviceRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/U2fDelDeviceRequest} obj Optional instance to populate.
   * @return {module:model/U2fDelDeviceRequest} The populated <code>U2fDelDeviceRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} name
   */
  exports.prototype['name'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],179:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.U2fDevice = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The U2fDevice model module.
   * @module model/U2fDevice
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>U2fDevice</code>.
   * A U2f device that may be used for second factor authentication.
   * @alias module:model/U2fDevice
   * @class
   * @param name {String} 
   */
  var exports = function(name) {
    var _this = this;

    _this['name'] = name;
  };

  /**
   * Constructs a <code>U2fDevice</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/U2fDevice} obj Optional instance to populate.
   * @return {module:model/U2fDevice} The populated <code>U2fDevice</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} name
   */
  exports.prototype['name'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],180:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.U2fKey = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The U2fKey model module.
   * @module model/U2fKey
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>U2fKey</code>.
   * A U2F key that may be used for two factor authentication.
   * @alias module:model/U2fKey
   * @class
   * @param keyHandle {String} 
   * @param version {String} 
   */
  var exports = function(keyHandle, version) {
    var _this = this;

    _this['keyHandle'] = keyHandle;
    _this['version'] = version;
  };

  /**
   * Constructs a <code>U2fKey</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/U2fKey} obj Optional instance to populate.
   * @return {module:model/U2fKey} The populated <code>U2fKey</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('keyHandle')) {
        obj['keyHandle'] = ApiClient.convertToType(data['keyHandle'], 'String');
      }
      if (data.hasOwnProperty('version')) {
        obj['version'] = ApiClient.convertToType(data['version'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} keyHandle
   */
  exports.prototype['keyHandle'] = undefined;
  /**
   * @member {String} version
   */
  exports.prototype['version'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],181:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.U2fRenameDeviceRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The U2fRenameDeviceRequest model module.
   * @module model/U2fRenameDeviceRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>U2fRenameDeviceRequest</code>.
   * Request to rename a U2F device.
   * @alias module:model/U2fRenameDeviceRequest
   * @class
   * @param oldName {String} 
   * @param newName {String} 
   */
  var exports = function(oldName, newName) {
    var _this = this;

    _this['old_name'] = oldName;
    _this['new_name'] = newName;
  };

  /**
   * Constructs a <code>U2fRenameDeviceRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/U2fRenameDeviceRequest} obj Optional instance to populate.
   * @return {module:model/U2fRenameDeviceRequest} The populated <code>U2fRenameDeviceRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('old_name')) {
        obj['old_name'] = ApiClient.convertToType(data['old_name'], 'String');
      }
      if (data.hasOwnProperty('new_name')) {
        obj['new_name'] = ApiClient.convertToType(data['new_name'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} old_name
   */
  exports.prototype['old_name'] = undefined;
  /**
   * @member {String} new_name
   */
  exports.prototype['new_name'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],182:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CryptMode', 'model/KeyOperations', 'model/ObjectType', 'model/RsaOptions'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CryptMode'), require('./KeyOperations'), require('./ObjectType'), require('./RsaOptions'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.UnwrapKeyRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CryptMode, root.FortanixSdkmsRestApi.KeyOperations, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.RsaOptions);
  }
}(this, function(ApiClient, CryptMode, KeyOperations, ObjectType, RsaOptions) {
  'use strict';




  /**
   * The UnwrapKeyRequest model module.
   * @module model/UnwrapKeyRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>UnwrapKeyRequest</code>.
   * @alias module:model/UnwrapKeyRequest
   * @class
   * @param alg {module:model/ObjectType} 
   * @param objType {module:model/ObjectType} 
   * @param wrappedKey {Blob} A Security Object previously wrapped with another key. 
   * @param name {String} Name of the security object to unwrap. Security object names must be unique within an account.
   */
  var exports = function(alg, objType, wrappedKey, name) {
    var _this = this;

    _this['alg'] = alg;

    _this['obj_type'] = objType;
    _this['wrapped_key'] = wrappedKey;




    _this['name'] = name;






  };

  /**
   * Constructs a <code>UnwrapKeyRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UnwrapKeyRequest} obj Optional instance to populate.
   * @return {module:model/UnwrapKeyRequest} The populated <code>UnwrapKeyRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('obj_type')) {
        obj['obj_type'] = ObjectType.constructFromObject(data['obj_type']);
      }
      if (data.hasOwnProperty('wrapped_key')) {
        obj['wrapped_key'] = ApiClient.convertToType(data['wrapped_key'], 'Blob');
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CryptMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('ad')) {
        obj['ad'] = ApiClient.convertToType(data['ad'], 'Blob');
      }
      if (data.hasOwnProperty('tag')) {
        obj['tag'] = ApiClient.convertToType(data['tag'], 'Blob');
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('key_ops')) {
        obj['key_ops'] = ApiClient.convertToType(data['key_ops'], [KeyOperations]);
      }
      if (data.hasOwnProperty('custom_metadata')) {
        obj['custom_metadata'] = ApiClient.convertToType(data['custom_metadata'], {'String': 'String'});
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('transient')) {
        obj['transient'] = ApiClient.convertToType(data['transient'], 'Boolean');
      }
      if (data.hasOwnProperty('rsa')) {
        obj['rsa'] = RsaOptions.constructFromObject(data['rsa']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * Group ID (not name) of the security group that this security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used. 
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * @member {module:model/ObjectType} obj_type
   */
  exports.prototype['obj_type'] = undefined;
  /**
   * A Security Object previously wrapped with another key. 
   * @member {Blob} wrapped_key
   */
  exports.prototype['wrapped_key'] = undefined;
  /**
   * @member {module:model/CryptMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * The initialization value used to encrypt this ciphertext. This field is required for symmetric ciphers, and ignored for asymmetric ciphers. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * The authenticated data used with this ciphertext and authentication tag. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers. 
   * @member {Blob} ad
   */
  exports.prototype['ad'] = undefined;
  /**
   * The authentication tag used with this ciphertext and authenticated data. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers. 
   * @member {Blob} tag
   */
  exports.prototype['tag'] = undefined;
  /**
   * Name of the security object to unwrap. Security object names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Description of the Security object to unwrap.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled. 
   * @member {Array.<module:model/KeyOperations>} key_ops
   */
  exports.prototype['key_ops'] = undefined;
  /**
   * User-defined metadata for this key. Stored as key-value pairs.
   * @member {Object.<String, String>} custom_metadata
   */
  exports.prototype['custom_metadata'] = undefined;
  /**
   * Whether the new security object should be enabled. Disabled security objects may not perform cryptographic operations. 
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * If this is true, SDKMS will unwrap a transient key.
   * @member {Boolean} transient
   */
  exports.prototype['transient'] = undefined;
  /**
   * @member {module:model/RsaOptions} rsa
   */
  exports.prototype['rsa'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CryptMode":75,"./KeyOperations":117,"./ObjectType":133,"./RsaOptions":151}],183:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CryptMode', 'model/KeyOperations', 'model/ObjectType', 'model/RsaOptions', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CryptMode'), require('./KeyOperations'), require('./ObjectType'), require('./RsaOptions'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.UnwrapKeyRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CryptMode, root.FortanixSdkmsRestApi.KeyOperations, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.RsaOptions, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, CryptMode, KeyOperations, ObjectType, RsaOptions, SobjectDescriptor) {
  'use strict';




  /**
   * The UnwrapKeyRequestEx model module.
   * @module model/UnwrapKeyRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>UnwrapKeyRequestEx</code>.
   * @alias module:model/UnwrapKeyRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param alg {module:model/ObjectType} 
   * @param objType {module:model/ObjectType} 
   * @param wrappedKey {Blob} A Security Object previously wrapped with another key. 
   * @param name {String} Name of the security object to unwrap. Security object names must be unique within an account.
   */
  var exports = function(key, alg, objType, wrappedKey, name) {
    var _this = this;

    _this['key'] = key;
    _this['alg'] = alg;

    _this['obj_type'] = objType;
    _this['wrapped_key'] = wrappedKey;




    _this['name'] = name;





  };

  /**
   * Constructs a <code>UnwrapKeyRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UnwrapKeyRequestEx} obj Optional instance to populate.
   * @return {module:model/UnwrapKeyRequestEx} The populated <code>UnwrapKeyRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('obj_type')) {
        obj['obj_type'] = ObjectType.constructFromObject(data['obj_type']);
      }
      if (data.hasOwnProperty('wrapped_key')) {
        obj['wrapped_key'] = ApiClient.convertToType(data['wrapped_key'], 'Blob');
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CryptMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('ad')) {
        obj['ad'] = ApiClient.convertToType(data['ad'], 'Blob');
      }
      if (data.hasOwnProperty('tag')) {
        obj['tag'] = ApiClient.convertToType(data['tag'], 'Blob');
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
      }
      if (data.hasOwnProperty('key_ops')) {
        obj['key_ops'] = ApiClient.convertToType(data['key_ops'], [KeyOperations]);
      }
      if (data.hasOwnProperty('custom_metadata')) {
        obj['custom_metadata'] = ApiClient.convertToType(data['custom_metadata'], {'String': 'String'});
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('rsa')) {
        obj['rsa'] = RsaOptions.constructFromObject(data['rsa']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * Group ID (not name) of the security group that this security object should belong to. The user or application creating this security object must be a member of this group. If no group is specified, the default group for the user or application will be used. 
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * @member {module:model/ObjectType} obj_type
   */
  exports.prototype['obj_type'] = undefined;
  /**
   * A Security Object previously wrapped with another key. 
   * @member {Blob} wrapped_key
   */
  exports.prototype['wrapped_key'] = undefined;
  /**
   * @member {module:model/CryptMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * The initialization value used to encrypt this ciphertext. This field is required for symmetric ciphers, and ignored for asymmetric ciphers. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * The authenticated data used with this ciphertext and authentication tag. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers. 
   * @member {Blob} ad
   */
  exports.prototype['ad'] = undefined;
  /**
   * The authentication tag used with this ciphertext and authenticated data. This field is required for symmetric ciphers using cipher mode GCM or CCM, and must not be specified for all other ciphers. 
   * @member {Blob} tag
   */
  exports.prototype['tag'] = undefined;
  /**
   * Name of the security object to unwrap. Security object names must be unique within an account.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Description of the Security object to unwrap.
   * @member {String} description
   */
  exports.prototype['description'] = undefined;
  /**
   * Optional array of key operations to be enabled for this security object. If this property is not provided, the SDKMS server will provide a default set of key operations. Note that if you provide an empty array, all key operations will be disabled. 
   * @member {Array.<module:model/KeyOperations>} key_ops
   */
  exports.prototype['key_ops'] = undefined;
  /**
   * User-defined metadata for this key. Stored as key-value pairs.
   * @member {Object.<String, String>} custom_metadata
   */
  exports.prototype['custom_metadata'] = undefined;
  /**
   * Whether the new security object should be enabled. Disabled security objects may not perform cryptographic operations. 
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * @member {module:model/RsaOptions} rsa
   */
  exports.prototype['rsa'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CryptMode":75,"./KeyOperations":117,"./ObjectType":133,"./RsaOptions":151,"./SobjectDescriptor":164}],184:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/U2fDevice', 'model/UserAccountFlags', 'model/UserAccountMap', 'model/UserState'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./U2fDevice'), require('./UserAccountFlags'), require('./UserAccountMap'), require('./UserState'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.User = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.U2fDevice, root.FortanixSdkmsRestApi.UserAccountFlags, root.FortanixSdkmsRestApi.UserAccountMap, root.FortanixSdkmsRestApi.UserState);
  }
}(this, function(ApiClient, U2fDevice, UserAccountFlags, UserAccountMap, UserState) {
  'use strict';




  /**
   * The User model module.
   * @module model/User
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>User</code>.
   * @alias module:model/User
   * @class
   * @param userId {String} User ID uniquely identifying this user.
   * @param userEmail {String} The User's email address.
   * @param state {module:model/UserState} 
   * @param groups {module:model/UserAccountMap} 
   * @param enabled {Boolean} Whether this user's account is enabled.
   * @param emailVerified {Boolean} Whether this user's email has been verified.
   * @param createdAt {String} When this user was added to SDKMS.
   * @param u2fDevices {Array.<module:model/U2fDevice>} 
   */
  var exports = function(userId, userEmail, state, groups, enabled, emailVerified, createdAt, u2fDevices) {
    var _this = this;

    _this['user_id'] = userId;
    _this['user_email'] = userEmail;
    _this['state'] = state;

    _this['groups'] = groups;
    _this['enabled'] = enabled;
    _this['email_verified'] = emailVerified;
    _this['created_at'] = createdAt;

    _this['u2f_devices'] = u2fDevices;
  };

  /**
   * Constructs a <code>User</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/User} obj Optional instance to populate.
   * @return {module:model/User} The populated <code>User</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user_id')) {
        obj['user_id'] = ApiClient.convertToType(data['user_id'], 'String');
      }
      if (data.hasOwnProperty('user_email')) {
        obj['user_email'] = ApiClient.convertToType(data['user_email'], 'String');
      }
      if (data.hasOwnProperty('state')) {
        obj['state'] = UserState.constructFromObject(data['state']);
      }
      if (data.hasOwnProperty('account_role')) {
        obj['account_role'] = ApiClient.convertToType(data['account_role'], [UserAccountFlags]);
      }
      if (data.hasOwnProperty('groups')) {
        obj['groups'] = UserAccountMap.constructFromObject(data['groups']);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('email_verified')) {
        obj['email_verified'] = ApiClient.convertToType(data['email_verified'], 'Boolean');
      }
      if (data.hasOwnProperty('created_at')) {
        obj['created_at'] = ApiClient.convertToType(data['created_at'], 'String');
      }
      if (data.hasOwnProperty('last_logged_in_at')) {
        obj['last_logged_in_at'] = ApiClient.convertToType(data['last_logged_in_at'], 'String');
      }
      if (data.hasOwnProperty('u2f_devices')) {
        obj['u2f_devices'] = ApiClient.convertToType(data['u2f_devices'], [U2fDevice]);
      }
    }
    return obj;
  }

  /**
   * User ID uniquely identifying this user.
   * @member {String} user_id
   */
  exports.prototype['user_id'] = undefined;
  /**
   * The User's email address.
   * @member {String} user_email
   */
  exports.prototype['user_email'] = undefined;
  /**
   * @member {module:model/UserState} state
   */
  exports.prototype['state'] = undefined;
  /**
   * @member {Array.<module:model/UserAccountFlags>} account_role
   */
  exports.prototype['account_role'] = undefined;
  /**
   * @member {module:model/UserAccountMap} groups
   */
  exports.prototype['groups'] = undefined;
  /**
   * Whether this user's account is enabled.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * Whether this user's email has been verified.
   * @member {Boolean} email_verified
   */
  exports.prototype['email_verified'] = undefined;
  /**
   * When this user was added to SDKMS.
   * @member {String} created_at
   */
  exports.prototype['created_at'] = undefined;
  /**
   * When this user last logged in.
   * @member {String} last_logged_in_at
   */
  exports.prototype['last_logged_in_at'] = undefined;
  /**
   * @member {Array.<module:model/U2fDevice>} u2f_devices
   */
  exports.prototype['u2f_devices'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./U2fDevice":179,"./UserAccountFlags":185,"./UserAccountMap":186,"./UserState":190}],185:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.UserAccountFlags = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class UserAccountFlags.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "AccountAdministrator"
     * @const
     */
    "AccountAdministrator": "AccountAdministrator",
    /**
     * value: "AccountMember"
     * @const
     */
    "AccountMember": "AccountMember",
    /**
     * value: "AccountAuditor"
     * @const
     */
    "AccountAuditor": "AccountAuditor",
    /**
     * value: "StateEnabled"
     * @const
     */
    "StateEnabled": "StateEnabled",
    /**
     * value: "PendingInvite"
     * @const
     */
    "PendingInvite": "PendingInvite"  };

  /**
   * Returns a <code>UserAccountFlags</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/UserAccountFlags} The enum <code>UserAccountFlags</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],186:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.UserAccountMap = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The UserAccountMap model module.
   * @module model/UserAccountMap
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>UserAccountMap</code>.
   * A UserAccountMap has keys which are the UUIDs of the accounts that the user belongs to. The value for each key is an array of UserAccountFlags representing the account properties. 
   * @alias module:model/UserAccountMap
   * @class
   * @extends Object
   */
  var exports = function() {
    var _this = this;

    return _this;
  };

  /**
   * Constructs a <code>UserAccountMap</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserAccountMap} obj Optional instance to populate.
   * @return {module:model/UserAccountMap} The populated <code>UserAccountMap</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      ApiClient.constructFromObject(data, obj, 'Array');

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],187:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/UserGroupFlags'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./UserGroupFlags'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.UserGroup = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.UserGroupFlags);
  }
}(this, function(ApiClient, UserGroupFlags) {
  'use strict';




  /**
   * The UserGroup model module.
   * @module model/UserGroup
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>UserGroup</code>.
   * @alias module:model/UserGroup
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>UserGroup</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserGroup} obj Optional instance to populate.
   * @return {module:model/UserGroup} The populated <code>UserGroup</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'String');
      }
      if (data.hasOwnProperty('group_role')) {
        obj['group_role'] = ApiClient.convertToType(data['group_role'], [UserGroupFlags]);
      }
    }
    return obj;
  }

  /**
   * Group ID the group_role applies to.
   * @member {String} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * @member {Array.<module:model/UserGroupFlags>} group_role
   */
  exports.prototype['group_role'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./UserGroupFlags":188}],188:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.UserGroupFlags = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class UserGroupFlags.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "GroupAdministrator"
     * @const
     */
    "GroupAdministrator": "GroupAdministrator",
    /**
     * value: "GroupAuditor"
     * @const
     */
    "GroupAuditor": "GroupAuditor"  };

  /**
   * Returns a <code>UserGroupFlags</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/UserGroupFlags} The enum <code>UserGroupFlags</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],189:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/U2fAddDeviceRequest', 'model/U2fDelDeviceRequest', 'model/U2fRenameDeviceRequest', 'model/UserAccountFlags', 'model/UserGroup'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./U2fAddDeviceRequest'), require('./U2fDelDeviceRequest'), require('./U2fRenameDeviceRequest'), require('./UserAccountFlags'), require('./UserGroup'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.UserRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.U2fAddDeviceRequest, root.FortanixSdkmsRestApi.U2fDelDeviceRequest, root.FortanixSdkmsRestApi.U2fRenameDeviceRequest, root.FortanixSdkmsRestApi.UserAccountFlags, root.FortanixSdkmsRestApi.UserGroup);
  }
}(this, function(ApiClient, U2fAddDeviceRequest, U2fDelDeviceRequest, U2fRenameDeviceRequest, UserAccountFlags, UserGroup) {
  'use strict';




  /**
   * The UserRequest model module.
   * @module model/UserRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>UserRequest</code>.
   * @alias module:model/UserRequest
   * @class
   * @param userEmail {String} User's email address.
   * @param userPassword {String} The password to assign to this user in SDKMS.
   */
  var exports = function(userEmail, userPassword) {
    var _this = this;

    _this['user_email'] = userEmail;
    _this['user_password'] = userPassword;








  };

  /**
   * Constructs a <code>UserRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserRequest} obj Optional instance to populate.
   * @return {module:model/UserRequest} The populated <code>UserRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user_email')) {
        obj['user_email'] = ApiClient.convertToType(data['user_email'], 'String');
      }
      if (data.hasOwnProperty('user_password')) {
        obj['user_password'] = ApiClient.convertToType(data['user_password'], 'String');
      }
      if (data.hasOwnProperty('account_role')) {
        obj['account_role'] = ApiClient.convertToType(data['account_role'], [UserAccountFlags]);
      }
      if (data.hasOwnProperty('add_groups')) {
        obj['add_groups'] = ApiClient.convertToType(data['add_groups'], [UserGroup]);
      }
      if (data.hasOwnProperty('del_groups')) {
        obj['del_groups'] = ApiClient.convertToType(data['del_groups'], [UserGroup]);
      }
      if (data.hasOwnProperty('change_groups')) {
        obj['change_groups'] = ApiClient.convertToType(data['change_groups'], [UserGroup]);
      }
      if (data.hasOwnProperty('enabled')) {
        obj['enabled'] = ApiClient.convertToType(data['enabled'], 'Boolean');
      }
      if (data.hasOwnProperty('add_u2f_devices')) {
        obj['add_u2f_devices'] = ApiClient.convertToType(data['add_u2f_devices'], [U2fAddDeviceRequest]);
      }
      if (data.hasOwnProperty('del_u2f_devices')) {
        obj['del_u2f_devices'] = ApiClient.convertToType(data['del_u2f_devices'], [U2fDelDeviceRequest]);
      }
      if (data.hasOwnProperty('rename_u2f_devices')) {
        obj['rename_u2f_devices'] = ApiClient.convertToType(data['rename_u2f_devices'], [U2fRenameDeviceRequest]);
      }
    }
    return obj;
  }

  /**
   * User's email address.
   * @member {String} user_email
   */
  exports.prototype['user_email'] = undefined;
  /**
   * The password to assign to this user in SDKMS.
   * @member {String} user_password
   */
  exports.prototype['user_password'] = undefined;
  /**
   * @member {Array.<module:model/UserAccountFlags>} account_role
   */
  exports.prototype['account_role'] = undefined;
  /**
   * The user will be added to security groups in this list.
   * @member {Array.<module:model/UserGroup>} add_groups
   */
  exports.prototype['add_groups'] = undefined;
  /**
   * The User will be removed from security groups in this list.
   * @member {Array.<module:model/UserGroup>} del_groups
   */
  exports.prototype['del_groups'] = undefined;
  /**
   * @member {Array.<module:model/UserGroup>} change_groups
   */
  exports.prototype['change_groups'] = undefined;
  /**
   * Whether this application is enabled.
   * @member {Boolean} enabled
   */
  exports.prototype['enabled'] = undefined;
  /**
   * @member {Array.<module:model/U2fAddDeviceRequest>} add_u2f_devices
   */
  exports.prototype['add_u2f_devices'] = undefined;
  /**
   * @member {Array.<module:model/U2fDelDeviceRequest>} del_u2f_devices
   */
  exports.prototype['del_u2f_devices'] = undefined;
  /**
   * @member {Array.<module:model/U2fRenameDeviceRequest>} rename_u2f_devices
   */
  exports.prototype['rename_u2f_devices'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./U2fAddDeviceRequest":177,"./U2fDelDeviceRequest":178,"./U2fRenameDeviceRequest":181,"./UserAccountFlags":185,"./UserGroup":187}],190:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.UserState = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class UserState.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: "PendingConfirmation"
     * @const
     */
    "PendingConfirmation": "PendingConfirmation",
    /**
     * value: "Locked"
     * @const
     */
    "Locked": "Locked",
    /**
     * value: "Disabled"
     * @const
     */
    "Disabled": "Disabled",
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active"  };

  /**
   * Returns a <code>UserState</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/UserState} The enum <code>UserState</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));



},{"../ApiClient":18}],191:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.Uuid = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Uuid model module.
   * @module model/Uuid
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>Uuid</code>.
   * Uuid format string, example - a41152ed-c26e-4c6e-a8d1-8820e36972c3
   * @alias module:model/Uuid
   * @class
   */
  var exports = function() {
    var _this = this;

  };

  /**
   * Constructs a <code>Uuid</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Uuid} obj Optional instance to populate.
   * @return {module:model/Uuid} The populated <code>Uuid</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":18}],192:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ValidateTokenRequest = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ValidateTokenRequest model module.
   * @module model/ValidateTokenRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ValidateTokenRequest</code>.
   * @alias module:model/ValidateTokenRequest
   * @class
   * @param resetToken {String} 
   */
  var exports = function(resetToken) {
    var _this = this;

    _this['reset_token'] = resetToken;
  };

  /**
   * Constructs a <code>ValidateTokenRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ValidateTokenRequest} obj Optional instance to populate.
   * @return {module:model/ValidateTokenRequest} The populated <code>ValidateTokenRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('reset_token')) {
        obj['reset_token'] = ApiClient.convertToType(data['reset_token'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} reset_token
   */
  exports.prototype['reset_token'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],193:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.ValidateTokenResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ValidateTokenResponse model module.
   * @module model/ValidateTokenResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>ValidateTokenResponse</code>.
   * @alias module:model/ValidateTokenResponse
   * @class
   * @param userEmail {String} 
   */
  var exports = function(userEmail) {
    var _this = this;

    _this['user_email'] = userEmail;
  };

  /**
   * Constructs a <code>ValidateTokenResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ValidateTokenResponse} obj Optional instance to populate.
   * @return {module:model/ValidateTokenResponse} The populated <code>ValidateTokenResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user_email')) {
        obj['user_email'] = ApiClient.convertToType(data['user_email'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} user_email
   */
  exports.prototype['user_email'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],194:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm', 'model/SignatureMode'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'), require('./SignatureMode'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.VerifyRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm, root.FortanixSdkmsRestApi.SignatureMode);
  }
}(this, function(ApiClient, DigestAlgorithm, SignatureMode) {
  'use strict';




  /**
   * The VerifyRequest model module.
   * @module model/VerifyRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>VerifyRequest</code>.
   * @alias module:model/VerifyRequest
   * @class
   * @param hashAlg {module:model/DigestAlgorithm} 
   * @param signature {Blob} A signature created with the private key corresponding to this public key.
   */
  var exports = function(hashAlg, signature) {
    var _this = this;

    _this['hash_alg'] = hashAlg;


    _this['signature'] = signature;

  };

  /**
   * Constructs a <code>VerifyRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/VerifyRequest} obj Optional instance to populate.
   * @return {module:model/VerifyRequest} The populated <code>VerifyRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('hash_alg')) {
        obj['hash_alg'] = DigestAlgorithm.constructFromObject(data['hash_alg']);
      }
      if (data.hasOwnProperty('hash')) {
        obj['hash'] = ApiClient.convertToType(data['hash'], 'Blob');
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], 'Blob');
      }
      if (data.hasOwnProperty('signature')) {
        obj['signature'] = ApiClient.convertToType(data['signature'], 'Blob');
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = SignatureMode.constructFromObject(data['mode']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/DigestAlgorithm} hash_alg
   */
  exports.prototype['hash_alg'] = undefined;
  /**
   * The hash of the data on which the signature is being verified. Exactly one of `hash` and `data` is required. 
   * @member {Blob} hash
   */
  exports.prototype['hash'] = undefined;
  /**
   * The data on which the signature is being verified. Exactly one of `hash` and `data` is required. To reduce request size and avoid reaching the request size limit, prefer `hash`. 
   * @member {Blob} data
   */
  exports.prototype['data'] = undefined;
  /**
   * A signature created with the private key corresponding to this public key.
   * @member {Blob} signature
   */
  exports.prototype['signature'] = undefined;
  /**
   * @member {module:model/SignatureMode} mode
   */
  exports.prototype['mode'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91,"./SignatureMode":162}],195:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DigestAlgorithm', 'model/SignatureMode', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./DigestAlgorithm'), require('./SignatureMode'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.VerifyRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.DigestAlgorithm, root.FortanixSdkmsRestApi.SignatureMode, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, DigestAlgorithm, SignatureMode, SobjectDescriptor) {
  'use strict';




  /**
   * The VerifyRequestEx model module.
   * @module model/VerifyRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>VerifyRequestEx</code>.
   * @alias module:model/VerifyRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param hashAlg {module:model/DigestAlgorithm} 
   * @param signature {Blob} A signature created with the private key corresponding to this public key.
   */
  var exports = function(key, hashAlg, signature) {
    var _this = this;

    _this['key'] = key;
    _this['hash_alg'] = hashAlg;


    _this['signature'] = signature;

  };

  /**
   * Constructs a <code>VerifyRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/VerifyRequestEx} obj Optional instance to populate.
   * @return {module:model/VerifyRequestEx} The populated <code>VerifyRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('hash_alg')) {
        obj['hash_alg'] = DigestAlgorithm.constructFromObject(data['hash_alg']);
      }
      if (data.hasOwnProperty('hash')) {
        obj['hash'] = ApiClient.convertToType(data['hash'], 'Blob');
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], 'Blob');
      }
      if (data.hasOwnProperty('signature')) {
        obj['signature'] = ApiClient.convertToType(data['signature'], 'Blob');
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = SignatureMode.constructFromObject(data['mode']);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/DigestAlgorithm} hash_alg
   */
  exports.prototype['hash_alg'] = undefined;
  /**
   * The hash of the data on which the signature is being verified. Exactly one of `hash` and `data` is required. 
   * @member {Blob} hash
   */
  exports.prototype['hash'] = undefined;
  /**
   * The data on which the signature is being verified. Exactly one of `hash` and `data` is required. To reduce request size and avoid reaching the request size limit, prefer `hash`. 
   * @member {Blob} data
   */
  exports.prototype['data'] = undefined;
  /**
   * A signature created with the private key corresponding to this public key.
   * @member {Blob} signature
   */
  exports.prototype['signature'] = undefined;
  /**
   * @member {module:model/SignatureMode} mode
   */
  exports.prototype['mode'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./DigestAlgorithm":91,"./SignatureMode":162,"./SobjectDescriptor":164}],196:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.VerifyResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The VerifyResponse model module.
   * @module model/VerifyResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>VerifyResponse</code>.
   * @alias module:model/VerifyResponse
   * @class
   * @param result {Boolean} True if the signature verified and False if it did not.
   */
  var exports = function(result) {
    var _this = this;


    _this['result'] = result;
  };

  /**
   * Constructs a <code>VerifyResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/VerifyResponse} obj Optional instance to populate.
   * @return {module:model/VerifyResponse} The populated <code>VerifyResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('result')) {
        obj['result'] = ApiClient.convertToType(data['result'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * The Key ID of the key used to verify this data.
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * True if the signature verified and False if it did not.
   * @member {Boolean} result
   */
  exports.prototype['result'] = undefined;



  return exports;
}));



},{"../ApiClient":18}],197:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/ServerMode'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./ServerMode'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.VersionResponse = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.ServerMode);
  }
}(this, function(ApiClient, ServerMode) {
  'use strict';




  /**
   * The VersionResponse model module.
   * @module model/VersionResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>VersionResponse</code>.
   * @alias module:model/VersionResponse
   * @class
   * @param version {String} The SDKMS server version. This is encoded as major.minor.build. For example, 1.0.25. 
   * @param apiVersion {String} The API version implemented by this server.
   * @param serverMode {module:model/ServerMode} 
   */
  var exports = function(version, apiVersion, serverMode) {
    var _this = this;

    _this['version'] = version;
    _this['api_version'] = apiVersion;
    _this['server_mode'] = serverMode;

  };

  /**
   * Constructs a <code>VersionResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/VersionResponse} obj Optional instance to populate.
   * @return {module:model/VersionResponse} The populated <code>VersionResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('version')) {
        obj['version'] = ApiClient.convertToType(data['version'], 'String');
      }
      if (data.hasOwnProperty('api_version')) {
        obj['api_version'] = ApiClient.convertToType(data['api_version'], 'String');
      }
      if (data.hasOwnProperty('server_mode')) {
        obj['server_mode'] = ServerMode.constructFromObject(data['server_mode']);
      }
      if (data.hasOwnProperty('fips_level')) {
        obj['fips_level'] = ApiClient.convertToType(data['fips_level'], 'Number');
      }
    }
    return obj;
  }

  /**
   * The SDKMS server version. This is encoded as major.minor.build. For example, 1.0.25. 
   * @member {String} version
   */
  exports.prototype['version'] = undefined;
  /**
   * The API version implemented by this server.
   * @member {String} api_version
   */
  exports.prototype['api_version'] = undefined;
  /**
   * @member {module:model/ServerMode} server_mode
   */
  exports.prototype['server_mode'] = undefined;
  /**
   * FIPS level at which SDKMS in running. If this field is absent, then SDKMS is not running in FIPS compliant mode.
   * @member {Number} fips_level
   */
  exports.prototype['fips_level'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./ServerMode":158}],198:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CryptMode', 'model/ObjectType'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CryptMode'), require('./ObjectType'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.WrapKeyRequest = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CryptMode, root.FortanixSdkmsRestApi.ObjectType);
  }
}(this, function(ApiClient, CryptMode, ObjectType) {
  'use strict';




  /**
   * The WrapKeyRequest model module.
   * @module model/WrapKeyRequest
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>WrapKeyRequest</code>.
   * @alias module:model/WrapKeyRequest
   * @class
   * @param alg {module:model/ObjectType} 
   * @param kid {String} The key ID (not name or description) of the key being wrapped.
   */
  var exports = function(alg, kid) {
    var _this = this;

    _this['alg'] = alg;
    _this['kid'] = kid;




  };

  /**
   * Constructs a <code>WrapKeyRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WrapKeyRequest} obj Optional instance to populate.
   * @return {module:model/WrapKeyRequest} The populated <code>WrapKeyRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('kid')) {
        obj['kid'] = ApiClient.convertToType(data['kid'], 'String');
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CryptMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('ad')) {
        obj['ad'] = ApiClient.convertToType(data['ad'], 'Blob');
      }
      if (data.hasOwnProperty('tag_len')) {
        obj['tag_len'] = ApiClient.convertToType(data['tag_len'], 'Number');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * The key ID (not name or description) of the key being wrapped.
   * @member {String} kid
   */
  exports.prototype['kid'] = undefined;
  /**
   * @member {module:model/CryptMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * For symmetric ciphers, this value will be used for the cipher initialization value. If not provided, SDKMS will generate a random iv and return it in the response. If provided, iv length must match the length required by the cipher and mode. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, this optionally specifies the authenticated data used by the cipher. This field must not be provided with other cipher modes. 
   * @member {Blob} ad
   */
  exports.prototype['ad'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, this field specifies the length of the authentication tag to be produced. This field is specified in bits (not bytes). This field is required for symmetric ciphers with cipher mode GCM or CCM. It must not be specified for asymmetric ciphers and symmetric ciphers with other cipher modes.
   * @member {Number} tag_len
   */
  exports.prototype['tag_len'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CryptMode":75,"./ObjectType":133}],199:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CryptMode', 'model/ObjectType', 'model/SobjectDescriptor'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CryptMode'), require('./ObjectType'), require('./SobjectDescriptor'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.WrapKeyRequestEx = factory(root.FortanixSdkmsRestApi.ApiClient, root.FortanixSdkmsRestApi.CryptMode, root.FortanixSdkmsRestApi.ObjectType, root.FortanixSdkmsRestApi.SobjectDescriptor);
  }
}(this, function(ApiClient, CryptMode, ObjectType, SobjectDescriptor) {
  'use strict';




  /**
   * The WrapKeyRequestEx model module.
   * @module model/WrapKeyRequestEx
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>WrapKeyRequestEx</code>.
   * @alias module:model/WrapKeyRequestEx
   * @class
   * @param key {module:model/SobjectDescriptor} 
   * @param subject {module:model/SobjectDescriptor} 
   * @param alg {module:model/ObjectType} 
   */
  var exports = function(key, subject, alg) {
    var _this = this;

    _this['key'] = key;
    _this['subject'] = subject;
    _this['alg'] = alg;




  };

  /**
   * Constructs a <code>WrapKeyRequestEx</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WrapKeyRequestEx} obj Optional instance to populate.
   * @return {module:model/WrapKeyRequestEx} The populated <code>WrapKeyRequestEx</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('key')) {
        obj['key'] = SobjectDescriptor.constructFromObject(data['key']);
      }
      if (data.hasOwnProperty('subject')) {
        obj['subject'] = SobjectDescriptor.constructFromObject(data['subject']);
      }
      if (data.hasOwnProperty('alg')) {
        obj['alg'] = ObjectType.constructFromObject(data['alg']);
      }
      if (data.hasOwnProperty('mode')) {
        obj['mode'] = CryptMode.constructFromObject(data['mode']);
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('ad')) {
        obj['ad'] = ApiClient.convertToType(data['ad'], 'Blob');
      }
      if (data.hasOwnProperty('tag_len')) {
        obj['tag_len'] = ApiClient.convertToType(data['tag_len'], 'Number');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/SobjectDescriptor} key
   */
  exports.prototype['key'] = undefined;
  /**
   * @member {module:model/SobjectDescriptor} subject
   */
  exports.prototype['subject'] = undefined;
  /**
   * @member {module:model/ObjectType} alg
   */
  exports.prototype['alg'] = undefined;
  /**
   * @member {module:model/CryptMode} mode
   */
  exports.prototype['mode'] = undefined;
  /**
   * For symmetric ciphers, this value will be used for the cipher initialization value. If not provided, SDKMS will generate a random iv and return it in the response. If provided, iv length must match the length required by the cipher and mode. 
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, this optionally specifies the authenticated data used by the cipher. This field must not be provided with other cipher modes. 
   * @member {Blob} ad
   */
  exports.prototype['ad'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, this field specifies the length of the authentication tag to be produced. This field is specified in bits (not bytes). This field is required for symmetric ciphers with cipher mode GCM or CCM. It must not be specified for asymmetric ciphers and symmetric ciphers with other cipher modes.
   * @member {Number} tag_len
   */
  exports.prototype['tag_len'] = undefined;



  return exports;
}));



},{"../ApiClient":18,"./CryptMode":75,"./ObjectType":133,"./SobjectDescriptor":164}],200:[function(require,module,exports){
/**
 * Fortanix SDKMS REST API
 * This is a set of REST APIs for accessing the Fortanix Self-Defending Key Management System. This includes APIs for managing accounts, and for performing cryptographic and key management operations. 
 *
 * OpenAPI spec version: 1.0.0-20181004
 * Contact: support@fortanix.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.FortanixSdkmsRestApi) {
      root.FortanixSdkmsRestApi = {};
    }
    root.FortanixSdkmsRestApi.WrapKeyResponse = factory(root.FortanixSdkmsRestApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The WrapKeyResponse model module.
   * @module model/WrapKeyResponse
   * @version 1.0.0-20181004
   */

  /**
   * Constructs a new <code>WrapKeyResponse</code>.
   * @alias module:model/WrapKeyResponse
   * @class
   * @param wrappedKey {Blob} The wrapped key.
   */
  var exports = function(wrappedKey) {
    var _this = this;

    _this['wrapped_key'] = wrappedKey;


  };

  /**
   * Constructs a <code>WrapKeyResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WrapKeyResponse} obj Optional instance to populate.
   * @return {module:model/WrapKeyResponse} The populated <code>WrapKeyResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('wrapped_key')) {
        obj['wrapped_key'] = ApiClient.convertToType(data['wrapped_key'], 'Blob');
      }
      if (data.hasOwnProperty('iv')) {
        obj['iv'] = ApiClient.convertToType(data['iv'], 'Blob');
      }
      if (data.hasOwnProperty('tag')) {
        obj['tag'] = ApiClient.convertToType(data['tag'], 'Blob');
      }
    }
    return obj;
  }

  /**
   * The wrapped key.
   * @member {Blob} wrapped_key
   */
  exports.prototype['wrapped_key'] = undefined;
  /**
   * The initialiation value used for symmetric encryption. Not returned for asymmetric ciphers.
   * @member {Blob} iv
   */
  exports.prototype['iv'] = undefined;
  /**
   * For symmetric ciphers with cipher mode GCM or CCM, the authentication tag produced by the cipher. Its length will match the tag length specified by the encryption request. 
   * @member {Blob} tag
   */
  exports.prototype['tag'] = undefined;



  return exports;
}));



},{"../ApiClient":18}]},{},[8]);
