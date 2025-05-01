# INI files

3DMigoto uses “.ini” files to describe how mods should be loaded. Note that this does not follow the exact official definition of what an INI file should look like.

::: tip
The order each block appears in the file doesn't matter.
:::

::: tip
The order each param in a block appears DOES matter. For some configs it ends up behaving the same (Ex.: a `handling=skip` at the end works the same as if in the start of the block), but there's a 'sequentiality' to some params (more on the `drawindexed` topic).
:::

Instead of listing all possible configurations for the INI file, let's start with a simple use case with the most common functionality.

```ini
[TextureOverrideEllen2Hair.Blend]
hash = e91c93e0
handling = skip
vb2 = ResourceEllen2HairVB2
if DRAW_TYPE == 1
	vb0 = ResourceEllen2HairVB0
	draw = 6063, 0
endif
[TextureOverrideEllen2Hair.Texcoord]
hash = a27a8e1a
vb1 = ResourceEllen2HairVB1
[TextureOverrideEllen2Hair.VertexLimitRaise]
hash = 77ac5f85
[TextureOverrideEllen2Hair.IB]
hash = d44a8015
handling = skip
ib = ResourceEllen2HairIB
ps-t3 = ResourceEllen2Hair1D
ps-t4 = ResourceEllen2Hair2N
ps-t5 = ResourceEllen2Hair3M
ps-t6 = ResourceEllen2Hair3M
drawindexed = auto

[ResourceEllen2HairVB0]
type = Buffer
stride = 40
filename = Ellen2HairVB0.buf
[ResourceEllen2HairVB1]
type = Buffer
stride = 24
filename = Ellen2HairVB1.buf
[ResourceEllen2HairVB2]
type = Buffer
stride = 32
filename = Ellen2HairVB2.buf
[ResourceEllen2HairIB]
type = Buffer
format = DXGI_FORMAT_R16_UINT
filename = Ellen2HairIB.buf

[ResourceEllen2Hair1D]
filename = EllenLingerie1D.dds
[ResourceEllen2Hair2N]
filename = EllenLingerie2N.dds
[ResourceEllen2Hair3M]
filename = EllenLingerie3M.dds
```

Here we see two types of INI blocks: `TextureOverride` and `Resource`.

::: note
`TextureOverride` and `Resource` are "reserved terms" for 3DMigoto, as it looks for blocks with names starting with those terms to do its thing. On the other hand, what you can write on the rest of the block's name has no effect on the logic.
:::

::: tip
Use descriptive names for INI blocks. If the name ends up exactly the same as one in another mod, it will result in a conflict.
:::

### TextureOverride
Each TextureOverride block in the INI expects the in-game “hash”, that identifies what is being overridden. Despite it's name, it overrides not only textures, but also buffers and other things.
* `hash`: a 32-bit attribute (8 hexadecimal digits).
* `handling = skip`: used along TextureOverride blocks with `draw` and `drawindexed` params. It basically means "skip the original thing you to for this hash".
* `vb0`, `vb1`, `vb2`, `ib`: Overrides data with a resource.
* `if DRAW_TYPE == 1`: Yes, INI files support some logic. `if`-`endif` blocks are powerful tools. The `DRAW_TYPE == 1` will be explained... once I understand what it means. That's the thing, you don't have to understand everything from the start. Just stick to defaults, and explore what it all means little by little.
* `draw = 6063, 0`: specify a segment of the VBs to use. In this case it would be "read 6063 blocks to the GPU, starting from position 0", where 6063 is the total count of blocks.

::: tip
XXMI has a newer version of 3DMigoto that supports a `draw = auto` at this point, for the default case when you want to use the whole VB.
:::

* `ps-tX`: specify what resource to use for a particular texture slot (Ex.: `ps-t3` means "pixel shader - texture slot 3"). More on texture slots on the INI Texture Slots section.
* `draindexed`: use a portion of the IB to index what to draw. More on the [IB-VB relation](./ib-vb.md). There are two ways to use this:
  * `drawindexed = auto` to reference the whole IB.
  * `drawindexed = 5220, 16983, 0` to use just a range of the IB. In this example, it would mean "draw based on 5220 indices, starting from position 16983" (nope, I don't know what the last '0' means, it's always '0').

### Resources
Resources are what the INI use to reference all other files in your mod. They have many usages, but let's stick to referencing ".buf" buffers and ".dds" textures for now.

VB resources have a `stride` param to indicate how many bytes each block of the buffer uses. IB resources use the `format` param (it would be `DXGI_FORMAT_R32_UINT` for 32-bit indices).

## Key toggles
let's now jump to an INI example with a bit more functionality:

```ini
[Constants]
global persist $neck = 0
global $active

[KeySwapNeck]
condition = $active == 1
key = VK_UP
type = cycle
$neck = 0,1

[Present]
post $active = 0

[TextureOverrideEllenBodyBlend]
hash = b78f3616
handling = skip
vb2 = ResourceEllenBodyBlend
if DRAW_TYPE == 1
    vb0 = ResourceEllenBodyPosition
    draw = 9776,0
endif
$active = 1

[TextureOverrideEllenBodyA]
hash = e30fae03
handling = skip
ib = ResourceEllenBodyAIB
drawindexed = 31899, 0, 0
if $neck == 1
    drawindexed = 2958, 31899, 0
endif

; Resource blocks omitted
[...]
```

::: tip COMMENTS
Lines starting with ';' are comments. Any text on them is not considered for the logic.
:::

Take a moment to read the example and try to infer what it is doing. There's three new block types here.

The `Constants` block is where you declare ~~constants~~ variables. Adding `global` to the start means it can be used in other INIs. The `persist` modifier indicates the value should be persisted, meaning its current value will be remembered when you reload scripts or restart the game.

`Key` blocks describe functionality for inputs. In this example, it configures VK_UP (the 'up' key on the keyboard) to `cycle` `$neck`'s value between 0 and 1 if `$active` is 1.

The `Present` block is executed for each frame. In this case, it sets `$active` to 0 at the end of execution. If you wanted it to be before other executions, you'd want `pre` instead of `post`.

With all that out of the way, we can understand how it all works together:
* The `$active` var is set to 1 when the "Blend" block is triggered, and it's set to 0 at the end of every frame. With that, it indicates if the modded model is visible on screen.
* The "Key" os configured to work only when `$active` is 1, so the key doesn't affect the mod if the mod isn't on screen.
* Finally, the `$neck` var is used to control if one of the `drawindexed` is executed or not.

### Select what parts of a model to render
You can use multiple `drawindexed` lines on the same IB block, each corresponding to a different part of your model.
As shown in the example, we can control what part of the model is rendered using `if`s and variables.

::: note
This mechanism wasn't broadly known some time ago, so modders would use different IB and VB buffers for every combination of parts in a mod. So if you see a 396MB mod with 637 files and 75 folders (real example) know it could be much, much simpler.
:::
