PROJECT_NAME := $(shell python3 -c "import tomllib; print(tomllib.load(open('pyproject.toml', 'rb'))['project']['name'])")

.PHONY: dev install

dev:
	cd web && npm run build
	rsync -av --exclude-from='.gitignore' . ComfyUI/custom_nodes/$(PROJECT_NAME)
	ComfyUI/.venv/bin/python ComfyUI/main.py --enable-cors-header --listen 0.0.0.0

install: ComfyUI ComfyUI/.venv ComfyUI/custom_nodes/$(PROJECT_NAME)
	cd ComfyUI && . .venv/bin/activate && pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu124
	cd ComfyUI && . .venv/bin/activate && pip install -r requirements.txt
	cd ComfyUI && . .venv/bin/activate && pip install -e custom_nodes/$(PROJECT_NAME)

ComfyUI:
	git -C $@ pull || git clone https://github.com/comfyanonymous/ComfyUI $@

ComfyUI/.venv: ComfyUI
	cd ComfyUI && python3 -m venv .venv

ComfyUI/custom_nodes/$(PROJECT_NAME): ComfyUI
	cd web && npm install && npm run build
	rsync -av --exclude-from='.gitignore' . $@
