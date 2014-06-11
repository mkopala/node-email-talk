.PHONY: server html
	
server:
	node_modules/.bin/bedecked --server slides.md

html:
	node_modules/.bin/bedecked slides.md > index.html
