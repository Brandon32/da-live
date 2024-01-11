'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var error = require('./error-8582d695.cjs');
var buffer = require('./buffer-62257a75.cjs');
var string = require('./string-6d104757.cjs');
var json = require('./json-092190a1.cjs');
var ecdsa = require('./ecdsa.cjs');
require('./environment-2b801510.cjs');
require('./map-0dabcc55.cjs');
require('./conditions-f5c0c102.cjs');
require('./storage.cjs');
require('./function-314fdc56.cjs');
require('./array-704ca50e.cjs');
require('./set-0f209abb.cjs');
require('./object-fecf6a7b.cjs');
require('./math-08e068f9.cjs');
require('./encoding-882cb136.cjs');
require('./number-466d8922.cjs');
require('./binary-ac8e39e2.cjs');
require('./decoding-000d097f.cjs');
require('lib0/webcrypto');
require('./common.cjs');

/**
 * @param {Object} data
 */
const _stringify = data => buffer.toBase64UrlEncoded(string.encodeUtf8(json.stringify(data)));

/**
 * @param {string} base64url
 */
const _parse = base64url => json.parse(string.decodeUtf8(buffer.fromBase64UrlEncoded(base64url)));

/**
 * @param {CryptoKey} privateKey
 * @param {Object} payload
 */
const encodeJwt = (privateKey, payload) => {
  const { name: algName, namedCurve: algCurve } = /** @type {any} */ (privateKey.algorithm);
  /* c8 ignore next 3 */
  if (algName !== 'ECDSA' || algCurve !== 'P-384') {
    error.unexpectedCase();
  }
  const header = {
    alg: 'ES384',
    typ: 'JWT'
  };
  const jwt = _stringify(header) + '.' + _stringify(payload);
  return ecdsa.sign(privateKey, string.encodeUtf8(jwt)).then(signature =>
    jwt + '.' + buffer.toBase64UrlEncoded(signature)
  )
};

/**
 * @param {CryptoKey} publicKey
 * @param {string} jwt
 */
const verifyJwt = async (publicKey, jwt) => {
  const [headerBase64, payloadBase64, signatureBase64] = jwt.split('.');
  const verified = await ecdsa.verify(publicKey, buffer.fromBase64UrlEncoded(signatureBase64), string.encodeUtf8(headerBase64 + '.' + payloadBase64));
  /* c8 ignore next 3 */
  if (!verified) {
    throw new Error('Invalid JWT')
  }
  return {
    header: _parse(headerBase64),
    payload: _parse(payloadBase64)
  }
};

/**
 * Decode a jwt without verifying it. Probably a bad idea to use this. Only use if you know the jwt was already verified!
 *
 * @param {string} jwt
 */
const unsafeDecode = jwt => {
  const [headerBase64, payloadBase64] = jwt.split('.');
  return {
    header: _parse(headerBase64),
    payload: _parse(payloadBase64)
  }
};

exports.encodeJwt = encodeJwt;
exports.unsafeDecode = unsafeDecode;
exports.verifyJwt = verifyJwt;
//# sourceMappingURL=jwt.cjs.map
