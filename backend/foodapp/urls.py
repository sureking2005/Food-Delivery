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
    
    path('adminsignup/',views.admin_signup,name='admin_signup'),
    path('adminlogin/',views.admin_login,name='admin_login'),
    path('adminreset/',views.admin_reset,name='admin_reset'),
    path('adminverifyemail/',views.admin_verify_email,name='admin_verify_email'),
    path('adminverifyforgotemail/',views.admin_verify_forgot_email,name='admin_verify_forgot_email'),
    path('adminverifyotp/',views.admin_verify_otp,name='admin_verify_otp'),

    path('ownersignup/',views.owner_signup,name='owner_signup'),
    path('ownerlogin/',views.owner_login,name='owner_login'),
    path('ownerreset/',views.owner_reset,name='owner_reset'),
    path('ownerverifyemail/',views.owner_verify_email,name='owner_verify_email'),
    path('ownerverifyforgotemail/',views.owner_verify_forgot_email,name='owner_verify_forgot_email'),
    path('ownerverifyotp/',views.owner_verify_otp,name='owner_verify_otp'),
    path('owneradd/',views.owner_add,name='owner_add'),
    path('ownersubmissions/',views.owner_submissions,name='owner_submissions'),



    path('addcart/',views.add_to_cart,name='add_to_cart'),



]
