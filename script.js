const primeiraTela = document.querySelector(".primeira-tela");
let segundaTela = document.querySelector(".segunda-tela");
const terceiraTela = document.querySelector(".terceira-tela");
const meusQuizzesVazio = document.querySelector(".meusQuizzesVazio");
const meusQuizzesPreenchido = document.querySelector(".meusQuizzesPreenchido");
const numQuizzUsuario = 0;
let pontuacao = 0;
let clique = 0;
let quizExibido;
let divAvo;

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

    segundaTela = document.querySelector('.segunda-tela');
    segundaTela.innerHTML = "";
    let template = "";
    let alternativas = "";
    segundaTela.innerHTML =`<div class="banner">
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
        let respostas = quizExibido.questions[i].answers; //copiando as respostas p/ outro array
        respostas.sort(comparador); //embaralhando esse novo array

        for(let j=0; j< respostas.length; j++){
            alternativas =`<div onclick="cliqueNaAlternativa(this)" class="resposta ${respostas[j].isCorrectAnswer
            }">
                <img src = "${respostas[j].image}">
                <p>${respostas[j].text}</p>
            </div>`
            template= template + alternativas;
        }
        segundaTela.innerHTML = segundaTela.innerHTML + template;
        let alteraCor = segundaTela.lastChild;
        alteraCor.children[0].style.backgroundColor =quizExibido.questions[i].color;
    }

    //segundaTela.innerHTML = segundaTela.innerHTML + `</div>`;

    

}

function comparador() { 
    return Math.random() - 0.5; 
}

function cliqueNaAlternativa(alternativa){
    clique++;
    const divMaior = alternativa.parentNode;
    alternativa.removeAttribute("onclick");
    if(alternativa.classList.contains('true')){
        pontuacao++;
    }

    for(let i = 0; i<divMaior.children.length;i++){
        if(divMaior.children[i].classList.contains('true')){
            divMaior.children[i].classList.add('certa');
        }
        if(divMaior.children[i].classList.contains('false')){
            divMaior.children[i].classList.add('errada');
        }
        if(divMaior.children[i] !== alternativa){
            divMaior.children[i].classList.add('opacidade');
            divMaior.children[i].removeAttribute("onclick");
        } 
    }
    
    pontuacaoFinal();
    //fará a parte de scrollar até o próximo elemento!
    divAvo = divMaior.parentNode.parentNode;

    for(let i=0; i<divAvo.children.length; i++){
        if((divAvo.children[i] === divMaior.parentNode) && i+1 !== divAvo.children.length){
            //usando função anonima
            setTimeout(function(){ divAvo.children[i+1].scrollIntoView({ block: 'center', behavior: 'smooth' })}, 2000)
            break;
        }
    }
    
}

function pontuacaoFinal(){

    let nivel;
    if(clique===quizExibido.questions.length){
        const resultado = (pontuacao * 100) / quizExibido.questions.length;

        for(let i=quizExibido.levels.length-1; i>=0; i--){
            if(Math.round(resultado)>=quizExibido.levels[i].minValue){
                nivel = quizExibido.levels[i];
                break
            }
        }

        segundaTela.innerHTML = segundaTela.innerHTML + `<div class="nivel">
        <div class="acerto">
            <h3>${Math.round(resultado)}% de acerto: ${nivel.title}</h3>
        </div>
        <div class="expli-acertos">
            <img src=${nivel.image}>
            <p>${nivel.text}</p>
        </div>
        </div>
        <div class="botoes">
            <button onclick="reiniciarQuiz()" class = "reiniciar">Reiniciar Quizz</button>
            <button onclick="voltarParaHome()" class = "voltar">Voltar pra home</button>
        </div>
        </div>`
        /*
        const ultimaDiv = document.querySelector('.segunda-tela div:last-of-type');
        console.log(ultimaDiv);
        setTimeout(function(){ultimaDiv.scrollIntoView({ block: 'center', behavior: 'smooth' })}, 2000)*/
    }
}

function reiniciarQuiz(){
    exibirQuiz();
    const ultimaDiv = document.querySelector('.segunda-tela div:last-of-type');
    ultimaDiv.scrollIntoView({ block: 'center', behavior: 'smooth' })
    pontuacao = 0;
    clique = 0;
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
