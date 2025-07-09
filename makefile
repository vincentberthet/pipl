default: help

help:									## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install:
	@npm install

pull:
	@(git stash > /dev/null || true)
	git pull origin main
	@(git stash pop > /dev/null || true)
	@npm install

build:									## Build the project
	npx turbo run build
	@(cd packages/app/dist && zip -r ../dist.zip . > /dev/null)

dev:									## Start the development server
	npx turbo run build:dev dev

typecheck:								## Run type checks
	npx turbo run typecheck

lint-check:								## Run lint checks
	npx turbo run lint:check

lint-apply:								## Apply lint fixes
	npx turbo run lint:apply
