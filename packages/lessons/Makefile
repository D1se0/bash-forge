.PHONY: lessons lint test

lessons: generate lint

generate:
	node generator.mjs

lint:
	node tools/lint-lessons.mjs

test: lint
