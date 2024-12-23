import strawberry
from strawberry.types import Info
import typing
from .import types
from .import queries
from common.permissions import OnlyLoggedIn
from .import mutations


@strawberry.type
class Query:
    all_rooms: typing.List[types.RoomType] = strawberry.field(resolver=queries.get_all_rooms)
    room: typing.Optional[types.RoomType] = strawberry.field(resolver=queries.get_room)
    

@strawberry.type
class Mutation:
    add_room: typing.Optional[types.RoomType] = strawberry.mutation(
        resolver=mutations.add_room, 
        permission_classes=[OnlyLoggedIn]
    )
    
