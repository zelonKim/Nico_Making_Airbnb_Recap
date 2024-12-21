from rest_framework.views import APIView
from .models import Perk, Experience
from .serializers import (
    PerkSerializer,
    PrivateExperienceSerializer,
    PublicExperienceSerializer,
    CreateExperienceSerializer,
    CreateBookingSerializer,
)
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.status import HTTP_204_NO_CONTENT
from bookings.models import Booking
from bookings.serializers import PublicBookingSerializer
from rest_framework.permissions import IsAuthenticated


class Perks(APIView):

    def get(self, request):
        all_perks = Perk.objects.all()
        serializer = PerkSerializer(all_perks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PerkSerializer(data=request.data)
        if serializer.is_valid():
            perk = serializer.save()
            return Response(PerkSerializer(perk).data)
        else:
            return Response(serializer.error_messages)




class PerkDetail(APIView):

    def get_object(self, pk):
        try:
            return Perk.objects.get(pk=pk)
        except Perk.DoesNotExist:
            raise NotFound

    def get(self, request, pk):
        perk = self.get_object(pk)
        serializer = PerkSerializer(perk)
        return Response(serializer.data)

    def put(self, request, pk):
        perk = self.get_object(pk)
        serializer = PerkSerializer(
            perk,
            data=request.data,
            partial=True,
        )
        if serializer.is_valid():
            updated_perk = serializer.save()
            return Response(
                PerkSerializer(updated_perk).data,
            )
        else:
            return Response(serializer.error_messages)

    def delete(self, request, pk):
        perk = self.get_object(pk)
        perk.delete()
        return Response(
            PerkSerializer(HTTP_204_NO_CONTENT),
        )




class Experiences(APIView):

    def get(self, request):
        all_experiences = Experience.objects.all()
        serializer = PublicExperienceSerializer(all_experiences, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PublicExperienceSerializer(data=request.data)
        if serializer.is_valid():
            experience = serializer.save()
            serializer = PublicExperienceSerializer(experience)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)




class ExperienceDetail(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Experience.objects.get(pk=pk)
        except Experience.DoesNotExist:
            raise NotFound

    def get(self, request, pk):
        experience = self.get_object(pk)
        serializer = PrivateExperienceSerializer(experience)
        return Response(serializer.data)


    def put(self, request, pk):
        experience = self.get_object(pk)

        serializer = CreateExperienceSerializer(
            experience, data=request.data, partial=True
        )

        if serializer.is_valid():
            updated_experience = serializer.save()
            return Response(
                CreateExperienceSerializer(updated_experience).data,
            )
        else:
            return Response(serializer.errors)

    def delete(self, request, pk):
        experience = self.get_object(pk)
        experience.delete()
        return Response({"ok": "deleted"})




class ExperienceBookings(APIView):

    def get_object(self, pk):
        try:
            return Experience.objects.get(pk=pk)
        except Experience.DoesNotExist:
            raise NotFound

    def get(self, request, pk):
        experience = self.get_object(pk)
        bookings = Booking.objects.filter(
            experience=experience,
        )
        serializer = PublicBookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        experience = self.get_object(pk)

        user = request.user
        if not user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=401)

        serializer = CreateBookingSerializer(
            data=request.data,
        )
        if serializer.is_valid():
            booking = serializer.save(
                experience=experience,
                user=user,
            )
            serializer = PublicBookingSerializer(booking)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)




class BookingDetail(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Experience.objects.get(pk=pk)
        except Experience.DoesNotExist:
            raise NotFound

    def get(self, request, pk, booking_pk):
        experience = self.get_object(pk)
        bookings = Booking.objects.filter(
            experience=experience,
            pk=booking_pk,
        )
        serializer = PublicBookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def delete(self, request, pk, booking_pk):
        experience = self.get_object(pk)
        booking = Booking.objects.filter(
            experience=experience,
            pk=booking_pk,
        )
        booking.delete()
        return Response({"ok": "deleted"})

    def put(self, request, pk, booking_pk):
        experience = self.get_object(pk)
        try:
            booking = Booking.objects.get(pk=booking_pk, experience=experience)
        except Booking.DoesNotExist:
            return Response({"detail": "Booking not found."}, status=404)
        serializer = CreateBookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            updated_booking = serializer.save()
            serializer = CreateBookingSerializer(updated_booking)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)