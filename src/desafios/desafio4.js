// Definição dos tipos
type Movie = {
  original_title: string;
};

type RequestTokenResponse = {
  request_token: string;
};

type SessionResponse = {
  session_id: string;
};

type ListResponse = {
  id: number;
};

// Declaração das variáveis
let apiKey: string = '3f301be7381a03ad8d352314dcc3ec1d';
let requestToken: string | undefined;
let sessionId: string | undefined;
const listId = '7101979';


let username: string = '';
let password: string = '';


const loginButton = document.getElementById('login-button') as HTMLButtonElement;
const searchButton = document.getElementById('search-button') as HTMLButtonElement;
const searchInput = document.getElementById('search') as HTMLInputElement;
const searchContainer = document.getElementById('search-container') as HTMLDivElement;


loginButton.addEventListener('click', async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
});

searchButton.addEventListener('click', async () => {
  const lista = document.getElementById('lista');
  if (lista) {
    lista.outerHTML = '';
  }
  const query = searchInput.value;
  const listaDeFilmes = await procurarFilme(query);
  exibirListaDeFilmes(listaDeFilmes.results);
});

async function criarRequestToken() {
  const result: RequestTokenResponse = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: 'GET',
  });
  requestToken = result.request_token;
}

async function logar() {
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: 'POST',
    body: {
      username,
      password,
      request_token: requestToken,
    },
  });
}

async function criarSessao() {
  const result: SessionResponse = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: 'GET',
  });
  sessionId = result.session_id;
}

async function procurarFilme(query: string): Promise<{ results: Movie[] }> {
  query = encodeURI(query);
  const result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: 'GET',
  });
  return result as { results: Movie[] };
}

async function exibirListaDeFilmes(filmes: Movie[]) {
  const ul = document.createElement('ul');
  ul.id = 'lista';
  for (const filme of filmes) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(filme.original_title));
    ul.appendChild(li);
  }
  searchContainer.appendChild(ul);
}


class HttpClient {
  static async get<T>({ url, method, body = null }: { url: string; method: string; body?: any }): Promise<T> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText,
          });
        }
      };
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText,
        });
      };

      if (body) {
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        body = JSON.stringify(body);
      }
      request.send(body);
    });
  }
}

function preencherSenha(event: Event) {
  password = (event.target as HTMLInputElement).value;
  validateLoginButton();
}

function preencherLogin(event: Event) {
  username = (event.target as HTMLInputElement).value;
  validateLoginButton();
}

function preencherApi(event: Event) {
  apiKey = (event.target as HTMLInputElement).value;
  validateLoginButton();
}

function validateLoginButton() {
  loginButton.disabled = !(password && username && apiKey);
}
