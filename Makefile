component = ./node_modules/component-hooks/node_modules/.bin/component

default: node_modules components public

node_modules:
	@npm install

components:
	@$(component) install

public: lib/index.js lib/style.css lib/template.js
	$(component) build -n $@ -o $@
	@touch $@

example: default
	@xdg-open example/index.html

clean:
	@rm -rf public

.PHONY: clean example