-- =========================
-- TABLA usuarios
-- =========================
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(50) NOT NULL UNIQUE,
  nom_completo VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  contraseña VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  ubicacion VARCHAR(100),
  instrumento VARCHAR(50),
  genero_fav VARCHAR(50),
  fecha_nacimiento DATE,
  genero CHAR(1) CHECK (genero IN ('M','F','X')),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA partituras
-- =========================
CREATE TABLE partituras (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  pdf VARCHAR(255) NOT NULL,
  audio VARCHAR(255),
  artista VARCHAR(255),
  genero VARCHAR(100),
  instrumento VARCHAR(100),
  nivel VARCHAR(50),
  duracion VARCHAR(10),
  descripcion TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  imagen VARCHAR(255)
);

-- =========================
-- TABLA reseñas
-- =========================
CREATE TABLE reseñas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  partitura_id INTEGER NOT NULL REFERENCES partituras(id) ON DELETE CASCADE,
  titulo VARCHAR(255),
  contenido TEXT NOT NULL,
  estrellas INTEGER CHECK (estrellas BETWEEN 1 AND 5),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- USUARIOS (DATOS DE PRUEBA)
-- =========================

INSERT INTO public.usuarios
(id, nickname, nom_completo, email, contraseña, telefono, ubicacion, instrumento, genero_fav, fecha_nacimiento, genero, fecha_creacion)
VALUES
(1, 'OscarRock123', 'Oscar Perez', 'oscarcito@mail.com', 'topsecret', '1145437127', 'CABA, Argentina', 'Guitarra', 'Punk', '1998-04-12', 'M', '2025-12-14 23:53:04'),
(2, 'MaggieMarley02', 'Maggie Campbell', 'magicbell@mail.com', 'snoopdogg', '1930468211', 'Kingston, Jamaica', 'Voz', 'Reggae', '2002-11-09', 'F', '2025-12-14 23:56:26'),
(3, 'JTsnob13', 'James Taylor Smith', 'jamienofun@mail.com', 'OpenSesame', '3170865531', 'Connecticut, USA', 'Violin', 'Clásica', '1979-02-13', 'M', '2025-12-16 05:12:14');

-- =========================
-- PARTITURAS (DATOS DE PRUEBA)
-- =========================

INSERT INTO public.partituras
(id, nombre, usuario_id, pdf, audio, artista, genero, instrumento, nivel, duracion, descripcion, fecha_creacion, fecha_modificacion, imagen)
VALUES
(1, 'Don''t Stop Me Now', 1, '/media/pdfs/dont_stop_me_now_queen.pdf', '/media/audios/dont_stop_me_now_queen.mp3', 'Queen', 'Rock', 'Piano', 'Fácil', '3:35',
 'Transcripción a oído de uno de mis temas favoritos de la banda. Si encuentro tiempo la próxima semana, intentaré arreglar unos errores de la outro.',
 '2025-12-16 02:02:26', '2025-12-16 02:02:26', '/media/imagenes/queen.jpg'),

(2, 'Englishmen in New York', 2, '/media/pdfs/englishmen_in_new_york_sting.pdf', '/media/audios/englishmen_in_new_york_sting.mp3', 'Sting', 'Jazz', 'Guitarra', 'Fácil', '4:11',
 'Ahí va mi interpretación de este temazo de Sting. Puede que algún acorde se me haya escapado, ¡pero es más divertido tocarla así!',
 '2025-12-16 02:47:11', '2025-12-16 02:47:11', '/media/imagenes/sting.jpg'),

(3, 'Highway to Hell', 1, '/media/pdfs/highway_to_hell_acdc.pdf', '/media/audios/highway_to_hell_acdc.mp3', 'ACDC', 'Hard Rock', 'Guitarra', 'Intermedia', '3:29',
 'Comparto la partitura de este himno del Rock. Gran solo para ir ganando experiencia en el instrumento.',
 '2025-12-16 18:36:35', '2025-12-16 18:36:35', '/media/imagenes/acdc.jpg');

-- =========================
-- RESEÑAS (DATOS DE PRUEBA)
-- =========================

INSERT INTO public.reseñas
(id, usuario_id, partitura_id, titulo, contenido, estrellas, fecha_creacion, fecha_modificacion)
VALUES
(1, 3, 1, 'Falta práctica',
 'Varios errores en la parte final. Buen intento para esta versión de principiantes, pero hay espacio para mejoras.',
 2, '2025-12-16 05:18:12', '2025-12-16 05:18:12'),

(2, 3, 2, 'Buen trabajo',
 'Pequeños errores no devalúan esta gran composición. Enhorabuena!',
 4, '2025-12-16 05:23:09', '2025-12-16 05:23:09'),

(3, 2, 1, 'Que nostalgia',
 'Una de las canciones favoritas de mis padres. Disfruté mucho aprenderla.',
 5, '2025-12-16 05:25:35', '2025-12-16 05:25:35');

