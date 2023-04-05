[out:json][timeout:25];
// gather results
(

way["building"]({{bbox}});
relation["building"]["type"="multipolygon"]({{bbox}});

way["highway"]({{bbox}});

way["natural"="water"]({{bbox}});
relation["natural"="water"]({{bbox}});

way["natural"]({{bbox}});
relation["natural"]({{bbox}});

way["landuse"]({{bbox}});
relation["landuse"]({{bbox}});

// print results
out body;

> ;
> out skel qt;
