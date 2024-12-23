from rest_framework.test import APITestCase
from . import models
from users.models import User

class TestAmenities(APITestCase):
    NAME = "Amenity Test"
    DESC = "Amenity Des"
    URL = "/api/v1/rooms/amenities/"


    def setUp(self):
        models.Amenity.objects.create(
            name = self.NAME,
            description = self.DESC
        )

        
    def test_all_amenities(self):
        response = self.client.get(self.URL) 
        data = response.json()
        
        self.assertEqual(response.status_code, 200, "상태코드가 200이 아닙니다.")
        
        self.assertIsInstance(data, list)
        
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], self.NAME)
        self.assertEqual(data[0]["description"], self.DESC)
        
        
    
    def test_create_amenity(self):
        new_amenity_name = "New Amenity"
        new_amenity_description = "New Amenity Desc"
        
        response = self.client.post(self.URL, 
            data={
                "name":new_amenity_name, 
                "description":new_amenity_description
            })
        data = response.json()
        
        self.assertEqual(response.status_code, 200, "상태코드 200이 아닙니다.")

        self.assertEqual(data["name"], new_amenity_name)
        self.assertEqual(data["description"], new_amenity_description)


        response = self.client.post(self.URL)
        data = response.json()
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("name", data)
        
    
    
    
class TestAmenity(APITestCase):
    NAME = "Amenity Test"
    DESC = "Amenity Des"
    
    def setUp(self):
        models.Amenity.objects.create(
            name=self.NAME,
            description=self.DESC
        )
    
    def test_amenity_not_found(self):
        response = self.client.get("/api/v1/rooms/amenities/2")
        self.assertEqual(response.status_code, 404)
    
    
    def test_get_amenity(self):
        response = self.client.get("/api/v1/rooms/amenities/1")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], self.NAME)
        self.assertEqual(data["description"], self.DESC)
        
    
    def test_delete_amenity(self):
        response = self.client.delete("/api/v1/rooms/amenities/1")
        self.assertEqual(response.status_code, 204)
        
    
    
    def test_put_amenity(self):
        updated_amenity_name = "Updated Amenity"
        updated_amenity_description = "Updated Amenity desc"
        
        response = self.client.put("/api/v1/rooms/amenities/1",
            data={
                "name": updated_amenity_name,
                "description": updated_amenity_description,
                },
            )
        data = response.json()
        self.assertEqual(response.status_code, 200, "상태코드가 200이 아닙니다.")
        self.assertEqual(data["name"], updated_amenity_name)
        self.assertEqual(data["description"], updated_amenity_description)
        
        
        updated_amenity_name = "Updated Amenity2"
        
        response = self.client.put("/api/v1/rooms/amenities/1",
            data={
                "name": updated_amenity_name,
            }
        )
        data = response.json()
        self.assertEqual(data["name"], updated_amenity_name)
        self.assertEqual(data["description"], updated_amenity_description)
        
        
        
        updated_amenity_description = "Updated Amenity desc 2"
        
        response = self.client.put("/api/v1/rooms/amenities/1",
            data={
                "description": updated_amenity_description,
            },
        )
        data = response.json()
        self.assertEqual(data["name"], updated_amenity_name)
        self.assertEqual(data["description"], updated_amenity_description)
        




class TestRoom(APITestCase):
    
    def setUp(self):
        user = User.objects.create(
            username="test",
        )
        user.set_password("1234")
        user.save()
        self.user = user
    
    
    def test_create_room(self):
        response = self.client.post("/api/v1/rooms/")
        self.assertEqual(response.status_code, 403)
        self.client.force_login(self.user)
    
    
    
        