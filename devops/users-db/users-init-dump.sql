--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Debian 15.2-1.pgdg110+1)
-- Dumped by pg_dump version 15.2

-- Started on 2023-05-03 08:52:31 UTC

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

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: root
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO root;

--
-- TOC entry 3356 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: root
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16526)
-- Name: roles; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    value character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO root;

--
-- TOC entry 214 (class 1259 OID 16525)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO root;

--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 214
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 219 (class 1259 OID 16546)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    "roleId" integer,
    "userId" integer
);


ALTER TABLE public.user_roles OWNER TO root;

--
-- TOC entry 218 (class 1259 OID 16545)
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_roles_id_seq OWNER TO root;

--
-- TOC entry 3359 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- TOC entry 217 (class 1259 OID 16535)
-- Name: users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    nickname character varying
);


ALTER TABLE public.users OWNER TO root;

--
-- TOC entry 216 (class 1259 OID 16534)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO root;

--
-- TOC entry 3360 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3186 (class 2604 OID 16529)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 3188 (class 2604 OID 16549)
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- TOC entry 3187 (class 2604 OID 16538)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3346 (class 0 OID 16526)
-- Dependencies: 215
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.roles (id, value, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3350 (class 0 OID 16546)
-- Dependencies: 219
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.user_roles (id, "roleId", "userId") FROM stdin;
\.


--
-- TOC entry 3348 (class 0 OID 16535)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.users (id, email, password, "createdAt", "updatedAt", nickname) FROM stdin;
\.


--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 214
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, true);


--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 1, false);


--
-- TOC entry 3363 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 3190 (class 2606 OID 16531)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3192 (class 2606 OID 16533)
-- Name: roles roles_value_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_value_key UNIQUE (value);


--
-- TOC entry 3198 (class 2606 OID 16551)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3200 (class 2606 OID 16553)
-- Name: user_roles user_roles_roleId_userId_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_roleId_userId_key" UNIQUE ("roleId", "userId");


--
-- TOC entry 3194 (class 2606 OID 16544)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3196 (class 2606 OID 16542)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3201 (class 2606 OID 16554)
-- Name: user_roles user_roles_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3202 (class 2606 OID 16559)
-- Name: user_roles user_roles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: root
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2023-05-03 08:52:31 UTC

--
-- PostgreSQL database dump complete
--

