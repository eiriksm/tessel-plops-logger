test-cov:
	./node_modules/.bin/istanbul cover -- ./node_modules/.bin/_mocha -R spec
test:
	npm test

.PHONY: test-cov
