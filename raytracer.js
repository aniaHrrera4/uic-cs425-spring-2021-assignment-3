var scene = null;
var maxDepth = 1;
var background_color = [190/255, 210/255, 215/255];
var ambientToggle = true;
var diffuseToggle = true;
var specularToggle = true;
var reflectionToggle = true;
var bias = 0.001;

class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }
}

class Intersection {
    constructor(distance, point) {
        this.distance = distance;
        this.point = point;
    }
}

class Hit {
    constructor(intersection, object) {
        this.intersection = intersection;
        this.object = object;
    }
}

/*
    Intersect objects
*/
function raySphereIntersection(ray, sphere) {
    var center = sphere.center;
    var radius = sphere.radius;

    // Compute intersection y = mx + h
    //t is the distance(so use quadratic), p is the point, 
    //e is ray.origin(so starting point), d is direction i believe so (ray.direction)
    var d = ray.direction
    var e = ray.origin;
    
    var A = dot(d,d);
    var B = dot(mult(d,2),sub(e,center));
    var C = dot(sub(e,center),sub(e,center))- Math.pow(radius, 2);
    //t distance from quadratic formula
    var discriminant = Math.pow(B, 2) - 4 * A * C;

    var t1 = (-B - Math.sqrt(discriminant))/(2*A);
    var t2 = (-B + Math.sqrt(discriminant))/(2*A);
    //add(ray.origin,mult(ray.direction,t-bias)

    // let y = new intersection(t, point);

    // If there is a intersection, return a new Intersection object with the distance and intersection point:
    // E.g., return new Intersection(t, point);

    if( discriminant>= 0){
        if(t1 >0 && t1<t2){
            var point = add(ray.origin,mult(ray.direction,t1-bias));
            return new Intersection(t1, point);

        }else if(t2 >0 && t2<t1){

            var point = add(ray.origin,mult(ray.direction,t2-bias));
            return new Intersection(t2, point);

        }
    }else{

        return null;
    }

    // If no intersection, return null
}

function rayPlaneIntersection(ray, plane) {
    var p0=plane.center;
    var d = normalize(ray.direction);
    var e = ray.origin;
    var n = plane.normal;

    // Compute intersection
    // console.log(ray);
    // console.log(plane);
    var t= dot(sub(p0,e),n) / dot(n,d);
    var point  = add(ray.origin,mult(ray.direction,t-bias));

    var denom=dot(n,d);
    //𝐧*𝐝 ≠ 0 one intersection
    // If there is a intersection, return a dictionary with the distance and intersection point:
    // E.g., return new Intersection(t, point);
    //if(Math.abs(denom) > 0.0001) 
    if( Math.abs(denom) > 0.0001){
        if(t>0){
            //
            //new Intersection(t, add(ray.origin,mult(ray.direction,t-bias)));
            return new Intersection(t, point);
        }else{
            return null;
        
        }

    }else{

        return null;
    }
    // If no intersection, return null

}

function intersectObjects(ray, depth) {
    //have to keep track of the closest intersection and sistance and object 
    var closestDist=Infinity; //values check sthe current closest distance 
    var closestObj=null;
    var closestIntersection =null;

    // Loop through all objects, compute their intersection (based on object type and calling the previous two functions)
    // Return a new Hit object, with the closest intersection and closest object
    for(var i=0; i < scene.objects.length; i++) {
        var object = scene.objects[i];
        var dist; //= rayTriangleIntersection(ray, object);
        var intersection; 

        
        
        var type = scene.objects[i].type;
        //console.log(type);

        if(type == "plane"){
            intersection = rayPlaneIntersection(ray, object);

        }else if(type == "sphere"){
            intersection = raySphereIntersection(ray, object);
            
        }

        if(intersection !=null){
            
            if(intersection.distance <closestDist){
                closestDist = intersection.distance;
                closestObj = object; 
                closestIntersection = intersection;
            }
        }
        
    
    }
    // If no hit, retur null

    if(closestObj !=null){
        return new Hit(closestIntersection,closestObj);
    }else{
        return null;
    }

}

function sphereNormal(sphere, pos) {
    // Return sphere normal
    return normalize(sub(pos,sphere.center));
}

/*
    Shade surface
*/
function shade(ray, hit, depth) {

    var object = hit.object;
    var color = [0,0,0];
    var type = object.type;
   
    
    
    // Compute object normal, based on object type
    // If sphere, use sphereNormal, if not then it's a plane, use object normal
    var normal;

    //console.log(type);

    if(type == "plane"){
        normal = normalize(object);
    }else if(type == "sphere"){
        //You are passing into shade a hit which should store a point
        normal = sphereNormal(object, hit.intersection);
    }

    //console.log(hit);

    // Loop through all lights, computing diffuse and specular components *if not in shadow*
    var diffuse = 0;
    var specular = 0;

    // kambient, kdiffuse, kspecular are the constants in the json file.
    // l is the light vector
    // n is the normal of the surface
    // h is the halfway vector (defined somewhere before that slide)
    // and alpha is the shiness factor, also in the json file
    // the L's are the light colors, you can ignore that as all lights are white
    // the results of these components multiply the object color defined in the json file
    //v is the rate of direction mutiplied -1
    //double is the length of the vector normalize

    var a =  object.specularExponent

    for(var i=0; i < scene.lights.length; i++) {
        //what is l??
        var light = scene.lights[i];
        var v = mult(ray.direction,-1);
        var l =  normalize(sub(scene.lights[i].position, hit.intersection.point));
;       var hm = normalize(add(l,v));
        // diffuse = kdiffuse(ln)
        // specular = kspecular(hn)^a
       if(isInShadow(hit, light)){
            diffuse += object.diffuseK * dot(l,normal);
            specular += (object.specularK * dot(hm,v))**a;
        }
    }

    // Combine colors, taking into account object constants
    var total =  object.ambientK + diffuse + specular ;
    var prevColor = mult(object.color,total);
    //console.log(total);
    // Handle reflection, make sure to call trace incrementing depth
    // var reflection = reflect(v,normal);
    // var newRay = new Ray(object.center, normalize(reflection));
    // var newColor = trace(newRay, depth+1);
    // color = prevColor + (newColor * object.reflectiveK);
    color =prevColor;
    return color;
}


/*
    Trace ray
*/
function trace(ray, depth) {
    if(depth > maxDepth) return background_color;
    var hit = intersectObjects(ray, depth);
    if(hit != null) {
        //If there is an intersection, trace calls shade to shade the point.

        var color = shade(ray, hit, depth);
        return color;
    }
    return null;
}

function isInShadow(hit, light) {

    // Check if there is an intersection between the hit.intersection.point point and the light
    var nray = new Ray(hit.intersection.point,normalize(sub(light.position,hit.intersection.point)));
    var intersection = intersectObjects(nray,1)
    // but you'll also want to make sure that the new intersection doesn't 
    //have the same object as the original hit
    // additionally, you want to only check if the intersection is
    // in the right direction from the current object
    // because eventually it will intersect with the plane behind the
    // object (from ray's perspective)

    // If so, return true
    // If not, return false
    if(intersection != null){
        if(intersection.intersection.distance >0){
            return true;

        }else{
            return false;
        }
    }else{
        return false;
    }

}

/*
    Render loop
*/
function render(element) {
    if(scene == null)
        return;
    
    var width = element.clientWidth;
    var height = element.clientHeight;
    element.width = width;
    element.height = height;
    scene.camera.width = width;
    scene.camera.height = height;

    var ctx = element.getContext("2d");
    var data = ctx.getImageData(0, 0, width, height);

    var eye = normalize(sub(scene.camera.direction,scene.camera.position));
    var right = normalize(cross(eye, [0,1,0]));
    var up = normalize(cross(right, eye));
    var fov = ((scene.camera.fov / 2.0) * Math.PI / 180.0);

    var halfWidth = Math.tan(fov);
    var halfHeight = (scene.camera.height / scene.camera.width) * halfWidth;
    var pixelWidth = (halfWidth * 2) / (scene.camera.width - 1);
    var pixelHeight = (halfHeight * 2) / (scene.camera.height - 1);

    for(var x=0; x < width; x++) {
        for(var y=0; y < height; y++) {
            var vx = mult(right, x*pixelWidth - halfWidth);
            var vy = mult(up, y*pixelHeight - halfHeight);
            var direction = normalize(add(add(eye,vx),vy));
            var origin = scene.camera.position;

            var ray = new Ray(origin, direction);
            var color = trace(ray, 0);
            if(color != null) {
                var index = x * 4 + y * width * 4;
                data.data[index + 0] = color[0];
                data.data[index + 1] = color[1];
                data.data[index + 2] = color[2];
                data.data[index + 3] = 255;
            }
        }
    }
    console.log("done");
    ctx.putImageData(data, 0, 0);
}

/*
    Handlers
*/
window.handleFile = function(e) {
    var reader = new FileReader();
    reader.onload = function(evt) {
        var parsed = JSON.parse(evt.target.result);
        scene = parsed;
    }
    reader.readAsText(e.files[0]);
}

window.updateMaxDepth = function() {
    maxDepth = document.querySelector("#maxDepth").value;
    var element = document.querySelector("#canvas");
    render(element);
}

window.toggleAmbient = function() {
    ambientToggle = document.querySelector("#ambient").checked;
    var element = document.querySelector("#canvas");
    render(element);
}

window.toggleDiffuse = function() {
    diffuseToggle = document.querySelector("#diffuse").checked;
    var element = document.querySelector("#canvas");
    render(element);
}

window.toggleSpecular = function() {
    specularToggle = document.querySelector("#specular").checked;
    var element = document.querySelector("#canvas");
    render(element);
}

window.toggleReflection = function() {
    reflectionToggle = document.querySelector("#reflection").checked;
    var element = document.querySelector("#canvas");
    render(element);
}

/*
    Render scene
*/
window.renderScene = function(e) {
    var element = document.querySelector("#canvas");
    render(element);
}