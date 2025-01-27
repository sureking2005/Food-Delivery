from django.urls import path
from . import views 

urlpatterns=[
    path('usersignup/',views.user_signup,name='user_signup'),
    path('userlogin/',views.user_login,name='user_login'),
    path('userreset/',views.user_reset,name='user_reset'),
    path('userverifyemail/',views.user_verify_email,name='user_verify_email'),
    path('userverifyforgotemail/',views.user_verify_forgot_email,name='user_verify_forgot_email'),
    path('userverifyotp/',views.user_verify_otp,name='user_verify_otp'),



    path('deliveryboysignup/',views.deliveryboy_signup,name='deliveryboy_signup'),
    path('deliveryboylogin/',views.deliveryboy_login,name='deliveryboy_login'),
    path('deliveryboyreset/',views.deliveryboy_reset,name='deliveryboy_reset'),
    path('deliveryboyverifyemail/',views.deliveryboy_verify_email,name='deliveryboy_verify_email'),
    path('deliveryboyverifyforgotemail/',views.deliveryboy_verify_forgot_email,name='deliveryboy_verify_forgot_email'),
    path('deliveryboyverifyotp/',views.deliveryboy_verify_otp,name='deliveryboy_verify_otp'),
    
    path('forgot-password/send-otp/', views.user_verify_forgot_email, name='send_otp'),
    path('forgot-password/verify-otp/', views.user_verify_otp, name='verify_otp'),
    path('forgot-password/reset/', views.user_reset, name='reset_password')
    


]
