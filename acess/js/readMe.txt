


PostgreSQL - O PostgreSQL é um sistema de gerenciamento de banco de dados do tipo objeto-relacional (ORDBMS) com ênfase em extensibilidade e 
em padrões de conformidade. Como um servidor de banco de dados, sua principal função é armazenar dados de forma segura, apoiando as melhores práticas, 
permitindo a recuperação dos dados a pedido de outras aplicações de software. Ele pode lidar com cargas de trabalho que vão desde pequenas aplicações 
single-machine a aplicações de grande porte voltadas para a Internet, onde será utilizada de forma simultânea por vários usuários.


Postgis - O PostGIS é uma extensão espacial gratuita e de código fonte livre. Sua construção é feita sobre o sistema de gerenciamento de banco de dados PostgreSQL, 
que permite o uso de objetos GIS (Sistemas de Informação Geográfica) de serem armazenados em banco de dados. PostGIS inclui suporte para índices espaciais GiST e R-Tree, 
além de funções para análises básicas e processamento de objetos GIS. Também segue os padrões definidos pela Open Geospatial Consortium, além de amplamento utilizado.


SQL -  Structured Query Language ou linguagem de Consulta Estruturada. è uma linguagem declarativo utilizada para 
comunicar com banco de dados. è a linguagem padrão de banco de dados relacionais. 
Consultas em SQL são utilizadas para criar, atualizar, deletar e consultar dados dos banco de dados. Alguns dos mais populares
sistemas de gerenciamento de banco de dados que usam SQL são : PostgreSQl, MySQl, Oracle, Sybase, Microsoft SQL Server, Access, Ingres, etc.
A maioria dos sistemas gerenciadores de banco de dados tem sua proprias extensões, porem , os comandos padrões do SQL, 
'select', 'from' , 'where', 'delete', 'create', 'insert', 'update' são iguais em todos.




Front-end : 
HTML5 - O HTML5 é a evolução mais recente do padrão que define HTML . O termo representa dois conceitos diferentes.
 É uma nova versão da linguagem HTML, com novos elementos, atributos e comportamentos, e um conjunto maior de tecnologias que permite a criação de sites 
 e aplicativos da Web mais diversificados e poderosos. 

Semântica : permitindo que você descreva com mais precisão qual é o seu conteúdo.
Conectividade : permite que você se comunique com o servidor de maneiras novas e inovadoras.
Off-line e armazenamento : permitindo que páginas da Web armazenem dados no lado do cliente localmente e operem off-line com mais eficiência.
Multimídia : tornando o vídeo e o áudio de cidadãos de primeira classe na Open Web.
Gráficos 2D / 3D e efeitos : permitindo uma gama muito mais diversificada de opções de apresentação.
Desempenho e integração : proporcionando maior otimização de velocidade e melhor uso do hardware do computador.
Acesso ao dispositivo : permitindo o uso de vários dispositivos de entrada e saída.
estilizado : permitindo que os autores escrevam temas mais sofisticados.


CSS3 - è uma linguagem de 'folha de estilo', usada para descrever como deve ser a apresentação de um elemento escrito em HTML no documento(pagina), ou 
seja , CSS descreve como o elemento deve ser renderizado na tela. 
CSS é uma das principais linguagens utilizada na open web e é padronizada nos navegadores de acordo com a especificação W3C.



JavaScript - JavaScript é uma linguagem leve, interpretada ou just-in-time linguagem de programação compilada com funções de primeira classe. 
JavaScript é muito conhecida como linguagem de script para paginas web, mas muitas aplicações non-bronwsers utilizam esta linguagem, como por exemplo
servidores Node js , Apache CouchBD e  Adobe Acrobat . Javascript é uma linguagem dimanima, multiparadigma , que suporta estilos orientados a objetos, imperativos e declarativos 
O padrão para JavaScript é o ECMAScript. A partir de 2012, todos os navegadores modernos suportam totalmente o ECMAScript 5.1. Navegadores mais antigos suportam pelo menos ECMAScript 3. 
Em 17 de junho de 2015, a ECMA International publicou a sexta versão principal do ECMAScript, que é oficialmente chamada ECMAScript 2015, e foi inicialmente referida como ECMAScript 6 ou ES6. Desde então, os padrões ECMAScript estão em ciclos de lançamento anuais. Esta documentação refere-se à última versão do rascunho, que atualmente é o ECMAScript 2020.

Não confunda o JavaScript com a linguagem de programação Java. Ambos "Java" e "JavaScript" são marcas comerciais ou marcas registradas da Oracle nos EUA 
e em outros países. No entanto, as duas linguagens de programação têm sintaxes, semânticas e usos muito diferentes.


Jquery -    Jquery é uma biblioteca extremamente leve de JavaScript. O objetivo do Jquey é fazer o uso do javascript se tornar muito mais facil e 
reduzir o tamanho dos scripts das paginas web. Jquery faz isso pegando varias tarefas comuns que, se fossem escritas com javascript, precisariam de 
muitas linhas de codigo e compactando estas tarefas em metodos , que você pode apenas chamar, utlizando uma unica linha de codigo. 

Jquery tambem simplifica um varias outras coisas complicadas no javascript como, por exemplo, chamados AJAX, ou manipulação de DOMs.

A biblioteca Jquery possui as seguintes ferramentas : 

HTML/DOM manipulation
CSS manipulation
HTML event methods
Effects and animations
AJAX
Utilities


Node js - Node js é um framwork que possibilita a utilização da linguagem Javascript para criação de aplicações completas, não apenas webpages.
Tanto Node JS, quanto o Javascript rodam na engine 'V8-Javascript runtime engine', esta engine converte o codigo Javascript em um codigo de maquina super leve
de baixo nivel , o computador pode executar esse codigo sem a necessidade de interpreta-lo primeiro.
Node js usa um modelo non-blocking orientado a eventos que o torna extremamente leve e eficiênciente.
O 'ecosistema' de bibliotecas do Node js é o maior repositorio de bibliotecas do mundo.














-- after



Banco de dados : 
O banco de dados escolhido foi o PostgreSQL. O Banco de dados foi modelado de maneira que cada tabela 
tivesse apenas uma chave estrageira, esta chave estrangeira sempre erá um INTEGER, para facilitar o entendimento 
dos relacionamentos dos dados, visto que, o ambinete foi desenvolvido mirando um 
publico que ainda está apredendo os conceitos sobre Banco de dados e Banco de dados Geograficos.

Neste banco foi adicionada a extensão espacial Postgis , utilizada para trabalho com dados espacias.


Para consultas tabulares foram criadas 2 tabelas, estas eram a tabela eram uma tabela 'aluno',esta tabela tinha os campos, RG do tipo INTEGER,
nome do tipo TEXT, nota do tipo FLOAT. Estes tipos de dados foram escolhidos para possibilar a realização de operações 
de comparação, adição, subtração, divisão e multiplicação e tambem o trabalho com casas decimais. E outra tabela 'materia'
esta tinha os campos 'nome' do tipo TEXT e 'aluno' que era a chave primaria da tabela 'aluno'.

Tambem foram modeladas 2 tabelas com campos do tipo geometry, está eram utlizadas para a desmostração de consultas espacias
, desmostrando a utilidade de algumas funções espacias da extensão espacial Postgis. 

Estas tabelas continham alem de campos alfanumericos, campos do tipo geometry, utilizando a projeção 31983 UTM(Universal Trasnversa de Mercator), para facilitar o
entendimento de distancias, raios e buffer, ja que nesta projeção a Longitude e Latitude são calculas em metros a partir do Datum do sistema. Estas tabelas são :  'cidade', 
tabela que continha registros de cidades do vale do paraiba, com os campos 'nome' do tipo TEXT  e 'geom' do tipo geometry. E a outra era 'microregiao' , que continha os registros das
microregiões do sudeste. Esta tabela continha os campos 'nome' do tipo text e geom do tipo geometry.

Os dados das tabelas sem geometrias foram geradados aleatoriamente por um script feito com Javascript, onde eram passados conjuntos de dados scrpit os combinavam e ja o inseriam no banco.
     


var nomes = ["adriano", "camila",...];
var materias = ["matematica", "PHP",...];
var nomesUsados = [];
var Dados = { aluno: [] , materia : []};

var CreateAlunos = () => {
    var quantidade = nomes.length;
    while (quantidade > 0) {
        var nome = nomes[quantidade];
        var nota = (Math.random() * 10).toFixed(2);
        do {
            idade = (Math.random() * 10).toFixed(0);
        } while (idade < 18 || idade > 60);
        var rg = "";
        for (var i = 0; i < 8; i++) {
            rg += (Math.random() * 10).toFixed(0).toString();
        }

        aluno = {
            nome: nome,
            idade: idade,
            rg: rg,
            nota: nota
        }

        Dados.aluno.push(aluno);
        quantidade--;

    }
}


var CreateMaterias = () => {
    var _materias = [];
    var q = materias.length;
    var a = alunos.aluno.length;
    var parar = 10;
    while (parar > 0) {
        var i = (Math.random() * 10).toFixed(0);
        while (i > q || i < q) {
            i = (Math.random() * 10).toFixed(0);
        }
        var _materia = materias[i];
        var j = (Math.random() * 10).toFixed(0);
        while (j > a || j < a) {
            l = (Math.random() * 10).toFixed(0);
        }
        var _aluno = alunos.aluno[j];

        var newMateria = { nome: _materia, rg: _aluno.rg };
        if (_materias.indexOf(newMateria) == -1) {
            _materias.push(newMateria);
            parar--;
        }
    }

    Dados.materia = _materias;
}



CreateAlunos();
CreateMaterias();



$.ajax({
    url: `/insert/alunos`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(Dados),
    success: function (data) {
        console.log('Sucesso')
    },
    error: function (error) {
        console.error(error);
    }
}).fail(() => {
    console.log('Falha na conexão');
})



 
Quando esses dados chegavam na aplicação NodeJs, inseridos pelo methodo : 




app.post('/insert/alunos',function(request,response) => {
    
var dados = request.body;

var InsertAluno = `INSERT INTO aluno VALUES `;
var InsertMateria = `INSERT INTO materia VALUES `;


for(var a of dados.aluno){
    InsertAluno += `('${a.nome}',${a.idade},${a.nota},'${a.rg}'),`;
}

InsertAluno = InsertAluno.substring(0,InsertAluno.length -1);
InsertAluno += `;`;


for(var m of dados.materia){
    InsertMateria += `('${m.materia}','${m.rg}'),`;
}

InsertMateria = InsertAluno.substring(0,InsertAluno.length -1);
InsertMateria += `;`;

pool.query(InsertAluno,(result,error)=>{
    if(error){
        console.error(error);
        response.send(error);
        response.end();
    }else{
        console.log('Alunos inseridos com sucesso ...');
        console.log('Inserindo materias ...');
        pool.query(InsertMateria,(result,error)=>{
            if(error){
                console.error(error);
                response.send(error);
                response.end();
            }else{
                console.log('Sucesso');
                response.send('Sucesso');
                response.end();
            }
        })
    }
})

})


A aplicação feita no framework nodeJs foi feita da maneira mais simples possivel, 
referenciando a menor quantidade possivel de bibliotecas de desenvolvimento.

Foi utilizado o express para criação do servidor : 

var express = require('express');

var app = express();

app.listen(80, function () {
    console.log('Servidor rodando na porta 80!');
});


Para transforma o server static foi utulizado o server-static;

var serveStatic = require('serve-static');
app.use(serveStatic(diretorio_publico));


Para acessar o servidor foi utilizados dos methodos, o GET e o POST.

app.get(rota,callback(request,response));
app.post(rota,callback(request,response));

Definindo o tamanho maximo dos dados enviados para o server

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));



Os Bancos de dados são amplamente utilizados em todas as áreas da 
ciência e da Indústria, pois com o uso dessa tecnologia uma quantidade quase sem fim de 
dados podem ser armazenados de maneira logica e organiza, mas também, quando necessário 
podem ser consultados, editados, alterados adicionados, adicionados novos dados. 
Muitas bancos de dados e SGBDs são gratuitos hoje em dia, fazendo o uso dos banco de dados 
em todos os ramos da ciência aumentar 
visto que todos os dados são armazenados em banco de dados, desde 
registros de livros em uma biblioteca até milhões de transações bancarias.












/*
Função que cria uma rota e chama uma função (executar).
*/
app.get('/executa/consulta', executar(request, Response));



/*
Função que faz o procedimento de validar e consultar.
*/
function executar(req, res) {
    var q = url.parse(req.url, true).query;
    var consulta = q.query;

    consulta = validar(consulta);

    consultar(consulta, (resultado) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(resultado);
    })


}


/*
Função que consulta o banco e devolve a resposta.
*/
function consultar(consulta, callback) {
    pool.query(consulta, (err, resp) => {
        if (resp) {
            return callback(JSON.stringify(resp.rows));
        } else {
            return callback(JSON.stringify({ err: err.toString() }));

        }

    })
}


/*
Função para evitar comandos DDL
*/
function validar(consulta) {
    if (consulta.toLocaleLowerCase().indexOf("delete") != -1 || consulta.toLocaleLowerCase().indexOf("update") != -1 ||
        consulta.toLocaleLowerCase().indexOf("truncate") != -1 || consulta.toLocaleLowerCase().indexOf("create") != -1 ||
        consulta.toLocaleLowerCase().indexOf("drop") != -1) {
        return `Select 'Comandos DDL ou DML ' as "Permissão negada "`;
    }else{
        return consulta;
    }
}