from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Orders,Details,Drive,Ride,Personal
User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data['role'],
        )
        return user

class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model=Orders
        fields='__all__'

class DetailSerializer(serializers.ModelSerializer):
    class Meta:
        model=Details
        fields='__all__'

class DriveSerializer(serializers.ModelSerializer):
    class Meta:
        model=Drive
        fields='__all__'

class RideSerializer(serializers.ModelSerializer):
    class Meta:
        model=Ride
        fields='__all__'

class PerosnalSerializer(serializers.ModelSerializer):
    class Meta:
        model=Personal
        fields='__all__'