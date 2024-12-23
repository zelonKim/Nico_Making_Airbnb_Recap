from django.contrib import admin
from .models import Room, Amenity

@admin.action(description="모든 가격을 0으로 설정합니다.")
def reset_prices(admin_name, request_info, selected_rooms):
    for room in selected_rooms.all():
        room.price = 0
        room.save()


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    actions=(reset_prices,)
    list_display = ("name", "price", "kind", "total_amenities",  "rating", "owner", "created_at",)
    list_filter = ("country", "city", "price", "rooms", "toilets", "pet_friendly", "kind", "amenities",)
    search_fields = ("name", "=price", "^kind", "^owner__username")

    # def total_amenities(self, room):
    #     return room.amenities.count()



@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display=("name", "description", "created_at", "updated_at",)
    readonly_fields=("created_at", "updated_at")