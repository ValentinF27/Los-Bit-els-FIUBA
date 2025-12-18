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
( nickname, nom_completo, email, "contraseña", telefono, ubicacion, instrumento, genero_fav, fecha_nacimiento, genero, fecha_creacion)
VALUES
('OscarRock123', 'Oscar Perez', 'oscarcito@mail.com', 'topsecret', '1145437127', 'CABA, Argentina', 'Guitarra', 'Punk', '1998-04-12', 'M', '2025-12-14 23:53:04'),
('MaggieMarley02', 'Maggie Campbell', 'magicbell@mail.com', 'snoopdogg', '1930468211', 'Kingston, Jamaica', 'Voz', 'Reggae', '2002-11-09', 'F', '2025-12-14 23:56:26'),
('JTsnob13', 'James Taylor Smith', 'jamienofun@mail.com', 'OpenSesame', '3170865531', 'Connecticut, USA', 'Violin', 'Clásica', '1979-02-13', 'M', '2025-12-16 05:12:14');
('ClaveDeSol', 'Sol Pérez', 'solperez@mail.com', 'fititopaez', '1134000001', 'Buenos Aires, Argentina', 'Guitarra', 'Rock', '1994-03-12', 'F', '2025-01-05 10:12:33'),
('MariMonroe1', 'María López', 'maria.lopez@mail.com', 'doremi02', '1134000002', 'Córdoba, Argentina', 'Piano', 'Clásica', '1989-07-21', 'F', '2025-01-07 14:45:10'),
('Prodan23', 'Lucas Fernández', 'lucas.fernandez@mail.com', 'sumomipasion', '1134000003', 'Rosario, Argentina', 'Bajo', 'Rock', '1992-11-05', 'M', '2025-01-10 09:05:44'),
('ClassicSof', 'Sofía Ruiz', 'sofia.ruiz@mail.com', 'tempolento4', '1134000004', 'Mendoza, Argentina', 'Violín', 'Clásica', '1998-01-18', 'F', '2025-01-12 16:22:01'),
('Comp44', 'Ignacio Torres', 'ignacio.t@mail.com', 'compas44', '1134000005', 'La Plata, Argentina', 'Batería', 'Rock', '1990-06-30', 'M', '2025-01-15 11:00:00'),
('Betho', 'Valentina Castro', 'valentina.c@mail.com', 'riverelmasgrande', '1134000006', 'San Juan, Argentina', 'Piano', 'Clásica', '1997-09-14', 'F', '2025-01-18 13:18:55'),
('PappoFan', 'Tomás Herrera', 'tomas.h@mail.com', 'asd1234', '1134000007', 'Mar del Plata, Argentina', 'Guitarra', 'Blues', '1995-04-09', 'M', '2025-01-20 17:45:30'),
('Florchu77', 'Florencia Díaz', 'florencia.d@mail.com', 'copito0', '1134000008', 'Salta, Argentina', 'Voz', 'Soul', '1993-12-02', 'F', '2025-01-23 08:40:12'),
('RitmoNuevo', 'Nicolás Romero', 'nicolas.r@mail.com', 'skrillexmvp', '1134000009', 'Neuquén, Argentina', 'Sintetizador', 'Electrónica', '1988-08-27', 'M', '2025-01-25 21:10:08'),
('Obsesionada', 'Agustina Morales', 'agustina.m@mail.com', 'chano', '1134000010', 'Tucumán, Argentina', 'Teclado', 'Pop', '1999-05-16', 'F', '2025-01-27 10:10:10'),
('LisaUr', 'Patricia Suárez', 'pato.s@mail.com', 'roquefort', '1134000011', 'Montevideo, Uruguay', 'Saxo', 'Jazz', '1985-02-20', 'F', '2025-02-01 12:00:00'),
('LuchiFA', 'Lucía Acosta', 'lucia.a@mail.com', 'clavefapw', '1134000012', 'Santa Fe, Argentina', 'Cello', 'Clásica', '2000-10-02', 'F', '2025-02-03 18:25:41'),
('KMD_Mat', 'Mateo Ríos', 'mateo.r@mail.com', 'acrugoat', '1134000013', 'Pehuajo, Argentina', 'Voz', 'Hip Hop', '1993-02-11', 'M', '2025-02-05 20:10:10'),
('CArito44', 'Carolina Vega', 'carolina.v@mail.com', 'taylorera', '1134000014', 'Río Negro, Argentina', 'Voz', 'Pop', '1988-06-25', 'F', '2025-02-07 09:33:07'),
('Piojoso16', 'Federico Molina', 'federico.m@mail.com', 'messi10', '1134000015', 'Chubut, Argentina', 'Bajo', 'Rock', '1991-09-14', 'M', '2025-02-10 13:59:59'),
('AlmaNoTanFuerte', 'Alma Torres', 'alma.t@mail.com', 'gardelista', '1134000016', 'Jujuy, Argentina', 'Violín', 'Clásica', '2003-01-19', 'F', '2025-02-12 17:45:12'),
('melendi<3', 'Diego Castro', 'diego.c@mail.com', 'fernandoalonso14', '1134000017', 'Madrid, España', 'Guitarra', 'Metal', '1986-04-08', 'M', '2025-02-14 08:08:08'),
('miluchaN', 'Milagros Navarro', 'milagros.n@mail.com', 'poptecla21', '1134000018', 'San Rafael, Argentina', 'Teclado', 'Pop', '1999-07-07', 'F', '2025-02-16 22:12:45'),
('Xeneize12', 'Leonardo Paredes', 'leo.p@mail.com', 'bocaaaaaaaa', '1134000019', 'Pergamino, Argentina', 'Guitarra', 'Blues', '1990-11-03', 'M', '2025-02-18 15:15:15'),
('seminare>>>', 'Emanuel Ortiz', 'emanuel.o@mail.com', 'charly9pisos', '1134000020', 'Bahía Blanca, Argentina', 'Batería', 'Punk', '1994-03-29', 'M', '2025-02-20 19:19:19'),
('paulilondra', 'Paula Ibarra', 'paula.i@mail.com', 'indianajhones', '1134000021', 'Ushuaia, Argentina', 'Voz', 'Indie', '1996-05-10', 'F', '2025-02-22 11:11:11'),
('jazzrules', 'Ramiro Costa', 'ramiro.c@mail.com', 'jazz25', '1134000022', 'New York, USA', 'Teclado', 'Jazz', '1987-12-12', 'M', '2025-02-24 12:12:12'),
('folkenjoyer', 'Camila Peralta', 'camila.p@mail.com', 'solecrack', '1134000023', 'San Martín, Argentina', 'Guitarra', 'Folklore', '2002-09-21', 'F', '2025-02-26 13:13:13'),
('synth_score', 'Sebastián Luna', 'sebastian.l@mail.com', 'synthscore27', '1134000024', 'Avellaneda, Argentina', 'Sintetizador', 'Experimental', '1989-02-02', 'M', '2025-03-01 14:14:14'),
('elbajoseescucha', 'Noelia Campos', 'noelia.c@mail.com', 'jazzbass28', '1134000025', 'Quilmes, Argentina', 'Contrabajo', 'Jazz', '1993-06-16', 'F', '2025-03-03 15:15:15'),
('depobrian', 'Brian Silva', 'brian.s@mail.com', 'gallitoenprimera', '1134000026', 'Morón, Argentina', 'Guitarra', 'Metal', '1998-10-10', 'M', '2025-03-05 16:16:16'),
('RochiM', 'Rocío Méndez', 'rocio.m@mail.com', 'gyaradosmerengue', '1134000027', 'Barcelona, España', 'Voz', 'Pop', '2000-01-01', 'F', '2025-03-07 17:17:17'),
('electrobro', 'Iván Quiroga', 'ivan.q@mail.com', 'ivoelcrak', '1134000028', 'Rafaela, Argentina', 'Sampler', 'Electrónica', '1991-04-04', 'M', '2025-03-09 18:18:18'),
('MicaFunesMori', 'Micaela Funes', 'micaela.f@mail.com', 'laspastillas', '1134000029', 'Junín, Argentina', 'Bajo', 'Rock', '1995-07-23', 'F', '2025-03-11 19:19:19'),
('Ale_93', 'Alejandro Núñez', 'alejandro.n@mail.com', 'deriverdecorazon', '1134000030', 'Concordia, Argentina', 'Cello', 'Clásica', '1984-08-08', 'M', '2025-03-13 20:20:20'),
('lolalolita', 'Lola Vázquez', 'lola.v@mail.com', 'loluymati', '1134000031', 'Olavarría, Argentina', 'Voz', 'Indie', '2004-11-11', 'F', '2025-03-15 21:21:21'),
('funkydrums', 'Matías Romero', 'matias.r@mail.com', 'Armaniiii', '1134000032', 'Campana, Argentina', 'Batería', 'Funk', '1992-02-20', 'M', '2025-11-29 22:22:22'),
('jujuu', 'Julieta Alonso', 'julieta.a@mail.com', 'eltacono', '1134000033', 'Chivilcoy, Argentina', 'Violín', 'Clásica', '1997-09-09', 'F', '2025-03-19 23:23:23'),
('Panchoambient', 'Francisco Gil', 'francisco.g@mail.com', 'hacelapersonal', '1134000034', 'Zárate, Argentina', 'Sintetizador', 'Ambient', '1988-06-06', 'M', '2025-03-21 08:08:08'),
('Victorta', 'Victoria Roldán', 'victoria.r@mail.com', 'yahíseva', '1134000035', 'Escobar, Argentina', 'Teclado', 'Pop', '1999-03-13', 'F', '2025-03-23 09:09:09'),
('PerettiNic', 'Nicolás Peretti', 'nicolas.p@mail.com', 'seva', '1134000036', 'San Isidro, Argentina', 'Voz', 'Rap', '1994-12-24', 'M', '2025-03-25 10:10:10'),
('Euge00', 'Eugenia Salas', 'eugenia.s@mail.com', 'sevieneMartínez', '1134000037', 'Pilar, Argentina', 'Guitarra', 'Folk', '1996-05-05', 'F', '2025-03-27 11:11:11'),
('GalettodobleT', 'Joaquín Galetto', 'joaquin.b@mail.com', 'paraelgol', '1134000038', 'Paris, Francia', 'Trompeta', 'Jazz', '1990-10-17', 'M', '2025-03-29 12:12:12'),
('AntoReyes33', 'Antonella Reyes', 'antonella.r@mail.com', 'yvaelterceroyvaelterceroyvaeltercero', '1134000039', 'Azul, Argentina', 'Voz', 'Soul', '2001-08-28', 'F', '2025-03-31 13:13:13'),
('PepeElPollo', 'Maximiliano Soto', 'max.s@mail.com', 'ygoldeRiver', '1134000040', 'Pinamar, Argentina', 'Guitarra', 'Surf Rock', '1987-01-16', 'M', '2025-04-02 14:14:14'),
('ElenaWalsh', 'Elena Rivas', 'elena.r@mail.com', 'goldeRiveeeeeeeeeeeeeeeer', '1134000041', 'Bariloche, Argentina', 'Voz', 'Alternativo', '1993-11-06', 'F', '2025-04-04 15:15:15'),
('CristianoPenaldo', 'Cristian Delgado', 'cristian.d@mail.com', '91218NOTELAOLVIDAS', '1134000042', 'Esquel, Argentina', 'Guitarra', 'Progresivo', '1985-09-09', 'M', '2025-04-06 16:16:16');

-- =========================
-- USUARIOS (DATOS DE PRUEBA)
-- =========================


INSERT INTO public.partituras
(nombre, usuario_id, pdf, audio, artista, genero, instrumento, nivel, duracion, descripcion, fecha_creacion, fecha_modificacion, imagen)
VALUES
('Don''t Stop Me Now', 1, '/media/pdfs/dont_stop_me_now_queen.pdf', '/media/audios/dont_stop_me_now_queen.mp3', 'Queen', 'Rock', 'Piano', 'Fácil', '3:35',
 'Transcripción a oído de uno de mis temas favoritos de la banda. Si encuentro tiempo la próxima semana, intentaré arreglar unos errores de la outro.',
 '2025-12-16 02:02:26', '2025-12-16 02:02:26', '/media/imagenes/queen.jpg'),

('Englishmen in New York', 2, '/media/pdfs/englishmen_in_new_york_sting.pdf', '/media/audios/englishmen_in_new_york_sting.mp3', 'Sting', 'Jazz', 'Guitarra', 'Fácil', '4:11',
 'Ahí va mi interpretación de este temazo de Sting. Puede que algún acorde se me haya escapado, ¡pero es más divertido tocarla así!',
 '2025-12-16 02:47:11', '2025-12-16 02:47:11', '/media/imagenes/sting.jpg'),

('Highway to Hell', 1, '/media/pdfs/highway_to_hell_acdc.pdf', '/media/audios/highway_to_hell_acdc.mp3', 'ACDC', 'Hard Rock', 'Guitarra', 'Intermedia', '3:29',
 'Comparto la partitura de este himno del Rock. Gran solo para ir ganando experiencia en el instrumento.',
 '2025-12-16 18:36:35', '2025-12-16 18:36:35', '/media/imagenes/acdc.jpg');

('Bohemian Rhapsody', 12, '/media/pdfs/bohemian_rhapsody_queen.pdf', '/media/audios/bohemian_rhapsody_queen.mp3', 'Queen', 'Rock', 'Piano', 'Fácil', '5:40',
 'Gran tema con un gran trasfondo, espero les sirva','2025-12-17 17:23:22', '2025-12-17 17:23:22', '/media/imagenes/queen.jpg' )

('Feel Good Inc.', 27, '/media/pdfs/feel_good_inc_gorillaz.pdf', '/media/audios/feel_good_inc_gorillaz.mp3', 'Gorillaz', 'Rock Alternativo', 'Guitarra', 'Fácil', '3:41', 
 'Una masa de tema, de lo mejorcito del 2005','2025-12-17 17:25:52', '2025-12-17 17:25:52', '/media/imagenes/gorillaz.jpg' )

('Imagine', 27, '/media/pdfs/imagine_john_lennon.pdf', '/media/audios/imagine_john_lennon.mp3', 'John Lennon', 'Soft Rock', 'Piano', 'Intermedia', '3:05', 
 'El mejor tema, del mejor de todos','2025-12-17 17:21:52', '2025-12-17 17:21:52', '/media/imagenes/john_lennon.jpg' )

('Under The Bridge', 18, '/media/pdfs/under_the_bridge_rhcp.pdf', '/media/audios/under_the_bridge_rhcp.mp3', 'Red Hot Chili Peppers', 'Rock Indie', 'Guitarra', 'Intermedia', '4:30', 
 'Aguante los Chili y aguante el rockk!!!!','2025-12-17 17:30:52', '2025-12-17 17:30:52', '/media/imagenes/rhcp.jpg' )

('Scar Tissue', 18, '/media/pdfs/scar_tissue_rhcp.pdf', '/media/audios/scar_tissue_rhcp.mp3', 'Red Hot Chili Peppers', 'Rock Indie', 'Guitarra', 'Dificil', '3:32', 
 'Les dejo otra joya de los Chili, que la disfruten!','2025-12-17 17:31:50', '2025-12-17 17:31:50', '/media/imagenes/rhcp.jpg' )

('The Simpsons', 44, '/media/pdfs/simpsons.pdf', '/media/audios/simpsons.mp3', 'The Simpsons', 'Tema Principal', 'Piano', 'Fácil', '2:33', 
 'Un gran tema que todos conocen, ideal para principiantes que esten aprendiendo','2025-12-17 18:00:02', '2025-12-17 18:00:02', '/media/imagenes/simpsons.jpg' )

('', 30, '/media/pdfs/imagine_john_lennon.pdf', '/media/audios/imagine_john_lennon.mp3', 'John Lennon', 'Soft Rock', 'Piano', 'Intermedia', '3:05', 
 'El mejor tema, del mejor de todos','2025-12-17 17:21:52', '2025-12-17 17:21:52', '/media/imagenes/john_lennon.jpg' )

('Never Gonna Give You Up', 6, '/media/pdfs/never_gonna_give_you_up_rick_astley.pdf', '/media/audios/never_gonna_give_you_up_rick_astley.mp3', 'Rick Astley', 'Pop', 
'Piano', 'Intermedia', '3:16', 'Gran tema, para que puedan rickrollear a quien les plazca','2025-12-17 18:30:52', '2025-12-17 18:30:52', '/media/imagenes/rick_astley.jpg' )

('Clint Eastwood', 10, '/media/pdfs/clint_eastwood_gorillaz.pdf', '/media/audios/clint_eastwood_gorillaz.mp3', 'Gorillaz', 'Rock Alternativo', 
'Bateria', 'Intermedia', '5:44', 'Les dejo este temazo que no salia de mi mp3','2025-12-17 19:10:52', '2025-12-17 19:10:52', '/media/imagenes/gorillaz.jpg' )

('Smells Like Teen Spirit', 10, '/media/pdfs/smells_like_teen_spirit_nirvana.pdf', '/media/audios/smells_like_teen_spirit_nirvana.mp3', 'Nirvana', 'Rock Alternativo', 
'Flauta', 'Fácil', '4:52', 'De lo mejor del rock angloparlante, disfruten','2025-12-17 19:15:50', '2025-12-17 19:15:50', '/media/imagenes/nirvana.jpg' )

('Stressed Out', 24, '/media/pdfs/stressed_out_twenty_one_pilots.pdf', '/media/audios/stressed_out_twenty_one_pilots.mp3', 'Twenty One Pilots', 'Rock Indie', 
'Bateria', 'Intermedio', '3:21', 'Les dejo esta joya de la decada del  2010','2025-12-17 19:20:07', '2025-12-17 19:20:07', '/media/imagenes/twenty_one_pilots.jpg' )

('Heathens', 24, '/media/pdfs/heathens_twenty_one_pilots.pdf', '/media/audios/heathens_twenty_one_pilots.mp3', 'Twenty One Pilots', 'Rock Indie', 
'Piano', 'Intermedio', '3:15', 'Aca otro temon de TOP, para los que ya sepan un poco de piano','2025-12-17 19:24:17', '2025-12-17 19:24:17', '/media/imagenes/twenty_one_pilots.jpg' )

('Where Is My Mind', 19, '/media/pdfs/where_is_my_mind_pixies.pdf', '/media/audios/where_is_my_mind_pixies.mp3', 'Pixies (Fight Club)', 'Indie', 
'Piano', 'Intermedio', '3:49', 'Gran tema de una de mis pelis favoritas','2025-12-17 19:24:57', '2025-12-17 19:24:57', '/media/imagenes/pixies.jpg' )

('Gangsta Paradise', 16, '/media/pdfs/gangsta_paradise_coolio.pdf', '/media/audios/gangsta_paradise_coolio.mp3', 'Coolio', 'Hip Hop', 
'Piano', 'Fácil', '4:07', 'Gran tema de la mejor epoca del rap','2025-12-17 19:26:12', '2025-12-17 19:26:12', '/media/imagenes/coolio.jpg' )

('Still D.R.E', 16, '/media/pdfs/still_dre_snoop_dogg.pdf', '/media/audios/still_dre_snoop_dogg.mp3', 'Snoop Dogg', 'Hip Hop', 
'Piano', 'Intermedio', '4:30', 'El mejor tema de rap estadounidense por lejos','2025-12-17 19:26:45', '2025-12-17 19:26:45', '/media/imagenes/snoop_dogg.jpg' )

('In The End', 6, '/media/pdfs/in_the_end_linkin_park.pdf', '/media/audios/in_the_end_linkin_park.mp3', 'Linkin Park', 'Rock Alternativo', 
'Guitarra', 'Fácil', '4:40', 'Dejo un temazo que marco mi adolescencia','2025-12-17 19:27:00', '2025-12-17 19:27:00', '/media/imagenes/linkin_park.jpg' )

('Numb', 33, '/media/pdfs/numb_linkin_park.pdf', '/media/audios/numb_linkin_park.mp3', 'Linkin Park', 'Rock Alternativo', 
'Bateria', 'Dificil', '3:12', 'QEPD Bennington','2025-12-17 19:27:40', '2025-12-17 19:27:40', '/media/imagenes/linkin_park.jpg' )

('What I\'ve done', 33, '/media/pdfs/what_ive_done_linkin_park.pdf', '/media/audios/what_ive_done_linkin_park.mp3', 'Linkin Park', 'Rock Alternativo', 
'Piano', 'Dificil', '3:25', 'Dejo uno de los temas mas conocidos de probablemente mi banda favorita','2025-12-17 19:27:57', '2025-12-17 19:27:57', '/media/imagenes/linkin_park.jpg' )

('Somewhere I Belong', 33, '/media/pdfs/somewhere_i_belong_linkin_park.pdf', '/media/audios/somewhere_i_belong_linkin_park.mp3', 'Linkin Park', 'Rock Alternativo', 
'Piano', 'Dificil', '3:33', 'Esta vez les dejo mi tema preferido, de adolescente me identificaba mucho con esta cancion','2025-12-17 19:28:23', '2025-12-17 19:28:23', '/media/imagenes/linkin_park.jpg' )


-- =========================
-- RESEÑAS (DATOS DE PRUEBA)
-- =========================

INSERT INTO public."reseñas"
(usuario_id, partitura_id, titulo, contenido, estrellas, fecha_creacion, fecha_modificacion)
VALUES
(3, 1, 'Falta práctica',
 'Varios errores en la parte final. Buen intento para esta versión de principiantes, pero hay espacio para mejoras.',
 2, '2025-12-16 05:18:12', '2025-12-16 05:18:12'),

(3, 2, 'Buen trabajo',
 'Pequeños errores no devalúan esta gran composición. Enhorabuena!',
 4, '2025-12-16 05:23:09', '2025-12-16 05:23:09'),

(2, 1, 'Que nostalgia',
 'Una de las canciones favoritas de mis padres. Disfruté mucho aprenderla.',
 5, '2025-12-16 05:25:35', '2025-12-16 05:25:35');

