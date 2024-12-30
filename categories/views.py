from .models import Category
from .serializers import CategorySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.views import APIView

from rest_framework.viewsets import ModelViewSet 

"""
@api_view 함수 데코레이션을 통한 뷰 처리

@api_view(["GET", "POST"]) # GET과 POST 요청 메서드를 실행할 수 있도록 함.
def categories(request):
    if request.method == "GET":
        all_categories = Category.objects.all() # 모델 객체가 담김.
        json_categories = CategorySerializer(all_categories, many=True) # 모델 객체 -> JSON 문자열
        return Response(json_categories.data)

    elif request.method == "POST":
        # print(request.data) # 사용자가 보내는 JSON문자열이 담김.
        modelObj_categories = CategorySerializer(data=request.data) # JSON 문자열 -> 모델 객체
        # print(modelObj_categories.is_valid()) # 모델 객체의 유효성 여부를 반환함.
        if modelObj_categories.is_valid():
            created_category = modelObj_categories.save() # 시리얼라이저의 create() 메서드를 호출함.
            return Response(CategorySerializer(created_category).data)
        else:
            return Response(modelObj_categories.errors)
""" 

"""
# APIView 상속을 통한 뷰 처리

class Categories(APIView):
    def get(self, request):
        all_categories = Category.objects.all() 
        json_categories = CategorySerializer(all_categories, many=True) # 모델 객체 -> JSON 문자열
        return Response(json_categories.data)
    
    def post(self, request):
        modelObj_categories = CategorySerializer(data=request.data) # JSON 문자열 -> 모델 객체
        if modelObj_categories.is_valid():
            created_category = modelObj_categories.save() # 시리얼라이저의 create() 메서드를 호출함.
            return Response(CategorySerializer(created_category).data)
        else:
            return Response(modelObj_categories.errors)
"""    



###########################



"""
def category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        raise NotFound 
    
    if request.method == "GET":
        json_category = CategorySerializer(category)
        return Response(json_category.data)
    
    elif request.method == "PUT":
        update_category = CategorySerializer(category, data=request.data, partial=True) # partial=True를 통해 부분적 업데이트가 가능하도록 해줌.
        if update_category.is_valid():
            updated_model = update_category.save() # 시리얼라이저의 update()메서드를 호출함.
            return Response(CategorySerializer(updated_model).data)
        else:
            return Response(update_category.errors)
    
    elif request.method == "DELETE":
        category.delete()
        return Response(status=HTTP_204_NO_CONTENT)
"""        


"""
class CategoryDetail(APIView):
    def get_object(self, pk): # get_object()를 통해 1개의 상세 데이터를 가져옴.
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            raise NotFound 

    def get(self, request, pk):
        json_category = CategorySerializer(self.get_object(pk))
        return Response(json_category.data)
    
    def put(self, request, pk):
        update_category = CategorySerializer(self.get_object(pk), data=request.data, partial=True) # partial=True를 통해 부분적 업데이트가 가능하도록 해줌.
        if update_category.is_valid():
            updated_model = update_category.save()  # 시리얼라이저의 update()메서드를 호출함.
            return Response(CategorySerializer(updated_model).data)
        else:
            return Response(update_category.errors)
    
    def delete(self, request, pk):
        self.get_object(pk).delete()
        return Response(status=HTTP_204_NO_CONTENT)
"""    


#############################



# ModelViewSet 상속을 통한 뷰 처리

class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.filter(kind=Category.CategoryKindChoices.ROOMS)