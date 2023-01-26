const primeiraTela = document.querySelector(".primeira-tela");
const segundaTela = document.querySelector(".segunda-tela");
const terceiraTela = document.querySelector(".terceira-tela");
const meusQuizzesVazio = document.querySelector(".meusQuizzesVazio");
const meusQuizzesPreenchido = document.querySelector(".meusQuizzesPreenchido");
const numQuizzUsuario = 0;

buscarQuizz();
exibirQuiz();

function erro(exibiErro){
    console.log("ERRO FOI DO TIPO " + exibiErro.response.status);
}

function exibirQuiz(){
    //fazendo com o id 1 por exemplo
    const quiz = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/1')
    quiz.then(exibirQuizFuncionou);
    quiz.catch(erro);
}

function exibirQuizFuncionou(Carregarquiz){
    quizExibido = Carregarquiz.data;
    console.log(quizExibido);
    const layout = document.querySelector('.segunda-tela');
    layout.innerHTML = "";
    let template = "";
    layout.innerHTML =`<div class="segunda-tela">
    <div class="banner">
        <h2>${quizExibido.title}</h2>
        <img src = "${quizExibido.image}" class="portrait">
        <div class="filtro"></div>
    </div>
    <div class="quiz">`;

    for(let i=0; i<quizExibido.questions.length; i++){
        template = `<div class="pergunta">
        <div class="titulo-pergunta">
            <h3>${quizExibido.questions[i].title}</h3>
        </div>
        <div class="alternativas">`
        for(let j=0; j< quizExibido.questions[i].answers.length; j++){
            `<div class="resposta">
                <img src = "${quizExibido.questions[i].answers[j].image}">
                <p>${quizExibido.questions[i].answers[j].text}</p>
            </div>`
        }
        `</div>`;
        layout.innerHTML = layout.innerHTML + template;
    }

    layout.innerHTML = layout.innerHTML + `</div>`;

}

function criarQuiz(){
    primeiraTela.classList.add('escondido');
    terceiraTela.classList.remove('escondido');
    const tela31 = document.querySelector(".tela-3-1");
    tela31.classList.remove('escondido');
    const tela34 = document.querySelector(".tela-3-4");
    tela34.classList.add('escondido');
}

function voltarParaHome(){
    terceiraTela.classList.add('escondido');
    segundaTela.classList.add('escondido');
    primeiraTela.classList.remove('escondido');
    buscarQuizz();
}

function buscarQuizz(){
    const promessaBuscaQuizz = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');

    promessaBuscaQuizz.then(buscarQuizzFuncionou);
    promessaBuscaQuizz.catch(erro);
}

function buscarQuizzFuncionou(buscarQquizzes){
    const quizzes = buscarQquizzes.data;
    quizzesFiltrados = quizzes.filter(filtroQuizzes);
    quizzes.forEach(exibirTodosTela1);
    if(numQuizzUsuario === 0){
        meusQuizzesPreenchido.classList.add('escondido');
        meusQuizzesVazio.classList.remove('escondido');
    } else {
        quizzesFiltrados.forEach(exibirMeusTela1);
    }
}

function filtroQuizzes(todosQuizzes){
    if (todosQuizzes.id === "status" ){ //vejo se está na lista local, se sim add 
        return true;
    }
}

function exibirTodosTela1(quizzTelaEntrada){
    const todosQuizzes = document.querySelector(".todosQuizzes");
    const listaTodos = todosQuizzes.querySelector(".listagemQuizz");
    listaTodos.innerHTML += `
        <div class="exibicaoQuizz" onclick="exibirQuiz(this)">
            <img src = ${quizzTelaEntrada.image} alt="imagemquizz">
            <div class="degrade"></div>
            <div class="descricaoQuizz">${quizzTelaEntrada.title}</div>
        </div>`;
}

function exibirMeusTela1(quizzTelaEntrada){
    const listaMeus = meusQuizzesPreenchido.querySelector(".listagemQuizz");
    //montar a parte de pegar o numero salvo e exibir
    listaMeus.innerHTML += `
        <div class="exibicaoQuizz" onclick="exibirQuiz(this)">
            <img src = ${quizzTelaEntrada.image} alt="imagemquizz">
            <div class="degrade"></div>
            <div class="descricaoQuizz">${quizzTelaEntrada.title}</div>
        </div>`;
}

function criarProxPag(Pagina){
    const pagAtual = Pagina.parentNode;
    const pagClassList = pagAtual.classList[0];
    if (pagClassList == "tela-3-1"){
        proxPag = document.querySelector(".tela-3-2");
    } else if (pagClassList === "tela-3-2"){
        proxPag = document.querySelector(".tela-3-3");
    } else if (pagClassList === "tela-3-3"){
        proxPag = document.querySelector(".tela-3-4");
    } 
    pagAtual.classList.add('escondido');
    proxPag.classList.remove('escondido');
}

function expandirConteiner(perguntaCriar){
    const conteinerAtual = perguntaCriar.parentNode;
    const pagClassList = conteinerAtual.innerHTML;
    if (pagClassList == "Pergunta 1"){
        proxPag = document.querySelector(".pergunta1");
    } else if (pagClassList === "Pergunta 2"){
        proxPag = document.querySelector(".pergunta2");
    } else if (pagClassList === "Pergunta 3"){
        proxPag = document.querySelector(".pergunta3");
    } 
    conteinerAtual.classList.add('escondido');
    proxPag.classList.remove('escondido');
}
