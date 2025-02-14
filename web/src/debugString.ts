import { app } from '@comfyorg/comfyui-frontend/src/scripts/app';
import { ComfyWidgets } from '@comfyorg/comfyui-frontend/src/scripts/widgets';
import type { ComfyExtension } from '@comfyorg/comfyui-frontend/src/types/comfy';

const extension: ComfyExtension = {
	name: "TypeScript-CustomNode.DebugString",
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		if (nodeData.name === "DebugString") {
			function debugString(content: string) {
				if (this.widgets) {
					for (let i = 1; i < this.widgets.length; i++) {
						this.widgets[i].onRemove?.();
					}
					this.widgets.length = 1;
				}

				const v = [...content];
				if (!v[0]) {
					v.shift();
				}
				for (const list of v) {
					const w = ComfyWidgets["STRING"](this, "text2", ["STRING", { multiline: true }], app).widget;
					w.inputEl.readOnly = true;
					w.inputEl.style.opacity = 0.6;
					w.value = list;
				}

				requestAnimationFrame(() => {
					const sz = this.computeSize();
					if (sz[0] < this.size[0]) {
						sz[0] = this.size[0];
					}
					if (sz[1] < this.size[1]) {
						sz[1] = this.size[1];
					}
					this.onResize?.(sz);
					app.graph.setDirtyCanvas(true, false);
				});
			}

			const onExecuted = nodeType.prototype.onExecuted;
			nodeType.prototype.onExecuted = function ({content}) {
				onExecuted?.apply(this, arguments);
				debugString.call(this, content);
			};

			const onConfigure = nodeType.prototype.onConfigure;
			nodeType.prototype.onConfigure = function () {
				onConfigure?.apply(this, arguments);
				if (this.widgets_values?.length) {
					debugString.call(this, this.widgets_values.slice(+this.widgets_values.length > 1));
				}
			};
		}
	},
}
app.registerExtension(extension);
