from rest_framework import serializers
from .models import Category

"""
# Serializer 상속을 통한 직렬화

class CategorySerializer(serializers.Serializer): # serializers.자료형 함수(유효성 조건)
    pk = serializers.IntegerField(read_only=True) # 사용자가 해당 데이터를 보내지 않아도 유효하도록 해줌.
    name = serializers.CharField(required=True, max_length=50)
    kind = serializers.ChoiceField(choices=Category.CategoryKindChoices.choices)
    created_at = serializers.DateTimeField(read_only=True)
    
    def create(self, posted_data): # 두번째 매개변수에는 POST에서 save()한 모델 객체가 담김.
        return Category.objects.create(**posted_data) # **연산자는 딕셔너리에서 키=밸류 형태로 값을 가져옴.
    
    def update(self, updated_model, updating_json): # 두번째 매개변수에는 PUT에서 업데이트 되는 모델 객체가 담김. / 세번째 매개변수에는 업데이트 하는 JSON 문자열이 담김.
        updated_model.name = updating_json.get("name", updated_model.name)  # updating_json에서 "name" 키를 찾지 못하면 updated_model.name을 반환함.
        updated_model.kind = updating_json.get("kind", updated_model.kind)  
        updated_model.save()
        return updated_model
"""



#########################



# ModelSerializer 상속을 통한 직렬화

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category 
        fields=("name", "kind")
        
        