import { app } from "../../scripts/app.js";
import { ComfyWidgets } from "../../scripts/widgets.js";
const extension = {
  name: "TypeScript-CustomNode.DebugString",
  beforeRegisterNodeDef: async (nodeType, nodeData, app2) => {
    if (nodeData.name !== "DebugString") return;
    const debugString = (node, content) => {
      if (!node.widgets) return;
      node.widgets.slice(1).forEach((widget) => widget.onRemove?.());
      node.widgets.length = 1;
      const values = content ? [...content] : [];
      values.forEach((list) => {
        const inputName = "content2";
        const w = ComfyWidgets["STRING"](node, inputName, ["STRING", { multiline: true }], app2).widget;
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
        app2.graph.setDirtyCanvas(true, false);
      });
    };
    const originalOnExecuted = nodeType.prototype.onExecuted;
    nodeType.prototype.onExecuted = function(message) {
      originalOnExecuted?.apply(this, arguments);
      debugString(this, message.content);
    };
    const originalOnConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function() {
      originalOnConfigure?.apply(this, arguments);
      debugString(this, this.widgets_values[0]);
    };
  }
};
app.registerExtension(extension);
//# sourceMappingURL=index.js.map
