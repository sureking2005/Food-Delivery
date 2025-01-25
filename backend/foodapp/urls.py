from django.urls import path
from . import views 

urlpatterns=[
    path('usersignup/',views.user_signup,name='user_signup'),
    path('userlogin/',views.user_login,name='user_login'),
    path('verifyemail/',views.verify_email,name='verify_email'),


    path('deliveryboysignup/',views.user_signup,name='deliveryboy_signup'),
    path('deliveryboylogin/',views.user_login,name='deliveryboy_login'),

]
