from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import timedelta
from django.utils import timezone

class CustomUser(AbstractUser):
    role=models.CharField(max_length=50)
    user_permissions=models.ManyToManyField('auth.Permission',related_name='customuser_set',blank=True)
    def __str__(self):
        return f"{self.username} ({self.role})"

class EmailOTP(models.Model):
    email=models.EmailField(unique=True)
    otp=models.CharField(max_length=6)
    created_at=models.DateTimeField(auto_now_add=True)
    def is_expired(self):
        return timezone.now()>self.created_at+timedelta(minutes=5)

class Orders(models.Model):
    username=models.CharField(max_length=150)
    order_name=models.JSONField()
    quantity=models.IntegerField()
    total_price=models.IntegerField()

class Details(models.Model):
    username=models.CharField(max_length=150)
    details=models.JSONField()
    
class Drive(models.Model):
    username=models.CharField(max_length=150)
    details=models.JSONField()
    accepted_by=models.CharField(max_length=100, null=True, blank=True)

class Personal(models.Model):
    details=models.JSONField()
    
class Ride(models.Model):
    pickup=models.CharField(max_length=255)
    dropoff=models.CharField(max_length=255)
    ride_type=models.CharField(max_length=100)
    quantity=models.IntegerField()
    total_price=models.DecimalField(max_digits=10, decimal_places=2)
    timestamp=models.DateTimeField(auto_now_add=True)

