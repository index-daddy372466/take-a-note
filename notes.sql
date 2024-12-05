--
-- PostgreSQL database dump
--

-- Dumped from database version 17rc1
-- Dumped by pg_dump version 17rc1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: expired_note(); Type: FUNCTION; Schema: public; Owner: Daddy
--

CREATE FUNCTION public.expired_note() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
delete from notepad where timestamp < current_timestamp - interval '30 minutes';
return null;
end;
$$;


ALTER FUNCTION public.expired_note() OWNER TO "Daddy";

--
-- Name: expired_user(); Type: FUNCTION; Schema: public; Owner: Daddy
--

CREATE FUNCTION public.expired_user() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
delete from users where timestamp < current_timestamp - interval '30 minutes';
return null;
end;
$$;


ALTER FUNCTION public.expired_user() OWNER TO "Daddy";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: notepad; Type: TABLE; Schema: public; Owner: Daddy
--

CREATE TABLE public.notepad (
    id integer NOT NULL,
    notes text NOT NULL,
    user_id character varying(60) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    unix character varying(60) NOT NULL
);


ALTER TABLE public.notepad OWNER TO "Daddy";

--
-- Name: notepad_id_seq; Type: SEQUENCE; Schema: public; Owner: Daddy
--

CREATE SEQUENCE public.notepad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notepad_id_seq OWNER TO "Daddy";

--
-- Name: notepad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Daddy
--

ALTER SEQUENCE public.notepad_id_seq OWNED BY public.notepad.id;


--
-- Name: notepadv2; Type: VIEW; Schema: public; Owner: Daddy
--

CREATE VIEW public.notepadv2 AS
 SELECT id,
    notes,
    "timestamp",
    unix
   FROM public.notepad;


ALTER VIEW public.notepadv2 OWNER TO "Daddy";

--
-- Name: users; Type: TABLE; Schema: public; Owner: Daddy
--

CREATE TABLE public.users (
    id character varying(65),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO "Daddy";

--
-- Name: notepad id; Type: DEFAULT; Schema: public; Owner: Daddy
--

ALTER TABLE ONLY public.notepad ALTER COLUMN id SET DEFAULT nextval('public.notepad_id_seq'::regclass);


--
-- Data for Name: notepad; Type: TABLE DATA; Schema: public; Owner: Daddy
--

COPY public.notepad (id, notes, user_id, "timestamp", unix) FROM stdin;
1	one note	1733273717830	2024-12-03 19:55:20.619626	1733273720616
2	my note first	1733273697828	2024-12-03 19:55:25.4555	1733273725454
3	okok 	1733273697828	2024-12-03 19:57:17.2271	1733273837225
4	my note	1733273697828	2024-12-03 19:57:20.954405	1733273840952
5	idk	1733273861354	2024-12-03 19:57:44.694543	1733273864692
7	ok then	1733273909472	2024-12-03 19:58:34.702906	1733273914701
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: Daddy
--

COPY public.users (id, "timestamp") FROM stdin;
1733273697828	2024-12-03 19:54:57.839134
1733273717830	2024-12-03 19:55:17.835198
1733273861354	2024-12-03 19:57:41.365398
1733273909472	2024-12-03 19:58:29.482642
1733274168359	2024-12-03 20:02:48.375315
1733274365689	2024-12-03 20:06:05.699706
1733274775659	2024-12-03 20:12:55.669148
\.


--
-- Name: notepad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Daddy
--

SELECT pg_catalog.setval('public.notepad_id_seq', 7, true);


--
-- Name: notepad notepad_pkey; Type: CONSTRAINT; Schema: public; Owner: Daddy
--

ALTER TABLE ONLY public.notepad
    ADD CONSTRAINT notepad_pkey PRIMARY KEY (id);


--
-- Name: notepad expired_note; Type: TRIGGER; Schema: public; Owner: Daddy
--

CREATE TRIGGER expired_note AFTER INSERT ON public.notepad FOR EACH STATEMENT EXECUTE FUNCTION public.expired_note();


--
-- Name: users expired_user; Type: TRIGGER; Schema: public; Owner: Daddy
--

CREATE TRIGGER expired_user BEFORE INSERT ON public.users FOR EACH STATEMENT EXECUTE FUNCTION public.expired_user();


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT CREATE ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

