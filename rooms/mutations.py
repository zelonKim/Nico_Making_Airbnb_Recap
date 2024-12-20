import typing
import strawberry
from strawberry.types import Info
from django.db import transaction
from enum import Enum
from .models import Room, Amenity
from categories.models import Category


@strawberry.enum
class RoomKindChoices(Enum):
    ENTIRE_PLACE = "entire_place"
    PRIVATE_ROOM = "private_room"
    SHARED_ROOM = "shared_room"
    
def add_room(
    info: Info,
    category_pk: int,
    amenities: typing.List[int],
    name: str,
    country: str,
    city: str,
    price: int,
    rooms: int,
    toilets: int,
    description: str,
    address: str,
    pet_friendly: bool,
    kind: RoomKindChoices,
):
    try:
        category = Category.objects.get(pk=category_pk)
        if category.kind == Category.CategoryKindChoices.EXPERIENCES:
            raise Exception("카테고리의 종류는 rooms이어야 합니다.")
    except Category.DoesNotExist:
        raise Exception(detail="존재하지 않는 카테고리입니다.")
    try:
        with transaction.atomic():
            room = Room.objects.create(
                name=name,
                country=country,
                city=city,
                price=price,
                rooms=rooms,
                toilets=toilets,
                description=description,
                address=address,
                pet_friendly=pet_friendly,
                kind=kind,
                owner=info.context.request.user,
                category=category,
            )
            for amenity_pk in amenities:
                amenity = Amenity.objects.get(pk=amenity_pk)
                room.amenities.add(amenity)
            room.save()
            return room
    except Exception:
        raise Exception("어메니티가 존재하지 않습니다.")