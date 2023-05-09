FROM python:3.8

WORKDIR /code

COPY ./backend /code

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

EXPOSE 6656

CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "6656"]
