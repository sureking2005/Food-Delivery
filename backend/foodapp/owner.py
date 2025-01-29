from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pymongo
from pymongo import MongoClient
import base64
import smtplib
from email.mime.text import MIMEText
import random
import bcrypt
from datetime import datetime, timedelta


client=MongoClient('mongodb+srv://kavinkavin8466:1234@fooddelivery.i05g3.mongodb.net/?retryWrites=true&w=majority&appName=fooddelivery')
db = client['fooddelivery']


SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SMTP_USERNAME = 'kandaring2k24@gmail.com'
SMTP_PASSWORD = 'rqdfvijjlywvcxyp'

otp_storage = {}
login_attempts = {}  


def send_otp_email(email, otp):
    try:
        msg = MIMEText(f'Your verification OTP is: {otp}. It is valid for 24hours only')
        msg['Subject'] = 'Email Verification OTP'
        msg['From'] = SMTP_USERNAME
        msg['To'] = email

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Email sending error: {e}")
        return False



@csrf_exempt
def owner_verify_email(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')

            existing_owner = db.owner_signupdetail.find_one({'email': email})

            if existing_owner:
                return JsonResponse({'alert': 'Email already exists'}, status=400)

            otp = str(random.randint(100000, 999999))
            otp_storage[email] = otp

            if send_otp_email(email, otp):
                return JsonResponse({'message': 'OTP Sent'}, status=200)
            else:
                return JsonResponse({'message': 'Failed to send OTP'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

    return JsonResponse({'message': 'Invalid request method'}, status=405)

@csrf_exempt
def owner_verify_forgot_email(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
    

            existing_owner = db.owner_signupdetail.find_one({'email': email})

            if existing_owner :

                otp = str(random.randint(100000, 999999))
                otp_storage[email] = {
                'otp': otp,
                'timestamp': datetime.now()
                }  

            else:
                return JsonResponse({'alert': 'Email doesnt exist ,signup '}, status=400)


            if send_otp_email(email, otp):
                return JsonResponse({'message': 'OTP Sent'}, status=200)
            else:
                return JsonResponse({'message': 'Failed to send OTP'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

    return JsonResponse({'message': 'Invalid request method'}, status=405)



@csrf_exempt
def owner_verify_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            otp = data.get('otp')

            stored_otp_data = otp_storage.get(email)
            if stored_otp_data:
                time_diff = datetime.now() - stored_otp_data['timestamp']
                if time_diff > timedelta(hours=24):
                    return JsonResponse({'alert': 'OTP Expired'})

            del otp_storage[email]

            return JsonResponse({'message': 'OTP Verified'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

    return JsonResponse({'message': 'Invalid request method'}, status=405)

@csrf_exempt
def owner_reset(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            new_password = data.get('newPassword')

            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

            result = db.owner_signupdetail.update_one(
                {'email': email},
                {'$set': {'password': hashed_password.decode('utf-8')}}
            )

            if result.modified_count > 0:
                return JsonResponse({'message': 'Password Reset Successful'}, status=200)
            else:
                return JsonResponse({'message': 'User not found'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

    return JsonResponse({'message': 'Invalid request method'}, status=405)



@csrf_exempt
def owner_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            phonenumber = data.get('phonenumber')

            
            Required_fields = ['name','hotel_name','email', 'phonenumber','address','password', 'otp','role','status']
            for field in Required_fields:
                if field not in data:
                    return JsonResponse({'error': f'{field} is required'}, status=400)
                
            existing_phone = db.owner_signupdetail.find_one({'phonenumber': phonenumber})
            if existing_phone:
                return JsonResponse({'alert': 'Phonenumber already exists'}, status=400)
            

            stored_otp = otp_storage.get(data['email'])
            if stored_otp != data['otp']:
                return JsonResponse({'alert': 'Invalid OTP'}, status=400)

            existing_user = db.owner_signupdetail.find_one({'email': data['email']})
            if existing_user:
                return JsonResponse({'alert': 'Email already exists'}, status=400)
            
            hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
            

            user = db.owner_signupdetail.insert_one({
                'name':data['name'],
                'hotel_name':data['hotel_name'],
                'email': data['email'],
                'phonenumber': data['phonenumber'],
                'address':data['address'],
                'password':  hashed_password.decode('utf-8'),
                'role': data['role'],
                'status':data['status'],
            })

            del otp_storage[data['email']]

            return JsonResponse({'message': 'Signup Successful'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

    return JsonResponse({'message': 'Invalid request method'}, status=405)  


@csrf_exempt
def owner_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            primary_key = data.get('primary_key')
            password = data.get('password')

          
            existing_user = db.owner_signupdetail.find_one({'email': primary_key})
           
            existing_user_1 = db.owner_signupdetail.find_one({'phonenumber': primary_key})

            if (primary_key) not in login_attempts:
                login_attempts[primary_key] = {'count': 0, 'timestamp': datetime.now()}

            if login_attempts[primary_key]['count'] >= 5:
                return JsonResponse({'error': 'Account locked. Try again later.'}, status=403)

          
            if existing_user:
                if bcrypt.checkpw(password.encode('utf-8'), existing_user['password'].encode('utf-8')):
                   
                    login_attempts[primary_key] = {'count': 0, 'timestamp': datetime.now()}
                    
                 
                    if existing_user.get('status') == 'in_review':
                        return JsonResponse({'message': 'Registration in progress', 'status': 'inreview'}, status=200)
                    elif existing_user.get('status') == 'rejected':
                        return JsonResponse({'message': 'Registration rejected', 'status': 'rejected'}, status=200)
                    elif existing_user.get('status') == 'accepted':
                        return JsonResponse({'message': 'Login Successfully', 'status': 'accepted'}, status=200)
                else:
                    login_attempts[primary_key]['count'] += 1
                    return JsonResponse({'error': 'Invalid credentials'}, status=400)

           
            elif existing_user_1:
                if bcrypt.checkpw(password.encode('utf-8'), existing_user_1['password'].encode('utf-8')):
                  
                    login_attempts[primary_key] = {'count': 0, 'timestamp': datetime.now()}
                    
                
                    if existing_user_1.get('status') == 'in_review':
                        return JsonResponse({'message': 'Registration in progress', 'status': 'inreview'}, status=200)
                    elif existing_user_1.get('status') == 'rejected':
                        return JsonResponse({'message': 'Registration rejected', 'status': 'rejected'}, status=200)
                    elif existing_user_1.get('status') == 'accepted':
                        return JsonResponse({'message': 'Login Successfully', 'status': 'accepted'}, status=200)
                else:
                    login_attempts[primary_key]['count'] += 1
                    return JsonResponse({'error': 'Invalid credentials'}, status=400)
            else:
                return JsonResponse({'error': 'User not found'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
# @csrf_exempt
# def owner_add(request):
#     if request.method=='POST':
#         try:
#             data=json.loads(request.body.decode('utf-8'))

#             required_feilds=['hotel_name','owner_name','hotel_address',
#                              'hotel_email','hotel_number','food_menu','status']
#             for feild in required_feilds:

#                 if feild not in data:
#                     return JsonResponse({'alert':''f'{feild} is required'})
                
#                 owner_detail=db.owner_details.insert_one({
#                     'hotel_name':data['hotel_name'],
#                     'owner_name':data['owner_name'],
#                     'hotel_address':data['hotel_address'],
#                     'hotel_email':data['hotel_email'],
#                     'hotel_number':data['hotel_number'],
#                     'food_menu':data['food_menu'],
#                     'status':data['status']

#                 })

#                 if owner_detail:
#                     return JsonResponse({'message':'Submitted successfully'},status=200)
#                 else:
#                     return JsonResponse({'error':'Not submitted'},status=400)

#         except json.JSONDecodeError:
#             return JsonResponse({'alert':'Invalid JSON'},status=400)    

#     return JsonResponse({'alert':'Invalid request method'},status=405)    


# @csrf_exempt
# def owner_submissions(request):
#     if request.method == 'GET':
#         try:
#             submissions = list(db.owner_details.find())
            
#             processed=[]
#             for data in submissions:
#                 data['_id']=str(data['_id'])
                
#                 processed.append(data)
            
#             return JsonResponse(processed,safe=False)    
           
#         except Exception as e:
#              return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return JsonResponse({'error':'invalid Method'}, status=405)    

@csrf_exempt
def owner_menu(request):
    if request.method=='GET':
        food_items=list(db.owner_menu.find())

        processed=[]

        for food in food_items:
            food['_id']=str(food['_id'])

            if food.get('image'):
                food['image'] = {
                    'filename': food['image']['filename'],
                    'content': base64.b64encode(food['image']['content']).decode('utf-8'),
                    'content_type': food['image']['content_type']
                }

                processed.append(food)

        return JsonResponse(processed,safe=False)  


    elif request.method=='POST':
        try:
            image=request.FILES.get('image')

            food_item=({
                'name':request.POST.get('name'),
                'price':request.POST.get('price'),
                'stock':request.POST.get('stock'),

                
                'image':{
                    'filename':image.name,
                    'content' : image.read(),
                    'content_type': image.content_type
                }if image else None
            })

            store_food=db.owner_menu.insert_one(food_item)

            return JsonResponse({'message':'Food added succesfully'},status=200)
        except json.JSONDecodeError:
            return JsonResponse({'message':'Invalid JSON'},status=400)
        
    return JsonResponse({'message':'Invalid Request method'},status=405) 