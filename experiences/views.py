from rest_framework.views import APIView
from .models import Perk
from .serializers import PerkSerializer
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.status import HTTP_204_NO_CONTENT

class Perks(APIView):
    def get(self, request):
        all_perks = Perk.objects.all()
        json_perks = PerkSerializer(all_perks, many=True)
        return Response(json_perks.data)
    
    def post(self, request):
        modelObj_perk = PerkSerializer(data=request.data)
        if modelObj_perk.is_valid():
            created_perk = modelObj_perk.save()
            return Response(PerkSerializer(created_perk).data)
        else:
            return Response(modelObj_perk.errors)
    

class PerkDetail(APIView):
    def get_object(self, pk):
        try:
            return Perk.objects.get(pk=pk)
        except Perk.DoesNotExist:
            raise NotFound
    
    def get(self, request, pk):
        json_perk = PerkSerializer(self.get_object(pk))
        return Response(json_perk.data)
    
    def put(self, request, pk):
        update_perk = PerkSerializer(self.get_object(pk), data=request.data, partial=True)
        if update_perk.is_valid():
           updated_model = update_perk.save()
           return Response(PerkSerializer(updated_model).data)
        else:
            return Response(update_perk.errors)
    
    def delete(self, request, pk):
        self.get_object(pk).delete()
        return Response(status=HTTP_204_NO_CONTENT)