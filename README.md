# Fake Store Back

Al principio, este proyecto era más sencillo. Empecé guardando toda la información en simples arrays dentro del propio código: uno para los productos y otro para los usuarios. Esto era útil para empezar y probar la lógica básica, pero tenía un gran inconveniente: cada vez que reiniciaba el servidor, ¡toda la información se perdía!

Para solucionar esto y hacer el proyecto más realista y funcional, lo he mejorado para que utilice una base de datos real con **Supabase**.

Ahora, el proyecto tiene una base de datos con dos tablas principales:
*   **`products`**: Donde se guarda toda la información de los productos.
*   **`users`**: Donde se almacenan los datos de los usuarios, incluyendo sus contraseñas cifradas.

Gracias a esta base de datos, los datos ahora son **permanentes**. Podemos añadir nuevos productos o usuarios, actualizar sus datos o eliminarlos, y toda esa información se conservará aunque el servidor se apague y se vuelva a encender.

---

## Pruebas (Testing)

Para este proyecto, he montado un sistema de pruebas automáticas. El objetivo es asegurarme de que el código que escribo es de buena calidad y, sobre todo, para no romper algo que ya funcionaba cuando añado cosas nuevas.

### Herramientas que he usado

*   **Jest**: Es el programa principal que se encarga de organizar y ejecutar todas las pruebas.

### ¿Cómo ejecutar las pruebas?

Es muy fácil. Para lanzar todas las pruebas, solo tienes que abrir la terminal y escribir:

```bash
npm test
```
Otra opción es:
```bash
npm run test
```
Este comando buscará y ejecutará automáticamente todos los archivos de prueba que están en la carpeta `__tests__`.

### ¿Qué prueba cada archivo?

He organizado las pruebas en varios archivos para que todo esté más ordenado.

#### 1. `__tests__/app.test.ts` (Pruebas básicas de la App)

*   **¿Para qué sirve?** Para lo más fundamental: ver si el servidor está "vivo" y responde.
*   **¿Qué hace?** Comprueba que si le hacemos una petición a la ruta principal (`/`), el servidor responde con un `200 OK`. Si esta prueba pasa, ¡significa que la aplicación ha arrancado bien!

#### 2. `__tests__/products.test.ts` (Pruebas de los Productos)

*   **¿Para qué sirve?** Para asegurar que todo lo relacionado con los productos (lo que se conoce como operaciones CRUD: Crear, Leer, Actualizar y Borrar) funciona como debe ser.
*   **¿Qué hace?**
    *   **`GET /`**: Prueba que podemos pedir y recibir la lista completa de productos.
    *   **`POST /`**: Asegura que podemos crear un producto nuevo si enviamos los datos correctos.
    *   **`PUT /:id`**: Verifica que podemos actualizar la información de un producto que ya existe.
    *   **`DELETE /:id`**: Comprueba que podemos borrar un producto.
    *   También se prueba que la API devuelve los errores correctos, por ejemplo, si intentamos actualizar un producto que no existe.

#### 3. `__tests__/users.test.ts` (Pruebas de los Usuarios)

*   **¿Para qué sirve?** Igual que con los productos, pero para los usuarios. Esta parte es muy importante por la seguridad.
*   **¿Qué hace?**
    *   Prueba las operaciones básicas para crear, ver, actualizar y borrar usuarios.
    *   **Lo más importante:** Verifica que cuando un usuario se registra o cambia su contraseña, **la contraseña se cifra (se le hace un "hash")** antes de guardarse. ¡Esto es crucial para nunca guardar contraseñas en texto plano!

### Nota sobre los "Mocks" (Simulaciones)

Para que las pruebas sean rápidas y no necesiten una base de datos real para funcionar, he usado una técnica llamada "mocking". Básicamente, "simulo" la respuesta de la base de datos (`Supabase`) y de otras librerías (`bcrypt`). De esta forma, puedo probar la lógica de mi aplicación de forma aislada, rápida y predecible.


---

## Cómo Probar la API Manualmente

Para comprobar que el proyecto funciona de forma manual, he usado el plugin **Echo API**. Así puedes hacer peticiones a la API directamente.

Las URLs principales para probar son:

*   Para usuarios: `http://localhost:8080/api/users`
*   Para productos: `http://localhost:8080/api/products`

### Crear un Producto (POST)

Para que la API acepte una petición para crear un nuevo producto, el cuerpo (`body`) de la petición debe tener una estructura como esta:

```json
{
    "title": "Mens Cotton Jacket",
    "price": 55.99,
    "description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    "rating": {
      "rate": 4.7,
      "count": 500
    }
}
```

### Crear un Usuario (POST)

De forma similar, para crear un nuevo usuario, la estructura que espera la API es la siguiente:

```json
{
  "email": "john@gmail.com",
  "username": "johnd",
  "password": "m38rmF$",
  "firstname": "john",
  "lastname": "doe",
  "phone": "1-570-236-7033",
  "street": "new road",
  "number": 7682,
  "city": "kilcoole",
  "zipcode": "12926-3874",
  "lat": "-37.3159",
  "long": "81.1496"
}
```

