// autor: Adriano Marino Balera 
// email: adriano.marino1992@gmail.com
// trabalho de conclusão do curso de Geoprocessamento , FATEC - Jacareí 



/* variaveis globais */


var allQueryInputs;
var allQueryResults;
var allVisibleLayers = { layers: [] };
var layersLegenda = [];
var DoubleLayers = [];
var styleFeatureSelected;
var fotoAtual;
var allCampos2Features = [];
var toolbox_buffer = false;
var toolbox_editarAttr = false;
var editarAttrFeature;
var editarAttrCampos = [];
var perimetroToolActived = false;
var areaToolActived = false;
var minZoom = 4;
var adminMOde = false;
var featuresModified;
var rotularToolActived = false;
var feature2Rotular;
var allPopUpsOpened = [];
var buscarInteracionOpened = false;
var buscarInteraction;
var desenharInteracionOpened = false;
var desenharInteraction;
var medirInteracionOpened = false;
var medirInteraction;
const host = ``;
var add_arquivoToolActived = false;
var acessar_arquivoToolActived = false;
var numeroDeMsg = 0;
var meuBanco;


/* variaveis globais */









/* mapa */


$(document).on('mousemove', (event) => {
    if ($("#beta_theme").css('display') == 'none') {
        $("#beta_theme").fadeIn();
        $("#beta_theme").css({ 'top': event.clientY + 10, 'left': event.clientX + 20 });

    } else {

        $("#beta_theme").css({ 'top': event.clientY + 10, 'left': event.clientX + 20 });
        $("#beta_theme").fadeOut();
    }
})



function newImg(src) {
    let img = document.createElement('img');
    img.src = src;
    img.style.backgroundRepeat = 'no-repeat';
    img.style.backgroundPosition = 'center center';
    img.style.width = '15.08px';
    img.style.height = '15.08px';
    return img;
};


function setAllToolsNull() {
    toolbox_buffer = false;
    toolbox_editarAttr = false;
    editarAttrFeature = null;
    editarAttrCampos = [];
    perimetroToolActived = false;
    areaToolActived = false;
    rotularToolActived = false;
    add_arquivoToolActived = false;
    acessar_arquivoToolActived = false;
    $('#acessar_arquivoTools').fadeOut();
    $('#toolboxTools').fadeOut();
    $('#bufferTools').fadeOut();
    $('#rotularTools').fadeOut();
    $('#perimetroToolTools').fadeOut();
    $('#areaToolTools').fadeOut();
    $('#editarAttrTools').fadeOut();
    $('#editarTools').fadeOut();
    $('#StatsTools').fadeOut();
    $('#inputVector').fadeOut();
    $('#add_arquivoTools').fadeOut();
    $(btnEditarLayer).css('border', 'none');
    $(btnToolbox).css('border', 'none');
}

// var olFullscreen = new ol.control.FullScreen({
//     label: newImg('./img/fullscreen.png'), // IMG BUTTON OFF
//     labelActive: newImg('./img/fechar.png'), // IMG BUTTON ON
//     tipLabel: 'Tela Cheia' // TIP
// });


var olRotate = new ol.control.Rotate({
    label: newImg('./img/north.png'), // IMG BUTTON
    autoHide: false, // AUTO HIDE OFF
    tipLabel: 'Rotacionar' // TIP
});


var olScale = new ol.control.ScaleLine();

function newCustomControl(classe, elements) { // PARAMETERS CLASS NAME AND ARRAY OF ELEMENTS
    let newElement = document.createElement('div'); // CREATES A NEW DIV ELEMENT
    newElement.className = `${classe} ol-unselectable ol-control`; // DEFINE THE ELEMENT CLASS

    for (let i = 0; i < elements.length; i++) { // FOR EACH ELEMENT INTO THE ARRAY
        newElement.appendChild(elements[i]);
    }

    var newControl = new ol.control.Control({
        element: newElement
    });

    return newControl;
}


var btnPosition = document.createElement('button');
btnPosition.appendChild(newImg('./img/export.png'));
var customPosition = newCustomControl('custom_position', [btnPosition]);


var btnLegenda = document.createElement('button');
btnLegenda.appendChild(newImg('./img/camadasativas.png'));
var customLegenda = newCustomControl('custom_legenda', [btnLegenda]);

var btnMedir = document.createElement('button');
btnMedir.appendChild(newImg('./img/measure.png'));
var customArea = newCustomControl('custom_area', [btnMedir]);



var btnRaster = document.createElement('button');
btnRaster.appendChild(newImg('./img/basemap.svg'));
var customRaster = newCustomControl('custom_Raster', [btnRaster]);

var btnGrade = document.createElement('button');
btnGrade.appendChild(newImg('./img/grade.png'));
var customGrade = newCustomControl('custom_Grade', [btnGrade]);






var btnBaixar = document.createElement('button');
btnBaixar.appendChild(newImg('./img/baixar_black.png'));
var customBaixar = newCustomControl('custom_Baixar', [btnBaixar]);

var btnStyle = document.createElement('button');
btnStyle.appendChild(newImg('./img/color.png'));
var customStyle = newCustomControl('custom_Style', [btnStyle]);

var btnToolbox = document.createElement('button');
btnToolbox.appendChild(newImg('./img/tools.png'));
var customToolbox = newCustomControl('custom_Toolbox', [btnToolbox]);

var btnEditarLayer = document.createElement('button');
btnEditarLayer.appendChild(newImg('./img/editar.png'));
var customEditarLayer = newCustomControl('custom_EditarLayer', [btnEditarLayer]);

var btnAuxiliar = document.createElement('button');
btnAuxiliar.appendChild(newImg('./img/auxiliar.png'));
var customAuxiliar = newCustomControl('custom_auxiliar', [btnAuxiliar]);

var map = new ol.Map({
    layers: [

    ],
    controls: ol.control.defaults({ rotate: false }).extend([

        olRotate,
        customPosition,
        customLegenda,
        customArea,
        customRaster,
        customGrade,
        customBaixar,
        customStyle,
        customToolbox,
        customEditarLayer,
        customAuxiliar

    ]),
    target: 'map',
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [-45.96, -23.3],

        zoom: 8,
        minZoom: minZoom,
        maxZoom: 19

    })
});


function newVectorStyle(fill, stroke, width) {
    let style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: fill
        }),
        stroke: new ol.style.Stroke({
            width: width,
            color: stroke
        }),
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: fill
            }),
            stroke: new ol.style.Stroke({
                width: width,
                color: stroke
            }),
            radius: 7
        })
    });
    return style;
};



function createLabels(style, cor, contorno, largura, campo) {
    var text = new ol.style.Text({
        text: function (feature) { return feature.get(campo) },
        fill: new ol.style.Fill({ color: cor }),
        stroke: new ol.style.Stroke({ color: contorno, width: largura }),
        offsetX: -20,
        offsetY: 20
    })
    style.setText(text);
}






var btnDesenhar = document.createElement('button');
btnDesenhar.appendChild(newImg('./img/create.png'));
var customDesenhar = newCustomControl('custom_desenhar', [btnDesenhar]);
map.addControl(customDesenhar);







$('#popup').on('dblclick', () => {
    $('#popup').fadeOut();
})

var selected_style = newVectorStyle('rgba(47, 108, 241, 1)', 'rgb(0, 0, 255)', 2);
var situacaoOcorrencia;
var pt_clone = null;
function getFeatureId(pixel) {



    var feature = map.forEachFeatureAtPixel(pixel, function (feature) {

        $('#popup').empty();
        $('#popup').fadeIn();

        var f = feature.N;
        $('#popup').append(`<img src="img/fechar_vermelho.png" style="position: absolute;top: 1px;right: 1px;width: 20px;cursor: pointer;" onclick="closePopUpfromx()">`);
        $('#popup').append(`<h2 class="cat_teme" style="text-align: center;font-size : 14px;">${f.arquivo}</h2>`);
        for (var keys in f) {


            if (keys != "fotoDenuncia" && keys != "fotoOcorrencia" && keys != "geometry") {
                $('#popup').append(` <h2 class="cat_teme" style="font-size : 12px;">${keys} : </h2>
                        <input type="text" class="input" disabled value="${f[keys]}">`);
            } else if (keys == "fotoDenuncia" || keys == "fotoOcorrencia") {
                $('#popup').append(`<h2 class="cat_teme" style="font-size : 12px;">${keys} : </h2><div id="marker">
                <img src="data:image/png;base64, ${f[keys]}" id="fotoAtual">
            </div>`)

            }

        }

    });

}

function closePopUpfromx() {
    $('#popup').fadeOut();
}



var contBuffers = 1;
function bufferTool(pixel) {

    var tamanho_buffer = $('#tamanho_buffer').val();
    var tamanho_buffer_real = tamanho_buffer * 0.00000900900900900901;
    var feature = map.forEachFeatureAtPixel(pixel, function (feature) {

        // console.log(tamanho_buffer);
        var WKT = new ol.format.WKT();
        var WKTgeom = WKT.writeGeometry(feature.getGeometry());
        // console.log(WKTgeom.length);
        var url = `${host}/buffer`;

        openLoader();
        var abortAjax;
        var ajaxBuffer = $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ geom: WKTgeom, buffer: tamanho_buffer_real }),
            success: function (data) {
                var geom = data[0].geom;
                var featureFromWKT = WKT.readFeature(geom);
                // console.log(featureFromWKT);
                var source = new ol.source.Vector({});
                var layer = new ol.layer.Vector({
                    source: source,
                    zIndex: 2
                })
                source.addFeature(featureFromWKT);
                map.addLayer(layer);
                var obj = { 'camada': layer, 'nome': `Buffer_${contBuffers}_${tamanho_buffer}` };
                if (allVisibleLayers.layers.indexOf(obj) == -1) {

                    allVisibleLayers.layers.push(obj);
                }
                contBuffers++;
                closeLoader();
                clearTimeout(abortAjax);

            }
        })
        abortAjax = setTimeout(() => {
            ajaxBuffer.abort();
            closeLoader();
            alert('Tempo de conecção expirou, tente um buffer menor !');
        }, 15000);

        

    })
}

function getPerimetroToolActived(pixel) {
    map.forEachFeatureAtPixel(pixel, function (feature) {
        var casasdenicmais = $('#perimetroTool_casas_decimais').val();
        if (casasdenicmais == null && casasdenicmais < 0) {
            casasdenicmais = 1;
        }
        $('#toGetPerimeter').empty();
        var geom = feature.getGeometry();
        var length = ol.Sphere.getLength(geom);
        var output;
        length = length * 111000;
        if (length > 1000) {

            output = (length / 1000).toFixed(casasdenicmais) +
                ' ' + 'km';
        } else {
            output = length.toFixed(casasdenicmais) +
                ' ' + 'm';
        }
        $('#toGetPerimeter').append(`<h2 class="cat_teme">Perimetro : ${output} </h2>  `);

    })
}

var perimetroTool_aplicar = $('#perimetroTool_aplicar');
perimetroTool_aplicar.on('click', () => {
    perimetroToolActived = false;
    $('#perimetroToolTools').fadeOut();
    $(btnToolbox).css('border', 'none');
})


function getAreaToolActived(pixel) {
    map.forEachFeatureAtPixel(pixel, function (feature) {
        var casasdenicmais = $('#areaTool_casas_decimais').val();
        if (casasdenicmais == null && casasdenicmais < 0) {
            casasdenicmais = 1;
        }
        $('#toGetarea').empty();
        var geom = feature.getGeometry();
        var area = ol.Sphere.getArea(geom);
        var output;
        area = area * 12321000000;
        if (area > 1000) {
            output = (area / 1000).toFixed(casasdenicmais) +
                ' ' + 'km<sup>2</sup>';
        } else {
            output = (area).toFixed(casasdenicmais) +
                ' ' + 'm<sup>2</sup>';
        }

        $('#toGetarea').append(`<h2 class="cat_teme">Area : ${output} </h2>  `);


    })


}

function getRotuloToolActived(pixel) {
    map.forEachFeatureAtPixel(pixel, function (feature) {
        var feature = feature;
        $('#rotularTools_layers_campos').empty();
        for (var keys in feature.N) {
            $('#rotularTools_layers_campos').append(`<option value="${keys}">${keys}</option>`);

        }
        feature2Rotular = feature;

    })

}

var areaTool_aplicar = $('#areaTool_aplicar');
areaTool_aplicar.on('click', () => {
    areaToolActived = false;
    $('#areaToolTools').fadeOut();
    $(btnToolbox).css('border', 'none');
})
var desenharActived = false;
map.on('click', function (evt) {

    if (toolbox_buffer == true) {
        bufferTool(evt.pixel);

    } else if (toolbox_editarAttr == true) {
        $('#editarAttrTools').css('display', 'none');
        editarAttr(evt.pixel);
    } else if (perimetroToolActived == true) {
        getPerimetroToolActived(evt.pixel);

    } else if (areaToolActived == true) {
        getAreaToolActived(evt.pixel);
    } else if (rotularToolActived == true) {
        getRotuloToolActived(evt.pixel);

    } else if (add_arquivoToolActived == true) {
        add_fileToolActived(evt.pixel, evt.coordinate);

    } else if (acessar_arquivoToolActived == true) {
        acessar_fileToolActived(evt.pixel);

    }
    else {
        if (buscarInteracionOpened == false && desenharInteracionOpened == false && medirInteracionOpened == false) {
            $('#popup').css('display', 'none');
            getFeatureId(evt.pixel);
        }
    }


});




$(btnToolbox).on('click', () => {
    setAllToolsNull();
    removeBuscarInteraction();
    removeDesenharInteraction();
    removeMedirInteracion();
    if ($('#toolboxTools').css('display') == 'none') {
        $('#toolboxTools').fadeIn();
        removeBuscarInteraction();
        removeDesenharInteraction();
        removeMedirInteracion();
        $(btnToolbox).css('border', '1px solid #51fa02');



    } else {
        $('#toolboxTools').fadeOut();
        $(btnToolbox).css('border', 'none');
    }

})

var toolbox_tools_buttom = $('#toolbox_tools_buttom');

toolbox_tools_buttom.on('click', () => {
    var tool = $('#toolbox_tools').val();
    if (tool == "buffer") {
        $('#toolboxTools').css('display', 'none');
        $('#bufferTools').fadeIn();
        toolbox_buffer = true;

    } else if (tool == "editarAttr") {
        $('#toolboxTools').css('display', 'none');

        toolbox_editarAttr = true;
    } else if (tool == "perimetroTool") {
        perimetroToolActived = true;
        $('#toolboxTools').css('display', 'none');
        $('#perimetroToolTools').fadeIn();
    } else if (tool == "areaTool") {
        areaToolActived = true;
        $('#toolboxTools').css('display', 'none');
        $('#areaToolTools').fadeIn();
    } else if (tool == "rotular") {
        rotularToolActived = true;
        $('#rotularTools_layers_campos').empty();
        $('#toolboxTools').css('display', 'none');
        $('#rotularTools').fadeIn();
        $('#rotularTools_layers').empty();
        $('#toolboxTools').css('display', 'none');


    } else if (tool == "add_arquivo") {
        add_arquivoToolActived = true;
        $('#toolboxTools').css('display', 'none');


    } else if (tool == "acessar_arquivo") {
        acessar_arquivoToolActived = true;
        $('#toolboxTools').css('display', 'none');



    }
})





var rotularTools_aplicar = $('#rotularTools_aplicar');
rotularTools_aplicar.on('click', () => {
    var campo = $('#rotularTools_layers_campos').val();

    var f = feature2Rotular;
    //console.log(f);

    var js = `var texto = f.N.${campo};`;
    eval(js);
    // console.log(texto);
    if (f.getStyle() == null) {
        var style = newVectorStyle('#2929293d', '#10c7e7d2', 2);
        f.setStyle(style);

    }
    var colorFeature = f.getStyle().Xa.b;
    var contorno = f.getStyle().Ya.a;
    var largura = f.getStyle().Ya.c;

    var newStyleLabel = newVectorStyle(colorFeature, contorno, largura);
    newStyleLabel.setText(new ol.style.Text({
        text: `${campo} : ${texto}`,
        font: '28px Calibri,sans-serif',
        fill: new ol.style.Fill({ color: 'black' }),
        stroke: new ol.style.Stroke({ color: 'white', width: 2 }),
        offsetX: -20,
        offsetY: 20,
        zIndex: 30


    }))
    f.setStyle(newStyleLabel);

    $('#rotularTools').fadeOut();
    setAllToolsNull();

})


var bufferTools_aplicar = $('#bufferTools_aplicar');
bufferTools_aplicar.on('click', () => {
    $('#bufferTools').fadeOut();
    $(btnToolbox).css('border', 'none');
    toolbox_buffer = false;
})
var editedCamada;
$(btnEditarLayer).on('click', () => {
    editedCamada = null;
    if ($('#editarTools').css('display') == 'none') {
        $(btnEditarLayer).css('border', '1px solid #51fa02');
        $('#editarTools').fadeIn();
        $('#editar_layers').empty();
        removeMedirInteracion();

        if (allVisibleLayers.layers.length > 0) {

            for (var i = 0; i < allVisibleLayers.layers.length; i++) {
                $('#editar_layers').append(`<option value='${allVisibleLayers.layers[i].nome}'>${allVisibleLayers.layers[i].nome}</option>`);
            }
        }
    } else {
        $('#editarTools').fadeOut();
        $(btnEditarLayer).css('border', 'none');
    }
})
var editarTools_aplicar = $('#editarTools_aplicar');
editarTools_aplicar.on('click', () => {
    var layer = $('#editar_layers').val();
    var camada;
    $(btnEditarLayer).css('border', 'none');


    for (var i = 0; i < allVisibleLayers.layers.length; i++) {
        if (layer == allVisibleLayers.layers[i].nome) {

            camada = allVisibleLayers.layers[i].camada;
            editedCamada = camada;

        }
    }
    var thisSource = camada.getSource();
    var modify = new ol.interaction.Modify({ source: thisSource });
    map.addInteraction(modify);
    snap = new ol.interaction.Snap({ source: thisSource });
    map.addInteraction(snap);
    $('#editarTools').fadeOut();

    modify.on('modifyend', function (e) {
        var features = e.features.getArray();
        //  console.log(features.length);
        for (var i = 0; i < features.length; i++) {
            var rev = features[i].getRevision();
            if (rev > 1) {
                featuresModified = features[i];
            }
        }
    });
    if (adminMOde == true) {

        $('#EditarAdminSalvar_div').fadeIn();
    }
})


$(btnLegenda).on('click', () => {

    if (allVisibleLayers.layers.length > 0) {

        for (var i = 0; i < allVisibleLayers.layers.length; i++) {
            if (layersLegenda.indexOf(allVisibleLayers.layers[i].nome) == -1) {
                $('#map_layers').append(`<label class="control control-checkbox">
                    ${allVisibleLayers.layers[i].nome}
            <input type="checkbox" checked="checked" class="LayerChecked" name="${allVisibleLayers.layers[i].nome}" />
            <div class="control_indicator">
            
            </div>
        </label>`);
                layersLegenda.push(allVisibleLayers.layers[i].nome);
            }
        }
    }

    if ($('#map_layers').css('display') == "none") {


        // allPopUpsOpened.push($('#map_layers').attr('id'));
        $(btnLegenda).css('border', '1px solid #51fa02');
        $('#map_layers').fadeIn();
    } else {
        $(btnLegenda).css('border', 'none');
        $('#map_layers').fadeOut();




    }

});



$(document).on("click", ".LayerChecked", function (event) {
    var input = event.currentTarget;
    var layer = input.name;
    var layerVisibility = input.checked;
    for (var i = 0; i < allVisibleLayers.layers.length; i++) {
        if (layer == allVisibleLayers.layers[i].nome) {
            if (layer == "Medições") {
                removeMedirInteracion();
                if (layerVisibility == false) {
                    map.removeLayer(allVisibleLayers.layers[i].camada);
                    $('.tooltip-static').fadeOut();
                } else {
                    map.addLayer(allVisibleLayers.layers[i].camada);
                    $('.tooltip-static').fadeIn();
                }
            } else {
                if (layerVisibility == false) {
                    map.removeLayer(allVisibleLayers.layers[i].camada);
                } else {
                    map.addLayer(allVisibleLayers.layers[i].camada);
                }
            }
        }
    }
    var LayersLegenda = $('.LayerChecked');
    var allDisabled = true;

    setTimeout(() => {
        for (var j = 0; j > LayersLegenda.length; j++) {
            if (layersLegenda[j].checked == true) {
                allDisabled = false;
            }
        }

        if (allDisabled == true) {
            // selectedsLayer.getSource().removeFeature(pt_clone);
            // pt_clone = null;
            $('#info_div').empty();
            $('#info_div').append(`<h2 class="flex_box">INFORMAÇÕES:</h2>`);
            $('#popup').fadeOut();
            $('#popup').empty();

        }
    }, 50);

});

var dragableElement;
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var PossibleDraggableElements = ['inputVector', 'inputRaster', 'StatsTools', 'buscarTools',
    'MeasuringTool', 'editarTools', 'editarAttrTools', 'areaToolTools',
    'perimetroToolTools', 'rotularTools', 'toolboxTools', 'styleTools',
    'popup', 'map_layers', 'desenharVector', 'gradeTools', 'bufferTools',
    'createCamps', 'add_arquivoTools', 'acessar_arquivoTools', 'cadastroTela', 'mapa_meta_ortofoto', 'mapaAuxiliar',
    'coordinates'];

for (var element of PossibleDraggableElements) {
    var js = `$('#${element}').on('dragstart', (event)=>{
       // console.log('start');
        dragableElement = document.getElementById('${element}');
        pos3 = event.clientX;
        pos4 = event.clientY;
        
    
     });
     $('#${element}').on('dragend', ()=>{
        
        ondragEnd(event);
    
     });`;
    eval(js);
}


function ondragEnd(evt) {
    pos1 = pos3 - evt.clientX;
    pos2 = pos4 - evt.clientY;
    pos3 = evt.clientX;
    pos4 = evt.clientY;

    dragableElement.style.top = (dragableElement.offsetTop - pos2) + "px";
    dragableElement.style.left = (dragableElement.offsetLeft - pos1) + "px";


}

var sourceMedir = new ol.source.Vector();
var medirstyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(12, 243, 23, 0.205)'
    }),
    stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
    }),
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
            color: '#ffcc33'
        })
    }),

})
var vectorMedir = new ol.layer.Vector({
    source: sourceMedir,
    style: medirstyle,
    zIndex: 30
});

map.addLayer(vectorMedir);



/**
 * Currently drawn feature.
 * @type {ol.Feature}
 */
var sketch;


/**
 * The help tooltip element.
 * @type {Element}
 */
var helpTooltipElement;


/**
 * Overlay to show the help messages.
 * @type {ol.Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement;


/**
 * Overlay to show the measurement.
 * @type {ol.Overlay}
 */
var measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click para continuar a medir';


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Click para continuar a medir';


/**
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt The event.
 */
var pointerMoveHandler = function (evt) {
    if (evt.dragging) {
        return;
    }
    /** @type {string} */
    var helpMsg = 'Click para começar a medir ';

    if (sketch) {
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
            helpMsg = continuePolygonMsg;
        } else if (geom instanceof ol.geom.LineString) {
            helpMsg = continueLineMsg;
        }
    }

    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);

    helpTooltipElement.classList.remove('hidden');
};



var typeSelect = document.getElementById('type');

var draw; // global so we can remove it later

/**
 * Format length output.
 * @param {ol.geom.LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function (line) {

    var length = ol.Sphere.getLength(line);
    var output;
    length = length * 111000;
    if (length > 1000) {
        output = Math.round(length / 1000) +
            ' ' + 'km';
    } else {
        output = Math.round(length) +
            ' ' + 'm';
    }
    return output;
};

/**
 * Format area output.
 * @param {ol.geom.Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
var formatArea = function (polygon) {
    var area = ol.Sphere.getArea(polygon);
    var output;
    area = area * 12321000000;
    if (area > 1000) {
        output = Math.round(area / 1000) +
            ' ' + 'km<sup>2</sup>';
    } else {
        output = Math.round(area) +
            ' ' + 'm<sup>2</sup>';
    }
    return output;

};

function addInteraction() {
    var type = (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
    medirInteraction = new ol.interaction.Draw({
        source: sourceMedir,
        type: type,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(243, 66, 12, 0.245)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });
    map.addInteraction(medirInteraction);

    createMeasureTooltip();

    createHelpTooltip();
    var rotuloArea;
    var listener;
    medirInteraction.on('drawstart',
        function (evt) {
            // set sketch
            sketch = evt.feature;

            /** @type {ol.Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                    output = formatArea(geom);
                    rotuloArea = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    output = formatLength(geom);
                    rotuloArea = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        }, this);

    medirInteraction.on('drawend',
        function () {
            measureTooltipElement.className = 'tooltip tooltip-static';
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureTooltipElement = null;
            createMeasureTooltip();
            ol.Observable.unByKey(listener);

        }, this);

}


function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);

}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);

}


/**
 * Let user change the geometry type.
 */
typeSelect.onchange = function () {
    map.removeInteraction(medirInteraction);
    addInteraction();
};



desenharActived = false;
$(btnMedir).on('click', () => {
    removeBuscarInteraction();
    removeDesenharInteraction();
    setAllToolsNull();
    $(btnToolbox).css('border', 'none');
    map.removeInteraction(desenhar);
    map.on('pointermove', pointerMoveHandler);
    map.getViewport().addEventListener('mouseout', function () {
        helpTooltipElement.classList.add('hidden');
    });
    if (allVisibleLayers.layers.indexOf(obj) == -1) {
        var obj = { 'camada': vectorMedir, 'nome': 'Medições' };
        allVisibleLayers.layers.push(obj);
    }

    if (medirInteracionOpened == false) {
        medirInteracionOpened = true;
        addInteraction();
        map.addOverlay(measureTooltip);
        map.addOverlay(helpTooltip);
        $('#MeasuringTool').fadeIn();
        $(btnMedir).css('border', '1px solid #51fa02');

    } else {
        removeMedirInteracion();
    }
})

function removeMedirInteracion() {
    medirInteracionOpened = false;
    map.removeInteraction(medirInteraction);
    map.removeOverlay(measureTooltip);
    map.removeOverlay(helpTooltip);
    $('#MeasuringTool').fadeOut();
    $(btnMedir).css('border', 'none');
}


var sourcedesenhar = new ol.source.Vector();

var vectorDesenhar = new ol.layer.Vector({
    source: sourcedesenhar,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(51, 139, 255,0.3)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgb(6, 68, 148)',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    }),
    zIndex: 2
});

map.addLayer(vectorDesenhar);
var desenhar_style = newVectorStyle('rgba(47, 108, 241, 0.548)', 'rgb(0, 0, 255)', 4);
var desenhar = new ol.interaction.Draw({
    type: 'Polygon',
    source: vectorDesenhar.getSource(),
    style: desenhar_style,
    freehand: true
});


var DrawActived = false;

var mapHadDesenharInteraction = false;
var desenharOpen2save = false;
var allLayersDesenhados = [];

function removeDesenharInteraction() {
    desenharInteracionOpened = false;
    map.removeInteraction(desenharInteraction);
    $(btnDesenhar).css('border', 'none');
    $('#desenharVector').fadeOut();
    mapHadDesenharInteraction = false;
    btnDesenhar.children[0].src = "./img/create.png";
    desenharOpen2save = false;
}

$(btnDesenhar).on('click', () => {

    if (desenharOpen2save == true) {
        removeDesenharInteraction();
    } else {


        if (desenharInteracionOpened == false) {
            $('#desenharVector').fadeIn();
            $(btnDesenhar).css('border', '1px solid #51fa02');
            allCampos2Features = [];
            desenharInteracionOpened = true;
            removeBuscarInteraction();
            removeMedirInteracion();
        } else {
            $('#desenharVector').fadeOut();
            $(btnDesenhar).css('border', 'none');
            desenharInteracionOpened = false;
        }
    }
})

var tipo_desenhar = $('#tipo_desenhar');
tipo_desenhar.on('change', () => {
    if ($(tipo_desenhar).val() == "LineString") {
        $('#tituloCor').css('display', 'none');
        $('#cor_layer_desenhar').css('display', 'none');

    } else {
        $('#tituloCor').css('display', 'block');
        $('#cor_layer_desenhar').css('display', 'block');
    }
})

var desenhar_vector_buttom = $('#desenhar_vector_buttom');
var desenhadaFeature;
desenhar_vector_buttom.on('click', () => {

    refleshLegenda();
    if (mapHadDesenharInteraction == true) {
        map.removeInteraction(desenharInteraction);
        mapHadDesenharInteraction = false;
    }
    var tipo = $(tipo_desenhar).val();
    var modo_desenhar = $('#modo_desenhar').val();
    var cor_layer_desenhar = $('#cor_layer_desenhar').val();
    var cont_layer_desenhar = $('#cont_layer_desenhar').val();
    var largura_linha_desenhar = $('#largura_linha_desenhar').val();
    var nomeLayer_desenhar = $('#nomeLayer_desenhar').val();


    var layerDesenharName = `layer_${nomeLayer_desenhar}`;
    var sourcerDesenharLayer = `source_${nomeLayer_desenhar}`;
    var nomePermitido;
    for (var i in allLayersDesenhados) {
        if (allLayersDesenhados[i] == nomeLayer_desenhar) {
            nomePermitido = false;
        } else {
            nomePermitido = true;
        }
    }
    if (nomeLayer_desenhar.trim() == "" || nomePermitido == false) {
        alert('Nome do layer invalido.Por favor, digite outro.');

    } else {

        if (tipo == "Polygon") {
            cor_layer_desenhar = cor_layer_desenhar + "3d";
        }

        eval(`

    var sourcerDesenharLayer = new ol.source.Vector();

    var layerDesenharName = new ol.layer.Vector({
        source: sourcerDesenharLayer,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: cor_layer_desenhar
            }),
            stroke: new ol.style.Stroke({
                color: cont_layer_desenhar,
                width: largura_linha_desenhar
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: cor_layer_desenhar
                })
            })
        }),
        zIndex:2
    });
    map.addLayer(layerDesenharName);
    var obj = { "camada": layerDesenharName, "nome": nomeLayer_desenhar };
        allVisibleLayers.layers.push(obj);
`);


        var freehand;
        if (modo_desenhar == "livre") {
            freehand = true;
        } else {
            freehand = false;
        }


        var desenhar_style = newVectorStyle(cor_layer_desenhar, cont_layer_desenhar, largura_linha_desenhar);
        desenharInteraction = new ol.interaction.Draw({
            type: tipo,
            source: sourcerDesenharLayer,
            style: desenhar_style,
            freehand: freehand
        });

        map.addInteraction(desenharInteraction);
        mapHadDesenharInteraction = true;
        $('#desenharVector').fadeOut();
        desenharInteracionOpened = true;
        btnDesenhar.children[0].src = "./img/save.png";
        $(btnDesenhar).css('border', '1px solid #51fa02');
        desenharOpen2save = true;
        allLayersDesenhados.push(nomeLayer_desenhar);

    }
    desenharInteraction.on('drawend', (event) => {
        desenhadaFeature = event.feature;

        var createCamps = $('#createCamps_campos');
        createCamps.empty();

        if (allCampos2Features.length > 0) {
            for (var i = 0; i < allCampos2Features.length; i++) {

                createCamps.append(`<h2 class="cat_teme">${allCampos2Features[i].campo}</h2>
                <input type="${allCampos2Features[i].tipo}" id="${allCampos2Features[i].campo}" placeholder="valor..." class="sel_teme_white" style="color:gray;">`);
            }

            map.on('click', (event) => {
                var x = event.pixel[0];
                var y = event.pixel[1];
                $('#createCamps').css({ 'top': y, 'left': x });

            })

            $('#createCamps').fadeIn();
            $('#createCampsBack').fadeIn();

        }

    })



    $('#nomeLayer_desenhar').val("");
    $('#nomedocampo').val("");

})
var createCamps_buttom = $('#createCamps_buttom');
createCamps_buttom.on('click', () => {
    $('#allCampos').empty();
    for (var i = 0; i < allCampos2Features.length; i++) {
        var attr = $(`#${allCampos2Features[i].campo}`).val();
        var campo = allCampos2Features[i].campo;

        var exec = `desenhadaFeature.setProperties({${campo}:'${attr}'});`;
        eval(exec);
        $('#createCamps').fadeOut();
        $('#createCampsBack').fadeOut();


    }
})

var campos_vector_buttom = $('#campos_vector_buttom');
campos_vector_buttom.on('click', () => {
    var nomedocampo = $('#nomedocampo').val().trim();
    var TipoCampo = $('#TipoCampo').val();
    if (nomedocampo != " " || nomedocampo != "") {
        if (allCampos2Features.length > 1) {
            var campos = [];
            for (var i = 0; i < allCampos2Features.length; i++) {
                campos.push(allCampos2Features[i].campo);
            }

            if (campos.indexOf(nomedocampo) != -1) {
                alert('Este campo ja existe !');
            } else {
                var obj = { campo: nomedocampo, tipo: TipoCampo };

                allCampos2Features.push(obj);
                $('#allCampos').append(`<h2 class="cat_teme">${nomedocampo} : ${TipoCampo}</h2>`);
            }

        } else {
            var obj = { campo: nomedocampo, tipo: TipoCampo };
            allCampos2Features.push(obj);
            $('#allCampos').append(`<h2 class="cat_teme">${nomedocampo} : ${TipoCampo}</h2>`);
        }



    }


})


var sourceBuscar = new ol.source.Vector();

var vectorBuscar = new ol.layer.Vector({
    source: sourceBuscar,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(235, 127, 39,0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(235, 127, 39,0.7)',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: 'rgba(235, 127, 39,0.7)'
            })
        })
    }),
    zIndex: 31
});

map.addLayer(vectorBuscar);

var buscar_style = newVectorStyle('rgba(235, 127, 39,0.2)', 'rgba(235, 127, 39,0.7)', 4);
buscarInteraction = new ol.interaction.Draw({
    type: 'Polygon',
    source: vectorBuscar.getSource(),
    style: buscar_style,
    freehand: false
});
var buscarTools = $('#buscarTools');
var BuscarActived = false;



function removeBuscarInteraction() {
    $(buscarTools).fadeOut();
    map.removeInteraction(buscarInteraction);
    buscarInteracionOpened = false;

}



var busca_desenhar_cat_sel = $('#busca_desenhar_cat_sel');

busca_desenhar_cat_sel.on('change', () => {
    if ($(busca_desenhar_cat_sel).val() == "Meio_Ambiente") {
        $('#busca_desenhar_sel').empty();
        var optionSMA = `<option value="Limpeza Publica">Limpeza Publica</option>
<option value="Coleta de Residuos">Coleta de Residuos</option>
<option value="Meio Ambiente">Meio Ambiente</option>
<option value="Proteção Animal">Proteção Animal</option>                
<option value="Todas">Todas</option>`;
        $('#busca_desenhar_sel').append(optionSMA);

    } else {
        $('#busca_desenhar_sel').empty();
        var optionSG = `<option value="Iluminacao Pública">Iluminação Pública</option>
<option value="Manutenção De Vias Públicas">Manutenção De Vias Publicas</option>
<option value="Mobilidade Urbana">Mobilidade Urbana</option>
<option value="Ônibus">Ônibus</option>
<option value="Ouvidoria">Ouvidoria</option>
<option value="Proteção Animal">Proteção Animal</option>
<option value="SAAE">SAAE</option>
<option value="Todas">Todas</option>`;
        $('#busca_desenhar_sel').append(optionSG);
    }
})




var vectorResultBuscar = new ol.source.Vector({
});

var LayerResultBuscar = new ol.layer.Vector({
    source: vectorResultBuscar,
    style: newVectorStyle("5f2727e3", "#eb0808e3", 3),
    zIndex: 32


});



map.addLayer(LayerResultBuscar);
map.removeLayer(vectorBuscar);
map.addLayer(vectorBuscar);




function createFeaturesFromJSON(json, tb, nome) {


    var source = new ol.source.Vector({});
    var layer = new ol.layer.Vector({
        source: source,
        style: newVectorStyle('#2929293d', '#10c7e7d2', 2),
        zIndex: 2
    })
    var WKT = new ol.format.WKT();

    for (var f of json) {
        //console.log(f);
        var featureFromText = WKT.readFeature(f.geometry);

        for (var keys in f) {
            if (keys != "geom" && keys != "geometry") {

                try {
                    var js = `featureFromText.setProperties({${keys}:'${f[keys]}'});`;
                    eval(js);
                } catch{

                }

            }

        }
        featureFromText.setProperties({ arquivo: "Consulta" });
        //console.log(featureFromText);
        source.addFeature(featureFromText);

    }


    var obj = { 'camada': layer, 'nome': nome, 'tb': tb };

    var feature = layer.getSource().getFeatures();
    var geometry = feature[0].getGeometry();
    var extent = geometry.getExtent();


    allVisibleLayers.layers.push(obj);
    map.addLayer(layer);
    // console.log(layer);



}





function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var loader = $('#loaderBack');
async function openLoader() {
    loader.fadeIn();
    $(loader).on('mousemove', (event) => {

        $("#carregando").css({ 'top': event.clientY + 10, 'left': event.clientX + 20, 'display': 'block' });

    })







    $(`#carregando`).empty();
    $(`#carregando`).append(`Carregando`);




}
function closeLoader() {
    loader.fadeOut();
    $("#carregando").fadeOut();

}


function addImage2Map(file, titulo, xmax, ymax, xmin, ymin) {

    var layer = new ol.layer.Image({
        opacity: 1,
        title: titulo,

        source: new ol.source.ImageStatic({
            url: file,

            projection: 'EPSG:4326',

            imageExtent: [xmax, ymax, xmin, ymin]
        })
    });

    map.addLayer(layer);

}
var Agd;
var labels = ['LayersLabel', 'MapaBaseLabel', 'GradeLabel', 'AddGeoJSONLabel', 'EstatisticasLabel',
    'buscarLabel', 'criarLabel', 'downloadLabel', 'medirLabel', 'exportarLabel', 'estiloLabel',
    'ferramentasLabel', 'editarLabel', 'consoleLabel', 'admLabel', 'menu_btn',
    'ajuda_btn'];

function makeLabelsBlack() {

    for (var l of labels) {
        var js = `$('#${l}').css('color','#262525bf');`;
        eval(js);

    }
}
function makeLabelsWhite() {
    for (var l of labels) {
        var js = `$('#${l}').css('color','white');`;
        eval(js);
    }
}


var inputRaster = $('#inputRaster');
$(btnRaster).on('click', () => {
    if ($(inputRaster).css('display') == 'none') {
        $(btnRaster).css('border', '1px solid #51fa02');
        inputRaster.fadeIn();
    } else {
        inputRaster.fadeOut();
        $(btnRaster).css('border', 'none');
    }

});

var basemap;
var basemapInit = new ol.layer.Tile({
    visible: true,
    preload: Infinity,
    source: new ol.source.BingMaps({
        key: 'AgDol3nJb3nKPr3wQlsLqzif5uWDKPymbNTDQAkFxiHlZf7GjiL7Da5Qg4EFqIn_',
        imagerySet: 'AerialWithLabels'
    })
});
map.addLayer(basemapInit);


$(raster_buttom).on('click', () => {
    var fundo = $('#imagem_fundo').val();
    if (fundo == "OSM") {
        try {
            basemap = new ol.layer.Tile({
                source: new ol.source.OSM(),
                zIndex: 1
            })
            map.addLayer(basemap);
        } catch{
            console.log('erro no basemap');
        }

    }
    if (fundo == "Road" || fundo == "RoadOnDemand" || fundo == "OSM") {
        makeLabelsBlack();
    } else {
        makeLabelsWhite();
    }
    basemap = new ol.layer.Tile({
        visible: true,
        preload: Infinity,
        source: new ol.source.BingMaps({
            key: 'AgDol3nJb3nKPr3wQlsLqzif5uWDKPymbNTDQAkFxiHlZf7GjiL7Da5Qg4EFqIn_',
            imagerySet: fundo
        })
    });
    map.addLayer(basemap);
    map.removeLayer(basemapInit);

    $('#inputRaster').fadeOut();
    $(btnRaster).css('border', 'none');


})

var rasterImg;

function setGrade(bool) {
    if (bool == 1) {
        graticule.setMap(map);
    } else {
        graticule.setMap(null);
    }
}

var style_aplicar_grade_buttom = $('#style_aplicar_grade_buttom');
style_aplicar_grade_buttom.on('click', () => {
    var cor = $('#cor_layer_style_grade').val();
    var largura = $('#largura_linha_style_grade').val();
    var estilo = $('#largura_linha_type_grade').val();

    createGrade(cor, largura, estilo);
})
var graticule;
function createGrade(cor, largura, estilo) {
    if (graticule != null) {
        graticule.setMap(null);
    }
    if (largura != 0) {
        if (estilo == "solida") {
            estilo = [0.5, 0];
        } else {
            estilo = [0.5, 4];
        }
        graticule = new ol.Graticule({
            // the style to use for the lines, optional.
            strokeStyle: new ol.style.Stroke({
                color: cor,
                width: largura,
                lineDash: estilo
            }),
            showLabels: true
        });

        graticule.setMap(map);
    }

}
createGrade('rgb(12, 46, 132)', 2, "ponto");
$(btnGrade).on('click', () => {

    if ($('#gradeTools').css('display') == "none") {
        $('#gradeTools').fadeIn();
        $(btnGrade).css('border', '1px solid #51fa02');

    } else {
        $('#gradeTools').fadeOut();
        $(btnGrade).css('border', 'none');
    }



})




var vectorImg;

document.getElementById('input_img_vector').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            vectorImg = fr.result;
        }
        fr.readAsText(files[0]);
    }

    // Not supported
    else {
        alert('Ops, algo deu errado !');
    }
}






var vector_buttom = $('#vector_buttom');
$(vector_buttom).on('click', (event) => {
    var cor = $('#cor_vet_oc_geojson').val();
    var contorno = $('#cont_vet_oc_geojson').val();

    cor = cor + "3d";
    var largura = $('#largura_linha_geojson').val();
    try {
        var features = new ol.format.GeoJSON().readFeatures(vectorImg);
        var vectorSource = new ol.source.Vector({
        });
        var style = newVectorStyle(cor, contorno, largura);

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: style,
            zIndex: 2

        });



        vectorLayer.getSource().addFeatures(features);

        var nome = $('#nomeLayer_vector').val();
        map.addLayer(vectorLayer);

        var obj = { "camada": vectorLayer, "nome": nome };
        allVisibleLayers.layers.push(obj);
    } catch{
        alert('Ops, algo errado com o seu GeoJSON !');
    }

})


var statsdesenhar_cat_sel = $('#statsdesenhar_cat_sel');

$(statsdesenhar_cat_sel).on('change', (event) => {
    var secretaria = event.target.value;

    if (secretaria == "Governo") {

        var subcat = $('#statsdesenhar_sel_consulta');
        $(subcat).empty();
        $(subcat).append(` <option value="Quantidade de Denuncias">Quantidade de Ocorrencias</option>
       <option value="Denuncia resolvidas">Ocorrencias resolvidas</option>
       <option value="Denuncias mais frequentes">Categorias mais frequentes</option>
         `);
    } else {
        var subcat = $('#statsdesenhar_sel_consulta');
        $(subcat).empty();
        $(subcat).append(` <option value="Quantidade de Denuncias">Quantidade de Denuncias</option>
    <option value="Denuncia resolvidas">Denuncia resolvidas</option>
    <option value="Denuncias mais frequentes">Categorias mais frequentes</option>
     `);
    }
})






$(btnBaixar).on('click', () => {
    $(btnBaixar).css('border', '1px solid #51fa02');

    setTimeout(() => {
        var r = confirm(`Voce tem certeza que quer baixar todas as camdas que estão no Mapa ?`);
        refleshLegenda();
        if (r == true) {
            var t = prompt('Qual formato deseja ? [.html,.geojson]', '.geojson');
            var exportHtmlJSON = [];
            var allvisiblesJSON = $('.LayerChecked');
            for (var i of allvisiblesJSON) {
                if (i.checked == true) {
                    for (var j of allVisibleLayers.layers) {
                        console.log(i)
                        if (i.name == j.nome) {

                            exportHtmlJSON.push(j);
                            if (t.trim() == '.geojson') {
                                exportGeoJSON(j);
                            }


                        }
                    }
                }
            }
            if (t.trim() == '.html') {
                exportHTML(exportHtmlJSON);
            }

            //console.log(exportHtmlJSON);
        }
        setTimeout(() => {
            $(btnBaixar).css('border', 'none');
        }, 100)
    }, 100);
})

function exportHTML(array) {
    var htmlLayers = "";
    var html = `<!DOCTYPE html>
<html>

<head>
    <title>Mapa</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v4.6.5/css/ol.css" type="text/css">
    <!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <script src="https://openlayers.org/en/v4.6.5/build/ol.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
    <style>
        #Layers {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #eeeeeeb0;
            border: 1px solid #d3d2d2;
            width: 200px;
            height: 200px;
            overflow: auto;
            padding: 2px;

        }
    </style>
</head>

<body>
    <div id="map" class="map"></div>
    <div id="Layers">
        
    </div>
    <script>
        var allVisibleLayers = { layers: [] };



        function newVectorStyle(fill, stroke, width) {
            let style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: fill
                }),
                stroke: new ol.style.Stroke({
                    width: width,
                    color: stroke
                }),
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: fill
                    }),
                    stroke: new ol.style.Stroke({
                        width: width,
                        color: stroke
                    }),
                    radius: 7
                })
            });
            return style;
        };
      

          
          
    
            var map = new ol.Map({
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                    
                ],
                target: 'map',
                controls: ol.control.defaults({
                    attributionOptions: {
                        collapsible: false
                    }
                }),
                view: new ol.View({
            projection: 'EPSG:4326',
            center: [-45.96, -23.3],
    
            zoom: 10,           
            maxZoom: 19
    
        })
    });
    

  

`;
    //console.log(array);
    var jsonArray = { layers: [] };
    for (var layer of array) {
        var colorFeature;
        var contorno;
        var largura;
        var features = layer.camada.getSource().getFeatures();
        if (features[0].getStyle() != null) {
            colorFeature = features[0].getStyle().Xa.b;
            contorno = features[0].getStyle().Ya.a;
            largura = features[0].getStyle().Ya.c;
        } else {
            colorFeature = '#d3d2d29d';
            contorno = '#f70606';
            largura = 2;
        }


        if (features.length > 0) {
            var GJSON = new ol.format.GeoJSON();
            var newGeoJSON = {
                "type": "FeatureCollection",
                "name": "conectaJacarei",
                "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                "features": []
            }
            for (var i of features) {
                var featuresJSON = GJSON.writeFeatureObject(i);
                newGeoJSON.features.push(featuresJSON);

            }
            //console.log(JSON.stringify(newGeoJSON));
            htmlLayers = `${htmlLayers} var ${layer.nome.replace(/\-/g, '_')} = ${JSON.stringify(newGeoJSON)};

            var style${layer.nome.replace(/\-/g, '_')} = newVectorStyle('${colorFeature}','${contorno}',${largura});

            var vectorSource${layer.nome.replace(/\-/g, '_')} = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(${layer.nome.replace(/\-/g, '_')})
              });
        
              
        
              var vectorLayer${layer.nome.replace(/\-/g, '_')} = new ol.layer.Vector({
                source: vectorSource${layer.nome.replace(/\-/g, '_')},
                style : style${layer.nome.replace(/\-/g, '_')}
                
              });
              var obj = { 'camada': vectorLayer${layer.nome.replace(/\-/g, '_')}, 'nome': '${layer.nome.replace(/\-/g, '_')}' };
              allVisibleLayers.layers.push(obj);

              map.addLayer(vectorLayer${layer.nome.replace(/\-/g, '_')});
              
              

            `;

        }
    }
    html = `${html} 
    ${htmlLayers}

    $('#Layers').empty();
    for (var i = 0; i < allVisibleLayers.layers.length; i++) {
        $('#Layers').append('<input type="checkbox" class="camadas" name="'+allVisibleLayers.layers[i].nome+'" checked>'+allVisibleLayers.layers[i].nome);
    }
	
	  $('.camadas').on('click', (event) => {
            var input = event.currentTarget;
            var layer = input.name;
            var layerVisibility = input.checked;
            for (var i = 0; i < allVisibleLayers.layers.length; i++) {
                if (layer == allVisibleLayers.layers[i].nome) {

                    if (layerVisibility == false) {
                        map.removeLayer(allVisibleLayers.layers[i].camada);
                    } else {
                        map.addLayer(allVisibleLayers.layers[i].camada);
                    }

                }
            }
        })
        var graticule = new ol.Graticule({
            // the style to use for the lines, optional.
            strokeStyle: new ol.style.Stroke({
              color: 'rgba(255,120,0,0.9)',
              width: 2,
              lineDash: [0.5, 4]
            }),
            showLabels: true
          });
    
          graticule.setMap(map);
          

    </script>
</body>

</html>
    `;
    let link = document.createElement('a');
    link.setAttribute('download', `mapa.html`);
    link.href = makeTextFile(html);
    document.body.appendChild(link);

    window.requestAnimationFrame(function () {
        let event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });


    // var features = layer.camada.getSource().getFeatures();
    // if (features.length > 0) {
    //     var GJSON = new ol.format.GeoJSON();
    //     var newGeoJSON = {
    //         "type": "FeatureCollection",
    //         "name": "conectaJacarei",
    //         "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    //         "features": []
    //     }
    //     for (var i of features) {
    //         var featuresJSON = GJSON.writeFeatureObject(i);
    //         newGeoJSON.features.push(featuresJSON);

    //     }


    //     let link = document.createElement('a');
    //     link.setAttribute('download', `${layer.nome}.geojson`);
    //     link.href = makeTextFile(JSON.stringify(newGeoJSON));
    //     document.body.appendChild(link);

    //     window.requestAnimationFrame(function () {
    //         let event = new MouseEvent('click');
    //         link.dispatchEvent(event);
    //         document.body.removeChild(link);
    //     });
    // }
}


function exportGeoJSON(layer) {
    console.log(layer);

    var features = layer.camada.getSource().getFeatures();
    if (features.length > 0) {
        var GJSON = new ol.format.GeoJSON();
        var newGeoJSON = {
            "type": "FeatureCollection",
            "name": "conectaJacarei",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": []
        }
        for (var i of features) {
            var featuresJSON = GJSON.writeFeatureObject(i);
            newGeoJSON.features.push(featuresJSON);

        }


        let link = document.createElement('a');
        link.setAttribute('download', `${layer.nome}.geojson`);
        link.href = makeTextFile(JSON.stringify(newGeoJSON));
        document.body.appendChild(link);

        window.requestAnimationFrame(function () {
            let event = new MouseEvent('click');
            link.dispatchEvent(event);
            document.body.removeChild(link);
        });
    }
}

let textFile = null,
    makeTextFile = function (text) {
        var data = new Blob([text], { type: 'text/plain' });
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        return textFile;
    };

function refleshLegenda() {
    if (allVisibleLayers.layers.length > 0) {

        for (var i = 0; i < allVisibleLayers.layers.length; i++) {
            if (layersLegenda.indexOf(allVisibleLayers.layers[i].nome) == -1) {
                $('#map_layers').append(`<label class="control control-checkbox">
                        ${allVisibleLayers.layers[i].nome}
                <input type="checkbox" checked="checked" class="LayerChecked" name="${allVisibleLayers.layers[i].nome}" />
                <div class="control_indicator"></div>
            </label>`);
                layersLegenda.push(allVisibleLayers.layers[i].nome);
            }
        }
    }
}

var camada;
var campo_to_categorizar;

var layer = $('#layer_style');
$(layer).on('change', () => {
    if ($('#estilo_simples').css('display') == 'none') {
        $('#estilo_simples').fadeIn();
        $('#estilo_categoriazado').fadeOut();
        $('#valores_categoriazado').empty();
        $('#campos_categoriazado').empty();
    }

});
$(btnStyle).on('click', () => {
    $('#layer_style').empty();
    if ($('#styleTools').css('display') == "none") {
        $(btnStyle).css('border', '1px solid #51fa02');

        $(styleTools).fadeIn();
        $('#estilo_simples').fadeIn();
        $('#estilo_categoriazado').fadeOut();
    } else {
        $(styleTools).fadeOut();
        $(btnStyle).css('border', 'none');

    }
    for (var i = 0; i < allVisibleLayers.layers.length; i++) {
        $('#layer_style').append(`<option>${allVisibleLayers.layers[i].nome}</option>`);
    }
})

var tipo_de_estilo = $('#tipo_de_estilo');
tipo_de_estilo.on('change', () => {
    var val = $(tipo_de_estilo).val();
    if (val == "1") {
        $('#estilo_simples').fadeIn();
        $('#estilo_categoriazado').fadeOut();

    } else {
        $('#estilo_simples').fadeOut();
        $('#estilo_categoriazado').fadeIn();

        var layer = $('#layer_style').val();



        for (var i = 0; i < allVisibleLayers.layers.length; i++) {
            if (layer == allVisibleLayers.layers[i].nome) {

                camada = allVisibleLayers.layers[i].camada;

            }
        }
        var features = camada.getSource().getFeatures();
        // console.log(features);
        var fez = false;

        for (var f of features) {
            if (fez == false) {
                for (var keys in f.N) {
                    // $('#campos_categoriazado').append(`<option value='${keys}'>${keys}</option>`);
                    st = document.getElementById('campos_categoriazado');
                    var opt = document.createElement('option');
                    opt.value = keys;
                    opt.innerHTML = keys;
                    st.appendChild(opt);
                }
                fez = true;
            }
        }

    }
})

var campos_categorizados = $('#campos_categoriazado');
campos_categorizados.on('change', () => {
    var campo = $(campos_categorizados).val();
    campo_to_categorizar = campo;
    var features = camada.getSource().getFeatures();
    var allValues = [];
    for (var f of features) {
        for (var keys in f.N) {
            if (campo == keys) {
                if (allValues.indexOf(f.N[keys]) == -1) {
                    allValues.push(f.N[keys]);
                }

            }
        }
    }
    allValues.sort();
    var valores_categoriazado = $('#valores_categoriazado');
    $(valores_categoriazado).empty();
    for (var val of allValues) {
        $(valores_categoriazado).append(`<option value='${val}'>${val}</option>`)
    }

})
var style_aplicar_buttom_categorizado = $('#style_aplicar_buttom_categorizado');
style_aplicar_buttom_categorizado.on('click', () => {
    var attr = $(valores_categoriazado).val();
    var cor = $('#cor_layer_style_categoriazado').val();
    var contorno = $('#con_layer_style_categoriazado').val();
    var linha = $('#largura_linha_style_categoriazado').val();
    var style = newVectorStyle(cor + "3d", contorno, linha);
    var features = camada.getSource().getFeatures();
    for (var f of features) {
        for (var keys in f.N) {
            if (campo_to_categorizar == keys) {
                if (f.N[keys] == attr) {
                    f.setStyle(style);
                }

            }
        }
    }

})

var style_aplicar_buttom = $('#style_aplicar_buttom');

style_aplicar_buttom.on('click', () => {
    var layer = $('#layer_style').val();
    var cor = $('#cor_layer_style').val();
    var contorno = $('#con_layer_style').val();
    var linha = $('#largura_linha_style').val();

    var style = newVectorStyle(cor + "3d", contorno, linha);
    //console.log(cor);
    for (var i = 0; i < allVisibleLayers.layers.length; i++) {
        if (layer == allVisibleLayers.layers[i].nome) {
            var features = allVisibleLayers.layers[i].camada.getSource().getFeatures();
            for (var f of features) {
                f.setStyle(style);
            }

        }
    }
})



$(btnPosition).click(function () {
    $(btnPosition).css('border', '1px solid #51fa02');
    setTimeout(() => {
        map.once('postcompose', function (event) {

            var canvas = event.context.canvas;
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
            } else {
                canvas.toBlob(function (blob) {
                    saveAs(blob, 'map.png');
                });
            }
            $(btnPosition).css('border', 'none');
        });
        map.renderSync();
    }, 100);



});









function createLabeltoButtom(botao, label, left) {
    var js = `$(${botao}).on('mousemove',(evt)=>{
    $(${botao}).css('cursor','pointer');
    var label = $('#${label}');
    label.css('display','block');
    
    $(label).css('top',(evt.clientY-10)+"px");
    $(label).css('left',(evt.clientX + 10)+"px");

});
$(${botao}).on('mouseout',()=>{
    var label = $('#${label}');
    $(label).css('display','none');
    

});`;
    eval(js);
}
createLabeltoButtom('btnLegenda', 'LayersLabel', 100);
createLabeltoButtom('btnRaster', 'MapaBaseLabel', 110);
createLabeltoButtom('btnGrade', 'GradeLabel', 80);



createLabeltoButtom('btnDesenhar', 'criarLabel', 110);
createLabeltoButtom('btnBaixar', 'downloadLabel', 100);
createLabeltoButtom('btnMedir', 'medirLabel', 75);
createLabeltoButtom('btnPosition', 'exportarLabel', 175);
createLabeltoButtom('btnStyle', 'estiloLabel', 180);
createLabeltoButtom('btnToolbox', 'ferramentasLabel', 190);
createLabeltoButtom('btnEditarLayer', 'editarLabel', 150);
createLabeltoButtom('btnAuxiliar', 'auxiliar', 140);














var map_auxiliar;
var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    className: 'cat_teme_coor',
    target: document.getElementById('container1'),
    undefinedHTML: 'Longitude, Latitude'
});

map.addControl(mousePositionControl);

$(btnAuxiliar).on('click', () => {

    if ($('#mapaAuxiliar').css('display') == 'none') {
        $(btnAuxiliar).css('border', '1px solid #51fa02');
        $('#mapaAuxiliar').empty();
        $('#mapaAuxiliar').fadeIn();
        map_auxiliar = new ol.Map({
            layers: [],
            target: 'mapaAuxiliar',
            view: new ol.View({
                projection: 'EPSG:4326',
                center: [-45.96, -23.3],

                zoom: 15,
                minZoom: 10,
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

        var mapView = map.getLayerGroup();
        map_auxiliar.setLayerGroup(mapView);

        map_auxiliar.on('click', function (evt) {
            if (buscarInteracionOpened == false && desenharInteracionOpened == false && medirInteracionOpened == false) {
                $('#popup').css('display', 'none');
                getFeatureIdAuxiliar(evt.pixel);
            }
        })
        var graticule = new ol.Graticule({
            // the style to use for the lines, optional.
            strokeStyle: new ol.style.Stroke({
                color: 'rgb(12, 46, 132)',
                width: 2,
                lineDash: [0.5, 4]
            }),
            showLabels: true
        });

        graticule.setMap(map_auxiliar);


    } else {
        $(btnAuxiliar).css('border', 'none');
        $('#mapaAuxiliar').fadeOut();
    }

})







function getFeatureIdAuxiliar(pixel) {



    var feature = map_auxiliar.forEachFeatureAtPixel(pixel, function (feature) {

        $('#popup').empty();
        $('#popup').fadeIn();

        var f = feature.N;

        for (var keys in f) {


            if (keys != "fotoDenuncia" && keys != "fotoOcorrencia" && keys != "geometry") {
                $('#popup').append(` <h2 class="cat_teme">${keys} : </h2>
                        <input type="text" class="input" disabled value="${f[keys]}">`);
            } else if (keys == "fotoDenuncia" || keys == "fotoOcorrencia") {
                $('#popup').append(`<h2 class="cat_teme">${keys} : </h2><div id="marker">
                <img src="data:image/png;base64, ${f[keys]}" id="fotoAtual">
            </div>`)




            }

        }

    });

}

$('#fechariMetaFoto').on('click', () => {
    $('#mapa_meta_ortofoto').fadeOut();
})


$('#fechariInfoMObile').on('dblclick', () => {
    $('#fechariInfoMObile').fadeOut();
})
$('#Resp_div').on('dblclick', () => {
    $('#Resp_div').fadeOut();
})


$('#fechariInfoResp').on('click', () => {
    $('#Resp_div').fadeOut();
})






$('#container2').on('click', () => {
    var view = new ol.View({
        projection: 'EPSG:4326',
        center: [-45.96, -23.3],

        zoom: 13,
        minZoom: 4,
        maxZoom: 19

    })
    map.setView(view);
})






var contlayersconsulta = 0;
$('#queryToolBuscar').on('click', () => {


    var consulta = $('#queryTool').val().toLowerCase();
    var url = `${host}/executa/query?query=${consulta}`;
    var url = encodeURI(url);
    var abort;
    openLoader();
    var query = $.getJSON(url, (data) => {
        for (var l of allVisibleLayers.layers) {
            map.removeLayer(l.camada);
        }

        if (data.erro) {
            alert(data.erro);
        } else {
            if (consulta.indexOf("mapa") != -1) {
                createFeaturesFromJSON(data, consulta, "consulta");
                contlayersconsulta++;
            }

            $('#queryToolResult').empty();
            var colunas = [];
            var registros = "";
            var htmlColunas = `<table><tr>`;


            $.each(data[0], function (key, value) {
                colunas.push(key);

            });


            for (var i of colunas) {

                htmlColunas += `<th>${i}</th>`;


            }
            htmlColunas += `</tr>`;


            for (var i of data) {
                registros += `<tr>`;
                for (var j of colunas) {

                    if (i[j]) {
                        if (i[j].length > 35) {
                            registros += `<td>Dado muito grande</td>`
                        } else {
                            registros += `<td>${i[j]}</td>`
                        }
                    }



                }
                registros += `</tr>`;


            }


            var tabela = htmlColunas + registros + "</table>";
            //console.log(tabela);
            $('#queryToolResult').append(tabela);

        }
        clearTimeout(abort);
        closeLoader();


    }).fail(() => {
        clearTimeout(abort);
        closeLoader();
    })


    abort = setTimeout(() => {
        query.abort();
        closeLoader();
        alert('Tempo de espera expirado, verifique sua conexão !');
    }, 10000)
})


$('#tentevc').on('dragend', (event) => {

    if (event.offsetY < -100) {
        $('#abatutorials').fadeIn();
        $('#tentevc').css('display', 'none');
        $('#tutoriasCorpo').fadeOut();
        
    }
})


$('#abatutorials').on('dragend', (event) => {

    if (event.offsetY > 100) {
        $('#abatutorials').css('display', 'none');
        $('#tentevc').fadeIn();
        $('#tutoriasCorpo').fadeIn();
        
    }
})

function closeAllContentesDiv() {
    var divs = $('.divContent');
    for (var d of divs) {
        $(d).css('display', 'none');
    }
}

function openOneContentDiv(id) {
    closeAllContentesDiv();
    var js = `$('#${id}').css('display','block');`;
    eval(js);
}





$('#Base_tabelas').on('change', () => {

    var consulta = `select * from ${$('#Base_tabelas').val()}`;

    var url = `${host}/executa/query?query=${consulta}`;
    var url = encodeURI(url);
    var abort;
    openLoader();
    var query = $.getJSON(url, (data) => {
        for (var l of allVisibleLayers.layers) {
            map.removeLayer(l.camada);
        }

        if (data.erro) {
            alert(data.erro);
        } else {
            //console.log(data);
            if (consulta.indexOf("mapa") != -1) {
                createFeaturesFromJSON(data, consulta, "consulta");
                contlayersconsulta++;
            }

            $('#Base_result').empty();
            var colunas = [];
            var registros = "";
            var htmlColunas = `<table><tr>`;


            $.each(data[0], function (key, value) {
                colunas.push(key);

            });


            for (var i of colunas) {

                htmlColunas += `<th>${i}</th>`;


            }
            htmlColunas += `</tr>`;


            for (var i of data) {
                registros += `<tr>`;
                for (var j of colunas) {

                    if (i[j]) {
                        if (i[j].length > 35) {
                            registros += `<td>Dado muito grande</td>`
                        } else {
                            registros += `<td>${i[j]}</td>`
                        }
                    }



                }
                registros += `</tr>`;


            }


            var tabela = htmlColunas + registros + "</table>";

            $('#Base_result').append(tabela);

        }
        clearTimeout(abort);
        closeLoader();


    }).fail(() => {
        clearTimeout(abort);
        closeLoader();
    })


    abort = setTimeout(() => {
        query.abort();
        closeLoader();
        alert('Tempo de espera expirado, verifique sua conexão !');
    }, 10000)
})

$('#owbanco').on('click', () => {
    $('#owbanco_creds').slideToggle();

})


$('#owbanco_con').on('click', () => {
    var host = $('#owbanco_H').val();
    var usuario = $('#owbanco_U').val();
    var senha = $('#owbanco_S').val();
    var banco = $('#owbanco_B').val();
    var porta = $('#owbanco_P').val();

    var inputs = [];
    inputs.push(host);
    inputs.push(usuario);
    inputs.push(senha);
    inputs.push(banco);
    inputs.push(porta);

    for (var i of inputs) {
        if (validarInput(i) == "valorinvalido") {
            alert("Preencha todos os campos");
            return;
        }
    }

    var conection = {
        host: host,
        usuario: usuario,
        senha: senha,
        banco: banco,
        porta: porta
    }

    openLoader();
    var abortAjax;
    var ajaxBuffer = $.ajax({
        url: '/owbanco',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(conection),
        success: function (data) {
            clearTimeout(abortAjax);
            closeLoader();
            if (data.erro) {
                alert(data.erro);
            } else {

                meuBanco = conection;
                $('#owbanco_creds').slideToggle();
                $('#owbanco_H').val("");
                $('#owbanco_U').val("");
                $('#owbanco_S').val("");
                $('#owbanco_B').val("");
                $('#owbanco_P').val("");

                $('#Base_tabelas').empty();
                $('#Base_tabelas').append(`<option value="" selected disabled>Escolha a tabela</option>`);
                for (var t of data) {
                    $('#Base_tabelas').append(`<option value="${t.tablename}">${t.tablename}</option>`);
                }
            }
        }
    }).fail(() => {
        clearTimeout(abortAjax);
        closeLoader();
        alert('Error no envio de dados');
    })
    abortAjax = setTimeout(() => {
        ajaxBuffer.abort();
        closeLoader();
        alert('Tempo de conecção expirou !');
    }, 15000);




})




function validarInput(input) {
    if (!input) {
        return "valorinvalido";
    } else {
        var valor = input.trim();
        valor = myReplace(valor, "'", "");
        valor = myReplace(valor, '"', "");

        if (valor == " " || valor == null || valor == "") {
            return "valorinvalido";
        } else {

            return valor;

        }
    }

}

function myReplace(val, regex, replace) {
    var newString = val;
    while (newString.indexOf(regex) != -1) {
        newString = newString.substring(0, newString.indexOf(regex)) + replace + newString.substring(newString.indexOf(regex) + 1, newString.length);

    }

    return newString;
}

$('#queryToolBuscar').click();



var _checkInputsDinamicos = 0;
function setContent(div, titulo, consulta, colunas, linhas) {
    _checkInputsDinamicos++;
    $(div).append(`
    <br>
    <p>
        EXEMPLO : ${titulo}

    </p>
    
    <br>
    <textarea class="input-consulta" cols="${colunas}" rows="${linhas}" emit="${_checkInputsDinamicos}" spellcheck="false">
    ${consulta}
    </textarea>
    <span>Altere a consulta e aperte Enter</span>
    <div class="input-consulta-result" submit="${_checkInputsDinamicos}">                
    </div>

    
    `)
}




var startContentsActions = () => {

    allQueryInputs = $('.input-consulta');
    allQueryResults = $('.input-consulta-result');

    for (var input of allQueryInputs) {
        $(input).on('keyup', (event) => {

            if (event.key == "Enter") {
                let emited = $(event.currentTarget).attr('emit');
                let reciever;
                for (var r of allQueryResults) {

                    if ($(r).attr('submit') == emited) {
                        reciever = r;
                        break;
                    }
                }

                let val = $(event.currentTarget).val();
                var consulta = val;
                var url = `${host}/executa/query?query=${consulta}`;
                var url = encodeURI(url);
                var abort;
                openLoader();
                var query = $.getJSON(url, (data) => {

                    if (data.erro) {
                        alert(data.erro);
                    } else {
                        $(reciever).empty();
                        var colunas = [];
                        var registros = "";
                        var htmlColunas = `<table><tr>`;


                        $.each(data[0], function (key, value) {
                            colunas.push(key);

                        });


                        for (var i of colunas) {

                            htmlColunas += `<th>${i}</th>`;


                        }
                        htmlColunas += `</tr>`;


                        for (var i of data) {
                            registros += `<tr>`;
                            for (var j of colunas) {

                                if (i[j]) {
                                    if (i[j].length > 35) {
                                        registros += `<td>Dado muito grande</td>`
                                    } else {
                                        registros += `<td>${i[j]}</td>`
                                    }
                                }



                            }
                            registros += `</tr>`;


                        }


                        var tabela = htmlColunas + registros + "</table>";

                        $(reciever).append(tabela);

                    }
                    clearTimeout(abort);
                    closeLoader();


                }).fail(() => {
                    clearTimeout(abort);
                    closeLoader();
                })


                abort = setTimeout(() => {
                    query.abort();
                    closeLoader();
                    alert('Tempo de espera expirado, verifique sua conexão !');
                }, 10000)
            }

        })
    }
}


var startContents = () => {

    setContent(
        $('#div4'), "Consulta para listar todos os campos da tabela tb_produto",
        "SELECT * FROM tb_produto limit 10", 50, 2
    );

    setContent(
        $('#div4'), "Consultar apenas os nomes dos produtos da tabela tb_produto",
        "SELECT produto FROM tb_produto limit 10", 50, 2
    );

    setContent(
        $('#div4'), "Consultar o produto com o maior preço",
        "SELECT max(preco) FROM tb_produto", 50, 2
    );

    setContent(
        $('#div4'), "Consultar o produto com o menor preço",
        "SELECT min(preco) FROM tb_produto", 50, 2
    );

    setContent(
        $('#div4'), "Consultar a media de preços",
        "SELECT avg(preco) FROM tb_produto", 50, 2
    );

    setContent(
        $('#div4'), "Consultar o número de produtos",
        "SELECT count(*) FROM tb_produto", 50, 2
    );

    setContent(
        $('#div5'), "Consultar a quantidade do produto em estoque",
        `  
    SELECT a.produto, b.quantidade 
    FROM tb_produto as a, tb_estoque as b 
    WHERE a.codigo = b.codigo limit 10`,
        50, 5
    );

    setContent(
        $('#div5'), "Consulta utilizando subcolsulta para listar apenas produtos que constem mais de 10 unidades em estoque",
        `  
    SELECT a.produto, b.quantidade 
    FROM tb_produto as a, 
    ( SELECT * FROM tb_estoque WHERE quantidade > 10) as b 
    WHERE a.codigo = b.codigo limit 10`,
        60, 7
    );

    setContent(
        $('#div6'), "Consultar os produtos com mais de 10 unidades",
        `  
SELECT * FROM tb_estoque WHERE quantidade > 10 limit 10`,
        70, 3
    );

    setContent(
        $('#div6'), "Consultar o produto com codigo 25",
        `  
SELECT * FROM tb_estoque WHERE codigo = 25`,
        70, 3
    );


    setContent(
        $('#div6'), "Consultar todos produtos onde a quantidade seja maior que a media de quantidade de todos os produtos do estoque",
        `  
        SELECT * 
        FROM tb_estoque 
        WHERE quantidade > (select avg(quantidade) from tb_estoque);`,
        70, 6
    );

    setContent(
        $('#div6'), "Consultar o produto com maior preço",
        `  
    SELECT * 
    FROM tb_produto 
    WHERE codigo = (select codigo 
                from tb_produto 
                order by preco desc limit 1)`,
        70, 8
    );

    setContent(
        $('#div7'), "Consultar o produto com o maior preço",
        "SELECT max(preco) FROM tb_produto", 50, 2
    );

    setContent(
        $('#div8'), "Consultar o produto com o menor preço",
        "SELECT min(preco) FROM tb_produto", 50, 2
    );

    setContent(
        $('#div9'), "Consultar o produto com a media de preços",
        "SELECT avg(preco) FROM tb_produto", 50, 2
    );

    setContent(
        $('#div10'), "Consultar a soma de todas unidades de todos produtos",
        "SELECT sum(quantidade) FROM tb_estoque", 50, 2
    );

    setContent(
        $('#div11'), "Consultar quantos produtos por unidades tems em estoque",
        `
        SELECT quantidade, count(*) AS "produtos"
        FROM tb_estoque 
        GROUP BY quantidade
        ORDER BY "produtos" DESC`, 50, 6
    );

    setContent(
        $('#div12'), "Consultar todos produtos ordenados por nome",
        `
        SELECT *
        FROM tb_produto
        ORDER BY produto ASC `, 50, 5
    );

    setContent(
        $('#div20'), "Esta consulta ira retornar uma geometria do tipo point, no SRID 4326", `
        SELECT ST_GEOMFROMTEXT('POINT(398113 7418092)',31983) `, 50, 4
    );

    setContent(
        $('#div21'), "Esta consulta ira retornar a geometria da bacia escrita como um texto", `
        SELECT ST_ASTEXT(geom) FROM cidade WHERE nome ilike 'Jacareí' `, 50, 4
    );

    setContent(
        $('#div13'), "Esta consulta ira retornar o nome e a area de cada cidade da tabela cidade", `
        SELECT nome,ST_AREA(geom) FROM cidade `, 50, 4
    );


    setContent(
        $('#div14'), "Esta consulta ira retornar o nome e a area de cada cidade da tabela cidade", `
        SELECT a.nome 
        FROM cidade as "a" , cidade as "b" 
        WHERE ST_TOUCHES(a.geom,b.geom)
        AND b.nome ilike 'Jacareí' `, 50, 7

    );

    setContent(
        $('#div15'), "Esta consulta ira retornar o nome das microregiões em que suas geometrias passam por por Jacareí", `
        SELECT a.nome
        FROM microregiao as "a" , cidade as "b" 
        WHERE ST_INTERSECTS(a.geom,b.geom) 
        AND b.nome ilike 'Jacareí' `, 50, 7
    );

    setContent(
        $('#div16'), "Esta consulta ira retornar uma geometria com raio de 100m a partir da geometria base.", `
        SELECT ST_BUFFER(ST_GEOMFROMTEXT('POINT(398113 7418092)',31983),100) `, 60, 4
    );
    
    setContent(
        $('#div17'), "Esta consulta ira retornar o nome da cidade em que o ponto está localizado", `
        SELECT nome 
        FROM cidade 
        WHERE ST_CONTAINS (geom,ST_GEOMFROMTEXT('POINT(398113 7418092)',31983)); `, 80, 6
    );

    setContent(
        $('#div18'), "Esta consulta ira retornar o nome da cidade em que o ponto está dentro", `
        SELECT nome 
        FROM cidade 
        WHERE ST_WITHIN (ST_GEOMFROMTEXT('POINT(398113 7418092)',31983),geom); `, 80, 6
    );

    setContent(
        $('#div19'), "Esta consulta ira retornar o ponto central de uma geometria", `
        SELECT ST_CENTROID(geom),nome 
        FROM cidade 
         `, 60, 4
    );

    

    
    startContentsActions();

    // simular o click enter
    var e = $.Event("keyup", { key: "Enter" });

    for (var i of allQueryInputs) {
        $(i).trigger(e)
    }
};


startContents();

