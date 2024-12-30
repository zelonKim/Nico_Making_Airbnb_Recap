from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework.status import HTTP_200_OK
from .models import Wishlist
from .serializers import WishlistSerializer
from rooms.models import Room


class Wishlists(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        all_wishlists = Wishlist.objects.filter(user=request.user)
        json_wishlists = WishlistSerializer(all_wishlists, many=True, context={"request":request})
        return Response(json_wishlists.data)
    
    def post(self, request):
        modelObj_wishlist = WishlistSerializer(data=request.data)
        if modelObj_wishlist.is_valid():
            created_model = modelObj_wishlist.save(user=request.user)
            return Response(WishlistSerializer(created_model).data)
        else:
            return Response(modelObj_wishlist.errors)
        
    

class WishlistDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk, user):
        try:
            return Wishlist.objects.get(pk=pk, user=user)
        except Wishlist.DoesNotExist:
            raise NotFound
    
    def get(self, request, pk):
        wishlist = self.get_object(pk, request.user)
        json_wishlist = WishlistSerializer(wishlist, context={"request": request})
        return Response(json_wishlist.data)
    
    def delete(self, request, pk):
        wishlist = self.get_object(pk, request.user)
        wishlist.delete()
        return Response(status=HTTP_200_OK)
    
    def put(self, request, pk):
        wishlist = self.get_object(pk, request.user)
        update_wishlist = WishlistSerializer(wishlist, data=request.data, partial=True)
        if update_wishlist.is_valid():
            updated_model = update_wishlist.save()
            serializer = WishlistSerializer(updated_model, context={"request": request})
            return Response(serializer.data)
        else:
            return Response(update_wishlist.errors)



class WishlistToggle(APIView):
    def get_list(self, pk, user):
        try:
            return Wishlist.objects.get(pk=pk, user=user)
        except Wishlist.DoesNotExist:
            raise NotFound
        
    def get_room(self, pk):
        try:
            return Room.objects.get(pk=pk)
        except Room.DoesNotExist:
            raise NotFound
    
    def put(self, request, pk, room_pk):
        wishlist = self.get_list(pk, request.user)
        room = self.get_room(room_pk)
        if wishlist.rooms.filter(pk=room.pk).exists():
            wishlist.rooms.remove(room)
        else:
            wishlist.rooms.add(room)
        return Response(status=HTTP_200_OK)