from django.urls import path
from . import views 

urlpatterns=[
    path('usersignup/',views.user_signup,name='user_signup'),
    path('userlogin/',views.user_login,name='user_login'),

    path('deliveryboysignup/',views.user_signup,name='deliveryboy_signup'),
    path('deliveryboylogin/',views.user_login,name='deliveryboy_login'),

]
