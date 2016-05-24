default:
	@$(MAKE) --no-print-directory -C example

example: default
	@xdg-open example/index.html

.PHONY: default
