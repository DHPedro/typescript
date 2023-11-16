let botaoAtualizar = document.getElementById('atualizar-saldo') as HTMLButtonElement | null;
let botaoLimpar = document.getElementById('limpar-saldo') as HTMLButtonElement | null;
let campoSaldo = document.getElementById('campo-saldo') as HTMLDivElement | null;

if (campoSaldo) {
  campoSaldo.innerHTML = '0';
}

function somarAoSaldo(valor: string | number) {
  if (campoSaldo) {
    campoSaldo.innerHTML = (parseInt(campoSaldo.innerHTML) + parseInt(valor.toString())).toString();
  }
}

function limparSaldo() {
  if (campoSaldo) {
    campoSaldo.innerHTML = '';
  }
}

if (botaoAtualizar) {
  botaoAtualizar.addEventListener('click', function () {
    let soma = document.getElementById('soma') as HTMLInputElement | null;
    if (soma && campoSaldo) {
      somarAoSaldo(soma.value);
    }
  });
}

if (botaoLimpar) {
  botaoLimpar.addEventListener('click', function () {
    limparSaldo();
  });
}
