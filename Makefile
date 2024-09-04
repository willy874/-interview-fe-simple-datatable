.SILENT:

MOCK_IMG_TAG = symphox-tlf-fe-interview-mock:latest

.PHONY: build-mock run-mock

build-mock:
	docker build -t "$(MOCK_IMG_TAG)" \
		-f mock/Dockerfile \
		mock/

run-mock: build-mock
	docker run --rm -it \
	-p 8000:8000 \
	$(MOCK_IMG_TAG) uvicorn --host=0.0.0.0 api:app