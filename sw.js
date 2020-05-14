//IMPORTS
importScripts('js/sw-utils.js');


//---------------------------------------------------------------------------------------------------------------------------
const STATIC_CACHE = 'static-v2'
const DYNAMIC_CACHE= 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
	// '', SOLO PRODUCCION
	'index.html',
	'css/style.css',
	'img/favicon.ico',
	'img/avatars/spiderman.jpg',
	'img/avatars/ironman.jpg',
	'img/avatars/wolverine.jpg',
	'img/avatars/thor.jpg',
	'img/avatars/hulk.jpg',
	'js/app.js',
	'js/sw-utils.js'
]

const APP_SHELL_INMUTABLE=[
	'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
	'css/animate.css',
	'js/libs/jquery.js'
]


//CARGA DE EVENTOS EN EL INSTALL---------------------------------------------------
self.addEventListener('install', e =>{

//DECLARACION Y CREACION DE LOS CACHES
	const cacheStatic = caches.open(STATIC_CACHE).then(cache=>{
		return cache.addAll(APP_SHELL);
	});

	const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache=>{
		return cache.addAll(APP_SHELL_INMUTABLE);
	});

// FUNCION DE ESPERA PARA LA CARGA DE LAS PROMESAS
	e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});


//CARGA DE EVENTOS EN EL ACTIVATE---------------------------------------------------
self.addEventListener('activate', e=>{

	//COMPROBACION DE NUEVAS VERSIONES DE CACHE
	const respuesta = caches.keys().then(keys=>{

		keys.forEach(key=>{

			if (key !== STATIC_CACHE && key.includes('static')) {
				return caches.delete(key);
			}
		});

	});

	// FUNCION DE ESPERA PARA LA CARGA DE LAS PROMESAS
	e.waitUntil(respuesta);


});


//ESTRATEGIA DE CACHE---------------------------------------------------------------
self.addEventListener('fetch', e=>{

	const respuesta=caches.match(e.request).then(res=>{
		if (res) {
			return res;
		}else{

			// console.log(e.request.url);

			return fetch(e.request).then(newRes=>{

				//MANEJADOR DE ERRRORES EN EL SHELL
				return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

			});


		}

	});

	e.respondWith(respuesta);

});