// Modified from https://github.com/pythongosssss/ComfyUI-Custom-Scripts/blob/main/web/js/showText.js
import { ComfyExtension } from '@comfyorg/comfyui-frontend-types'
import { LGraphNode } from '@comfyorg/litegraph';

const extension: ComfyExtension = {
  name: "TypeScript-CustomNode.DebugString",
  beforeRegisterNodeDef: async (nodeType, nodeData, app) => {
    if (nodeData.name !== "DebugString") return;

    const debugString = (node: LGraphNode, content: string) => {
      if (!node.widgets) return;

      node.widgets.slice(1).forEach(widget => widget.onRemove?.());
      node.widgets.length = 1;

      const inputName = "content2" // MUST NOT be same as the original widget input name.
      // See https://github.com/jagenjo/litegraph.js/blob/master/guides/README.md#node-widgets
      node.addWidget('text', inputName, content, (value, widget, node) => {}, {})

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
    nodeType.prototype.onExecuted = function (message) {
      originalOnExecuted?.apply(this, arguments);
      debugString(this, message.content);
    };

    const originalOnConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function () {
      originalOnConfigure?.apply(this, arguments);
      // this.widgets_values is an array of input values
      debugString(this, this.widgets_values[0] as string);
    };
  },
};

app.registerExtension(extension);
