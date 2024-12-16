"""
from django.shortcuts import render
from .models import Category
from django.http import JsonResponse
from django.core import serializers


@api_view()
def categories(request):
    all_categories = Category.objects.all()
    
    return JsonResponse({
        "ok": True,
        "categories": serializers.serialize("json", all_categories)
    })
"""
    
    
#####################


from .models import Category
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CategorySerializer


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
            new_category = modelObj_categories.save() # 시리얼라이저의 create()메서드를 호출함.
            return Response(CategorySerializer(new_category).data)
        else:
            return Response(modelObj_categories.errors)
    
    

@api_view()
def category(request, pk):
    category = Category.objects.get(pk=pk)
    json_category = CategorySerializer(category)
    return Response(json_category.data)