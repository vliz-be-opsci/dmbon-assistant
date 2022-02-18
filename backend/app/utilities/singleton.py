#singleton class to instanciate only one of each named class
def singleton(class_):
    instances = {}
    def getinstance(*args, **kwargs):
        print(f"getting instance with args == {args}")
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]
    return getinstance