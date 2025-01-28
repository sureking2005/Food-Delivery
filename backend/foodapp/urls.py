from django.urls import path
from . import views 
from . import user
from . import deliveryboy
from . import owner

urlpatterns=[
    path('usersignup/',user.user_signup,name='user_signup'),
    path('userlogin/',user.user_login,name='user_login'),
    path('userreset/',user.user_reset,name='user_reset'),
    path('userverifyemail/',user.user_verify_email,name='user_verify_email'),
    path('userverifyforgotemail/',user.user_verify_forgot_email,name='user_verify_forgot_email'),
    path('userverifyotp/',user.user_verify_otp,name='user_verify_otp'),



    path('deliveryboysignup/',deliveryboy.deliveryboy_signup,name='deliveryboy_signup'),
    path('deliveryboylogin/',deliveryboy.deliveryboy_login,name='deliveryboy_login'),
    path('deliveryboyreset/',deliveryboy.deliveryboy_reset,name='deliveryboy_reset'),
    path('deliveryboyverifyemail/',deliveryboy.deliveryboy_verify_email,name='deliveryboy_verify_email'),
    path('deliveryboyverifyforgotemail/',deliveryboy.deliveryboy_verify_forgot_email,name='deliveryboy_verify_forgot_email'),
    path('deliveryboyverifyotp/',deliveryboy.deliveryboy_verify_otp,name='deliveryboy_verify_otp'),
    
    path('adminsignup/',views.admin_signup,name='admin_signup'),
    path('adminlogin/',views.admin_login,name='admin_login'),
    path('adminreset/',views.admin_reset,name='admin_reset'),
    path('adminverifyemail/',views.admin_verify_email,name='admin_verify_email'),
    path('adminverifyforgotemail/',views.admin_verify_forgot_email,name='admin_verify_forgot_email'),
    path('adminverifyotp/',views.admin_verify_otp,name='admin_verify_otp'),
    path('adminhome/',views.admin_home,name='admin_home'),
    path('adminhomeupdate/',views.admin_home_update,name='admin_home_update'),
    path('adminuser/',views.admin_user,name='admin_user'),
    path('adminowner/',views.admin_owner,name='admin_owner'),
    # path('admindeliveryboy/',views.admin_deliveryboy,name='admin_deliveryboy'),
 
 




    path('ownersignup/',owner.owner_signup,name='owner_signup'),
    path('ownerlogin/',owner.owner_login,name='owner_login'),
    path('ownerreset/',owner.owner_reset,name='owner_reset'),
    path('ownerverifyemail/',owner.owner_verify_email,name='owner_verify_email'),
    path('ownerverifyforgotemail/',owner.owner_verify_forgot_email,name='owner_verify_forgot_email'),
    path('ownerverifyotp/',owner.owner_verify_otp,name='owner_verify_otp'),
    path('owneradd/',owner.owner_add,name='owner_add'),
    path('ownersubmissions/',owner.owner_submissions,name='owner_submissions'),
    path('ownermenu/',owner.owner_menu,name='owner_menu'),



    path('addcart/',user.add_to_cart,name='add_to_cart'),



]
