from rest_framework.test import APITestCase

class TestAmenities(APITestCase):
    def test_two_plus_two(self):
        self.assertEqual(2+2, 4, "계산 오류")
        
    def test_all_amenities(self):
        response = self.client.get("/api/v1/rooms/amenities/")
        data = response.json()
        
        self.assertEqual(response.status_code, 200, "상태코드가 200이 아닙니다.")
        
        self.assertIsInstance(data, str)