import { app } from "../../scripts/app.js";
const extension = {
  name: "TypeScript-CustomNode.DebugString",
  beforeRegisterNodeDef: function async(nodeType, nodeData, _comfyApp) {
    if (nodeData.name === "DebugString") {
      let draw = function(ctx) {
        console.log({ "this": this });
        const widgets_values = this.widgets_values;
        console.log(`draw: ${widgets_values}`);
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(widgets_values, 5, -30 - 5);
      };
      console.log(`Registering ${nodeData.name}`);
      const onDrawForeground = nodeType.prototype.onDrawForeground;
      nodeType.prototype.onDrawForeground = function(ctx) {
        onDrawForeground?.apply(this, arguments);
        console.log({ "BUG: this is not updated.": this, arguments });
        draw.call(this, ctx);
      };
    }
  }
};
app.registerExtension(extension);
//# sourceMappingURL=index.js.map
