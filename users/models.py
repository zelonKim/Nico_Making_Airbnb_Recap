from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    
    class GenderChoices(models.TextChoices):
        MALE = ("male", "Male")
        FEMALE = ("female", "Female")

        
    class LanguageChoices(models.TextChoices):
        KR = ("kr", "Korean")
        EN = ("en", "English")
        FR = ("fr", "French")
        SP = ("sp", "Spanish")
        CH = ("ch", "Chinese")
        JP = ("jp", "Japanese")
        AR = ("ar", "Arabic")


    class CurrencyChoices(models.TextChoices):
        WON = "won", "Korean Won"
        USD = "usd", "US Dollar"
        EUR = "euro", "Europe Euro"
        CNY = "yuan", "China Yuan"
        YEN = "yen", "Japan Yen"
        AED = "dirh", "Arab Dirham"
        
        
    first_name = models.CharField(max_length=150, editable=False)
    last_name = models.CharField(max_length=150,  editable=False)
    avatar = models.URLField(blank=True)
    name = models.CharField(max_length=150, default="")
    is_host = models.BooleanField(default=False)
    gender = models.CharField(max_length=10, choices=GenderChoices.choices,)
    language = models.CharField(max_length=10, choices=LanguageChoices.choices,)
    currency = models.CharField(max_length=10, choices=CurrencyChoices.choices,)
    