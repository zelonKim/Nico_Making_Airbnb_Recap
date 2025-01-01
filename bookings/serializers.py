from rest_framework import serializers
from .models import Booking
from django.utils import timezone

class CreateRoomBookingSerializer(serializers.ModelSerializer):
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    
    class Meta:
        model = Booking
        fields = ("check_in", "check_out")

    def validate_check_in(self, value):
        now = timezone.localtime(timezone.now()).date()
        if now > value:
            raise serializers.ValidationError("Check-in Can`t be in the past")
        return value
    
    def validate_check_out(self, value):
        now = timezone.localtime(timezone.now()).date()
        if now > value:
            raise serializers.ValidationError("Check-out Can`t be in the past")
        return value
        
    def validate(self, dict):
        room = self.context.get("room")
        if dict['check_out'] <= dict['check_in']:
            raise serializers.ValidationError("Check-in must be earlier than Check-out")
        if Booking.objects.filter(
            room=room,
            check_in__lte=dict['check_out'],
            check_out__gte=dict['check_in']
            ).exists():
            raise serializers.ValidationError("Those Dates are already taken")
        return dict
    
    
    
    
    

class PublicBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ("pk", "room", "user", "kind", "check_in", "check_out")