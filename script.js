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
    let alternativas = "";
    layout.innerHTML =`<div class="banner">
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

        //const corDeFundo = document.querySelector('titulo-pergunta');
        //corDeFundo.getElementsByClassName.backgroundColor = quizExibido.questions[i].color;
        for(let j=0; j< quizExibido.questions[i].answers.length; j++){
            alternativas =`<div class="resposta">
                <img src = "${quizExibido.questions[i].answers[j].image}">
                <p>${quizExibido.questions[i].answers[j].text}</p>
            </div>`
            template= template + alternativas;
        }
        `</div>`;
        layout.innerHTML = layout.innerHTML + template;
    }

    layout.innerHTML = layout.innerHTML + `</div>`;

}