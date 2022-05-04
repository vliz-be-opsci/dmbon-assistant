# init base image (Alpine is small Linux distro)
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9
# define the present working directory
# WORKDIR /rocrate-maker-fast-api
# copy the contents into the working dir
COPY ./app /app
COPY ./start-api-server.sh /app/start-api-server.sh 
RUN chmod +x /app/start-api-server.sh 
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt
RUN apt-get install git
# run pip install to install dependencies of the flasdk app
#RUN pip install -r requirements.txt
# define commnd to start the api webserver
# CMD [ "python","app.py"]
#ENTRYPOINT [ "./gunicorn.sh" ]
