David Acevedo A01196678
Rodrigo Urbina A01281933

Para este avance tenemos en la escena el suelo marino color arena y un cubo que va a ser la base de nuestro arrecife de coral.

Además de esto cambiamos la funcionalidad de la camara utilizando las propiedades de senos y cosenos para que sea más intuitiva para el usuario. Ahora se mueve en relación a la posición y la dirección en la que se está viendo, no en base a los ejes. Todo esto se logra por medio de la multiplicación de matrices. Y la rotación de la cámara se hace con el método de trasladar al origen, rotar y trasladar de regreso.

Movimiento de la camara:
Izquierda - Derecha --> 'a' y 'd'
Arriba - Abajo --> 'ArrowUp' y 'ArrowDown'
Adelante - Atras --> 'w' y 's'
Rotación sobre eje y --> 'ArrowLeft' y 'ArrowRight'
// Esta rotación es para "voltear la cabeza" a  la izquierda o a la derecha

También creamos una clase Shape que se va a encargar de guardar todos los atributos necesarios para poder dibujar un objeto. Cuando se instancia un Shape se crean sus buffers y cuenta con un metodo Draw, con el que se dibujan los triangulos que la componen.

Para la siguiente entrega terminaremos de agregar los elementos restantes y vamos a agregar texturas a los peces y a los arrecifes, además de una fuente de luz.