from typing import Any, Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    """
    Standardized API response wrapper.
    """
    success: bool
    message: str
    data: Optional[T] = None

def wrap_response(data: Any, message: str = "Request processed successfully", success: bool = True):
    return APIResponse(
        success=success,
        message=message,
        data=data
    )
