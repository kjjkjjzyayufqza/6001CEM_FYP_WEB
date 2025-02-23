import os
from fastapi import FastAPI, Body, HTTPException, status, Depends, Request, BackgroundTasks
from fastapi.responses import Response, JSONResponse, RedirectResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId
from typing import Optional, List, Annotated, Union, Dict, Any
import motor.motor_asyncio
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import datetime, timedelta
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pathlib import Path
from dotenv import load_dotenv
from enum import Enum
load_dotenv('.env')


class Envs:
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')


conf = ConnectionConfig(
    MAIL_USERNAME=Envs.MAIL_USERNAME,
    MAIL_PASSWORD=Envs.MAIL_PASSWORD,
    MAIL_FROM=Envs.MAIL_USERNAME,
    MAIL_PORT=587,
    MAIL_SERVER='smtp.gmail.com',
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=Path(__file__).parent,
)

app = FastAPI()
client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv('MONGODB_URL'))
db = client.userData

BACKEND_AUTH = 'FYP_BACKEND'

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 999999

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="Token")


class EmailSchema(BaseModel):
    email: List[EmailStr]
    body: Dict[str, Any]

    class Config:
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "email": [
                    "kjjkjjzyayufqza@gmail.com"
                ],
                "body": {"title": "OTP Code", "code": "hi"}
            }

        }


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Union[str, None] = None
    username: Union[str, None] = None


class UserModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(...)
    email: EmailStr = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "abc",
                "email": "abc@a.a",
            }
        }


class CreateUserModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "abc",
                "email": "abc@a.a",
                "password": "abc",
            }
        }


class DoctorCategory(Enum):
    General_Practitioner = 'General Practitioner'
    General_Surgeon = 'General Surgeon'
    Dermatologists = 'Dermatologists'
    Orthopedic_Surgeon = 'Orthopedic Surgeon'
    Ophthalmologist = 'Ophthalmologist'
    Internal_Medicine_Physician = 'Internal Medicine Physician'
    Otolaryngologist = 'Otolaryngologist'
    Psychologist = 'Psychologist'


class DiseaseList(Enum):
    infected_wound = 'infected wound'
    stomach_ache = 'stomach ache'
    acn = 'acne'
    joint_pain = 'joint pain'
    blurry_vision = 'blurry vision'
    feeling_dizzy = 'feeling dizzy'
    foot_ache = 'foot ache'
    head_ache = 'head ache'
    ear_ache = 'ear ache'
    hair_falling_out = 'hair falling out'
    emotional_pain = 'emotional pain'
    knee_pain = 'knee pain'
    skin_issue = 'skin issue'
    muscle_pain = 'muscle pain'
    feeling_cold = 'feeling cold'
    back_pain = 'back pain'
    chest_pain = 'chest pain'
    shoulder_pain = 'shoulder pain'
    hard_to_breath = 'hard to breath'
    cough = 'cough'
    injury_from_ports = 'injury from sports'
    neck_pain = 'neck pain'
    internal_pain = 'internal pain'
    open_wound = 'open wound'
    body_feels_weak = 'body feels weak'


class CreateDoctorModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: str
    mobile: str
    experience: str
    certifications: str
    category: DoctorCategory
    location: str
    openingHours: str
    about: str
    image: str
    locationPoint: Dict[str, float]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "Dr. Lee",
                "email": "drlee@ca.com",
                "mobile": "42714456",
                "experience": "15 years",
                "certifications": "10",
                "category": "General Practitioner",
                "location": "Kowloon Bay",
                "openingHours": '11:0 AM - 18:00 PM',
                "about": 'Good Doctor',
                "image": "https://st.focusedcollection.com/13422768/i/1800/focused_167534016-stock-photo-male-doctor-smiling-looking-camera.jpg",
                "locationPoint": {"latitude": 22.319764, "longitude": 114.226640},
            }
        }


class FeedBackModel(BaseModel):
    category: DiseaseList
    description: str = Field(...)
    date: datetime = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "category": "stomach ache",
                "description": "hello",
                "date" : datetime.now()
            }
        }


class UpdateUserModel(BaseModel):
    name: Optional[str]
    # email: Optional[EmailStr]
    password: Optional[str]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "abc",
                # "email": "abc@a.a",
                "password": "abc",
            }
        }


async def authenticate_user(username: str, password: str):
    user = await GetUserByEmail(username)
    if not user:
        return False
    if password != user['password']:
        return False
    return user


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = payload.get("id")
        if id is None:
            raise credentials_exception
        token_data = TokenData(id=id)
    except JWTError:
        raise credentials_exception
    user = await GetUserById(id=token_data.id)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: UserModel = Depends(get_current_user)):
    return current_user


async def GetUserById(id: str):
    if (data := await db["user"].find_one({"_id": id})) is not None:
        return data
    else:
        raise 'User Not Found'


async def GetUserByEmail(email: str):
    if (data := await db["user"].find_one({"email": email})) is not None:
        return data

    else:
        raise 'User Not Found'
