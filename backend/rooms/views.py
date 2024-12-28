from django.shortcuts import render
from django.http import HttpResponse
from .models import Room
from rest_framework.views import APIView
from .models import Amenity, Room
from .serializers import AmenitySerializer, RoomListSerializer, RoomDetailSerializer
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, NotAuthenticated, ParseError, PermissionDenied
from rest_framework.status import HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST
from categories.models import Category
from django.db import transaction
from reviews.serializers import ReviewSerializer
from medias.serializers import PhotoSerializer
from django.conf import settings
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from bookings.models import Booking
from bookings.serializers import PublicBookingSerializer, CreateRoomBookingSerializer
from django.utils import timezone

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
            return Response(modelObj_amenity.errors, status=HTTP_400_BAD_REQUEST)



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
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request):
        all_rooms = Room.objects.all()
        json_rooms = RoomListSerializer(all_rooms, many=True, context={'request': request})
        return Response(json_rooms.data)
    
    def post(self, request):
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
                        serializer = RoomDetailSerializer(created_rooms, context={'request': request})
                        return Response(serializer.data)
                except Exception as e:
                    print(e)
                    raise ParseError("어메니티가 존재하지 않습니다.")
            else:
                return Response(modelObj_rooms.errors)

    
    
    
    
class RoomDetail(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
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
    
    
    
class RoomReviews(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_object(self, pk):
        try:
            return Room.objects.get(pk=pk)
        except Room.DoesNotExist:
            raise NotFound
    
    def get(self, request, pk):
        # print(request.query_params) # URL의 쿼리 파라미터 객체를 가져옴.
        try:
            page = request.query_params.get("page", 1) # page값이 없는 경우, page=1이 됨.
            page = int(page)
        except ValueError: # page값이 숫자로 변환될 수 없는 경우, page=1이 됨.
            page = 1
        
        page_size = settings.PAGE_SIZE
        start = (page - 1) * page_size
        end = start + page_size        
        
        room = self.get_object(pk)
        json_reviews = ReviewSerializer(room.reviews.all()[start:end], many=True) # 페이지네이션
        return Response(json_reviews.data)
    
    
    def post(self, request, pk):
        modelObj_review = ReviewSerializer(data=request.data)
        if modelObj_review.is_valid():
            created_review = modelObj_review.save(
                user = request.user,
                room = self.get_object(pk)
            )
            return Response(ReviewSerializer(created_review).data)
        
    
    

class RoomAmenities(APIView):
    def get_object(self, pk):
        try:
            return Room.objects.get(pk=pk)
        except Room.DoesNotExist:
            raise NotFound
    
    def get(self, request, pk):
        try:
            page = request.query_params.get("page", 1)
            page = int(page)
        except ValueError:
            page = 1
            
        page_size = 2
        start = (page -1) * page_size
        end = start + page_size
        
        room = self.get_object(pk)
        json_amenities = AmenitySerializer(room.amenities.all()[start:end], many=True)
        return Response(json_amenities.data)
    
    
class RoomPhotos(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_object(self, pk):
        try:
            return Room.objects.get(pk=pk)
        except Room.DoesNotExist:
            raise NotFound
    
    
    def post(self, request, pk):
        room = self.get_object(pk)

        if request.user != room.owner:
            raise PermissionDenied
        
        modelObj_photo = PhotoSerializer(data=request.data)
        if modelObj_photo.is_valid():
            created_photo = modelObj_photo.save(room=room)
            return Response(PhotoSerializer(created_photo).data)
        else:
            return Response(modelObj_photo.errors)
        
        

class RoomBookings(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_object(self, pk):
        try:
            return Room.objects.get(pk=pk)
        except:
            raise NotFound
    
    def get(self, request, pk):
        room = self.get_object(pk)
        now = timezone.localtime(timezone.now()).date()
        bookings = Booking.objects.filter(room=room, kind=Booking.BookingKindChoices.ROOM, check_in__gt=now,)
        json_bookings = PublicBookingSerializer(bookings, many=True)
        return Response(json_bookings.data)
    
    
    def post(self, request, pk):
        room = self.get_object(pk)
        modelObj_booking = CreateRoomBookingSerializer(data=request.data)
        if modelObj_booking.is_valid():
            created_booking = modelObj_booking.save(
                room = room,
                user = request.user,
                kind = Booking.BookingKindChoices.ROOM
            )
            return Response(PublicBookingSerializer(created_booking).data)
        else:
            return Response(modelObj_booking.errors)
    
    