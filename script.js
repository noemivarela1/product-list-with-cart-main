// Ocultamos a factura ao inicio
const items = document.querySelectorAll("li");
items.forEach(li => li.style.display = "none");
let pedidoBaleiro=document.getElementById("order-total");
pedidoBaleiro.style.display="none";
const carts = document.querySelectorAll('.cart');
const quantity = document.getElementById('quantity');
const totalXeral = document.getElementById('total-xeral');
const btnConfirmar = document.getElementById('btn-confirmar');

const modal = document.getElementById('modal-resumo');
const listaResumo = document.getElementById('lista-resumo-final');
const btnNovoPedido = document.getElementById('btn-novo-pedido');

carts.forEach(cart => {
    cart.addEventListener('click', function(event) {
        // Se xa está en modo +/- (ten un span), non facemos nada
        if (this.querySelector('span')) return;

        const idCarro = event.currentTarget.id;
        const numIdCarro = idCarro.split('-').pop();
    
        const padreSection = cart.closest('section');
        const imgInterna = padreSection.previousElementSibling.querySelector('img');

        if (imgInterna) {
            imgInterna.style.border = "2px solid hsl(14, 86%, 42%)";
        }

        // 1. CAMBIAMOS AO MODO "SELECCIONADO" (Laranxa)
        configurarBotonActivo(this, numIdCarro, padreSection);
    });
});

function configurarBotonActivo(boton, numero, section) {
    boton.innerHTML = '';
    boton.style.backgroundColor = 'hsl(14, 86%, 42%)';
    boton.style.display = 'flex';
    boton.style.justifyContent = 'space-between';
    boton.style.padding = '0 15px';
    

    const imgDec = document.createElement('img');
    imgDec.src = 'img/icon-decrement-quantity.svg';
    imgDec.className = 'img-icon';
    imgDec.style.width='1em';
    imgDec.style.height='1em';
    imgDec.style.padding='0.25em';
    imgDec.style.border = "1px solid white";
    imgDec.style.borderRadius = "50%";

    const imgInc = document.createElement('img');
    imgInc.src = 'img/icon-increment-quantity.svg';
    imgInc.className = 'img-icon';
    imgInc.style.width='1em';
    imgInc.style.height='1em';
    imgInc.style.border = "1px solid white";
    imgInc.style.borderRadius = "50%";
    imgInc.style.padding = "0.25em";

    const spanCant = document.createElement('span');
    spanCant.id = 'valor-' + numero;
    spanCant.textContent = '1';
    spanCant.style.color = 'white';
    spanCant.style.padding='0 1em 0 1em';

    boton.style.padding='1em 2em 1em 2em';
    boton.append(imgDec, spanCant, imgInc);

    // Accións iniciais
    actualizarListaLateral(section, numero, "1");
    calcularTotal(1);
   

    // Eventos internos
    imgDec.onclick = (e) => {
        e.stopPropagation();
        let v = Number(spanCant.textContent) - 1;
        if (v >= 0) {
            spanCant.textContent = v;
            calcularTotal(-1);
            actualizarListaLateral(section, numero, v);
            if (v === 0) resetBoton(boton, section);
            actualizarTotais();
        }
    };

    imgInc.onclick = (e) => {
        e.stopPropagation();
        let v = Number(spanCant.textContent) + 1;
        spanCant.textContent = v;
        calcularTotal(1);
        actualizarListaLateral(section, numero, v);
        actualizarTotais();
    };
    actualizarTotais();
}

// 2. FUNCIÓN PARA VOLVER AO ESTADO ORIXINAL (Branco)
function resetBoton(boton, section) {
    boton.innerHTML = `<img src="img/icon-add-to-cart.svg" alt=""><strong> Add to Cart</strong>`;
    boton.style.backgroundColor = 'white';
    boton.style.border = "2px solid hsl(12, 20%, 44%)";
    boton.style.justifyContent = 'center';
    
    const imgInterna = section.previousElementSibling.querySelector('img');
    if (imgInterna) imgInterna.style.border = "none";
    
}

function actualizarListaLateral(section, numero, cantidade) {
    const item = document.getElementById("item-" + numero);
    if (!item) return;

    if (Number(cantidade) > 0) {
        item.style.display = "flex";
        item.querySelector("h3").textContent = section.querySelector("h3").textContent;
        document.getElementById("prezo-" + numero).textContent = section.querySelector("h4").textContent;
        document.getElementById("cant-" + numero).textContent = cantidade;

        const prezo = parseFloat(section.querySelector("h4").textContent.replace('$', ''));
        document.getElementById("subtotal-" + numero).textContent = (prezo * cantidade).toFixed(2);
        
        document.getElementById("pedido").style.display = "none";
   
    } else {
        item.style.display = "none";
    }
    
    // Configurar a aspa de borrar
    const aspa = item.querySelector(".icon-remove");
    if (aspa) {
        aspa.onclick = (e) => {
            e.stopPropagation();
            const spanCant = document.getElementById('valor-' + numero);
            const cantActual = Number(spanCant.textContent);
            
            calcularTotal(-cantActual);
            item.style.display = "none";
            
            // Buscamos o botón correspondente para resetealo
            const cartBoton = document.getElementById('carro-' + numero);
            if (cartBoton){
                resetBoton(cartBoton, section);
            }
            actualizarTotais();
        };
    }
}

function calcularTotal(valor) {
    let suma = Number(quantity.textContent) + valor;
    quantity.textContent = suma >= 0 ? suma : 0;
    if (suma <= 0) document.getElementById("pedido").style.display = "flex";
    
}

// ESTA FUNCIÓN CALCULA TODO O CARRIÑO DE GOLPE
function actualizarTotais() {
    
    //alert("actualizarPeido");
    //alert(pedidoBaleiro);
   
    pedidoBaleiro.style.display="flex";
    //alert(pedidoBaleiro.style.display);
    let contaArtigos = 0;
    let sumaDiñeiro = 0;

    // Percorremos todos os subtotais visibles
    const todosOsLi = document.querySelectorAll("li[id^='item-']");
    todosOsLi.forEach(li => {
        if (li.style.display !== "none") {
            const num = li.id.split('-').pop();
            const cant = Number(document.getElementById("cant-" + num).textContent);
            const sub = parseFloat(document.getElementById("subtotal-" + num).textContent);
            
            contaArtigos += cant;
            sumaDiñeiro += sub;
        }
    });

    // Actualizamos a interface
    quantity.textContent = contaArtigos;
    totalXeral.textContent = sumaDiñeiro.toFixed(2);

    // Mostramos/Ocultamos o botón e a imaxe de baleiro
    if (contaArtigos > 0) {
        pedidoBaleiro.style.display = "flex";
        btnConfirmar.style.display = "flex";
    } else {
        pedidoBaleiro.style.display = "none";
        btnConfirmar.style.display = "none";
        totalXeral.textContent = "0.00€";
    }
}

btnConfirmar.onclick = function() {
   
    // 1. Limpamos o resumo anterior
    listaResumo.innerHTML = '';
    
    // 2. Buscamos todos os 'li' que están visibles na factura lateral
    const itemsFactura = document.querySelectorAll("li[id^='item-']");
    
    itemsFactura.forEach(item => {
        if (item.style.display !== "none") {
            const num = item.id.split('-').pop();

            const botonOrixinal = document.getElementById("carro-" + num);
            const sectionOrixinal = botonOrixinal.closest('section');
            const imgOrixinalSrc = sectionOrixinal.previousElementSibling.querySelector('img').src;

            
            const nome = item.querySelector("h3").textContent;
            const cant = document.getElementById("cant-" + num).textContent;
            const prezo=document.getElementById("prezo-"+num).textContent;
            const sub = document.getElementById("subtotal-" + num).textContent;

            // Creamos un resumo sinxelo para o modal
            const liResumo = document.createElement("li");
            liResumo.style.display = "flex";
            liResumo.style.justifyContent = "flex-start";
            liResumo.style.borderBottom = "1px solid #ddd";
            liResumo.style.padding = "0.5em 0";
            liResumo.innerHTML = `<img src="${imgOrixinalSrc}" class="imx-miniatura">
                <div class="datos">
                   <h3>${nome}</h3>
                   <div class="subtot"> 
                      <div><strong class="cantidade">${cant}</strong><span class="prezo"> ${prezo}</span></div>
                      <div><span class="subtotal"><strong>${sub}</strong></span</div>
                   </div>
                </div>
            `;
            listaResumo.appendChild(liResumo);
        }
    });

    // 3. Poñemos o total e amosamos o modal
    document.getElementById("total-modal").textContent = document.getElementById("total-xeral").textContent;
    modal.style.display = "flex";
};

// Botón para resetear todo e empezar de novo
btnNovoPedido.onclick = function() {
    location.reload(); // A forma máis rápida de resetear toda páxina
};