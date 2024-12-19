from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import Amenity, Room
from users.serializers import TinyUserSerializer
from categories.serializers import CategorySerializer

class AmenitySerializer(ModelSerializer):
    class Meta:
        model = Amenity
        fields = ("name", "description")
        
        
        
        
        
class RoomListSerializer(ModelSerializer):
    rating = SerializerMethodField()
    is_owner = SerializerMethodField()
    
    class Meta:
        model = Room
        fields = ("pk", "name", "country", "city", "price", "rating", "is_owner")
        
    def get_rating(self, room):
        return room.rating()
        
    def get_is_owner(self, room):
        request = self.context['request'] 
        print(request.user)
        return room.owner == request.user

        
        
        

class RoomDetailSerializer(ModelSerializer):
    owner = TinyUserSerializer(read_only=True) # 해당 참조하는 모델에 대한 해당 필드 데이터만 확장하여 가져옴.  # read_only=True를 통해 POST 요청 시, 사용자가 해당 필드의 데이터를 작성하지 않아도 되도록 해줌.
    amenities = AmenitySerializer(read_only=True, many=True)  # 배열 데이터일 경우에는, many=True를 인수로 줘야함.
    category = CategorySerializer(read_only=True)
    rating = SerializerMethodField()
    is_owner = SerializerMethodField()
    
    class Meta:
        model = Room
        fields = "__all__"
        # depth = 1  # 모든 참조하는 모델에 대한 모든 필드 데이터를 확장하여 가져옴.
    
    def get_rating(self, room):
        print(self.context) # 뷰로부터 context를 받아옴.
        return room.rating()
        
    def get_is_owner(self, room):
        request = self.context['request'] 
        print(request.user)
        return room.owner == request.user

        

        