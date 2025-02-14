from .nodes.debug_string import DebugString

NODE_CLASS_MAPPINGS = {
    "DebugString": DebugString,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "DebugString": "Debug String",
}

WEB_DIRECTORY = "./web/js"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
