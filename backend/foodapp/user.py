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
from bson import ObjectId



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
def user_verify_email(request):
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
def user_verify_forgot_email(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
    

            existing_user = db.users_signupdetail.find_one({'email': email})

            if existing_user :

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
def user_verify_otp(request):
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
def user_reset(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            new_password = data.get('newPassword')

            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

            result = db.users_signupdetail.update_one(
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
def user_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            phonenumber = data.get('phonenumber')

            
            Required_fields = ['name','email', 'phonenumber', 'password', 'otp','role']
            for field in Required_fields:
                if field not in data:
                    return JsonResponse({'error': f'{field} is required'}, status=400)
                
            existing_phone = db.users_signupdetail.find_one({'phonenumber': phonenumber})
            if existing_phone:
                return JsonResponse({'alert': 'Phonenumber already exists'}, status=400)
            

            stored_otp = otp_storage.get(data['email'])
            if stored_otp != data['otp']:
                return JsonResponse({'alert': 'Invalid OTP'}, status=400)

            existing_user = db.users_signupdetail.find_one({'email': data['email']})
            if existing_user:
                return JsonResponse({'alert': 'Email already exists'}, status=400)
            
            hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
            

            user = db.users_signupdetail.insert_one({
                'name':data['name'],
                'email': data['email'],
                'phonenumber': data['phonenumber'],
                'password':  hashed_password.decode('utf-8'),
                'role':data['role']
            })

            del otp_storage[data['email']]

            return JsonResponse({'message': 'Signup Successful'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

    return JsonResponse({'message': 'Invalid request method'}, status=405)  


@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            primary_key = data.get('primary_key')
            password = data.get('password')

            existing_user = db.users_signupdetail.find_one({'email': primary_key})
            existing_user_1 =  db.users_signupdetail.find_one({'phonenumber': primary_key})
            
            
            if (primary_key) not in login_attempts:
                login_attempts[primary_key] = {'count': 0, 'timestamp': datetime.now()}
            
            if login_attempts[primary_key]['count'] >= 5:
                return JsonResponse({'error': 'Account locked. Try again after 12 hours.'}, status=403)

            if existing_user:
                if bcrypt.checkpw(password.encode('utf-8'), existing_user['password'].encode('utf-8')):
                    login_attempts[primary_key] = {'count': 0, 'timestamp': datetime.now()}
                    
                    return JsonResponse({'message': 'Login Successfully'}, status=200)
                else:
                    login_attempts[primary_key]['count'] += 1
                    return JsonResponse({'error': 'Invalid credentials'}, status=400)
                
            elif existing_user_1:
                if bcrypt.checkpw(password.encode('utf-8'), existing_user_1['password'].encode('utf-8')):
                    login_attempts[primary_key] = {'count': 0, 'timestamp': datetime.now()}
                    
   
                    
                    return JsonResponse({'message': 'Login Successfully'}, status=200)
                else:
                    login_attempts[primary_key]['count'] += 1
                    return JsonResponse({'error': 'Invalid credentials'}, status=400)
    
            else:
                return JsonResponse({'error': 'User not found'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        

@csrf_exempt
def user_home(request):
    if request.method=='GET':
        try:
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
        except Exception as e:    
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'alert':'Invalid request method'},status=400)
        

@csrf_exempt
def user_cart(request):
    if request.method == 'POST':
        try:
           
            image = request.FILES.get('image')
            
            
            name = request.POST.get('name')
            price = request.POST.get('price')
            stock = int(request.POST.get('stock', 0)) 
            email = request.POST.get('email')
            
           
            existing_item = db.user_carts.find_one({'name': name})
            
            if existing_item:
                
                current_count = int(existing_item.get('count', 1))
                new_count = current_count + 1
                
                db.user_carts.update_one(
                    {'name': name},
                    {'$set': {'count': new_count}}
                )
                
                return JsonResponse({'message': 'Item count updated successfully'}, status=200)
            else:
                
                food_item = {
                    'name': name,
                    'price': price,
                    'stock': stock,
                    'count': 1,
                    'email': email
                }
                
               
                if image:
                    food_item['image'] = {
                        'filename': image.name,
                        'content': base64.b64encode(image.read()).decode('utf-8'),
                        'content_type': image.content_type
                    }
                
              
                db.user_carts.insert_one(food_item)
                return JsonResponse({'message': 'Food added successfully'}, status=200)
                
        except Exception as e:
            print(f"Error in user_cart: {str(e)}")  
            return JsonResponse({'message': str(e)}, status=400)
    
    return JsonResponse({'message': 'Invalid Request method'}, status=405)
        
@csrf_exempt
def user_add_cart(request):
    if request.method == 'GET':
        try:
            food_items = list(db.user_carts.find())
            processed = []
            
            for food in food_items:
                food['_id'] = str(food['_id'])
                
                
                if food.get('image') and isinstance(food['image'].get('content'), (bytes, bytearray)):
                    
                    food['image']['content'] = base64.b64encode(food['image']['content']).decode('utf-8')
                elif food.get('image') and isinstance(food['image'].get('content'), str):
                    
                    food['image']['content'] = food['image']['content']

                if food.get('stock'):
                    food['stock'] = int(food['stock']) 

                    
                processed.append(food)
                
            return JsonResponse(processed, safe=False)
        except Exception as e:
            print(f"Error processing cart items: {str(e)}") 
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'alert': 'Invalid request method'}, status=400)

@csrf_exempt
def user_update_cart(request, item_id):
    try:
        
        if not ObjectId.is_valid(item_id):
            return JsonResponse({'message': 'Invalid item ID format'}, status=400)
            
        obj_id = ObjectId(item_id)
        
        if request.method == 'PUT':
            try:
                data = json.loads(request.body)
                new_count = data.get('count')
                
                if new_count is None:
                    return JsonResponse({'message': 'Count is required'}, status=400)
                
                result = db.user_carts.update_one(
                    {'_id': obj_id},
                    {'$set': {'count': new_count}}
                )
                
                if result.modified_count > 0:
                    return JsonResponse({'message': 'Cart updated successfully'}, status=200)
                return JsonResponse({'message': 'Item not found'}, status=404)
                
            except json.JSONDecodeError:
                return JsonResponse({'message': 'Invalid JSON'}, status=400)
                
        elif request.method == 'DELETE':
            
            item = db.user_carts.find_one({'_id': obj_id})
            if not item:
                return JsonResponse({'message': 'Item not found'}, status=404)
            
            result = db.user_carts.delete_one({'_id': obj_id})
            
            if result.deleted_count > 0:
                return JsonResponse({'message': 'Cart removed successfully'}, status=200)
            return JsonResponse({'message': 'Failed to remove item'}, status=500)
            
        return JsonResponse({'message': 'Invalid request method'}, status=405)
        
    except Exception as e:
        return JsonResponse({'message': f'Server error: {str(e)}'}, status=500)




@csrf_exempt
def user_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            user_id = data.get('userId') 
            items = data.get('items', [])
            shipping_address = data.get('shippingAddress', '')
            total_amount = data.get('totalAmount', 0)

            for item in items:
                name = item.get('name', '')
                ordered_quantity = int(item.get('quantity', 0))

               
                menu_item = db.owner_menu.find_one({'name': name})
                if not menu_item:
                    return JsonResponse({'message': f'Item {name} not found in stock'}, status=404)

                current_stock =int(menu_item.get('stock', 0))

                
                if current_stock < ordered_quantity:
                    return JsonResponse({'message': f'Insufficient stock for {name}'}, status=400)

               
                new_stock = current_stock - ordered_quantity

                result = db.owner_menu.update_one(
                    {'name': name},
                    {'$set': {'stock': new_stock}}  
                )

                if result.modified_count == 0:
                    return JsonResponse({'message': f'Failed to update stock for {name}'}, status=500)

            
            order_data = {
                'userId': user_id,
                'items': items,
                'shippingAddress': shipping_address,
                'totalAmount': total_amount,
            }
            result = db.user_orders.insert_one(order_data)

           
            db.user_carts.delete_many({'userId': user_id})

            return JsonResponse({'message': 'Order placed successfully!', 'order_id': str(result.inserted_id)}, status=200)

        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=400)
