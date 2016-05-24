component = ./node_modules/.bin/component

public: node_modules client/components $(shell find ../lib client -type f)
	node build.js
	@touch $@

node_modules:
	@npm install

client/components:
	@$(MAKE) --no-print-directory -C client -B

