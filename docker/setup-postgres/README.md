# Description

This docker-compose setups a development postgres database docker instance.

```Make
# Example Makefile
start-dev-db:
	docker compose --profile dev up -d
stop-dev-db:
	docker compose --profile dev down
```


### Note:
May have to sudo, if you haven't figured out how to run docker without root

### Note 2:
These commands can be easily used in a package.json or run in the terminal

