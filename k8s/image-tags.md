# Image tags

## v1
`docker build -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v1 .`  

## v2
`docker build --platform linux/amd64 -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v2 .`  
-> cluster plattform

## v3
`docker build --platform linux/amd64 -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v3 .`  
-> cluster plattform

## v4
`docker build --platform linux/amd64 -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v4 .`  
-> cluster plattform

## v5
```
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_ROOT=https://jurilib.project.ris.bht-berlin.de/api/ \
  --build-arg NEXT_PUBLIC_PASSWORD_LENGTH=8 \
  --platform linux/amd64 \
  -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v5 .
  ```

## v5.1
```
docker build \    
  --build-arg NEXT_PUBLIC_BACKEND_ROOT=http://jurilib.project.ris.bht-berlin.de/api/ \ 
  --build-arg NEXT_PUBLIC_PASSWORD_LENGTH=8 \
  --platform linux/amd64 \
  -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v5.1 .
  ```
-> cluster plattform + Unterschied zu v5 in `NEXT_PUBLIC_BACKEND_ROOT`: https -> http

## v6
```
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_ROOT=http://localhost:3000/api/ \                    
  --build-arg NEXT_PUBLIC_PASSWORD_LENGTH=8 \
  --platform linux/amd64 \
  -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v6 .
  ```
  -> irrelevant, weil falsche `NEXT_PUBLIC_BACKEND_ROOT`

## v7
```
docker build \  
  --build-arg NEXT_PUBLIC_BACKEND_ROOT=http://jurilib.project.ris.bht-berlin.de/api/ \
  --build-arg NEXT_PUBLIC_PASSWORD_LENGTH=8 \
  --platform linux/arm64 \
  -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v7 .
  ```
  -> plattform local minikube