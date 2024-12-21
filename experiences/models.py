from django.db import models
from common.models import CommonModel
from rest_framework.response import Response
from reviews.serializers import ReviewSerializer


class Experience(CommonModel):
    country = models.CharField(
        max_length=50,
        default="Korea",
    )
    city = models.CharField(
        max_length=80,
        default="Seoul",
    )
    name = models.CharField(
        max_length=250,
    )
    host = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
    )
    price = models.PositiveIntegerField()
    address = models.CharField(
        max_length=100,
    )
    start = models.TimeField()
    end = models.TimeField()
    description = models.TextField()
    perks = models.ManyToManyField(
        "experiences.Perk",
    )
    category = models.ForeignKey(
        "categories.Category",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return self.name

    def rating(experience):
        count = experience.review_set.count()
        if count == 0:
            return 0
        else:
            total_rating = 0
            for review in experience.review_set.all().values("rating"):
                total_rating += review["rating"]
            return round(total_rating / count, 2)

    def reviews(experience):
        reviews = experience.review_set.all().values()
        return reviews

    def wishlists(experience):
        wishlists = experience.wishlist_set.all().values()
        return wishlists


class Perk(CommonModel):

    name = models.CharField(
        max_length=100,
    )
    details = models.CharField(
        max_length=250,
        null=True,
        blank=True,
    )
    explanation = models.TextField(
        blank=True,
        null=True,
    )

    def __str__(self) -> str:
        return self.name