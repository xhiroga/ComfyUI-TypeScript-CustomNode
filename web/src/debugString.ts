import { app } from '@comfyorg/comfyui-frontend/src/scripts/app';
import { ComfyWidgets } from '@comfyorg/comfyui-frontend/src/scripts/widgets';
import type { ComfyExtension } from '@comfyorg/comfyui-frontend/src/types/comfy';
import { LGraphNode } from '@comfyorg/litegraph';

const extension: ComfyExtension = {
  name: "TypeScript-CustomNode.DebugString",
  beforeRegisterNodeDef: async (nodeType, nodeData, app) => {
    if (nodeData.name !== "DebugString") return;

    const debugString = (node: LGraphNode, content: string) => {
      if (!node.widgets) return;

      // 既存のウィジェットをクリア
      node.widgets.slice(1).forEach(widget => widget.onRemove?.());
      node.widgets.length = 1;

      const values = content ? [...content] : [];
      values.forEach(list => {
        const w = ComfyWidgets["STRING"](node, "content", ["STRING", { multiline: true }], app).widget;
        w.inputEl.readOnly = true;
        w.inputEl.style.opacity = "0.6";
        w.value = list;
      });

      requestAnimationFrame(() => {
        if (!node.size) return;
        const sz = node.computeSize();
        sz[0] = Math.max(sz[0], node.size[0]);
        sz[1] = Math.max(sz[1], node.size[1]);
        node.onResize?.(sz);
        app.graph.setDirtyCanvas(true, false);
      });
    };

    const originalOnExecuted = nodeType.prototype.onExecuted;
    nodeType.prototype.onExecuted = function (data) {
      originalOnExecuted?.apply(this, arguments);
      debugString(this, data.content);
    };

    const originalOnConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function () {
      originalOnConfigure?.apply(this, arguments);
      if (this.widgets_values?.length > 1) {
        debugString(this, this.widgets_values.slice(1));
      }
    };
  },
};

app.registerExtension(extension);
