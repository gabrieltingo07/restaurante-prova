document.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.getElementById('btnLogin');
  const msgErro = document.getElementById('msgErro');

  btnLogin.addEventListener('click', async () => {
    msgErro.style.display = 'none';
    msgErro.textContent = '';

    const loginInput = document.getElementById('login');
    const senhaInput = document.getElementById('senha');

    const login = loginInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!login || !senha) {
      msgErro.textContent = 'Informe login e senha.';
      msgErro.style.display = 'block';
      return;
    }

    const loginData = {
      username: login, // casa com LoginDto.Username
      senha: senha     // casa com LoginDto.Senha
    };

    console.log("Enviando loginData:", loginData);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (!response.ok) {
        let msg = 'Usuário ou senha inválidos.';
        try {
          const texto = await response.text();
          if (texto) {
            try {
              const obj = JSON.parse(texto);
              msg = obj.message || msg;
            } catch {
              msg = texto;
            }
          }
        } catch (_) {}

        msgErro.textContent = msg;
        msgErro.style.display = 'block';
        return;
      }

      const dados = await response.json();
      console.log('Login OK:', dados);

      // Guarda info pro resto do sistema
      localStorage.setItem('usuario', dados.username);
      localStorage.setItem('setor', dados.role);

      // Redireciona de acordo com o setor
      if (dados.role === 'Cozinha') {
        window.location.href = 'cozinha.html';
      } else if (dados.role === 'Copa') {
        window.location.href = 'copa.html';
      } else {
        alert('Setor não reconhecido: ' + dados.role);
      }

    } catch (erro) {
      console.error('Erro ao fazer login:', erro);
      msgErro.textContent = 'Erro ao conectar com o servidor de login.';
      msgErro.style.display = 'block';
    }
  });
});
