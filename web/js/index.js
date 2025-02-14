import { app } from "../../scripts/app.js";
import { ComfyWidgets } from "../../scripts/widgets.js";
const extension = {
  name: "TypeScript-CustomNode.DebugString",
  beforeRegisterNodeDef: async (nodeType, nodeData, app2) => {
    if (nodeData.name !== "DebugString") return;
    const debugString = (nodeInstance, content) => {
      if (!nodeInstance.widgets) return;
      nodeInstance.widgets.slice(1).forEach((widget) => widget.onRemove?.());
      nodeInstance.widgets.length = 1;
      const values = content ? [...content] : [];
      values.forEach((list) => {
        const w = ComfyWidgets["STRING"](nodeInstance, "content", ["STRING", { multiline: true }], app2).widget;
        w.inputEl.readOnly = true;
        w.inputEl.style.opacity = "0.6";
        w.value = list;
      });
      requestAnimationFrame(() => {
        if (!nodeInstance.size) return;
        const sz = nodeInstance.computeSize();
        sz[0] = Math.max(sz[0], nodeInstance.size[0]);
        sz[1] = Math.max(sz[1], nodeInstance.size[1]);
        nodeInstance.onResize?.(sz);
        app2.graph.setDirtyCanvas(true, false);
      });
    };
    const originalOnExecuted = nodeType.prototype.onExecuted;
    nodeType.prototype.onExecuted = function(data) {
      originalOnExecuted?.apply(this, arguments);
      debugString(this, data.content);
    };
    const originalOnConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function() {
      originalOnConfigure?.apply(this, arguments);
      if (this.widgets_values?.length > 1) {
        debugString(this, this.widgets_values.slice(1));
      }
    };
  }
};
app.registerExtension(extension);
//# sourceMappingURL=index.js.map
