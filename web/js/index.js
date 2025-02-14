import { app } from "../../scripts/app.js";
import { ComfyWidgets } from "../../scripts/widgets.js";
const extension = {
  name: "TypeScript-CustomNode.DebugString",
  async beforeRegisterNodeDef(nodeType, nodeData, app2) {
    if (nodeData.name === "DebugString") {
      let debugString = function(content) {
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
          const w = ComfyWidgets["STRING"](this, "text2", ["STRING", { multiline: true }], app2).widget;
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
          app2.graph.setDirtyCanvas(true, false);
        });
      };
      const onExecuted = nodeType.prototype.onExecuted;
      nodeType.prototype.onExecuted = function({ content }) {
        onExecuted?.apply(this, arguments);
        debugString.call(this, content);
      };
      const onConfigure = nodeType.prototype.onConfigure;
      nodeType.prototype.onConfigure = function() {
        onConfigure?.apply(this, arguments);
        if (this.widgets_values?.length) {
          debugString.call(this, this.widgets_values.slice(+this.widgets_values.length > 1));
        }
      };
    }
  }
};
app.registerExtension(extension);
//# sourceMappingURL=index.js.map
