.PHONY: build-RuntimeDependenciesLayer build-lambda-common
.PHONY: build-ExampleFunction
.PHONY: build-GetProfitRatioFunction
.PHONY: build-OptionProfitRatioFunction
.PHONY: build-GetPortfolioFunction
.PHONY: build-OptionPortfolioFunction

build-ExampleFunction:
	$(MAKE) HANDLER=src/handlers/example.ts build-lambda-common

build-GetProfitRatioFunction:
	$(MAKE) HANDLER=src/handlers/portfolio.ts build-lambda-common

build-OptionProfitRatioFunction:
	$(MAKE) HANDLER=src/handlers/preflight.ts build-lambda-common

build-GetPortfolioFunction:
	$(MAKE) HANDLER=src/handlers/portfolio.ts build-lambda-common

build-OptionPortfolioFunction:
	$(MAKE) HANDLER=src/handlers/preflight.ts build-lambda-common

build-lambda-common:
	npm install
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"include\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	npm run build -- --build tsconfig-only-handler.json
	cp -r dist "$(ARTIFACTS_DIR)/"

build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # to avoid rebuilding when changes aren't related to dependencies
