from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.Serializer): # serializers.자료형 함수(유효성 조건)
    pk = serializers.IntegerField(read_only=True) # 사용자가 해당 데이터를 보내지 않아도 유효하도록 해줌.
    name = serializers.CharField(required=True, max_length=50)
    kind = serializers.CharField(max_length=15)
    created_at = serializers.DateTimeField(read_only=True)
    
    def create(self, saved_data): # 두번째 매개변수에는 뷰함수에서 save()한 모델 객체가 담김.
        #    Category.objects.create(
        #        name=saved_data['name'],
        #        kind=saved_data['kind']
        #    ) 
        return Category.objects.create(**saved_data) # **연산자는 딕셔너리에서 키=밸류 형태로 값을 가져옴.
    