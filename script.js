function calculate(operation, rawA, rawB) {
  if (operation === 'raiz' && rawA.trim() === '') return { error: 'Completá el primer número para calcular la raíz.' };
  if (rawA.trim() === '' || (operation !== 'raiz' && rawB.trim() === '')) return { error: 'Completá los dos números para calcular.' };
  const a = Number(rawA);
  const b = operation === 'raiz' ? 0 : Number(rawB);
  if (!Number.isFinite(a) || (operation !== 'raiz' && !Number.isFinite(b))) return { error: 'Ingresá números válidos y finitos.' };
  let value;
  if (operation === 'sumar') value = a + b;
  else if (operation === 'restar') value = a - b;
  else if (operation === 'multiplicar') value = a * b;
  else if (operation === 'dividir') {
    if (b === 0) return { error: 'No se puede dividir por cero.' };
    value = a / b;
  } else if (operation === 'potencia') value = a ** b;
  else if (operation === 'raiz') {
    if (a < 0) return { error: 'No se puede calcular la raíz de un número negativo.' };
    value = Math.sqrt(a);
  } else return { error: 'Operación desconocida.' };
  if (!Number.isFinite(value)) return { error: 'El resultado no es un número finito.' };
  return { value };
}

function formatResult(value) {
  return new Intl.NumberFormat('es-AR', { maximumSignificantDigits: 12 }).format(value);
}

function clearCalculator(state = {}) {
  if (typeof document !== 'undefined' && arguments.length === 0) {
    document.getElementById('numero-a').value = '';
    document.getElementById('numero-b').value = '';
    document.getElementById('resultado').textContent = '—';
    document.getElementById('mensaje-error').textContent = '';
    return;
  }
  return { a: '', b: '', result: '', error: '' };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { calculate, formatResult, clearCalculator };

if (typeof document !== 'undefined') {
  const form = document.getElementById('calculadora');
  const result = document.getElementById('resultado');
  const error = document.getElementById('mensaje-error');
  function run(operation) {
    error.textContent = '';
    result.textContent = '—';
    const outcome = calculate(operation, document.getElementById('numero-a').value, document.getElementById('numero-b').value);
    if (outcome.error) error.textContent = outcome.error;
    else result.textContent = formatResult(outcome.value);
  }
  form.addEventListener('submit', event => { event.preventDefault(); run('sumar'); });
  form.addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.target.matches('#numero-a, #numero-b')) {
      event.preventDefault();
      run('sumar');
    }
  });
  form.addEventListener('click', event => {
    const button = event.target.closest('[data-operacion]');
    if (button && !button.disabled) run(button.dataset.operacion);
  });
  document.getElementById('limpiar').addEventListener('click', () => clearCalculator());
}
