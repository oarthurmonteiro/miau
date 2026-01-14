CREATE USER miau_app WITH PASSWORD '3LKx3ZlDEMXesRIYpG2WlpBfL7FN5kdn';

CREATE DATABASE miau OWNER miau_app;

-- openssl rand -base64 32
-- tr -dc A-Za-z0-9_ < /dev/urandom | head -c 32 | xargs