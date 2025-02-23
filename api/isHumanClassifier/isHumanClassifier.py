import os
import torch
import torchvision
from PIL import Image
from torch import nn
import io

current_path = os.path.dirname(__file__) + '/'
data_folderList = ["isHuman","noHuman"]

def PredictionisHumanPictures(imageByte: bytes):
    # read image data
    image = Image.open(io.BytesIO(imageByte))
    
    #if channel less 3
    if(len(image.getbands()) < 3):
        return {"isHuman" : False, "message": "The image does not conform to the RGB format"}
    
    #if channel is 4
    if(len(image.getbands()) > 3):
        r, g, b, a = image.split()
        new_image = Image.merge('RGB', (r, g, b))
        image = new_image
    transforms = torchvision.transforms.Compose([torchvision.transforms.Resize((224, 224)),
                                                torchvision.transforms.ToTensor()])
    image = transforms(image)
    model = torch.load(current_path + "best_model_save.pth",
                       map_location=torch.device("cpu"))  # 选择训练后得到的模型文件
    image = torch.reshape(image, (1, 3, 224, 224))  # 修改待预测图片尺寸，需要与训练时一致
    model.eval()
    with torch.no_grad():
        output = model(image)
        probs = torch.softmax(output, dim=1)
        if(data_folderList[int(probs.argmax(1))] == 'isHuman'):
            returnValue =  {"isHuman" : True, "message": ""}
        else:
            returnValue =  {"isHuman" : False, "message": "Image does not contain human skin"}
    return returnValue




if __name__ == '__main__':
    with open(current_path + "example.jpg", "rb") as image:
        f = image.read()
        print(PredictionisHumanPictures(f))
