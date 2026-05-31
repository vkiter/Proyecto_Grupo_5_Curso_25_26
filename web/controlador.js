// CONTROLADOR - Solo logica, trabaja con las clases del modelo

let audio = new Audio();

let Controlador = {

  // Cambia de vista
  verVista: function(id) {
    let vistas = document.querySelectorAll('.vista');
    for (let i = 0; i < vistas.length; i++) {
      vistas[i].classList.remove('activa');
    }
    document.getElementById('vista-' + id).classList.add('activa');
    window.scrollTo(0, 0);
  },

  // Abre detalle de una cancion (instancia de Cancion)
  verDetalle: function(indice) {
    estadoReproductor.cancionActual = indice;
    let c = estadoReproductor.getCancion();

    // Llama al metodo de Oyente
    oyenteActual.reproducir(c);

    document.getElementById('detalle-cover').textContent   = c.icono;
    document.getElementById('detalle-genero').textContent  = c.genero;
    document.getElementById('detalle-titulo').textContent  = c.titulo;
    document.getElementById('detalle-artista').textContent = 'por ' + artistaActual.verPerfil();
    document.getElementById('detalle-puntos').textContent  = c.puntos + ' / 5';
    document.getElementById('nombre-donacion').textContent = artistaActual.nombre;

    document.getElementById('player-icono').textContent   = c.icono;
    document.getElementById('player-titulo').textContent  = c.titulo;
    document.getElementById('player-artista').textContent = artistaActual.nombre;

    // Audio real
    audio.src = c.archivoAudio;
    audio.play();
    estadoReproductor.reproduciendo = true;
    document.getElementById('btn-play').textContent     = '||';
    document.getElementById('btn-play-bar').textContent = '||';

    this.verVista('detalle');
  },

  // Play / pausa - usa metodo reproducir() del Oyente
  togglePlay: function() {
    if (estadoReproductor.reproduciendo) {
      audio.pause();
      document.getElementById('btn-play').textContent     = '▶';
      document.getElementById('btn-play-bar').textContent = '▶';
    } else {
      audio.play();
      oyenteActual.reproducir(estadoReproductor.getCancion());
      document.getElementById('btn-play').textContent     = '||';
      document.getElementById('btn-play-bar').textContent = '||';
    }
    estadoReproductor.reproduciendo = !estadoReproductor.reproduciendo;
  },

  // Click en la barra de progreso
  moverBarra: function(evento, barra) {
    let rect = barra.getBoundingClientRect();
    let pct  = (evento.clientX - rect.left) / rect.width;
    if (audio.duration) {
      audio.currentTime = pct * audio.duration;
    }
  },

  // Donacion - usa metodo donar() del Oyente
  toggleDonacion: function() {
    document.getElementById('panel-donacion').classList.toggle('oculto');
  },

  selDonacion: function(el, importe) {
    estadoReproductor.importeDonacion = importe;
    let chips = document.querySelectorAll('#panel-donacion .chip');
    for (let i = 0; i < chips.length; i++) chips[i].classList.remove('activo');
    el.classList.add('activo');
    document.getElementById('btn-confirmar').textContent = 'Confirmar ' + importe + ' EUR';
  },

  confirmarDonacion: function() {
    if (!estadoReproductor.importeDonacion) { alert('Selecciona un importe.'); return; }

    // Llama al metodo donar() de Oyente -> crea instancia de Donacion
    let donacion = oyenteActual.donar(estadoReproductor.importeDonacion, artistaActual);
    console.log('Donacion creada:', donacion);

    alert('Donacion de ' + donacion.cantidad + ' EUR realizada. Gracias!');
    document.getElementById('panel-donacion').classList.add('oculto');
    estadoReproductor.importeDonacion = null;
  },

  // Comentario - usa metodo comentar() del Oyente -> crea instancia de Comentario
  enviarComentario: function() {
    let input = document.getElementById('input-comentario');
    let texto = input.value.trim();
    if (!texto) return;

    let comentario = oyenteActual.comentar(texto);
    console.log('Comentario creado:', comentario);

    let div = document.createElement('div');
    div.className = 'comentario';
    div.innerHTML =
      '<div class="avatar">Tu</div>' +
      '<div><div class="titulo">' + oyenteActual.nombre + '</div>' +
      '<div class="gris">' + comentario.texto + '</div></div>';

    document.getElementById('nuevos-comentarios').appendChild(div);
    input.value = '';
  }

};

// Actualiza barra de progreso con el tiempo real del audio
audio.addEventListener('timeupdate', function() {
  if (!audio.duration) return;
  let pct = (audio.currentTime / audio.duration) * 100;

  document.getElementById('barra-relleno').style.width = pct + '%';
  document.getElementById('barra-bar').style.width     = pct + '%';

  let m = Math.floor(audio.currentTime / 60);
  let s = Math.floor(audio.currentTime % 60);
  document.getElementById('tiempo-actual').textContent = m + ':' + (s < 10 ? '0' : '') + s;
});
