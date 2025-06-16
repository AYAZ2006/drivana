import random
import requests
from django.conf import settings
from rest_framework import generics
from django.http import JsonResponse
from django.views import View
from .models import EmailOTP,Orders,Details,Drive,Ride,Personal
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework import status
from .serializers import UserRegistrationSerializer,SendOTPSerializer,OrderSerializer,DetailSerializer,DriveSerializer,RideSerializer,PerosnalSerializer
from .email_utils import send_otp_email

class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer=UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

User=get_user_model()
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username=request.data.get("username")
        password=request.data.get("password")
        role=request.data.get("role")
        if not username or not password or not role:
            return Response({"detail": "Username, password, and role are required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user=User.objects.get(username=username, role=role)
            if not check_password(password, user.password):
                return Response({"detail": "Invalid password."}, status=status.HTTP_401_UNAUTHORIZED)
            refresh=RefreshToken.for_user(user)
            access_token=str(refresh.access_token)
            return Response({
                "refresh": str(refresh),
                "access": access_token,
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "Invalid username or role."}, status=status.HTTP_401_UNAUTHORIZED)


class SendOTPView(APIView):
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = str(random.randint(1000, 9999))
            send_otp_email(email, otp_code)
            return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrdersView(generics.GenericAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        return Orders.objects.filter(username=username)

    def get(self, request, *args, **kwargs):
        orders = self.get_queryset()
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        username = self.kwargs['username']
        data = request.data.copy()
        data['username'] = username

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DetailsView(APIView):
    def get(self, request, username):
        user_details=Details.objects.filter(username=username)
        serializer=DetailSerializer(user_details, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, username):
        data=request.data.copy()
        data['username']=username
        serializer=DetailSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DriveView(APIView):
    def get(self, request):
        user_details=Drive.objects.filter()
        serializer=DriveSerializer(user_details, many=True)
        return Response(serializer.data, status=200)
    def post(self, request):
        ride_id=request.data.get('id')
        accepted_by=request.data.get('accepted_by')
        if ride_id and accepted_by:
            try:
                drive=Drive.objects.get(id=ride_id)
                drive.accepted_by=accepted_by
                drive.save()
                return Response({'message': f'Ride {ride_id} accepted by {accepted_by}'}, status=200)
            except Drive.DoesNotExist:
                return Response({'error': 'Ride not found'}, status=404)
        username=request.data.get('username')
        if not username:
            return Response({'error': 'Username is required.'}, status=400)
        serializer=DriveSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def delete(self, request):
        ride_id=request.data.get('id')
        if not ride_id:
            return Response({'error': 'ID is required.'}, status=400)
        try:
            drive=Drive.objects.get(id=ride_id)
            drive.delete()
            return Response({'message': f'Ride with ID {ride_id} deleted.'}, status=200)
        except Drive.DoesNotExist:
            return Response({'error': f'Ride with ID {ride_id} does not exist.'}, status=404)

class RideOrderView(APIView):
    def get(self, request, username=None):
        orders = Ride.objects.all()
        serializer = RideSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, username=None):
        serializer = RideSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PersonalView(APIView):
    def get(self, request, username):
        user_details = Personal.objects.filter(details__username=username)
        serializer = PerosnalSerializer(user_details, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, username):
        data = request.data
        try:
            obj = Personal.objects.get(details__username=username)
            obj.details.update(data.get('details', {}))
            obj.save()
            serializer = PerosnalSerializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Personal.DoesNotExist:
            details = data.get('details', {})
            details['username'] = username
            serializer = PerosnalSerializer(data={'details': details})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)