# Dev environment
vor-env:
	docker build -t vor_env -f docker/vor.Dockerfile ./docker
	docker run -it -p 8545:8545 vor_env

dev-up:
	echo "Run: 'sudo service postgresql stop' if postgres container does not start"
	@rm -rf ./logs
	@mkdir -p logs
	docker-compose -f docker-compose.yml down --remove-orphans
	docker-compose -f docker-compose.yml up --build 2>&1 | tee logs/log.txt

dev-down:
	docker-compose -f docker-compose.yml down --remove-orphans

.PHONY: vor-env
