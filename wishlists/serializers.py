from rest_framework.serializers import ModelSerializer
from .models import Wishlist
from rooms.serializers import RoomListSerializer


class WishlistSerializer(ModelSerializer):
    rooms = RoomListSerializer(read_only=True, many=True)
    
    class Meta:
        model = Wishlist
        fields = ("pk", "name", "rooms")