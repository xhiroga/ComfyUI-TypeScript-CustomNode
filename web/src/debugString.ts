import { app } from '@comfyorg/comfyui-frontend/src/scripts/app';
import type { ComfyExtension } from '@comfyorg/comfyui-frontend/src/types/comfy';

const NODE_TITLE_HEIGHT = 30;

const extension: ComfyExtension = {
  name: "TypeScript-CustomNode.DebugString",
  beforeRegisterNodeDef: function async(nodeType, nodeData, _comfyApp) {
    if (nodeData.name === 'DebugString') {
      console.log(`Registering ${nodeData.name}`);

      function draw(ctx: CanvasRenderingContext2D) {
        console.log({ "this": this })

        const widgets_values = this.widgets_values;
        console.log(`draw: ${widgets_values}`);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(widgets_values, 5, -NODE_TITLE_HEIGHT - 5);
      }

      const onDrawForeground = nodeType.prototype.onDrawForeground;
      nodeType.prototype.onDrawForeground = function (ctx: CanvasRenderingContext2D) {
        onDrawForeground?.apply(this, arguments);
        console.log({ "BUG: this is not updated.": this, arguments })
        draw.call(this, ctx);
      };
    }
  }
};

app.registerExtension(extension);
