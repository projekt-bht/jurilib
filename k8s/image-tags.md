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


## v8
```
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_ROOT=http://127.0.0.1:3000 \
  --build-arg NEXT_PUBLIC_PASSWORD_LENGTH=8 \
  --platform linux/arm64 \
  -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v8 .
  ```
  -> BUGED VERSION! plattform local minikube with backend adress for port-forwarding

## v8.1
```
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_ROOT=http://127.0.0.1:3000/ \
  --build-arg NEXT_PUBLIC_PASSWORD_LENGTH=8 \
  --platform linux/arm64 \
  -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v8.1 .
  ```
  -> STILL BUGED VERSION! plattform local minikube with backend adress for port-forwarding

## v8.2
```
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_ROOT=http://127.0.0.1:3000/api/ \
  --build-arg NEXT_PUBLIC_PASSWORD_LENGTH=8 \
  --platform linux/arm64 \
  -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v8.2 .
  ```
  -> plattform local minikube with backend adress for port-forwarding  
  -> this version is supposed to work without ingress but insted use port-forwarding `kubectl port-forward deployment/jurilib 3000:3000`  
  -> the adress in the `docker build` command is the local host IP adress - this way it is reachable under http://127.0.0.1:3000

## v8.3
```
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_ROOT=http://localhost:3000/api/ \
  --build-arg NEXT_PUBLIC_PASSWORD_LENGTH=8 \
  --platform linux/arm64 \
  -t registry.bht-berlin.de/hdolzycka/cluster/jurilib:v8.3 .
  ```
  -> plattform local minikube with backend adress for port-forwarding  
  -> this version is supposed to work without ingress but insted use port-forwarding `kubectl port-forward deployment/jurilib 3000:3000`  
  -> the adress in the `docker build` command is local host and is **only** reachable under http://localhost:3000