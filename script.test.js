const test = require('node:test');
const assert = require('node:assert/strict');
const { calculate, formatResult, clearCalculator } = require('./script.js');

test('suma, resta y multiplicación admiten operandos decimales y negativos', () => {
  assert.equal(calculate('sumar', '1.25', '2.5').value, 3.75);
  assert.equal(calculate('restar', '-2', '3.5').value, -5.5);
  assert.equal(calculate('multiplicar', '-1.5', '2').value, -3);
});

test('división calcula y rechaza un divisor igual a cero', () => {
  assert.equal(calculate('dividir', '7.5', '2.5').value, 3);
  assert.match(calculate('dividir', '1', '0').error, /cero/i);
});

test('potencia usa ambos operandos y raíz cuadrada solo el primero', () => {
  assert.equal(calculate('potencia', '2', '3').value, 8);
  assert.equal(calculate('raiz', '9', '').value, 3);
  assert.match(calculate('raiz', '-1', '99').error, /negativo/i);
});

test('rechaza resultados científicos no finitos', () => {
  assert.match(calculate('potencia', '10', '1000').error, /finito/i);
});

test('rechaza campos vacíos y números no válidos', () => {
  assert.ok(calculate('sumar', '', '0').error);
  assert.ok(calculate('sumar', '   ', '2').error);
  assert.ok(calculate('sumar', 'abc', '2').error);
});

test('detecta resultados no finitos y formatea enteros sin decimales sobrantes', () => {
  assert.ok(calculate('sumar', '1e308', '1e308').error);
  assert.equal(formatResult(4), '4');
  assert.equal(formatResult(0.1 + 0.2), '0,3');
});

test('limpiar reinicia operandos, resultado y mensaje', () => {
  const state = { a: '12', b: '3', result: '15', error: 'mensaje' };
  assert.deepEqual(clearCalculator(state), { a: '', b: '', result: '', error: '' });
});

test('raíz sin A solicita solo el primer operando', () => {
  assert.match(calculate('raiz', '', '').error, /primer número/);
  assert.doesNotMatch(calculate('raiz', '', '').error, /dos/);
});
