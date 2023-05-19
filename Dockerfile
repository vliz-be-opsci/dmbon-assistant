FROM python:3.8

ARG ssh_prv_key
ARG ssh_pub_key
ARG GID_var
ARG UID_var

#create addgroup that can be used to add a group to the container with the same GID as the host user
#RUN addgroup --gid $GID_var hostgroup
#RUN adduser --disabled-password --gecos '' --uid $UID_var --gid $GID_var hostuser
#USER hostuser
# Authorize SSH Host
RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    ssh-keyscan github.com > /root/.ssh/known_hosts

# Add the keys and set permissions
RUN echo "$ssh_prv_key" > /root/.ssh/id_ed25519 && \
    echo "$ssh_pub_key" > /root/.ssh/id_ed25519.pub && \
    chmod 600 /root/.ssh/id_ed25519 && \
    chmod 600 /root/.ssh/id_ed25519.pub

#RUN chmod 664 /code/app/workspace/hostbrowserpipeline.lnk

WORKDIR /code

COPY ./backend /code

#mkfifo hostbrowserpipeline in /code/app/workspace
#RUN mkfifo /code/app/workspace/hostbrowserpipeline

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
# sudo apt-get install xdg-utils
#RUN apt-get update && apt-get install -y xdg-utils

EXPOSE 6656

CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "6656"]
