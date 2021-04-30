# CS425 - Computer Graphics I (Spring 2021) -Andrea Herrea (aherre57@uic.edu0)

## Assignment 3: Ray tracing
The goal of this assignment is to implement a simple ray tracer using JavaScript. You will develop an application to ray trace a scene described in an external JSON (uploaded by the user through a configuration panel). The JSON file contains camera attributes (position, fov, direction), objects in the scene (spheres or planes), as well as the position of light sources.

## Run Program
Run python -m SimpleHTTPServer or python3 -m http.server to create a http://localhost:8000/

## There are three main classes:
- `Ray`: contains the origin and direction of each ray.
- `Intersection`: contains distance to an intersection, and intersection point.
- `Hit`: contains an intersection and a reference to the object that the ray intersected with.

File `utils.js` contains some useful functions to perform dot products, multiplication of a vector by a scalar, addition, subtraction, length, as well as a function to reflect a ray considering a surface normal.

## CODE implemented

### raytracer.js

The Main functions That were updated:
- `intersectObjects` :  have to keep track of the closest intersection and distance and object, Loop through all objects, compute their intersection (based on object type and calling the previous two functions). Return a new Hit object, with the closest intersection and closest object, If no hit, return null

- `raySphereIntersection` : Compute intersection, t is the distance is computed through the quadratic formula. If there is a intersection, return a new Intersection object with the distance and intersection point: E.g., return new Intersection(t, point);

- `rayPlaneIntersection`: Compute intersection, If there is a intersection, return a dictionary with the distance and intersection point: E.g., return new Intersection(t, point);

- `sphereNormal` : Return sphere normal

- `shade` :  Compute object normal, based on object type, Combine colors, taking into account object constants

- `isInShadow`:Check if there is an intersection between the hit.intersection.point point and the light

#### JSON format

The JSON file contains a scene description, with camera information (position, fov, direction), objects (spheres and planes), and the position of light sources. Each object contains its center position, radius (for spheres), normal (for planes), specular exponent, and specular, ambient, diffuse and reflective constants.

The following is an example of a scene JSON file:

```javascript
{
    "camera": {
        "position": [0,-5,5],
        "fov": 75,
        "direction": [0,0,0]
    },
    "objects": [
        {
            "center": [0,0,0],
            "normal": [0,-1,0],
            "color": [255,255,255],
            "specularExponent": 1,
            "specularK": 0,
            "ambientK": 0.1,
            "diffuseK": 0.2,
            "reflectiveK": 0.5,
            "type": "plane"
        },
        {
            "center": [0,-1.25,0],
            "radius": 1.25,
            "color": [255,0,0],
            "specularExponent": 1000,
            "specularK": 0.1,
            "ambientK": 0.1,
            "diffuseK": 0.2,
            "reflectiveK": 0.25,
            "type": "sphere"
        }
    ],
    "lights": [
        {
            "position": [-2,-5,0]
        }
    ]
}

```

### GitHub Classroom
git is a version control system, designed to help developers track different versions of your code, synchronize them across different machines, and collaborate with others. Follow the instructions here to install git on your computer. GitHub is a website that supports git as a service. This a nice tutorial on how to get started with git and GitHub.

Use git clone to get a local copy of the newly created repository. After writing your code, you can push your modifications to the server using git commit followed by git push. For example, if your username is uic-user:

git clone git@github.com:uic-cs425/assignment-1-uic-user.git touch index.html git add index.html git commit -am "index.html file" git push
