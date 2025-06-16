from django.urls import path
from .views import RegisterView,LoginView,SendOTPView,OrdersView,DetailsView,DriveView,RideOrderView,PersonalView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register_user'),
    path('login/', LoginView.as_view(), name='login_user'),
    path('send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('<str:username>/orders/', OrdersView.as_view(), name='orders'),
    path('<str:username>/details/', DetailsView.as_view(), name='details'),
    path('<str:username>/rides/', RideOrderView.as_view(), name='rides'),
    path('<str:username>/personal/', PersonalView.as_view(), name='personal'),
    path('drive/', DriveView.as_view(), name='details')
]
