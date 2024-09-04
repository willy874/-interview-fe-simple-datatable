FROM python:3.11.6-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY req.txt /
RUN pip3 install -q pip --upgrade && \
    pip3 install -q -r req.txt && \
    rm req.txt

WORKDIR /app
COPY api.py /app

EXPOSE 8000