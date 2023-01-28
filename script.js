const primeiraTela = document.querySelector(".primeira-tela");
const segundaTela = document.querySelector(".segunda-tela");
const terceiraTela = document.querySelector(".terceira-tela");
const meusQuizzesVazio = document.querySelector(".meusQuizzesVazio");
const meusQuizzesPreenchido = document.querySelector(".meusQuizzesPreenchido");
let arrayQuizz;
let arrayQuestoes = [];
let arrayRespostas = [];
let arrayNiveis = [];
let arrayMeusQuizz = [];
let verificadorTela31 = 0; // considero para erro, se estiver ok muda para 1
let verificadorTela32 = 0;
let verificadorTela33 = 0;
let numPerg = 0;
let numNiveis = 0;
let nomeQuizz;
let imgQuizz;
let pontuacao = 0;
let clique = 0;
let quizExibido;
let divAvo;
let idQuizAtual;
let novoID;
let todosIds = [];
const listaMeus = meusQuizzesPreenchido.querySelector(".listagemQuizz");
const listaTodos = document.querySelector(".todosQuizzes .listagemQuizz");
    
buscarQuizz();

// inicializo com o que já tem e quando crio um novo faco um push para atualizar
const listaSerializada = localStorage.getItem("lista"); // Pegando de volta a string armazenada na chave "lista"
const lista = JSON.parse(listaSerializada); // Transformando a string de volta na array original
if(lista!==null){
    arrayMeusQuizz = lista;
}



function erro(exibiErro){
    console.log("ERRO FOI DO TIPO " + exibiErro.response.status);
}

function exibirQuiz(id){
    pontuacao = 0;
    clique = 0;
    idQuizAtual = id;
    //console.log(idQuizAtual);
    const quiz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`);
    quiz.then(exibirQuizFuncionou);
    quiz.catch(erro);
}

function exibirQuizFuncionou(Carregarquiz){
    primeiraTela.classList.add('escondido');
    segundaTela.classList.remove('escondido');
    terceiraTela.classList.add('escondido');
    quizExibido = Carregarquiz.data;

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
    
    //fará a parte de scrollar até o próximo elemento!
    divAvo = divMaior.parentNode.parentNode;

    for(let i=0; i<divAvo.children.length; i++){
        if((divAvo.children[i] === divMaior.parentNode) && i+1 !== divAvo.children.length){
            //usando função anonima
            setTimeout(function(){ divAvo.children[i+1].scrollIntoView({ block: 'center', behavior: 'smooth' })}, 2000)
            break;
        }
    }
    pontuacaoFinal();
    
}

function pontuacaoFinal(){
    //console.log("quantidade de perguntas " + quizExibido.questions.length);
    //console.log("quantidade de cliques " + clique);
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
        
        const revelacaoNivel = document.querySelector('.nivel');
        
        setTimeout(function(){revelacaoNivel.scrollIntoView({ block: 'center', behavior: 'smooth' })}, 2000)
    }
}

function reiniciarQuiz(){
    exibirQuiz(idQuizAtual);
    const ultimaDiv = document.querySelector('.segunda-tela div:last-of-type');
    ultimaDiv.scrollIntoView({ block: 'center', behavior: 'smooth' })
    
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
    listaTodos.innerHTML = "";
    quizzes.forEach(exibirTodosTela1);
    if(arrayMeusQuizz.length !== 0){
        meusQuizzesPreenchido.classList.remove('escondido');
        meusQuizzesVazio.classList.add('escondido');
        quizzesFiltrados = quizzes.filter(filtroQuizzes);
        listaMeus.innerHTML = "";
        quizzesFiltrados.forEach(exibirMeusTela1);
    }
}

function filtroQuizzes(todosQuizzes){
    for (let i=0; i<arrayMeusQuizz.length; i++){
        if (todosQuizzes.id === arrayMeusQuizz[i] ){ //vejo se está na lista local, se sim add 
            return true;
        }
    }
}

function exibirTodosTela1(quizzTelaEntrada){
    listaTodos.innerHTML += `
        <div class="exibicaoQuizz" onclick="exibirQuiz(${quizzTelaEntrada.id})">
            <img src = ${quizzTelaEntrada.image} alt="imagemquizz">
            <div class="degrade"></div>
            <div class="descricaoQuizz">${quizzTelaEntrada.title}</div>
        </div>`;
}

function exibirMeusTela1(quizzTelaEntrada){
    
    if (arrayMeusQuizz[0] !== undefined){
    //montar a parte de pegar o numero salvo e exibir
        listaMeus.innerHTML += `
            <div class="exibicaoQuizz" onclick="exibirQuiz(${quizzTelaEntrada.id})">
                <img src = ${quizzTelaEntrada.image} alt="imagemquizz">
                <div class="degrade"></div>
                <div class="descricaoQuizz">${quizzTelaEntrada.title}</div>
            </div>`;
    }
}

function criarProxPag(Pagina){
    const pagAtual = Pagina.parentNode;
    const pagClassList = pagAtual.classList[0];
    if (pagClassList == "tela-3-1"){
        verificaTela31();
        if (verificadorTela31 === 1){
            proxPag = document.querySelector(".tela-3-2");
            Tela32();
            pagAtual.classList.add('escondido');
            proxPag.classList.remove('escondido');
        }      
    } else if (pagClassList === "tela-3-2"){
        verificaTela32()
        if (verificadorTela32 === 1){
            proxPag = document.querySelector(".tela-3-3");
            Tela33();
            pagAtual.classList.add('escondido');
            proxPag.classList.remove('escondido');
        }
    } else if (pagClassList === "tela-3-3"){
        verificaTela33()
        if (verificadorTela33 === 1){
            arrayQuizz = {title: nomeQuizz, image: imgQuizz, questions: arrayQuestoes, levels: arrayNiveis};
            enviarNovoQuizz();
        }
    } 
}

function verificaTela31(){
    const itemParaValidar = document.querySelector(".tela-3-1 .conteinerCriacao");
    const caracteres = itemParaValidar.children[0].value.length;
    const validaURL = itemParaValidar.children[1].checkValidity();
    numPerg = Number(itemParaValidar.children[2].value);
    numNiveis = Number(itemParaValidar.children[3].value);
    if (caracteres > 19 && caracteres < 66 && validaURL === true && numPerg > 2 && numNiveis > 1){
        verificadorTela31 = 1;
        nomeQuizz = itemParaValidar.children[0].value;
        imgQuizz = itemParaValidar.children[1].value;
    } else {
        alert('Preencha os dados corretamente!');
    }
}

function Tela32(){
    const pag = document.querySelector(".tela-3-2");
    for (let i = 1; i < numPerg+1; i++){
        pag.innerHTML += `
        <div class="conteinerCriacao reduzido">
            <div class="subtitulos">Pergunta ${i} <ion-icon name="create-sharp" onclick="expandirPergunta(this)"></ion-icon></div>
        </div>`;
    }
    pag.innerHTML += `
    <div class="proxPag" onclick="criarProxPag(this)"> Prosseguir pra criar níveis </div>`;
}

function expandirPergunta(pergunta){
    const pergAtual = pergunta.parentNode.innerHTML[9];
    const conteinerAtual = pergunta.parentNode.parentNode;
    conteinerAtual.classList.remove("reduzido");
    conteinerAtual.classList.add("Pergunta"+pergAtual);
    conteinerAtual.innerHTML = `
        <div class="subtitulos">Pergunta ${pergAtual}</div>
        <input type="text" placeholder="Texto da pergunta">
        <input type="text" placeholder="Cor de fundo da pergunta">
        <div class="subtitulos">Resposta correta</div>
        <input type="text" placeholder="Resposta correta">
        <input type="URL" placeholder="URL da imagem">
        <div class="subtitulos">Respostas incorretas</div>
        <input type="text" placeholder="Resposta incorreta 1">
        <input type="URL" placeholder="URL da imagem 1">
        <div class="divisorInput"></div>
        <input type="text" placeholder="Resposta incorreta 2">
        <input type="URL" placeholder="URL da imagem 2">
        <div class="divisorInput"></div>
        <input type="text" placeholder="Resposta incorreta 3">
        <input type="URL" placeholder="URL da imagem 3">
    `;
}

function verificaTela32(){
    arrayQuestoes = [];
    arrayRespostas = [];
    if(document.querySelector(".Pergunta"+numPerg) === null){
        alert('Preencha os dados corretamente!');
    }
    for (let i = 1; i < numPerg+1; i++){
        const itemParaValidar = document.querySelector(".Pergunta"+i);
        const caracteres = itemParaValidar.children[1].value.length;
        const validaCor = itemParaValidar.children[2].value;
        var RegExp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(validaCor) && validaCor.length === 7;
        const respCerta = itemParaValidar.children[4].value !== "";
        const validaURL1 = itemParaValidar.children[5].checkValidity();
        const respErrada = itemParaValidar.children[7].value !== "";
        const validaURL2 = itemParaValidar.children[8].checkValidity();
        if (caracteres > 19 && RegExp === true && respCerta === true && validaURL1 === true && respErrada === true && validaURL2 === true){
            verificadorTela32 = 1;
            const arrayRespostas = [{
                text: itemParaValidar.children[4].value,
                image: itemParaValidar.children[5].value,
                isCorrectAnswer: true},
                {
                text: itemParaValidar.children[7].value,
                image: itemParaValidar.children[8].value,
                isCorrectAnswer: false}];
            if (itemParaValidar.children[10].value !== "" && itemParaValidar.children[11].checkValidity() === true){
                arrayRespostas.push({
                    text: itemParaValidar.children[10].value,
                    image: itemParaValidar.children[11].value,
                    isCorrectAnswer: false});
            }
            if (itemParaValidar.children[13].value !== "" && itemParaValidar.children[14].checkValidity() === true){
                arrayRespostas.push({
                    text: itemParaValidar.children[13].value,
                    image: itemParaValidar.children[14].value,
                    isCorrectAnswer: false});
            }
            arrayQuestoes.push({title:itemParaValidar.children[1].value, color:itemParaValidar.children[2].value, answers: arrayRespostas});
        } else {
            verificadorTela32 = 0;    
        }
    }
    if(verificadorTela32 === 0){
        alert('Preencha os dados corretamente!');
    }
}

function Tela33(){
    const pag = document.querySelector(".tela-3-3");
    for (let i = 1; i < numNiveis+1; i++){
        console.log(i);
        pag.innerHTML += `
        <div class="conteinerCriacao reduzido">
            <div class="subtitulos">Nível ${i} <ion-icon name="create-sharp" onclick="expandirNiveis(this)"></ion-icon></div>
        </div>`;
    }
    pag.innerHTML += `
    <div class="proxPag" onclick="criarProxPag(this)"> Finalizar Quizz </div>`;
}

function expandirNiveis(nivel){
    console.log(nivel.parentNode.innerHTML);
    const nivelAtual = nivel.parentNode.innerHTML[6];
    const conteinerAtual = nivel.parentNode.parentNode;
    console.log(nivelAtual);
    conteinerAtual.classList.remove("reduzido");
    conteinerAtual.classList.add("Nivel"+nivelAtual);
    conteinerAtual.innerHTML = `
        <div class="subtitulos">Nível ${nivelAtual}</div>
        <input type="text" placeholder="Título do nível">
        <input type="text" placeholder="% de acerto mínima">
        <input type="URL" placeholder="URL da imagem do nível">
        <input type="text" placeholder="Descrição do nível">
    `;
}

function verificaTela33(){
    arrayNiveis = [];
    let acertoZero = 0;
    for (let i = 1; i < numNiveis+1; i++){
        const itemParaValidar = document.querySelector(".Nivel"+i);
        const caracteres = itemParaValidar.children[1].value.length;
        const validaAcerto = itemParaValidar.children[2].value;
        const validaURL = itemParaValidar.children[3].checkValidity();
        const validaNivel = itemParaValidar.children[4].value.length;
        if (caracteres > 9 && validaAcerto >= 0 && validaAcerto <=100 && validaURL === true && validaNivel >30){
            verificadorTela33 = 1;
            arrayNiveis.push({
                title: itemParaValidar.children[1].value,
			    image: itemParaValidar.children[3].value,
			    text: itemParaValidar.children[4].value,
			    minValue: itemParaValidar.children[2].value});
            if (itemParaValidar.children[2].value == 0){
                acertoZero += 1;
                console.log(acertoZero);
            }
        } else {
            verificadorTela33 = 0;    
        }
    }
    if(verificadorTela33 === 0 || acertoZero === 0){
        alert('Preencha os dados corretamente!');
    }
}

function enviarNovoQuizz(){
    
    const promessaNovoQuizz = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", arrayQuizz);

    promessaNovoQuizz.then(enviarNovoQuizzFuncionou);

    promessaNovoQuizz.catch(erro);
}

function enviarNovoQuizzFuncionou(certo){
    novoID = (certo.data.id);
    arrayMeusQuizz.push(novoID);
    const arraySerializado = JSON.stringify(arrayMeusQuizz);
    localStorage.setItem("lista", arraySerializado);
    
    Tela34();

    pagAtual = document.querySelector(".tela-3-3");
    proxPag = document.querySelector(".tela-3-4");
    pagAtual.classList.add('escondido');
    proxPag.classList.remove('escondido');
}

function Tela34(){
    const pag = document.querySelector(".tela-3-4");
    pag.innerHTML += `
        <div class="conteinerFim">
            <img src = ${imgQuizz} alt="imagemquizz">
            <div class="degrade"></div>
            <div class="descricaoQuizz">${nomeQuizz}</div>
        </div>
        <div class="proxPag" onclick="exibirQuiz(${arrayMeusQuizz[arrayMeusQuizz.length-1]})"> Acessar Quizz </div>
            <div class="voltarParaHome" onclick="voltarParaHome()"> Voltar pra home </div>
    `;
}