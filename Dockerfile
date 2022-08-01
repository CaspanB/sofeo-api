FROM postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB sofeo
COPY sofeo-api.sql /docker-entrypoint-initdb.d/
