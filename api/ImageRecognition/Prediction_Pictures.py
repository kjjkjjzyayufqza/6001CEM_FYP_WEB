import os
import torch
import torchvision
from PIL import Image
from torch import nn
import io

current_path = os.path.dirname(__file__) + '/'
data_folderList = []

imageSize = [256, 256]

with open(current_path + 'imageClassName.txt', 'r') as outfile:
    lines = outfile.readlines()
    lines = [line.rstrip() for line in lines]
    data_folderList = lines


def PredictionPictures(imageByte: bytes):
    # read image data
    image = Image.open(io.BytesIO(imageByte))

    # if channel less 3
    if(len(image.getbands()) < 3):
        return [["RGB ERROR",0]]

    # if channel is 4
    if(len(image.getbands()) > 3):
        r, g, b, a = image.split()
        new_image = Image.merge('RGB', (r, g, b))
        image = new_image
    transforms = torchvision.transforms.Compose([torchvision.transforms.Resize((imageSize[0], imageSize[1])),
                                                torchvision.transforms.ToTensor()])
    image = transforms(image)
    model_ft = torchvision.models.resnet18()  # 需要使用训练时的相同模型
    in_features = model_ft.fc.in_features
    model_ft.fc = nn.Linear(60, len(data_folderList))  # 此处也要与训练模型一致
    model = torch.load(current_path + "best_model_save.pth",
                       map_location=torch.device("cpu"))  # 选择训练后得到的模型文件
    # 修改待预测图片尺寸，需要与训练时一致
    image = torch.reshape(image, (1, 3, imageSize[0], imageSize[1]))
    model.eval()
    with torch.no_grad():
        output = model(image)
        probs = torch.softmax(output, dim=1)
        _, predicted = torch.max(output, dim=1)
        prob = probs[0][predicted.item()]
        _, top3_indices = probs.topk(5)
        # 求和
        total = torch.sum(probs[0])
        # 求百分比，保留两位小数
        percentages = 100 * probs[0] / total
        percentages = torch.round(percentages * 100) / 100
        # 获取最大的三个值的索引
        _, percentages_top3_indices = percentages.topk(5)
        # 获取最大的三个值
        percentages_top3_values = percentages[percentages_top3_indices]
        returnValue = [
            [data_folderList[top3_indices[0][0]],
                float(percentages_top3_values[0])],
            [data_folderList[top3_indices[0][1]],
                float(percentages_top3_values[1])],
            [data_folderList[top3_indices[0][2]],
                float(percentages_top3_values[2])],
            [data_folderList[top3_indices[0][3]],
                float(percentages_top3_values[3])],
            [data_folderList[top3_indices[0][4]],
                float(percentages_top3_values[4])],
        ]

    return returnValue


if __name__ == '__main__':
    with open(current_path + "example.jpg", "rb") as image:
        f = image.read()
        print(PredictionPictures(f))
