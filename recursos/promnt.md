Tu objetivo es crear el código HTML, CSS, JAVASCRIPT Y PHP de mi aplicación web oficial de mi marca. El nombre de mi canal es: "Cortina y sus amigos". Debe de tener un aspecto para gente juvenil. Mi página sólo estará disponible en español. No tendrá base de datos ni ningún tipo de registro, solo leera los archivos de configuración desde php. La aplicación deberá de tener un aspecto elegante, moderlo y bonito, tener animaciones y ser muy original y atractiva. Los colores base de la aplicación deberán de ser tonos de naranja, deberás de crear en el general.css el fichero que tendrás que usar en todas las páginas con variables de los colores base de toda la aplicación, fuente y demás medidas, a parte deberá de poder tener versión oscura o clara, dependiendo solo de la configuración del ordenador de la persona, con css usando la funcion en las variables de light-dark().
Es muy importante también que la aplicación sea responsive, que la aplicación según el tamaño del dispositivo el cual se esté usando con buenas practicas de css los elementos se adapten correctamente, ya sea teniendo que distribuir la información o elementos de la página de forma diferente o no, depende las necesidades.
Si fuera posible, me gustaría que el htaccess se encargue de que las personas no puedan buscar o navegar entre las carpetas o archivos de manera individual, prohibiendo el paso a carpetas como assets, config, includes, scripts y styles. (y todos los archivos de dentro), no se si se puede, si se puede, me gustaría que no puedan abrir ni obtener nada de dentro de estas carpetas.
Todo el código, deberá de estar lo más limpio posible, intentando realizar funciones para cosas repetitivas, ya sea codigo del lado del servidor con php o del cliente con javascript. Variables, nombres de funciones deberán de estar en inglés aunque el contenido de la página sea español.
El php se encargará de imprimir todo el footer y el header directamente. Php desde el lado del servidor, será el encargado de las demás datos de los json, pasarlos directamente a los ficheros como código javascript, haciendo que no se necesario en cuanto una página este cargada hacer más llamadas al servidor, aunque por ejemplo, páginas como las de 404, que solo es cargar la imagen y poco más, el php puede también cargar de forma intacta la página, pero en páginas como en la de juegos, la del impostor, toda las mecánicas de cambios en las ventanas, deberá de ejecutarse todo en el cliente.
Cuando una imagen de mis assets se llama poster, es una imagen grande horizontal.
Es muy importante qué todas las páginas de la aplicación, si yo descargo todo el html generado de la página cuando la esté visitando, ya funcione por si sola, si yo me copio todo el html entero y lo pongo en un nuevo fichero de extensión html y lo abro sin más, sin servidor detrás.
Los scripts de js podrás añadir los que veas necesarios, y en el scripts de 'functions.js', podrás añadir solo funciones genéricas. Al generar en los distintos ficheros php en su cabecera la etiqueta del scripts, añade en el que aparezca solo año, mes y día, algo como esto pero que php sea el que se encargue de añadirlo cuando se carga cada página (la intención es solo añadirle año, mes y día solo, para que si visita varias veces al día la página le tire de cache, pero el día siguiente ya generaría un código distinto) scripts/[nombre fichero].js?" + new Date().getTime();

La web tendrá esta distribución de carpetas:

/assets 
    /creator
        poster.png
    /errors
        poster-404.png
    /films
        /1
            poster.png
    /games
        /impostor
            /steps
                1.png
                2.png
                3.png
                4.png
            /roles
                civil.png
                impostor.png
                jester.png
                sloth.png
            /wordPackets
                1.png
                2.png
    /home
        poster.png
        /characters
            quelofaros.png
            grupofelipe.png
            felipe.png
            montoro.png
            cortina.png
            .....
    /shop
        /1
            1.png
            2.png
            3.png
            4.png
            5.png
            6.png
            7.png
        /2
            1.png
            2.png
            3.png
            4.png
            5.png
            6.png
            7.png
        /3
            1.png
            2.png
            3.png
            4.png
            5.png
            6.png
            7.png
    favicon.ico
    logo.png
    shared.jpg
/config
    creator.json
    errors.json
    general.json
    films.json
    games.json
    home.json
    shop.json
/includes
    footer.php
    functions.php
    head.php
    header.php
/scripts
    functions.js
    games.js
    (lo que haga falta).js
/styles
    footer.css
    general.css
    header.css
    (lo que haga falta).css
.htaccess
404.php
creador.php
index.php
juegos.php
peliculas.php
tienda.php

La web tendrá arriba del todo un menú, hacia las páginas que existen en la propiedad 'links' del general.json

Todo esto que mencionaré serán los mínimos, si ves adecuado añadir alguna cosa más lo puedes hacer si tiene lógica.

En el header (disponible en todas las páginas de la web) deberá de estar:
- Mi logo circular de la carpeta assets (si se hace click hará redirección a la página principal).
- Los diferentes links del array de links en el general.json

En el footer (disponible en todas las páginas de la web) deberá de estar:
- Mi logo circular de la carpeta assets.
- Mi correo y mis redes sociales.
- © 2026 Cortina y sus amigos.

En la página de 404, en '404.php' deberá de estar (lee con php 'errors.json')
Deberá haber a parte del header y footer, el título y descripción del json, la imagen del poster del 404 que tengo y un enlace o botón para volver al inicio, para redireccionar a la ruta base de la página.

En la página de inicio, en 'index.php' deberá de estar (lee con php 'home.json'):
- Cada párrafo de la 'description'
- El iframe del primer video de bienvenida de la serie (que es un short de youtube, formato vertical)
- La lista de los personajes (si un characterGroup o character no tiene el atributo 'image' se usará por defecto el atributo 'name' en minusculas y sin tildes para obtener el nombre de la imagen del personaje)

En la página de películas, en 'peliculas.php' deberá de estar (lee con php 'films.json')
- La información de las distintas películas.
- El date lo deberá de convertir a una fecha clara al español en el formato: 6 de marzo de 2026
- Los géneros deberá de unirlos separándolos por comas.
(En caso de qué en el array de películas no haya ninguna película o todas las que haya en el array estén en 'showing' a false, entonces en el menú del header no aparecerá el link de películas, y dentro de la página pondrá un mensaje, un Proximamente... )
- La película completa, en caso de que exista la propiedad 'youtubeId' y no sea null, la principal (no las que están en trailers), será un vídeo de youtube horizontal, de los largos.

En la página de juegos, en 'games.php' deberá de estar (lee con php 'games.json')

- El juego de 'impostor':
    + Nombre.
    + Instrucciones.
    + Ejemplos (los shorts de youtube) (date cuenta que podrán haber desde 0 hasta muchos, así que si hay más de 2, mejor que no se carguen a partir del 3, y que esté en un carrusel para avanzar con las flechas y poder ver los demás, aunque los que hayan cargados, si no caben no los elimines del html para no tenerlos que volver a cargar otra vez en caso de que el usuario quiera volver a ellos).
    + Abajo, para poder jugar sin salir de la página actual usa divs o otras etiquetas como modales grandes o algo, lo que mejor consideres, pero todo el juego se desarrolla en la misma página, no de forma online, ya que es una web sin base de datos ni sockets ni nada, con un sólo móvil podrán jugar varias personas las cuales estén juntas, no está pensado para jugar de forma online, sólo deberá de tener la funcionalidad de:
        - Poder añadir una lista de nombres (las cuales se guardarán según vaya añadiendo o eliminando nombres en su localstorage).
        - Para iniciar una partida, debe de haber un mínimo de 3 nombres que haya añadido (no pueden ser espacios en blanco o enters o cosas raras, deben de ser distintos, no pueden haber un 'Pablo' y un 'pablo' por ejemplo)
        - En la partida se podrán selecionar el número de impostores, como mínimo habrá uno, pero como máximo serán la mitad de los jugadores totales que haya en la partida, si hay 3 jugadores en total, solo 1 impostor, si hay 4 jugadores en total, entonces 2 impostores como máximo, si hay 5 jugadores, entonces solo 2 impostores como máximo, si hay 6 jugadores entonces solo 3 impostores como máximo, y así sucesivamente.
        - También se podrá selecionar si se quiere que haya una pista para los impostores, la pista de la palabra será el nombre del paquete al que pertenece la palabra, ya que, si se selecciona para jugar más de 1 paquete de palabras, podrá salir en esa jugada cualquier palabra de los paquetes de palabras elegidos.
        - Los roles especiales, los del array que están en 'special', usará el número de 'playersNeeded', y será solo un switch con un label que indique: Rol de [atributo 'name' de ese rol especial], o hay 0 de estos roles o 1 en la partida. Sólo se podrán activar los roles que haya en este array con la condición de que los jugadores totales de la sala sean igual o mayor que 'playersNeeded'.
        - También, podrá selecionar antes de empezar la partida, de todos los paquetes de palabras que existan, en 'wordPackets', que cada uno tiene una imagen representativa del paquete, un nombre y unas palabras asociadas. Podrá selecionar mínimo 1 y máximo todos los que haya en el array, no hay máximo.
        - Cuando haya un mínimo de 3 jugadores que haya añadido y le haya dado a jugar:
        
        const players = [ (aquí irá los string originales de jugadores en el mismo orden en el que aparecen en la sala, que es el mismo orden en el cual fue agregando la persona a los jugadores, antes de empezar la jugada) ]

        Deberá de haber otro segundo array, que se creará al dar a jugar, el cual se clone el array de 'players' y se le haga un shuffle
        
        El orden por el cual las pantallas de los diferentes jugadores para mostrarles su rol, deberá de ser el mismo que el array principal de players.

        Cada vez que se le de a jugar, el programa hará esto:
        const playersCopy = shuffleArray(cloneArray(players))

        Entonces, las primeras posiciones de playersCopy, serán para tantos impostores como hayan selecionado, las siguientes posiciones de playersCopy para los roles especiales en caso de que los hayan añadido (dylan y Montoro).

        Cuando se le haya dado a jugar se abrirá una modal para que la modal del juego ocupe toda la página, con una 'X' para salir del juego, se irán mostrando las pantallas en esta modal, con el botón siguiente para mostrar a cada jugador que rol tendrá, no se mostrará el rol directamente, tendrán que deslizar usando el dedo en un móvil (aunque también debe de poder ser desplazado con el mouse del ratón), este elemento se desliza un poco para mostrar el rol, la imagen del rol y la frase de dicho rol, un elemento hacia arriba, el cual tiene la imagen de roles.png, para que no se vea directamente, abajo del todo un botón de siguiente. Cuando la persona suelte el dedo del elemento que tapa el rol, entonces se volverá a esconder el rol para que al pasar el móvil a la siguiente persona para que pueda ver su rol, no vea el rol de la persona anterior.

        Cuando todas las personas ya tengan un rol, la siguiente pantalla será para elegir de forma aleatoria quien empieza jugando, la idea es que un impostor tenga la mitad de probabilidades de empezar que cualquier otro rol.
        Se creara un nuevo array vacío, en este array, se hará un push de todos los jugadores uno por uno, pero a cada jugador se le agregará 2 veces en este array, excepto a los impostores, que estos a este array solo se le añadirán 1 sola vez.
        De este array se hará un shuffle, y el que haya salido en primera posición en este nuevo array, será el que empezará a jugar, mostrando una pantalla de empieza [nombre jugador]. En esta pantalla también se mostrará la lista de jugadores, con un botón para terminar la partida, revelando así los roles de cada jugador, para saber quien era quien, y terminar la partida cerrando así la modal del juego.
        Recuerda añadir en una esquina superior durante la partida un signo de interrogante el cual si pinchas, saldrá la explicación del juego, en la cual debe de ser similar a la adjuntada (la de los 4 pasos: 'Obtén tu rol', 'Da pistas', 'Presta atención' y por último 'Votar'), pero adaptada a mis roles.
        Elimina del array la palabra la cual se seleccionó de forma aleatoria la cual jugaron en la partida actual para que no pueda volver a salir.
        También te adjunte las pantallas del juego, un boceto de ellas, ignora los estilos de estas pantallas del juego y asegúrate de que el juego también combine con la estética del resto de aplicación.

- El juego de 'conecto':
    + Nombre.
    + Instrucciones.
    + Ejemplos (los shorts de youtube) (date cuenta que podrán haber desde 0 hasta muchos, así que si hay más de 2, mejor que no se cargue, y que esté en un carrusel para avanzar con las flechas y poder ver los demás, aunque los que hayan cargados, si no caben no los elimines del html para no tenerlos que volver a cargar otra vez en caso de que el usuario quiera volver a ellos).
    (No tiene para jugar)


En la página de la tienda, en 'tienda.php' deberá de estar (lee con php 'shop.json')
La tienda deberá de tener dos filtros, uno para filtrar por el 'type', por defecto no se aplicarán filtros, el filtro permitirá filtrar los productos de la tienda pudiendo marcar 1 o más opciones, teniendo un botón o similar para eliminar todas las opciones seleccionadas mostrando así todos los elementos de la tienda, también tendrá otro filtro para filtrar por búsqueda, ignorando tildes, mayúsculas, espacios, etc. Si en la búsqueda no se encuentra nada, deberá de poner algo de que no se encontró nada en la búsqueda. En caso de que haya 0 o 1 'type' en el array, php no escribirá el código javascript ni mostrará este filtro.
Cada elemento de artículo no indica el precio, solo tendrá nombre, unas imagenes, que podrán ser varias, todas ellas son imagenes completamente cuadradas. Y con un carrusel para poder llegar a ver todas. Un botón en el que dentro del botón estará el texto de 'buttonText'. Este botón solo abrirá el enlace en una nueva pestaña.

En la página de creador, en 'creador.php' deberá de estar (lee con php 'creator.json')
- La imagen poster
- La description
