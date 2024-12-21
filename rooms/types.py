import strawberry
from strawberry import auto
from strawberry.types import Info
from . import models
from users.types import UserType
from reviews.types import ReviewType
import typing
from django.conf import settings
from wishlists.models import Wishlist

@strawberry.django.type(models.Room)
class RoomType:
    id: auto
    name: auto
    kind: auto
    owner: UserType
    reviews: typing.List[ReviewType]
    
    @strawberry.field
    def reviews(self, page: typing.Optional[int] = 1) -> typing.List[ReviewType]:
        page_size = settings.PAGE_SIZE 
        start = (page - 1) * page_size
        end = start + page_size
        return self.reviews.all()[start:end]
    
    @strawberry.field
    def rating(self) -> str: 
        return self.rating()
    
    @strawberry.field
    def is_owner(self, info:Info) -> bool: # Info 타입을 통해 요청 정보를 받아옴.
        print(info)
        return self.owner == info.context.request.user
    
    @strawberry.field
    def is_liked(self, info:Info) -> bool:
        return Wishlist.objects.filter(
            user = info.context.request.user,
            rooms__pk = self.pk
        ).exists()