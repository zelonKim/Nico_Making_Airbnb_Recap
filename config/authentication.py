from rest_framework.authentication import BaseAuthentication
from users.models import User
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings

class TrustMeBroAuthentication(BaseAuthentication): # BaseAuthentication 클래스를 상속받음.
    def authenticate(self, request): # autehnticate()메서드를 오버라이딩함.
        username = request.headers.get('Trust-Me') 
        if not username: # 요청 헤더에 해당 키와 밸류를 보내지 않은 경우,
            return None
        try:
            user = User.objects.get(username=username) # 밸류에 해당하는 사용자가 존재하는 경우,
            return (user, None) # 사용자 데이터를 반환함.
        except User.DoesNotExist: 
            raise AuthenticationFailed(f'{username}라는 사용자는 존재하지 않습니다.')




class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.headers.get('Jwt') 
        if not token:
            return None
        
        user_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"]) # 토큰을 복호화하여 사용자 데이터를 생성함.
        pk = user_data.get('pk')
        if not pk:
            raise AuthenticationFailed("유효하지 않은 토큰 입니다.")
        try:
            user = User.objects.get(pk=pk)
            return (user, None)
        except User.DoesNotExist:
            raise AuthenticationFailed("사용자가 존재하지 않습니다.")