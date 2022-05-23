install:
	npm ci

lint:
	npx eslint .

test-coverage:
	npm test -- --coverage --coverageProvider=v8

build:
	rm -rf dist
	NODE_ENV=production npx webpack

develop:
	npx webpack serve