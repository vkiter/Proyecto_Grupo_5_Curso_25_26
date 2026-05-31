// MODELO - Programacion Orientada a Objetos
// Refleja el diagrama de clases: Usuario (abstracta) -> Artista / Oyente

// ============================================================
// CLASE ABSTRACTA: Usuario
// No se puede instanciar directamente, solo Artista u Oyente
// ============================================================
class Usuario {

  constructor(nombre, email, contrasena) {
    // Impedimos instanciar Usuario directamente
    if (new.target === Usuario) {
      throw new Error('Usuario es una clase abstracta. Usa Artista u Oyente.');
    }
    this.id          = Math.floor(Math.random() * 1000);
    this.nombre      = nombre;
    this.email       = email;
    this.contrasena  = contrasena;
  }

  registrar() {
    console.log('Usuario registrado: ' + this.nombre);
  }

  iniciarSesion() {
    console.log('Sesion iniciada: ' + this.email);
  }

  verPerfil() {
    return this.nombre;
  }

}

// ============================================================
// CLASE: Artista  (hereda de Usuario)
// ============================================================
class Artista extends Usuario {

  constructor(nombre, email, contrasena, descripcion) {
    super(nombre, email, contrasena);
    this.descripcion  = descripcion;
    this.fotoPerfil   = 'avatar_artista.png';
    this.canciones    = [];
    this.donaciones   = [];
  }

  subirCancion(cancion) {
    this.canciones.push(cancion);
    console.log('Cancion subida: ' + cancion.titulo);
  }

  eliminarCancion(titulo) {
    this.canciones = this.canciones.filter(function(c) {
      return c.titulo !== titulo;
    });
  }

  verEstadisticas() {
    return this.canciones.length + ' canciones publicadas';
  }

  verDonaciones() {
    return this.donaciones;
  }

}

// ============================================================
// CLASE: Oyente  (hereda de Usuario)
// ============================================================
class Oyente extends Usuario {

  constructor(nombre, email, contrasena, verificado) {
    super(nombre, email, contrasena);
    this.verificado = verificado || false;
  }

  buscarCanciones(lista, termino) {
    return lista.filter(function(c) {
      return c.titulo.toLowerCase().includes(termino.toLowerCase());
    });
  }

  reproducir(cancion) {
    console.log('Reproduciendo: ' + cancion.titulo);
  }

  descargar(cancion) {
    console.log('Descargando: ' + cancion.titulo);
  }

  comentar(texto) {
    return new Comentario(texto);
  }

  valorar(puntuacion) {
    return new Valoracion(puntuacion);
  }

  donar(cantidad, artista) {
    let d = new Donacion(cantidad);
    artista.donaciones.push(d);
    return d;
  }

}

// ============================================================
// CLASE: Cancion
// ============================================================
class Cancion {

  constructor(titulo, genero, archivoAudio, icono, puntos) {
    this.id           = Math.floor(Math.random() * 1000);
    this.titulo       = titulo;
    this.genero       = genero;
    this.archivoAudio = archivoAudio;
    this.icono        = icono;
    this.puntos       = puntos;
    this.descargas    = 0;
  }

  reproducir() {
    console.log('Reproduciendo: ' + this.titulo);
  }

  descargar() {
    this.descargas++;
    console.log('Descarga numero ' + this.descargas);
  }

}

// ============================================================
// CLASE: Comentario
// ============================================================
class Comentario {

  constructor(texto) {
    this.id    = Math.floor(Math.random() * 1000);
    this.texto = texto;
    this.fecha = new Date();
  }

}

// ============================================================
// CLASE: Valoracion
// ============================================================
class Valoracion {

  constructor(puntuacion) {
    this.id         = Math.floor(Math.random() * 1000);
    this.puntuacion = puntuacion;
  }

}

// ============================================================
// CLASE: Donacion
// ============================================================
class Donacion {

  constructor(cantidad) {
    this.id       = Math.floor(Math.random() * 1000);
    this.cantidad = cantidad;
    this.fecha    = new Date();
  }

}

// ============================================================
// DATOS de ejemplo - instancias reales de las clases
// ============================================================

// Artista logueado
let artistaActual = new Artista('Alba Vega', 'alba@musikeasy.com', '****', 'Indie rock desde Valencia');

// Oyente logueado
let oyenteActual = new Oyente('Maria R.', 'maria@gmail.com', '****', true);

// Canciones (instancias de Cancion)
let listaCanciones = [
  new Cancion('Luces de Neon', 'Indie Rock', 'audio/cancion1.mp3', '🎸', 4.8),
  new Cancion('Raices',        'Folk',       'audio/cancion2.mp3', '🌿', 4.2),
  new Cancion('Ciudad Rota',   'Rock',       'audio/cancion3.mp3', '🔥', 4.1),
  new Cancion('Mar Adentro',   'Pop',        'audio/cancion4.mp3', '🌊', 4.9),
  new Cancion('Tacto',         'Jazz',       'audio/cancion5.mp3', '🎹', 4.4)
];

// El artista sube sus canciones
listaCanciones.forEach(function(c) { artistaActual.subirCancion(c); });

// Estado del reproductor
let estadoReproductor = {
  cancionActual : 0,
  reproduciendo : false,
  importeDonacion: null,

  getCancion: function() {
    return listaCanciones[this.cancionActual];
  }
};
