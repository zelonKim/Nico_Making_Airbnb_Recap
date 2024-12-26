from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ParseError, NotFound
from . import serializers
from .models import User
from django.contrib.auth import authenticate, login, logout
import jwt
from django.conf import settings
import requests

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
        
        
        
class LogIn(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            raise ParseError
        
        user_data = authenticate(request, username=username, password=password)
        if user_data:
            login(request, user_data)
            return Response({"ok": "welcome"})
        else:
            return Response({"error": "wrong password"})
        
            
            
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
        code = request.data.get('code')        
        access_token = requests.post(f"https://github.com/login/oauth/access_token?code={code}&client_id=Ov23liY52Cb1u41vJTkU&client_secret={settings.GH_SECRET}", headers={"Accept":"application/json"})
        access_token = access_token.json().get("access_token")
        user_data = requests.get("https://api.github.com/user", headers={"Authorization": f"Bearer {access_token}", "Accept":"application/json"})
        user_data = user_data.json()
        print(user_data)
  