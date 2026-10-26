.PHONY: build lessons dev down check test push lint shellcheck install

build:
	npm run build --workspaces --if-present

lessons:
	$(MAKE) -C packages/lessons lessons

dev:
	./bin/bashforge dev

down:
	./bin/bashforge down

check:
	./bin/bashforge check

test:
	npm test --workspaces --if-present

lint:
	./scripts/lint.sh

shellcheck:
	shellcheck bin/bashforge install.sh packages/lessons/lessons/*/setup.sh

install:
	./install.sh
