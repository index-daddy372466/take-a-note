--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

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
-- Name: daddynotes; Type: SCHEMA; Schema: -; Owner: Daddy
--

CREATE SCHEMA daddynotes;


ALTER SCHEMA daddynotes OWNER TO "Daddy";

--
-- Name: daddyusers; Type: SCHEMA; Schema: -; Owner: Daddy
--

CREATE SCHEMA daddyusers;


ALTER SCHEMA daddyusers OWNER TO "Daddy";

--
-- Name: expired_note(); Type: FUNCTION; Schema: daddyusers; Owner: Daddy
--

CREATE FUNCTION daddyusers.expired_note() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
delete from notepad where timestamp < current_timestamp - interval '30 minutes';
return null;
end;
$$;


ALTER FUNCTION daddyusers.expired_note() OWNER TO "Daddy";

--
-- Name: expired_user(); Type: FUNCTION; Schema: daddyusers; Owner: Daddy
--

CREATE FUNCTION daddyusers.expired_user() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
delete from users where timestamp < current_timestamp - interval '30 minutes';
return null;
end;
$$;


ALTER FUNCTION daddyusers.expired_user() OWNER TO "Daddy";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: notepad; Type: TABLE; Schema: daddyusers; Owner: Daddy
--

CREATE TABLE daddyusers.notepad (
    id integer NOT NULL,
    notes character varying(60) NOT NULL,
    user_id character varying(60) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    unix character varying(60) NOT NULL
);


ALTER TABLE daddyusers.notepad OWNER TO "Daddy";

--
-- Name: notepad_id_seq; Type: SEQUENCE; Schema: daddyusers; Owner: Daddy
--

CREATE SEQUENCE daddyusers.notepad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE daddyusers.notepad_id_seq OWNER TO "Daddy";

--
-- Name: notepad_id_seq; Type: SEQUENCE OWNED BY; Schema: daddyusers; Owner: Daddy
--

ALTER SEQUENCE daddyusers.notepad_id_seq OWNED BY daddyusers.notepad.id;


--
-- Name: users; Type: TABLE; Schema: daddyusers; Owner: Daddy
--

CREATE TABLE daddyusers.users (
    id character varying(65),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE daddyusers.users OWNER TO "Daddy";

--
-- Name: notepad id; Type: DEFAULT; Schema: daddyusers; Owner: Daddy
--

ALTER TABLE ONLY daddyusers.notepad ALTER COLUMN id SET DEFAULT nextval('daddyusers.notepad_id_seq'::regclass);


--
-- Data for Name: notepad; Type: TABLE DATA; Schema: daddyusers; Owner: Daddy
--

COPY daddyusers.notepad (id, notes, user_id, "timestamp", unix) FROM stdin;
1	current_user	1736781593182	2025-01-13 10:20:23.924325	PostgreSQL 17
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: daddyusers; Owner: Daddy
--

COPY daddyusers.users (id, "timestamp") FROM stdin;
1736781567679	2025-01-13 10:19:27.928048
1736781593182	2025-01-13 10:19:53.376367
\.


--
-- Name: notepad_id_seq; Type: SEQUENCE SET; Schema: daddyusers; Owner: Daddy
--

SELECT pg_catalog.setval('daddyusers.notepad_id_seq', 1, true);


--
-- Name: notepad notepad_pkey; Type: CONSTRAINT; Schema: daddyusers; Owner: Daddy
--

ALTER TABLE ONLY daddyusers.notepad
    ADD CONSTRAINT notepad_pkey PRIMARY KEY (id);


--
-- Name: notepad expired_note; Type: TRIGGER; Schema: daddyusers; Owner: Daddy
--

CREATE TRIGGER expired_note AFTER INSERT ON daddyusers.notepad FOR EACH STATEMENT EXECUTE FUNCTION daddyusers.expired_note();


--
-- Name: users expired_user; Type: TRIGGER; Schema: daddyusers; Owner: Daddy
--

CREATE TRIGGER expired_user BEFORE INSERT ON daddyusers.users FOR EACH STATEMENT EXECUTE FUNCTION daddyusers.expired_user();


--
-- Name: SCHEMA daddynotes; Type: ACL; Schema: -; Owner: Daddy
--

GRANT USAGE ON SCHEMA daddynotes TO reguser_503;


--
-- Name: SCHEMA daddyusers; Type: ACL; Schema: -; Owner: Daddy
--

GRANT USAGE ON SCHEMA daddyusers TO reguser_503;


--
-- Name: FUNCTION expired_note(); Type: ACL; Schema: daddyusers; Owner: Daddy
--

GRANT ALL ON FUNCTION daddyusers.expired_note() TO reguser_503;


--
-- Name: TABLE notepad; Type: ACL; Schema: daddyusers; Owner: Daddy
--

GRANT SELECT,INSERT,DELETE ON TABLE daddyusers.notepad TO reguser_503;


--
-- Name: SEQUENCE notepad_id_seq; Type: ACL; Schema: daddyusers; Owner: Daddy
--

GRANT ALL ON SEQUENCE daddyusers.notepad_id_seq TO reguser_503;


--
-- Name: TABLE users; Type: ACL; Schema: daddyusers; Owner: Daddy
--

GRANT SELECT,INSERT,DELETE ON TABLE daddyusers.users TO reguser_503;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: daddyusers; Owner: Daddy
--

ALTER DEFAULT PRIVILEGES FOR ROLE "Daddy" IN SCHEMA daddyusers GRANT ALL ON SEQUENCES TO reguser_503;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: daddyusers; Owner: Daddy
--

ALTER DEFAULT PRIVILEGES FOR ROLE "Daddy" IN SCHEMA daddyusers GRANT ALL ON FUNCTIONS TO reguser_503;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: daddyusers; Owner: Daddy
--

ALTER DEFAULT PRIVILEGES FOR ROLE "Daddy" IN SCHEMA daddyusers GRANT SELECT,INSERT,DELETE ON TABLES TO reguser_503;


--
-- PostgreSQL database dump complete
--

