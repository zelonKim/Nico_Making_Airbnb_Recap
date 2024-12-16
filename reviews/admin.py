from django.contrib import admin
from .models import Review

class WordFilter(admin.SimpleListFilter):
    title = "단어로 필터링하기"
    parameter_name = "word"
    
    def lookups(self, request_info, admin_name):
        return [
            ("good", "Good"),
            ("great", "Great"),
            ("awesome", "Awesome")
        ]

    def queryset(self, request_info, all_reviews):
        word = self.value()
        if word:
            result =all_reviews.filter(payload__contains=word)  
            return result  
        else:
            return all_reviews
    
    

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("__str__", "payload",)
    list_filter = (WordFilter, "rating", "user__is_host", "room__category", "room__pet_friendly")