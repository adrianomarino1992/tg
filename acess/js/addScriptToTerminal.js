





//+++++++++++++++++++++++++++++++++++++++ scrpit Funcionario ++++++++++++++
var btnAdmin = document.createElement('button');
btnAdmin.appendChild(newImg('./img/admin.png'));
var customAdmin = newCustomControl('custom_Admin', [btnAdmin]);
var btnTerminal = document.createElement('button');
btnTerminal.appendChild(newImg('./img/terminal.png'));
var customTerminal = newCustomControl('custom_Terminal', [btnTerminal]);

map.addControl(customTerminal);
$(`
    <div id="divTerminal">
        <div id="consultaTerminalResult">

        </div>
        <input type="text" id="consultaTerminal" placeholder="Digite seu comando ...">
    </div>`).appendTo(document.body);
var bdAtual = 'postgres';

$(btnTerminal).on('click', (event) => {
    var btn = event.currentTarget;
    if ($(document.querySelector('#divTerminal')).css('display') == 'none') {
        $(btn).css('border', '1px solid #51fa02');
        $(document.querySelector('#divTerminal')).fadeIn();
    } else {
        $(document.querySelector('#divTerminal')).fadeOut();
        $(btn).css('border', 'none');
    }
})



var text = "";
var lastQuery = "";
var terminal_url = `${host}/terminal/query/sqlserver?linha=`;
$(document).on('keyup', '#consultaTerminal', (event) => {

    if (event.keyCode == 13) {

        if ($('#consultaTerminal').val().toLocaleLowerCase().trim() == ".txt") {
            $('#consultaTerminalResult').append(`<p>.txt</p>`);
            $('#consultaTerminal').val("");
            let link = document.createElement('a');
            link.setAttribute('download', `tabela.txt`);
            link.href = makeTextFile(text);
            document.body.appendChild(link);

            window.requestAnimationFrame(function () {
                let event = new MouseEvent('click');
                link.dispatchEvent(event);
                document.body.removeChild(link);
            });
        } else if ($('#consultaTerminal').val().toLocaleLowerCase().trim() == "sqlserver" || $('#consultaTerminal').val().toLocaleLowerCase().trim() == "postgres") {
            bdAtual = $('#consultaTerminal').val().trim();
            if (bdAtual == "sqlserver") {
                terminal_url = `${host}/terminal/query/sqlserver?linha=`;
                $('#consultaTerminal').css('color', '#f8750a');
                $('#consultaTerminalResult').append(`<p>=========================${bdAtual}=========================</p>`);
                $('#consultaTerminal').val("");

            } else {
                terminal_url = `${host}/terminal/query/postgres?linha=`;
                $('#consultaTerminal').css('color', '#0a8df8');
                $('#consultaTerminalResult').append(`<p>=========================${bdAtual}=========================</p>`);
                $('#consultaTerminal').val("");
            }
        }else if ($('#consultaTerminal').val().toLocaleLowerCase().trim() == "suporte" || $('#consultaTerminal').val().toLocaleLowerCase().trim() == "ajuda" || $('#consultaTerminal').val().toLocaleLowerCase().trim() == "autor" || $('#consultaTerminal').val().toLocaleLowerCase().trim() == "help") { 
            
            $('#consultaTerminalResult').append(`<p>ENTRE EM CONTATO COM : adriano.marino1992@gmail.com</p>`);
            $('#consultaTerminal').val("");
        }else if ($('#consultaTerminal').val().toLocaleLowerCase().trim() == "adicionar funcionario") { 
            $('#adicionar_remover').fadeIn();
           // var r = prompt('Informe o email do agente : ','exemplo@exemplo.com');
            // if(r){
            //     var abort;
            //     var url = `${host}/create/new/agente?email=${r}`;
            //     url = encodeURI(url);
            //     var query = $.getJSON(url,(data)=>{
            //         console.log(data);
            //         closeLoader();
            //         clearTimeout(abort);
            //     })
            //     abort = setTimeout(()=>{
            //         query.abort();
            //         closeLoader();
            //         alert('Falha na conexão, tente novamente mais tarde');
            //     },10000)
            // }
            
        }else {

            var linha = $('#consultaTerminal').val();
            lastQuery = linha;
            var url = `${terminal_url}${linha}`;

            $('#consultaTerminal').val("");
           // console.log(encodeURI(url));
            var abort;
            $('#consultaTerminalResult').append(`<p>${linha}</p>`);
            openLoader();
            var query = $.getJSON(encodeURI(url), (data) => {
                closeLoader();
                if (data.erro) {
                    if (bdAtual == "sqlserver") {
                        $('#consultaTerminalResult').append(`<p>${data.erro.originalError.info.message}</p>`);
                    } else {
                        $('#consultaTerminalResult').append(`<p>${data.erro}</p>`);
                    }


                } else {
                    var colunas = [];
                    var registros = "";
                    var htmlColunas = `<table class="terminalTable"><tr>`;


                    $.each(data[0], function (key, value) {
                        colunas.push(key);

                    });


                    for (var i of colunas) {

                        htmlColunas += `<th>${i}</th>`;
                        text += `${i};`

                    }
                    htmlColunas += `</tr>`;
                    text += `\r\n`;

                    for (var i of data) {
                        registros += `<tr>`;
                        for (var j of colunas) {
                            // console.log(j);

                            registros += `<td>${i[j]}</td>`
                            text += `${i[j]};`
                        }
                        registros += `</tr>`;
                        text += `\r\n`;

                    }
                  //  console.log(text);

                    var tabela = htmlColunas + registros + "</table>";
                    //console.log(tabela);
                    $('#consultaTerminalResult').append(tabela);
                }
                clearTimeout(abort);
            })
            abort = setTimeout(function () { query.abort(); alert('Tempo de conecção expirou !'); closeLoader(); }, 10000);

        }
    }else if(event.keyCode == 40){
        $('#consultaTerminal').val("");
    }else if(event.keyCode == 38){
        $('#consultaTerminal').val(lastQuery);
    }
})








map.addControl(customAdmin);
var feature2addFile;
// $(document.body).on('mousemove',(evt)=>{
//    // console.log(evt.clientY);
//     $('#cursorADM').css('top',(evt.clientY-5)+"px");
//     $('#cursorADM').css('left',(evt.clientX-15)+"px");
    
//     $('#cursorADM').fadeIn();
    

// })
$(btnAdmin).on('click', () => {
    setAllToolsNull();
    removeDesenharInteraction();
    removeBuscarInteraction();
    removeMedirInteracion();
    alert('Atenção, todas as alterações feitas como administrador serão aplicadas diretamente sobre a base de dados !');
    if (adminMOde == true) {
        $(btnAdmin).css("border", "none");
        adminMOde = false;
    } else {
        $(btnAdmin).css("border", "1px solid rgb(143, 252, 0)");
        adminMOde = true;
        
        
    }

})



$('#updateAttrsAsAdmin').on('click', () => {
    updateAttrsAsAdmin();
})

function updateAttrsAsAdmin() {
    var gid;
    var tb;

    //  console.log(editarAttrFeature);
    if (editarAttrFeature.N.arquivo) {
        gid = editarAttrFeature.N.id;
        tb = editarAttrFeature.N.arquivo;

    }
    var update = `update "${tb}" set `;

    for (var row of editarAttrCampos) {
        var val = $(`#AttrEditar_${row.campo.trim()}`).val();
        if (val * 0 == 0) {
            var js = `editarAttrFeature.setProperties({${row.campo}:${val}});`;
            eval(js);
            update += `${row.campo} = ${val},`;
        } else {
            var js = `editarAttrFeature.setProperties({${row.campo}:'${val}'});`;
            eval(js);
            update += `${row.campo} = '${val}',`;
        }



        $('#editarAttrTools').fadeOut();
        toolbox_editarAttr = false;

    }
    update = update.substring(0, update.length - 1);
    update += ` where id = ${gid}`;

    var url = `${host}/pastas/dados/update?consulta=${update}`;
    url = encodeURI(url);
    var abort;
    openLoader();

    var query = $.getJSON(url, (data) => {
     //   console.log(data);
        closeLoader();
        clearTimeout(abort);
    })
    abort = setTimeout(() => {
        query.abort();
        closeLoader();
        alert('Tempo de espera expirado, verifique sua conexão !');
    }, 10000)
}
var EditarAdminSalvar = $('#EditarAdminSalvar');
EditarAdminSalvar.on('click', () => {
    editarFeaturesGeometry2Bd();
    $('#EditarAdminSalvar_div').fadeOut();
})

function editarFeaturesGeometry2Bd() {
    var features = editedCamada.getSource().getFeatures();
    var WKT = new ol.format.WKT();
    openLoader();

    if (featuresModified.N.arquivo) {
        var f = featuresModified;
        //console.log(f);
        var thisGeom = WKT.writeGeometry(f.getGeometry());
        var abortAjax;
        var gid = f.N.id;
        var tb = f.N.arquivo;
        var consultaUpdate = `update "${tb}" set geom = ST_Transform(ST_geomfromtext('${thisGeom}',4326),31983) where id = ${gid}`;
        //  console.log(consultaUpdate);
        var url = encodeURI(`${host}/update/geom`);
        var ajaxBuffer = $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ consulta: consultaUpdate }),
            success: function (data) {
                // console.log(data);

                clearTimeout(abortAjax);

            }
        })
        abortAjax = setTimeout(() => {
            ajaxBuffer.abort();
            closeLoader();
            alert('Tempo de conecção expirou !');
        }, 15000);


        closeLoader();


    }
}

function addSnap(sourceParam) {
    var modify = new ol.interaction.Modify({ source: sourceParam });
    map.addInteraction(modify);
    snap = new ol.interaction.Snap({ source: sourceParam });
    map.addInteraction(snap);


}


createLabeltoButtom('btnAdmin', 'admLabel', 190);
createLabeltoButtom('btnTerminal', 'consoleLabel', 90);




$('#toolbox_tools').append(`<option value="add_arquivo">+ Arquivo</option>`);
$('#toolbox_tools').append(`<option value="acessar_arquivo">Acessar Arquivo</option>`)




function add_fileToolActived(pixel, coordinate) {
    map.forEachFeatureAtPixel(pixel, function (feature) {
        $('#map_addFile').empty();
        $('#addfile_campos').empty();
        if (feature) {
            if (feature.N.gid && feature.N.arquivo) {

                var zoom;
                try {
                    if (feature.getGeometry().getArea() < 0.02060038546981559) {
                        zoom = 15;
                    } else {
                        zoom = 10;
                    }
                } catch{
                    zoom = 12;
                }
                feature2addFile = feature;
                $('#add_arquivoTools').fadeIn();

                var source = new ol.source.Vector({});
                var layer = new ol.layer.Vector({
                    source: source
                })
                source.addFeature(feature);
                //console.log(feature);
                var map_addFile = new ol.Map({
                    layers: [],
                    target: 'map_addFile',
                    view: new ol.View({
                        projection: 'EPSG:4326',
                        center: coordinate,

                        zoom: zoom,
                        minZoom: minZoom,
                        maxZoom: 19

                    })
                });
                var this_basemap = new ol.layer.Tile({
                    visible: true,
                    preload: Infinity,
                    source: new ol.source.BingMaps({
                        key: 'AgDol3nJb3nKPr3wQlsLqzif5uWDKPymbNTDQAkFxiHlZf7GjiL7Da5Qg4EFqIn_',
                        imagerySet: "AerialWithLabels"
                    })
                });
                
                // var mapView = map.getLayerGroup();
                // map_addFile.setLayerGroup(mapView);
                map_addFile.addLayer(this_basemap);
                map_addFile.addLayer(layer);

                

                for (var keys in feature.N) {
                    if (keys != "fotoDenuncia" && keys != "fotoOcorrencia" && keys != "geometry") {
                        $('#addfile_campos').append(` <h2 class="cat_teme">${keys} : </h2>
                                <input type="text" class="input" disabled value="${feature.N[keys]}">`);
                    }

                }

            }
        }

    })
}


var btn_add_file = $('#btn_add_file');
btn_add_file.on('click', () => {
    $('#add_file_feature').click();
});

var AddFile_tools_buttom = $('#AddFile_tools_buttom');
AddFile_tools_buttom.on('click', () => {

    var descricao = $('#add_file_descricao').val();

    if (descricao.trim() == "" || descricao.trim() == " ") {
        alert('Preencha a descrição')
    } else {
        if (feature2addFile.N.gid && feature2addFile.N.arquivo) {
            var data = new FormData();
            $.each($('#add_file_feature')[0].files, function (i, file) {
                data.append('file-' + i, file);
            });
            var d = new Date();
            var filename = d.getTime();
            var gid = feature2addFile.N.gid;
            var arquivo = feature2addFile.N.arquivo;
            openLoader();
            $.ajax({
                url: `/upload/file/features?nome=${filename}&gid=${gid}&arquivo=${arquivo}&descricao=${descricao}`,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                success: function (data) {
                    alert(data.sucesso);
                    closeLoader();
                }
            });
        }
        closeLoader();
        $(btnToolbox).css('border', 'none');
        $('#add_arquivoTools').fadeOut();
    }
    $('#add_file_descricao').val("");

});

function acessar_fileToolActived(pixel) {
    map.forEachFeatureAtPixel(pixel, function (feature) {
        $('#acessar_arquivoTools').css('display', 'none');
        $('#acessar_arquivos_files').empty();
        if (feature) {
            if (feature.N.gid && feature.N.arquivo) {
                var gid = feature.N.gid;
                var arquivo = feature.N.arquivo;
                var url = `${host}/acessar/arquivos?gid=${gid}&arquivo=${arquivo}`;

                url = encodeURI(url);
                //console.log(url);
                openLoader();
                var abort;
               var query = $.getJSON(url, (data) => {
                    if (data.erro) {
                        
                        console.log(data.erro);
                    } else {
                       
                        if (data.length > 0) {
                            $('#acessar_arquivoTools').fadeIn();
                            $('#acessar_arquivos_files').empty();
                            for (var row of data) {
                                $('#acessar_arquivos_files').append(`<div style="padding:5px;border:1px solid grey;margin:2px;"><a href="${host}/download/add_files?arquivo=${row.arquivo}" target="_blank">${row.arquivo} </a>
                                
                                <input type="text" class="input" value="${row.descricao}" disabled></div>`);
                            }
                        } else {
                            alert('Esta feature não possui arquivos relacionados !');
                            $('#acessar_arquivoTools').css('display', 'none');
                            $('#acessar_arquivos_files').empty();
                        }
                    }
                    clearTimeout(abort);
                    closeLoader();
                })
                abort = setTimeout(() => {
                    query.abort();
                    closeLoader();
                    alert('Tempo de espera expirado, verifique sua conexão !');
                }, 10000)
            } else {
                closeLoader();
                alert('Esta feature não possui arquivos relacionados !');
                $('#acessar_arquivoTools').css('display', 'none');
                $('#acessar_arquivos_files').empty();
            }
        } else {
            closeLoader();
            $('#acessar_arquivoTools').css('');
            $('#acessar_arquivos_files').empty();
        }
    })
}

var buscar_tipo = $('#buscar_tipo');
buscar_tipo.append(`<option value="arquivos">Arquivos relacionados</option>`);


var buscar_arquivo_btn = $('#buscar_arquivo_btn');
buscar_arquivo_btn.on('click', () => {
    var arquivo_categoria = $('#arquivo_categoria').val();
    if (arquivo_categoria == "sem_dados") {
        alert('0 arquivos relacionados encontrados ! ');
    } else {
        var abort;
        var url = `${host}/acessar/files/tabela?tabela=${arquivo_categoria}`;
        var url = encodeURI(url);
        openLoader();
        var query = $.getJSON(url, (data) => {
            $('#arquivo_search_result').empty();
            if (data.erro) {
                console.log(data.erro);
            } else {
                for (var row of data) {
                    $('#arquivo_search_result').append(`<div style="padding:5px;border:1px solid grey;margin:2px;"><a href="${host}/download/add_files?arquivo=${row.arquivo}" target="_blank">${row.arquivo} </a>
                    <input type="text" class="input" value=" Feature : ${row.gid}" disabled>
                    <input type="text" class="input" value=" Descrição : ${row.descricao}" disabled></div>`);
                }
            }
            clearTimeout(abort);
            closeLoader();
        })
        var abort = setTimeout(() => {
            query.abort();
            alert('Desculpe, algo demorou demais para carregar, tente novamente mais tarde');
            closeLoader();
        }, 10000);
    }
})
$('#metadado_categoria').append(`<option value="ortofotos" id="optionOrtofoto">Ortofotos</option>`);


$('#callAcessarOrtofoto').on('click',()=>{
    AcessarOrtofotos();
})

function AcessarOrtofotos() {

    $('#mapa_meta_ortofoto').fadeIn();
    var ano = $('#metadado_categoria_ano').val();
    var arquivo_ano;
    var pasta;
    switch (ano) {
        case "1998": arquivo_ano = "articulacao_1998.geojson",pasta = "privado_ano1998" ; break;
        case "2003": arquivo_ano = "articulacao_2003.geojson", pasta = "privado_ano2003"; break;
        case "2007": arquivo_ano = "articulacao_2007.geojson", pasta = "privado_ano2007"; break;
        case "2009": arquivo_ano = "articulacao_2009.geojson", pasta = "privado_ano2009"; break;
        case "2010": arquivo_ano = "articulacao_2010.geojson", pasta = "privado_ano2010"; break;

    }
    $.get(`public/GeoJSON/${arquivo_ano}`, (data) => {

        $('#thismap').empty();
        var map_metadado = new ol.Map({
            layers: [],
            target: 'thismap',
            view: new ol.View({
                projection: 'EPSG:4326',
                center: [-45.96, -23.3],
                zoom: 15,
                minZoom: 12,
                maxZoom: 19

            })
        });
        var this_basemap = new ol.layer.Tile({
            visible: true,
            preload: Infinity,
            source: new ol.source.BingMaps({
                key: 'AgDol3nJb3nKPr3wQlsLqzif5uWDKPymbNTDQAkFxiHlZf7GjiL7Da5Qg4EFqIn_',
                imagerySet: "AerialWithLabels"
            })
        });
        map_metadado.addLayer(this_basemap);
        var source = new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(data)
        });
        var layer = new ol.layer.Vector({
            source: source
        })


        map_metadado.addLayer(layer);
        var selectInteraction = new ol.interaction.Select({});
        map_metadado.addInteraction(selectInteraction);


        map_metadado.on('click', (evt) => {
            $('#thismap_attr').empty();
            map_metadado.forEachFeatureAtPixel(evt.pixel, function (feature) {
                if (feature) {
                    for (var keys in feature.N) {
                        if (keys != "geometry") {
                            $('#thismap_attr').append(` <h2 class="cat_teme">${keys} : </h2>
                            <input type="text" class="input" disabled value="${feature.N[keys]}">`);
                        }

                    }
                    $('#meta_search_result').empty();
                    var arquivo = feature.N.location;
                    arquivo = arquivo.toLowerCase();
                   // console.log(arquivo);
                    var href = encodeURI(`${host}/download?diretorio=${arquivo.trim()}&pasta=${pasta}`);
                    $('#meta_search_result').append(`<p><a class="download" target="_blank" href="${href}">${arquivo}.zip</a></p>`);

                }

            })
        })

    })
}

 
var btnResp = $('#btnResp');

$(btnResp).fadeIn();
btnResp.on('click',()=>{
$('#Resp_div').fadeIn();
$('#fechariResp').fadeIn();
$('#backInfo').fadeOut();
})
$('#fechariResp').on('click',()=>{
    $('#Resp_div').fadeOut();
$('#fechariResp').fadeOut();

})
$('#fechariRespMObile').on('click',()=>{
    $('#fechariResp').click(); 
})
var Resp_div_div_btn = $('#Resp_div_div_btn');
Resp_div_div_btn.on('click', () => {
    var assunto = $('#infoAssunto_resp').val();
    var status = $('#infoAssunto_resp_sit').val();
    var abort;
    var url = `${host}/fale/conosco/get?assunto=${assunto}&status=${status}`;
    url = encodeURI(url);
   // console.log(url);
    openLoader();
    var query = $.getJSON(url, (data) => {
     //   console.log(data);
        $('#Resp_div_result').empty();
        for(var f of data){
            var linha_arquivo;
            if(f.arquivo == "sem arquivo"){
                linha_arquivo =  `<p>${f.arquivo} </p>`;
                
            }else{
                linha_arquivo =`<a href="${host}/download/add_files?arquivo=${f.arquivo}" target="_blank">${f.arquivo} </a>`;
            }
            $('#Resp_div_result').append(`
            <div class="fale_resp" id="${f.protocolo}">
            <h2 class="cat_teme">Protocolo : </h2>
            <input type="text"  class="input" value="${f.protocolo}" disabled>
            <h2 class="cat_teme">Email : </h2>
            <input type="text"  class="input" value="${f.email}" disabled>
            <h2 class="cat_teme">Telefone : </h2>
            <input type="text" class="input" value="${f.fone}" disabled>
            <h2 class="cat_teme">Texto : </h2>
            <textarea style="width:100%; padding:5px; resize:none;" disabled>${f.texto}</textarea>
            <h2 class="cat_teme">Arquivo : </h2>
            ${linha_arquivo}
            
            </div>
            `);
            
        }
       
        closeLoader();
        clearTimeout(abort);
    })
    abort = setTimeout(()=>{
        query.abort();
        closeLoader();
        alert('Tempo de conecção expirou !');
    },10000);

    if(status == 'aberta'){
        $(document).on('dblclick', '.fale_resp', (event) => {
            var div = event.currentTarget;
            var protocolo = div.id;
            var r = confirm('Deseja marcar esta mensagem como lida ?');
            if(r == true){
                var url = `${host}/fale/conosco/update?protocolo=${protocolo}`;
            url = encodeURI(url);
                openLoader();
            var query = $.getJSON(url, (data) => {
                if(data){
                    if(data.erro){
                        alert(data.erro);
                    }else{
                        alert(data.sucesso);
                        
                    }
                }
                
                closeLoader();
                clearTimeout(abort);
            })
            abort = setTimeout(()=>{
                query.abort();
                closeLoader();
                alert('Tempo de conecção expirou !');
            },10000);
            }
        })
    }
})



var add_remove_funcionario = $('#add_remove_funcionario');
add_remove_funcionario.on('change',()=>{
    var valor = $(add_remove_funcionario).val();
    if(valor == "adicionar"){
        $('#adicionar').fadeIn();
        $('#remover').css('display','none');
    }else{
        $('#adicionar').css('display','none');
        $('#remover').fadeIn();
    }
})

var closeAdd_remove = $('#closeAdd_remove');
closeAdd_remove.on('click',()=>{
    $('#adicionar_remover').fadeOut();
})

var add_pronto_func = $('#add_pronto_func');
add_pronto_func.on('click',()=>{
    var nome = $('#add_nome_func').val();
    var matricula = $('#add_matricula_func').val();
    var senha = $('#add_senha_func').val();
    var email = $('#add_email_func').val();
    
    var url = `${host}/create/new/agente?nome=${nome}&matricula=${matricula}&senha=${senha}&email=${email}`;
    url = encodeURI(url);
    var abort;
    openLoader();
    var query = $.getJSON(url, (data) => {
        closeLoader();
        clearTimeout(abort);
        if(data.erro){
            alert(data.erro);
        }else{
            alert(data.sucesso);
        }
        $('#adicionar_remover').fadeOut();
        
    })
    abort = setTimeout(() => {
        query.abort();
        closeLoader();
        alert('Tempo de espera expirado, verifique sua conexão !');
    }, 10000)


})


var remove_pronto_func = $('#remove_pronto_func');
remove_pronto_func.on('click',()=>{
        var matricula = $('#remove_matricula_func').val();
   
    
    var url = `${host}/delete/agente?matricula=${matricula}`;
    url = encodeURI(url);
    var abort;
    openLoader();
    var query = $.getJSON(url, (data) => {
        closeLoader();
        clearTimeout(abort);
        if(data.erro){
            alert(data.erro);
        }else{
            alert(data.sucesso);
        }
        $('#adicionar_remover').fadeOut();
        
    })
    abort = setTimeout(() => {
        query.abort();
        closeLoader();
        alert('Tempo de espera expirado, verifique sua conexão !');
    }, 10000)


})