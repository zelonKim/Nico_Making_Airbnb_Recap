from rest_framework import serializers
from .models import Perk, Experience
from categories.serializers import CategorySerializer
from bookings.models import Booking
from django.utils import timezone


class PerkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Perk
        exclude = (
            "created_at",
            "updated_at",
        )


class PublicExperienceSerializer(serializers.ModelSerializer):

    rating = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        exclude = (
            "id",
            "created_at",
            "updated_at",
            "start",
            "end",
        )

    def get_rating(self, experience):
        return experience.rating()


class PrivateExperienceSerializer(serializers.ModelSerializer):

    category = CategorySerializer(read_only=True)
    perks = PerkSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    wishlists = serializers.SerializerMethodField()

    def get_reviews(self, experience):
        return experience.reviews()

    def get_wishlists(self, experience):
        return experience.wishlists()

    class Meta:
        model = Experience
        exclude = (
            "id",
            "created_at",
            "updated_at",
        )


class CreateExperienceSerializer(serializers.ModelSerializer):
    start = serializers.TimeField(required=True)
    end = serializers.TimeField(required=True)

    class Meta:
        model = Booking
        fields = "__all__"

    def validate_start(self, value):
        now = timezone.localtime(timezone.now()).time()
        if value < now:
            raise serializers.ValidationError("Can't book in the past.")
        return value

    def validate(self, data):
        start = data.get("start")
        end = data.get("end")

        if end <= start:
            raise serializers.ValidationError("End time must be later than start time.")

        return data


class CreateBookingSerializer(serializers.ModelSerializer):

    experience_time = serializers.DateTimeField(required=True)

    class Meta:
        model = Booking
        fields = (
            "check_in",
            "check_out",
            "guests",
            "experience_time",
        )

    def validate_experience_time(self, value):
        now = timezone.localtime(timezone.now())
        if now > value:
            raise serializers.ValidationError("Can't book in the past")
        return value