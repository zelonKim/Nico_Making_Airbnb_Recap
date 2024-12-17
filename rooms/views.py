from django.shortcuts import render
from django.http import HttpResponse
from .models import Room
from rest_framework.views import APIView
from .models import Amenity
from .serializers import AmenitySerializer
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.status import HTTP_204_NO_CONTENT


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