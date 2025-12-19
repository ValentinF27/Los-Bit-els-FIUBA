# Trabajo practico final

## Descripción
Este proyecto es una pagina web orientada a músicos. La plataforma cuenta con un **Home**, una página de **Usuarios** y una página de **Partituras**.  
Los usuarios pueden registrarse, subir partituras y otros usuarios pueden dejar reseñas sobre dichas partituras, fomentando la interacción y el intercambio de material musical.

---

## Tecnologías utilizadas
- **Backend**: Node.js, Express  
- **Base de datos**: PostgreSQL  
- **Frontend**: HTML, CSS, JavaScript  
- **Contenedores**: Docker  

---

## Entidades y relaciones

### Usuarios
Tabla `usuarios`:

- `id` (PK)
- `nickname` (único)
- `nom_completo`
- `email` (único)
- `contraseña`
- `telefono`
- `ubicacion`
- `instrumento`
- `genero_fav`
- `fecha_nacimiento`
- `genero` (`M`, `F`, `X`)
- `fecha_creacion`

**Relaciones**
- Un usuario puede subir muchas partituras.
- Un usuario puede escribir muchas reseñas.

**CRUD**
- **Create**: registrar un nuevo usuario.
- **Read**: ver perfil de usuarios.
- **Update**: modificar datos de un usuario.
- **Delete**: eliminar un usuario (también elimina sus partituras y reseñas asociadas).

---

### Partituras
Tabla `partituras`:

- `id` (PK)
- `nombre`
- `usuario_id` (FK → usuarios)
- `pdf`
- `audio`
- `artista`
- `genero`
- `instrumento`
- `nivel`
- `duracion`
- `descripcion`
- `imagen`
- `fecha_creacion`
- `fecha_modificacion`

**Relaciones**
- Cada partitura pertenece a un usuario.
- Una partitura puede tener muchas reseñas.

**CRUD**
- **Create**: subir una nueva partitura.
- **Read**: buscar partituras por nombre/artista/genero/instrumento y ver información.
- **Update**: modificar la información de una partitura.
- **Delete**: eliminar una partitura (elimina sus reseñas asociadas).

---

### Reseñas
Tabla `reseñas`:

- `id` (PK)
- `usuario_id` (FK → usuarios)
- `partitura_id` (FK → partituras)
- `titulo`
- `contenido`
- `estrellas` (1 a 5)
- `fecha_creacion`
- `fecha_modificacion`

**Relaciones**
- Una reseña pertenece a un usuario.
- Una reseña pertenece a una partitura.

**CRUD**
- **Create**: crear una reseña para una partitura.
- **Read**: ver reseñas de una partitura.
- **Update**: editar una reseña existente.
- **Delete**: eliminar una reseña.

---

## Puertos
- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:8080/home.html`

---

## Instalación y ejecución

```bash
# Clonar el repositorio
git clone git@github.com:ValentinF27/Los-Bit-els-FIUBA.git

# Correr el Backend
cd Backend
make deps
make run

# Correr el Frontend
cd Frontend
npx http-server

# Correr database
make db

# Entrar a database
make enter_db


