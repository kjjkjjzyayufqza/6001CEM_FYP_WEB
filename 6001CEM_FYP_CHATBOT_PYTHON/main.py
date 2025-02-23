from fastapi.middleware.cors import CORSMiddleware
from CPUinfo.CPUinfo import *
from Chat.chat import *
from ImageRecognition.Prediction_Pictures import *
from isHumanClassifier.isHumanClassifier import *
from UserAction.main import *
from typing import Union, Annotated
from fastapi.responses import RedirectResponse, FileResponse, Response
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
import sys
import geopy.distance
sys.path.append(r'.\Chat')


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

    class Config:
        schema_extra = {
            "example": {
                "name": "Foo",
                "description": "A very nice Item",
                "price": 35.4,
                "tax": 3.2,
            }
        }


class MessageBody(BaseModel):
    MessageStr: str

    class Config:
        schema_extra = {
            "MessageStr": "string"
        }


@app.get("/", tags=["default"])
async def docs_redirect():
    return RedirectResponse(url='/docs')


@app.post("/Chat", tags=["chat"])
def read_item(Message: MessageBody):
    response = ChatBot(Message.MessageStr)
    return JSONResponse(status_code=200, content={"result": True, "botMessage": response})


@app.post("/files", tags=["chat"])
async def create_file(image: Annotated[bytes, File()]):
    image_bytes: bytes = image
    isHuman = PredictionisHumanPictures(image_bytes)
    if(isHuman["isHuman"] == True):
        responseText = PredictionPictures(image_bytes)
    else:
        responseText = []

    return JSONResponse(status_code=200, content={"result": isHuman["isHuman"],
                                                  "message": isHuman["message"],
                                                  "top5Prediction": responseText})


@app.post("/Token", response_model=Token, tags=["authentication"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"id": user['_id'], "name": user['name']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/User", response_model=UserModel, tags=["users"])
async def read_users_me(current_user: UserModel = Depends(get_current_active_user)):
    return current_user


@app.post("/Register", response_description="Create User", response_model=CreateUserModel, tags=["users"])
async def create_user(user: CreateUserModel = Body(...)):
    user = jsonable_encoder(user)
    # Find if user email exists
    old_email = await db["user"].find_one({"email": user['email']})
    if(old_email is None):
        new_user = await db["user"].insert_one(user)
        created_user = await db["user"].find_one({"_id": new_user.inserted_id})
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_user)
    else:
        raise HTTPException(
            status_code=404, detail=f"User email already exists")


@app.put("/UpdateUser", response_description="Update a User", response_model=UserModel, tags=["users"])
async def update_user(current_user: UserModel = Depends(get_current_user), data: UpdateUserModel = Body(...)):
    id = current_user['_id']
    data = {k: v for k, v in data.dict().items() if v is not None}

    if len(data) >= 1:
        update_result = await db["user"].update_one({"_id": id}, {"$set": data})

        if update_result.modified_count == 1:
            if (
                update_user := await db["user"].find_one({"_id": id})
            ) is not None:
                return update_user

    if (existing_user := await db["user"].find_one({"_id": id})) is not None:
        return existing_user

    raise HTTPException(status_code=404, detail=f"User {id} not found")


@app.post("/GenerateOTP", tags=["users"])
async def Generate_OTP(
    background_tasks: BackgroundTasks,
    email: EmailSchema,
    Auth: str
):
    if(Auth == BACKEND_AUTH):
        message = MessageSchema(
            subject="Fastapi-Mail module",
            recipients=email.dict().get("email"),
            template_body=email.dict().get("body"),
            subtype=MessageType.html)

        fm = FastMail(conf)
        background_tasks.add_task(fm.send_message, message,
                                  template_name='email.html')
        return JSONResponse(status_code=200, content={"message": "email has been sent"})
    else:
        raise HTTPException(status_code=404, detail=f"Auth incorrect")


@app.get("/getAllChatClass", tags=["other"])
def getAllChatClassByChatBot():
    response = getAllChatClass()
    return JSONResponse(status_code=200, content={"result": True,  "AllChatClass": response})


@app.get("/SystemInfo", tags=["other"])
async def get_SystemInfo():
    return JSONResponse(status_code=200, content=GetCPUinfo())


@app.post("/AddOneDoctor", tags=["doctor"], response_description="Add One Doctor", response_model=CreateDoctorModel)
async def add_one_doctor(Auth: str, data: CreateDoctorModel = Body(...)):
    if(Auth == BACKEND_AUTH):
        data = jsonable_encoder(data)
        new_data = await db["doctor"].insert_one(data)
        created_data = await db["doctor"].find_one({"_id": new_data.inserted_id})
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_data)
    else:
        raise HTTPException(status_code=404, detail=f"Auth incorrect")


@app.post("/AddManyDoctor", tags=["doctor"], response_description="Add Many Doctor", response_model=CreateDoctorModel)
async def add_many_doctor(Auth: str, data: List[CreateDoctorModel] = Body(...)):
    if(Auth == BACKEND_AUTH):
        data = jsonable_encoder(data)
        new_data = await db["doctor"].insert_many(data)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={'result': True})
    else:
        raise HTTPException(status_code=404, detail=f"Auth incorrect")


@app.get("/FindDoctor", tags=["doctor"], response_description="Find Doctor", response_model=CreateDoctorModel)
async def find_doctor(current_user: UserModel = Depends(get_current_user), name: Union[str, None] = '', category: Union[str, None] = '', location: Union[str, None] = '',):
    myquery = {"name": {'$regex': '.*' + name + '.*', '$options': 'i'},
               "category": {'$regex': '.*' + category + '.*', '$options': 'i'},
               "location": {'$regex': '.*' + location + '.*', '$options': 'i'}}
    result = await db["doctor"].find(myquery).to_list(1000)
    return JSONResponse(status_code=200, content=result)


@app.get("/FindClosestDoctor", tags=["doctor"], response_description="Find Doctor", response_model=CreateDoctorModel)
async def find_closest_doctor(category: str, latitude: str, longitude: str):
    coords_1 = (latitude, longitude)
    myquery = {"category": {'$regex': '.*' + category + '.*', '$options': 'i'}}
    result = await db["doctor"].find(myquery).to_list(1000)
    coords_2 = []
    if(len(result) > 0):
        for i in result:
            coords_2.append([i["locationPoint"]["latitude"],
                            i["locationPoint"]["longitude"]])

        cal_dis = []
        for e in coords_2:
            cal_dis.append(geopy.distance.geodesic(
                coords_1, e).miles * 1609.344)

        output = result[cal_dis.index(min(cal_dis))]
        return JSONResponse(status_code=200, content=output)
    else:
        return JSONResponse(status_code=200, content=[])


@app.post("/addFeedBack", tags=["feedBack"], response_description="Add FeedBack")
async def add_FeedBack(feedBack: FeedBackModel = Body(...)):
    feedBack = jsonable_encoder(feedBack)
    new_user = await db["feedBack"].insert_one(feedBack)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={"result": True})
