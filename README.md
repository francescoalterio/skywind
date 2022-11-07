<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Skywind</h3>

  <p align="center">
    Framework Web, liviano, rapido y minimalista!
    <br />
    <br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#create-a-project">Create a project</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#folder-structure">Folder Structure</a></li>
        <li><a href="#pages-folder">Pages Folder</a></li>
        <li><a href="#skywind-templates">Skywind Templates</a></li>
        <li><a href="#components">Components</a></li>
        <li><a href="#styles">Styles</a></li>
        <li><a href="#api-folder">API Folder</a></li>
      </ul>
    </li>
    <li><a href="#build-folder">Build Folder</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Skywind hace sencillo la creacion de paginas webs con Server Side Rendering y Javascript. Su sencilles y su poca cantidad de dependencias le permite ser ejecutado en cualquier servidor de node. Skywind le permite granular sus paginas a pequeños componentes que se pueden reutilizar en cualquier parte de su pagina web.

Posee un sistema de enrutamiento bastante intuitivo, poderoso y facil de aprender, tambien le permite la creacion de APIs utilizando el modulo HTTP de node.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Getting Started

Skywind cuenta con una plantilla de inicio la cual se llama Create Skywind App, la cual usaremos para iniciar nuestro primer proyecto.

### Create a project

Para crear nuestro primer proyecto debemos tener instalado node y npm, nos dirijiremos a la carpeta donde queramos crear nuestro proyecto y ejecutamos el sigiente comando: 

* npx
  ```sh
  npx create-skywind-app@latest my-project
  ```

### Installation

Cuando la plantilla del proyecto termine su instalacion, nos debemos dirijir a dicha carpeta y luego instalar las dependencias con el siguiente comando: 

* npm
   ```sh
   npm install
   ```

Luego de instalar las dependencias, debemos construir la aplicacion utilizando el siguiente comando: 

* npm
   ```sh
   npm run build
   ```

Y por ultimo ya podemos iniciar nuestro servidor de desarrollo.

* npm
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Usage

Luego de ejecutar todos los comandos e iniciar el servidor de desarrollo podemos apreciar una estructura de carpetas un poco peculiar.

![Product Name Screen Shot](https://raw.githubusercontent.com/francescoalterio/skywind-assets/master/folder-structure.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Pages Folder

La carpeta Pages es la mas importante de todas, es la carpeta que le da vida a todo el Framework y esta es indispensable para la construccion de cualquier pagina web con Skywind.

Como ya se mencionó, la carpeta pages no es una simple carpeta ya que esta define el enrutamiento de todo el proyecto.

Al iniciar el proyecto, esta carpeta posee un index.js, una carpeta api y dentro de la carpeta api otro index.js. Toda carpeta o archivo dentro de la carpeta pages se convierte automaticamente en una ruta. Ejemplo: si tenemos una carpeta store y dentro un archivo product.js, nustra web poseerá una ruta /store/product solo con crear los archivos y carpetas.

Como se mencionó, la carpeta pages posee dentro una carpeta api, todos los archivos y carpetas fuera de la carpeta api podran renderizar HTML, y todos los archivos y carpetas dentro de api seran tratados como endpoints teniendo acceso a Request y Response.

### Skywind Templates

Todos los archivos dentro de la carpeta pages y fuera de la carpeta api son tratados como Skywind Templates.

Los Skywind Templates son archivos capaces de ejecutar javascript en el lado del servidor y retornar un codigo HTML que será enviado al cliente para representar una pagina web.

```jsx
<>
    <html>
        <head></head>
        <body>
            <h1>This is the index</h1>
        </body>
    </html>
</>
```

Todo Skywind está dividido en dos partes, el codigo Javascript y el codigo HTML, para hacer referencia a codigo HTML debe utilizar los siguientes simbolos <></>, Todo codigo HTML dentro de estos simbolos será enviado al cliente.

Si deseamos utilizar codigo javascript, debemos hacerlo antes del HTML, de la siguiente manera.

```jsx
const hello = 'Hello world';

<>
    <html>
        <head></head>
        <body>
            <h1>This is the index</h1>
            <p>${hello}</p>
        </body>
    </html>
</>
```
Para interpolar valores dentro del HTML podemos hacerlo utilizando la sintaxis de los Template Strings "${}".

Si necesitamos renderizar un HTML u otro dependiendo de una condicion, podemos utilizar el operador ternario de Javascript de la sigiente manera:

```jsx
const hello = 'Hello world';
const bool = true;

<>
    <html>
        <head></head>
        <body>
            <h1>This is the index</h1>
            <p>${hello}</p>
            ${bool ? <><p>Hello</p></> : <><p>World</p></>}
        </body>
    </html>
</>
```
Debemos recordar que todo codigo HTML debe estar envuelo en <></>.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Components

Los componentes tambien son Skywind Templates, la diferencia de llamarlos componentes es que estos puedes ser guardados en cualquier carpeta del proyecto (Recomendamos utilizar la carpeta components que viene por defecto con create-skywind-app) excepto la carpeta pages y pueden ser reutilizados en diferentes paginas u otros componentes.

Estos componentes tan solo poseen una regla a la hora de crearlos, el nombre del archivo será el del componente y este nombre debe poseer su primera letra en Mayusculas, veamos un ejemplo de un componente.

```jsx
// components/Button.js

const { content } = props;

<>
    <button>${content}</button>
</>
```

```jsx
// pages/index.js

import Button from '../components/Button.js'

const hello = 'Hello world';
const bool = false;

<>
    <html>
        <head></head>
        <body>
            <h1>This is the index</h1>
            <p>${hello}</p>
            ${bool ? <><p>Hello</p></> : <><p>World</p></>}
            <Button content="This is a button with props"/>
        </body>
    </html>
</>
```

Hemos creado un componente Button.js y los hemos implementado en nuestra pagina principal.

Lo primero que hemos creado fue el componente como cualquier otro Skywind Template, la unica diferencia es que estamos obteniendo un valor de un objeto props del cual aun no no tenemos informacion, pero no se preocupe, dentro de poco cobrará sentido.

Lo segundo que hemos hecho fue importar el componente Button a nuestra pagina principal y lo hemos implementado como una etiqueta HTML. De esta manera se implementan los componentes que creemos. 

Si nos percatamos bien, en la implementacion del componente Button podemos ver que le estamos pasando una propiedad content que posee un valor de "This is a button with props", el cual es la misma propiedad que estamos obteniendo del objeto props en Button.js. Cualquier propiedad que le pasemos al componente podrá recuperarse en el componente utilizando el objeto props.

Si el valor de la propiedad que queremos pasar al componente es un string, podemos utilizar directamente las comillas luego del =, pero si es un valor diferente debemos utilizar {} y dentro de estas colocar el valor.

```jsx
// pages/index.js

import Button from '../components/Button.js'

const hello = 'Hello world';
const bool = false;

<>
    <html>
        <head></head>
        <body>
            <h1>This is the index</h1>
            <p>${hello}</p>
            ${bool ? <><p>Hello</p></> : <><p>World</p></>}
            <Button content={hello}/>
        </body>
    </html>
</>
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Styles

En la raiz del proyecto existe otra carpeta que no hemos mencionado, las cual es la carpeta Styles, esta carpeta tambien es indispensable para Skywind, ya que en esta carpeta se deben agregar todos los archivos css que se utilizarán en el proyecto.

luego de agregar los archivos css en la carpeta debemos importarlos en nuestros componentes y paginas. Para evitar confudir importaciones locales, importaciones de componentes e importaciones de estilos, Skywind provee un método llamado importStylesheet, el cual importa una hoja de estilos css a nuestros componentes y paginas. Dicho metodo debe utilizarse a través de la clase Skywind.

```css
h1 {
    color:aquamarine;
}
```

```jsx
// pages/index.js

import Skywind from "skywind"
import Button from '../components/Button.js'

Skywind.importStylesheet('index.css');

const hello = 'Hello world';
const bool = false;

<>
    <html>
        <head></head>
        <body>
            <h1>This is the index</h1>
            <p>${hello}</p>
            ${bool ? <><p>Hello</p></> : <><p>World</p></>}
            <Button content="This is a button with props"/>
        </body>
    </html>
</>
```

Cabe mencionar que la ruta especificada en el método importStylesheet debe tomar como referencia de inicio la carpeta styles, ya que Skywind buscara dichos archivos directamente en la carpeta styles.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### API Folder

Dentro de la carpeta pages existe otra carpeta con el nombre de api, esta carpeta posee un trato particular en el proyecto, ya que todos los archivos dentro de ella no son tomados como Skywind Templates, sino como endpoints con acceso a Request y Response.

```js
// pages/api/index.js

export default function home(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ a: 67 }));
}
```

Cualquier archivo dentro de la carpeta api debe poseer una funcion que debe ser exportada de manera default, dicha funcion tiene acceso a dos parametros request y response, los cuales provienen del modulo HTTP de node.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Build Folder

En la raiz de nuestro proyecto queda una última carpeta con el nombre de build.

El objetivo de las Skywind Templates es facilitar y acortar la construcción de páginas web, pero estas plantillas no son código javascript válido para el servidor. Skywind para esto ejecuta un compilador para convertir el código de Skywind Templates a código javascript válido, y esta contrucción la genera en la carpeta build.

Si ponemos atención en nustro archivo index.js de la raiz del proyecto notamos que este archivo es el punto de entrada y tan solo ejecuta un método llamado compile.

```js
// index.js

import Skywind, {Compiler} from 'skywind';
 
Compiler.compile(process.cwd())
```

Pero si observamos el index.js de la carpeta build encontramos un método diferente.

```js
// build/index.js

import Skywind from 'skywind';

Skywind.createApp('localhost', process.env.PORT, process.cwd())
```

En la carpeta build se ejecuta un método createApp el cual tiene como objetivo levantar el servidor y toda la web que hemos construido pero con la excepcion que el código que se encuentra en la carpeta build si es codigo valido para Javascript.

Cada que hagamos un cambio en nuestro proyecto, el compilador se ejecutará y modificará la carpeta build, iniciando un nuevo servidor con los ultimos cambios de nuestro codigo.

Cabe resaltar que la carpeta build será la que utilizaremos para subir a nuestro servidor web, ya que esta contiene todo el codigo valido para cualquier servidor de node.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


