# Description

This docker-compose setups a development postgres database docker instance

```Make
# Example Makefile
## Note: May have to sudo, if you haven't figured out how to run docker without root
## Note 2: These commands can be easily added to a package.json if you want as well
start-dev-db:
	docker compose --profile dev up -d
stop-dev-db:
	docker compose --profile dev down
```

