from django.shortcuts import render
from django.http import HttpResponse
from .models import Room
from rest_framework.views import APIView
from .models import Amenity, Room
from .serializers import AmenitySerializer, RoomListSerializer, RoomDetailSerializer
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, NotAuthenticated, ParseError, PermissionDenied
from rest_framework.status import HTTP_204_NO_CONTENT
from categories.models import Category
from django.db import transaction


class Amenities(APIView):
    def get(self, request):
        all_amenities = Amenity.objects.all()
        json_amenities = AmenitySerializer(all_amenities, many=True)
        return Response(json_amenities.data)
    
    def post(self, request):
        modelObj_amenity = AmenitySerializer(data=request.data)
        if modelObj_amenity.is_valid():
            created_amenity = modelObj_amenity.save()
            return Response(AmenitySerializer(created_amenity).data)
        else:
            return Response(modelObj_amenity.errors)



class AmenityDetail(APIView):
    def get_object(self, pk):
        try:
            return Amenity.objects.get(pk=pk)
        except Amenity.DoesNotExist:
            raise NotFound
    
    def get(self, request, pk):
        json_amenity = AmenitySerializer(self.get_object(pk))
        return Response(json_amenity.data)
    
    def put(self, request, pk):
        update_amenity = AmenitySerializer(self.get_object(pk), data=request.data, partial=True)
        if update_amenity.is_valid():
            updated_model = update_amenity.save()
            return Response(AmenitySerializer(updated_model).data)
        else:
            return Response(update_amenity.errors)
        
    def delete(self, request, pk):
        self.get_object(pk).delete()
        return Response(status=HTTP_204_NO_CONTENT)
    
    
    

    
class Rooms(APIView):
    def get(self, request):
        all_rooms = Room.objects.all()
        json_rooms = RoomListSerializer(all_rooms, many=True, context={'request': request})
        return Response(json_rooms.data)
    
    def post(self, request):
        if request.user.is_authenticated: # 요청을 보내는 사용자가 현재 로그인되어 있을 경우,
            modelObj_rooms = RoomDetailSerializer(data=request.data)
            if modelObj_rooms.is_valid():
                
                category_pk = request.data.get("category") # (사용자가 입력한 카테고리 데이터를 가져옴.)
                if not category_pk:
                    raise ParseError("카테고리는 필수로 입력해야 합니다.")
                try:
                    category = Category.objects.get(pk=category_pk)
                    if category.kind == Category.CategoryKindChoices.EXPERIENCES: 
                        raise ParseError("카테고리의 종류는 rooms이어야 합니다.")
                except Category.DoesNotExist:
                    raise ParseError("존재하지 않는 카테고리 입니다.")
                
                try:
                    with transaction.atomic(): # 쿼리가 즉시 데이터베이스에 반영되지 않도록 해줌. / 어떠한 지점에서 하나라도 에러가 발생하면 쿼리 전체를 데이터베이스에 반영하지 않음.
                        created_rooms = modelObj_rooms.save(owner=request.user, category=category) # 현재 사용자를 owner로 지정해줌.
                        amenities_pk = request.data.get("amenities")
                        for amenity_pk in amenities_pk:
                            amenity = Amenity.objects.get(pk=amenity_pk)
                            created_rooms.amenities.add(amenity)
                    
                        return Response(RoomDetailSerializer(created_rooms).data)
                except Exception:
                    raise ParseError("어메니티가 존재하지 않습니다.")
            else:
                return Response(modelObj_rooms.errors)
        else:
            raise NotAuthenticated
    
    
    
    
class RoomDetail(APIView):
    def get_object(self, pk):
        try:
            return Room.objects.get(pk=pk)
        except Room.DoesNotExist:
            raise NotFound
            
    def get(self, request, pk):
        room = self.get_object(pk)
        json_room = RoomDetailSerializer(room, context={"request": request}) # 해당 시리얼라이저로 context를 보냄.
        return Response(json_room.data)
        
        
    def put(self, request, pk):
        room = self.get_object(pk)
        
        if not request.user.is_authenticated:
            raise NotAuthenticated
        if room.owner != request.user:
            raise PermissionDenied
        
        update_room = RoomDetailSerializer(room, data=request.data, partial=True)
        
        if update_room.is_valid():       
            category_pk = request.data.get("category") 
            if category_pk:
                try:
                    category = Category.objects.get(pk=category_pk)
                    if category.kind == Category.CategoryKindChoices.EXPERIENCES: 
                        raise ParseError("카테고리의 종류는 rooms이어야 합니다.")
                except Category.DoesNotExist:
                    raise ParseError("존재하지 않는 카테고리 입니다.")

            try:
                with transaction.atomic():
                    if category_pk:
                        created_room = update_room.save(category=category)
                    else:
                        created_room = update_room.save()
                        
                    amenities_pk = request.data.get("amenities")
                    if amenities_pk:
                        created_room.amenities.clear()
                        for amenity_pk in amenities_pk:
                            amenity = Amenity.objects.get(pk=amenity_pk)
                            created_room.amenities.add(amenity)
                    return Response(RoomDetailSerializer(created_room).data)
                
            except Exception as e:
                print(e)
                raise ParseError("어메니티가 존재하지 않습니다.")
        else:
            return Response(update_room.errors)
                
                        

    def delete(self, request, pk):
        room = self.get_object(pk)
        if not request.user.is_authenticated: # 사용자가 로그인하지 않았을 경우,
            raise NotAuthenticated
        if room.owner != request.user: # 사용자와 방의 주인이 같지 않을 경우,
            raise PermissionDenied
        room.delete()
        return Response(status=HTTP_204_NO_CONTENT)