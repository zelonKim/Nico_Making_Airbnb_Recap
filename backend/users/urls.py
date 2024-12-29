from django.urls import path
from .import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns= [
    path("", views.Users.as_view()),
    path("me", views.Me.as_view()),
    path("change-password", views.ChangePassword.as_view()),
    path("change-profile", views.ChangeProfile.as_view()),
    path("@<str:username>", views.PublicUser.as_view()),
    path("log-in", views.LogIn.as_view()),
    path("log-out", views.LogOut.as_view()),
    path("sign-up", views.SignUp.as_view()),
    path("token-login", obtain_auth_token), # 해당 URL로 username과 password 데이터를 바디에 담아서 POST요청을 보내면 토큰값으로 응답해줌. 
    path("jwt-login", views.JWTLogIn.as_view()),
    path("github", views.GithubLogIn.as_view()),
    path("kakao", views.KakaoLogIn.as_view()),
]