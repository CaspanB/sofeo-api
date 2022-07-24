--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Debian 14.4-1.pgdg110+1)
-- Dumped by pg_dump version 14.4 (Debian 14.4-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: area; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.area (
    area_id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.area OWNER TO postgres;

--
-- Name: assignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignment (
    assignment_id integer NOT NULL,
    startsat character varying(5),
    endsat character varying(5),
    duration integer,
    description character varying(100),
    helper_id character varying(4),
    status_id integer,
    wt_id character varying(3),
    task_id integer
);


ALTER TABLE public.assignment OWNER TO postgres;

--
-- Name: channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel (
    channel_id integer NOT NULL,
    name character varying(50),
    frequency integer
);


ALTER TABLE public.channel OWNER TO postgres;

--
-- Name: class; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class (
    grade character varying(2) NOT NULL,
    class character varying(3) NOT NULL,
    classrep_id integer
);


ALTER TABLE public.class OWNER TO postgres;

--
-- Name: classrep_material; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classrep_material (
    id integer NOT NULL,
    classrep_id integer,
    material_id integer
);


ALTER TABLE public.classrep_material OWNER TO postgres;

--
-- Name: classrepresentative; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classrepresentative (
    classrep_id integer NOT NULL,
    stand_id integer
);


ALTER TABLE public.classrepresentative OWNER TO postgres;

--
-- Name: gender; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gender (
    gender_id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.gender OWNER TO postgres;

--
-- Name: helper; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.helper (
    helper_id character varying(4) NOT NULL,
    firstname character varying(25),
    lastname character varying(25),
    birthday character varying(10),
    class character varying(5),
    callsign character varying(25),
    gender_id integer,
    team_id integer,
    preferredtasks character varying(100),
    hastime character varying(100)
);


ALTER TABLE public.helper OWNER TO postgres;

--
-- Name: material; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material (
    material_id integer NOT NULL,
    sl_id integer,
    type_id integer,
    description character varying(100)
);


ALTER TABLE public.material OWNER TO postgres;

--
-- Name: stand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stand (
    stand_id integer NOT NULL,
    location character varying(6),
    theme character varying(50),
    description character varying(50)
);


ALTER TABLE public.stand OWNER TO postgres;

--
-- Name: status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status (
    status_id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.status OWNER TO postgres;

--
-- Name: storagelocation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.storagelocation (
    sl_id integer NOT NULL,
    name character varying(50),
    location character varying(6)
);


ALTER TABLE public.storagelocation OWNER TO postgres;

--
-- Name: task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task (
    task_id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.task OWNER TO postgres;

--
-- Name: teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher (
    abbreviation character varying(5) NOT NULL,
    lastname character varying(25),
    assignment character varying(100),
    class character varying(5),
    gender_id integer
);


ALTER TABLE public.teacher OWNER TO postgres;

--
-- Name: team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team (
    team_id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.team OWNER TO postgres;

--
-- Name: type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type (
    type_id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.type OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id character varying(4) NOT NULL,
    password character varying(100),
    loginname character varying(50),
    area_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: walkietalkie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.walkietalkie (
    wt_id character varying(3) NOT NULL,
    owner_id character varying(4),
    fixed_id character varying(4),
    channel_id integer,
    status_id integer NOT NULL
);


ALTER TABLE public.walkietalkie OWNER TO postgres;

--
-- Data for Name: area; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.area (area_id, name) FROM stdin;
0	helfer
1	lehrer
2	klassenvertreter
3	live
4	admin
\.


--
-- Data for Name: assignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignment (assignment_id, startsat, endsat, duration, description, helper_id, status_id, wt_id, task_id) FROM stdin;
\.


--
-- Data for Name: channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel (channel_id, name, frequency) FROM stdin;
1	helfer	\N
\.


--
-- Data for Name: class; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class (grade, class, classrep_id) FROM stdin;
8	5	1
\.


--
-- Data for Name: classrep_material; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classrep_material (id, classrep_id, material_id) FROM stdin;
1	1	1
2	1	5
3	1	6
\.


--
-- Data for Name: classrepresentative; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classrepresentative (classrep_id, stand_id) FROM stdin;
1	1
\.


--
-- Data for Name: gender; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gender (gender_id, name) FROM stdin;
0	männlich
1	weiblich
2	divers
\.


--
-- Data for Name: helper; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.helper (helper_id, firstname, lastname, birthday, class, callsign, gender_id, team_id, preferredtasks, hastime) FROM stdin;
\.


--
-- Data for Name: material; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.material (material_id, sl_id, type_id, description) FROM stdin;
2	3	1	\N
3	3	1	\N
4	3	1	\N
5	3	2	\N
6	3	2	\N
1	3	1	\N
\.


--
-- Data for Name: stand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stand (stand_id, location, theme, description) FROM stdin;
1	\N	\N	\N
\.


--
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.status (status_id, name) FROM stdin;
0	abgemeldet
1	angemeldet
-1	defekt
-2	nicht erschienen
2	nicht erreichbar
\.


--
-- Data for Name: storagelocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.storagelocation (sl_id, name, location) FROM stdin;
1	Innenlager	\N
2	Außenlager	\N
3	Lager Schulgarten	\N
\.


--
-- Data for Name: task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task (task_id, name) FROM stdin;
\.


--
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher (abbreviation, lastname, assignment, class, gender_id) FROM stdin;
\.


--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team (team_id, name) FROM stdin;
1	hof
2	lager
3	zentrale
\.


--
-- Data for Name: type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type (type_id, name) FROM stdin;
0	Bier Tisch
1	Bier Bank
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, password, loginname, area_id) FROM stdin;
\.


--
-- Data for Name: walkietalkie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.walkietalkie (wt_id, owner_id, fixed_id, channel_id, status_id) FROM stdin;
H1	4444	4444	1	0
\.


--
-- Name: area area_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.area
    ADD CONSTRAINT area_pk PRIMARY KEY (area_id);


--
-- Name: assignment assignment_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_pk PRIMARY KEY (assignment_id);


--
-- Name: channel channel_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT channel_pk PRIMARY KEY (channel_id);


--
-- Name: class class_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_pk PRIMARY KEY (grade, class);


--
-- Name: classrep_material classrep_material_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classrep_material
    ADD CONSTRAINT classrep_material_pk PRIMARY KEY (id);


--
-- Name: classrepresentative classrepresentative_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classrepresentative
    ADD CONSTRAINT classrepresentative_pk PRIMARY KEY (classrep_id);


--
-- Name: gender gender_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender
    ADD CONSTRAINT gender_pk PRIMARY KEY (gender_id);


--
-- Name: helper helper_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helper
    ADD CONSTRAINT helper_pk PRIMARY KEY (helper_id);


--
-- Name: helper helper_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helper
    ADD CONSTRAINT helper_un UNIQUE (callsign);


--
-- Name: material material_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pk PRIMARY KEY (material_id);


--
-- Name: stand stand_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stand
    ADD CONSTRAINT stand_pk PRIMARY KEY (stand_id);


--
-- Name: status status_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pk PRIMARY KEY (status_id);


--
-- Name: storagelocation storagelocation_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storagelocation
    ADD CONSTRAINT storagelocation_pk PRIMARY KEY (sl_id);


--
-- Name: task task_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_pk PRIMARY KEY (task_id);


--
-- Name: teacher teacher_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pk PRIMARY KEY (abbreviation);


--
-- Name: team team_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pk PRIMARY KEY (team_id);


--
-- Name: type type_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_pk PRIMARY KEY (type_id);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (user_id);


--
-- Name: walkietalkie walkietalkie_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.walkietalkie
    ADD CONSTRAINT walkietalkie_pk PRIMARY KEY (wt_id);


--
-- Name: walkietalkie walkietalkie_un; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.walkietalkie
    ADD CONSTRAINT walkietalkie_un UNIQUE (fixed_id);


--
-- Name: classrep_material classrep_material_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classrep_material
    ADD CONSTRAINT classrep_material_fk FOREIGN KEY (classrep_id) REFERENCES public.classrepresentative(classrep_id);


--
-- Name: classrep_material classrep_material_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classrep_material
    ADD CONSTRAINT classrep_material_fk_1 FOREIGN KEY (material_id) REFERENCES public.material(material_id);


--
-- PostgreSQL database dump complete
--

