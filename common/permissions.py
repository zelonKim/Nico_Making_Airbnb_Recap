import typing
from strawberry.permission import BasePermission
from strawberry.types import Info


class OnlyLoggedIn(BasePermission): # BasePermission을 상속받음.
    message = "로그인한 사용자만 접근할 수 있습니다." # 권한이 불허될때 보여줄 메시지
    
    def has_permission(self, source: typing.Any, info: Info, **kwargs): # has_permission()를 오버라이딩 함.
        return info.context.request.user.is_authenticated # True를 반환할 경우 권한이 허용됨. # False를 반환할 경우 권한이 불허됨.
    