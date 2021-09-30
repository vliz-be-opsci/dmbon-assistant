# init base image (Alpine is small Linux distro)
FROM python:3.8-alpine
# define the present working directory
WORKDIR /rocrate-maker-fast-api
# copy the contents into the working dir
ADD . /rocrate-maker-fast-api
# run pip install to install dependencies of the flasdk app
RUN pip install -r requirements.txt
# define commnd to start the api webserver
# CMD [ "python","app.py"]
ENTRYPOINT [ "./gunicorn.sh" ]