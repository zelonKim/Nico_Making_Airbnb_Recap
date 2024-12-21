from django.urls import path
from .views import (
    Perks,
    PerkDetail,
    Experiences,
    ExperienceDetail,
    BookingDetail,
    ExperienceBookings,
)

urlpatterns = [
    path("", Experiences.as_view()),
    path("perks/", Perks.as_view()),
    path("perks/<int:pk>", PerkDetail.as_view()),
    path("<int:pk>", ExperienceDetail.as_view()),
    path("<int:pk>/bookings", ExperienceBookings.as_view()),
    path("<int:pk>/bookings/<int:booking_pk>", BookingDetail.as_view()),
]