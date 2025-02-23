import psutil


def GetCPUinfo():
    output = {
        "CPU COUNT": psutil.cpu_count(),
        "logical CPU COUNT": psutil.cpu_count(logical=False),
        "CPU PERCENT": str(psutil.cpu_percent(interval=1, percpu=False)) + "%",
        "RAM": str(psutil.virtual_memory().percent) + "%"
    }
    return output


if __name__ == '__main__':
    print(GetCPUinfo())
