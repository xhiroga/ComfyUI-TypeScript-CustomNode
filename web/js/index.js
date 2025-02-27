import { app } from "../../scripts/app.js";
const extension = {
  name: "TypeScript-CustomNode.DebugString",
  beforeRegisterNodeDef: async (nodeType, nodeData, app2) => {
    if (nodeData.name !== "DebugString") return;
    const debugString = (node, content) => {
      if (!node.widgets) return;
      node.widgets.slice(1).forEach((widget) => widget.onRemove?.());
      node.widgets.length = 1;
      const inputName = "content2";
      node.addWidget("text", inputName, content, (value, widget, node2) => {
      }, {});
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
