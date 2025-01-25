from django.shortcuts import render
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


client=MongoClient('mongodb://localhost:27017/')
db = client['Swiggy']


SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SMTP_USERNAME = 'kandaring2k24@gmail.com'
SMTP_PASSWORD = 'rqdfvijjlywvcxyp'

otp_storage = {}

def send_otp_email(email, otp):
    try:
        msg = MIMEText(f'Your verification OTP is: {otp}')
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
def verify_email(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')

            existing_user = db.users_signupdetail.find_one({'email': email})
            if existing_user:
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
def user_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            Required_fields = ['email', 'phonenumber', 'password', 'otp']
            for field in Required_fields:
                if field not in data:
                    return JsonResponse({'error': f'{field} is required'}, status=400)

            stored_otp = otp_storage.get(data['email'])
            if stored_otp != data['otp']:
                return JsonResponse({'alert': 'Invalid OTP'}, status=400)

            existing_user = db.users_signupdetail.find_one({'email': data['email']})
            if existing_user:
                return JsonResponse({'alert': 'Email already exists'}, status=400)

            user = db.users_signupdetail.insert_one({
                'email': data['email'],
                'phonenumber': data['phonenumber'],
                'password': data['password']
            })

            del otp_storage[data['email']]

            return JsonResponse({'message': 'Signup Successful'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

    return JsonResponse({'message': 'Invalid request method'}, status=405)  


@csrf_exempt
def user_login(request):
    if request.method=='POST':
        try:
            data=json.loads(request.body.decode('utf-8'))

            Required_fields=['email','password']

            for feild in Required_fields:
                if not feild in data:
                    return JsonResponse({'message':''f'{feild} is required'})
                
            existing_user=db.users_signupdetail.find_one({
                'email':data['email'],
                'password':data['password'],
            })    

            if existing_user:
                return JsonResponse({'message':'Login Successfully'},status=200)
            
        except json.JSONDecodeError:
            return JsonResponse({'message':'Invalid JSON'},status=400)
        
        return JsonResponse({'message':'invalid Request'},status=405)
    

@csrf_exempt
def deliveryboy_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))    

            Required_fields = [ 'email','phonenumber', 'password']

            for field in Required_fields:
                if field not in data:
                    return JsonResponse({'error': f'{field} is required'}, status=400)
                
            existing_user = db.deliveryboy_signupdetail.find_one({'email': data['email']})
            if existing_user:
                return JsonResponse({'alert': 'Email already exists'}, status=400)

            user = db.deliveryboy_signupdetail.insert_one({
                'email': data['email'],
                'phonenumber': data['phonenumber'],
                'password': data['password']  
            }) 

            return JsonResponse({'message': 'Signup Successful'}, status=200)
            
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)
        
    return JsonResponse({'message': 'Invalid request method'}, status=405)   


@csrf_exempt
def deliveryboy_login(request):
    if request.method=='POST':
        try:
            data=json.loads(request.body.decode('utf-8'))

            Required_fields=['email','password']

            for feild in Required_fields:
                if not feild in data:
                    return JsonResponse({'message':''f'{feild} is required'})
                
            existing_user=db.deliveryboy_signupdetail.find_one({
                'email':data['email'],
                'password':data['password'],
            })    

            if existing_user:
                return JsonResponse({'message':'Login Successfully'},status=200)
            
        except json.JSONDecodeError:
            return JsonResponse({'message':'Invalid JSON'},status=400)
        
        return JsonResponse({'message':'invalid Request'},status=405)

