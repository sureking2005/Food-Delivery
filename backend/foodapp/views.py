from django.shortcuts import render
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pymongo
from pymongo import MongoClient
import base64


client=MongoClient('mongodb://localhost:27017/')
db = client['Swiggy']

@csrf_exempt
def user_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))    

            Required_fields = [ 'email','phonenumber', 'password']

            for field in Required_fields:
                if field not in data:
                    return JsonResponse({'error': f'{field} is required'}, status=400)
                
            existing_user = db.users_signupdetail.find_one({'email': data['email']})
            if existing_user:
                return JsonResponse({'alert': 'Email already exists'}, status=400)

            user = db.users_signupdetail.insert_one({
                'email': data['email'],
                'phonenumber': data['phonenumber'],
                'password': data['password']  
            }) 

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

