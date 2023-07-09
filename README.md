# nodejs-redis

####
- HSET cars#a1 name 'fast car' color red year 1950
- FT.CREATE idx:cars ON HASH PREFIX 1 cars# SCHEMA name TEXT year NUMERIC color TAG