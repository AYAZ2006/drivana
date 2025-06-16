from django.core.mail import EmailMessage, get_connection
import ssl
import certifi

def send_otp_email(to_email, otp_code):
    context = ssl.create_default_context(cafile=certifi.where())

    connection = get_connection(
        host='smtp.gmail.com',
        port=587,
        username='djangouser7075@gmail.com',
        password='dhun vneb kzea iodh',
        use_tls=True,
        ssl_context=context
    )

    email = EmailMessage(
        subject='Your OTP Code',
        body=f'Your OTP is: {otp_code}',
        from_email='your_email@gmail.com',
        to=[to_email],
        connection=connection
    )
    email.send()
