from django.urls import path
from . import views

"""
urlpatterns=[
    path("", views.Categories.as_view()), #.as_view()를 통해 APIView를 상속받은 클래스를 뷰 함수로서 사용함.
    path("<int:pk>", views.CategoryDetail.as_view())
]
"""


urlpatterns = [
    path("", views.CategoryViewSet.as_view({
            'get':'list', 
            'post':'create'
        })),
    path("<int:pk>", views.CategoryViewSet.as_view({
            'get':'retrieve',
            'put':'partial_update',
            'delete':'destroy'
        })),
]