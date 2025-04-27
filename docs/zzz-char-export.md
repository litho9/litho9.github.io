# ZZZ Export Character

This script exports the info in the Blender file in the format the model-importer expects. It doesn't export the textures and doesn't create the INI file... YET!

This is the function, with an example on how to call it:

```py
import bpy, os, numpy

def inv(vv): return -vv[0], vv[1], vv[2]

def zzz_char_export(name, objs, vb1_fmt="4u1,2f2,2f,2f2"):
    ib, vb0, vb1, vb2, index_map = [], [], [], [], {}
    for mesh in [obj.data for obj in objs]:
        print(f"; {mesh.name}\ndrawindexed = {len(mesh.loops)}, {len(ib)}, 0")
        mesh.calc_tangents()
        for loop in [mesh.loops[i + 2 - i % 3 * 2] for i in range(len(mesh.loops))]:
            h = (loop.vertex_index, *mesh.uv_layers[0].data[loop.index].uv, *loop.normal)
            if h not in index_map:
                index_map[h] = len(vb0)
                v = mesh.vertices[loop.vertex_index]
                vb0.append((inv(v.co), inv(loop.normal), inv(loop.tangent), -loop.bitangent_sign))
                vb1.append(([int(i * 255) for i in mesh.vertex_colors[0].data[loop.index].color],
                            *[tex.data[loop.index].uv for tex in mesh.uv_layers]))
                vb2.append(([v.groups[i].weight if i < len(v.groups) else .0 for i in range(4)],
                            [v.groups[i].group if i < len(v.groups) else 0 for i in range(4)]))
            ib.append(index_map[h])
    print(f"draw = {len(vb0)}, 0")

    numpy.fromiter(ib, numpy.uint16).tofile(f"{name}IB.buf")
    numpy.fromiter(vb0, "3f,3f,3f,f").tofile(f"{name}VB0.buf")
    numpy.fromiter(vb1, vb1_fmt).tofile(f"{name}VB1.buf")
    numpy.fromiter(vb2, "4f, 4i").tofile(f"{name}VB2.buf")

os.chdir(r"C:\Users\urmom\Documents\create\mod\zzmi\Mods\MyCharacterMod")
zzz_char_export("MyCharacterMod", bpy.context.selected_objects)
```

The whole thing is like 30 lines, but there's a lot of stuff in each of them.

## The formats

The main info the game needs to render a character are the vertex-buffers (VB) and the index-buffer (IB). Characters use 3 VBs (VB0, VB1, and VB2).

* VB0:
  * `3f`: three 4-byte floats, for coordinates x, y, z
  * `3f`: three 4-byte floats, for split-normals x, y, z
  * `3f`: three 4-byte floats, for tangent x, y, z
  * `f`: one 4-byte float for the bitangent sign, that's always 1 or -1
* VB1*:
  * `4u1`: four 1-byte unsigned integers, for vertex colors R, G, B and alpha
  * `2f2`: two 2-byte floats, representing the u and v of a texture map, for uorizontal and vertical
  * `2f`: two 4-byte floats, with coordinates varying from -1.0 to 1.0. It's not clear how this data is used, and as a modder you can mostly ignore it. It's close to (0.0, 0.0) for vertices of faces that make a flat surface, and the coordinates seem to represent in which direction the faces "turn". We'll call it the "Angle" UVMap.
  * `2f2`: two 2-byte floats, that form a front view of the model. It's probably used for certain shader effects. We'll call it the "Profile" UVMap.
* VB2:
  * `4f`: four 4-byte floats, for vertex weights
  * `4i`: four 4-byte integers, for vertex indices

*The `vb1_fmt` is defined as a parameter with a default value because **it can vary**. Character Faces have a different layout, and anything with "inner-textures" may have another `2f2` at the end. Fo facilitate this, I tend to include the actual formats for every model.

The VB2 specifies up to 4 slots of index-weight pairs. This is a common practice in games, as you'd probably never need more than 4 vertex groups affecting the same vertex.
For example, lets say a vertex in the shoulder is affected by 70% of the clavicle (vertex index 1), and 30% by the upper arm (vertex index 13). In the case, it's VB2 block would be `(0.7, 0.3, 0.0, 0.0), (1, 13, 0, 0)`. Zeroes are added if there are less than 4 groups.

## How does it work?

```py
import bpy, os, numpy
```
* `bpy` is how python communicates with Blender.
* `os` is how python communicates with the Operational System.
* `numpy` is the soul of this method of exporting data. It's a very fast way of dealing with binary stuff and parallel execution.

```py 
def inv(vv): return -vv[0], vv[1], vv[2]
```
The invert function. It flips the x-axis, so it appears the same in-game as it appears in blender. It is one of the main reasons I wrote this script myself.

```py
def zzz_char_export(name, objs, vb1_fmt="4u1,2f2,2f,2f2"):
    ib, vb0, vb1, vb2, index_map = [], [], [], [], {}
    for mesh in [obj.data for obj in objs]:
        print(f"; {mesh.name}\ndrawindexed = {len(mesh.loops)}, {len(ib)}, 0")
```

At the start of the function, we initialize the buffers and the index_map, the latter holding what loops have already been considered for storing (as specified in the IB-VB relation).

After that we iterate the meshes of the given MeshObjects, and start by printing the `drawindexed` line for each of them. It's printed to the System Console. If it's not opened, go to Window > Toggle System Console.
This way, all "parts" are stored in the same buffers, and you can control the `drawindexed` lines in the INI. The 'murican Navia tutorial does a good job in explaining how this approach is excellent for mod that have parts you want to toggle on and off.

```py
for loop in [mesh.loops[i+2-i%3*2] for i in range(len(mesh.loops))]:
```
This line iterates the loops. Instead of just being `for loop in mesh.loops` we have to do a little trick here. You see, if we just iterated the loops in order, the model would end up with **flipped faces**. Loops list faces corners counterclockwise, and when we invert the x-axis we make so the outside and the inside of the faces are switched.
To avoid that, this reverses every 3 loops, so instead of reading [0, 1, 2, 3, 4, 5, ...], we read [2, 1, 0, 5, 4, 3, ...].

```py
h = (loop.vertex_index, *mesh.uv_layers[0].data[loop.index].uv, *loop.normal)
if h not in index_map:
    index_map[h] = len(vb0)
```
The `h` variable will be the key for the `index_map`.
As described in the IB-VB relation, we detect here if this isn't a repeated loop data. Repeated data will be skipped.
If it's a new VB block, we store the current index (that is any VBs current length) on the map using the `h` key.

```py
v = mesh.vertices[loop.vertex_index]
vb0.append((inv(v.co), inv(loop.normal), inv(loop.tangent), -loop.bitangent_sign))
vb1.append(([int(i * 255) for i in mesh.vertex_colors[0].data[loop.index].color],
            *[tex.data[loop.index].uv for tex in mesh.uv_layers]))
vb2.append(([v.groups[i].weight if i < len(v.groups) else .0 for i in range(4)],
            [v.groups[i].group if i < len(v.groups) else 0 for i in range(4)]))
```
We append a new block in each VB, using the `inv` function for coordinates, normals and tangent.
This is just a compact piece of code to translate Blender data to the format specified in the Formats section.

One noticeable thing this does is flip the UVs vertically. This way, the textures behave the same in Blender as in-game. Just remember to flip the DDS's when using them in the mod folder.

Do NOT mess with the vertex_group orders, the game expects them in the specified order.
Do NOT mess with the UV Maps order either. Having extra or missing UVs will break the script.

```py
ib.append(index_map[h])
```
After that, we add the index to the ib. Note that this will refer to a pre-existing value if the `if` was skipped, or to the values we just appended to the VBs otherwise.

```py
print(f"draw = {len(vb0)}, 0")
```
After all the objects are processed, the script prints the `draw` line you'll need in you INI file. It's the line that looks like "draw = 16890, 0" alongside the vb0 and vb2.

XXMI has a newer version of 3DMigoto that supports a `draw = auto` at this point, so this step might be skipped. But if you want to maintain compatibility with ZZMI, you still need to pay attention to this.

```py
numpy.fromiter(ib, numpy.uint16).tofile(f"{name}IB.buf")
numpy.fromiter(vb0, "3f,3f,3f,f").tofile(f"{name}VB0.buf")
numpy.fromiter(vb1, vb1_fmt).tofile(f"{name}VB1.buf")
numpy.fromiter(vb2, "4f, 4i").tofile(f"{name}VB2.buf")
```
Lastly, we save the IB and VBs to `.buf` files. Note that the game originally uses uint16 for each index in the ib, but if your model has more than 2¹⁶ (65536) values stored in the vb0, you will need to change it to unit32 (at the cost of doubling the IB disk space).

## Usage example

```py
os.chdir(r"C:\Users\urmom\Documents\create\mod\zzmi\Mods\MyCharacterMod")
zzz_char_export("MyCharacterMod", bpy.context.selected_objects)
```
With `os.chdir` we can change the current directory we're in, so the generated files get created directly in the mod folder. This makes testing really fast, as we can run the script, hit f10, and already see any changes in game.

In this example, the function takes the selected objects listed alphabetically, but you can specify any objects in any order creating an array.

## TL;DR
Just specify the mod folder and run the script, and you `.buf` files will be created.
If it doesn't work you have two options:
* Curl in the floor and cry miserably.
* Read the damn thing. 
