class DebugString:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "content": ("STRING",),
            },
        }

    OUTPUT_NODE = True
    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("content",)
    FUNCTION = "preview"
    CATEGORY = "TypeScript-CustomNode"

    def preview(self, content: str):
        print(f"{content=}")
        return {
            "ui": {
                "content": content,
            },
            "result": (content,),
        }
