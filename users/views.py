from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import NotFound, NotAuthenticated, ParseError, PermissionDenied

from . import serializers
from .models import User
from django.contrib.auth import authenticate, login, logout
import jwt
from django.conf import settings
import requests
from .serializers import ProfileUserSerializer
from medias.serializers import PhotoSerializer


class Me(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response(serializers.PrivateUserSerializer(user).data)

    def put(self, request):
        user = request.user
        modelObj_user = serializers.PrivateUserSerializer(user, data=request.data, partial=True)
        if modelObj_user.is_valid():
            update_user = modelObj_user.save()
            return Response(serializers.PrivateUserSerializer(update_user).data)
        else:
            return Response(modelObj_user.errors)
        


class Users(APIView):
    def post(self, request):
        password = request.data.get('password')
        if not password:
            raise ParseError("비밀번호를 입력해주세요")
   
        modelObj_users = serializers.PrivateUserSerializer(data=request.data)
        if modelObj_users.is_valid():
            create_user = modelObj_users.save()
            create_user.set_password(password) # 주어진 비밀번호를 해싱해줌.
            create_user.save()
            return Response(serializers.PrivateUserSerializer(create_user).data)
        else:
            return Response(modelObj_users.errors)
            


class PublicUser(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound
        return Response(serializers.PrivateUserSerializer(user).data)
    
    
    
    
class ChangePassword(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        if not old_password or not new_password:
            raise ParseError
        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            raise ParseError



class ChangeProfile(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        user = request.user
        new_avatar = request.data.get('avatar')
        new_name = request.data.get('name')
        old_password = request.data.get('oldPassword')
        new_password = request.data.get('newPassword')
        new_email = request.data.get('email')
        
        if user.check_password(old_password):
            user.avatar = new_avatar
            user.name = new_name
            user.email = new_email
            user.set_password(new_password)
            user.save()
            login(request, user)
            return Response(status=status.HTTP_200_OK)
        else:
            raise ParseError
        
        
        
        
class LogIn(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            raise ParseError
        
        user_data = authenticate(request, username=username, password=password)
        if user_data:
            login(request, user_data)
            return Response({"username": username})
        else:
            raise ParseError({"error": "wrong input"})
        
        
class SignUp(APIView):
    def post(self, request):
        try:
            name = request.data.get('name')
            email = request.data.get('email')
            username = request.data.get('username')
            password = request.data.get('password')
            passwordConfirm = request.data.get('passwordConfirm')
            
            if User.objects.filter(username=username):
                return Response({"error": "the username is already using"},
                                status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(email=email):
                return Response({"error": "the email is already using"},
                                status=status.HTTP_400_BAD_REQUEST)
            
            if password == passwordConfirm:
                user = User.objects.create(
                        name = name,
                        email = email,
                        username = username,
                    )
                user.set_password(password)
                user.save()
                login(request, user)
                return Response({"name": name}, status=status.HTTP_200_OK)
            else:
                raise ParseError({"error": "different password"})   
                   
        except Exception as e:
            return Response({"error": f"error occurred by{e}"}, status=status.HTTP_400_BAD_REQUEST)
            
            
            
            
class LogOut(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({"ok":"bye"})
    
    
class JWTLogIn(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            raise ParseError
        
        user_data = authenticate(request, username=username, password=password)
        
        if user_data:
            token = jwt.encode({"pk":user_data.pk}, settings.SECRET_KEY, algorithm="HS256") # 사용자 데이터를 암호화하여 토큰을 생성함.
            return Response({"token": token})
        else:
            return Response({"error": "wrong password"})
        
        
class GithubLogIn(APIView):
    def post(self, request):
        try:
            code = request.data.get('code')        
            
            access_token = requests.post(f"https://github.com/login/oauth/access_token?code={code}&client_id=Ov23liY52Cb1u41vJTkU&client_secret={settings.GH_SECRET}", headers={"Accept":"application/json"})
            access_token = access_token.json().get("access_token")
            
            user_data = requests.get("https://api.github.com/user", headers={"Authorization": f"Bearer {access_token}", "Accept":"application/json"})
            user_data = user_data.json()
            
            user_emails = requests.get("https://api.github.com/user/emails", headers={"Authorization": f"Bearer {access_token}", "Accept":"application/json"})
            user_emails = user_emails.json()
            
            try:
                user = User.objects.get(email=user_emails[0]['email'])
                login(request, user)
                return Response(status=status.HTTP_200_OK)
            
            except User.DoesNotExist:
                user = User.objects.create(
                    username = user_data.get('login'),
                    email = user_emails[0]['email'],
                    name = user_data.get('name'),
                    avatar = user_data.get('avatar_url')
                )
                user.set_unusable_password()
                user.save()
                login(request, user)
                
            return Response(status=status.HTTP_200_OK)
        
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
class KakaoLogIn(APIView):
    def post(self, request):
        try:
            code = request.data.get('code')
            
            access_token = requests.post("https://kauth.kakao.com/oauth/token",
                    headers = {
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                    },
                    data = {
                        "grant_type": "authorization_code",
                        "client_id": "3ecaaf42787d2ed2f6b6ce2ad7b144ca",
                        "redirect_uri":"http://127.0.0.1:3000/social/kakao",
                        "code": code,
                        "client_secret": "zQIvo1UmRkGCylvi0Sp2ak0ORWzFgmG8"
                    }
                )
            
            access_token = access_token.json().get('access_token')
        
            user_data = requests.get("https://kapi.kakao.com/v2/user/me", 
                    headers = {
                        "Authorization": f"Bearer ${access_token}",
                        "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
                    }
                )
            user_data = user_data.json()
            kakao_account = user_data.get("kakao_account")
            profile = kakao_account.get("profile")       
        
            try:
                user = User.objects.get(name=profile.get('nickname'))
                login(request, user)
                return Response(status=status.HTTP_200_OK)
            
            except User.DoesNotExist:
                user = User.objects.create(
                    username = profile.get('nickname'),
                    name = profile.get('nickname'),
                    avatar = profile.get('profile_image_url'),
                )
                user.set_unusable_password()
                user.save()
                login(request, user)
                return Response(status=status.HTTP_200_OK)
            
        except Exception:
           return Response(status=status.HTTP_400_BAD_REQUEST)
       
     