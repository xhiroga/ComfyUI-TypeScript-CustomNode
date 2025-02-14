class DebugString:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "string": ("STRING",),
            },
        }

    OUTPUT_NODE = True
    RETURN_TYPES = ()
    FUNCTION = "preview"
    CATEGORY = "TypeScript-CustomNode"

    def preview(self, string: str):
        print(f"{string=}")
        return {
            "ui": {
                "content": string,
            },
            "result": (string,),
        }
