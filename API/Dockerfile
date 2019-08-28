# Dockerfile - this is a comment. Delete me if you want.
FROM python:3.6
COPY *.py /app/
COPY *.txt /app/
COPY *.h5 /app/
WORKDIR /app
RUN mkdir -p /app/data
RUN pip install -r requirements.txt
EXPOSE 5000
ENTRYPOINT ["python"]
CMD ["app.py"]